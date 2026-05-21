import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.execute("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product delete error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { title, price, description, imageUrl, category, tags, comparePrice, isActive } = await request.json();

    await db.execute(
      `UPDATE products SET title = ?, price = ?, compare_price = ?, description = ?, image_url = ?, category = ?, tags = ?, is_active = ?, updated_at = NOW() WHERE id = ?`,
      [title, price, comparePrice || null, description || null, imageUrl || null, category || "general", JSON.stringify(tags || []), isActive ? 1 : 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product update error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
