import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

// Define types for cleaner code (adjust based on actual schema)
interface Venue {
  id: string;
  name: string;
  address?: string | null;
  image_url?: string | null;
  glownet_event_id: number;
}

interface MembershipWithVenue {
  id: string;
  status: string;
  glownet_customer_id: number;
  created_at: string;
  venues: Venue | null; // Relationship can be null if venue deleted
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Authenticate User using Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth Error fetching memberships:', authError);
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = user.id; // Get user ID from Supabase session

    // 2. Fetch Memberships with Venue Details for the authenticated user
    console.log(`Fetching memberships for user ID: ${userId}`);
    const { data: memberships, error } = await supabase
      .from('memberships')
      .select(`
        id,
        status,
        created_at,
        user_id, // Keep user_id selected for filtering
        venues (
          id,
          name,
          address,
          image_url
        )
      `)
      .eq('user_id', userId) // Filter by the authenticated user ID
      .order('created_at', { ascending: false })
      .returns<MembershipWithVenue[]>(); // Use the defined type

    if (error) {
      console.error(`Error fetching memberships for user ${userId}:`, error);
      return NextResponse.json({ error: 'Database error fetching memberships.' }, { status: 500 });
    }

    if (!memberships) {
      console.log(`No memberships found for user ${userId}. Returning empty array.`);
      return NextResponse.json([]);
    }

    console.log(`Successfully fetched ${memberships.length} memberships for user ${userId}.`);
    // Filter out memberships where the related venue might have been deleted
    const validMemberships = memberships.filter((m: MembershipWithVenue) => m.venues !== null);
    return NextResponse.json(validMemberships);

  } catch (err: any) {
     console.error('Unexpected error in GET /api/memberships:', err);
     return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
} 