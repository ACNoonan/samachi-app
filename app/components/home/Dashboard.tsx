'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { CreditCard, MapPin, Plus, Wallet } from 'lucide-react';
import { StakingModal } from './StakingModal';

export const Dashboard: React.FC = () => {
  const router = useRouter();
  const [showStakingModal, setShowStakingModal] = useState(false);
  
  const featuredVenues = [
    { id: '1', name: 'El Noviciado', location: 'Social Club, Madrid', image: '/novi1.png' },
    { id: '2', name: 'Bloom Festival', location: 'Festival, Malta', image: '/bloom-festival.png' },
    { id: '3', name: 'Barrage Club', location: 'Nightclub, Greece', image: '/barrage-club.png' },
    { id: '4', name: 'Berhta Club', location: 'Social Club, Washington D.C.', image: '/bertha-club.png' },
  ];

  const stakedAmount = 1.25;
  const stakedSymbol = 'SOL';
  const availableCredit = 2500;
  const creditProgress = 80;

  return (
    <div className="flex flex-col pt-10 pb-20 px-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-1">Samachi Membership</h1>
        <p className="text-muted-foreground">Your VIP access is ready</p>
      </div>

      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Your Credit Line</h2>
            <p className="text-sm text-muted-foreground">Available for all venues</p>
          </div>
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Staked Amount</span>
            <span className="font-semibold">{stakedAmount} {stakedSymbol}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Available Credit</span>
            <span className="font-semibold text-lg">€{availableCredit.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${creditProgress}%` }}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowStakingModal(true)}
            className="flex-1 glass-button"
          >
            <Plus className="mr-2 h-4 w-4" /> Stake More
          </Button>
          <Button 
            onClick={() => router.push('/wallet')}
            variant="outline"
            className="flex-1 bg-white/50 backdrop-blur-sm hover:bg-white/60"
          >
            <Wallet className="mr-2 h-4 w-4" /> Wallet
          </Button>
        </div>
      </div>

      <div className="mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Featured Venues</h2>
          <Link href="/discover" className="text-primary text-sm font-medium">
            See All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-none">
          {featuredVenues.map((venue) => (
            <div key={venue.id} className="px-2 min-w-[250px]">
              <Link href={`/venue/${venue.id}`}>
                <div 
                  className="glass-card h-48 overflow-hidden relative block cursor-pointer"
                >
                  <img 
                    src={venue.image} 
                    alt={venue.name} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm">
                    <h3 className="text-base font-semibold mb-1 text-white">{venue.name}</h3>
                    <p className="text-xs text-white/80 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {venue.location}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {showStakingModal && (
        <StakingModal onClose={() => setShowStakingModal(false)} />
      )}
    </div>
  );
};
