import { NextResponse } from "next/server";

import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { validateOrigin } from "@/lib/csrf";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { role } = await request.json();

    const validRoles = ["user", "sibling", "sibling_coach", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const [targetRows] = await db.execute(
      "SELECT role FROM profiles WHERE id = ?",
      [id]
    );
    const target = (targetRows as { role: string }[])[0];
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "admin" && role !== "admin") {
      const [countRows] = await db.execute(
        "SELECT COUNT(*)::int AS c FROM profiles WHERE role = ?",
        ["admin"]
      );
      const adminCount = Number((countRows as { c: number }[])[0]?.c ?? 0);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last admin" },
          { status: 403 }
        );
      }
    }

    await db.execute("UPDATE profiles SET role = ? WHERE id = ?", [role, id]);

    await logActivity(admin.email, "user.role_update", `Updated user ${id} to role "${role}"`);

    return NextResponse.json({ success: true, role });
  } catch (err) {
    console.error("Update user role error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  const admin = await getSessionUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === admin.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 403 }
    );
  }

  try {
    const [targetRows] = await db.execute(
      "SELECT role FROM profiles WHERE id = ?",
      [id]
    );
    const target = (targetRows as { role: string }[])[0];
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "admin") {
      const [countRows] = await db.execute(
        "SELECT COUNT(*)::int AS c FROM profiles WHERE role = ?",
        ["admin"]
      );
      const adminCount = Number((countRows as { c: number }[])[0]?.c ?? 0);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin account" },
          { status: 403 }
        );
      }
    }

    await db.execute("DELETE FROM profiles WHERE id = ?", [id]);
    await db.execute("DELETE FROM sessions WHERE user_id = ?", [id]);
    await logActivity(admin.email, "user.delete", `Deleted user ${id} (role: ${target.role})`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
