import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    // Redirect to Google OAuth
    const redirectUri = `http://localhost:3000/api/auth/google`;
    const googleAuthUrl = `https://accounts.google.com/oauth2/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid email profile`;
    return NextResponse.redirect(googleAuthUrl);
  }

  try {
    const redirectUri = `http://localhost:3000/api/auth/google`;
    
    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userData = await userResponse.json();

    // Redirect to frontend with user data
    const callbackUrl = `http://localhost:3000/auth/callback`;
    const redirectUrl = new URL(callbackUrl);
    redirectUrl.searchParams.set('user', JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.picture,
      provider: 'google'
    }));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    const errorUrl = `http://localhost:3000/login?error=auth_failed`;
    return NextResponse.redirect(errorUrl);
  }
}
