import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT id, title, price, compare_price, description, image_url, category, tags
       FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT 100`
    );

    const products = (rows as Record<string, unknown>[]).map((p) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      comparePrice: p.compare_price ? Number(p.compare_price) : null,
      description: p.description,
      imageUrl: p.image_url,
      category: p.category,
      tags: typeof p.tags === "string" ? JSON.parse(p.tags as string) : (p.tags as string[]) || [],
    }));

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Products fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
