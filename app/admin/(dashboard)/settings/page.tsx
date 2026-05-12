import { Suspense } from "react";
import type { Metadata } from "next";

import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
};

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
