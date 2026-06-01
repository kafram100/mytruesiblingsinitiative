import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import db from "@/lib/db";
import { ProfileRow } from "@/lib/auth";
import { hashToken } from "@/lib/auth";
import { rateLimitByIp, rateLimit } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 10_240) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const { ok: ipOk } = await rateLimitByIp(request, "sibling-login", 10, 60_000);
    if (!ipOk) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { ok: accountOk } = await rateLimit(`sibling-login:${email}`, 5, 60_000);
    if (!accountOk) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const [rows] = await db.execute(
      "SELECT id, email, full_name, role, password_hash FROM profiles WHERE email = ?",
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

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Please use the admin login page" },
        { status: 403 }
      );
    }

    // Block mentor/coach accounts that haven't been approved by admin
    if (user.role === "sibling_coach") {
      const [mentorRows] = await db.execute(
        "SELECT approved FROM mentor_profiles WHERE user_id = ?",
        [user.id]
      );
      const mentorProfile = (mentorRows as { approved: number }[])[0];
      if (!mentorProfile || !mentorProfile.approved) {
        return NextResponse.json(
          { error: "Your mentor account is pending admin approval. You will be notified once approved." },
          { status: 403 }
        );
      }
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
      [sessionId, user.id, hashToken(token), expiresAt]
    );

    const cookieStore = await cookies();
    cookieStore.set("sibling_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
    });
  } catch (err) {
    console.error("Sibling login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
