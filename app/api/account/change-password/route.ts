import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { ProfileRow } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";

export async function PUT(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const [rows] = await db.execute(
      "SELECT password_hash FROM profiles WHERE id = ?",
      [user.id]
    );
    const profiles = rows as ProfileRow[];
    const profile = profiles[0];

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, profile.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.execute(
      "UPDATE profiles SET password_hash = ? WHERE id = ?",
      [newHash, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Password change failed" }, { status: 500 });
  }
}
