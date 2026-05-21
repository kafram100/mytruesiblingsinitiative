import db from "@/lib/db";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message?: string,
  link?: string
) {
  await db.execute(
    `INSERT INTO notifications (id, user_id, type, title, message, link)
     VALUES (gen_random_uuid(), ?, ?, ?, ?, ?)`,
    [userId, type, title, message || null, link || null]
  );
}

export async function getNotifications(
  userId: string,
  limit = 20
): Promise<Notification[]> {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
    return rows as Notification[];
  } catch {
    return [];
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_at IS NULL`,
      [userId]
    );
    return Number((rows as { count: number }[])[0]?.count || 0);
  } catch {
    return 0;
  }
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
) {
  await db.execute(
    `UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?`,
    [notificationId, userId]
  );
}

export async function markAllNotificationsRead(userId: string) {
  await db.execute(
    `UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL`,
    [userId]
  );
}
