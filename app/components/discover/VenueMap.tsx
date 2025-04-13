'use client';

import React, { useMemo } from 'react';

// TODO: Replace with actual venues from the database, implement Map
const venues = [
  { id: '1', name: 'El Noviciado', location: 'Madrid', coords: { lat: 40.4168, lng: -3.7038 }, image: '/images/novi1.png' },
  { id: '2', name: 'Bloom Festival', location: 'Malta', coords: { lat: 35.9375, lng: 14.3754 }, image: '/images/bloom-festival.png' },
  { id: '3', name: 'Barrage Club', location: 'Greece', coords: { lat: 39.0742, lng: 21.8243 }, image: '/images/barrage-club.png' },
  { id: '4', name: 'Berhta Club', location: 'Washington D.C.', coords: { lat: 38.9072, lng: -77.0369 }, image: '/images/berhta-club.png' },
];

// Define props including searchQuery
interface VenueMapProps {
  searchQuery: string;
}

export const VenueMap: React.FC<VenueMapProps> = ({ searchQuery }) => {

  // Filter venues based on search query for map markers
  const filteredVenues = useMemo(() => {
    if (!searchQuery) {
      return venues;
    }
    // Simple filter for map, adjust as needed
    return venues.filter(venue => 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="glass-card h-96 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gray-100 relative">
          {/* Simple map placeholder */}
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full opacity-70"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Placeholder shapes */}
            <path d="M100,100 h800 v300 h-800 Z" fill="#E5E7EB" stroke="#9CA3AF" /> 
            {/* Basic World Representation (adjust as needed) */}
            <text x="500" y="250" fontSize="20" textAnchor="middle" fill="#6B7280">
              Map Area (Interactive Map Coming Soon)
            </text>
          </svg>

          {/* TODO: Integrate a real map library (Leaflet, Mapbox GL JS, Google Maps) */}
          {/* For now, just indicate filtered results */}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded shadow">
            <p className="text-xs text-muted-foreground">
              {filteredVenues.length} venue(s) found {searchQuery ? `matching "${searchQuery}"` : ''}
            </p>
          </div>

          {/* Placeholder for markers - replace with actual map markers */}
          {/* These positions are arbitrary for the placeholder */}
          {filteredVenues.map((venue, index) => (
            <div 
              key={venue.id}
              className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"
              style={{ 
                left: `${20 + index * 10}%`, // Example positioning
                top: `${40 + (index % 2) * 20}%`, // Example positioning
               }}
              title={`${venue.name} - ${venue.location}`}
            ></div>
          ))}

        </div>
      </div>
    </div>
  );
};
