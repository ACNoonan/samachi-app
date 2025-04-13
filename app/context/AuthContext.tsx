'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirect
import { cookies } from 'next/headers'; // Import to read initial state

// Define the same secure cookie name
const SESSION_COOKIE_NAME = 'auth_session';

interface AuthContextType {
  isLoggedIn: boolean;
  // In a real app, you might store profile info here too
  // profile: { id: string; username: string; } | null;
  login: () => void; // Will just update state, cookie is set by API
  logout: () => Promise<void>; // Make async to call API
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to check cookie on the client (can run in useEffect)
const hasSessionCookie = (): boolean => {
    if (typeof document === 'undefined') return false; // Guard for SSR
    return document.cookie.split(';').some((item) => item.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // Initialize state based on cookie presence (client-side check)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      // Check cookie presence on initial client mount
      setIsLoggedIn(hasSessionCookie());
  }, []);

  const login = () => {
    // This function might not even be strictly necessary anymore if
    // the UI reacts directly to redirects/cookie changes.
    // But it's useful for instant UI updates before a full page reload.
    console.log("AuthContext: Setting isLoggedIn to true (client state)");
    setIsLoggedIn(true);
  };

  const logout = async () => {
    console.log("AuthContext: Calling logout API and setting isLoggedIn to false");
    try {
        // Call the API route to clear the server-side cookie
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) { // Catch network errors etc.
        console.error("Logout API call failed:", error);
        // Decide if you still want to clear client state or show an error
    }
    setIsLoggedIn(false); // Update client state regardless of API success for responsiveness
    router.push('/login'); // Redirect to login page
  };

  // Memoize context value
  const value = useMemo(() => ({
    isLoggedIn,
    login,
    logout,
  }), [isLoggedIn]); // Dependency array might need router if used in memoized value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSimpleAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within an AuthProvider');
  }
  return context;
}; 