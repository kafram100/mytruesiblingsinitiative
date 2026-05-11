import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      const cookieStore = await cookies();
      cookieStore.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: { email: user.email, name: user.full_name },
    });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
