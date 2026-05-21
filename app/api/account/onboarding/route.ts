import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { logUserActivity } from "@/lib/user-activity";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user has completed onboarding:
    // 1. Has display_name or bio set
    // 2. Has at least one match request
    const [profileRows] = await db.execute(
      `SELECT display_name, bio FROM profiles WHERE id = ?`,
      [user.id]
    );
    const profile = (profileRows as { display_name: string | null; bio: string | null }[])[0];

    const [requestRows] = await db.execute(
      `SELECT COUNT(*) as count FROM match_requests WHERE user_id = ?`,
      [user.id]
    );
    const requestCount = Number((requestRows as { count: number }[])[0]?.count || 0);

    const hasProfile = !!profile?.display_name || !!profile?.bio;
    const hasMatchRequest = requestCount > 0;

    const completedSteps = [];
    if (hasProfile) completedSteps.push("profile");
    if (hasMatchRequest) completedSteps.push("match");

    return NextResponse.json({
      onboardingComplete: hasProfile && hasMatchRequest,
      completedSteps,
      totalSteps: 2,
    });
  } catch (err) {
    console.error("Onboarding check error:", err);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await logUserActivity(user.id, "onboarding_completed", "User completed onboarding");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding complete error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
