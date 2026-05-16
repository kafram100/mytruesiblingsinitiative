import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (token) {
      const user = await getSessionUser();
      await db.execute("DELETE FROM sessions WHERE token = ?", [token]);
      if (user?.email) await logActivity(user.email, "logout");
    }

    cookieStore.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
