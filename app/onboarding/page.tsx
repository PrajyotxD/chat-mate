"use client";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CometCard } from "@/components/ui/comet-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";

type Provider = "openai" | "groq" | "anthropic" | "gemini";

// Logos as SVG components for performance and scalability
const OpenAILogo = () => (
  <svg width="32" height="32" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35.343 26.1233C32.8843 28.1433 29.92 29.4533 26.7013 29.86L26.9513 29.9233L26.9363 29.93L26.9283 29.9333C26.8733 29.9533 26.8153 29.9733 26.7583 29.99L26.7013 30.0066V30.0133C26.1013 30.18 25.4833 30.3066 24.8533 30.3933L24.8533 30.3933L15.1483 23.8366L15.1483 14.8L20.4333 11.99L20.4333 20.8166L24.8533 23.5833L24.8533 14.5533L29.92 11.99L29.92 20.5666C32.8113 19.2466 34.9633 16.83 35.7583 13.93L20.4333 4.99997L5.10833 13.93C5.10833 22.96 11.8933 30.24 20.4333 31.9233C20.4333 31.9233 20.4333 34.8133 20.4333 34.8133C10.0483 32.9333 3.13833 23.9333 3.13833 13.93L20.4333 3.0333L37.7283 13.93C36.9333 19.3333 35.343 26.1233 35.343 26.1233Z" fill="white"/>
    <path d="M20.4333 34.8133C20.4333 34.8133 20.4333 31.9233 20.4333 31.9233C28.9733 30.24 35.7583 22.96 35.7583 13.93L20.4333 4.99997L20.4333 14.8L15.1483 17.61L15.1483 23.8366L20.4333 26.8933L20.4333 34.8133Z" fill="white"/>
  </svg>
);

const GroqLogo = () => (
  <svg width="32" height="32" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path fill="white" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m43.42 140.42a12 12 0 1 1-17 17L128 154.84l-26.42 26.58a12 12 0 1 1-17-17L111 137.83l-26.59-26.42a12 12 0 1 1 17-17L128 120.84l26.42-26.59a12 12 0 0 1 17 17L145 137.83Z"/>
  </svg>
);

const AnthropicLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v8h-2v-8zm0 10h2v2h-2v-2z" fill="white"/>
  </svg>
);

const GeminiLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="white" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m-3.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m-3.5 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7"/>
  </svg>
);

const providers = [
  {
    id: "openai" as Provider,
    name: "OpenAI",
    description: "GPT-4, GPT-3.5 Turbo",
    logo: <OpenAILogo />,
  },
  {
    id: "groq" as Provider,
    name: "Groq",
    description: "Lightning fast inference",
    logo: <GroqLogo />,
  },
  {
    id: "anthropic" as Provider,
    name: "Anthropic",
    description: "Claude 3 models",
    logo: <AnthropicLogo />,
  },
  {
    id: "gemini" as Provider,
    name: "Gemini",
    description: "Google's AI models",
    logo: <GeminiLogo />,
  }
];

// Memoized ProviderCard to prevent re-renders
const ProviderCard = memo(({ provider, selectedProvider, onSelect }: { provider: any, selectedProvider: Provider | null, onSelect: (id: Provider) => void }) => (
  <div 
    className={`cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border ${
      selectedProvider === provider.id
        ? "border-blue-400 bg-blue-500/20"
        : "border-white/20 hover:border-white/40"
    }`}
    onClick={() => onSelect(provider.id)}
  >
    <div className="text-center">
      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
        {provider.logo}
      </div>
      <h3 className="text-xs sm:text-sm font-semibold text-white">{provider.name}</h3>
      <p className="text-xs text-gray-300 hidden sm:block">{provider.description}</p>
    </div>
  </div>
));
ProviderCard.displayName = 'ProviderCard';

export default function Onboarding() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = use-toast();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, isLoading, router]);
  
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSaveAndContinue = async () => {
    if (!selectedProvider || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please select a provider and enter your API key.",
        variant: "destructive",
      });
      return;
    }
    
    setIsValidating(true);
    setValidationError("");
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, provider: selectedProvider })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.valid) {
        localStorage.setItem("oryo_provider", selectedProvider);
        localStorage.setItem("oryo_api_key", apiKey);
        
        toast({
          title: "Success!",
          description: `${selectedProvider.toUpperCase()} API key validated successfully.`,
        });
        
        router.push("/chat");
      } else {
        const errorMsg = data.error || "Invalid API key";
        setValidationError(errorMsg);
        
        toast({
          title: "Validation Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      
      let errorMessage = "Failed to validate API key";
      if (error.message.includes('401')) errorMessage = "Invalid API key. Please check your key and try again.";
      else if (error.message.includes('429')) errorMessage = "Rate limit exceeded. Please wait and try again.";
      else if (error.message.includes('500')) errorMessage = "Server error. Please try again later.";
      else if (error.message.includes('network') || error.message.includes('fetch')) errorMessage = "Network error. Check your connection.";
      else errorMessage = error.message;
      
      setValidationError(errorMessage);
      
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
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
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-2xl lg:max-w-4xl border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Setup Oryo
            </h1>
            <p className="text-sm sm:text-base text-gray-300">
              Choose your AI provider and enter your API key to get started
            </p>
          </div>

          {/* Provider Selection */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white text-center">Select AI Provider</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {providers.map((provider) => (
                <ProviderCard 
                  key={provider.id}
                  provider={provider}
                  selectedProvider={selectedProvider}
                  onSelect={setSelectedProvider}
                />
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
                  p>
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
