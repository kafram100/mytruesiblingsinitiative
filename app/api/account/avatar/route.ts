import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    await db.execute(
      "UPDATE profiles SET avatar_url = ? WHERE id = ?",
      [base64, user.id]
    );

    return NextResponse.json({ success: true, avatar_url: base64 });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await db.execute(
      "UPDATE profiles SET avatar_url = NULL WHERE id = ?",
      [user.id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Avatar delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
