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
  Check,  // Added for Action Card
  BadgeInfo, // Added for status
  Loader2, // Added for loading state
  LogOut // Added for Check Out button
} from "lucide-react"

import { cn } from "@/lib/utils" // Assuming utils path
import { Button } from "@/app/components/ui/button" // Corrected path
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card" // Corrected path
import { Separator } from "@/app/components/ui/separator" // Corrected path
import Image from 'next/image'; // Use Next Image
import { Skeleton } from "@/app/components/ui/skeleton"; // Corrected path
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"; // Corrected path
import { Badge } from "@/app/components/ui/badge"; // Added Badge
import { useToast } from "@/app/components/ui/use-toast"; // Added useToast
import { Terminal } from "lucide-react";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
// TODO: Uncomment if CheckInModal is used after successful check-in
// import { CheckInModal } from './CheckInModal';
import { useAuth } from '@/app/context/AuthContext'; // Use actual Auth context

// --- Mock Auth Context (Replace with actual context import) ---
// import { useAuth } from '@/app/context/AuthContext'; // Assuming path
// const useAuth = () => ({ user: { id: 'mock-user-id' } }); // MOCK: Removed this line
// --- End Mock Auth Context ---


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

// --- Membership Data Interface --- (NEW)
interface MembershipData {
  id: string;
  status: 'active' | 'checked-in' | 'inactive' | string; // Allow other statuses if needed
  // Add other relevant fields if the API returns them
}

