'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  // In a real app, you might store profile info here too
  // profile: { id: string; username: string; } | null;
  login: () => void; // Simple login state setter
  logout: () => void; // Simple logout state setter
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // For MVP, just track login state. No persistent session yet.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    console.log("AuthContext: Setting isLoggedIn to true");
    setIsLoggedIn(true);
    // In a real app: set session cookie/token here
  };

  const logout = () => {
    console.log("AuthContext: Setting isLoggedIn to false");
    setIsLoggedIn(false);
    // In a real app: clear session cookie/token here
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isLoggedIn,
    login,
    logout,
  }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSimpleAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within an AuthProvider');
  }
  return context;
}; 