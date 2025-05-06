'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Import Supabase client and types
import { createClient } from '@/lib/supabase/client'; // Assuming you have a client helper
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

// Keep your Profile type (ensure it matches the columns in public.profiles)
interface Profile {
    id: string;
    username?: string;
    email?: string;
    wallet_address?: string;
    twitter_handle?: string;
    telegram_handle?: string;
    // Add other relevant profile fields from your 'profiles' table
}

interface AuthContextType {
  supabase: SupabaseClient; // Expose Supabase client
  session: Session | null; // Supabase session object
  user: User | null; // Supabase auth user object
  profile: Profile | null; // Your public profile data
  isLoading: boolean; // Loading state for initial auth check
  isProfileLoading: boolean; // Loading state specifically for profile data
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  // Add specific sign-in methods if needed, or components can use supabase.auth directly
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Auth loading state
  const [isProfileLoading, setIsProfileLoading] = useState(true); // Profile loading state

  // Function to fetch profile data
  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      console.log("AuthContext: fetchProfile - No userId provided, setting profile null.");
      setProfile(null);
      setIsProfileLoading(false); // Ensure loading is false
      return;
    }
    console.log(`AuthContext: fetchProfile - Attempting to fetch profile for user: ${userId}`);
    setIsProfileLoading(true);
    let errorOccurred = false;
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*') // Select all profile fields needed
        .eq('id', userId)
        .single();

      if (error) {
        errorOccurred = true;
        // Log specific Supabase error
        console.error(`AuthContext: fetchProfile - Supabase error fetching profile (Status: ${status}):`, error);
        setProfile(null);
        // Consider a toast, but maybe not here to avoid noise if profile is optional initially
        // toast.error("Failed to load profile", { description: error.message });
      } else if (data) {
        console.log("AuthContext: fetchProfile - Profile data fetched successfully:", data);
        setProfile(data);
      } else {
          errorOccurred = true;
          console.warn(`AuthContext: fetchProfile - No profile data returned for user ${userId}, but no explicit Supabase error.`);
          setProfile(null);
      }
    } catch (err) {
      errorOccurred = true;
      console.error("AuthContext: fetchProfile - Unexpected JS error fetching profile:", err);
      setProfile(null);
      // toast.error("An unexpected error occurred loading your profile.");
    } finally {
      console.log(`AuthContext: fetchProfile - Setting profileLoading to false. Error occurred: ${errorOccurred}`);
      setIsProfileLoading(false);
    }
  }, [supabase]); // Dependency on supabase client instance

  // Initialize auth state and listen for changes
  useEffect(() => {
    console.log("AuthContext: useEffect START");
    let mounted = true;
    setIsLoading(true);
    setIsProfileLoading(true); 

    // --- Initial Session Check --- 
    console.log("AuthContext: useEffect - Calling getSession()...");
    supabase.auth.getSession().then(async ({ data: { session: currentSession }, error }) => {
      console.log("AuthContext: getSession() completed.", { hasSession: !!currentSession, error });
      if (!mounted) {
          console.log("AuthContext: getSession() - Component unmounted, bailing.");
          return; 
      }

      if (error) {
        console.error("AuthContext: getSession() - Error received:", error);
        // Set loading false even on error
        setIsLoading(false);
        setIsProfileLoading(false);
      }
      else if (currentSession) {
        console.log("AuthContext: Initial session FOUND. Setting state...");
        setSession(currentSession);
        setUser(currentSession.user);
        console.log("AuthContext: Initial session - State update called for session/user.");
        // Fetch profile immediately since we have the user ID
        await fetchProfile(currentSession.user.id);
        // Set auth loading false, profile loading is handled by fetchProfile
        setIsLoading(false); 
        console.log("AuthContext: Initial session - Set isLoading=false.");
      } else {
        console.log("AuthContext: No initial session found.");
        // If no initial session, mark auth and profile loading as done
        setIsLoading(false);
        setIsProfileLoading(false); 
        console.log("AuthContext: No initial session - Set loading states false.");
      }
    }).catch((error) => {
      // Handle potential errors during getSession promise itself
      console.error("AuthContext: Error during initial getSession promise chain:", error);
      if(mounted) {
        setIsLoading(false);
        setIsProfileLoading(false);
      }
    });

    // --- Auth State Change Listener --- 
    console.log("AuthContext: useEffect - Setting up onAuthStateChange listener...");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`AuthContext: onAuthStateChange - Event: ${event}`, { hasSession: !!newSession });
        
        // Avoid duplicate processing if the initial check already handled it?
        // Let's simplify: The listener should ALWAYS reflect the latest state.
        // if (!mounted || (newSession?.user.id === session?.user.id && event === 'INITIAL_SESSION')) {
        //   console.log("AuthContext: Listener ignoring redundant initial session event.");
        //   return;
        // }
        if (!mounted) {
            console.log("AuthContext: onAuthStateChange - Component unmounted, bailing.");
            return;
        }
        
        // console.log("AuthContext: Auth state CHANGED:", event, newSession); // Redundant log

        if (newSession) {
          console.log("AuthContext: onAuthStateChange - Updating state for new session...");
          setSession(newSession);
          setUser(newSession.user);
          setIsLoading(false); // Ensure loading is false
          await fetchProfile(newSession.user.id); 
          console.log("AuthContext: onAuthStateChange - Session updated, profile fetched.");
        } else {
          console.log("AuthContext: onAuthStateChange - Setting state to logged out...");
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false); 
          setIsProfileLoading(false);
          console.log("AuthContext: onAuthStateChange - State set to logged out.");
        }
      }
    );

    console.log("AuthContext: useEffect END - Listener setup.");

    return () => {
      console.log("AuthContext: useEffect CLEANUP - Unsubscribing listener.");
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Dependency remains supabase

  // Effect to fetch profile when user changes or profile is missing
  useEffect(() => {
    console.log("AuthContext: Profile fetch effect triggered.", { userId: user?.id, profileExists: !!profile, isProfileLoading });
    // Only fetch if we have a user ID, profile isn't already loaded, and not currently loading
    if (user?.id && !profile && !isProfileLoading) {
        console.log("AuthContext: Profile fetch effect - Conditions met, calling fetchProfile.");
      fetchProfile(user.id);
    } else if (!user) {
        console.log("AuthContext: Profile fetch effect - No user, ensuring profile is null.");
      setProfile(null); // Clear profile if user logs out
    }
  }, [user, profile, isProfileLoading, fetchProfile]); // Correct dependency: isProfileLoading

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
      setIsLoading(false); // Ensure both are false on logout
      setIsProfileLoading(false);

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
    isProfileLoading, // Add new state
    logout,
    fetchProfile // <-- Expose fetchProfile here
  }), [supabase, session, user, profile, isLoading, isProfileLoading, fetchProfile]); // Update dependencies

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