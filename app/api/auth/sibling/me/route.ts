import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      joined: user.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
