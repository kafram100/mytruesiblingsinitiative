import db from "@/lib/db";

export interface ActivityEntry {
  id: string;
  user_id: string;
  action: string;
  details: string | null;
  created_at: string;
}

export async function logUserActivity(
  userId: string,
  action: string,
  details?: string
) {
  await db.execute(
    `INSERT INTO user_activity (id, user_id, action, details)
     VALUES (gen_random_uuid(), ?, ?, ?)`,
    [userId, action, details || null]
  );
}

export async function getUserActivity(
  userId: string,
  limit = 20
): Promise<ActivityEntry[]> {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
    return rows as ActivityEntry[];
  } catch {
    return [];
  }
}
