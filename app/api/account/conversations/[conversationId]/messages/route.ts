import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getMessages, sendMessage, markMessagesRead } from "@/lib/conversations";
import { validateOrigin } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { conversationId } = await params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const before = url.searchParams.get("before") || undefined;

    const messages = await getMessages(conversationId, limit, before);
    await markMessagesRead(conversationId, user.id);

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Get messages error:", err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { conversationId } = await params;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: "Message too long (max 5000 characters)" }, { status: 400 });
    }

    await sendMessage(conversationId, user.id, content);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
