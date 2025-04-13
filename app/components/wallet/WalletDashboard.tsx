'use client';

import React, { useState } from 'react';
import { 
  CreditCard, Wallet, RefreshCw, History, Eye, EyeOff 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock wallet data - updated for Solana
const walletData = {
  connected: true,
  address: 'ABcd...XYz1',
  assets: [
    { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 1.25, value: 125, staked: 1.0 },
    { id: 'usdc', name: 'USD Coin on Solana', symbol: 'USDC', amount: 750, value: 750, staked: 500 },
  ]
};

export const WalletDashboard: React.FC = () => {
  const router = useRouter();
  const [hideBalances, setHideBalances] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalValue = walletData.assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalStakedValue = walletData.assets.reduce((sum, asset) => {
    if (asset.id === 'sol') return sum + (asset.staked * 100); // Mock SOL price
    if (asset.id === 'usdc') return sum + asset.staked;
    return sum;
  }, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const maskValue = (value: number) => {
    return hideBalances ? '••••••' : `€${value.toLocaleString()}`;
  };

  const maskAmount = (amount: number) => {
    return hideBalances ? '••••' : amount.toString();
  };

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
            <p className="text-sm text-muted-foreground">Across all assets</p>
          </div>
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-4">
          <h3 className="text-3xl font-bold mb-2">{maskValue(totalValue)}</h3>
          <div className="flex items-center">
            <button
              onClick={handleRefresh}
              className={`p-1 rounded-full ${refreshing ? 'animate-spin' : 'hover:bg-black/5'}`}
              disabled={refreshing}
              aria-label="Refresh balances"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-xs text-muted-foreground ml-1">Last updated just now</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Staked Assets</h2>
            <p className="text-sm text-muted-foreground">Collateral for credit line</p>
          </div>
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-1">{maskValue(totalStakedValue)}</h3>
          <p className="text-sm text-muted-foreground">
            Credit Line: {maskValue(totalStakedValue * 2)} <span className="text-xs">(2x collateral)</span>
          </p>
        </div>
        
        <Button 
          className="w-full glass-button"
          onClick={() => { console.log("Open staking modal or page"); /* router.push('/stake') or open modal */ }}
        >
          <span className="mr-2">+</span> Stake More Assets
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
          {walletData.assets.map((asset) => (
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
                  <p className="text-xs text-muted-foreground">{maskAmount(asset.amount)} {asset.symbol}</p>
                </div>
              </div>
              
              {asset.staked > 0 && (
                <div className="text-xs bg-solana-primary/10 p-2 rounded-lg text-solana-primary font-medium">
                  {maskAmount(asset.staked)} {asset.symbol} staked for credit line
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
