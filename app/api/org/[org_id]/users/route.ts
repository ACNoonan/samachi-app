import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/org/[org_id]/users: 
 *  get:
 *    summary: Get all Users for Org
 *    description: Gets array of all Users associated with the Org specified by org_id.
 *    parameters:
 *      - in: path
 *        name: org_id
 *        required: true
 *        schema:
 *          type: string
 *        description: Organization ID
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
