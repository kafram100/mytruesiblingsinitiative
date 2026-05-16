import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.execute("DELETE FROM contacts WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete contact error:", err);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
