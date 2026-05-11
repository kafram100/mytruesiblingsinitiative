import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import db from "@/lib/db";
import { ProfileRow } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { rateLimitByIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const { ok, remaining } = await rateLimitByIp(request, "login", 10, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(
      "SELECT id, email, full_name, role, password_hash, must_change_password FROM profiles WHERE email = ?",
      [email]
    );
    const profiles = rows as ProfileRow[];
    const user = profiles[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionId = randomUUID();
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.execute(
      "INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
      [sessionId, user.id, token, expiresAt]
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    await logActivity(user.email, "login");

    return NextResponse.json({
      success: true,
      mustChangePassword: !!user.must_change_password,
      user: {
        email: user.email,
        name: user.full_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
