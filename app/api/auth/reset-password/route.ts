import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

import db from "@/lib/db";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface PasswordResetRow {
  id: string;
  user_id: string;
  used: number;
  expires_at: string;
}

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 1024) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

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

    const [rows] = await db.execute(
      "SELECT id, user_id FROM password_resets WHERE token = ? AND used = 0 AND expires_at > NOW()",
      [hashToken(session)]
    );
    const resets = rows as PasswordResetRow[];
    const reset = resets[0];

    if (!reset) {
      return NextResponse.json({ error: "Invalid or expired reset session" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);

    await db.execute("UPDATE profiles SET password_hash = ?, must_change_password = 0 WHERE id = ?", [hash, reset.user_id]);
    await db.execute("UPDATE password_resets SET used = 1 WHERE id = ?", [reset.id]);
    await db.execute("DELETE FROM sessions WHERE user_id = ?", [reset.user_id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
