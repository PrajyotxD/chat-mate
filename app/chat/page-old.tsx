"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CometCard } from "@/components/ui/comet-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageContent } from "@/components/ui/message-content";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { 
  Send, 
  Mic, 
  BookOpen, 
  Code, 
  MessageCircle, 
  Settings,
  MicIcon,
  Search,
  MessageSquare,
  Lightbulb,
  FileText,
  CheckSquare,
  Folder,
  Clock
} from "lucide-react";

type PersonalityMode = "study" | "code" | "casual";
type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>("casual");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personalities = [
    {
      id: "study" as PersonalityMode,
      name: "Study Buddy",
      icon: <BookOpen className="w-5 h-5" />,
      emoji: "📚",
      description: "Academic help and learning support"
    },
    {
      id: "code" as PersonalityMode,
      name: "Code Helper",
      icon: <Code className="w-5 h-5" />,
      emoji: "💻",
      description: "Programming assistance and debugging"
    },
    {
      id: "casual" as PersonalityMode,
      name: "Casual Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      emoji: "💬",
      description: "Friendly conversation and general help"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem("oryo_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem("oryo_messages", JSON.stringify(newMessages));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
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
          message: inputMessage,
          personality: personalityMode,
          history: messages.slice(-10) // Send last 10 messages for context
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
      saveMessages(finalMessages);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request. Please check your API key and try again.",
        sender: "ai",
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-80 glass-dark border-r border-white/10 p-6"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            ChatMate
          </h1>
          <p className="text-sm text-muted-foreground">Choose your AI personality</p>
        </div>

        <div className="space-y-4">
          {personalities.map((personality) => (
            <div 
              key={personality.id}
              className={`cursor-pointer transition-all duration-300 p-4 rounded-2xl ${
                personalityMode === personality.id
                  ? "border border-white"
                  : "hover:border-white/20"
              }`}
              onClick={() => setPersonalityMode(personality.id)}
            >
              <CometCard>
                <div className="flex items-center gap-3 rounded-2xl p-4">
                  <span className="text-2xl">{personality.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{personality.name}</h3>
                    <p className="text-xs text-muted-foreground">{personality.description}</p>
                  </div>
                </div>
              </CometCard>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-800">
        {/* Chat Header */}
        <div className="border-b border-gray-700 p-4 bg-gray-800">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AI</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {personalities.find(p => p.id === personalityMode)?.name}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <span className="text-white text-lg font-semibold">AI</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                How can I help you today?
              </h3>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`border-b border-gray-700 ${
                  message.sender === "ai" ? "bg-gray-750" : "bg-gray-800"
                }`}
              >
                <div className="max-w-4xl mx-auto p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user" 
                          ? "bg-blue-500" 
                          : "bg-green-500"
                      }`}>
                        <span className="text-white text-sm font-semibold">
                          {message.sender === "user" ? "U" : "AI"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-invert max-w-none">
                        <MessageContent content={message.content} />
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-750 border-b border-gray-700"
            >
              <div className="max-w-4xl mx-auto p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">AI</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-800 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message ChatMate..."
                className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
