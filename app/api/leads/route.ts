import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("Lead submission:", data);
  return NextResponse.json({ success: true });
}
