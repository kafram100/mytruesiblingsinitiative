import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getSupportRequestById, getSupportReplies, updateSupportRequestStatus, addSupportReply } from "@/lib/support";
import { createNotification } from "@/lib/notifications";
import { sendSupportReplyEmail } from "@/lib/mail";
import { logActivity } from "@/lib/activity-log";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supportRequest = await getSupportRequestById(id);
    if (!supportRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const [userRows] = await db.execute(
      "SELECT full_name, email FROM profiles WHERE id = ?",
      [supportRequest.user_id]
    );
    const userData = (userRows as { full_name: string; email: string }[])[0];

    const replies = await getSupportReplies(id);
    return NextResponse.json({
      request: { ...supportRequest, user_name: userData?.full_name, user_email: userData?.email },
      replies,
    });
  } catch (err) {
    console.error("Admin get support request error:", err);
    return NextResponse.json({ error: "Failed to load request" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Handle status update
    if (body.status) {
      const validStatuses = ["pending", "in_review", "resolved", "closed"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const supportRequest = await getSupportRequestById(id);
      if (!supportRequest) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }

      await updateSupportRequestStatus(id, body.status);

      await logActivity(admin.email, "support.status_update", `Set request ${id} to "${body.status}"`);

      if (body.status === "resolved" || body.status === "closed") {
        await createNotification(
          supportRequest.user_id,
          "support_status",
          "Support Request Updated",
          `Your support request "${supportRequest.subject}" has been marked as ${body.status}.`,
          "/account/support"
        );
      }

      return NextResponse.json({ success: true });
    }

    // Handle admin reply
    if (body.message) {
      const supportRequest = await getSupportRequestById(id);
      if (!supportRequest) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }

      const [userRows] = await db.execute(
        "SELECT full_name, email FROM profiles WHERE id = ?",
        [supportRequest.user_id]
      );
      const userData = (userRows as { full_name: string; email: string }[])[0];

      await addSupportReply(id, admin.id, body.message.trim());

      await logActivity(admin.email, "support.reply", `Replied to support request ${id}`);

      // Notify the sibling in-app
      await createNotification(
        supportRequest.user_id,
        "support_reply",
        "New Reply to Your Support Request",
        `Admin replied to your request: "${supportRequest.subject}"`,
        `/account/support/${id}`
      );

      // Send email to sibling
      if (userData) {
        await sendSupportReplyEmail(
          userData.email,
          userData.full_name,
          supportRequest.subject,
          body.message.trim()
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch (err) {
    console.error("Admin support action error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
