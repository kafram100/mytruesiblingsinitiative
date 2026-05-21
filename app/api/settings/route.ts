import { NextResponse } from "next/server";

import db from "@/lib/db";
import { checkAdmin, getSessionUser, SettingsRow } from "@/lib/auth";
import { sendTestEmail } from "@/lib/mail";
import { logActivity } from "@/lib/activity-log";
import { validateOrigin } from "@/lib/csrf";
import { rateLimitByIp } from "@/lib/rate-limit";
import { SETTINGS_SECRET_MASK } from "@/lib/settings-constants";

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await db.execute('SELECT "key", "value" FROM settings');
  const raw = rows as SettingsRow[];
  const SENSITIVE_KEYS = new Set(["smtp_pass", "stripe_secret_key", "stripe_webhook_secret"]);
  const settings: Record<string, string> = {};
  for (const row of raw) {
    settings[row.key] =
      SENSITIVE_KEYS.has(row.key) && row.value ? SETTINGS_SECRET_MASK : row.value || "";
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
    ];

    const envOnly = new Set(["stripe_secret_key", "stripe_webhook_secret"]);
    for (const key of envOnly) {
      if (key in body) {
        return NextResponse.json(
          { error: `${key} can only be set via environment variable` },
          { status: 400 }
        );
      }
    }

    const updated: string[] = [];
    for (const key of allowed) {
      if (key in body) {
        const value = body[key];
        if (
          key === "smtp_pass" &&
          (value === SETTINGS_SECRET_MASK || value === "••••••••")
        ) {
          continue;
        }
        await db.execute(
          'INSERT INTO settings ("key", "value") VALUES (?, ?) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED.value',
          [key, value]
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
      const { ok } = await rateLimitByIp(
        request,
        "settings-test-email",
        20,
        60_000
      );
      if (!ok) {
        return NextResponse.json(
          { error: "Too many test emails. Try again shortly." },
          { status: 429 }
        );
      }
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
