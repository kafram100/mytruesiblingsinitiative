import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { createNotification } from "@/lib/notifications";
import { logUserActivity } from "@/lib/user-activity";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await request.json();

    const [rows] = await db.execute(
      `SELECT mm.*, mp.user_id as mentor_user_id
       FROM mentor_mentees mm
       JOIN mentor_profiles mp ON mp.id = mm.mentor_id
       WHERE mm.id = ?`,
      [id]
    );
    const record = (rows as Record<string, unknown>[])[0];
    if (!record) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (record.mentor_user_id !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (action === "accept") {
      await db.execute(
        `UPDATE mentor_mentees SET status = 'active', matched_at = NOW() WHERE id = ?`,
        [id]
      );
      await db.execute(
        `UPDATE mentor_profiles SET current_mentees = current_mentees + 1 WHERE user_id = ?`,
        [user.id]
      );
      await db.execute(
        `UPDATE mentor_profiles SET is_available = CASE WHEN current_mentees < max_mentees THEN 1 ELSE 0 END WHERE user_id = ?`,
        [user.id]
      );

      await createNotification(
        record.mentee_id as string,
        "mentor_accepted",
        "Mentorship Accepted!",
        `${user.full_name} has accepted your mentorship request!`,
        "/account/messages"
      );

      await logUserActivity(user.id, "mentor_accepted", `Accepted mentorship with ${record.mentee_id}`);
    } else if (action === "decline") {
      await db.execute(
        `UPDATE mentor_mentees SET status = 'cancelled' WHERE id = ?`,
        [id]
      );

      await createNotification(
        record.mentee_id as string,
        "mentor_declined",
        "Mentorship Declined",
        `${user.full_name} was unable to accept your mentorship request at this time.`,
        "/account/matches"
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mentor request response error:", err);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}
