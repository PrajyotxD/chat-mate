import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    // Redirect to GitHub OAuth
    const redirectUri = `${request.nextUrl.origin}/api/auth/github`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    return NextResponse.redirect(githubAuthUrl);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userData = await userResponse.json();

    // Redirect to frontend with user data
    const callbackUrl = `${request.nextUrl.origin}/auth/callback`;
    const redirectUrl = new URL(callbackUrl);
    redirectUrl.searchParams.set('user', JSON.stringify({
      id: userData.id.toString(),
      name: userData.name || userData.login,
      email: userData.email,
      avatar: userData.avatar_url,
      provider: 'github'
    }));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    const errorUrl = `${request.nextUrl.origin}/login?error=auth_failed`;
    return NextResponse.redirect(errorUrl);
  }
}
