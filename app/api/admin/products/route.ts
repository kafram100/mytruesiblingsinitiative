import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.execute(
      "SELECT id, title, price, compare_price, description, image_url, category, tags, is_active, created_at FROM products ORDER BY created_at DESC LIMIT 100"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Products fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminEmail = await checkAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, price, description, imageUrl, category, tags, comparePrice } = await request.json();

    if (!title || price == null) {
      return NextResponse.json({ error: "Title and price are required" }, { status: 400 });
    }

    const id = randomUUID();
    await db.execute(
      `INSERT INTO products (id, title, price, compare_price, description, image_url, category, tags, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, title, price, comparePrice || null, description || null, imageUrl || null, category || "general", JSON.stringify(tags || [])]
    );

    await logActivity(adminEmail, "product.create", `Created product "${title}" (${id})`);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Product create error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
