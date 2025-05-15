'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { XCircle, DollarSign, Check } from 'lucide-react';

interface PurchaseModalProps {
  onClose: () => void;
  onPurchase: (description: string, amount: number) => void;
  remainingCredit: number;
}

const purchaseOptions = [
  { id: 'drink', description: 'Premium Cocktail', amount: 18 },
  { id: 'food', description: 'Appetizer Platter', amount: 45 },
  { id: 'booth', description: 'Booth Reservation', amount: 200 },
  { id: 'bottle', description: 'Premium Bottle Service', amount: 350 },
];

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ onClose, onPurchase, remainingCredit }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [error, setError] = useState<string | null>(null);
  
  const handlePurchase = () => {
    let description = '';
    let amount = 0;
    setError(null); // Clear previous errors
    
    if (selectedOption === 'custom') {
      description = customDescription || 'Custom Purchase';
      amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid positive amount for custom purchase.");
        return;
      }
    } else {
      const option = purchaseOptions.find(o => o.id === selectedOption);
      if (!option) {
        setError("Please select a purchase option.");
        return;
      }
      description = option.description;
      amount = option.amount;
    }

    if (amount > remainingCredit) {
      setError("Purchase amount exceeds remaining credit.");
      return;
    }
    
    setStep('processing');
    // TODO: Add actual API call to process purchase
    console.log(`Simulating purchase: ${description} for $${amount}`);
    
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPurchase(description, amount);
        onClose();
      }, 1500); // Show success message briefly
    }, 1500); // Simulate processing time
  };

  // Type the event handlers
  const handleCustomDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescription(e.target.value);
    setError(null); // Clear error on input change
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setError(null); // Clear error on input change
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bottom-sheet max-w-md w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 'select' && 'Make a Purchase'}
            {step === 'processing' && 'Processing'}
            {step === 'success' && 'Success!'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5"
            aria-label="Close modal"
          >
            <XCircle className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {step === 'select' && (
          <>
            <p className="text-muted-foreground mb-2">
              Simulate spending from your credit line
            </p>
            <p className="text-xs text-primary font-medium mb-6">
              ${remainingCredit.toFixed(2)} available credit
            </p>
            
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            <div className="space-y-3 mb-6">
              {purchaseOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setSelectedOption(option.id); setError(null); }}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    selectedOption === option.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/70'
                  }`}
                >
                  <span className="font-medium">{option.description}</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">${option.amount.toFixed(2)}</span>
                    {selectedOption === option.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => { setSelectedOption('custom'); setError(null); }}
                className={`w-full p-4 rounded-xl transition-all ${
                  selectedOption === 'custom'
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/70'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Custom Amount</span>
                  {selectedOption === 'custom' && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                {selectedOption === 'custom' && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      value={customDescription}
                      onChange={handleCustomDescriptionChange}
                      placeholder="Description (optional)"
                      className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="0.00"
                        className="w-full p-2 pl-7 rounded-lg border border-gray-200 text-sm"
                        min="0.01" // Basic validation
                        step="0.01"
                      />
                    </div>
                  </div>
                )}
              </button>
            </div>
            
            <Button 
              onClick={handlePurchase}
              disabled={!selectedOption || (selectedOption === 'custom' && !customAmount) || step !== 'select'}
              className="w-full glass-button"
            >
              Complete Purchase
              <DollarSign className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
        
        {step === 'processing' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium mb-2">Processing Transaction</h3>
            <p className="text-muted-foreground">
              Please wait while we process your purchase
            </p>
          </div>
        )}
        
        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Purchase Successful!</h3>
            <p className="text-muted-foreground">
              Your transaction has been completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
