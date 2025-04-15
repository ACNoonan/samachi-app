"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"
import {
  Share,
  MapPin,
  Users, // Kept for host info
  Calendar, // Kept for booking card placeholder
  ChevronLeft,
  ChevronRight,
  Wifi, // Example amenity
  Tv,   // Example amenity
  Coffee,// Example amenity
  Car,  // Example amenity
  UtensilsCrossed, // Example amenity
  Clock, // Added for Action Card
  Phone, // Added for Action Card
  Globe, // Added for Action Card
  Check  // Added for Action Card
} from "lucide-react"

import { cn } from "@/lib/utils" // Assuming utils path
import { Button } from "@/app/components/ui/button" // Corrected path
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card" // Corrected path
import { Separator } from "@/app/components/ui/separator" // Corrected path
import Image from 'next/image'; // Use Next Image
import { Skeleton } from "@/app/components/ui/skeleton"; // Corrected path
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"; // Corrected path
import { Terminal } from "lucide-react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckInModal } from './CheckInModal'; // Assuming CheckInModal is in the same directory

// --- Image Swiper Component ---
interface ImageSwiperProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[]
}

function ImageSwiper({ images, className, ...props }: ImageSwiperProps) {
  const [imgIndex, setImgIndex] = React.useState(0)
  const dragX = useMotionValue(0)

  const onDragEnd = () => {
    const x = dragX.get()
    if (x <= -10 && imgIndex < images.length - 1) {
      setImgIndex((prev) => prev + 1)
    } else if (x >= 10 && imgIndex > 0) {
      setImgIndex((prev) => prev - 1)
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground">No Image Available</span>
      </div>
    );
  }

  // Use only the first image if only one is provided
  if (images.length === 1) {
     return (
       <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg", className)} {...props}>
         <Image
           src={images[0]}
           alt={`Venue image 1`}
           fill
           style={{ objectFit: "cover" }}
           className="pointer-events-none"
           priority // Prioritize the main image
         />
       </div>
     );
   }


  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-lg", // Use aspect-video for better ratio
        className
      )}
      {...props}
    >
      {/* Swiper Buttons & Indicator */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {imgIndex > 0 && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 md:left-5">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto h-8 w-8 rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setImgIndex((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>
        )}

        {imgIndex < images.length - 1 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 md:right-5">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto h-8 w-8 rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setImgIndex((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-2 w-full flex justify-center">
          <div className="flex min-w-9 items-center justify-center rounded-md bg-black/80 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {imgIndex + 1}/{images.length}
          </div>
        </div>
      </div>

      {/* Swiper Images */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragMomentum={false}
        style={{ x: dragX }}
        animate={{ translateX: `-${imgIndex * 100}%` }}
        onDragEnd={onDragEnd}
        transition={{ damping: 18, stiffness: 90, type: "spring", duration: 0.2 }}
        className="flex h-full cursor-grab items-center rounded-[inherit] active:cursor-grabbing"
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            className="h-full w-full shrink-0 overflow-hidden bg-neutral-800 object-cover"
          >
            <Image
                src={src}
                alt={`Venue image ${i+1}`}
                fill
                style={{ objectFit: "cover" }}
                className="pointer-events-none"
                priority={i === 0} // Prioritize first image
              />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// --- Amenity Component ---
interface AmenityProps {
  icon: React.ReactNode
  label: string
}

function Amenity({ icon, label }: AmenityProps) {
  return (
    <div className="flex items-center gap-3"> {/* Increased gap */}
      <div className="text-muted-foreground">{icon}</div>
      <span>{label}</span>
    </div>
  )
}

// --- Venue Detail Data Interface (Matches API response) ---
interface VenueDetailData {
  id: string;
  name: string;
  glownet_event_id: number | null;
  address: string | null;
  image_url: string | null; // Can be a single image URL or comma-separated list
  created_at: string;
  updated_at: string;
  description?: string | null; // Keep description
  // Add other fields that might be relevant from your 'venues' table
  // e.g., phone, website, hours, specific amenity flags
  phone?: string | null;
  website?: string | null;
  hours?: string | null;
  // Placeholder for host info - you'll need to fetch/join this if needed
  host_name?: string | null;
  host_image_url?: string | null;
}


// --- Main Venue Detail Component ---
export function VenueDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = params.venueId as string;
  const membershipIdFromQuery = searchParams.get('membershipId');

  const [venue, setVenue] = useState<VenueDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Fetch venue details
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
          // Use specific error message from API if available
          throw new Error(errorData.error || `Failed to fetch venue: ${response.statusText}`);
        }
        const data: VenueDetailData = await response.json();
        console.log("Fetched venue data:", data);
        setVenue(data);
      } catch (err: any) {
        console.error("Error fetching venue details:", err);
        // Set the specific error message for display
        setError(err.message || 'An unexpected error occurred.');
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
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-1/4" /> {/* Back button area */}
        <Skeleton className="aspect-video w-full rounded-lg" /> {/* Image Swiper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-3/4" /> {/* Title */}
                <Skeleton className="h-6 w-1/2" /> {/* Location */}
                <Skeleton className="h-20 w-full" /> {/* Description */}
                 <Skeleton className="h-24 w-full" /> {/* Amenities */}
            </div>
            <div className="lg:col-span-1">
                 <Skeleton className="h-64 w-full rounded-lg" /> {/* Booking Card */}
            </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
       <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
         <Alert variant="destructive" className="max-w-md mb-4">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Loading Venue</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
         <Button onClick={() => router.push('/discover')}>
           Back to Discover
         </Button>
       </div>
     );
  }

  // --- Venue Not Found State ---
  if (!venue) {
     return (
       <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
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

   // Prepare image array (handle single or multiple images)
   const venueImages = venue.image_url
       ? venue.image_url.split(',').map((url: string) => url.trim()) // Added type for url
       : []; // Default to empty array if no image_url


  // Prepare data for CheckInModal
  const checkInVenueData = {
      id: venue.id,
      name: venue.name,
      location: venue.address || 'Location not specified'
  };


  return (
    <div className="bg-background min-h-screen">
      {/* Simplified Header (Back button only) */}
      <header className="max-w-lg mx-auto px-4 pt-4"> {/* Constrain header */}
         <Button variant="ghost" size="icon" onClick={() => router.back()} className="mb-4">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-10"> {/* Constrain main, remove container */}
        {/* Image Gallery - Now using ImageSwiper */}
        <div className="mb-6">
          <ImageSwiper images={venueImages} />
        </div>

        {/* Single Column Layout - Removed grid */}
        
          {/* Details Section - Removed lg:col-span-2 */}
          <div className="mb-8"> {/* Added margin-bottom */} 
             {/* Title & Location Section */}
             <div className="mb-6 pb-6 border-b">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{venue.name}</h1>
                <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{venue.address || 'Location not specified'}</span>
                </div>
             </div>

             {/* Host Info (Placeholder) - Adapt if you have host data */}
             { (venue.host_name || venue.host_image_url) && (
                 <div className="flex items-center justify-between pb-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold">Hosted by {venue.host_name || 'the venue'}</h2>
                         {/* Add more host details if available */}
                    </div>
                    {venue.host_image_url && (
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                        <Image
                            src={venue.host_image_url}
                            alt={venue.host_name || 'Host'}
                            width={48}
                            height={48}
                            style={{ objectFit: "cover" }}
                            className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                 </div>
             )}

            {/* Description */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-3">About this venue</h2>
              <p className="text-base leading-relaxed whitespace-pre-line">
                  {venue.description || 'No description available.'}
              </p>
              {/* Add 'Read more' functionality if descriptions are long */}
            </div>

            {/* Amenities (Placeholder - Adapt based on your actual venue data) */}
            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {/* Example amenities - Replace/populate based on venue data */}
                <Amenity icon={<Wifi className="h-5 w-5" />} label="Wifi Available" />
                <Amenity icon={<Car className="h-5 w-5" />} label="Parking Onsite" />
                <Amenity icon={<UtensilsCrossed className="h-5 w-5" />} label="Food Served" />
                {/* Add more based on your data structure */}
              </div>
              {/* <Button variant="outline" className="mt-6">Show all amenities</Button> */}
            </div>
          </div>

          {/* Action Card Section - Moved here, removed lg:col-span-1 */}
          <div> {/* Removed sticky container */} 
            <Card className="shadow-lg border">
              <CardHeader className="pb-4">
                 {/* Simplified Header - maybe just title or key info */}
                 <h3 className="text-lg font-semibold">Venue Actions</h3>
              </CardHeader>
              <CardContent>
                 {/* Add relevant info like hours, phone, website if available */} 
                  {venue.hours && (
                     <div className="flex items-center text-sm mb-2">
                         <Clock className="h-4 w-4 mr-2 text-muted-foreground" /> 
                         <span>{venue.hours}</span>
                     </div>
                  )}
                   {venue.phone && (
                     <div className="flex items-center text-sm mb-2">
                         <Phone className="h-4 w-4 mr-2 text-muted-foreground" /> 
                         <span>{venue.phone}</span>
                     </div>
                  )}
                   {venue.website && (
                     <div className="flex items-center text-sm mb-4">
                         <Globe className="h-4 w-4 mr-2 text-muted-foreground" /> 
                         <a href={!venue.website.startsWith('http') ? `https://${venue.website}` : venue.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                             {venue.website}
                          </a>
                     </div>
                  )}
                  
                 <Separator className="my-4" /> {/* Added Separator */} 

                 <Button
                   onClick={() => setShowCheckInModal(true)}
                   className="w-full"
                   disabled={!membershipIdFromQuery} // Disable if no membershipId in URL
                 >
                   Check In Now
                   <Check className="ml-2 h-4 w-4" /> 
                 </Button>
                 {!membershipIdFromQuery && (
                     <p className="text-xs text-center text-muted-foreground mt-2">
                         Access via Memberships to check in
                     </p>
                 )}
               </CardContent>
            </Card>
          </div>
        {/* End Single Column Layout */}
      </main>

      {/* Render CheckInModal */}
       {showCheckInModal && membershipIdFromQuery && (
         <CheckInModal
           venue={checkInVenueData}
           membershipId={membershipIdFromQuery}
           onClose={() => setShowCheckInModal(false)}
         />
       )}
       {/* Optional: Handle case where Check In is clicked without membershipId */}
       {showCheckInModal && !membershipIdFromQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowCheckInModal(false)} />
              <div className="bg-background p-6 rounded-lg shadow-xl z-10 max-w-sm w-full border">
                  <h3 className="text-lg font-semibold mb-2">Cannot Check In</h3>
                  <p className="text-sm text-muted-foreground mb-4">Membership details not found. Please access this venue through your dashboard membership list.</p>
                  <Button onClick={() => setShowCheckInModal(false)} className="w-full">Close</Button>
              </div>
          </div>
       )}
    </div>
  );
}
