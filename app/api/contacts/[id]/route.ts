import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";
import { logActivity } from "@/lib/activity-log";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  const adminEmail = await checkAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.execute("DELETE FROM contacts WHERE id = ?", [id]);
    await logActivity(adminEmail, "contact.delete", `Deleted contact ${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete contact error:", err);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
