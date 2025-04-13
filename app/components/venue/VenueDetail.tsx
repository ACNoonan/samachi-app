'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Star, MapPin, Calendar, Clock, Phone, Globe, 
  ChevronUp, Share2, Heart, Check 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CheckInModal } from './CheckInModal';
import Image from 'next/image';
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Terminal } from "lucide-react";

// Interface matching the expected API response from /api/venues/[venueId]
interface VenueDetailData {
  id: string; // UUID
  name: string;
  glownet_event_id: number | null;
  address: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  // Add other fields returned by the API if needed
  // Placeholder fields (if needed temporarily, but prefer real data)
  description?: string;
  rating?: number;
  hours?: string;
  phone?: string;
  website?: string;
  images?: string[];
}

// Mock venue data - Keep for reference or fallback during development
// const mockVenueData = { ... };

export function VenueDetail() { // Removed React.FC
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read query parameters
  const venueId = params.venueId as string;

  // Read membershipId from URL query parameter
  const membershipIdFromQuery = searchParams.get('membershipId');

  const [venue, setVenue] = useState<VenueDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [favorite, setFavorite] = useState(false); // Keep local state for favorite

  // ***** PLACEHOLDER: Fetch or determine the user's membership ID for this venue *****
  // In a real app, this might come from a user context, a parent component,
  // or another fetch useEffect based on profileId and venueId.
  const currentUserMembershipId: string | null = "mock-membership-uuid-123"; // Replace with actual logic
  // *******************************************************************************

  useEffect(() => {
    if (!venueId) {
      setError('No Venue ID provided.');
      setIsLoading(false);
      return;
    }

    const fetchVenueDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching details for venue ID: ${venueId}`);
        const response = await fetch(`/api/venues/${venueId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch venue: ${response.statusText}`);
        }
        const data: VenueDetailData = await response.json();
        console.log("Fetched venue data:", data);
        setVenue(data);
      } catch (err: any) {
        console.error("Error fetching venue details:", err);
        setError(err.message);
        setVenue(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  // --- Loading State --- 
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  // --- Error State --- 
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Venue</AlertTitle>
            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/discover')}>
          Back to Discover
        </Button>
      </div>
    );
  }

  // --- Venue Not Found State (handled by API, but good fallback) ---
  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Alert className="max-w-md mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Venue Not Found</AlertTitle>
            <AlertDescription>
                The requested venue could not be found.
            </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/discover')}>
          Back to Discover
        </Button>
      </div>
    );
  }

  // --- Render Venue Details (using fetched 'venue' state) ---

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

  // Prepare data for CheckInModal
  const checkInVenueData = {
      id: venue.id,
      name: venue.name,
      location: venue.address || 'Location not specified'
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
      
      {/* Main image - Use venue.image_url */} 
      <div className="h-2/3 relative bg-gray-300"> {/* Added background */} 
        {venue.image_url ? (
            <Image
            src={venue.image_url} // Use real image URL
            alt={venue.name}
            layout="fill"
            objectFit="cover"
            priority
            className="z-10"
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-gray-500">No Image Available</span>
            </div>
        )}
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
                <p className="text-xs text-muted-foreground mr-2">{venue.address || 'Address not available'}</p>
              </div>
            </div>
            <ChevronUp className={`h-5 w-5 text-muted-foreground transition-transform ${
              bottomSheetVisible ? 'rotate-180' : 'rotate-0'
            }`} />
          </div>
        </div>
        
        {/* Bottom sheet content */}
        <div className="px-4 pb-32 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          <p className="text-sm mb-6">{venue.description || 'No description available.'}</p>
          
          <div className="space-y-4 mb-6">
            {venue.hours && (
                <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <div><h3 className="text-sm font-medium">Hours</h3><p className="text-xs text-muted-foreground break-words">{venue.hours}</p></div>
                </div>
            )}
            
            {venue.address && (
                <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <div><h3 className="text-sm font-medium">Address</h3><p className="text-xs text-muted-foreground break-words">{venue.address}</p></div>
                </div>
            )}
            
            {venue.phone && (
                <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <div><h3 className="text-sm font-medium">Contact</h3><p className="text-xs text-muted-foreground break-words">{venue.phone}</p></div>
                </div>
            )}
            
            {venue.website && (
                <div className="flex items-start">
                    <Globe className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <div><h3 className="text-sm font-medium">Website</h3><a href={`https://${venue.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{venue.website}</a></div>
                </div>
            )}
          </div>
          
          <Button
            onClick={() => setShowCheckInModal(true)}
            className="w-full glass-button"
            disabled={!membershipIdFromQuery}
          >
            Check In Now
            <Check className="ml-2 h-4 w-4" />
          </Button>
          {!membershipIdFromQuery && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                    (You must access this page via your Memberships list to check in)
                </p>
            )}
        </div>
      </div>
      
      {/* Pass membershipId from query to modal */}
      {showCheckInModal && membershipIdFromQuery && (
        <CheckInModal
            venue={checkInVenueData}
            membershipId={membershipIdFromQuery}
            onClose={() => setShowCheckInModal(false)}
        />
      )}
       {/* Show message if check-in modal opened without ID (e.g., direct navigation) */}
       {showCheckInModal && !membershipIdFromQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowCheckInModal(false)} />
              <div className="bg-white p-6 rounded-lg shadow-xl z-10 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-2">Cannot Check In</h3>
                  <p className="text-sm text-muted-foreground mb-4">Membership details not found. Please access this venue through your dashboard membership list.</p>
                  <Button onClick={() => setShowCheckInModal(false)} className="w-full">Close</Button>
              </div>
          </div>
       )}
    </div>
  );
}
