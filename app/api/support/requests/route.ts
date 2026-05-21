import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getSupportRequests } from "@/lib/support";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const requests = await getSupportRequests(user.id);
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Get support requests error:", err);
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}
