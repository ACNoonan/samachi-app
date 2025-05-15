import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
 * /api/staking/[user_id]:
 *  post:
 *    description: Stake an initial amount for specified user_id
 *    response:
 *      200:
 *        description: 
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  return NextResponse.json({ message: `Hello ${slug}!` });
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
