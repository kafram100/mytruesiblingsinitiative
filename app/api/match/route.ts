import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { validateOrigin } from "@/lib/csrf";
import { rateLimitByIp } from "@/lib/rate-limit";

const VALID_PILLARS = ["sibling-connect", "adult-safe-place", "inclusive-support-hub"];
const VALID_AGE_RANGES = ["0-6", "7-11", "12-17", "18-25", "26-45", "46-60", "60+"];
const VALID_SUPPORT_TYPES = ["mentorship", "peer-support", "crisis-companion", "community", "caregiver"];

function isValidString(val: unknown, maxLen: number): boolean {
  return typeof val === "string" && val.trim().length > 0 && val.length <= maxLen;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [requestRows] = await db.execute(
      `SELECT id, pillar, support_type, status, created_at, interests
       FROM match_requests WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user.id]
    );

    const [matchRows] = await db.execute(
      `SELECT m.id, m.request_id, m.matched_user_id, m.score, m.status, m.created_at,
              p.id as other_user_id,
              p.full_name as other_user_name, p.display_name as other_display_name,
              p.avatar_url as other_user_avatar, p.bio as other_bio,
              p.pronouns as other_pronouns, p.location_city as other_location,
              p.date_of_birth as other_date_of_birth,
              mr2.pillar as other_pillar, mr2.support_type as other_support_type,
              mr2.interests as other_interests, mr2.age_range as other_age_range,
              mr2.language as other_language
       FROM matches m
       JOIN match_requests mr ON mr.id = m.request_id
       JOIN profiles p ON p.id = m.matched_user_id
       LEFT JOIN match_requests mr2 ON mr2.user_id = m.matched_user_id AND mr2.status IN ('matched', 'pending')
       WHERE mr.user_id = ? AND m.status = 'pending'
       ORDER BY m.created_at DESC`,
      [user.id]
    );

    const [incomingRows] = await db.execute(
      `SELECT m.id, m.request_id, m.matched_user_id, m.score, m.status, m.created_at,
              p.id as other_user_id,
              p.full_name as other_user_name, p.display_name as other_display_name,
              p.avatar_url as other_user_avatar, p.bio as other_bio,
              p.pronouns as other_pronouns, p.location_city as other_location,
              p.date_of_birth as other_date_of_birth,
              mr.pillar as other_pillar, mr.support_type as other_support_type,
              mr.interests as other_interests, mr.age_range as other_age_range,
              mr.language as other_language
       FROM matches m
       JOIN match_requests mr ON mr.id = m.request_id
       JOIN profiles p ON p.id = mr.user_id
       WHERE m.matched_user_id = ? AND m.status = 'pending'
       ORDER BY m.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      requests: requestRows as Record<string, unknown>[],
      outgoingMatches: matchRows as Record<string, unknown>[],
      incomingMatches: incomingRows as Record<string, unknown>[],
    });
  } catch (err) {
    console.error("Match list error:", err);
    return NextResponse.json({ error: "Failed to load matches" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const { ok } = await rateLimitByIp(request, "match", 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pillar, ageRange, gender, language, country, timezone, supportType, interests, anonymous } = body;

    if (!VALID_PILLARS.includes(pillar)) {
      return NextResponse.json({ error: "Invalid pillar selection" }, { status: 400 });
    }
    if (!VALID_AGE_RANGES.includes(ageRange)) {
      return NextResponse.json({ error: "Invalid age range" }, { status: 400 });
    }
    if (!VALID_SUPPORT_TYPES.includes(supportType)) {
      return NextResponse.json({ error: "Invalid support type" }, { status: 400 });
    }
    if (gender && !isValidString(gender, 50)) {
      return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
    }
    if (!isValidString(language, 100)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }
    if (country && !isValidString(country, 100)) {
      return NextResponse.json({ error: "Invalid country" }, { status: 400 });
    }

    const interestsList = Array.isArray(interests) ? interests.filter((i: unknown) => typeof i === "string") : [];
    if (interestsList.length > 10) {
      return NextResponse.json({ error: "Too many interests selected" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const session = await getSiblingSession();
    const userId = session?.id ?? null;

    await db.execute(
      `INSERT INTO match_requests (id, user_id, pillar, age_range, gender, language, country, timezone, support_type, interests, anonymous)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?)`,
      [
        id,
        userId,
        pillar,
        ageRange,
        gender || null,
        language,
        country || null,
        timezone || null,
        supportType,
        JSON.stringify(interestsList),
        anonymous ? 1 : 0,
      ]
    );

    return NextResponse.json({
      success: true,
      id,
      message: "Your match request has been received. Click 'Find Matches' to process it.",
    });
  } catch (err) {
    console.error("Match request error:", err);
    return NextResponse.json(
      { error: "Failed to submit match request" },
      { status: 500 }
    );
  }
}
