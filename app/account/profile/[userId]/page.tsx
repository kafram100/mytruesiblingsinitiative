import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowLeft, MapPin, Cake, Languages, User as UserIcon, GraduationCap } from "lucide-react";
import { getSiblingSession } from "@/lib/sibling-auth";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

const pillarLabels: Record<string, string> = {
  "sibling-connect": "Sibling Connect",
  "adult-safe-place": "Adult Safe Place",
  "inclusive-support-hub": "Inclusive Support Hub",
};

const supportLabels: Record<string, string> = {
  mentorship: "One-on-One Mentorship",
  "peer-support": "Peer Support Group",
  "crisis-companion": "Crisis Companion",
  community: "Community Connection",
  caregiver: "Caregiver Support",
};

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

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await getSiblingSession();
  if (!user) return null;

  const { userId } = await params;

  const [rows] = await db.execute(
    `SELECT id, full_name, display_name, bio, avatar_url, pronouns, location_city, date_of_birth, role, created_at
     FROM profiles WHERE id = ?`,
    [userId]
  );
  const profile = (rows as Record<string, unknown>[])[0];
  if (!profile) notFound();

  // Fetch mentor profile data if role is sibling_coach
  let mentorDetails: Record<string, unknown> | null = null;
  if (profile.role === "sibling_coach") {
    const [mentorRows] = await db.execute(
      `SELECT expertise_areas, experience_years, mentorship_bio, certification, occupation, organization
       FROM mentor_profiles WHERE user_id = ? AND approved = 1`,
      [userId]
    );
    mentorDetails = (mentorRows as Record<string, unknown>[])[0] || null;
  }

  const [reqRows] = await db.execute(
    `SELECT pillar, support_type, interests, age_range, language
     FROM match_requests WHERE user_id = ? AND status IN ('pending', 'matched')
     ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  const matchRequest = (reqRows as Record<string, unknown>[])[0] || null;

  let interests: string[] = [];
  if (matchRequest?.interests) {
    try {
      interests = JSON.parse(matchRequest.interests as string);
    } catch {}
  }

  function calcAge(dob: string | null): string | null {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const mDiff = now.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) age--;
    return `${age}`;
  }

  const displayName = (profile.display_name as string) || (profile.full_name as string) || "Unknown";
  const age = calcAge(profile.date_of_birth as string | null);

  return (
    <div className="max-w-2xl">
      <Link
        href="/account/matches"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </Link>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-teal/10 via-brand-pink-hex/10 to-brand-yellow-hex/10 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-4 ring-white">
              {profile.avatar_url ? (
                <img src={profile.avatar_url as string} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-display font-bold truncate">{displayName}</h1>
                {roleBadge((profile.role as string) || "")}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                {age && (
                  <span className="inline-flex items-center gap-1">
                    <Cake className="h-3.5 w-3.5" />
                    {age} years old
                  </span>
                )}
                {profile.pronouns && (
                  <span>{profile.pronouns as string}</span>
                )}
                {profile.location_city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location_city as string}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Details */}
        {mentorDetails && (
          <div className="px-6 md:px-8 py-4 border-b border-border">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Mentor Profile</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {mentorDetails.occupation && (
                <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                  {mentorDetails.occupation as string}
                </span>
              )}
              {mentorDetails.organization && (
                <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                  {mentorDetails.organization as string}
                </span>
              )}
              {mentorDetails.certification && (
                <span className="inline-flex items-center rounded-full border bg-brand-teal/10 text-brand-teal px-3 py-1 text-xs font-medium">
                  {mentorDetails.certification as string}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                <GraduationCap className="h-3 w-3" />
                {(mentorDetails.experience_years as number) > 0
                  ? `${mentorDetails.experience_years as number}y experience`
                  : "New mentor"}
              </span>
            </div>
            {mentorDetails.mentorship_bio && (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mt-2">
                {mentorDetails.mentorship_bio as string}
              </p>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="px-6 md:px-8 py-4 border-b border-border">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{profile.bio as string}</p>
          </div>
        )}

        {/* Match Request Info */}
        {matchRequest && (
          <div className="px-6 md:px-8 py-4 border-b border-border">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Looking For
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                {pillarLabels[matchRequest.pillar as string] || (matchRequest.pillar as string)}
              </span>
              <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                {supportLabels[matchRequest.support_type as string] || (matchRequest.support_type as string)}
              </span>
              {matchRequest.language && (
                <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                  <Languages className="h-3 w-3" />
                  {matchRequest.language as string}
                </span>
              )}
              {matchRequest.age_range && (
                <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                  Age: {matchRequest.age_range as string}
                </span>
              )}
            </div>
            {interests.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-brand-teal/10 px-2.5 py-1 text-xs font-medium text-brand-teal">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Member since */}
        <div className="px-6 md:px-8 py-3">
          <p className="text-xs text-muted-foreground">
            Member since {new Date(profile.created_at as string).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
