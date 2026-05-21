import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";
import { createNotification } from "@/lib/notifications";
import { sendNewMentorPendingEmail } from "@/lib/mail";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const { ok } = await rateLimitByIp(request, "mentor-register", 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { fullName, email, password, expertiseAreas, experienceYears, mentorshipBio, occupation, organization } = body;

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
    if (!expertiseAreas || !Array.isArray(expertiseAreas) || expertiseAreas.length === 0) {
      return NextResponse.json({ error: "Select at least one expertise area" }, { status: 400 });
    }
    if (experienceYears == null || experienceYears < 0) {
      return NextResponse.json({ error: "Experience years is required" }, { status: 400 });
    }

    const [existing] = await db.execute(
      "SELECT id FROM profiles WHERE email = ?",
      [email.trim().toLowerCase()]
    );
    if ((existing as { id: string }[]).length > 0) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const id = randomUUID();
    const mentorId = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);

    await db.execute(
      `INSERT INTO profiles (id, email, full_name, role, password_hash, must_change_password)
       VALUES (?, ?, ?, 'sibling_coach', ?, 0)`,
      [id, email.trim().toLowerCase(), fullName.trim(), passwordHash]
    );

    await db.execute(
      `INSERT INTO mentor_profiles (id, user_id, expertise_areas, experience_years, mentorship_bio, occupation, organization, approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [mentorId, id, JSON.stringify(expertiseAreas), experienceYears, mentorshipBio || null, occupation || null, organization || null]
    );

    // Notify all admins about the new pending mentor
    try {
      const [adminRows] = await db.execute(
        "SELECT id FROM profiles WHERE role = 'admin'"
      );
      const admins = adminRows as { id: string }[];
      for (const admin of admins) {
        await createNotification(
          admin.id,
          "mentor_pending",
          "New Mentor Application",
          `${fullName.trim()} has applied to become a mentor and is pending review.`,
          "/admin/mentors"
        );
      }
    } catch (err) {
      console.error("Failed to notify admins:", err);
    }

    // Send email notification to admin
    await sendNewMentorPendingEmail(fullName.trim(), email.trim().toLowerCase(), occupation, organization);

    return NextResponse.json({
      success: true,
      pending: true,
      message: "Your mentor account has been created and is pending admin approval. You will be notified once approved.",
    });
  } catch (err) {
    console.error("Mentor registration error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
