import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getNotifications, getUnreadCount, markAllNotificationsRead } from "@/lib/notifications";
import { validateOrigin } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const [notifications, unreadCount] = await Promise.all([
      getNotifications(user.id, limit),
      getUnreadCount(user.id),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error("Notifications error:", err);
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
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

    await markAllNotificationsRead(user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark all read error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
