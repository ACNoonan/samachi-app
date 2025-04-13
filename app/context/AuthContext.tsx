'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirect
// Removed cookies import from 'next/headers' as it's server-side only

// Define the same secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

// Define Profile type (adjust based on actual data needed)
interface Profile {
    id: string;
    username?: string; // Made optional as ProfileSettings uses email/name
    email?: string;    // Added email
    name?: string;     // Added name
    walletAddress?: string; // Added walletAddress
    // Add other relevant profile fields
}

interface AuthContextType {
  user: Profile | null; // Store user profile data
  isLoading: boolean; // Add loading state
  login: (userData: Profile) => void; // Accept user data on login
  logout: () => Promise<void>;
  checkSession: () => Promise<void>; // Add function to manually re-check session
}

// Export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to check cookie on the client (can run in useEffect)
// This doesn't verify the cookie, just checks presence
const hasSessionCookie = (): boolean => {
    if (typeof document === 'undefined') return false;
    return document.cookie.split(';').some((item) => item.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  // Function to fetch session info from our backend endpoint
  const checkSession = async () => {
      console.log("AuthContext: Checking session with backend...");
      setIsLoading(true);
      try {
          const response = await fetch('/api/auth/session'); // Call our backend endpoint
          if (response.ok) {
              const userData: Profile = await response.json();
              if (userData && userData.id) { // Check if valid user data is returned
                 console.log("AuthContext: Session valid, user found:", userData);
                 setUser(userData);
              } else {
                  console.log("AuthContext: Session invalid or no user data returned.");
                  setUser(null);
              }
          } else {
              console.log("AuthContext: Session check API call failed or returned non-OK status.");
              setUser(null); // Assume logged out if session check fails
          }
      } catch (error) {
          console.error("AuthContext: Error calling /api/auth/session:", error);
          setUser(null); // Assume logged out on error
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      // Check session on initial mount
      checkSession();
  }, []);

  const login = (userData: Profile) => {
    // Called after successful API login which sets the cookie
    console.log("AuthContext: Setting user state:", userData);
    setUser(userData);
    setIsLoading(false); // Ensure loading is false after login set
  };

  const logout = async () => {
    console.log("AuthContext: Calling logout API and clearing user state");
    setIsLoading(true);
    try {
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error("Logout API call failed:", error);
    }
    setUser(null); // Clear client state
    setIsLoading(false);
    router.push('/login');
  };

  // Memoize context value
  const value = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    checkSession // Expose checkSession if needed externally
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Rename the hook to useAuth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 