# Oryo Production

A modern AI chat web application built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, ShadCN UI, and Aceternity UI components.

## Features

- **Landing Page**: Glowing logo, animated loader, hero section with AuroraBackground
- **Onboarding**: Provider selection (OpenAI, Groq, Anthropic, Gemini) with glassmorphic API key input
- **Chat Interface**: Personality modes (Study Buddy, Code Helper, Casual Chat) with real-time messaging
- **Dark Theme**: Futuristic design with neon green accents and glassmorphism
- **Privacy First**: API keys stored locally, never sent to servers

## Tech Stack

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **ShadCN UI** + **Radix UI** primitives
- **Aceternity UI** (AuroraBackground + GlowingEffect)
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up OAuth (Optional):**
   - Copy `.env.example` to `.env.local`
   - Set up Google OAuth at [Google Cloud Console](https://console.cloud.google.com/)
   - Set up GitHub OAuth at [GitHub Developer Settings](https://github.com/settings/developers)
   - Add your OAuth credentials to `.env.local`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Landing Page**: Click "Get Started" to begin setup
2. **Onboarding**: Select your AI provider and enter your API key
3. **Chat**: Choose a personality mode and start chatting with your AI

## API Integration

The app includes mock API endpoints. To integrate with real AI services:

1. Update `/app/api/chat/route.ts` with actual API calls
2. Implement proper API key validation in `/app/api/validate-key/route.ts`
3. Add error handling and rate limiting as needed

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── validate-key/route.ts
│   ├── chat/page.tsx
│   ├── onboarding/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/
│   ├── aurora-background.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── glowing-effect.tsx
│   ├── input.tsx
│   ├── loader.tsx
│   └── typing-indicator.tsx
├── lib/
│   └── utils.ts
└── package.json
```

## Customization

- **Colors**: Modify neon colors in `tailwind.config.ts`
- **Animations**: Adjust Framer Motion settings in components
- **Personalities**: Add new modes in `/app/chat/page.tsx`
- **Providers**: Add new AI providers in `/app/onboarding/page.tsx`

## License

MIT License
