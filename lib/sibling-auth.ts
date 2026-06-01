import { cookies } from "next/headers";
import { createHash } from "crypto";
import db from "@/lib/db";

export interface SiblingUser {
  id: string;
  email: string;
  full_name: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  pronouns: string | null;
  location_city: string | null;
  timezone: string | null;
  date_of_birth: string | null;
  role: string;
  email_verified: number;
  created_at: string;
  isPendingMentor?: boolean;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function getSiblingSession(): Promise<SiblingUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sibling_token")?.value;
  if (!token) return null;

  const [rows] = await db.execute(
    `SELECT p.id, p.email, p.full_name, p.display_name, p.bio, p.avatar_url, p.pronouns, p.location_city, p.timezone, p.date_of_birth, p.role, p.email_verified, p.created_at,
            mp.approved AS mentor_approved
     FROM sessions s
     JOIN profiles p ON p.id = s.user_id
     LEFT JOIN mentor_profiles mp ON mp.user_id = p.id AND p.role = 'sibling_coach'
     WHERE s.token = ? AND s.expires_at > NOW() AND p.role IN ('user', 'sibling', 'sibling_coach')`,
    [hashToken(token)]
  );
  const result = rows as (SiblingUser & { mentor_approved: number | null })[];
  const row = result[0];
  if (!row) return null;
  return {
    ...row,
    isPendingMentor: row.role === 'sibling_coach' && row.mentor_approved !== 1,
  };
}

export async function requireSibling(): Promise<SiblingUser> {
  const user = await getSiblingSession();
  if (!user) throw new Error("Not authenticated");
  return user;
}
