
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface PageLayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, hideNavbar = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <main className="flex-1 w-full max-w-md mx-auto pb-20">
        {children}
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
};
