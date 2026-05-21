import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [rows] = await db.execute(`
      SELECT
        EXTRACT(YEAR FROM created_at) AS yr,
        EXTRACT(MONTH FROM created_at) AS mo,
        COUNT(*) AS visits,
        COUNT(DISTINCT visitor_id) AS unique_visitors
      FROM page_views
      WHERE created_at >= $1::date
      GROUP BY yr, mo
      ORDER BY yr, mo
    `, [`${currentYear}-01-01`]);

    const byMonth: Record<string, { visits: number; unique: number }> = {};
    for (const row of rows as { yr: number; mo: number; visits: number; unique_visitors: number }[]) {
      const key = `${String(row.yr)}-${String(row.mo).padStart(2, "0")}`;
      byMonth[key] = { visits: Number(row.visits), unique: Number(row.unique_visitors) };
    }

    const months: { label: string; visits: number; unique: number }[] = [];
    for (let mo = 1; mo <= currentMonth; mo++) {
      const key = `${currentYear}-${String(mo).padStart(2, "0")}`;
      const data = byMonth[key] || { visits: 0, unique: 0 };
      months.push({ label: MONTHS[mo - 1], visits: data.visits, unique: data.unique });
    }

    return NextResponse.json({ months, total: months.reduce((s, m) => s + m.visits, 0) });
  } catch {
    return NextResponse.json({ months: [], total: 0 });
  }
}
