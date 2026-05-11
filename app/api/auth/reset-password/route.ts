import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import db from "@/lib/db";
import { rateLimitByIp } from "@/lib/rate-limit";

interface PasswordResetRow {
  id: string;
  user_id: string;
  ip_address: string | null;
  used: number;
  expires_at: string;
}

export async function POST(request: Request) {
  try {
    const { ok } = await rateLimitByIp(request, "reset-password", 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const { session, password } = await request.json();

    if (!session || !password) {
      return NextResponse.json({ error: "Session and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() || null;

    const [rows] = await db.execute(
      "SELECT id, user_id, ip_address FROM password_resets WHERE id = ? AND used = 0 AND expires_at > NOW()",
      [session]
    );
    const resets = rows as PasswordResetRow[];
    const reset = resets[0];

    if (!reset) {
      return NextResponse.json({ error: "Invalid or expired reset session" }, { status: 400 });
    }

    if (reset.ip_address && ipAddress && reset.ip_address !== ipAddress) {
      return NextResponse.json({ error: "Session IP mismatch. Request a new reset link." }, { status: 403 });
    }

    const hash = await bcrypt.hash(password, 12);

    await db.execute("UPDATE profiles SET password_hash = ?, must_change_password = 0 WHERE id = ?", [hash, reset.user_id]);
    await db.execute("UPDATE password_resets SET used = 1 WHERE id = ?", [reset.id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
