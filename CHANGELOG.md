# Changelog

All notable changes to Oryo will be documented in this file.

## [1.2.0] - 2025-09-08

### 🔐 Authentication System
- **ADDED** Real Google OAuth authentication via Supabase
- **ADDED** Auth context provider for session management
- **ADDED** Auth callback page for OAuth flow handling
- **ADDED** Automatic session restoration from URL tokens
- **FIXED** Mobile OAuth redirect issues
- **FIXED** Supabase Site URL configuration
- **REMOVED** Skip authentication options - now required for all users

### 📊 Analytics & Tracking
- **ADDED** Vercel Analytics integration
- **ADDED** Google Analytics with gtag implementation
- **ADDED** Analytics utility for event tracking
- **ADDED** Login/logout event tracking
- **ADDED** Error tracking for authentication failures

### 🎨 UI/UX Improvements
- **UPDATED** Onboarding page to match login card style
- **FIXED** Responsive design for mobile devices
- **ADDED** Loading states for authentication
- **IMPROVED** Error handling with user-friendly messages
- **ADDED** Toast notifications for auth feedback

### 🔧 Technical Improvements
- **FIXED** TypeScript errors in toast reducer
- **ADDED** Proper error boundaries and fallbacks
- **IMPROVED** Environment variable handling
- **ADDED** Dynamic OAuth redirect URLs
- **FIXED** Session management for mobile browsers

### 🛡️ Security Enhancements
- **ENFORCED** Authentication requirement for all pages
- **ADDED** Proper auth guards on protected routes
- **IMPROVED** Token handling and cleanup
- **ADDED** Secure session restoration

### 📱 Mobile Support
- **FIXED** OAuth flow on mobile browsers
- **FIXED** URL fragment handling for mobile auth
- **IMPROVED** Responsive design across all pages
- **FIXED** Touch interactions and mobile UX

### 🚀 Deployment
- **CONFIGURED** Vercel deployment pipeline
- **ADDED** Environment variable documentation
- **FIXED** Build process and TypeScript compilation
- **OPTIMIZED** Bundle size and performance

### 📝 Documentation
- **UPDATED** README with authentication setup guide
- **ADDED** Environment variable examples
- **IMPROVED** Setup instructions for Supabase
- **ADDED** Google OAuth configuration guide

## [1.1.0] - Previous Version

### Core Features
- Multi-provider AI chat (OpenAI, Groq, Anthropic, Gemini)
- Personality modes and custom personalities
- File upload support (images, PDFs, text, JSON)
- Chat history with tagging system
- Real-time streaming responses
- Voice input support
- Export functionality (TXT, JSON)
- Search through chat history
- Keyboard shortcuts
- Drag & drop file upload
- Privacy-first API key storage

### Technical Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 + ShadCN UI + Aceternity UI
- Framer Motion animations
- Lucide React icons
- Local storage for API keys

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.
