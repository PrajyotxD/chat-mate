# Oryo - Changelog

## Version 1.0.0 - Complete Rebrand & Launch

### 🎯 Project Rebrand
- **Renamed** from ChatMate to **Oryo**
- Updated all branding, logos, and references
- Changed project folder name to `oryo`
- Updated GitHub repository: https://github.com/PrajyotxD/oryo
- Deployed to Vercel: https://oryo.vercel.app

### 🎨 UI/UX Improvements
- **Landing Page Redesign**
  - Removed "View Comet Demo" button
  - Updated feature cards to match login page style
  - Added Aurora background with animations
  - Responsive design for all screen sizes
  - Clean, modern card layout with backdrop blur

- **Login Page**
  - Streamlined Google OAuth integration
  - Glass morphism design with backdrop blur
  - Consistent styling with landing page

- **Chat Interface**
  - Modern sidebar with user profile
  - Real-time typing indicators
  - File upload with drag & drop support
  - Export functionality (TXT/JSON)
  - Search through chat history
  - Personality mode switching

### 🔧 Technical Updates
- **Framework**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + ShadCN UI + Aceternity UI
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library
- **Authentication**: Supabase (optional)

### 🚀 Features Added
- **Multiple AI Providers**: OpenAI, Groq, Anthropic, Gemini
- **Personality Modes**: Study Buddy, Code Helper, Casual Chat + custom
- **File Support**: Images, text files, PDFs, JSON
- **Chat Management**: History, tagging, search, export
- **Voice Input**: Speech-to-text (HTTPS required)
- **Keyboard Shortcuts**: 
  - Ctrl+K (new chat)
  - Ctrl+/ (search)
  - Ctrl+Enter (send)
- **Privacy First**: API keys stored locally

### 🔄 Data Migration
- Updated localStorage keys from `chatmate_*` to `oryo_*`
- Export filenames changed to `oryo-conversation-*`
- Maintained backward compatibility for existing users

### 🛠️ Development Setup
```bash
npm install
npm run dev
```

### 📦 Deployment
- **Platform**: Vercel
- **Auto-deployment**: Connected to GitHub master branch
- **Environment**: Production ready with optimizations

### 🎯 Next Steps
- Add Supabase environment variables for authentication
- Implement additional AI provider integrations
- Add more personality modes
- Enhance file processing capabilities

---

**Live URL**: https://oryo.vercel.app  
**Repository**: https://github.com/PrajyotxD/oryo  
**License**: MIT
