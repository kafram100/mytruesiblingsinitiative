import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.execute(
      "SELECT id, title, description, date, time, location, image_url, registration_url, is_featured, created_at FROM events ORDER BY date DESC LIMIT 100"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Events fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminEmail = await checkAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, date, time, location, imageUrl, registrationUrl, isFeatured } = await request.json();

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    const id = randomUUID();
    await db.execute(
      `INSERT INTO events (id, title, description, date, time, location, image_url, registration_url, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description || null, date, time || null, location || null, imageUrl || null, registrationUrl || null, isFeatured ? 1 : 0]
    );

    await logActivity(adminEmail, "event.create", `Created event "${title}" (${id})`);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Event create error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
