import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import db from "@/lib/db";
import { ProfileRow } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/mail";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const { ok } = await rateLimitByIp(request, "forgot-password", 3, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [rows] = await db.execute(
      "SELECT id, email FROM profiles WHERE email = ? AND role = 'admin'",
      [email]
    );
    const profiles = rows as ProfileRow[];
    const user = profiles[0];

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const id = randomUUID();
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.execute(
      "INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
      [id, user.id, token, expiresAt]
    );

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetLink = `${origin}/admin/reset-password?session=${token}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
