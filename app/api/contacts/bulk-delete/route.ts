import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";
import { logActivity } from "@/lib/activity-log";

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  const adminEmail = await checkAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const placeholders = ids.map(() => "?").join(",");
    await db.execute(
      `DELETE FROM contacts WHERE id IN (${placeholders})`,
      ids
    );

    await logActivity(adminEmail, "contact.bulk_delete", `Bulk deleted ${ids.length} contacts`);
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error("Bulk delete error:", err);
    return NextResponse.json({ error: "Failed to delete contacts" }, { status: 500 });
  }
}
