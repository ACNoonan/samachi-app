import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Venue } from "@/models/Venue";

/**
 * @swagger
 * /api/venue/: 
 *  get:
 *    summary: Get all venues
 *    description: Gets array of Venue objects for all venues represented in the DB.
 *    responses:
 *      200:
 *        description: Array of Venue records
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Venue'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filter?: string } },
  supabase = createServerSupabaseClient()
) {
  const queryFilter = params.filter;

  const { data, error } = await supabase
    .from('venues')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * @swagger
 * /api/venue/:
 *  post:
 *    summary: Create new Venue record
 *    description: Create a single Venue record in the DB
 *    responses:
 *      201:
 *        description: Record creation succeeded; Venue object returned, including new venue_id
 *        content:
 *          application/json:
 *            schema:
 *              type: '#/components/schemas/Venue'
*/
export async function POST(
  request: NextRequest,
  { params }: { params: {} },
  supabase = createServerSupabaseClient()
) {
  // Parse request the body
  const body = await request.json();
  const venue: Venue = body;

  // check usage
  console.log('==== POST /api/api/venue/ ====')
  console.log('Inserting Venue record:', venue);

  let { data, error } = await supabase
    .from('venues')
    .insert(
      {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        glownet_venue_id: venue.glownet_venue_id,
        // primary_contact: venue.primary_contact,
        // secondary_contact: venue.secondary_contact,
        created_at: venue.created_at,
        updated_at: venue.updated_at,
      }
    )
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Update stake
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}

// Unstake token
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}
