'use client';

import React, { useState, useEffect } from 'react';
import { List, Map, Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { VenueList } from './VenueList';
import { VenueMap } from './VenueMap';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Terminal } from "lucide-react";

// Define the expected structure of a Venue from Supabase
interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
  glownet_event_id: number | null;
}

export function DiscoverVenues() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/venues');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch venues' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Venue[] = await response.json();
        console.log(`DiscoverVenues: Fetched ${data.length} venues from Supabase.`);
        setVenues(data || []);
      } catch (err: any) {
        console.error("Error fetching venues:", err);
        setError(err.message || 'An unexpected error occurred.');
        setVenues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues based on search query
  const filteredVenues = venues.filter(venue =>
    (venue.name && venue.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (venue.address && venue.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-5/6" />
      </div>
    );
  }

  const noVenuesToShow = filteredVenues.length === 0;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">Discover</h1>

      {error && (
          <Alert variant="destructive" className="mb-4">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Error Fetching Venues</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto md:flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                type="search"
                placeholder="Search venues by name or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full"
            />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
           <button
             onClick={() => setView('list')}
             className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${ view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground' }`}
           >
             <List className="h-4 w-4 mr-1.5" />
             List
           </button>
           <button
             onClick={() => setView('map')}
              className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${ view === 'map' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground' }`}
           >
             <Map className="h-4 w-4 mr-1.5" />
             Map
           </button>
        </div>
      </div>

      {noVenuesToShow ? (
             <Alert className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>No Venues Found</AlertTitle>
                <AlertDescription>
                    {searchQuery ? `No venues match your search "${searchQuery}".` : "No venues available."}
                </AlertDescription>
            </Alert>
        ) : (
            <div className="animate-fade-in">
                {view === 'list' ? <VenueList venues={filteredVenues} /> : <VenueMap venues={filteredVenues} />}
            </div>
        )}
    </div>
  );
}