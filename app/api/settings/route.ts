import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin, getSessionUser, SettingsRow } from "@/lib/auth";
import { sendTestEmail } from "@/lib/mail";
import { logActivity } from "@/lib/activity-log";
import { validateOrigin } from "@/lib/csrf";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await db.execute("SELECT `key`, `value` FROM settings");
  const raw = rows as SettingsRow[];
  const SENSITIVE_KEYS = new Set(["smtp_pass", "stripe_secret_key", "stripe_webhook_secret"]);
  const settings: Record<string, string> = {};
  for (const row of raw) {
    settings[row.key] = SENSITIVE_KEYS.has(row.key) && row.value ? "********" : (row.value || "");
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const allowed = [
      "notification_email",
      "smtp_host",
      "smtp_port",
      "smtp_user",
      "smtp_pass",
      "smtp_from",
      "stripe_publishable_key",
      "stripe_secret_key",
      "stripe_webhook_secret",
    ];

    const updated: string[] = [];
    for (const key of allowed) {
      if (key in body) {
        await db.execute(
          "INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
          [key, body[key]]
        );
        updated.push(key);
      }
    }

    if (updated.length > 0) {
      const user = await getSessionUser();
      if (user?.email) await logActivity(user.email, "settings.update", `Updated: ${updated.join(", ")}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) return csrf.error;

  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, to } = await request.json();

    if (action === "test-email") {
      const result = await sendTestEmail(to);
      const user = await getSessionUser();
      if (user?.email) await logActivity(user.email, "settings.test_email", `To: ${to}`);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Settings action error:", err);
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500 }
    );
  }
}
