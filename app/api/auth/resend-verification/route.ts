import { NextResponse } from "next/server";
import { randomUUID, createHash } from "crypto";

import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { sendVerificationEmail } from "@/lib/mail";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 1024) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const { ok } = await rateLimitByIp(request, "resend-verification", 3, 60_000);
    if (!ok) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    await db.execute(
      "UPDATE verification_tokens SET used = 1 WHERE user_id = ? AND used = 0",
      [user.id]
    );

    const verificationToken = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.execute(
      "INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
      [randomUUID(), user.id, hashToken(verificationToken), expiresAt]
    );

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const verificationLink = `${origin}/verify-email/${verificationToken}`;
    await sendVerificationEmail(user.email, user.full_name, verificationLink);

    return NextResponse.json({ success: true, message: "Verification email sent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
