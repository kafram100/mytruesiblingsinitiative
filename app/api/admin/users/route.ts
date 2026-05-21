import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [rows] = await db.execute("SELECT id, email, full_name, role, created_at FROM profiles ORDER BY created_at DESC LIMIT 100");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
