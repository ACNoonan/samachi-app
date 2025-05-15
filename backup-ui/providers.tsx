'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    SolflareWalletAdapter,
    PhantomWalletAdapter,
    // TorusWalletAdapter,
    // LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "@/app/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SolanaProvider } from './context/SolanaContext';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const LOCALNET_ENDPOINT = 'http://127.0.0.1:8899';

export function Providers({ children }: { children: React.ReactNode }) {
  // Determine Solana network based on environment
  const network = process.env.NODE_ENV === 'development' 
                    ? WalletAdapterNetwork.Devnet // Use Devnet settings even for localnet to avoid type issues, endpoint overrides below
                    : WalletAdapterNetwork.Devnet; // Or WalletAdapterNetwork.Mainnet for production
  
  // Determine the endpoint
  const endpoint = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Using localnet endpoint:", LOCALNET_ENDPOINT);
      return LOCALNET_ENDPOINT;
    }
    console.log("Using network endpoint:", network);
    return clusterApiUrl(network);
  }, [network]);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter({ network }),
      new PhantomWalletAdapter(),
    ],
    [network]
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={false}>
            <WalletModalProvider>
              <SolanaProvider>
                {children}
                <Toaster richColors position="top-center" />
              </SolanaProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 