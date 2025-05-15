'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, CreditCard, Clock, DollarSign, TrendingDown,
  CheckCircle, Coins
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { PurchaseModal } from './PurchaseModal';
import { useSolana } from '@/app/context/SolanaContext';
import { useToast } from '@/app/components/ui/use-toast';

// TODO: Replace with actual venues from the database
const venueData = {
  '1': {
    id: '1',
    name: 'Silk Club London',
    location: 'London, UK',
  },
  '2': {
    id: '2',
    name: 'Azure Lounge Miami',
    location: 'Miami, FL',
  },
  '3': {
    id: '3',
    name: 'Crystal Tokyo',
    location: 'Tokyo, Japan',
  },
  '4': {
    id: '4',
    name: 'Celestial Berlin',
    location: 'Berlin, Germany',
  },
};

// TODO: Replace with actual transaction data from the database
const transactionData = [
  { id: 't1', description: 'Premium Cocktail', amount: 24.00, time: '10 minutes ago' },
  { id: 't2', description: 'VIP Seating Fee', amount: 150.00, time: '25 minutes ago' },
  { id: 't3', description: 'Bottle Service', amount: 320.00, time: '1 hour ago' },
];

export const CreditLine: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const venueId = params.venueId as string;
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [transactions, setTransactions] = useState(transactionData);
  const [creditUsed, setCreditUsed] = useState(494);
  const [dailyLimit] = useState(1000);
  const { userState, stake, unstake } = useSolana();
  const { toast } = useToast();
  
  // Safety check
  const venue = venueId ? venueData[venueId as keyof typeof venueData] : null;

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-xl font-medium mb-4">Venue not found or loading...</p>
        <Button onClick={() => router.push('/discover')}>
          Back to Discover
        </Button>
      </div>
    );
  }
  
  const addTransaction = (description: string, amount: number) => {
    const newTransaction = {
      id: `t${Math.random().toString(36).substring(7)}`,
      description,
      amount,
      time: 'Just now'
    };
    
    setTransactions([newTransaction, ...transactions]);
    setCreditUsed(creditUsed + amount);
    console.log(`Recorded purchase: ${description} for $${amount}`);
  };

  const handleStake = async (amount: number) => {
    try {
      await stake(amount);
      toast({
        title: "Success",
        description: "Successfully staked USDC",
      });
    } catch (error) {
      console.error('Error staking:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to stake USDC",
        variant: "destructive",
      });
    }
  };

  const handleUnstake = async (amount: number) => {
    try {
      await unstake(amount);
      toast({
        title: "Success",
        description: "Successfully unstaked USDC",
      });
    } catch (error) {
      console.error('Error unstaking:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unstake USDC",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-10 pb-20 px-6">
      <div className="mb-6 animate-fade-in">
        <button 
          onClick={() => router.push(`/venue/${venueId}`)}
          className="flex items-center text-muted-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Venue
        </button>
        
        <h1 className="text-2xl font-bold mb-1">Active Credit</h1>
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <p className="text-sm text-muted-foreground">
            Checked in at {venue.name}
          </p>
        </div>
      </div>

      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium mb-1">Daily Credit</h2>
            <p className="text-sm text-muted-foreground">Available until check-out</p>
          </div>
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-muted-foreground">Used</span>
            <span className="font-medium">${creditUsed.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-muted-foreground">Daily Limit</span>
            <span className="font-medium text-lg">${dailyLimit.toFixed(2)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${dailyLimit > 0 ? (creditUsed / dailyLimit) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              Auto-reset at midnight
            </span>
            <span className="text-xs font-medium text-primary">
              ${(dailyLimit - creditUsed).toFixed(2)} remaining
            </span>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowPurchaseModal(true)}
          className="w-full glass-button"
        >
          Make a Purchase
          <DollarSign className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium mb-1">Staked USDC</h2>
            <p className="text-sm text-muted-foreground">Manage your staked balance</p>
          </div>
          <Coins className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-muted-foreground">Staked Amount</span>
            <span className="font-medium">
              {userState ? `${userState.stakedAmount.toString()} USDC` : '0 USDC'}
            </span>
          </div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-muted-foreground">Credit Line</span>
            <span className="font-medium text-lg">
              {userState ? `${userState.creditLine.toString()} USDC` : '0 USDC'}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowStakingModal(true)}
          className="w-full glass-button"
        >
          Manage Staking
          <Coins className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6 animate-fade-in">
        <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="glass-card p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.time}</p>
              </div>
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium">${transaction.amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
             <p className="text-center text-muted-foreground">No transactions yet.</p>
          )}
        </div>
      </div>
      
      {showPurchaseModal && (
        <PurchaseModal 
          onClose={() => setShowPurchaseModal(false)} 
          onPurchase={addTransaction}
          remainingCredit={dailyLimit - creditUsed}
        />
      )}

      {showStakingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Manage Staking</h2>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleStake(100)}
                className="w-full"
              >
                Stake 100 USDC
              </Button>
              <Button
                onClick={() => handleUnstake(100)}
                className="w-full"
                variant="outline"
              >
                Unstake 100 USDC
              </Button>
              <Button
                onClick={() => setShowStakingModal(false)}
                className="w-full"
                variant="ghost"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
