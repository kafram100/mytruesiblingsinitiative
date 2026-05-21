import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { userId } = await params;

    const [rows] = await db.execute(
      `SELECT id, full_name, display_name, bio, avatar_url, pronouns, location_city, date_of_birth, role, created_at
       FROM profiles WHERE id = ?`,
      [userId]
    );
    const profile = (rows as Record<string, unknown>[])[0];
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get their most recent match request (if any)
    const [reqRows] = await db.execute(
      `SELECT pillar, support_type, interests, age_range, language
       FROM match_requests WHERE user_id = ? AND status IN ('pending', 'matched')
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    const matchRequest = (reqRows as Record<string, unknown>[])[0] || null;

    return NextResponse.json({
      profile: {
        id: profile.id,
        fullName: profile.full_name,
        displayName: profile.display_name,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        pronouns: profile.pronouns,
        location: profile.location_city,
        dateOfBirth: profile.date_of_birth,
        role: profile.role,
        memberSince: profile.created_at,
      },
      seeking: matchRequest
        ? {
            pillar: matchRequest.pillar,
            supportType: matchRequest.support_type,
            interests: typeof matchRequest.interests === "string"
              ? JSON.parse(matchRequest.interests as string)
              : matchRequest.interests,
            ageRange: matchRequest.age_range,
            language: matchRequest.language,
          }
        : null,
    });
  } catch (err) {
    console.error("Public profile error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
