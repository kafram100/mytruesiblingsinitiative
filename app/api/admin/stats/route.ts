import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [[siblingsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM profiles WHERE role IN ('user', 'sibling')`
    );
    const totalSiblings = Number((siblingsRow as { c: number }).c || 0);

    const [[mentorsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM profiles WHERE role = 'sibling_coach'`
    );
    const totalMentors = Number((mentorsRow as { c: number }).c || 0);

    const [[activeMentorsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM mentor_profiles WHERE is_available = 1`
    );
    const availableMentors = Number((activeMentorsRow as { c: number }).c || 0);

    const [[connectionsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM mentor_mentees`
    );
    const totalConnections = Number((connectionsRow as { c: number }).c || 0);

    const [[activeConnectionsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM mentor_mentees WHERE status = 'active'`
    );
    const activeConnections = Number((activeConnectionsRow as { c: number }).c || 0);

    const [[pendingConnectionsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM mentor_mentees WHERE status = 'pending'`
    );
    const pendingConnections = Number((pendingConnectionsRow as { c: number }).c || 0);

    const [[matchRequestsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM match_requests`
    );
    const totalMatchRequests = Number((matchRequestsRow as { c: number }).c || 0);

    const [[pendingMatchesRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM match_requests WHERE status = 'pending'`
    );
    const pendingMatchRequests = Number((pendingMatchesRow as { c: number }).c || 0);

    const [[productsRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM products WHERE is_active = 1`
    );
    const activeProducts = Number((productsRow as { c: number }).c || 0);

    const [[ordersRow]] = await db.execute(
      `SELECT COUNT(*) as c FROM orders`
    );
    const totalOrders = Number((ordersRow as { c: number }).c || 0);

    return NextResponse.json({
      totalSiblings,
      totalMentors,
      availableMentors,
      totalConnections,
      activeConnections,
      pendingConnections,
      totalMatchRequests,
      pendingMatchRequests,
      activeProducts,
      totalOrders,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
