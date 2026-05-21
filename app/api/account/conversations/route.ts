import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getConversations, getUnreadMessageCount } from "@/lib/conversations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [conversations, unreadCount] = await Promise.all([
      getConversations(user.id),
      getUnreadMessageCount(user.id),
    ]);

    return NextResponse.json({ conversations, unreadCount });
  } catch (err) {
    console.error("Conversations error:", err);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
  }
}
