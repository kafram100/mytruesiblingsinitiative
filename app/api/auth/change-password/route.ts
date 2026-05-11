import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { rateLimitByIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const { ok } = await rateLimitByIp(request, "change-password", 5, 60_000);
    if (!ok) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both passwords are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: "New password must be different from current" }, { status: 400 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash!);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await db.execute("UPDATE profiles SET password_hash = ?, must_change_password = 0 WHERE id = ?", [
      hash,
      user.id,
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
