"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings2, Loader2 } from "lucide-react";

import SettingsForm from "@/components/admin/SettingsForm";

export default function SettingsSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const reloadSettings = useCallback(async () => {
    const r = await fetch("/api/settings");
    const data = await r.json();
    setSettings(data?.settings || {});
  }, []);

  useEffect(() => {
    reloadSettings()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reloadSettings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gray-100 p-2 text-gray-600">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure email notifications and payment gateway.</p>
        </div>
      </div>
      <SettingsForm initial={settings} onSaved={reloadSettings} />
    </div>
  );
}
