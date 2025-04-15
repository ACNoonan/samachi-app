import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Use the server-side client

export const dynamic = 'force-dynamic'; // Force dynamic execution, disable caching

export async function GET(request: NextRequest) {
  // Await the cookies() call to get the actual store
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore); // Now pass the resolved store

  try {
    // Fetch all venues from the 'venues' table
    const { data: venues, error } = await supabase
      .from("venues")
      .select("id, name, address, image_url, glownet_event_id") // Adjust columns as needed
      .order("name", { ascending: true }); // Optional: order by name

    if (error) {
      console.error("Error fetching venues:", error);
      return NextResponse.json(
        { error: "Failed to fetch venues", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(venues || []);
  } catch (err) {
    console.error("Unexpected error in /api/venues:", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "An unexpected server error occurred", details: errorMessage },
      { status: 500 }
    );
  }
} 