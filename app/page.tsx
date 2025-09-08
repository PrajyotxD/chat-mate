"use client";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CometCard } from "@/components/ui/comet-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { MessageSquare, Shield, Zap, Brain } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
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
    if (user) {
      router.push("/onboarding");
    } else {
      router.push("/login");
    }
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
            <CometCard key={index}>
              <div className="p-6 text-center rounded-2xl">
                <div className="text-white mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </CometCard>
          ))}
        </motion.div>

        {/* Buttons */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="text-white bg-black text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
            </HoverBorderGradient>
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="text-white bg-black text-lg px-8 py-4"
              onClick={() => router.push("/comet")}
            >
              <span>View Comet Demo</span>
            </HoverBorderGradient>
          </motion.div>
        )}
      </div>
    </AuroraBackground>
  );
}
