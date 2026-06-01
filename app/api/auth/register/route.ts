import { NextResponse } from "next/server";
import { randomUUID, createHash } from "crypto";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";
import { sendVerificationEmail } from "@/lib/mail";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 10_240) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const { ok } = await rateLimitByIp(request, "register", 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { fullName, email, password } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (fullName.length > 100) {
      return NextResponse.json({ error: "Name is too long" }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (password.length > 128) {
      return NextResponse.json({ error: "Password is too long" }, { status: 400 });
    }

    const [existing] = await db.execute(
      "SELECT id FROM profiles WHERE email = ?",
      [email.trim().toLowerCase()]
    );
    if ((existing as { id: string }[]).length > 0) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);

    await db.execute(
      `INSERT INTO profiles (id, email, full_name, role, password_hash, must_change_password, email_verified)
       VALUES (?, ?, ?, 'user', ?, 0, 0)`,
      [id, email.trim().toLowerCase(), fullName.trim(), passwordHash]
    );

    const verificationToken = randomUUID();
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.execute(
      "INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
      [randomUUID(), id, hashToken(verificationToken), verificationExpiresAt]
    );

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const verificationLink = `${origin}/verify-email/${verificationToken}`;
    await sendVerificationEmail(email.trim().toLowerCase(), fullName.trim(), verificationLink);

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
