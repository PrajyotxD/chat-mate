import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, provider } = await request.json();
    
    if (!apiKey || !provider) {
      return NextResponse.json(
        { valid: false, error: 'API key and provider are required' },
        { status: 400 }
      );
    }

    const isValid = await validateApiKey(apiKey, provider);
    
    if (!isValid) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid API key'
      });
    }

    return NextResponse.json({
      valid: true,
      provider,
      message: 'API key validated successfully'
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Invalid API key' },
      { status: 500 }
    );
  }
}

async function validateApiKey(apiKey: string, provider: string): Promise<boolean> {
  try {
    switch (provider) {
      case 'openai':
        return await validateOpenAI(apiKey);
      case 'anthropic':
        return await validateAnthropic(apiKey);
      case 'groq':
        return await validateGroq(apiKey);
      case 'gemini':
        return await validateGemini(apiKey);
      default:
        return false;
    }
  } catch {
    return false;
  }
}

async function validateOpenAI(apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  return response.ok;
}

async function validateAnthropic(apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }]
    })
  });
  return response.status !== 401;
}

async function validateGroq(apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  return response.ok;
}

async function validateGemini(apiKey: string): Promise<boolean> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  return response.ok;
}
