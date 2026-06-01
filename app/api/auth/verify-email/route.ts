import { NextResponse } from "next/server";
import { createHash } from "crypto";

import db from "@/lib/db";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
    }

    const [rows] = await db.execute(
      `SELECT id, user_id FROM verification_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()`,
      [hashToken(token)]
    );
    const tokens = rows as { id: string; user_id: string }[];
    const row = tokens[0];

    if (!row) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    await db.execute("UPDATE profiles SET email_verified = 1 WHERE id = ?", [row.user_id]);
    await db.execute("UPDATE verification_tokens SET used = 1 WHERE id = ?", [row.id]);

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
