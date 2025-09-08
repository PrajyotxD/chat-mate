# ChatMate Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Message Copy Buttons**: Added copy functionality to all messages with hover effect
  - Copy button appears on hover for both user and AI messages
  - Visual feedback with checkmark icon when copied successfully
  - Automatic timeout to reset copy state after 2 seconds
  - Uses native clipboard API for reliable copying
- **Keyboard Shortcuts**: Implemented essential keyboard shortcuts for improved UX
  - `Ctrl+K` - Start new chat (clears current conversation)
  - `Ctrl+/` - Toggle search functionality
  - `Ctrl+Enter` - Send message (alternative to Enter)
  - `Escape` - Clear input field or close search
  - `Enter` - Send message (unless Shift is held for new line)
- **Export Functionality**: Added conversation export capabilities
  - Export as Text (.txt) - Human-readable format with timestamps
  - Export as JSON (.json) - Structured data with metadata
  - Export button appears in top bar when messages exist
  - Dropdown menu for format selection
  - Automatic filename generation with date
- **Message Search**: Implemented real-time message filtering
  - Toggle search with button or Ctrl+/ shortcut
  - Real-time filtering as you type
  - Case-insensitive search across all message content
  - Results counter showing number of matches
  - Search input auto-focus when opened
  - Clear search with Escape key
- **Streaming Responses**: Added ChatGPT-like streaming text effect
  - AI responses appear word by word for better engagement
  - Smooth typing animation with 50ms delay between words
  - Maintains existing typing indicator during initial processing
  - Placeholder message created immediately for streaming
  - Enhanced user experience with real-time response building
- **File Upload Support**: Added drag & drop file functionality
  - Drag & drop files directly into chat area
  - File upload button with paperclip icon
  - Support for images, text files, PDFs, and JSON
  - 10MB file size limit with validation
  - File preview for images in messages
  - File metadata display (name, size)
  - Visual drag overlay with instructions
  - File removal option before sending
- **Custom Personalities**: Added ability to create custom AI personas
  - Create custom personalities with name, emoji, and description
  - Optional custom system prompts for specific AI behavior
  - Persistent storage in localStorage
  - Delete custom personalities with confirmation
  - Plus button in personality section for easy access
  - Modal interface for personality creation
  - Automatic fallback to default personality when deleted
- **Chat Organization**: Added tagging system for conversation management
  - Create and manage custom tags for conversations
  - Tag conversations during chat or retroactively
  - Visual tag display in chat history with truncation
  - Tag selection modal with toggle functionality
  - Current chat tags displayed in sidebar
  - Persistent tag storage across sessions
  - Tag button in history section for easy access
- **Authentication System**: Added Google sign-in option
  - Real OAuth authentication with Google provider
  - OAuth API route for secure token exchange
  - User profile display in chat sidebar with avatar
  - Logout functionality with session management
  - Protected routes with authentication checks
  - User data persistence in localStorage
  - Automatic redirection based on auth state
  - Login page with branded design and AuroraBackground
  - Authentication context for global state management
  - Clean glassmorphism login card with subtle transparency
  - Minimal design without colors or animations
  - Auth callback page for OAuth flow completion
  - Working Google Cloud Console OAuth integration
- Initial changelog creation to track all future implementations

### Changed

### Deprecated

### Removed

### Fixed
- OAuth redirect URI handling - now uses dynamic URLs instead of hardcoded environment variables
- Google and GitHub OAuth flow URL construction for proper authentication

### Security

---

## Implementation Progress

Based on function.md roadmap, the following features are planned for implementation:

### Phase 1 (Quick Wins) - Priority Features ✅ **ALL COMPLETED**
- [x] Message copy buttons ✅ **COMPLETED**
- [x] Keyboard shortcuts (Ctrl+K, Ctrl+/, Ctrl+Enter, Esc) ✅ **COMPLETED**
- [x] Export functionality (PDF/text) ✅ **COMPLETED**
- [x] Message search with filters ✅ **COMPLETED**

### Phase 2 (UX Improvements) ✅ **ALL COMPLETED**
- [x] Streaming responses with typing indicators ✅ **COMPLETED**
- [x] File upload support (drag & drop) ✅ **COMPLETED**
- [x] Custom personalities creation ✅ **COMPLETED**
- [x] Chat organization (folders/tags) ✅ **COMPLETED**

### Phase 3 (Advanced Features) - Started
- [x] Authentication system (Google/GitHub) ✅ **COMPLETED**
- [ ] PWA implementation
- [ ] Voice features (TTS, voice commands)
- [ ] Multi-language support

### Phase 4 (Analytics & Optimization)
- [ ] Usage analytics dashboard
- [ ] Performance optimizations
- [ ] Plugin system architecture
- [ ] Advanced security features

---

*Last updated: 2025-09-07*
