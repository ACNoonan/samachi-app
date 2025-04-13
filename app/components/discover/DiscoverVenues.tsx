'use client';

import React, { useState, useEffect } from 'react';
import { List, Map, Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { VenueList } from './VenueList';
import { VenueMap } from './VenueMap';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import { Terminal } from "lucide-react"

// Define the expected structure of a Venue (used for both fetched and mock)
interface Venue {
  id: string; // Supabase ID or mock ID
  name: string;
  description: string | null;
  address: string | null; // Real data uses address
  location?: string | null; // Mock data used location
  image_url: string | null; // Real data uses image_url
  image?: string | null; // Mock data used image
  glownet_event_id?: number | null; // Real data has this, make optional for mock
  // Add other fields if returned by /api/venues
}

// Align mock data with the Venue interface
const mockVenueData: Venue[] = [
  {
    id: 'mock-1', name: 'El Noviciado (Mock)', location: 'Social Club, Madrid', description: 'Mock description...',
    image: '/novi1.png', address: 'Mock Address 1', image_url: null, glownet_event_id: null
  },
  {
    id: 'mock-2', name: 'Bloom Festival (Mock)', location: 'Festival, Malta', description: 'Mock description...',
    image: '/bloom-festival.png', address: 'Mock Address 2', image_url: null, glownet_event_id: null
  },
  {
    id: 'mock-3', name: 'Barrage Club (Mock)', location: 'Nightclub, Greece', description: 'Mock description...',
    image: '/barrage-club.png', address: null, image_url: '/barrage-club.png', glownet_event_id: null // Example using image_url
  },
  {
    id: 'mock-4', name: 'Berhta Club (Mock)', location: 'Social Club, Washington D.C.', description: 'Mock description...',
    image: '/bertha-club.png', address: 'Mock Address 4', image_url: null, glownet_event_id: null
  },
];

export function DiscoverVenues() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]); // Start empty, fill with fetched or mock
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      setError(null);
      setUsingMockData(false); // Reset mock data flag
      try {
        const response = await fetch('/api/venues');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch venues' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: Venue[] = await response.json();

        if (data && data.length > 0) {
            console.log("Using fetched venue data.");
            setVenues(data);
        } else {
            console.log("No real venue data found, falling back to mock data.");
            setVenues(mockVenueData);
            setUsingMockData(true);
        }

      } catch (err: any) {
        console.error("Error fetching venues, falling back to mock data:", err);
        setError(err.message || 'An unexpected error occurred.');
        setVenues(mockVenueData); // Fallback to mock data on error
        setUsingMockData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues (either real or mock) based on search query
  const filteredVenues = venues.filter(venue =>
    (venue.name && venue.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (venue.address && venue.address.toLowerCase().includes(searchQuery.toLowerCase())) || // Search real address
    (venue.location && venue.location.toLowerCase().includes(searchQuery.toLowerCase())) // Search mock location
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
             <AlertTitle>Error Fetching Real Data</AlertTitle>
             <AlertDescription>
                 {error} {usingMockData ? "Displaying placeholder data instead." : ""}
             </AlertDescription>
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
                    {searchQuery ? `No venues match your search "${searchQuery}".` : (usingMockData ? "No placeholder venues found." : "No venues available.")}
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
