import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [requests] = await db.execute(
      `SELECT id, pillar, support_type, interests, language, country
       FROM match_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    const userRequests = requests as Record<string, unknown>[];
    if (userRequests.length === 0) {
      return NextResponse.json({ suggested: [] });
    }

    const req = userRequests[0];
    const userInterests: string[] = typeof req.interests === "string"
      ? JSON.parse(req.interests as string)
      : (req.interests as string[]) || [];

    const [mentors] = await db.execute(
      `SELECT
        mp.id as mentor_profile_id,
        mp.user_id,
        mp.expertise_areas,
        mp.experience_years,
        mp.mentorship_bio,
        mp.certification,
        mp.max_mentees,
        mp.current_mentees,
        mp.occupation,
        mp.organization,
        p.full_name,
        p.display_name,
        p.avatar_url,
        p.bio,
        p.pronouns,
        p.location_city
       FROM mentor_profiles mp
       JOIN profiles p ON p.id = mp.user_id
       WHERE mp.is_available = 1 AND mp.approved = 1 AND mp.current_mentees < mp.max_mentees
       ORDER BY mp.current_mentees ASC, mp.experience_years DESC
       LIMIT 10`
    );
    const mentorRows = mentors as Record<string, unknown>[];

    const suggested = mentorRows.map((m) => {
      const expertise: string[] = typeof m.expertise_areas === "string"
        ? JSON.parse(m.expertise_areas as string)
        : (m.expertise_areas as string[]) || [];

      const interestOverlap = expertise.filter((e) => userInterests.includes(e)).length;
      const totalInterestMatch = Math.min(interestOverlap / Math.max(userInterests.length, 1), 1);
      let score = 50;
      if (totalInterestMatch > 0) score += totalInterestMatch * 30;
      if (m.experience_years as number >= 5) score += 10;
      if (m.experience_years as number >= 10) score += 5;

      return {
        mentorProfileId: m.mentor_profile_id,
        userId: m.user_id,
        name: m.display_name || m.full_name,
        avatarUrl: m.avatar_url,
        bio: m.mentorship_bio || m.bio,
        pronouns: m.pronouns,
        location: m.location_city,
        expertiseAreas: expertise,
        experienceYears: m.experience_years,
        certification: m.certification,
        occupation: m.occupation,
        organization: m.organization,
        maxMentees: m.max_mentees,
        currentMentees: m.current_mentees,
        score: Math.round(score),
      };
    });

    suggested.sort((a, b) => b.score - a.score);

    return NextResponse.json({ suggested: suggested.slice(0, 5) });
  } catch (err) {
    console.error("Suggested mentors error:", err);
    return NextResponse.json({ error: "Failed to get suggested mentors" }, { status: 500 });
  }
}
