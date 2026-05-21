import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { validateOrigin } from "@/lib/csrf";
import { createNotification } from "@/lib/notifications";
import { logUserActivity } from "@/lib/user-activity";
import { getOrCreateConversation } from "@/lib/conversations";
import { sendMatchNotificationEmail } from "@/lib/mail";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Use 'accept' or 'decline'" }, { status: 400 });
    }

    // Verify match belongs to user
    const [matches] = await db.execute(
      `SELECT m.*, mr.user_id as request_owner_id
       FROM matches m
       JOIN match_requests mr ON mr.id = m.request_id
       WHERE m.id = ? AND m.matched_user_id = ? AND m.status = 'pending'`,
      [id, user.id]
    );
    const matchRows = matches as { id: string; request_id: string; matched_user_id: string; request_owner_id: string }[];
    if (matchRows.length === 0) {
      return NextResponse.json({ error: "Match not found or already processed" }, { status: 404 });
    }

    const match = matchRows[0];
    const newStatus = action === "accept" ? "matched" : "cancelled";

    await db.execute(
      `UPDATE matches SET status = ? WHERE id = ?`,
      [newStatus, id]
    );

    // If accepting, open a conversation
    if (action === "accept") {
      const conversationId = await getOrCreateConversation(user.id, match.request_owner_id);

      await createNotification(
        match.request_owner_id,
        "match",
        "Match Accepted!",
        `${user.full_name} accepted your match request! Start a conversation now.`,
        `/account/messages/${conversationId}`
      );

      try {
        const [ownerRows] = await db.execute(
          "SELECT email FROM profiles WHERE id = ?",
          [match.request_owner_id]
        );
        const owner = (ownerRows as { email: string }[])[0];
        if (owner) {
          sendMatchNotificationEmail(owner.email, "", "match_accepted", user.full_name);
        }
      } catch {}

      await logUserActivity(user.id, "match_accepted", `Accepted match ${id}`);
    } else {
      await createNotification(
        match.request_owner_id,
        "match",
        "Match Declined",
        `${user.full_name} declined the match. Don't worry, new matches will come.`,
        "/account/matches"
      );

      try {
        const [ownerRows] = await db.execute(
          "SELECT email FROM profiles WHERE id = ?",
          [match.request_owner_id]
        );
        const owner = (ownerRows as { email: string }[])[0];
        if (owner) {
          sendMatchNotificationEmail(owner.email, "", "match_declined", user.full_name);
        }
      } catch {}

      await logUserActivity(user.id, "match_declined", `Declined match ${id}`);
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("Match response error:", err);
    return NextResponse.json({ error: "Failed to process response" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    // Verify match request belongs to user and is cancellable
    const [requests] = await db.execute(
      `SELECT id FROM match_requests WHERE id = ? AND user_id = ? AND status IN ('pending', 'matched')`,
      [id, user.id]
    );
    const requestRows = requests as { id: string }[];
    if (requestRows.length === 0) {
      return NextResponse.json({ error: "Match request not found or cannot be cancelled" }, { status: 404 });
    }

    // Cancel all related matches
    await db.execute(
      `UPDATE matches SET status = 'cancelled' WHERE request_id = ? AND status = 'pending'`,
      [id]
    );

    // Update request status
    await db.execute(
      `UPDATE match_requests SET status = 'cancelled' WHERE id = ?`,
      [id]
    );

    await logUserActivity(user.id, "match_request_cancelled", `Cancelled match request ${id}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Match cancellation error:", err);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}
