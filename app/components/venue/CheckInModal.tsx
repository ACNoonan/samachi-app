'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { XCircle, Check, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { GlownetCustomer } from '@/lib/glownet';

interface CheckInModalProps {
  venue: {
    id: string;
    name: string;
    location: string;
  };
  membershipId: string;
  onClose: () => void;
}

type GlownetCheckInData = Pick<GlownetCustomer, 'money' | 'virtual_money' | 'balances'> | null;

export function CheckInModal({ venue, membershipId, onClose }: CheckInModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [glownetData, setGlownetData] = useState<GlownetCheckInData>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckIn = async () => {
    setStep('processing');
    setErrorMessage(null);
    setGlownetData(null);

    try {
      console.log(`Checking in membership ID: ${membershipId}`);
      const response = await fetch(`/api/memberships/${membershipId}/check-in`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Check-in failed: ${response.statusText}`);
      }

      const data: GlownetCustomer = await response.json();
      console.log("Glownet check-in successful, data:", data);
      setGlownetData({
          money: data.money,
          virtual_money: data.virtual_money,
          balances: data.balances
      });
      setStep('success');

    } catch (err: any) {
      console.error("Check-in API call failed:", err);
      setErrorMessage(err.message || 'An unexpected error occurred during check-in.');
      setStep('error');
    }
  };

  const handleContinue = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bottom-sheet max-w-md w-full z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 'confirm' && 'Confirm Check In'}
            {step === 'processing' && 'Checking In...'}
            {step === 'success' && 'Check In Successful!'}
            {step === 'error' && 'Check In Failed'}
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
              Checking in to <strong>{venue.name}</strong> ({venue.location}).
            </p>
            
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
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-medium mb-2">Processing Check In</h3>
            <p className="text-muted-foreground">
              Verifying your membership and fetching details...
            </p>
          </div>
        )}
        
        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Check In Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your details for {venue.name} are active.
            </p>
            <div className="glass-card p-4 mb-6 text-left text-sm space-y-2">
                 <h4 className="font-medium mb-1">Current Balances:</h4>
                 {glownetData?.money !== undefined && glownetData.money !== null ? (
                     <div className="flex justify-between">
                         <span>Cashless Credit:</span>
                         <span className="font-semibold">${(glownetData.money / 100).toFixed(2)}</span>
                     </div>
                 ) : null}
                 {glownetData?.virtual_money !== undefined && glownetData.virtual_money !== null ? (
                     <div className="flex justify-between">
                         <span>Virtual Credit:</span>
                         <span className="font-semibold">${(glownetData.virtual_money / 100).toFixed(2)}</span>
                     </div>
                 ) : null}
                 {glownetData?.balances && Object.keys(glownetData.balances).length > 0 && (
                     Object.entries(glownetData.balances).map(([key, value]) => (
                         <div key={key} className="flex justify-between">
                             <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                             <span className="font-semibold">{typeof value === 'number' ? (value / 100).toFixed(2) : String(value)}</span>
                         </div>
                     ))
                 )}
                {(glownetData?.money === undefined || glownetData?.money === null) && (glownetData?.virtual_money === undefined || glownetData?.virtual_money === null) && (!glownetData?.balances || Object.keys(glownetData.balances).length === 0) && (
                    <p className="text-muted-foreground text-xs text-center">No specific balances found.</p>
                )}
            </div>
            <Button 
              onClick={handleContinue}
              className="w-full glass-button"
            >
              View Venue Credit
            </Button>
          </div>
        )}
        
        {step === 'error' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Check In Failed</h3>
            <p className="text-muted-foreground mb-6">
              {errorMessage || 'An unknown error occurred.'}
            </p>
            <Button
              onClick={onClose}
              className="w-full glass-button bg-red-600 hover:bg-red-700 text-white"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
