import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin, ContactRow, DonationRow } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

const PERIOD_SQL: Record<string, string> = {
  today: "created_at >= CURDATE()",
  this_week: "created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)",
  this_month: "created_at >= DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY)",
  this_year: "created_at >= MAKEDATE(YEAR(CURDATE()), 1)",
};

const PERIOD_LABELS: Record<string, string> = {
  today: "today",
  this_week: "this-week",
  this_month: "this-month",
  this_year: "this-year",
  all: "all-time",
};

function escapeCSV(value: unknown): string {
  let str = String(value ?? "");
  if (/^[=+\-@]/.test(str)) {
    str = `\t${str}`;
  }
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCSV(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.map(escapeCSV).join(",");
  const body = rows.map((row) =>
    columns.map((col) => escapeCSV(row[col])).join(",")
  );
  return [header, body].join("\r\n");
}

function buildWhereClause(period: string): string {
  const condition = PERIOD_SQL[period];
  return condition ? `WHERE ${condition}` : "";
}

const EXPORT_CONFIG: Record<
  string,
  { columns: string[]; table: string; select: string }
> = {
  contacts: {
    columns: ["id", "name", "email", "subject", "message", "read", "created_at"],
    table: "contacts",
    select:
      "id, name, email, subject, message, `read`, created_at",
  },
  donations: {
    columns: [
      "id",
      "amount_usd",
      "currency",
      "recurrence",
      "purpose",
      "sponsor_tier",
      "status",
      "donor_email",
      "donor_name",
      "created_at",
    ],
    table: "donations",
    select:
      "id, amount_usd, currency, recurrence, purpose, sponsor_tier, status, donor_email, donor_name, created_at",
  },
};

export async function GET(request: Request) {
  const adminEmail = await checkAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type");
  const rawPeriod = searchParams.get("period") || "all";

  if (!rawType || !EXPORT_CONFIG[rawType]) {
    return NextResponse.json(
      { error: "Invalid export type. Use: contacts, donations" },
      { status: 400 }
    );
  }

  if (!PERIOD_LABELS[rawPeriod]) {
    return NextResponse.json(
      {
        error:
          "Invalid period. Use: today, this_week, this_month, this_year, all",
      },
      { status: 400 }
    );
  }

  const type = rawType;
  const period = rawPeriod;
  const config = EXPORT_CONFIG[type];
  const where = buildWhereClause(period);
  const periodLabel = PERIOD_LABELS[period];

  try {
    const sql = `SELECT ${config.select} FROM ${config.table} ${where} ORDER BY created_at DESC`;
    const [rawRows] = await db.execute(sql);
    const rows = rawRows as (ContactRow | DonationRow)[];
    const filename = `${type}-export-${periodLabel}.csv`;
    const csv = rowsToCSV(rows as unknown as Record<string, unknown>[], config.columns);

    await logActivity(
      adminEmail,
      `export.${type}`,
      `Exported ${type} (${periodLabel})`
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
