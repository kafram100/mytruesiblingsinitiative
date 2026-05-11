import db from "@/lib/db";

export interface ActivityEntry {
  id: string;
  admin_email: string;
  action: string;
  details: string | null;
  created_at: string;
}

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id VARCHAR(36) PRIMARY KEY,
      admin_email VARCHAR(255) NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function logActivity(
  adminEmail: string,
  action: string,
  details?: string
) {
  await ensureTable();
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
    await ensureTable();
    const [rows] = await db.execute(
      "SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?",
      [limit]
    );
    return rows as ActivityEntry[];
  } catch {
    return [];
  }
}
