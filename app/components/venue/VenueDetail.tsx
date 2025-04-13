'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Star, MapPin, Calendar, Clock, Phone, Globe, 
  ChevronUp, Share2, Heart, Check 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CheckInModal } from './CheckInModal';
import Image from 'next/image';

// Mock venue data - in a real app, you'd fetch this based on the venueId
const venueData = {
  '1': {
    id: '1',
    name: 'Silk Club London',
    location: 'London, UK',
    address: '123 Highbridge Street, Mayfair, London',
    description: 'Exclusive rooftop lounge with panoramic city views and world-class mixology. Members enjoy priority seating and private event access.',
    rating: 4.8,
    hours: 'Mon-Sun: 6:00 PM - 2:00 AM',
    phone: '+44 20 1234 5678',
    website: 'silkclublondon.com',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=400&auto=format&fit=crop&q=60',
    ]
  },
  '2': {
    id: '2',
    name: 'Azure Lounge Miami',
    location: 'Miami, FL',
    address: '789 Ocean Drive, South Beach, Miami',
    description: 'Beachfront club with private cabanas and premium service. Stunning ocean views and signature cocktails.',
    rating: 4.7,
    hours: 'Thu-Sun: 8:00 PM - 4:00 AM',
    phone: '+1 305 987 6543',
    website: 'azureloungemia.com',
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&auto=format&fit=crop&q=60',
    ]
  },
  '3': {
    id: '3',
    name: 'Crystal Tokyo',
    location: 'Tokyo, Japan',
    address: '2-5-1 Roppongi, Minato City, Tokyo',
    description: 'Ultra-modern nightclub featuring world-class DJs and immersive light shows in the heart of Tokyo.',
    rating: 4.9,
    hours: 'Tue-Sun: 9:00 PM - 5:00 AM',
    phone: '+81 3 1234 5678',
    website: 'crystaltokyo.jp',
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?w=400&auto=format&fit=crop&q=60',
    ]
  },
  '4': {
    id: '4',
    name: 'Celestial Berlin',
    location: 'Berlin, Germany',
    address: '25 Friedrichstraße, Berlin',
    description: 'Industrial-chic techno venue with immersive lighting and underground atmosphere.',
    rating: 4.6,
    hours: 'Fri-Sun: 11:00 PM - 8:00 AM',
    phone: '+49 30 8765 4321',
    website: 'celestialberlin.de',
    images: [
      'https://images.unsplash.com/photo-1556035511-3168381ea4d4?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&auto=format&fit=crop&q=60',
    ]
  },
};

export const VenueDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const venueId = params.venueId as string;
  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [favorite, setFavorite] = useState(false);
  
  // Safety check
  if (!venueId || !venueData[venueId as keyof typeof venueData]) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-medium mb-4">Venue not found</p>
          <Button onClick={() => router.push('/discover')}>
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }
  
  const venue = venueData[venueId as keyof typeof venueData];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: venue.name,
          text: `Check out ${venue.name}!`,
          url: window.location.href, // Share current page URL
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
        // TODO: Show fallback share options or error message
      }
    } else {
      console.log('Web Share API not supported');
      // TODO: Show fallback (e.g., copy link button)
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header with back button */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex justify-between">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
              aria-label="Share venue"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setFavorite(!favorite)}
              className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md ${
                favorite ? 'bg-primary text-white' : 'bg-white/80'
              }`}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className="h-5 w-5" fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main image */}
      <div className="h-2/3 relative">
        <Image
          src={venue.images[0]}
          alt={venue.name}
          layout="fill"
          objectFit="cover"
          priority
          className="z-10"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent z-10" />
      </div>
      
      {/* Bottom sheet with venue details */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl rounded-t-3xl shadow-xl transition-transform duration-300 ease-in-out transform z-30 ${
          bottomSheetVisible ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
        }`}
        style={{ maxHeight: 'calc(100% - 60px)' }}
      >
        {/* Bottom sheet header with drag indicator */}
        <div 
          className="p-4 flex flex-col items-center cursor-grab"
          onClick={() => setBottomSheetVisible(!bottomSheetVisible)}
          aria-label={bottomSheetVisible ? "Collapse details" : "Expand details"}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
          
          <div className="flex justify-between items-start w-full">
            <div>
              <h1 className="text-xl font-semibold">{venue.name}</h1>
              <div className="flex items-center flex-wrap">
                <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                <p className="text-xs text-muted-foreground mr-2">{venue.location}</p>
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                <p className="text-xs font-medium">{venue.rating}</p>
              </div>
            </div>
            <ChevronUp className={`h-5 w-5 text-muted-foreground transition-transform ${
              bottomSheetVisible ? 'rotate-180' : 'rotate-0'
            }`} />
          </div>
        </div>
        
        {/* Bottom sheet content */}
        <div className="px-4 pb-32 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          <p className="text-sm mb-6">{venue.description}</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Hours</h3>
                <p className="text-xs text-muted-foreground break-words">{venue.hours}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Address</h3>
                <p className="text-xs text-muted-foreground break-words">{venue.address}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Contact</h3>
                <p className="text-xs text-muted-foreground break-words">{venue.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Website</h3>
                <a href={`https://${venue.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">
                  {venue.website}
                </a>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Gallery</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 scrollbar-none">
              {venue.images.map((image, index) => (
                <div key={index} className="min-w-[120px] h-20 rounded-lg overflow-hidden relative">
                  <Image 
                    src={image} 
                    alt={`${venue.name} gallery image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={() => setShowCheckInModal(true)}
            className="w-full glass-button"
          >
            Check In Now
            <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showCheckInModal && (
        <CheckInModal venue={venue} onClose={() => setShowCheckInModal(false)} />
      )}
    </div>
  );
};
