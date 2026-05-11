import { Suspense } from "react";
import type { Metadata } from "next";

import db from "@/lib/db";
import { SettingsRow } from "@/lib/auth";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
};

async function getSettings() {
  const [rows] = await db.execute("SELECT `key`, `value` FROM settings");
  const settings: Record<string, string> = {};
  for (const row of rows as SettingsRow[]) {
    settings[row.key] = row.value || "";
  }
  return settings;
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure email notifications and payment gateway.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <SettingsForm initial={settings} />
      </Suspense>
    </div>
  );
}
