import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { markNotificationRead } from "@/lib/notifications";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await markNotificationRead(id, user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark notification read error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
