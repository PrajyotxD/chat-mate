"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { MessageContent } from "@/components/ui/message-content";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { 
  Send, 
  Settings,
  MicIcon,
  Search,
  MessageSquare,
  Lightbulb,
  FileText,
  CheckSquare,
  Folder,
  Clock,
  ChevronLeft,
  Menu,
  Copy,
  Check,
  Download,
  Paperclip,
  X,
  Image as ImageIcon,
  Plus,
  Edit,
  Tag,
  LogOut,
  User
} from "lucide-react";

type PersonalityMode = "study" | "code" | "casual" | string;

interface CustomPersonality {
  id: string;
  name: string;
  emoji: string;
  description: string;
  prompt: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

export default function Chat() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>("casual");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    title: string;
    messages: Message[];
    date: string;
    tags: string[];
  }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customPersonalities, setCustomPersonalities] = useState<CustomPersonality[]>([]);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [newPersonality, setNewPersonality] = useState({
    name: "",
    emoji: "🤖",
    description: "",
    prompt: ""
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personalities = [
    {
      id: "study" as PersonalityMode,
      name: "Study Buddy",
      emoji: "📚",
      description: "Help with learning and understanding concepts"
    },
    {
      id: "code" as PersonalityMode,
      name: "Code Helper",
      emoji: "💻",
      description: "Assist with programming and development"
    },
    {
      id: "casual" as PersonalityMode,
      name: "Casual Chat",
      emoji: "💬",
      description: "Friendly conversation and general assistance"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Auto-save chat when messages change (with delay to avoid saving empty chats)
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => saveCurrentChat(), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  useEffect(() => {
    // Load chat history on component mount
    const savedHistory = localStorage.getItem('oryo_history');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
    
    // Load custom personalities
    const savedPersonalities = localStorage.getItem('oryo_personalities');
    if (savedPersonalities) {
      setCustomPersonalities(JSON.parse(savedPersonalities));
    }
    
    // Load available tags
    const savedTags = localStorage.getItem('oryo_tags');
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    }
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K - Start new chat
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        startNewChat();
      }
      
      // Ctrl+/ - Toggle search
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShowSearch(!showSearch);
        if (!showSearch) {
          setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            searchInput?.focus();
          }, 100);
        }
      }
      
      // Escape - Clear input, close search, or close modals
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery('');
        } else {
          setInputMessage('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  useEffect(() => {
    // Filter messages based on search query
    if (searchQuery.trim()) {
      const filtered = messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
    }
  }, [searchQuery, messages]);

  const saveCurrentChat = () => {
    if (messages.length === 0) return;
    
    const chatId = currentChatId || Date.now().toString();
    const title = messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? '...' : '');
    
    const chatData = {
      id: chatId,
      title,
      messages,
      date: new Date().toISOString(),
      tags: selectedTags
    };

    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    updatedHistory.unshift(chatData);
    
    // Keep only last 20 chats
    const limitedHistory = updatedHistory.slice(0, 20);
    
    setChatHistory(limitedHistory);
    localStorage.setItem('oryo_history', JSON.stringify(limitedHistory));
    setCurrentChatId(chatId);
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setSelectedTags(chat.tags || []);
    }
  };

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const exportChat = (format: 'txt' | 'json' = 'txt') => {
    if (messages.length === 0) {
      alert('No messages to export');
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'txt') {
      content = messages.map(msg => 
        `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.content}`
      ).join('\n\n');
      filename = `oryo-conversation-${new Date().toISOString().split('T')[0]}.txt`;
      mimeType = 'text/plain';
    } else {
      content = JSON.stringify({
        exportDate: new Date().toISOString(),
        personalityMode,
        messages
      }, null, 2);
      filename = `oryo-conversation-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    
    const allowedTypes = ['image/', 'text/', 'application/pdf', 'application/json'];
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      alert('Only images, text files, PDFs, and JSON files are supported');
      return;
    }
    
    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const createPersonality = () => {
    if (!newPersonality.name.trim() || !newPersonality.description.trim()) {
      alert('Please fill in name and description');
      return;
    }

    const personality: CustomPersonality = {
      id: Date.now().toString(),
      ...newPersonality
    };

    const updated = [...customPersonalities, personality];
    setCustomPersonalities(updated);
    localStorage.setItem('oryo_personalities', JSON.stringify(updated));
    
    setNewPersonality({ name: "", emoji: "🤖", description: "", prompt: "" });
    setShowPersonalityModal(false);
  };

  const deletePersonality = (id: string) => {
    const updated = customPersonalities.filter(p => p.id !== id);
    setCustomPersonalities(updated);
    localStorage.setItem('oryo_personalities', JSON.stringify(updated));
    
    if (personalityMode === id) {
      setPersonalityMode("casual");
    }
  };

  const addTag = () => {
    if (!newTag.trim() || availableTags.includes(newTag.trim())) return;
    
    const updated = [...availableTags, newTag.trim()];
    setAvailableTags(updated);
    localStorage.setItem('oryo_tags', JSON.stringify(updated));
    setNewTag("");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      saveCurrentChat();
    }
    setMessages([]);
    setCurrentChatId(null);
    setSelectedTags([]);
  };

  // Speech recognition disabled due to network issues
  // Will be re-enabled when deployed to production with proper HTTPS

  const toggleVoiceRecording = () => {
    alert('Voice input is currently unavailable. This feature requires:\n\n• HTTPS connection\n• Microphone permissions\n• Stable internet connection\n\nPlease type your message instead.');
  };

  const sendVoiceMessage = async (voiceText: string) => {
    if (!voiceText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: voiceText,
      sender: "user",
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const apiKey = localStorage.getItem("oryo_api_key");
      const provider = localStorage.getItem("oryo_provider");
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
          "x-provider": provider || ""
        },
        body: JSON.stringify({
          message: voiceText,
          personality: personalityMode,
          history: messages.slice(-10)
        })
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't process your request.",
        sender: "ai",
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your request.",
        sender: "ai",
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !uploadedFile) return;

    let fileData = null;
    if (uploadedFile) {
      const fileUrl = URL.createObjectURL(uploadedFile);
      fileData = {
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size,
        url: fileUrl
      };
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage || `Uploaded file: ${uploadedFile?.name}`,
      sender: "user",
      timestamp: new Date(),
      file: fileData || undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setUploadedFile(null);
    setIsTyping(true);

    // Create placeholder AI message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      sender: "ai",
      timestamp: new Date()
    };

    const messagesWithPlaceholder = [...newMessages, aiMessage];
    setMessages(messagesWithPlaceholder);

    try {
      const apiKey = localStorage.getItem("oryo_api_key");
      const provider = localStorage.getItem("oryo_provider");
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
          "x-provider": provider || ""
        },
        body: JSON.stringify({
          message: inputMessage,
          personality: personalityMode,
          history: messages.slice(-10)
        })
      });

      const data = await response.json();
      const fullResponse = data.response || "Sorry, I couldn't process your request.";
      
      // Simulate streaming by revealing text gradually
      let currentText = "";
      const words = fullResponse.split(" ");
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? " " : "") + words[i];
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: currentText }
            : msg
        ));
        
        // Add delay between words for streaming effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
    } catch (error) {
      const errorMessage = "Sorry, I couldn't process your request.";
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: errorMessage }
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Ctrl+Enter - Send message
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
    // Regular Enter - Send message (unless Shift is held for new line)
    else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Oryo</h1>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* User Profile */}
        {!sidebarCollapsed && user && (
          <div className="px-4 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-400 p-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <nav className="flex-1 px-4 py-2">
          <div className="space-y-2">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <Search className="w-5 h-5" />
              {!sidebarCollapsed && <span>Search</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <MessageSquare className="w-5 h-5" />
              {!sidebarCollapsed && <span>Ask</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <MicIcon className="w-5 h-5" />
              {!sidebarCollapsed && <span>Voice</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <Lightbulb className="w-5 h-5" />
              {!sidebarCollapsed && <span>Imagine</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <FileText className="w-5 h-5" />
              {!sidebarCollapsed && <span>Files</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <CheckSquare className="w-5 h-5" />
              {!sidebarCollapsed && <span>Tasks</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <Folder className="w-5 h-5" />
              {!sidebarCollapsed && <span>Projects</span>}
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <Clock className="w-5 h-5" />
              {!sidebarCollapsed && <span>History</span>}
            </div>
          </div>
        </nav>

        {!sidebarCollapsed && (
          <>
            {/* Personality Modes */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-400">MODE</h3>
                <button
                  onClick={() => setShowPersonalityModal(true)}
                  className="text-xs text-gray-400 hover:text-white p-1 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {personalities.map((personality) => (
                  <button
                    key={personality.id}
                    onClick={() => setPersonalityMode(personality.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      personalityMode === personality.id
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <span className="mr-2">{personality.emoji}</span>
                    {personality.name}
                  </button>
                ))}
                {customPersonalities.map((personality) => (
                  <div key={personality.id} className="flex items-center group">
                    <button
                      onClick={() => setPersonalityMode(personality.id)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        personalityMode === personality.id
                          ? "bg-gray-800 text-white"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                    >
                      <span className="mr-2">{personality.emoji}</span>
                      {personality.name}
                    </button>
                    <button
                      onClick={() => deletePersonality(personality.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat History */}
            <div className="p-4 border-t border-gray-700 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-400">HISTORY</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setShowTagModal(true)}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  >
                    <Tag className="w-3 h-3" />
                  </button>
                  <button
                    onClick={startNewChat}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  >
                    New Chat
                  </button>
                </div>
              </div>
              
              {/* Current Chat Tags */}
              {selectedTags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-800 ${
                      currentChatId === chat.id ? "bg-gray-800 text-white" : "text-gray-300"
                    }`}
                  >
                    <div className="truncate">{chat.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500">
                        {new Date(chat.date).toLocaleDateString()}
                      </div>
                      {chat.tags && chat.tags.length > 0 && (
                        <div className="flex gap-1">
                          {chat.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-600 text-gray-300 px-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {chat.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{chat.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Oryo</span>
              {showSearch && (
                <div className="flex items-center gap-2">
                  <Input
                    id="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-64 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                  />
                  {searchQuery && (
                    <span className="text-xs text-gray-400">
                      {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-lg transition-colors ${
                  showSearch ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>
              {messages.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <button
                      onClick={() => exportChat('txt')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-600 rounded-t-lg"
                    >
                      Export as Text
                    </button>
                    <button
                      onClick={() => exportChat('json')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-600 rounded-b-lg"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
              <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          className="flex-1 flex flex-col min-h-0 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-blue-600 bg-opacity-20 border-2 border-dashed border-blue-400 flex items-center justify-center z-50">
              <div className="text-center">
                <Paperclip className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-400 text-lg font-semibold">Drop file here to upload</p>
                <p className="text-blue-300 text-sm">Images, text files, PDFs, and JSON supported</p>
              </div>
            </div>
          )}
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-white">Oryo</h1>
                <p className="text-gray-400 text-lg">What do you want to know?</p>
              </div>
              
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isRecording ? "🎤 Listening..." : "What do you want to know?"}
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-6 py-4 pr-16 text-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    disabled={isTyping}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={toggleVoiceRecording}
                      className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <MicIcon className="w-4 h-4 text-gray-300" />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {showSearch && searchQuery && filteredMessages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    No messages found for "{searchQuery}"
                  </div>
                ) : (
                  <AnimatePresence>
                    {(showSearch && searchQuery ? filteredMessages : messages).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex mb-4 group ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                        <div className={`relative rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white ml-auto"
                            : "bg-gray-700 text-white"
                        }`}>
                          {message.file && (
                            <div className="mb-2 p-2 bg-black bg-opacity-20 rounded-lg">
                              <div className="flex items-center gap-2">
                                {message.file.type.startsWith('image/') ? (
                                  <ImageIcon className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                                <span className="text-sm">{message.file.name}</span>
                                <span className="text-xs opacity-70">
                                  ({(message.file.size / 1024).toFixed(1)}KB)
                                </span>
                              </div>
                              {message.file.type.startsWith('image/') && (
                                <img 
                                  src={message.file.url} 
                                  alt={message.file.name}
                                  className="mt-2 max-w-full h-auto rounded max-h-48 object-contain"
                                />
                              )}
                            </div>
                          )}
                          <MessageContent content={message.content} />
                          <button
                            onClick={() => copyMessage(message.id, message.content)}
                            className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                              message.sender === "user" 
                                ? "bg-blue-700 hover:bg-blue-800" 
                                : "bg-gray-600 hover:bg-gray-500"
                            }`}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-300" />
                            )}
                          </button>
                        </div>
                        <div className={`mt-1 text-xs text-gray-500 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className={`flex-shrink-0 ${
                        message.sender === "user" ? "order-1 mr-3" : "order-2 ml-3"
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === "user" 
                            ? "bg-blue-600" 
                            : "bg-green-600"
                        }`}>
                          <span className="text-white text-sm font-semibold">
                            {message.sender === "user" ? "U" : "AI"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {!showSearch && isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="max-w-[70%]">
                      <div className="bg-gray-700 text-white rounded-2xl px-4 py-3">
                        <TypingIndicator />
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">AI</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Fixed Input Area */}
              <div className="border-t border-gray-700 bg-gray-800 p-4 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  {uploadedFile && (
                    <div className="mb-3 p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {uploadedFile.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 text-blue-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-sm text-white">{uploadedFile.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(uploadedFile.size / 1024).toFixed(1)}KB)
                        </span>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isRecording ? "🎤 Listening..." : "What do you want to know?"}
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-6 py-4 pr-20 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                      disabled={isTyping}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        accept="image/*,text/*,.pdf,.json"
                      />
                      <label
                        htmlFor="file-upload"
                        className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-4 h-4 text-gray-300" />
                      </label>
                      <button
                        onClick={toggleVoiceRecording}
                        className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <MicIcon className="w-4 h-4 text-gray-300" />
                      </button>
                      <button
                        onClick={sendMessage}
                        disabled={(!inputMessage.trim() && !uploadedFile) || isTyping}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Personality Modal */}
      {showPersonalityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h2 className="text-xl font-bold text-white mb-4">Create Custom Personality</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <Input
                  value={newPersonality.name}
                  onChange={(e) => setNewPersonality({...newPersonality, name: e.target.value})}
                  placeholder="e.g., Creative Writer"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Emoji</label>
                <Input
                  value={newPersonality.emoji}
                  onChange={(e) => setNewPersonality({...newPersonality, emoji: e.target.value})}
                  placeholder="🤖"
                  className="bg-gray-700 border-gray-600 text-white"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <Input
                  value={newPersonality.description}
                  onChange={(e) => setNewPersonality({...newPersonality, description: e.target.value})}
                  placeholder="Brief description of this personality"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Custom Prompt (Optional)</label>
                <textarea
                  value={newPersonality.prompt}
                  onChange={(e) => setNewPersonality({...newPersonality, prompt: e.target.value})}
                  placeholder="System prompt to define AI behavior..."
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={createPersonality}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowPersonalityModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Management Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h2 className="text-xl font-bold text-white mb-4">Manage Tags</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Add New Tag</label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag name"
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Available Tags</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Selected Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTagModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
