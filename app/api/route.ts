import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: {} },
): Promise<NextResponse<{ message: string; }>> {

  return NextResponse.json({ message: `Hello!` });
}
