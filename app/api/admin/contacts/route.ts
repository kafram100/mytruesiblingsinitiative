import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin, ContactRow } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await db.execute("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100");
  const contacts = (rows as ContactRow[]).map((c) => ({
    ...c,
    read: c.read === 1,
  }));
  return NextResponse.json(contacts);
}
