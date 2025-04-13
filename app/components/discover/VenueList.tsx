'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ExternalLink, Building } from 'lucide-react';

// Align Venue type with DiscoverVenues.tsx
interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  location?: string | null; // Optional field from mock data
  image_url: string | null;
  image?: string | null; // Optional field from mock data
  glownet_event_id?: number | null; // Make optional/nullable
}

// Update props to accept the filtered venues array
interface VenueListProps {
  venues: Venue[];
}

// Remove React.FC typing for consistency, destructure venues prop
export function VenueList({ venues }: VenueListProps) {
  const router = useRouter();

  // Filtering is now done in the parent component
  // Removed useMemo and filteredVenues logic

  const handleVenueClick = (venueId: string) => {
    // Navigate to venue detail - ID could be mock or real
    // Query params aren't needed when navigating *from* discover list
    router.push(`/venue/${venueId}`);
  };

  // Handle case where the filtered list passed from parent is empty
  if (venues.length === 0) {
    return <p className="text-center text-muted-foreground">No venues to display.</p>;
    // Or return null if the parent handles the "no results" message entirely
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
             {/* Prefer image_url, fallback to image, then show placeholder */}
            {(venue.image_url || venue.image) ? (
                <img
                src={venue.image_url || venue.image!} // Use non-null assertion as one must exist
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
              {/* Prefer address, fallback to location */}
              {venue.address || venue.location || 'Location not specified'}
            </p>
            <p className="text-sm mb-3">{venue.description || 'No description available.'}</p>
            <button className="text-primary text-sm font-medium flex items-center hover:underline">
              View Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      ))}
      {/* Removed redundant no venues found message here, handled above or in parent */}
    </div>
  );
}
