import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin, ContactRow } from "@/lib/auth";
import { createTransporter, getSettings } from "@/lib/mail";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [contactRows] = await db.execute(
    "SELECT * FROM contacts WHERE id = ?",
    [id]
  );
  const contacts = contactRows as ContactRow[];

  if (contacts.length === 0) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const contact = contacts[0];

  const { subject, message } = await _request.json();

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  function escapeHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  const transporter = await createTransporter();
  if (!transporter) {
    return NextResponse.json({ error: "SMTP not configured" }, { status: 400 });
  }

  const settings = await getSettings();
  const from = settings.smtp_from || settings.smtp_user;

  if (!from) {
    return NextResponse.json({ error: "SMTP sender not configured" }, { status: 400 });
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <p>Hi ${escapeHtml(contact.name)},</p>
      <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
      <p style="font-size:12px;color:#888;">
        --- Original Message ---<br/>
        Subject: ${escapeHtml(contact.subject)}<br/><br/>
        ${escapeHtml(contact.message)}
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: contact.email,
      subject,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to send reply:", err);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
