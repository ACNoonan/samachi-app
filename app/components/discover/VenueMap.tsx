'use client';

import React from 'react';
import { Building } from 'lucide-react';

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
  coords?: { lat: number; lng: number }; // Keep coords if needed for map
}

// Update props to accept the filtered venues array
interface VenueMapProps {
  venues: Venue[];
}

// Remove React.FC typing for consistency, destructure venues prop
export function VenueMap({ venues }: VenueMapProps) {

  // Filtering is now done in the parent component
  // Removed useMemo and filteredVenues logic

  // Handle case where the filtered list passed from parent is empty
  if (venues.length === 0) {
     // Potentially show a simplified map or a message
     return (
         <div className="glass-card h-96 relative overflow-hidden flex items-center justify-center">
             <p className="text-muted-foreground">No venues to display on the map.</p>
         </div>
     );
  }

  // TODO: Implement actual map rendering using the 'venues' prop
  // - Use a library like Leaflet, Mapbox GL JS, or Google Maps React component.
  // - Iterate over 'venues' to place markers (using venue.coords if available).
  // - Add popups or interactions on marker click.

  return (
    <div className="glass-card h-96 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gray-100 relative">
          {/* Simple map placeholder - REMAINS PLACEHOLDER */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full opacity-70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M100,100 h800 v300 h-800 Z" fill="#E5E7EB" stroke="#9CA3AF" />
            <text x="500" y="250" fontSize="20" textAnchor="middle" fill="#6B7280">
              Map Area (Interactive Map Coming Soon)
            </text>
          </svg>

          {/* Display count based on passed venues */}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded shadow">
            <p className="text-xs text-muted-foreground">
              Displaying {venues.length} venue(s)
            </p>
          </div>

          {/* Placeholder for markers - using passed venues */}
          {venues.map((venue, index) => (
            <div
              key={venue.id}
              className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md cursor-pointer hover:scale-125 transition-transform"
              style={{
                // Use actual coords if available, otherwise fallback to random-ish positions
                left: venue.coords ? `${(venue.coords.lng + 180) / 3.6}%` : `${20 + index * 10}%`, // Basic scaling for demo
                top: venue.coords ? `${90 - (venue.coords.lat + 90) / 1.8}%` : `${40 + (index % 2) * 20}%`, // Basic scaling for demo
               }}
               // Use address or location for title
              title={`${venue.name || 'Venue'} - ${venue.address || venue.location || 'Location N/A'}`}
              // TODO: Add onClick to show popup or navigate
            ></div>
          ))}

        </div>
      </div>
    </div>
  );
}