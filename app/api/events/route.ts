import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT id, title, description, date, time, location, image_url, registration_url, is_featured
       FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 20`
    );

    const events = (rows as Record<string, unknown>[]).map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      location: e.location,
      imageUrl: e.image_url,
      registrationUrl: e.registration_url,
      isFeatured: Boolean(e.is_featured),
    }));

    return NextResponse.json({ events });
  } catch (err) {
    console.error("Events public fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
