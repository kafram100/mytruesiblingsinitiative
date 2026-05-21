import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { validateOrigin } from "@/lib/csrf";
import { ProfileRow } from "@/lib/auth";

export async function DELETE(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required to delete your account" }, { status: 400 });
    }

    // Verify password
    const [rows] = await db.execute(
      "SELECT password_hash FROM profiles WHERE id = ?",
      [user.id]
    );
    const profiles = rows as ProfileRow[];
    const profile = profiles[0];
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, profile.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Delete all related data in a transaction-like manner
    await db.execute("DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE user1_id = ? OR user2_id = ?)", [user.id, user.id]);
    await db.execute("DELETE FROM conversations WHERE user1_id = ? OR user2_id = ?", [user.id, user.id]);
    await db.execute("DELETE FROM notifications WHERE user_id = ?", [user.id]);
    await db.execute("DELETE FROM user_activity WHERE user_id = ?", [user.id]);
    await db.execute("DELETE FROM matches WHERE request_id IN (SELECT id FROM match_requests WHERE user_id = ?)", [user.id]);
    await db.execute("UPDATE matches SET status = 'cancelled' WHERE matched_user_id = ? AND status = 'pending'", [user.id]);
    await db.execute("DELETE FROM match_requests WHERE user_id = ?", [user.id]);
    await db.execute("DELETE FROM match_feedback WHERE user_id = ?", [user.id]);
    await db.execute("DELETE FROM sessions WHERE user_id = ?", [user.id]);
    await db.execute("DELETE FROM profiles WHERE id = ?", [user.id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
