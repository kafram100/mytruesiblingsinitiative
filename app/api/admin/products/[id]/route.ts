import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await checkAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.execute("DELETE FROM products WHERE id = ?", [id]);
    await logActivity(adminEmail, "product.delete", `Deleted product ${id}`);
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
  const adminEmail = await checkAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { title, price, description, imageUrl, category, tags, comparePrice, isActive } = await request.json();

    await db.execute(
      `UPDATE products SET title = ?, price = ?, compare_price = ?, description = ?, image_url = ?, category = ?, tags = ?, is_active = ?, updated_at = NOW() WHERE id = ?`,
      [title, price, comparePrice || null, description || null, imageUrl || null, category || "general", JSON.stringify(tags || []), isActive ? 1 : 0, id]
    );

    await logActivity(adminEmail, "product.update", `Updated product ${id} - "${title}"`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product update error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
