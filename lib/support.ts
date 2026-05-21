import db from "@/lib/db";
import { randomUUID } from "crypto";

export interface SupportRequest {
  id: string;
  user_id: string;
  type: string;
  subject: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  reply_count?: number;
  latest_reply_at?: string;
}

export interface SupportReply {
  id: string;
  request_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_name?: string;
  user_role?: string;
}

export const SUPPORT_TYPES = [
  { value: "financial_assistance", label: "Financial Assistance" },
  { value: "general_support", label: "General Support" },
  { value: "other", label: "Other" },
] as const;

export async function createSupportRequest(
  userId: string,
  type: string,
  subject: string,
  description: string
): Promise<SupportRequest> {
  const id = randomUUID();
  await db.execute(
    `INSERT INTO support_requests (id, user_id, type, subject, description, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [id, userId, type, subject, description]
  );
  return { id, user_id: userId, type, subject, description, status: "pending", created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
}

export async function getSupportRequests(userId: string): Promise<SupportRequest[]> {
  const [rows] = await db.execute(
    `SELECT sr.*,
            (SELECT COUNT(*) FROM support_replies WHERE request_id = sr.id) as reply_count,
            (SELECT MAX(created_at) FROM support_replies WHERE request_id = sr.id) as latest_reply_at
     FROM support_requests sr
     WHERE sr.user_id = ?
     ORDER BY sr.created_at DESC`,
    [userId]
  );
  return rows as SupportRequest[];
}

export async function getSupportRequestById(
  requestId: string,
  userId?: string
): Promise<SupportRequest | null> {
  let sql = `SELECT sr.* FROM support_requests sr WHERE sr.id = ?`;
  const params: string[] = [requestId];

  if (userId) {
    sql += ` AND sr.user_id = ?`;
    params.push(userId);
  }

  const [rows] = await db.execute(sql, params);
  const result = rows as SupportRequest[];
  return result[0] || null;
}

export async function getSupportReplies(requestId: string): Promise<SupportReply[]> {
  const [rows] = await db.execute(
    `SELECT sr.*, p.full_name as user_name, p.role as user_role
     FROM support_replies sr
     JOIN profiles p ON p.id = sr.user_id
     WHERE sr.request_id = ?
     ORDER BY sr.created_at ASC`,
    [requestId]
  );
  return rows as SupportReply[];
}

export async function addSupportReply(
  requestId: string,
  userId: string,
  message: string
): Promise<SupportReply> {
  const id = randomUUID();
  await db.execute(
    `INSERT INTO support_replies (id, request_id, user_id, message)
     VALUES (?, ?, ?, ?)`,
    [id, requestId, userId, message]
  );
  return { id, request_id: requestId, user_id: userId, message, created_at: new Date().toISOString() };
}

export async function updateSupportRequestStatus(
  requestId: string,
  status: string
): Promise<void> {
  await db.execute(
    `UPDATE support_requests SET status = ?, updated_at = NOW() WHERE id = ?`,
    [status, requestId]
  );
}

export async function getAllSupportRequests(): Promise<SupportRequest[]> {
  const [rows] = await db.execute(
    `SELECT sr.*, p.full_name as user_name, p.email as user_email,
            (SELECT COUNT(*) FROM support_replies WHERE request_id = sr.id) as reply_count,
            (SELECT MAX(created_at) FROM support_replies WHERE request_id = sr.id) as latest_reply_at
     FROM support_requests sr
     JOIN profiles p ON p.id = sr.user_id
     ORDER BY CASE sr.status WHEN 'pending' THEN 0 WHEN 'in_review' THEN 1 ELSE 2 END, sr.created_at DESC`
  );
  return rows as SupportRequest[];
}
