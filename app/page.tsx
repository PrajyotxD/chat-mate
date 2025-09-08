"use client";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { MessageSquare, Shield, Zap, Brain } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    // Debug info for root page
    const debug = [];
    debug.push(`URL: ${window.location.href}`);
    debug.push(`Hash: ${window.location.hash}`);
    
    // Check for tokens in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    debug.push(`Access token: ${accessToken ? 'FOUND' : 'NOT FOUND'}`);
    debug.push(`User: ${user ? 'LOGGED IN' : 'NOT LOGGED IN'}`);
    
    setDebugInfo(debug);

    if (!isLoading && user) {
      // Check if user has completed onboarding
      const apiKey = localStorage.getItem("oryo_api_key");
      const provider = localStorage.getItem("oryo_provider");
      
      if (apiKey && provider) {
        router.push("/chat");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, isLoading, router]);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Smart Conversations",
      description: "Engage with AI using your own API keys for personalized experiences"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your API keys stay local - we never store or access your credentials"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed with real-time responses and smooth interactions"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Multiple Personalities",
      description: "Switch between Study Buddy, Code Helper, and Casual Chat modes"
    }
  ];

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <AuroraBackground>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
            Oryo
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            Your Personal AI, Powered by Your API Key
          </p>
          {isLoading && <Loader />}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="text-center">
                <div className="text-white mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Get Started Button */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="text-white bg-black text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
            </HoverBorderGradient>
          </motion.div>
        )}

        {/* Debug Info */}
        <div className="mt-8 p-3 bg-black/50 rounded text-xs text-green-400 font-mono max-w-md">
          <div className="text-yellow-400 mb-2">HOME DEBUG INFO:</div>
          {debugInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </div>
      </div>
    </AuroraBackground>
  );
}
