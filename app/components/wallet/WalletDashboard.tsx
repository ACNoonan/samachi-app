'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Wallet, RefreshCw, History, Eye, EyeOff, Info, Coins
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { useSolana } from '@/app/context/SolanaContext';
import { WalletName } from '@solana/wallet-adapter-base';

// Define a basic type for assets
interface Asset {
    id: string;
    name: string;
    symbol: string;
    amount: number;
    value: number; // Value in display currency (e.g., EUR)
}

// Define structure for Glownet data fetched from API
interface GlownetWalletData {
    money: number | null;
    virtual_money: number | null;
    balances: Record<string, any> | null;
}

export function WalletDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { connection } = useConnection();
  const { publicKey, connected, select } = useWallet();
  const { userState, loading: solanaLoading } = useSolana();

  // Log initial hook states
  console.log('WalletDashboard: Initial hook states:', {
    authLoading,
    user: user ? 'logged in' : 'not logged in',
    connection: connection ? 'connected' : 'not connected',
    publicKey: publicKey?.toString(),
    connected,
    solanaLoading,
    userState
  });

  // UI State
  const [hideBalances, setHideBalances] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Data State
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [glownetData, setGlownetData] = useState<GlownetWalletData | null>(null);
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);

  // Log state changes
  useEffect(() => {
    console.log('WalletDashboard: State updated:', {
      isLoadingData,
      initialLoadComplete,
      refreshing,
      dataError,
      solBalance,
      glownetData,
      walletAssets
    });
  }, [isLoadingData, initialLoadComplete, refreshing, dataError, solBalance, glownetData, walletAssets]);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    console.log('WalletDashboard: Starting fetchData...');
    
    // Skip fetching if user is not authenticated yet
    if (authLoading) {
      console.log('WalletDashboard: Auth still loading, skipping fetch');
      return;
    }
    
    // Clear previous errors before new fetch attempt
    setDataError(null);
    
    // Only show loading indicator if this is not a refresh operation
    if (!refreshing) {
      setIsLoadingData(true);
    }
    
    setRefreshing(true);
    console.log('WalletDashboard: Starting data fetch...');

    let fetchedSol: number | null = null;
    let fetchedGlownet: GlownetWalletData | null = null;
    let errorMessages: string[] = [];

    // Fetch Glownet Data - Only if user is logged in
    if (user) {
        try {
            console.log('WalletDashboard: Fetching Glownet wallet details...');
            const response = await fetch('/api/wallet/glownet-details');
            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || `Failed to fetch Glownet data: ${response.statusText}`);
            }
            const result = await response.json();
            
            if (result.glownetData) {
                fetchedGlownet = result.glownetData;
                console.log('WalletDashboard: Glownet data received:', fetchedGlownet);
            } else {
                console.log('WalletDashboard: No active Glownet membership found or empty data returned.');
            }
        } catch (error: any) {
            console.error('WalletDashboard: Error fetching Glownet data:', error);
            errorMessages.push(error.message || 'Could not load Glownet balances.');
        }
    } else {
        console.log('WalletDashboard: User not logged in, skipping Glownet data fetch.');
    }

    // Fetch Solana Data if wallet connected
    if (connected && publicKey && connection) {
        try {
            console.log('WalletDashboard: Fetching SOL balance...');
            const lamports = await connection.getBalance(publicKey);
            fetchedSol = lamports / LAMPORTS_PER_SOL;
            console.log('WalletDashboard: SOL balance received:', fetchedSol);
            
            // Update Assets List (Start with SOL)
            const updatedAssets: Asset[] = [];
            // TODO: Fetch real SOL price for value
            const solPriceEur = 150; // Placeholder price
            updatedAssets.push({
                id: 'sol',
                name: 'Solana',
                symbol: 'SOL',
                amount: fetchedSol,
                value: fetchedSol * solPriceEur
            });
            console.log('WalletDashboard: Updated assets list:', updatedAssets);
            setWalletAssets(updatedAssets);

        } catch (error: any) {
            console.error('WalletDashboard: Error fetching SOL balance:', error);
            errorMessages.push(error.message || 'Could not load Solana balance.');
        }
    } else {
        console.log('WalletDashboard: Solana wallet not connected, skipping balance fetch.');
        // If wallet not connected, ensure we have an empty asset list
        setWalletAssets([]);
    }

    // Update State
    console.log('WalletDashboard: Updating state with:', { solBalance: fetchedSol, glownetData: fetchedGlownet });
    setSolBalance(fetchedSol);
    setGlownetData(fetchedGlownet);

    // Handle Errors
    if (errorMessages.length > 0) {
        const combinedError = errorMessages.join(' \n ');
        setDataError(combinedError);
        // Only show toast if these are actual errors (not just "wallet not connected" situations)
        if (user || connected) {
            toast.error("Error loading wallet data", { description: combinedError });
        }
    }

    // Complete loading regardless of success/failure
    setIsLoadingData(false);
    setRefreshing(false);
    setInitialLoadComplete(true);
    console.log('WalletDashboard: Data fetch complete.');

  }, [user, connected, publicKey, connection, authLoading]);

  // Track key connection changes that should trigger a refresh
  const [prevConnected, setPrevConnected] = useState<boolean | null>(null);
  const [prevPublicKey, setPrevPublicKey] = useState<string | null>(null);
  const [prevUser, setPrevUser] = useState<any>(null);

  // Initial data fetch - run when auth loading completes or wallet connection changes significantly
  useEffect(() => {
    console.log('WalletDashboard: Checking for key dependency changes...');
    
    // Skip if still loading auth
    if (authLoading) {
      console.log('WalletDashboard: Auth still loading, skipping fetch');
      return;
    }
    
    const publicKeyStr = publicKey?.toString() || null;
    const userChanged = prevUser !== user;
    const connectionChanged = prevConnected !== connected;
    const publicKeyChanged = prevPublicKey !== publicKeyStr;
    
    console.log('WalletDashboard: Dependency changes:', {
      userChanged,
      connectionChanged,
      publicKeyChanged,
      prevConnected,
      connected,
      prevPublicKey,
      publicKeyStr,
      prevUser,
      user: user ? 'logged in' : 'not logged in'
    });
    
    // Only fetch if:
    // 1. First load (prevConnected is null)
    // 2. Connection state changed
    // 3. Public key changed
    // 4. User changed
    if (prevConnected === null || connectionChanged || publicKeyChanged || userChanged) {
      console.log('WalletDashboard: Key dependencies changed, fetching data...');
      
      // Update previous values
      setPrevConnected(connected);
      setPrevPublicKey(publicKeyStr);
      setPrevUser(user);
      
      // Execute the fetch
      fetchData();
    }
  }, [authLoading, user, connected, publicKey, fetchData]);

  // Add staked USDC to wallet assets
  useEffect(() => {
    console.log('WalletDashboard: Checking userState for staked USDC...', { userState });
    if (userState) {
      setWalletAssets(prevAssets => {
        const existingAssets = prevAssets.filter(asset => asset.id !== 'usdc-staked');
        const newAssets = [
          ...existingAssets,
          {
            id: 'usdc-staked',
            name: 'Staked USDC',
            symbol: 'USDC',
            amount: userState.stakedAmount.toNumber(),
            value: userState.stakedAmount.toNumber() // 1:1 value for USDC
          }
        ];
        console.log('WalletDashboard: Updated assets with staked USDC:', newAssets);
        return newAssets;
      });
    }
  }, [userState]);

  // --- Derived/Calculated Values ---
  const connectedWalletValue = solBalance !== null ? solBalance * 150 : null; // Placeholder value
  const glownetStakedBalance = glownetData?.virtual_money ?? 0;
  const glownetTotalCreditLimit = glownetData?.money ?? 0;

  const totalBalance = (connectedWalletValue ?? 0) + glownetStakedBalance;

  // Check if Glownet features are available
  const hasGlownetFeatures = glownetData !== null;

  // Simplified Credit Line: Available = Total Limit (assuming no active tab/usage info yet)
  const creditLineAvailable = glownetTotalCreditLimit;

  // --- UI Functions ---
  const handleRefresh = () => {
      if (refreshing) return; // Prevent multiple simultaneous refreshes
      setRefreshing(true);
      fetchData(); // Call the memoized fetch function
  };

  const maskValue = (value: number | null, symbol: string = '€') => {
    if (value === null) return hideBalances ? '••••••' : 'N/A';
    // Format based on symbol
    if (symbol === 'SOL') {
      return hideBalances ? '••••••' : `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} SOL`;
    }
    // Default to currency (Euro)
    return hideBalances ? '••••••' : `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatAmount = (amount: number | null, symbol: string = '') => {
      if (amount === null) return hideBalances ? '••••••' : 'N/A';
      return hideBalances ? '••••••' : `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}${symbol ? ' ' + symbol : ''}`;
  }

  // --- Render Logic ---

  // Render Loading State
  if (authLoading) {
      return (
          <div className="flex flex-col pt-10 pb-20 px-6 space-y-8">
              <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Wallet</h1>
                  <p className="text-muted-foreground">Loading your wallet data...</p>
              </div>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-1/4 mb-3" />
              <Skeleton className="h-24 w-full rounded-lg" />
          </div>
      );
  }

  // Render Not Logged In State
  if (!user && !authLoading) {
       return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4"/>
           <p className="text-center text-muted-foreground mb-4">Please log in to view your wallet.</p>
           <Button onClick={() => router.push('/login')}>Log In</Button>
         </div>
       );
  }

  // Render Error State (only if not loading and error exists)
  if (dataError && !isLoadingData && initialLoadComplete) {
       return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <Info className="h-12 w-12 text-destructive mb-4"/>
           <p className="text-destructive mb-2">Could not load wallet data.</p>
           <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{dataError}</p>
           <Button onClick={handleRefresh} disabled={refreshing}>
               <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
               Try Again
            </Button>
         </div>
       );
  }

  // Render Wallet Not Connected State
  if (!connected) {
      return (
          <div className="flex flex-col pt-10 pb-20 px-6 space-y-8">
              <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Wallet</h1>
                  <p className="text-muted-foreground">Connect your wallet to view your assets</p>
              </div>
              <div className="glass-card p-6 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                  <p className="text-muted-foreground mb-4">Your Solana wallet is not connected</p>
                  <Button onClick={() => select('Phantom' as WalletName)} className="w-full">
                      Connect Wallet
                  </Button>
              </div>
          </div>
      );
  }

  // Render Loading Data State
  if (isLoadingData && !initialLoadComplete) {
      return (
          <div className="flex flex-col pt-10 pb-20 px-6 space-y-8">
              <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">Wallet</h1>
                  <p className="text-muted-foreground">Loading your assets...</p>
              </div>
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-1/4 mb-3" />
              <Skeleton className="h-24 w-full rounded-lg" />
          </div>
      );
  }

  // Render Logged In Dashboard
  return (
    <div className="flex flex-col pt-10 pb-20 px-6 space-y-8">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-1">Wallet</h1>
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={hideBalances ? "Show balances" : "Hide balances"}
          >
            {hideBalances ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="text-muted-foreground">Manage your Solana & network assets</p>
      </div>

      {refreshing && (
        <div className="mb-4 text-center text-sm text-muted-foreground">
          <RefreshCw className="h-3 w-3 inline-block mr-1 animate-spin" />
          Refreshing data...
        </div>
      )}

      {/* Total Balance Card */}
      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Total Balance</h2>
            <p className="text-sm text-muted-foreground">
              {hasGlownetFeatures ? 'Wallet Value + Glownet Staked' : 'Wallet Value'}
            </p>
          </div>
          <Wallet className="h-6 w-6 text-primary" />
        </div>

        <div className="mb-4">
          <h3 className="text-3xl font-bold mb-2">{maskValue(totalBalance)}</h3>
          <div className="flex items-center">
            <button
              onClick={handleRefresh}
              className={`p-1 rounded-full ${refreshing ? 'animate-spin' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
              disabled={refreshing}
              aria-label="Refresh balances"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${refreshing ? 'animate-spin' : 'hover:opacity-70'}`} />
            </button>
            <span className="text-xs text-muted-foreground ml-1">Last updated {refreshing ? 'updating...' : 'just now'}</span>
          </div>
        </div>

        <div className="text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>Connected Wallet (Value):</span>
              <span>{maskValue(connectedWalletValue)}</span>
            </div>
            {hasGlownetFeatures && (
              <div className="flex justify-between">
                <span>Glownet Staked (Virtual):</span>
                <span>{maskValue(glownetStakedBalance)}</span>
              </div>
            )}
         </div>
      </div>

      {/* Credit Line Card - Only show if Glownet features are available */}
      {hasGlownetFeatures ? (
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium mb-1">Network Credit</h2>
              <p className="text-sm text-muted-foreground">Available spending power (Money)</p>
            </div>
            <CreditCard className="h-6 w-6 text-primary" />
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1">{maskValue(glownetTotalCreditLimit)} Available</h3>
            <p className="text-sm text-muted-foreground">
              Total Limit: {maskValue(glownetTotalCreditLimit)}
            </p>
          </div>

          <Button
            className="w-full glass-button"
            onClick={() => { console.log("Navigate to Glownet/Staking management..."); }}
          >
            Manage Glownet / Staking
          </Button>
        </div>
      ) : (
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium mb-1">Glownet Features Unavailable</h2>
              <p className="text-sm text-muted-foreground">No active Glownet membership found</p>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>

          <Button
            className="w-full glass-button"
            onClick={() => router.push('/discover')} // Navigate to discover page to find venues
          >
            Join a Venue
          </Button>
        </div>
      )}

      {/* Staking Section */}
      {userState && (
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium mb-1">Staking Status</h2>
              <p className="text-sm text-muted-foreground">Your staked USDC balance</p>
            </div>
            <Coins className="h-6 w-6 text-primary" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Staked Amount</span>
              <span className="font-medium">
                {userState.stakedAmount.toString()} USDC
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Assets Section */}
      <div className="mb-4 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Your Wallet Assets</h2>
          <Link href="/wallet/history" className="text-primary text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-1" /> History
          </Link>
        </div>

        <div className="space-y-3">
          {/* Display loading skeleton for assets if still loading */}
          {(isLoadingData && !initialLoadComplete) && (
            <>
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </>
          )}

          {/* Display assets or empty state */}
          {initialLoadComplete && walletAssets.length > 0 ? walletAssets.map((asset: Asset) => (
            <div key={asset.id} className="glass-card p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {/* Basic Icon Placeholder */}
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-primary">{asset.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  {/* Display value in currency */}
                  <p className="font-medium">{maskValue(asset.value)}</p>
                  {/* Display amount in token */}
                  <p className="text-xs text-muted-foreground">{formatAmount(asset.amount, asset.symbol)}</p>
                </div>
              </div>
            </div>
          )) : (initialLoadComplete && (
            <div className="glass-card p-4 text-center text-muted-foreground">
              <Info className="h-5 w-5 mx-auto mb-2"/>
              {connected ? 'No Solana assets found.' : 'Wallet not connected. Connect your wallet to view assets.'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

