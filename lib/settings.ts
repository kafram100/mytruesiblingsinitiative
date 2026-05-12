import db from "@/lib/db";
import { SettingsRow } from "@/lib/auth";

export async function getSettings() {
  const [rows] = await db.execute("SELECT `key`, `value` FROM settings");
  const settings: Record<string, string> = {};
  for (const row of rows as SettingsRow[]) {
    settings[row.key] = row.value || "";
  }
  return settings;
}
