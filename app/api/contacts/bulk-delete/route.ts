import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  if (!(await checkAdmin())) {
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

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error("Bulk delete error:", err);
    return NextResponse.json({ error: "Failed to delete contacts" }, { status: 500 });
  }
}
