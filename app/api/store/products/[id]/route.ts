import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows] = await db.execute(
      `SELECT id, title, price, compare_price, description, image_url, category, tags
       FROM products WHERE id = ? AND is_active = 1 LIMIT 1`,
      [id]
    );

    const products = rows as Record<string, unknown>[];
    if (products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const p = products[0];
    return NextResponse.json({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      comparePrice: p.compare_price ? Number(p.compare_price) : null,
      description: p.description,
      imageUrl: p.image_url,
      category: p.category,
      tags: typeof p.tags === "string" ? JSON.parse(p.tags as string) : (p.tags as string[]) || [],
    });
  } catch (err) {
    console.error("Product fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
