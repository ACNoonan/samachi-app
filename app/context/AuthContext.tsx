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
    setIsLoading(true); // Indicate loading profile data
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*') // Select all profile fields
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406 No Content is expected if profile doesn't exist yet
        console.error("AuthContext: Error fetching profile:", error);
        setProfile(null); // Clear profile on error
        // Optionally throw error or handle it based on your app's needs
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
      // Consider setting isLoading false only after BOTH session AND profile check are done
      // This might need adjustment based on how initial loading feels
    }
  };

  useEffect(() => {
    setIsLoading(true); // Start loading on mount

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log("AuthContext: Initial session:", initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      // 2. Fetch profile if session exists
      if (initialSession?.user?.id) {
        await fetchProfile(initialSession.user.id);
      }
      
      // Initial load complete ONLY after session check AND profile fetch (if applicable)
      setIsLoading(false); 
    }).catch(error => {
        console.error("AuthContext: Error in getSession promise:", error);
        setIsLoading(false); // Stop loading on error
    });


    // 3. Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("AuthContext: onAuthStateChange event:", event, "session:", newSession);
        setSession(newSession);
        const newAuthUser = newSession?.user ?? null;
        setUser(newAuthUser);

        // If user logs in/session restored, fetch profile
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (newAuthUser?.id) {
            await fetchProfile(newAuthUser.id);
          } else {
            // Should not happen if event is SIGNED_IN, but handle defensively
             console.warn("AuthContext: SIGNED_IN event but no user ID found in session.");
             setProfile(null);
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear profile on logout
          setProfile(null);
          // Optionally redirect here or let components handle it
          // router.push('/login'); // Example redirect on logout
        }
         // Ensure loading is false after state change and profile fetch
         setIsLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Add supabase as dependency

  const logout = async () => {
    console.log("AuthContext: Signing out...");
    setIsLoading(true); // Indicate loading during sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("AuthContext: Error signing out:", error);
      // Handle error appropriately, e.g., show toast
    }
    // State updates (session, user, profile to null) are handled by onAuthStateChange listener
    // Redirect can happen here or be handled by listener/components
    router.push('/login'); 
    setIsLoading(false); // Stop loading after sign out attempt
  };

  // Memoize context value
  const value = useMemo(() => ({
    supabase, // Provide client instance
    session,
    user,
    profile, // Provide profile data
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