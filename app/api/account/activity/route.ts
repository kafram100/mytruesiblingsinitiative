import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getUserActivity } from "@/lib/user-activity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const activity = await getUserActivity(user.id, limit);
    return NextResponse.json({ activity });
  } catch (err) {
    console.error("Activity error:", err);
    return NextResponse.json({ error: "Failed to load activity" }, { status: 500 });
  }
}
