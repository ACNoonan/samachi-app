'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Wallet, RefreshCw, History, Eye, EyeOff, Info
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Skeleton } from '@/app/components/ui/skeleton';

// Define a basic type for assets (can be expanded later)
interface Asset {
    id: string;
    name: string;
    symbol: string;
    amount: number;
    value: number;
    staked: number;
}

// Provide type for initial assets array
const initialWalletData: { connected: boolean; address: string | null; assets: Asset[] } = {
  connected: false,
  address: null,
  assets: [] // Initialize as empty Asset array
};

export function WalletDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [hideBalances, setHideBalances] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [connectedWalletBalance, setConnectedWalletBalance] = useState<number | null>(500);
  const [stakedBalance, setStakedBalance] = useState<number>(1500);
  const [stablecoinsStaked, setStablecoinsStaked] = useState<number>(2500);
  const [activeTabAmount, setActiveTabAmount] = useState<number>(150);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [walletAssets, setWalletAssets] = useState<Asset[]>(initialWalletData.assets); // State for actual assets

  // Simulate data fetching
  useEffect(() => {
      setIsLoadingData(true);
      setDataError(null);
      // TODO: Fetch real data
      const timer = setTimeout(() => {
          // Set placeholder balances
          setConnectedWalletBalance(500);
          setStakedBalance(1500);
          setStablecoinsStaked(2500);
          setActiveTabAmount(150);
          // Simulate fetching some assets too
          setWalletAssets([
               { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 1.25, value: 125, staked: 1.0 },
               { id: 'usdc', name: 'USD Coin', symbol: 'USDC', amount: 750, value: 750, staked: 500 },
          ]);
          setIsLoadingData(false);
      }, 1000);
      return () => clearTimeout(timer);
  }, [user]);


  // --- Calculated Values ---
  const totalBalance = (connectedWalletBalance ?? 0) + stakedBalance;
  const creditLine = stablecoinsStaked - (activeTabAmount > 0 ? activeTabAmount : 0);
  const totalCreditLimit = stablecoinsStaked;

  // --- UI Functions ---
  const handleRefresh = () => {
      setRefreshing(true);
      // TODO: Trigger actual data refetching here
      setIsLoadingData(true); // Show loading state during refresh
      const timer = setTimeout(() => {
          // Simulate refetch completion
          setRefreshing(false);
          setIsLoadingData(false);
      }, 1500);
      return () => clearTimeout(timer);
  };

  const maskValue = (value: number | null) => {
    if (value === null) return hideBalances ? '••••••' : 'N/A';
    return hideBalances ? '••••••' : `€${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Render Loading State
  if (authLoading || isLoadingData) {
      return (
          <div className="flex flex-col pt-10 pb-20 px-6 space-y-8">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-1/4 mb-3" />
              <Skeleton className="h-24 w-full rounded-lg" />
          </div>
      );
  }

  // Render Not Logged In State
  if (!user) {
       return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4"/>
           <p className="text-center text-muted-foreground mb-4">Please log in to view your wallet.</p>
           <Button onClick={() => router.push('/login')}>Log In</Button>
         </div>
       );
  }

  // Render Logged In Dashboard
  return (
    <div className="flex flex-col pt-10 pb-20 px-6">
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-1">Wallet</h1>
          <button 
            onClick={() => setHideBalances(!hideBalances)}
            className="p-2 rounded-full hover:bg-black/5"
            aria-label={hideBalances ? "Show balances" : "Hide balances"}
          >
            {hideBalances ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="text-muted-foreground">Manage your Solana assets</p>
      </div>

      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Total Balance</h2>
            <p className="text-sm text-muted-foreground">Wallet + Staked</p>
          </div>
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-4">
          <h3 className="text-3xl font-bold mb-2">{maskValue(totalBalance)}</h3>
          <div className="flex items-center">
            <button
              onClick={handleRefresh}
              className={`p-1 rounded-full ${refreshing ? 'animate-spin' : 'hover:bg-black/5'}`}
              disabled={refreshing}
              aria-label="Refresh balances"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${refreshing ? 'animate-spin' : 'hover:opacity-70'}`} />
            </button>
            <span className="text-xs text-muted-foreground ml-1">Last updated just now</span>
          </div>
        </div>
        
        <div className="text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between"><span>Connected Wallet:</span> <span>{maskValue(connectedWalletBalance)}</span></div>
            <div className="flex justify-between"><span>Staked Balance:</span> <span>{maskValue(stakedBalance)}</span></div>
         </div>
      </div>

      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Credit Line</h2>
            <p className="text-sm text-muted-foreground">Available spending power</p>
          </div>
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-1">{maskValue(creditLine)} Available</h3>
          <p className="text-sm text-muted-foreground">
            Total Limit: {maskValue(totalCreditLimit)}
            {activeTabAmount > 0 && ` (Currently using ${maskValue(activeTabAmount)})`}
          </p>
          
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${totalCreditLimit > 0 ? ((totalCreditLimit - creditLine) / totalCreditLimit) * 100 : 0}%` }} />
           </div>
        </div>
        
        <Button
          className="w-full glass-button"
          onClick={() => { console.log("Navigate to staking..."); }}
        >
          Manage Staking
        </Button>
      </div>

      <div className="mb-4 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Your Assets</h2>
          <Link href="/wallet/history" className="text-primary text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-1" /> History
          </Link>
        </div>
        
        <div className="space-y-3">
          {walletAssets.length > 0 ? walletAssets.map((asset: Asset) => (
            <div key={asset.id} className="glass-card p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-solana-primary/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-solana-primary">{asset.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{maskValue(asset.value)}</p>
                  <p className="text-xs text-muted-foreground">{hideBalances ? '••••' : asset.amount} {asset.symbol}</p>
                </div>
              </div>
              
              {asset.staked > 0 && (
                <div className="text-xs bg-primary/10 p-2 rounded-lg text-primary font-medium">
                  {hideBalances ? '••••' : asset.staked} {asset.symbol} staked
                </div>
              )}
            </div>
          )) : (
              <div className="glass-card p-4 text-center text-muted-foreground">
                  <Info className="h-5 w-5 mx-auto mb-2"/>
                  No assets found in connected wallet.
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
