'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { XCircle, ChevronDown, Check, ChevronRight, Coins } from 'lucide-react';
import { useSolana } from '@/app/context/SolanaContext';
import { useToast } from '@/app/components/ui/use-toast';
import { Input } from '@/app/components/ui/input';

interface StakingModalProps {
  onClose: () => void;
}

export const StakingModal: React.FC<StakingModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'stake' | 'unstake'>('stake');
  const [isProcessing, setIsProcessing] = useState(false);
  const { userState, stake, unstake } = useSolana();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!amount) return;

    try {
      setIsProcessing(true);
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive",
        });
        return;
      }

      if (action === 'stake') {
        await stake(amountNum);
        toast({
          title: "Success",
          description: "Successfully staked USDC",
        });
      } else {
        await unstake(amountNum);
        toast({
          title: "Success",
          description: "Successfully unstaked USDC",
        });
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bottom-sheet max-w-md w-full z-10 bg-black text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {action === 'stake' ? 'Stake USDC' : 'Unstake USDC'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <XCircle className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-400 mb-6">
            {action === 'stake' 
              ? 'Stake USDC to increase your available credit line'
              : 'Unstake USDC to withdraw from your credit line'}
          </p>

          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block text-gray-300">
              Amount (USDC)
            </label>
            <div className="relative">
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 pr-16 rounded-xl bg-gray-900 border border-gray-700 text-xl font-medium text-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                USDC
              </div>
            </div>
            <div className="mt-2 flex justify-between">
              <div className="text-xs text-gray-400">
                Available: {userState ? userState.stakedAmount.toString() : '0'} USDC
              </div>
              <button 
                className="text-xs text-primary font-medium"
                onClick={() => setAmount(userState ? userState.stakedAmount.toString() : '0')}
              >
                MAX
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <Button
              type="button"
              variant={action === 'stake' ? 'default' : 'outline'}
              onClick={() => setAction('stake')}
              className="flex-1"
            >
              Stake
            </Button>
            <Button
              type="button"
              variant={action === 'unstake' ? 'default' : 'outline'}
              onClick={() => setAction('unstake')}
              className="flex-1"
            >
              Unstake
            </Button>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            className="w-full glass-button"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <>
                {action === 'stake' ? 'Stake' : 'Unstake'} USDC
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {userState && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-white">Current Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Staked Amount</span>
                <span className="font-medium text-white">
                  {userState.stakedAmount.toString()} USDC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Credit Line</span>
                <span className="font-medium text-white">
                  {userState.creditLine.toString()} USDC
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
