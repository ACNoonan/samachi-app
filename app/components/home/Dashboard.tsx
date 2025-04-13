'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { CreditCard, MapPin, Plus, Wallet, Building, Ticket, Info, ListChecks } from 'lucide-react';
import { StakingModal } from './StakingModal';
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Terminal } from "lucide-react";

// Define the structure of the membership data returned by /api/memberships
interface Membership {
  id: string; // Membership UUID
  status: string;
  glownet_customer_id: number | null;
  created_at: string;
  venues: {
    id: string; // Venue UUID
    name: string;
    address: string | null;
    image_url: string | null;
    glownet_event_id: number | null;
  } | null; // Venue can be null if join failed, filter applied in API
}

export function Dashboard() {
  const router = useRouter();
  const [showStakingModal, setShowStakingModal] = useState(false);
  
  // State for memberships
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(true);
  const [membershipsError, setMembershipsError] = useState<string | null>(null);

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

  // Fetch memberships on component mount
  useEffect(() => {
    const fetchMemberships = async () => {
      setIsLoadingMemberships(true);
      setMembershipsError(null);
      try {
        console.log("Dashboard: Fetching user memberships...");
        const response = await fetch('/api/memberships');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch memberships: ${response.statusText}`);
        }
        const data: Membership[] = await response.json();
        console.log(`Dashboard: Fetched ${data.length} memberships.`);
        setMemberships(data || []); // Ensure it's an array
      } catch (err: any) {
        console.error("Dashboard: Error fetching memberships:", err);
        setMembershipsError(err.message || 'An unexpected error occurred.');
        setMemberships([]);
      } finally {
        setIsLoadingMemberships(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleMembershipClick = (venueId: string, membershipId: string) => {
    // Navigate to venue detail page, passing membershipId as query param
    router.push(`/venue/${venueId}?membershipId=${membershipId}`);
  };

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

      <div className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold mb-3">Your Memberships</h2>
        {isLoadingMemberships ? (
            <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
            </div>
        ) : membershipsError ? (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Loading Memberships</AlertTitle>
                <AlertDescription>{membershipsError}</AlertDescription>
            </Alert>
        ) : memberships.length === 0 ? (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Memberships Yet</AlertTitle>
                <AlertDescription>
                    Claim a card or visit the discover page to find venues.
                    <Link href="/discover"><Button variant="link" className="p-0 h-auto ml-1">Discover Venues</Button></Link>
                </AlertDescription>
            </Alert>
        ) : (
            <div className="space-y-3">
                {memberships.map((membership) => (
                    membership.venues && (
                        <div
                            key={membership.id}
                            className="glass-card p-4 flex items-center justify-between cursor-pointer hover:bg-white/70 transition-colors"
                            onClick={() => handleMembershipClick(membership.venues!.id, membership.id)}
                        >
                            <div className="flex items-center">
                                {membership.venues.image_url ? (
                                    <img src={membership.venues.image_url} alt={membership.venues.name} className="w-12 h-12 rounded-md object-cover mr-4"/>
                                ) : (
                                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center mr-4">
                                        <Building className="h-6 w-6 text-gray-400"/>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium">{membership.venues.name}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                       <MapPin className="h-3 w-3 mr-1" />
                                       {membership.venues.address || 'Location not specified'}
                                    </p>
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block ${membership.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {membership.status} 
                                    </span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                               View / Check In 
                            </Button>
                        </div>
                    )
                ))}
            </div>
        )}
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
}
