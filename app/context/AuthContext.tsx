'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import Supabase client and types
import { createClient } from '@/lib/supabase/client'; // Assuming you have a client helper
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

// Keep your Profile type (ensure it matches the columns in public.profiles)
interface Profile {
    id: string;
    username?: string;
    email?: string;
    name?: string;
    walletAddress?: string;
    twitter?: string;
    telegram?: string;
    // Add other relevant profile fields from your 'profiles' table
}

interface AuthContextType {
  supabase: SupabaseClient; // Expose Supabase client
  session: Session | null; // Supabase session object
  user: User | null; // Supabase auth user object
  profile: Profile | null; // Your public profile data
  isLoading: boolean; // Combined loading state for auth and profile
  logout: () => Promise<void>;
  // Add specific sign-in methods if needed, or components can use supabase.auth directly
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  // Fetch profile data based on user ID
  const fetchProfile = async (userId: string) => {
    console.log("AuthContext: Fetching profile for user:", userId);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*') // Select all profile fields
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406 No Content is expected if profile doesn't exist yet
        console.error("AuthContext: Error fetching profile:", error);
        setProfile(null); // Clear profile on error
      } else if (data) {
        console.log("AuthContext: Profile data received:", data);
        setProfile(data as Profile); // Set profile data
      } else {
        console.log("AuthContext: No profile found for user:", userId);
        setProfile(null); // No profile exists
      }
    } catch (error) {
      console.error("AuthContext: Exception fetching profile:", error);
      setProfile(null);
    } finally {
      console.log("AuthContext: fetchProfile finally block. Setting isLoading to false.");
      setIsLoading(false); // Ensure loading is set to false after profile fetch
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;

    // Start loading
    setIsLoading(true);

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("AuthContext: Auth state changed:", event, newSession);

        if (!mounted) return;

        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          // Fetch profile *after* setting user, then update loading state
          await fetchProfile(newSession.user.id);
          // No need to set isLoading(false) here, fetchProfile does it.
        } else {
          // No session or logout
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false); // Set loading to false if no session/logged out
        }
      }
    );

    // Initial check to handle case where listener might not fire immediately
    // or if there's no session at all on first load.
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (mounted && !currentSession) {
        // If after a brief moment there's still no session, stop loading.
        // The listener will handle the case where a session appears later.
        setIsLoading(false);
        console.log("AuthContext: No initial session found after listener setup.");
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Add supabase as dependency

  const logout = async () => {
    console.log("AuthContext: Signing out...");
    try {
      // First sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: Error signing out:", error);
        throw error;
      }

      // Clear all local state
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsLoading(false);

      // Clear any local storage items
      localStorage.clear();
      sessionStorage.clear();

      // Let the middleware handle the redirect
      router.refresh();
    } catch (error) {
      console.error("AuthContext: Error in logout:", error);
      throw error;
    }
  };

  // Memoize context value
  const value = useMemo(() => ({
    supabase,
    session,
    user,
    profile,
    isLoading,
    logout
  }), [supabase, session, user, profile, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Keep the hook as is
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 