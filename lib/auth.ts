import { cookies } from "next/headers";
import db from "@/lib/db";

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  password_hash?: string;
  must_change_password?: number;
}

export interface SessionRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
  password_hash: string;
  must_change_password: number;
  created_at: string;
}

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: number;
  created_at: string;
}

export interface ContactRowWithBool {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AggregateResult {
  total: number;
}

export interface DonationRow {
  id: string;
  amount_usd: number;
  currency: string;
  recurrence: string;
  purpose: string;
  sponsor_tier: string | null;
  status: string;
  donor_email: string | null;
  donor_name: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export interface SettingsRow {
  key: string;
  value: string | null;
}

export interface OrderRow {
  id: string;
  items: string;
  total_amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;

  const [rows] = await db.execute(
    `SELECT p.id, p.email, p.full_name, p.role, p.password_hash, p.must_change_password
     FROM sessions s
     JOIN profiles p ON p.id = s.user_id
     WHERE s.token = ? AND s.expires_at > NOW()`,
    [token]
  );
  const result = rows as SessionUser[];
  return result[0] || null;
}

export async function checkAdmin(): Promise<string | null> {
  const user = await getSessionUser();
  if (user?.role === "admin") return user.email;
  return null;
}


