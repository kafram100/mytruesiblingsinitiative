import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { sendMentorApprovalEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mentorProfileId, approved } = await request.json();
    if (!mentorProfileId) {
      return NextResponse.json({ error: "mentorProfileId required" }, { status: 400 });
    }

    const [rows] = await db.execute(
      `SELECT mp.user_id, p.full_name, p.email FROM mentor_profiles mp JOIN profiles p ON p.id = mp.user_id WHERE mp.id = ?`,
      [mentorProfileId]
    );
    const profile = (rows as { user_id: string; full_name: string; email: string }[])[0];
    if (!profile) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    if (approved) {
      await db.execute(
        `UPDATE mentor_profiles SET approved = 1 WHERE id = ?`,
        [mentorProfileId]
      );
      await createNotification(
        profile.user_id,
        "mentor_approved",
        "Mentor Application Approved",
        `Congratulations ${profile.full_name}! Your mentor application has been approved. You can now log in and start mentoring.`,
        "/account/mentor"
      );
      await sendMentorApprovalEmail(profile.email, profile.full_name, true);
    } else {
      await sendMentorApprovalEmail(profile.email, profile.full_name, false);
      await db.execute(`DELETE FROM mentor_profiles WHERE id = ?`, [mentorProfileId]);
      await db.execute(`DELETE FROM profiles WHERE id = ?`, [profile.user_id]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Approve mentor error:", message);
    return NextResponse.json({ error: "Failed", detail: message }, { status: 500 });
  }
}
