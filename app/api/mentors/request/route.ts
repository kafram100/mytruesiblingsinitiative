import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { createNotification } from "@/lib/notifications";
import { logUserActivity } from "@/lib/user-activity";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { mentorProfileId, message } = await request.json();
    if (!mentorProfileId) {
      return NextResponse.json({ error: "Mentor profile ID is required" }, { status: 400 });
    }

    const [mentorRows] = await db.execute(
      `SELECT mp.id, mp.user_id, mp.max_mentees, mp.current_mentees, p.full_name as mentor_name
       FROM mentor_profiles mp
       JOIN profiles p ON p.id = mp.user_id
       WHERE mp.id = ? AND mp.is_available = 1`,
      [mentorProfileId]
    );
    const mentorProfile = (mentorRows as Record<string, unknown>[])[0];
    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor not found or unavailable" }, { status: 404 });
    }

    const [existing] = await db.execute(
      `SELECT id FROM mentor_mentees WHERE mentor_id = ? AND mentee_id = ?`,
      [mentorProfileId, user.id]
    );
    if ((existing as { id: string }[]).length > 0) {
      return NextResponse.json({ error: "You already have a relationship with this mentor" }, { status: 409 });
    }

    if ((mentorProfile.current_mentees as number) >= (mentorProfile.max_mentees as number)) {
      return NextResponse.json({ error: "This mentor is currently at full capacity" }, { status: 409 });
    }

    const id = randomUUID();
    await db.execute(
      `INSERT INTO mentor_mentees (id, mentor_id, mentee_id, status, request_message)
       VALUES (?, ?, ?, 'pending', ?)`,
      [id, mentorProfileId, user.id, message || null]
    );

    await createNotification(
      mentorProfile.user_id as string,
      "mentor_request",
      "New Mentee Request",
      `${user.full_name} wants you as their mentor!`,
      "/account/mentor/mentees"
    );

    await logUserActivity(user.id, "mentor_requested", `Requested mentorship from ${mentorProfile.mentor_name}`);

    return NextResponse.json({ success: true, message: "Mentorship request sent!" });
  } catch (err) {
    console.error("Mentor request error:", err);
    return NextResponse.json({ error: "Failed to send mentorship request" }, { status: 500 });
  }
}
