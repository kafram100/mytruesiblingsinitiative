import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

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

    if (approved) {
      await db.execute(
        `UPDATE mentor_profiles SET approved = 1, updated_at = NOW() WHERE id = ?`,
        [mentorProfileId]
      );
    } else {
      // Reject: delete the mentor profile and associated user account
      const [rows] = await db.execute(
        `SELECT user_id FROM mentor_profiles WHERE id = ?`,
        [mentorProfileId]
      );
      const profile = (rows as { user_id: string }[])[0];
      if (profile) {
        await db.execute(`DELETE FROM mentor_profiles WHERE id = ?`, [mentorProfileId]);
        await db.execute(`DELETE FROM profiles WHERE id = ?`, [profile.user_id]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Approve mentor error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
