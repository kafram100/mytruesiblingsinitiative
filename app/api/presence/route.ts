import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    online: 12,
    totalSupportSessions: 38900,
    countriesReached: 27,
    lastUpdated: new Date().toISOString(),
  });
}
