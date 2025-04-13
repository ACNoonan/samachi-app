'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ExternalLink } from 'lucide-react';

// TODO: Replace with actual venues from the database
const venues = [
  {
    id: '1',
    name: 'El Noviciado',
    location: 'Social Club, Madrid',
    description: 'Exclusive social club with live music and intimate ambiance',
    image: '/novi1.png',
  },
  {
    id: '2',
    name: 'Bloom Festival',
    location: 'Festival, Malta',
    description: 'High-energy festival featuring world-class DJs and performers',
    image: '/bloom-festival.png',
  },
  {
    id: '3',
    name: 'Barrage Club',
    location: 'Nightclub, Greece',
    description: 'Beachfront club with stunning ocean views and premium service',
    image: '/barrage-club.png',
  },
  {
    id: '4',
    name: 'Berhta Club',
    location: 'Social Club, Washington D.C.',
    description: 'Sophisticated venue with elegant design and premium atmosphere',
    image: '/bertha-club.png',
  },
];

// Define props including searchQuery
interface VenueListProps {
  searchQuery: string;
}

export const VenueList: React.FC<VenueListProps> = ({ searchQuery }) => {
  const router = useRouter();

  // Filter venues based on search query
  const filteredVenues = useMemo(() => {
    if (!searchQuery) {
      return venues;
    }
    return venues.filter(venue => 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleVenueClick = (venueId: string) => {
    router.push(`/venue/${venueId}`);
  };

  return (
    <div className="space-y-4">
      {filteredVenues.map((venue) => (
        <div 
          key={venue.id} 
          className="glass-card overflow-hidden cursor-pointer"
          onClick={() => handleVenueClick(venue.id)}
        >
          <div className="h-48 relative overflow-hidden">
            <img 
              src={venue.image} 
              alt={venue.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{venue.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {venue.location}
            </p>
            <p className="text-sm mb-3">{venue.description}</p>
            <button className="text-primary text-sm font-medium flex items-center">
              View Details 
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      ))}
      {filteredVenues.length === 0 && (
        <p className="text-center text-muted-foreground">No venues found matching your search.</p>
      )}
    </div>
  );
};
