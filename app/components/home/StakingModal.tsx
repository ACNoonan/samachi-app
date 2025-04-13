'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { XCircle, ChevronDown, Check, ChevronRight } from 'lucide-react';

interface StakingModalProps {
  onClose: () => void;
}

const cryptoOptions = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '💵' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '💰' },
  // Add SOL or other relevant cryptos if needed
  // { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '☀️' }, 
];

export const StakingModal: React.FC<StakingModalProps> = ({ onClose }) => {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);

  const handleStake = () => {
    setStep(2);
    // TODO: Add actual staking logic here (e.g., call backend/contract)
    console.log(`Simulating stake of ${amount} ${selectedCrypto.symbol}`);
    setTimeout(() => {
      // TODO: Update user balance/state after successful stake
      onClose();
    }, 2000);
  };

  // Type the event
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bottom-sheet max-w-md w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 1 ? 'Stake Crypto' : 'Confirming Stake'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5"
          >
            <XCircle className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {step === 1 ? (
          <>
            <p className="text-muted-foreground mb-6">
              Stake assets to increase your available credit line
            </p>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">
                Select Asset
              </label>
              <button
                onClick={() => setShowCryptoSelector(!showCryptoSelector)}
                className="w-full p-3 rounded-xl bg-white flex items-center justify-between border border-gray-200"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{selectedCrypto.icon}</span>
                  <div>
                    <div className="font-medium">{selectedCrypto.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedCrypto.symbol}</div>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCryptoSelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showCryptoSelector && (
                <div className="mt-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                  {cryptoOptions.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => {
                        setSelectedCrypto(crypto);
                        setShowCryptoSelector(false);
                      }}
                      className="w-full p-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{crypto.icon}</span>
                        <div className="font-medium">{crypto.name}</div>
                      </div>
                      {selectedCrypto.id === crypto.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="text-sm font-medium mb-2 block">
                Amount
              </label>
              <div className="relative">
                <input 
                  type="number"
                  value={amount}
                  // onChange={(e) => setAmount(e.target.value)} // Replace
                  onChange={handleAmountChange} // Use typed handler
                  placeholder="0.00"
                  className="w-full p-3 pr-16 rounded-xl bg-white border border-gray-200 text-xl font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {selectedCrypto.symbol}
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="text-xs text-muted-foreground">
                  {/* TODO: Replace with actual available balance */}
                  Available: 2.5 {selectedCrypto.symbol} 
                </div>
                <button className="text-xs text-primary font-medium">
                  MAX
                </button>
              </div>
            </div>

            <Button 
              onClick={handleStake}
              disabled={!amount || parseFloat(amount) <= 0} // Add amount validation
              className="w-full glass-button"
            >
              Stake {selectedCrypto.symbol}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium mb-2">Processing Your Stake</h3>
            <p className="text-muted-foreground mb-4">
              Please wait while we process your {amount} {selectedCrypto.symbol} stake
            </p>
            <div className="text-sm text-muted-foreground">
              This may take a few moments to complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
