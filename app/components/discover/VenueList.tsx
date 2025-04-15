'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ExternalLink, Building } from 'lucide-react';

// Define venue interface consistently with DiscoverVenues
interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
  glownet_event_id: number | null;
}

interface VenueListProps {
  venues: Venue[];
}

export function VenueList({ venues }: VenueListProps) {
  const router = useRouter();

  const handleVenueClick = (venueId: string) => {
    router.push(`/venue/${venueId}`);
  };

  if (venues.length === 0) {
    return <p className="text-center text-muted-foreground">No venues to display.</p>;
  }

  return (
    <div className="space-y-4">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className="glass-card overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          onClick={() => handleVenueClick(venue.id)}
        >
          <div className="h-48 relative overflow-hidden bg-gray-200">
            {venue.image_url ? (
                <img
                src={venue.image_url}
                alt={venue.name || 'Venue image'}
                className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <Building className="h-12 w-12 mb-2 text-gray-400"/>
                    <span>No Image</span>
                </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{venue.name || 'Unnamed Venue'}</h3>
            <p className="text-xs text-muted-foreground flex items-center mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {venue.address || 'Location not specified'}
            </p>
            <p className="text-sm mb-3">{venue.description || 'No description available.'}</p>
            <button className="text-primary text-sm font-medium flex items-center hover:underline">
              View Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