// --- Main Venue Detail Component ---
export function VenueDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = params.venueId as string;
  // const membershipIdFromQuery = searchParams.get('membershipId'); // Keep if needed for other logic

  const [venue, setVenue] = useState<VenueDetailData | null>(null);
  const [membership, setMembership] = useState<MembershipData | null>(null); // NEW state for membership
  const [isLoadingVenue, setIsLoadingVenue] = useState(true);
  const [isLoadingMembership, setIsLoadingMembership] = useState(true); // NEW loading state for membership
  const [isCheckingIn, setIsCheckingIn] = useState(false); // NEW loading state for check-in
  const [isCheckingOut, setIsCheckingOut] = useState(false); // NEW state for check-out loading
  const [error, setError] = useState<string | null>(null);
  // const [showCheckInModal, setShowCheckInModal] = useState(false); // Keep if needed for modal

  const { toast } = useToast(); // Initialize toast
  const { user } = useAuth(); // Get user from Auth context

  // Fetch venue details
  useEffect(() => {
    if (!venueId) {
      setError('No Venue ID provided.');
      setIsLoadingVenue(false);
      return;
    }

    const fetchVenueDetails = async () => {
      setIsLoadingVenue(true);
      setError(null);
      try {
        // console.log(`Fetching details for venue ID: ${venueId}`);
        const response = await fetch(`/api/venues/${venueId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch venue: ${response.statusText}`);
        }
        const data: VenueDetailData = await response.json();
        // console.log("Fetched venue data:", data);
        setVenue(data);
      } catch (err: any) {
        console.error("Error fetching venue details:", err);
        setError(err.message || 'An unexpected error occurred fetching venue details.');
        setVenue(null);
      } finally {
        setIsLoadingVenue(false);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  // Fetch membership details (NEW)
  useEffect(() => {
    if (!venueId || !user?.id) {
      // Don't fetch if venueId or user is missing
      setIsLoadingMembership(false);
      return;
    }

    const fetchMembershipDetails = async () => {
      setIsLoadingMembership(true);
      // setError(null); // Don't clear venue errors here
      try {
        // console.log(`Fetching membership for user ${user.id} at venue ${venueId}`);
        // Assuming the memberships endpoint returns an array, filter by venueId client-side
        // OR adjust API to accept venueId query param like /api/memberships?venueId=...
        const response = await fetch(`/api/memberships?venueId=${venueId}`); // Adjust API endpoint if needed
        if (!response.ok) {
          // Handle non-200 responses gracefully, e.g., 404 might mean no membership
          if (response.status === 404 || response.status === 200 && (await response.clone().json()).length === 0) {
             setMembership(null); // No membership found or empty array returned
             return;
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch membership: ${response.statusText}`);
        }
        const data: MembershipData[] | MembershipData = await response.json(); // API might return single object or array

        // Find the specific membership for this venue
        const currentMembership = Array.isArray(data) ? data[0] : data;
        setMembership(currentMembership || null);

      } catch (err: any) {
        console.error("Error fetching membership details:", err);
        // Avoid overriding venue errors, maybe show a separate membership error?
        toast({
           title: "Error Fetching Membership",
           description: err.message || 'Could not load your membership status for this venue.',
           variant: "destructive",
        });
        setMembership(null);
      } finally {
        setIsLoadingMembership(false);
      }
    };

    fetchMembershipDetails();
  }, [venueId, user?.id, toast]); // Add dependencies


  // --- Handle Check-In --- (NEW)
  const handleCheckIn = async () => {
    if (!venueId) return;
    setIsCheckingIn(true);
    try {
      const response = await fetch('/api/memberships/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Check-in failed.');
      }

      // Update membership status locally on success
      setMembership(prev => prev ? { ...prev, status: 'checked-in' } : null);
      toast({
        title: "Check-in Successful!",
        description: `Funded with ${result.fundedAmount} USDC. Enjoy your time at ${venue?.name}! (${result.fundedAmount} available credit)`,
        variant: "default", // Or success variant if you have one
      });
      // Optionally open a modal or navigate
      // setShowCheckInModal(true);

    } catch (err: any) {
      console.error("Check-in error:", err);
      toast({
        title: "Check-in Failed",
        description: err.message || 'An unexpected error occurred during check-in.',
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  // --- Handle Check-Out --- (NEW)
  const handleCheckOut = async () => {
    if (!venueId) return;
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/memberships/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Check-out failed.');
      }

      // Update membership status locally on success
      setMembership(prev => prev ? { ...prev, status: 'active' } : null);
      toast({
        title: "Check-out Successful!",
        description: `Settled ${result.settledAmount} USDC. See you next time!`,
        variant: "default",
      });

    } catch (err: any) {
      console.error("Check-out error:", err);
      toast({
        title: "Check-out Failed",
        description: err.message || 'An unexpected error occurred during check-out.',
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };


  // --- Loading State ---
  if (isLoadingVenue) { // Only block initial render for venue loading
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-1/4 mb-4" /> {/* Back button area */}
        <Skeleton className="aspect-video w-full rounded-lg" /> {/* Image Swiper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-3/4" /> {/* Title */}
                <Skeleton className="h-6 w-1/2" /> {/* Location */}
                <Skeleton className="h-6 w-1/4" /> {/* Membership Status placeholder */}
                <Skeleton className="h-10 w-1/3" /> {/* Check-in Button placeholder */}
                <Separator className="my-4" />
                <Skeleton className="h-6 w-1/3 mb-2" /> {/* Section Title */}
                <Skeleton className="h-20 w-full" /> {/* Description */}
                <Separator className="my-4" />
                <Skeleton className="h-6 w-1/3 mb-2" /> {/* Section Title */}
                 <Skeleton className="h-24 w-full" /> {/* Amenities */}
            </div>
            <div className="lg:col-span-1">
                 <Skeleton className="h-48 w-full rounded-lg" /> {/* Action/Booking Card placeholder */}
            </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
         <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Venue</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- No Venue Data State ---
   if (!venue) {
    return (
      <div className="container mx-auto px-4 py-6">
         <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p>Venue data could not be loaded.</p>
      </div>
    );
   }

  // Process images (handle single URL or comma-separated string)
  const venueImages = venue.image_url
    ? venue.image_url.split(',').map(url => url.trim())
    : [];

  // --- Render Venue Details ---
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
       <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {/* Image Swiper */}
      <ImageSwiper images={venueImages} className="mb-6"/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{venue.name}</h1>

          {/* Location */}
          {venue.address && (
              <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  {venue.address}
              </div>
          )}

           {/* Membership Status & Action Buttons */}
           <div className="flex items-center gap-4 py-2">
             {isLoadingMembership ? (
               <Skeleton className="h-6 w-24" />
             ) : membership ? (
               <Badge variant={membership.status === 'checked-in' ? 'outline' : 'default'}>
                 <BadgeInfo className="mr-1 h-3 w-3" />
                 Status: {membership.status}
               </Badge>
             ) : (
               <Badge variant="secondary">
                 <BadgeInfo className="mr-1 h-3 w-3" />
                 No Active Membership
               </Badge>
             )}

             {/* Check-in Button */}
             {membership?.status === 'active' && (
               <Button
                 onClick={handleCheckIn}
                 disabled={isCheckingIn || isLoadingMembership}
                 size="sm"
               >
                 {isCheckingIn ? (
                   <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking In...</>
                 ) : (
                   <><Check className="mr-2 h-4 w-4" /> Check In</>
                 )}
               </Button>
             )}

             {/* Check-out Button (NEW) */}
             {membership?.status === 'checked-in' && (
                <Button
                  variant="outline" // Or another style
                  onClick={handleCheckOut} // Connect handler
                  disabled={isCheckingOut || isLoadingMembership} // Disable during loading
                  size="sm"
                >
                  {isCheckingOut ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking Out...</>
                  ) : (
                    <><LogOut className="mr-2 h-4 w-4" /> Check Out</> // Use LogOut icon
                  )}
                </Button>
             )}

           </div>

          <Separator className="my-6" />

          {/* Description */}
          {venue.description && (
            <div>
                <h2 className="text-xl font-semibold mb-2">About {venue.name}</h2>
                <p className="text-muted-foreground">
                    {venue.description}
                </p>
            </div>
          )}

          {/* Placeholder Amenities Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Amenity icon={<Wifi size={18}/>} label="Free WiFi" />
              <Amenity icon={<Car size={18}/>} label="Parking Available" />
              <Amenity icon={<Tv size={18}/>} label="Live Sports TV" />
              <Amenity icon={<UtensilsCrossed size={18}/>} label="Food Served" />
              <Amenity icon={<Coffee size={18}/>} label="Barista Coffee" />
              {/* Add more amenities based on actual data */}
            </div>
          </div>

           {/* Placeholder Host Info */}
           {venue.host_name && (
             <>
               <Separator className="my-6" />
               <div className="flex items-center gap-4">
                {venue.host_image_url ? (
                   <Image src={venue.host_image_url} alt={venue.host_name} width={50} height={50} className="rounded-full"/>
                 ) : (
                   <div className="w-[50px] h-[50px] rounded-full bg-muted flex items-center justify-center">
                     <Users className="h-6 w-6 text-muted-foreground"/>
                   </div>
                 )}
                 <div>
                   <p className="font-semibold">Hosted by {venue.host_name}</p>
                   <p className="text-sm text-muted-foreground">Joined in {new Date(venue.created_at).getFullYear()}</p>
                 </div>
               </div>
             </>
           )}

        </div>

        {/* Sidebar / Action Column */}
        <div className="lg:col-span-1 space-y-6">
            {/* Action Card Placeholder (can integrate check-in/check-out here too) */}
            <Card>
                <CardHeader>
                    {/* Could be dynamic title, e.g., Your Membership / Venue Actions */}
                    <h3 className="text-lg font-semibold">Venue Actions</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                     {/* Example actions - replace/enhance with real data */}
                     {venue.hours && (
                        <div className="flex items-center text-sm">
                           <Clock className="mr-2 h-4 w-4 text-muted-foreground" /> {venue.hours}
                        </div>
                     )}
                     {venue.phone && (
                        <div className="flex items-center text-sm">
                           <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {venue.phone}
                        </div>
                     )}
                     {venue.website && (
                        <div className="flex items-center text-sm">
                           <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                           <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
                              Visit Website
                           </a>
                        </div>
                     )}
                </CardContent>
                 <CardFooter>
                    {/* Potential footer action, e.g., Get Directions */}
                     <Button variant="outline" className="w-full">
                         <MapPin className="mr-2 h-4 w-4"/> Get Directions
                     </Button>
                 </CardFooter>
            </Card>
        </div>
      </div>

      {/* CheckInModal - Placeholder integration */}
      {/* <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        venueName={venue.name}
        // Pass other necessary props
      /> */}
    </div>
  )
}

// Helper function to get badge variant based on status (Example)
// const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" | "success" => {
//   if (!status) return "secondary";
//   switch (status.toLowerCase()) {
//     case 'active':
//       return "default";
//     case 'checked-in':
//       return "success"; // Assuming you add a success variant to Badge
//     case 'inactive':
//     case 'expired':
//       return "destructive";
//     default:
//       return "secondary";
//   }
// };
