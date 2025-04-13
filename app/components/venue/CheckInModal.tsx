'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { XCircle, Check, CreditCard } from 'lucide-react';

interface CheckInModalProps {
  venue: {
    id: string;
    name: string;
    location: string;
  };
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ venue, onClose }) => {
  const router = useRouter();
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  
  useEffect(() => {
    if (step === 'processing') {
      console.log(`Simulating check-in for venue: ${venue.id}`);
      const timer = setTimeout(() => {
        setStep('success');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [step, venue.id]);

  const handleCheckIn = () => {
    setStep('processing');
  };

  const handleContinue = () => {
    onClose();
    router.push(`/venue/${venue.id}/credit`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bottom-sheet max-w-md w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 'confirm' && 'Check In'}
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
        
        {step === 'confirm' && (
          <>
            <p className="text-muted-foreground mb-6">
              You're about to check in to {venue.name}
            </p>
            
            <div className="glass-card p-4 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{venue.name}</h3>
                  <p className="text-xs text-muted-foreground">{venue.location}</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Credit Line</span>
                  <span className="font-medium">$2,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Daily Limit</span>
                  <span className="font-medium">$1,000.00</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                Your crypto assets are staked as collateral for your credit line
              </div>
            </div>
            
            <Button 
              onClick={handleCheckIn}
              className="w-full glass-button"
            >
              Confirm Check In
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
        
        {step === 'processing' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium mb-2">Processing Check In</h3>
            <p className="text-muted-foreground">
              Please wait while we verify your membership
            </p>
          </div>
        )}
        
        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Check In Successful!</h3>
            <p className="text-muted-foreground mb-6">
              Your credit line is now active at {venue.name}
            </p>
            <Button 
              onClick={handleContinue}
              className="w-full glass-button"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
