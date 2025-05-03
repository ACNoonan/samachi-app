'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Wallet, RefreshCw, History, Eye, EyeOff, Info, Coins, Copy, PiggyBank
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

export function WalletDashboard() {
  console.log('WalletDashboard: Component rendering');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { connection } = useConnection();
  const { publicKey, connected, select, wallet } = useWallet();
  const {
    custodialStakeBalance,
    treasuryAddress,
    loading: solanaContextLoading,
    error: solanaError,
    unstake,
    fetchCustodialBalance,
  } = useSolana();

  // Log initial hook states
  console.log('WalletDashboard: Initial hook states:', {
    authLoading,
    user: user ? 'logged in' : 'not logged in',
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

  // Data State
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [glownetData, setGlownetData] = useState<GlownetWalletData | null>(null);
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);

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
      walletAssets
    });
  }, [isLoadingData, solanaContextLoading, initialLoadComplete, refreshing, dataError, solanaError, solBalance, custodialStakeBalance, glownetData, walletAssets]);

  // --- Data Fetching (SOL Balance & Glownet) ---
  const fetchData = useCallback(async (isManualRefresh = false) => {
    console.log('WalletDashboard: Starting fetchData...', { isManualRefresh });

    // Skip if still authenticating user
    if (authLoading && !user) {
      console.log('WalletDashboard: Auth still loading, skipping fetch');
      return;
    }

    // Clear previous SOL/Glownet errors
    setDataError(null);

    // Show loading state only if it's not a background refresh
    if (!refreshing) {
      setIsLoadingData(true);
    }
    if (isManualRefresh) {
        setRefreshing(true);
    }

    console.log('WalletDashboard: Starting SOL/Glownet data fetch...');

    let fetchedSol: number | null = null;
    let fetchedGlownet: GlownetWalletData | null = null;
    let errorMessages: string[] = [];

    // --- Fetch Glownet Data ---
    if (user) {
        try {
            console.log('WalletDashboard: Fetching Glownet wallet details...');
            const response = await fetch('/api/wallet/glownet-details');
            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || `Failed to fetch Glownet data: ${response.statusText}`);
            }
            const result = await response.json();
            fetchedGlownet = result.glownetData || null; // Assign null if no data
            console.log('WalletDashboard: Glownet data received:', fetchedGlownet);
        } catch (error: any) {
            console.error('WalletDashboard: Error fetching Glownet data:', error);
            errorMessages.push(error.message || 'Could not load Glownet balances.');
        }
    } else {
        console.log('WalletDashboard: User not logged in, skipping Glownet data fetch.');
        fetchedGlownet = null; // Ensure it's null if user logs out
    }

    // --- Fetch Solana Data (SOL Balance only for now) ---
    if (connected && publicKey && connection) {
        try {
            console.log('WalletDashboard: Fetching SOL balance...');
            const lamports = await connection.getBalance(publicKey);
            fetchedSol = lamports / LAMPORTS_PER_SOL;
            console.log('WalletDashboard: SOL balance received:', fetchedSol);

            // Update SOL Asset
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
            console.log('WalletDashboard: Updated assets list (SOL only):', updatedAssets);
            setWalletAssets(updatedAssets);

        } catch (error: any) {
            console.error('WalletDashboard: Error fetching SOL balance:', error);
            errorMessages.push(error.message || 'Could not load Solana balance.');
            setWalletAssets([]); // Clear assets on error
        }
    } else {
        console.log('WalletDashboard: Solana wallet not connected, skipping SOL balance fetch.');
        fetchedSol = null; // Ensure null if wallet disconnects
        setWalletAssets([]); // Clear assets if wallet not connected
    }

    // --- Update State ---
    console.log('WalletDashboard: Updating state with:', { solBalance: fetchedSol, glownetData: fetchedGlownet });
    setSolBalance(fetchedSol);
    setGlownetData(fetchedGlownet);

    // --- Handle Errors ---
    if (errorMessages.length > 0) {
        const combinedError = errorMessages.join(' \n ');
        setDataError(combinedError);
        if (user || connected) { // Only toast if we expected data
            toast.error("Error loading wallet data", { description: combinedError });
        }
    }

    // --- Complete Loading ---
    setIsLoadingData(false);
    setRefreshing(false);
    setInitialLoadComplete(true); // Mark initial load as done after first attempt
    console.log('WalletDashboard: SOL/Glownet data fetch complete.');

  }, [user, connected, publicKey, connection, authLoading, refreshing]);

  // --- Trigger Initial SOL/Glownet Fetch ---
  useEffect(() => {
    console.log('WalletDashboard: Checking dependencies for initial SOL/Glownet fetch...');
    if (!authLoading && !initialLoadComplete) { // Fetch only once after auth settles
      console.log('WalletDashboard: Auth loaded, triggering initial SOL/Glownet fetch...');
      fetchData();
    } else if (connected && publicKey && !isLoadingData && !initialLoadComplete) {
        // Edge case: Auth was fast, wallet connects later, still need initial fetch
        console.log('WalletDashboard: Wallet connected after auth, triggering initial SOL/Glownet fetch...');
        fetchData();
    } else if (!connected && !publicKey) {
        // Clear SOL balance and assets if wallet disconnects
        setSolBalance(null);
        setWalletAssets([]);
    }
  }, [authLoading, connected, publicKey, initialLoadComplete, fetchData]);

  // --- Refresh Handler ---
  const handleRefresh = async () => {
    if (refreshing || solanaContextLoading) return; // Prevent multiple refreshes
    console.log('WalletDashboard: Manual refresh triggered.');
    setRefreshing(true); // Indicate refresh visually if needed
    await Promise.all([
        fetchData(true), // Fetch SOL/Glownet
        fetchCustodialBalance() // Fetch staking balance
    ]);
    setRefreshing(false);
    toast.info("Balances refreshed");
  };

  // --- Formatting Helpers ---
  const maskValue = (value: number | null, symbol: string = '€') => {
    if (hideBalances) return '*****';
    if (value === null || isNaN(value)) return 'N/A';
    return `${symbol}${value.toFixed(2)}`;
  };

  const formatAmount = (amount: number | null, symbol: string = '') => {
    if (hideBalances) return '*****';
    if (amount === null || isNaN(amount)) return 'N/A';
    // Basic formatting, consider Intl.NumberFormat for complex cases
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${symbol}`;
  };

  // --- Copy Helper ---
  const copyToClipboard = (text: string | null | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Address copied to clipboard!"))
      .catch(err => toast.error("Failed to copy address"));
  };

  // --- Derived State ---
  const showLoadingSkeletons = (isLoadingData || solanaContextLoading || authLoading) && !initialLoadComplete;

  // --- Render Logic ---
  if (authLoading && !user) {
      console.log('WalletDashboard: Auth loading, rendering skeleton...');
      return (
          <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
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
            <div className="flex justify-center gap-4">
                <Button onClick={() => router.push('/login')}>Log In / Sign Up</Button>
                <Button onClick={() => wallet?.adapter.connect()} variant="outline">
                    Connect Phantom
                </Button>
            </div>
        </div>
    );
  }

  console.log('WalletDashboard: Rendering main dashboard content...');
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Wallet</h1>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setHideBalances(!hideBalances)} aria-label={hideBalances ? "Show balances" : "Hide balances"}>
                {hideBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
           <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing || solanaContextLoading} aria-label="Refresh balances">
                 <RefreshCw className={`h-5 w-5 ${ (refreshing || solanaContextLoading) ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </div>

      {/* Display Errors */}
      {dataError && (
        <Alert variant="destructive">
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>{dataError}</AlertDescription>
        </Alert>
      )}
       {solanaError && (
        <Alert variant="destructive">
            <AlertTitle>Staking Error</AlertTitle>
            <AlertDescription>{solanaError}</AlertDescription>
        </Alert>
      )}

      {/* --- Glownet Card --- */}
      {user && ( // Only show Glownet card if logged in via email/phantom session
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    Venue Balance (Glownet)
                </CardTitle>
                <CardDescription>Your current balance at the venue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {isLoadingData ? (
                    <>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </>
                ) : glownetData ? (
                    <>
                        <p className="text-2xl font-semibold">
                           {maskValue(glownetData.money, '€')}
                        </p>
                        {/* Add more details if needed, e.g., virtual money */}
                        {glownetData.virtual_money !== null && (
                             <p className="text-sm text-muted-foreground">
                                Virtual: {maskValue(glownetData.virtual_money, '€')}
                             </p>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">No active venue membership found.</p>
                )}
            </CardContent>
             {/* Optional Footer */}
             {/* <CardFooter>
                <Button variant="outline" size="sm" disabled>Top Up (Coming Soon)</Button>
            </CardFooter> */}
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
                     {isLoadingData ? (
                        <Skeleton className="h-6 w-1/3" />
                    ) : (
                        <p className="text-2xl font-semibold">
                           {formatAmount(solBalance, 'SOL')}
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
                     {isLoadingData ? (
                        <Skeleton className="h-10 w-full" />
                    ) : walletAssets.length > 0 ? (
                        <ul className="space-y-2">
                            {walletAssets.map(asset => (
                                <li key={asset.id} className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{asset.name} ({asset.symbol})</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium">{formatAmount(asset.amount)}</span>
                                        {/* <span className="text-sm text-muted-foreground block">{maskValue(asset.value, '€')}</span> */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">No assets found.</p>
                    )}
                 </div>
            </CardContent>
             {/* <CardFooter>
                 <Button variant="outline" size="sm">View on Explorer</Button>
            </CardFooter> */}
        </Card>
       )}

       {/* --- Custodial Staking Card --- */}
       {connected && publicKey && ( // Show staking only if wallet is connected
           <Card>
               <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                       <PiggyBank className="h-5 w-5 text-green-600" />
                       Custodial USDC Staking
                   </CardTitle>
                   <CardDescription>Stake USDC by sending it to the treasury address.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                   {/* Staked Balance */}
                   <div>
                       <p className="text-sm font-medium text-muted-foreground">Your Staked Balance</p>
                       {solanaContextLoading && !refreshing ? ( // Show skeleton only on initial/context load
                           <Skeleton className="h-6 w-1/3" />
                       ) : (
                           <p className="text-2xl font-semibold">
                               {formatAmount(custodialStakeBalance, 'USDC')}
                           </p>
                       )}
                        {/* Display value if needed */}
                       {/* {custodialStakeBalance !== null && !hideBalances && <p className="text-sm text-muted-foreground">{maskValue(custodialStakeBalance, '$')}</p>} */}
                   </div>

                   <Separator />

                   {/* Staking Instructions & Address */}
                   <div>
                       <h3 className="text-lg font-semibold mb-2">How to Stake</h3>
                       <Alert>
                           <Coins className="h-4 w-4" />
                           <AlertTitle>Send USDC (Devnet)</AlertTitle>
                           <AlertDescription>
                               To stake, send Devnet USDC (<span className="font-mono text-xs">{process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || 'Gh9Zw...'}</span>) from your connected wallet to the following treasury address.
                               Your staked balance will update automatically after the transaction is confirmed and processed by our system (may take a minute).
                           </AlertDescription>
                       </Alert>
                       <div className="mt-3 flex items-center gap-2">
                           <Input
                               readOnly
                               value={treasuryAddress ? treasuryAddress.toString() : 'Loading...'}
                               className="font-mono text-sm flex-grow"
                           />
                           <Button
                               variant="outline"
                               size="icon"
                               onClick={() => copyToClipboard(treasuryAddress?.toString())}
                               disabled={!treasuryAddress}
                               aria-label="Copy Treasury Address"
                           >
                               <Copy className="h-4 w-4" />
                           </Button>
                       </div>
                   </div>

                   <Separator />

                   {/* Unstake Action */}
                    <div>
                       <h3 className="text-lg font-semibold mb-2">Unstake</h3>
                       <p className="text-sm text-muted-foreground mb-3">
                           Request to withdraw your staked USDC. Processing may take some time as it requires backend confirmation.
                       </p>
                       <Button
                           onClick={unstake}
                           disabled={!custodialStakeBalance || custodialStakeBalance <= 0 || solanaContextLoading || refreshing}
                           className="w-full sm:w-auto"
                       >
                           Request Unstake
                       </Button>
                        {(solanaContextLoading || refreshing) && custodialStakeBalance && custodialStakeBalance > 0 &&
                            <p className="text-sm text-muted-foreground mt-2">Processing...</p>
                        }
                       {!custodialStakeBalance || custodialStakeBalance <= 0 &&
                            <p className="text-sm text-muted-foreground mt-2">No balance available to unstake.</p>
                       }
                   </div>

               </CardContent>
               <CardFooter className="text-xs text-muted-foreground">
                    Note: This is a custodial staking system. Your USDC is held in the platform treasury wallet.
               </CardFooter>
           </Card>
       )}

      {/* Action Buttons (Placeholder examples) */}
      {/* <div className="grid grid-cols-2 gap-4">
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" /> Transaction History
        </Button>
        <Button variant="outline" disabled>
           <Coins className="mr-2 h-4 w-4" /> Swap Tokens (Coming Soon)
        </Button>
      </div> */}
    </div>
  );
}

