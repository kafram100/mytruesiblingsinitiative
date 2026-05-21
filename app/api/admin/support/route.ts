import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getAllSupportRequests } from "@/lib/support";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await getAllSupportRequests();
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Admin get support requests error:", err);
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}
