'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Wallet, RefreshCw, History, Eye, EyeOff, Info, Coins, Copy, PiggyBank, Ticket,
  MinusCircle, PlusCircle // Import icons for buttons
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

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

// Define the type here
interface MembershipWithVenue {
  id: string; // Membership ID
  user_id: string;
  venue_id: string;
  created_at: string;
  status: string; // e.g., 'active', 'inactive'
  credit_limit: number | null;
  current_credit: number | null;
  glownet_user_id: string | null;
  venues: {
    id: string;
    name: string;
    // Add other venue fields if needed
  } | null; // Allow venue to be null if join fails or not included
}

export function WalletDashboard() {
  console.log('WalletDashboard: Component rendering');
  const router = useRouter();
  const { user, session, profile, isLoading: authLoading } = useAuth();
  const { connection } = useConnection();
  const { publicKey, connected, select, wallet } = useWallet();
  const {
    custodialStakeBalance,
    custodialStakes,
    treasuryAddress,
    loading: solanaContextLoading,
    error: solanaError,
    stake,
    unstake,
    fetchCustodialBalance,
  } = useSolana();

  // Log initial hook states
  console.log('WalletDashboard: Initial hook states:', {
    authLoading,
    user: user ? 'logged in' : 'not logged in',
    session: session ? 'exists' : 'null',
    profile: profile ? 'exists' : 'null',
    connection: connection ? 'connected' : 'not connected',
    publicKey: publicKey?.toString(),
    connected,
    solanaContextLoading,
    custodialStakeBalance,
    treasuryAddress: treasuryAddress?.toString(),
  });

  // UI State
  const [hideBalances, setHideBalances] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  // Data State
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [glownetData, setGlownetData] = useState<GlownetWalletData | null>(null);
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);
  const [memberships, setMemberships] = useState<MembershipWithVenue[]>([]); // <-- New state for memberships

  // Stake/Unstake Input State
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');

  // Log state changes
  useEffect(() => {
    console.log('WalletDashboard: State updated:', {
      isLoadingData,
      solanaContextLoading,
      initialLoadComplete,
      refreshing,
      dataError,
      solanaError,
      solBalance,
      custodialStakeBalance,
      glownetData,
      walletAssets,
      memberships, // <-- Log memberships
      stakeAmount, // Log input states
      unstakeAmount
    });
  }, [isLoadingData, solanaContextLoading, initialLoadComplete, refreshing, dataError, solanaError, solBalance, custodialStakeBalance, glownetData, walletAssets, memberships, stakeAmount, unstakeAmount]);

  // --- Data Fetching (SOL Balance, Glownet & Memberships) ---
  const fetchNonStakingData = useCallback(async () => {
    console.log('WalletDashboard: Fetching non-staking data (SOL/Glownet/Memberships)...');

    // Skip if still authenticating user
    if (authLoading && !user) {
      console.log('WalletDashboard: Auth still loading, skipping non-staking fetch');
      return;
    }

    // Clear previous SOL/Glownet errors
    setDataError(null);

    // Don't set loading here, let main refresh handler control it

    let fetchedSol: number | null = null;
    let fetchedGlownet: GlownetWalletData | null = null;
    let fetchedMemberships: MembershipWithVenue[] = [];
    let errorMessages: string[] = [];

    // --- Fetch Glownet Data ---
    if (user) {
        try {
            const response = await fetch('/api/wallet/glownet-details');
            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || `Failed to fetch Glownet data: ${response.statusText}`);
            }
            const result = await response.json();
            fetchedGlownet = result.glownetData || null;
        } catch (error: any) {
            console.error('WalletDashboard: Error fetching Glownet data:', error);
            errorMessages.push(error.message || 'Could not load Glownet balances.');
        }

        // --- Fetch Memberships ---
        try {
            const memResponse = await fetch('/api/memberships');
            if (!memResponse.ok) {
                const result = await memResponse.json().catch(() => ({}));
                throw new Error(result.error || `Failed to fetch memberships: ${memResponse.statusText}`);
            }
            const memResult = await memResponse.json();
            fetchedMemberships = Array.isArray(memResult) ? memResult : [];
        } catch (error: any) {
            console.error('WalletDashboard: Error fetching Memberships:', error);
            errorMessages.push(error.message || 'Could not load memberships.');
        }
    } else {
        fetchedGlownet = null;
        fetchedMemberships = [];
    }

    // --- Fetch Solana Data (SOL Balance only for now) ---
    if (connected && publicKey && connection) {
        try {
            const lamports = await connection.getBalance(publicKey);
            fetchedSol = lamports / LAMPORTS_PER_SOL;

            // Update SOL Asset
            const updatedAssets: Asset[] = [];
            const solPriceEur = 150; // Placeholder price
            updatedAssets.push({
                id: 'sol',
                name: 'Solana',
                symbol: 'SOL',
                amount: fetchedSol,
                value: fetchedSol * solPriceEur
            });
            setWalletAssets(updatedAssets);
        } catch (error: any) {
            console.error('WalletDashboard: Error fetching SOL balance:', error);
            errorMessages.push(error.message || 'Could not load Solana balance.');
            setWalletAssets([]);
        }
    } else {
        fetchedSol = null;
        setWalletAssets([]);
    }

    // --- Update State ---
    setSolBalance(fetchedSol);
    setGlownetData(fetchedGlownet);
    setMemberships(fetchedMemberships);

    // --- Handle Errors (Set state, toast handled by refresh handler) ---
    if (errorMessages.length > 0) {
        setDataError(errorMessages.join(' \n '));
    }
    console.log('WalletDashboard: Non-staking data fetch complete.');

  }, [user, connected, publicKey, connection, authLoading]);

  // --- Refresh Handler (Calls both staking and non-staking fetches) ---
  const handleRefresh = useCallback(async (isManualRefresh = true) => {
    if (refreshing || solanaContextLoading) return;
    console.log('WalletDashboard: Refresh triggered.', { isManualRefresh });

    if (isManualRefresh) {
        setRefreshing(true);
        toast.info("Refreshing balances...");
    }
    setIsLoadingData(true); // Use main loading flag
    setDataError(null); // Clear previous non-staking errors

    // Create promises for parallel fetching
    const promises = [];
    if (connected && publicKey) {
        promises.push(fetchCustodialBalance()); // Fetches stakes too
    }
    promises.push(fetchNonStakingData());

    try {
        await Promise.all(promises);
        if (isManualRefresh) {
            toast.success("Balances refreshed!");
        }
    } catch (error) {
        // Errors are handled within the individual fetch functions (setting state, context error)
        console.error("WalletDashboard: Error during refresh:", error); // Log aggregate error possibility
        if (isManualRefresh) {
            toast.error("Failed to refresh all data.");
        }
    } finally {
        setRefreshing(false);
        setIsLoadingData(false);
        setInitialLoadComplete(true);
        console.log('WalletDashboard: Refresh complete.');
    }
  }, [refreshing, solanaContextLoading, connected, publicKey, fetchCustodialBalance, fetchNonStakingData]);


  // --- Trigger Initial Fetch ---
  useEffect(() => {
      // Trigger initial refresh ONLY once auth is resolved AND the attempt hasn't been made yet
      // Wallet connection status is implicitly handled by fetch functions / handleRefresh logic
      if (!authLoading && !initialLoadAttempted) {
          console.log("WalletDashboard: Triggering initial data load via handleRefresh (Auth ready, first attempt)");
          setInitialLoadAttempted(true); // Mark that we're attempting the load
          handleRefresh(false); // Pass false to indicate it's the initial auto-refresh
      }
      // Reset attempt flag and completion status if auth becomes loading again (e.g., user logs out and logs back in)
      if (authLoading) {
         setInitialLoadAttempted(false);
         setInitialLoadComplete(false); // Reset completion status too
      }
  }, [authLoading, initialLoadAttempted, handleRefresh]); // Dependencies reduced

 // --- Effect to clear data on logout/disconnect ---
  useEffect(() => {
      if (!authLoading) {
          if (!user) {
              console.log('WalletDashboard: User logged out, clearing Glownet/Memberships...');
              setGlownetData(null);
              setMemberships([]);
              setInitialLoadComplete(false); // Reset loading state indicators on logout
              setInitialLoadAttempted(false);
          }
          if (!connected) {
              console.log('WalletDashboard: Wallet disconnected, clearing SOL/Assets...');
              setSolBalance(null);
              setWalletAssets([]);
              // Staking balance/stakes cleared within SolanaContext on disconnect
              // Don't necessarily reset initialLoadComplete just for wallet disconnect
          }
      }
  }, [authLoading, user, connected]);

  // --- NEW: Stake Click Handler ---
  const handleStakeClick = useCallback(async () => {
    if (solanaContextLoading || refreshing) return;

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
        toast.error("Invalid Stake Amount", { description: "Please enter a positive number to stake." });
        return;
    }

    console.log(`WalletDashboard: Requesting stake for amount: ${amount}`);
    // stake function now handles loading state and toasts internally
    await stake(amount);
    setStakeAmount(''); // Clear input after initiating

  }, [stake, stakeAmount, solanaContextLoading, refreshing]);

  // --- Modified Unstake Click Handler ---
  const handleUnstakeClick = useCallback(async () => {
    if (solanaContextLoading || refreshing) return;

    const amount = parseFloat(unstakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Unstake Amount", { description: "Please enter a positive number to unstake." });
      return;
    }

    // Basic check against displayed balance (backend does the real check)
    if (custodialStakeBalance !== null && amount > custodialStakeBalance) {
        // Using sonner toast levels
        toast.warning("Amount may exceed balance", { description: `Requesting ${amount} USDC, but balance shows ${custodialStakeBalance.toFixed(2)} USDC. The transaction may fail.` });
        // Allow proceeding, backend will reject if truly insufficient
    }

    console.log(`WalletDashboard: Requesting unstake for amount: ${amount}`);
    // unstake function handles loading state and toasts internally
    await unstake(amount); // Call context function with amount
    setUnstakeAmount(''); // Clear input after initiating

  }, [unstake, unstakeAmount, custodialStakeBalance, solanaContextLoading, refreshing]);

  // --- Formatting Helpers ---
  const maskValue = (value: number | null, symbol: string = '€') => {
    if (hideBalances) return '*****';
    if (value === null || isNaN(value)) return '-'; // Use dash for unavailable data
    // Keep maskValue simple: just format the number with symbol and fixed decimals
    return `${symbol}${value.toFixed(2)}`;
    // Removed incorrect Intl.NumberFormat logic from here
  };

  const formatAmount = (amount: number | null, symbol: string = '', decimals: number = 6) => {
    if (hideBalances) return '*****';
    if (amount === null || isNaN(amount)) return '-'; // Use dash
    // Explicitly ensure amount is treated as a number after the null check
    const numericAmount = amount as number;
    // Use toLocaleString for basic number formatting with decimals
    const formattedAmount = numericAmount.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return symbol ? `${formattedAmount} ${symbol}` : formattedAmount;
  };

  // --- Copy Helper ---
  const copyToClipboard = (text: string | null | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Address copied!"))
      .catch(err => toast.error("Failed to copy address"));
  };

  // --- Derived State ---
  // Show skeletons if auth is loading OR the initial data load hasn't completed yet
  const showLoadingSkeletons = authLoading || !initialLoadComplete;

  // --- Render Logic ---

  // Initial Loading State (covers auth, initial data fetch)
  if (authLoading || showLoadingSkeletons) {
      console.log('WalletDashboard: Rendering loading skeletons...', { authLoading, showLoadingSkeletons });
      return (
          <div className="space-y-6 p-4 md:p-6">
              <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-32" />
                  <div className="flex gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
          </div>
      );
  }

  // If user is not logged in AT ALL (post auth check)
  if (!user && !connected) {
    console.log('WalletDashboard: Not logged in, not connected, rendering prompt.');
    return (
        <div className="text-center space-y-4 p-8 border rounded-lg shadow-md bg-card">
            <Wallet size={48} className="mx-auto text-primary" />
            <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
                Connect your Solana wallet or log in to manage your balances and stake USDC.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => router.push('/login')}>Log In / Sign Up</Button>
                {/* Use wallet-adapter connect function */} 
                <Button onClick={() => wallet?.adapter.connect().catch(err => toast.error("Failed to connect Phantom", { description: err.message }))} variant="outline">
                    Connect Phantom
                </Button>
            </div>
        </div>
    );
  }

  // Log the balance value just before rendering the main content
  console.log('WalletDashboard: Value of custodialStakeBalance before render:', custodialStakeBalance);

  console.log('WalletDashboard: Rendering main dashboard content...');
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */} 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Wallet</h1>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setHideBalances(!hideBalances)} aria-label={hideBalances ? "Show balances" : "Hide balances"}>
                {hideBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />} 
            </Button>
           <Button variant="ghost" size="icon" onClick={() => handleRefresh(true)} disabled={refreshing || solanaContextLoading} aria-label="Refresh balances">
                 <RefreshCw className={`h-5 w-5 ${ (refreshing || solanaContextLoading) ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </div>

      {/* Display Errors */} 
      {/* Solana specific errors from context */}
      {solanaError && (
        <Alert variant="destructive">
            <AlertTitle>Staking System Error</AlertTitle>
            <AlertDescription>{solanaError}</AlertDescription>
        </Alert>
      )}
       {/* Other data loading errors (Glownet, SOL balance) */} 
       {dataError && (
        <Alert variant="destructive">
            <AlertTitle>Error Loading Wallet Data</AlertTitle>
            <AlertDescription>{dataError}</AlertDescription>
        </Alert>
      )}

      {/* --- Active Memberships Section - Moved Up --- */}
      {user && ( // Only show memberships if logged in
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center">
                <Ticket className="mr-2 h-5 w-5" />
                Active Memberships
            </CardTitle>
            <CardDescription>
                Your current venue memberships.
            </CardDescription>
            </CardHeader>
            <CardContent>
            {(isLoadingData && memberships.length === 0) ? (
                <Skeleton className="h-8 w-full" />
            ) : !isLoadingData && memberships.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active venue memberships found.</p>
            ) : memberships.length > 0 ? (
                <ul className="space-y-2">
                {memberships.map((mem) => (
                    <li key={mem.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                    <span>{mem.venues?.name || 'Venue details missing'}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mem.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}`}>
                        {mem.status}
                    </span>
                    </li>
                ))}
                </ul>
            ) : null}
            </CardContent>
        </Card>
      )}

      {/* --- Solana Wallet Card --- */} 
       {connected && publicKey && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                     <Wallet className="h-5 w-5 text-purple-500" />
                    Solana Wallet
                </CardTitle>
                 <CardDescription>Your connected Solana wallet balance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {/* SOL Balance */} 
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">SOL Balance</p>
                     {isLoadingData && solBalance === null ? ( // Show skeleton if loading AND no balance yet
                        <Skeleton className="h-6 w-1/3" />
                    ) : (
                        <p className="text-2xl font-semibold">
                           {formatAmount(solBalance, 'SOL', 9)} {/* Show more decimals for SOL */}
                        </p>
                     )}
                    {/* Placeholder for value in EUR */}
                    {/* {solBalance !== null && !hideBalances && <p className="text-sm text-muted-foreground">{maskValue(solBalance * 150, '€')}</p>} */} 
                </div>

                {/* Separator */} 
                 <Separator />

                {/* Asset List (Currently only SOL) */} 
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Assets</h3>
                     {isLoadingData && walletAssets.length === 0 ? (
                        <Skeleton className="h-10 w-full" />
                    ) : walletAssets.length > 0 ? (
                        <ul className="space-y-2">
                            {walletAssets.map(asset => (
                                <li key={asset.id} className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{asset.name} ({asset.symbol})</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium">{formatAmount(asset.amount, '', 9)}</span>
                                        {/* <span className="text-sm text-muted-foreground block">{maskValue(asset.value, '€')}</span> */} 
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Could not load SOL balance.</p>
                    )}
                 </div>
            </CardContent>
        </Card>
       )}

       {/* --- Custodial Staking Card --- */} 
       {/* Show staking card only if wallet connected, regardless of login status */} 
       {connected && publicKey && (
           <Card>
               <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                       <PiggyBank className="h-5 w-5 text-green-600" />
                       Custodial USDC Staking
                   </CardTitle>
                   <CardDescription>Stake USDC held in your wallet to the platform.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                   {/* Staked Balance */} 
                   <div>
                       <p className="text-sm font-medium text-muted-foreground">Your Staked Balance</p>
                       {/* Show skeleton if loading AND balance is null */}
                       {(solanaContextLoading && custodialStakeBalance === null) ? (
                           <Skeleton className="h-6 w-1/3" />
                       ) : (
                           <>
                             {/* Removed log */}
                             {/* {(() => { console.log('WalletDashboard: Value JUST before rendering staked balance:', custodialStakeBalance); return null; })()} */}
                             <p className="text-2xl font-semibold">
                               {/* Revert to using formatAmount now that context should be correct */}
                               {formatAmount(custodialStakeBalance, 'USDC', 6)}
                             </p>
                           </>
                       )}
                   </div>

                   <Separator />

                   {/* Staking Instructions & Treasury Address - REMOVED */}
                   {/*
                   <div className="space-y-2">
                       <h3 className="text-lg font-semibold">Treasury Address (for Deposits)</h3>
                       <Alert variant="default">
                           <Info className="h-4 w-4" />
                           <AlertTitle>Manual Deposits (Optional)</AlertTitle>
                           <AlertDescription>
                               You can also deposit Devnet USDC (<span className="font-mono text-xs break-all">{process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || 'Gh9Zw...KJr'}</span>) manually by sending it to the address below from your connected wallet. Use the "Stake" button for an easier experience.
                           </AlertDescription>
                       </Alert>
                       <div className="mt-3 flex items-center gap-2">
                           <Input
                               readOnly
                               value={treasuryAddress ? treasuryAddress.toString() : 'Loading...'}
                               className="font-mono text-sm flex-grow bg-muted/50"
                               aria-label="Treasury Address"
                           />
                           <Button
                               variant="outline"
                               size="icon"
                               onClick={() => copyToClipboard(treasuryAddress?.toString())}
                               disabled={!treasuryAddress || solanaContextLoading}
                               aria-label="Copy Treasury Address"
                           >
                               <Copy className="h-4 w-4" />
                           </Button>
                       </div>
                   </div>
                   */}

                   {/* --- NEW: Stake Action Input --- */} 
                   <div className="space-y-2 pt-2">
                       <h3 className="text-lg font-semibold">Stake USDC</h3>
                       <div className="flex items-center gap-2">
                           <Input
                                type="number"
                                placeholder="Amount in USDC (e.g., 10.5)"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                disabled={solanaContextLoading || refreshing || !connected}
                                className="flex-grow"
                                min="0"
                                step="any"
                            />
                            <Button
                                onClick={handleStakeClick}
                                disabled={solanaContextLoading || refreshing || !stakeAmount || parseFloat(stakeAmount) <= 0 || !connected}
                                aria-label="Stake USDC"
                             >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Stake
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                           Transfers USDC from your wallet to the staking treasury.
                       </p>
                   </div>

                   <Separator />

                   {/* --- Modified: Unstake Action Input --- */} 
                    <div className="space-y-2">
                       <h3 className="text-lg font-semibold">Unstake USDC</h3>
                       <p className="text-sm text-muted-foreground mb-3">
                           Withdraw staked USDC instantly back to your wallet.
                       </p>
                       <div className="flex items-center gap-2">
                           <Input
                                type="number"
                                placeholder="Amount in USDC (e.g., 5)"
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                                disabled={solanaContextLoading || refreshing || !connected || custodialStakeBalance === null || custodialStakeBalance <= 0}
                                className="flex-grow"
                                min="0"
                                step="any"
                                max={custodialStakeBalance ?? undefined} // Set max based on balance
                           />
                           <Button
                               onClick={handleUnstakeClick}
                               disabled={solanaContextLoading || refreshing || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || !connected || custodialStakeBalance === null || custodialStakeBalance <= 0}
                               variant="destructive" // Or outline
                               aria-label="Unstake USDC"
                           >
                               <MinusCircle className="h-5 w-5 mr-2" />
                                Unstake
                           </Button>
                       </div>
                       {(solanaContextLoading || refreshing) && (stakeAmount || unstakeAmount) &&
                           <p className="text-sm text-primary animate-pulse mt-2">Processing Transaction...</p>
                       }
                       {(custodialStakeBalance !== null && custodialStakeBalance <= 0) && connected && !solanaContextLoading &&
                           <p className="text-sm text-muted-foreground mt-2">No balance available to unstake.</p>
                       }
                   </div>

               </CardContent>
               <CardFooter className="text-xs text-muted-foreground">
                    Staking involves transferring USDC to the platform's treasury address. Unstaking initiates a transfer back from the treasury.
               </CardFooter>
           </Card>
       )}

    </div>
  );
}

