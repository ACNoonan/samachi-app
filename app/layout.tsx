'use client'; // Root layout needs to be a client component for providers

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useMemo } from 'react'; // Add React and useMemo

// Solana Wallet Adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    PhantomWalletAdapter, 
    SolflareWalletAdapter, 
    // Add other adapters you want to support
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the new Auth Provider
import { AuthProvider } from './context/AuthContext';
// Import Toaster for notifications
import { Toaster } from "@/app/components/ui/sonner"
// Theme Provider
import { ThemeProvider } from "next-themes"

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const inter = Inter({ subsets: ["latin"] });

// No need for metadata export in a client component layout root
// export const metadata: Metadata = {
//   title: "Samachi App",
//   description: "Samachi Membership Access",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set Solana network
  const network = WalletAdapterNetwork.Devnet; // Or Mainnet-beta, Testnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        // Add other adapters...
    ],
    [network]
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <AuthProvider>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  {/* Your existing layout structure, e.g., Navbar, PageWrapper */} 
                  {children} 
                  <Toaster richColors position="top-center" /> { /* Add Toaster */ }
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
