# Security Guidelines

## 🔐 API Key Management

### ✅ What We Do Right
- **Client-Side Storage**: All AI provider API keys are stored in browser localStorage
- **No Server Storage**: API keys never touch our servers or database
- **No Environment Variables**: AI keys are NOT stored in .env files
- **User Control**: Users manage their own API keys

### 🚫 What NOT to Do
- Never commit API keys to GitHub
- Never store API keys in environment variables for AI providers
- Never share API keys in issues or discussions

### 🛡️ How It Works
1. Users enter API keys during onboarding
2. Keys are stored locally in browser: `localStorage.setItem('oryo_api_key', key)`
3. Keys are sent directly to AI providers (OpenAI, Groq, etc.)
4. We never see or store the keys

### 🔧 Environment Setup

#### For Developers
```bash
# 1. Copy the example file
cp .env.example .env.local

# 2. Add only Supabase credentials (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

#### For Users
- No setup needed
- Add API keys through the app interface
- Keys stay in your browser only

### 🚀 Deployment Security

#### Vercel Environment Variables
Only add these to Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Never Add to Vercel
- OpenAI API keys
- Groq API keys  
- Anthropic API keys
- Gemini API keys

### 📝 Reporting Security Issues
If you find a security vulnerability, please email: [your-email]

### 🔍 Security Checklist
- [ ] .env files are in .gitignore
- [ ] No API keys in code
- [ ] No API keys in commits
- [ ] Environment variables only for public config
- [ ] User API keys stored client-side only
