import { getSiblingSession } from "@/lib/sibling-auth";
import db from "@/lib/db";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

function roleBadge(role: string) {
  const styles: Record<string, string> = {
    sibling_coach: "bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30",
    admin: "bg-red-100 text-red-700 border-red-200",
  };
  const labels: Record<string, string> = {
    sibling_coach: "Sibling Coach",
    admin: "Admin",
  };
  if (!styles[role]) return null;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[role]}`}>
      {labels[role] || role}
    </span>
  );
}

export default async function ProfilePage() {
  const user = await getSiblingSession();
  if (!user) return null;

  const [rows] = await db.execute(
    `SELECT id, email, full_name, display_name, bio, avatar_url, pronouns, location_city, date_of_birth, role FROM profiles WHERE id = ?`,
    [user.id]
  );
  const profile = (rows as Record<string, unknown>[])[0];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-display font-bold">My Profile</h1>
        {roleBadge((profile?.role as string) || "")}
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Your profile information. This is how other siblings see you.
      </p>
      <ProfileForm
        user={{
          fullName: (profile?.full_name as string) || "",
          email: (profile?.email as string) || "",
          displayName: (profile?.display_name as string) || null,
          bio: (profile?.bio as string) || null,
          avatarUrl: (profile?.avatar_url as string) || null,
          pronouns: (profile?.pronouns as string) || null,
          locationCity: (profile?.location_city as string) || null,
          dateOfBirth: (profile?.date_of_birth as string) || null,
        }}
      />
    </div>
  );
}
