import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import db from "@/lib/db";
import { sendNotificationEmail } from "@/lib/mail";
import { rateLimitByIp } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
].filter(Boolean) as string[];

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const isValidOrigin = allowedOrigins.some(o => origin === o || referer?.startsWith(o));
    if (!isValidOrigin) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const { ok } = await rateLimitByIp(request, "contact", 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: "Fields exceed maximum length" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const id = randomUUID();

    await db.execute(
      "INSERT INTO contacts (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, subject, message]
    );

    await sendNotificationEmail(name, email, subject, message);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
