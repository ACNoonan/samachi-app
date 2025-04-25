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
      setIsLoading(false); // Ensure loading is set to false after profile fetch
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthContext: Error getting initial session:", error);
          if (mounted) setIsLoading(false);
          return;
        }

        console.log("AuthContext: Initial session:", initialSession);
        
        if (initialSession && mounted) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        } else if (mounted) {
          setIsLoading(false); // Set loading to false if no session
        }
      } catch (error) {
        console.error("AuthContext: Error in initializeAuth:", error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("AuthContext: Auth state changed:", event, newSession);
        
        if (!mounted) return;

        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          await fetchProfile(newSession.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false); // Ensure loading is set to false on logout
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array is fine here as we're using mounted flag

  const logout = async () => {
    console.log("AuthContext: Signing out...");
    try {
      // Clear local state first
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsLoading(false);

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: Error signing out:", error);
        throw error;
      }

      // Finally, redirect to login page
      router.push('/login');
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