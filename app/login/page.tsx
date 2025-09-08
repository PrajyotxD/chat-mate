"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { analytics } from "@/lib/analytics";

function LoginContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loginLoading, setLoginLoading] = useState(false);
  // Debug info
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  useEffect(() => {
    const debug = [];
    debug.push(`URL: ${window.location.href}`);
    debug.push(`Hash: ${window.location.hash}`);
    debug.push(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    debug.push(`Supabase client: ${supabase ? 'OK' : 'NULL'}`);
    
    // Check for tokens in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    debug.push(`Access token: ${accessToken ? 'FOUND' : 'NOT FOUND'}`);
    
    setDebugInfo(debug);
  }, []);

  useEffect(() => {
    if (user) {
      // Track successful login
      analytics.login();
      
      // Check if user has completed onboarding
      const apiKey = localStorage.getItem("oryo_api_key");
      const provider = localStorage.getItem("oryo_provider");
      
      if (apiKey && provider) {
        router.push("/chat");
      } else {
        router.push("/onboarding");
      }
    }

    // Check for auth errors from URL params
    const error = searchParams.get('error');
    if (error === 'auth_failed') {
      analytics.error('auth_failed', 'Google authentication failed');
      toast({
        title: "Authentication Failed",
        description: "There was an error signing you in. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, router, searchParams, toast]);

  const handleLogin = async () => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase client:', supabase);
    
    if (!supabase) {
      toast({
        title: "Authentication Required",
        description: "Please configure Supabase environment variables to enable authentication.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoginLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://oryo.vercel.app`,
        }
      });

      if (error) {
        throw error;
      }

      // The redirect will happen automatically
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Failed to sign in with Google. Please try again.";
      
      if (error.message?.includes('popup')) {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message?.includes('unauthorized')) {
        errorMessage = "Google sign-in is not properly configured.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AuroraBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Oryo</h1>
            <p className="text-gray-300">Sign in with Google to continue</p>
          </div>

          {!supabase ? (
            <div className="text-center">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-sm">
                  ⚠️ Authentication is not configured. Please set up Supabase environment variables.
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Contact the administrator to enable Google sign-in.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {loginLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {loginLoading ? "Signing in..." : "Continue with Google"}
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Authentication is required to use Oryo
            </p>
          </div>
          
          {/* Debug Info */}
          <div className="mt-4 p-3 bg-black/50 rounded text-xs text-green-400 font-mono">
            <div className="text-yellow-400 mb-2">DEBUG INFO:</div>
            {debugInfo.map((info, i) => (
              <div key={i}>{info}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
