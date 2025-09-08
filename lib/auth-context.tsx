"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google';
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Auth Context - Starting initialization');
    console.log('🔍 Supabase client:', supabase);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 URL Hash:', window.location.hash);
    console.log('🔍 URL Search:', window.location.search);
    
    if (!supabase) {
      console.log('❌ No Supabase client - setting loading false');
      setIsLoading(false);
      return;
    }

    // Handle OAuth callback from URL
    const handleAuthCallback = async () => {
      console.log('🔍 Starting auth callback handler');
      
      try {
        const { data, error } = await supabase!.auth.getSession();
        console.log('🔍 Current session data:', data);
        console.log('🔍 Session error:', error);
        
        if (data?.session) {
          console.log('✅ Found existing session');
          setUser(mapSupabaseUser(data.session.user));
        } else {
          console.log('🔍 No existing session, checking URL for tokens');
          
          // Check if we have auth tokens in URL hash (mobile OAuth)
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          console.log('🔍 Hash params:', Object.fromEntries(hashParams));
          console.log('🔍 Access token found:', !!accessToken);
          console.log('🔍 Refresh token found:', !!refreshToken);
          
          if (accessToken && refreshToken) {
            console.log('🔍 Setting session from URL tokens');
            try {
              const { data: sessionData, error: sessionError } = await supabase!.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              console.log('🔍 Set session result:', sessionData);
              console.log('🔍 Set session error:', sessionError);
              
              if (sessionData?.session && !sessionError) {
                console.log('✅ Session set successfully');
                setUser(mapSupabaseUser(sessionData.session.user));
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                console.log('🔍 URL cleaned');
              } else {
                console.log('❌ Failed to set session');
              }
            } catch (err) {
              console.error('❌ Session setup error:', err);
            }
          } else {
            console.log('🔍 No tokens in URL');
          }
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
      }
      
      setIsLoading(false);
      console.log('🔍 Auth callback complete - loading set to false');
    };

    handleAuthCallback();

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      console.log('🔍 Auth state change:', _event, session);
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    avatar: supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${supabaseUser.email}&background=random`,
    provider: 'google'
  });

  const login = async () => {
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
