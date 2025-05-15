import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/staking/[user_id]: 
 *  get:
 *    summary: Get staked balance by user_id
 *    description: Gets current balance for the user_id specified in the route.
 *    responses:
 *      200:
 *        description: Success response.
 *        content:
 *          application/json:
 *            type: number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> },
) {
  const { user_id } = await params;
  return NextResponse.json({ message: `Hello ${user_id}!` });
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
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}

// Update stake
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}

// Unstake token
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}
