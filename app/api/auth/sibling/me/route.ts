import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      joined: user.created_at,
      isPendingMentor: user.isPendingMentor ?? false,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
