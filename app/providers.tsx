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

// const LOCALNET_ENDPOINT = 'http://127.0.0.1:8899'; // Remove or comment out hardcoded value

export function Providers({ children }: { children: React.ReactNode }) {
  // Determine Solana network based on environment variable
  // Use WalletAdapterNetwork type for consistency, but the actual endpoint URL comes from env var
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta'
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet);

  // Determine the endpoint from environment variable, fallback to network clusterApiUrl
  const endpoint = useMemo(() => {
    const envEndpoint = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    let url: string;

    if (envEndpoint) {
        // Check if it's a known network name or a URL
        if (envEndpoint === 'devnet' || envEndpoint === 'testnet' || envEndpoint === 'mainnet-beta') {
            url = clusterApiUrl(envEndpoint as WalletAdapterNetwork);
            console.log(`Using ${envEndpoint} endpoint (clusterApiUrl):`, url);
        } else {
            // Assume it's a custom URL (like localnet)
            url = envEndpoint;
            console.log("Using custom endpoint URL:", url);
        }
    } else {
        // Fallback if env var is not set (defaults to Devnet)
        url = clusterApiUrl(WalletAdapterNetwork.Devnet);
        console.log("Warning: NEXT_PUBLIC_SOLANA_NETWORK not set, defaulting to Devnet endpoint:", url);
    }
    return url;
    // Original logic commented out:
    // if (process.env.NODE_ENV === 'development') {
    //   console.log("Using localnet endpoint:", LOCALNET_ENDPOINT);
    //   return LOCALNET_ENDPOINT;
    // }
    // console.log("Using network endpoint:", network);
    // return clusterApiUrl(network);
  }, []); // No dependency needed as env vars don't change during runtime

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