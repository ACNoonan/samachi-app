import { NextRequest, NextResponse } from "next/server";

// Get balance by user_id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> },
) {
  const { user_id } = await params;
  return NextResponse.json({ message: `Hello ${user_id}!` });
}

// Stake token
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
