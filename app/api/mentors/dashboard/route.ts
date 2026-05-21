import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";

export const dynamic = "force-dynamic";

function parseJsonArray(val: unknown): string[] {
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  if (Array.isArray(val)) return val;
  return [];
}

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [mentorRows] = await db.execute(
      `SELECT id, expertise_areas, experience_years, mentorship_bio, certification,
              max_mentees, current_mentees, is_available
       FROM mentor_profiles WHERE user_id = ?`,
      [user.id]
    );
    const mentorProfiles = mentorRows as Record<string, unknown>[];
    if (mentorProfiles.length === 0) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    const mp = mentorProfiles[0];

    const [pendingRows] = await db.execute(
      `SELECT mm.id, mm.request_message, mm.created_at,
              p.full_name, p.display_name, p.avatar_url, p.bio, p.pronouns, p.location_city
       FROM mentor_mentees mm
       JOIN profiles p ON p.id = mm.mentee_id
       WHERE mm.mentor_id = ? AND mm.status = 'pending'
       ORDER BY mm.created_at DESC`,
      [mp.id]
    );

    const [activeRows] = await db.execute(
      `SELECT mm.id, mm.matched_at,
              p.full_name, p.display_name, p.avatar_url, p.bio, p.pronouns, p.location_city
       FROM mentor_mentees mm
       JOIN profiles p ON p.id = mm.mentee_id
       WHERE mm.mentor_id = ? AND mm.status = 'active'
       ORDER BY mm.matched_at DESC`,
      [mp.id]
    );

    const [completedRows] = await db.execute(
      `SELECT mm.id, mm.completed_at,
              p.full_name, p.display_name
       FROM mentor_mentees mm
       JOIN profiles p ON p.id = mm.mentee_id
       WHERE mm.mentor_id = ? AND mm.status = 'completed'
       ORDER BY mm.completed_at DESC LIMIT 10`,
      [mp.id]
    );

    return NextResponse.json({
      mentorProfile: {
        id: mp.id,
        expertiseAreas: typeof mp.expertise_areas === "string"
          ? JSON.parse(mp.expertise_areas as string)
          : (mp.expertise_areas as string[]) || [],
        experienceYears: mp.experience_years,
        mentorshipBio: mp.mentorship_bio,
        certification: mp.certification,
        maxMentees: mp.max_mentees,
        currentMentees: mp.current_mentees,
        isAvailable: Boolean(mp.is_available),
      },
      pendingRequests: pendingRows,
      activeMentees: activeRows,
      completedMentees: completedRows,
    });
  } catch (err) {
    console.error("Mentor dashboard error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { expertiseAreas, experienceYears, mentorshipBio, certification, maxMentees, isAvailable } = body;

    const [mentorRows] = await db.execute(
      `SELECT id, current_mentees FROM mentor_profiles WHERE user_id = ?`,
      [user.id]
    );
    const mentorProfiles = mentorRows as Record<string, unknown>[];
    if (mentorProfiles.length === 0) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    const mp = mentorProfiles[0];
    const maxM = Math.max(maxMentees || 5, mp.current_mentees as number);

    await db.execute(
      `UPDATE mentor_profiles
       SET expertise_areas = ?, experience_years = ?, mentorship_bio = ?,
           certification = ?, max_mentees = ?, is_available = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        JSON.stringify(expertiseAreas || []),
        experienceYears || 0,
        mentorshipBio || null,
        certification || null,
        maxM,
        isAvailable ? 1 : 0,
        mp.id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mentor profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
