import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { createSupportRequest } from "@/lib/support";
import { createNotification } from "@/lib/notifications";
import { sendNewSupportRequestEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { type, subject, description } = await request.json();
    if (!subject || !description) {
      return NextResponse.json({ error: "Subject and description are required" }, { status: 400 });
    }
    if (subject.length > 200) {
      return NextResponse.json({ error: "Subject is too long" }, { status: 400 });
    }
    if (description.length > 5000) {
      return NextResponse.json({ error: "Description is too long" }, { status: 400 });
    }

    const supportType = type || "general_support";
    const supportRequest = await createSupportRequest(user.id, supportType, subject.trim(), description.trim());

    // Notify all admins in-app
    try {
      const [adminRows] = await db.execute(
        "SELECT id FROM profiles WHERE role = 'admin'"
      );
      const admins = adminRows as { id: string }[];
      for (const admin of admins) {
        await createNotification(
          admin.id,
          "support_request",
          "New Support Request",
          `${user.full_name} submitted a support request: ${subject.trim()}`,
          "/admin/support"
        );
      }
    } catch (err) {
      console.error("Failed to notify admins:", err);
    }

    // Send email to admin
    await sendNewSupportRequestEmail(user.full_name, user.email || "", supportType, subject.trim(), description.trim());

    return NextResponse.json({ success: true, request: supportRequest });
  } catch (err) {
    console.error("Support request error:", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
