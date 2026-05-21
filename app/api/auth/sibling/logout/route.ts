import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import db from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const cookieStore = await cookies();
    const token = cookieStore.get("sibling_token")?.value;

    if (token) {
      await db.execute("DELETE FROM sessions WHERE token = ?", [hashToken(token)]);
    }

    cookieStore.set("sibling_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sibling logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
