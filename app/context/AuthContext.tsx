'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Import Supabase client and types
// import { createClient } from '@/lib/supabase/client'; // OLD IMPORT
import { getSupabaseBrowserClient } from '@/lib/supabase/client'; // NEW IMPORT
import { Session, User as SupabaseUser, SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
  user: SupabaseUser | null; // Your public profile data
  profile: Profile | null; // Your public profile data
  isLoading: boolean; // Loading state for initial auth check
  isProfileLoading: boolean; // Loading state specifically for profile data
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  // Add specific sign-in methods if needed, or components can use supabase.auth directly
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// const supabase = createClient(); // OLD CLIENT CREATION

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const router = useRouter();

  // Initialize Supabase client once on the client-side
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  // FOR DEBUGGING ONLY: Expose client to window
  useEffect(() => {
    if (supabase) {
      (window as any).supabaseClientInstance = supabase;
      console.log('[AuthContext] Supabase client instance exposed to window.supabaseClientInstance for debugging.');
    }
  }, [supabase]);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return; // Guard if supabase is not yet initialized (should not happen with useMemo)
    if (!userId) {
      console.log("AuthContext: fetchProfile - No userId provided, setting profile null.");
      setProfile(null);
      setIsProfileLoading(false); // Ensure loading is false
      return;
    }
    console.log(`AuthContext: fetchProfile ( useCallback ID: some_unique_id_for_this_instance ) - Attempting to fetch profile for user: ${userId}`);
    setIsProfileLoading(true);
    let errorOccurred = false;
    try {
      console.log(`AuthContext: fetchProfile - Inside TRY block for user: ${userId}. About to query Supabase.`);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*') // Select all profile fields needed
        .eq('id', userId)
        .single();

      console.log(`AuthContext: fetchProfile - Supabase call completed for user: ${userId}. Status: ${status}, Error object:`, error, "Data object:", data);

      if (error) {
        errorOccurred = true;
        // Log specific Supabase error
        console.error(`AuthContext: fetchProfile - Supabase error explicitly returned for user ${userId} (Status: ${status}):`, error);
        setProfile(null);
        // Consider a toast, but maybe not here to avoid noise if profile is optional initially
        // toast.error("Failed to load profile", { description: error.message });
      } else if (data) {
        console.log(`AuthContext: fetchProfile - Profile data fetched successfully for user ${userId}:`, data);
        setProfile(data);
      } else {
          errorOccurred = true;
          console.warn(`AuthContext: fetchProfile - No profile data returned for user ${userId}, and no explicit Supabase error object. This usually means the row was not found.`);
          setProfile(null);
      }
    } catch (err: any) { // Catch any synchronous or unexpected errors during the try block
      errorOccurred = true;
      console.error(`AuthContext: fetchProfile - UNEXPECTED JS ERROR during profile fetch for user ${userId}:`, err.message, err.stack, err);
      setProfile(null);
      // toast.error("An unexpected error occurred loading your profile.");
    } finally {
      console.log(`AuthContext: fetchProfile - FINALLY block reached for user ${userId}. Setting isProfileLoading to false. Error occurred during fetch: ${errorOccurred}`);
      setIsProfileLoading(false);
    }
  }, [supabase]); // Dependency on the memoized supabase client

  useEffect(() => {
    if (!supabase) return; // Guard if supabase is not yet initialized

    console.log('[AuthContext] useEffect running. Supabase client:', supabase);

    const checkUserSession = async () => {
      try {
        setIsLoading(true);
        console.log('[AuthContext] Attempting to get session...');
        console.log('[AuthContext] supabase.auth object before getSession:', supabase.auth);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession(); // Renamed to currentSession for clarity
        console.log('[AuthContext] getSession() call completed.');

        if (error) {
          console.error("AuthContext: getSession() - Error received:", error);
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          setIsProfileLoading(false);
        }
        else if (currentSession) {
          console.log("AuthContext: Initial session FOUND. Setting state...");
          setSession(currentSession);
          setUser(currentSession.user);
          // Fetch profile immediately since we have the user ID
          await fetchProfile(currentSession.user.id);
          setIsLoading(false); //isLoading should be false after session and profile attempt
          // isProfileLoading is handled by fetchProfile
          console.log("AuthContext: Initial session - Set isLoading=false.");
        } else {
          console.log("AuthContext: No initial session found.");
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          setIsProfileLoading(false);
          console.log("AuthContext: No initial session - Set loading states false.");
        }
      } catch (error) {
        console.error("AuthContext: Error during initial getSession promise chain:", error);
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        setIsProfileLoading(false);
      }
    };

    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`AuthContext: onAuthStateChange - Event: ${event}`, { hasSession: !!newSession });
        
        if (newSession) {
          console.log("AuthContext: onAuthStateChange - Updating state for new session...");
          setSession(newSession);
          setUser(newSession.user);
          setIsLoading(false); 
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

    return () => {
      console.log("AuthContext: useEffect CLEANUP - Unsubscribing listener.");
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]); // Dependencies: supabase client and fetchProfile callback

  // Effect to fetch profile when user changes or profile is missing
  // This useEffect might be redundant if fetchProfile is called correctly after session changes.
  // However, keeping it for now as a safeguard or for scenarios where user is set but profile isn't immediately fetched.
  // useEffect(() => {
  //   console.log("AuthContext: Profile fetch effect triggered.", { userId: user?.id, profileExists: !!profile, isProfileLoading });
  //   if (user?.id && !profile && !isProfileLoading) {
  //       console.log("AuthContext: Profile fetch effect - Conditions met, calling fetchProfile.");
  //     fetchProfile(user.id);
  //   } else if (!user) {
  //       console.log("AuthContext: Profile fetch effect - No user, ensuring profile is null.");
  //     setProfile(null);
  //   }
  // }, [user, profile, isProfileLoading, fetchProfile]);

  const logout = async () => {
    if (!supabase) return; // Guard
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
    isProfileLoading,
    logout,
    fetchProfile
  }), [supabase, session, user, profile, isLoading, isProfileLoading, fetchProfile]);

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