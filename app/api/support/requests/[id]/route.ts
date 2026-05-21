import { NextResponse } from "next/server";
import { getSiblingSession } from "@/lib/sibling-auth";
import { getSupportRequestById, getSupportReplies } from "@/lib/support";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supportRequest = await getSupportRequestById(id, user.id);
    if (!supportRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const replies = await getSupportReplies(id);
    return NextResponse.json({ request: supportRequest, replies });
  } catch (err) {
    console.error("Get support request error:", err);
    return NextResponse.json({ error: "Failed to load request" }, { status: 500 });
  }
}
