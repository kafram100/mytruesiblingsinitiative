import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getSessionUser } from "@/lib/auth";
import { getSupportRequestById, addSupportReply } from "@/lib/support";
import { createNotification } from "@/lib/notifications";
import { sendSupportReplyEmail } from "@/lib/mail";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sibling = await getSiblingSession();
    if (!sibling) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supportRequest = await getSupportRequestById(id, sibling.id);
    if (!supportRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await addSupportReply(id, sibling.id, message.trim());

    // Notify admins when sibling replies
    try {
      const [adminRows] = await db.execute(
        "SELECT id FROM profiles WHERE role = 'admin'"
      );
      const admins = adminRows as { id: string }[];
      for (const admin of admins) {
        await createNotification(
          admin.id,
          "support_reply",
          "New Reply to Support Request",
          `${sibling.full_name} replied to their support request: ${supportRequest.subject}`,
          `/admin/support`
        );
      }
    } catch (err) {
      console.error("Failed to notify admins:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Support reply error:", err);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
