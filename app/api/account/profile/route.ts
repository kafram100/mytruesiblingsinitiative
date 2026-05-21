import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { validateOrigin } from "@/lib/csrf";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const [rows] = await db.execute(
      `SELECT id, email, full_name, display_name, bio, avatar_url, pronouns, location_city, timezone, date_of_birth, created_at FROM profiles WHERE id = ?`,
      [user.id]
    );
    return NextResponse.json((rows as Record<string, unknown>[])[0] || null);
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, displayName, bio, pronouns, locationCity, dateOfBirth } = body;

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || fullName.trim().length < 2) {
        return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
      }
      if (fullName.length > 100) {
        return NextResponse.json({ error: "Name is too long" }, { status: 400 });
      }
    }

    if (displayName !== undefined && displayName !== null && displayName.length > 100) {
      return NextResponse.json({ error: "Display name is too long" }, { status: 400 });
    }

    if (bio !== undefined && bio !== null && bio.length > 1000) {
      return NextResponse.json({ error: "Bio is too long (max 1000 characters)" }, { status: 400 });
    }

    if (dateOfBirth !== undefined && dateOfBirth !== null) {
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobRegex.test(dateOfBirth)) {
        return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
      }
      const birthDate = new Date(dateOfBirth);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) age--;
      if (age < 13) {
        return NextResponse.json({ error: "You must be at least 13 years old" }, { status: 400 });
      }
      if (age > 150) {
        return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
      }
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (fullName !== undefined) {
      updates.push("full_name = ?");
      values.push(fullName.trim());
    }
    if (displayName !== undefined) {
      updates.push("display_name = ?");
      values.push(displayName?.trim() || null);
    }
    if (bio !== undefined) {
      updates.push("bio = ?");
      values.push(bio?.trim() || null);
    }
    if (pronouns !== undefined) {
      updates.push("pronouns = ?");
      values.push(pronouns?.trim() || null);
    }
    if (locationCity !== undefined) {
      updates.push("location_city = ?");
      values.push(locationCity?.trim() || null);
    }
    if (dateOfBirth !== undefined) {
      updates.push("date_of_birth = ?");
      values.push(dateOfBirth || null);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(user.id);
    await db.execute(
      `UPDATE profiles SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
