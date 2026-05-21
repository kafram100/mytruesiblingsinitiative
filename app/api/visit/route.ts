import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body.path || "/";
    const visitorId = body.visitorId || null;
    const id = crypto.randomUUID();

    await db.execute(
      "INSERT INTO page_views (id, path, visitor_id, created_at) VALUES ($1, $2, $3, NOW())",
      [id, path, visitorId]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
