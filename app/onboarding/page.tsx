"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CometCard } from "@/components/ui/comet-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";

type Provider = "openai" | "groq" | "anthropic" | "gemini";

export default function Onboarding() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const providers = [
    {
      id: "openai" as Provider,
      name: "OpenAI",
      description: "GPT-4, GPT-3.5 Turbo",
      color: "from-green-400 to-blue-500"
    },
    {
      id: "groq" as Provider,
      name: "Groq",
      description: "Lightning fast inference",
      color: "from-orange-400 to-red-500"
    },
    {
      id: "anthropic" as Provider,
      name: "Anthropic",
      description: "Claude 3 models",
      color: "from-purple-400 to-pink-500"
    },
    {
      id: "gemini" as Provider,
      name: "Gemini",
      description: "Google's AI models",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  const handleSaveAndContinue = async () => {
    if (!selectedProvider || !apiKey) return;
    
    setIsValidating(true);
    setValidationError("");
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, provider: selectedProvider })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        localStorage.setItem("chatmate_provider", selectedProvider);
        localStorage.setItem("chatmate_api_key", apiKey);
        router.push("/chat");
      } else {
        setValidationError(data.error || "Invalid API key");
      }
    } catch (error) {
      setValidationError("Failed to validate API key");
    } finally {
      setIsValidating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <AuroraBackground>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Setup Oryo
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose your AI provider and enter your API key to get started
            </p>
          </div>

          {/* Provider Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Select AI Provider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {providers.map((provider) => (
                <div 
                  key={provider.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedProvider === provider.id
                      ? "border border-white"
                      : "hover:border-white/20"
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <CometCard>
                    <div className="text-center p-6 rounded-2xl">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${provider.color} mx-auto mb-2`}
                      />
                      <h3 className="text-lg font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                  </CometCard>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <CometCard>
                <div className="p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">API Key</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your {providers.find(p => p.id === selectedProvider)?.name} API key
                  </p>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationError && (
                    <p className="text-red-400 text-sm mt-2">{validationError}</p>
                  )}
                </div>
              </CometCard>
            </motion.div>
          )}

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <CometCard>
              <div className="p-6 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-white mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Privacy First</h3>
                    <p className="text-sm text-muted-foreground">
                      Your API key is stored locally in your browser and never sent to our servers. 
                      We respect your privacy and security.
                    </p>
                  </div>
                </div>
              </div>
            </CometCard>
          </motion.div>

          {/* Save Button */}
          <div className="text-center">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className={`text-white px-8 py-4 text-lg ${
                !selectedProvider || !apiKey || isValidating 
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-black"
              }`}
              onClick={!selectedProvider || !apiKey || isValidating ? undefined : handleSaveAndContinue}
            >
              <span>{isValidating ? "Validating..." : "Save & Continue"}</span>
            </HoverBorderGradient>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
