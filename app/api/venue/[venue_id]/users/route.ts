import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/venue/[venue_id]/users: 
 *  get:
 *    summary: Get all Users for Venue
 *    description: Gets array of all Users associated with the Venue specified by venue_id.
 *    parameters:
 *      - in: path
 *        name: venue_id
 *        required: true
 *        schema:
 *          type: string
 *        description: Venue ID
 *    responses:
 *      200:
 *        description: List of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { venue_id: string } },
) {
  const venueId = params.venue_id;
  console.log(`Request to fetch all users attached to venue ${venueId}`);

  return NextResponse.json({ message: `Fetching users for venue ${venueId}!` });
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
  { params }: { params: { venue_id: string } },
) {
  // get the venue_id from the route
  const venueId = params.venue_id;

  // parse the request body and get the user_id
  const body = await request.json();
  const userId = body.user_id;

  // log
  console.log('Venue:', venueId);
  console.log('User:', userId);

  return NextResponse.json(
    { message: `Received ${userId} to add to venue ${venueId}` },
    { status: 201 }
  );
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
