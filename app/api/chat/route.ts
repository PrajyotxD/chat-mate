import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, personality, history } = await request.json();
    
    const apiKey = request.headers.get('x-api-key');
    const provider = request.headers.get('x-provider');
    
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('Provider:', provider);
    
    if (!apiKey || !provider) {
      return NextResponse.json(
        { error: 'API key and provider are required' },
        { status: 400 }
      );
    }

    const systemPrompts = {
      study: `You are Study Buddy, an enthusiastic AI tutor. ALWAYS respond with this personality:
- Use encouraging language like "Great question!", "Let's explore this together!", "You're on the right track!"
- Break every explanation into numbered steps or bullet points
- Include analogies and real-world examples in your responses
- End responses with follow-up questions to check understanding
- Use emojis occasionally to make learning fun (📚, 💡, ✨)
- Never give direct answers - guide users to discover solutions
- Celebrate small wins and progress in learning`,

      code: `You are Code Helper, a pragmatic programming mentor. ALWAYS respond with this personality:
- Start with the most efficient solution, then explain alternatives
- Include working code examples with clear comments
- Explain the "why" behind every coding decision
- Point out potential issues, edge cases, and best practices
- Use technical terminology correctly but explain complex concepts
- Structure responses: Problem → Solution → Explanation → Best Practices
- Be direct and concise - no fluff, just practical guidance`,

      casual: `You are Casual Chat, a friendly conversational companion. ALWAYS respond with this personality:
- Use natural, conversational language like you're talking to a friend
- Show genuine interest with phrases like "That's interesting!", "I'd love to hear more about..."
- Share relatable thoughts and ask engaging follow-up questions
- Use humor appropriately and be empathetic to user's mood
- Adapt your energy level to match the user's tone
- Make conversations feel personal and meaningful
- Remember context from earlier in the conversation`
    };

    const systemPrompt = systemPrompts[personality as keyof typeof systemPrompts] || systemPrompts.casual;

    let response;
    
    try {
      switch (provider) {
        case 'openai':
          response = await callOpenAI(message, systemPrompt, apiKey, history);
          break;
        case 'anthropic':
          response = await callAnthropic(message, systemPrompt, apiKey, history);
          break;
        case 'groq':
          response = await callGroq(message, systemPrompt, apiKey, history);
          break;
        case 'gemini':
          response = await callGemini(message, systemPrompt, apiKey, history);
          break;
        default:
          return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
      }
    } catch (apiError) {
      console.error('API call error:', apiError);
      return NextResponse.json({ error: 'Sorry, I couldn\'t process your request.' }, { status: 500 });
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Sorry, I couldn\'t process your request.' },
      { status: 500 }
    );
  }
}

async function callOpenAI(message: string, systemPrompt: string, apiKey: string, history: any[]) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(message: string, systemPrompt: string, apiKey: string, history: any[]) {
  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    }),
  });
  
  const data = await response.json();
  return data.content[0].text;
}

async function callGroq(message: string, systemPrompt: string, apiKey: string, history: any[]) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({ 
      role: h.sender === 'user' ? 'user' : 'assistant', 
      content: h.content 
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('Groq API error response:', errorData);
    throw new Error(`Groq API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid Groq API response');
  }
  
  return data.choices[0].message.content;
}

async function callGemini(message: string, systemPrompt: string, apiKey: string, history: any[]) {
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt + '\n\n' + message }] }
  ];

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    }),
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
