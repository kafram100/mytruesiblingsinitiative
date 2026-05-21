import db from "@/lib/db";

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  created_at: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export async function getOrCreateConversation(
  user1Id: string,
  user2Id: string
): Promise<string> {
  const [a, b] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
  const [existing] = await db.execute(
    `SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ?`,
    [a, b]
  );
  const rows = existing as { id: string }[];
  if (rows.length > 0) return rows[0].id;

  const id = await db.execute(
    `INSERT INTO conversations (id, user1_id, user2_id) VALUES (gen_random_uuid(), ?, ?) RETURNING id`,
    [a, b]
  );
  return ((id[0] as { id: string }[])[0]).id;
}

export async function getConversations(
  userId: string
): Promise<Conversation[]> {
  try {
    const [rows] = await db.execute(
      `SELECT
        c.id, c.user1_id, c.user2_id, c.last_message_at, c.created_at,
        CASE WHEN c.user1_id = ? THEN p2.full_name ELSE p1.full_name END as other_user_name,
        CASE WHEN c.user1_id = ? THEN p2.avatar_url ELSE p1.avatar_url END as other_user_avatar,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND read_at IS NULL) as unread_count
      FROM conversations c
      JOIN profiles p1 ON p1.id = c.user1_id
      JOIN profiles p2 ON p2.id = c.user2_id
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY c.last_message_at DESC`,
      [userId, userId, userId, userId, userId]
    );
    return rows as Conversation[];
  } catch {
    return [];
  }
}

export async function getMessages(
  conversationId: string,
  limit = 50,
  beforeId?: string
): Promise<Message[]> {
  try {
    if (beforeId) {
      const [rows] = await db.execute(
        `SELECT * FROM messages WHERE conversation_id = ? AND id < ? ORDER BY created_at DESC LIMIT ?`,
        [conversationId, beforeId, limit]
      );
      return (rows as Message[]).reverse();
    }
    const [rows] = await db.execute(
      `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?`,
      [conversationId, limit]
    );
    return (rows as Message[]).reverse();
  } catch {
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  if (!content.trim()) return;
  await db.execute(
    `INSERT INTO messages (id, conversation_id, sender_id, content)
     VALUES (gen_random_uuid(), ?, ?, ?)`,
    [conversationId, senderId, content.trim()]
  );
  await db.execute(
    `UPDATE conversations SET last_message_at = NOW() WHERE id = ?`,
    [conversationId]
  );
}

export async function markMessagesRead(
  conversationId: string,
  userId: string
) {
  await db.execute(
    `UPDATE messages SET read_at = NOW()
     WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL`,
    [conversationId, userId]
  );
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE (c.user1_id = ? OR c.user2_id = ?) AND m.sender_id != ? AND m.read_at IS NULL`,
      [userId, userId, userId]
    );
    return Number((rows as { count: number }[])[0]?.count || 0);
  } catch {
    return 0;
  }
}
