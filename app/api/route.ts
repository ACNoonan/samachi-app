import { NextRequest, NextResponse } from "next/server";

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
  { params }: { params: { slug: string } },
): Promise<NextResponse<{ message: string; }>> {
  const { slug } = await params;
  return NextResponse.json({ message: `Hello ${slug}!` });
}
