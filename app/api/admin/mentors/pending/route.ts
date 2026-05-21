import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.execute(
      `SELECT mp.id, mp.user_id, mp.occupation, mp.organization,
              mp.expertise_areas, mp.experience_years, mp.mentorship_bio,
              mp.certification, mp.created_at,
              p.full_name, p.email
       FROM mentor_profiles mp
       JOIN profiles p ON p.id = mp.user_id
       WHERE mp.approved = 0
       ORDER BY mp.created_at ASC`
    );
    const mentors = (rows as Record<string, unknown>[]).map((m) => ({
      id: m.id,
      userId: m.user_id,
      fullName: m.full_name,
      email: m.email,
      occupation: m.occupation,
      organization: m.organization,
      expertiseAreas: typeof m.expertise_areas === "string"
        ? JSON.parse(m.expertise_areas as string)
        : (m.expertise_areas as string[]) || [],
      experienceYears: m.experience_years,
      mentorshipBio: m.mentorship_bio,
      certification: m.certification,
      createdAt: m.created_at,
    }));

    return NextResponse.json({ mentors });
  } catch (err) {
    console.error("Pending mentors error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
