import db from "@/lib/db";

export interface ActivityEntry {
  id: string;
  admin_email: string;
  action: string;
  details: string | null;
  created_at: string;
}

export async function logActivity(
  adminEmail: string,
  action: string,
  details?: string
) {
  await db.execute(
    `INSERT INTO activity_log (id, admin_email, action, details, created_at)
     VALUES (UUID(), ?, ?, ?, NOW())`,
    [adminEmail, action, details || null]
  );
}

export async function getActivity(
  limit = 20
): Promise<ActivityEntry[]> {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?",
      [limit]
    );
    return rows as ActivityEntry[];
  } catch {
    return [];
  }
}
