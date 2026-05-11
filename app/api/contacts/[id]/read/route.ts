import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.execute("UPDATE contacts SET `read` = true WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}
