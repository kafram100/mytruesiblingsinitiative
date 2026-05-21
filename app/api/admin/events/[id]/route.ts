import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.execute("DELETE FROM events WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Event delete error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { title, description, date, time, location, imageUrl, registrationUrl, isFeatured } = await request.json();

    await db.execute(
      `UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image_url = ?, registration_url = ?, is_featured = ?, updated_at = NOW() WHERE id = ?`,
      [title, description || null, date, time || null, location || null, imageUrl || null, registrationUrl || null, isFeatured ? 1 : 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Event update error:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
