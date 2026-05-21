import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth";
import { getActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const activities = await getActivity(200);
  return NextResponse.json(activities);
}
