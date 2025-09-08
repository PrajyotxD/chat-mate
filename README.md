# Oryo

A modern AI chat application supporting multiple AI providers with personality modes and advanced features.

## Features

- **Multiple AI Providers**: OpenAI, Groq, Anthropic, Gemini support
- **Personality Modes**: Study Buddy, Code Helper, Casual Chat + custom personalities
- **File Upload**: Support for images, text files, PDFs, and JSON
- **Chat History**: Persistent chat storage with tagging system
- **Real-time Streaming**: Live AI response streaming
- **Voice Input**: Speech-to-text support (HTTPS required)
- **Export Options**: Export chats as TXT or JSON
- **Search**: Search through chat history
- **Keyboard Shortcuts**: Ctrl+K (new chat), Ctrl+/ (search), Ctrl+Enter (send)
- **Drag & Drop**: File upload via drag and drop
- **Privacy First**: API keys stored locally, never sent to servers

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + ShadCN UI + Aceternity UI
- Framer Motion + Lucide React
- Supabase (optional authentication)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/PrajyotxD/oryo.git
cd oryo

# Install dependencies
npm install

# Copy environment template (optional - only for Supabase auth)
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Security & API Keys

**Important**: This app uses a secure, privacy-first approach:

- ✅ **Your API keys stay in your browser** - never sent to our servers
- ✅ **No server-side storage** - we never see your keys
- ✅ **Direct communication** - your keys go straight to AI providers
- ❌ **Never commit API keys** - they're not in environment variables

### Setup
1. Run the app locally or visit the deployed version
2. Sign in with Google (optional) or skip authentication
3. Go through onboarding to add your API keys
4. Keys are stored securely in your browser's localStorage

See [SECURITY.md](./SECURITY.md) for detailed security information.

## Environment Variables

### Required for Google Authentication (Optional)

1. **Create Supabase Project**:
   - Go to https://supabase.com/dashboard
   - Create a new project
   - Go to Settings → API
   - Copy your Project URL and anon public key

2. **Configure Google OAuth**:
   - In Supabase dashboard: Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-domain.com/auth/callback`

3. **Environment Variables**:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Vercel Deployment
Add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note**: The app works without authentication - users can skip sign-in and go directly to onboarding.

## Contributing

We welcome contributions! Please feel free to:

- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation
- Add new AI provider integrations

**Security Note**: Never include API keys in pull requests or issues.

## License

MIT License
