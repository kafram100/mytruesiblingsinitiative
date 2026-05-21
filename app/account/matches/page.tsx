"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Clock, Check, X, Loader2, Trash2, ChevronDown, ChevronUp, ExternalLink, User, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchRequest {
  id: string;
  pillar: string;
  support_type: string;
  status: string;
  created_at: string;
  interests: string;
}

interface Match {
  id: string;
  request_id: string;
  matched_user_id: string;
  other_user_id?: string;
  score: number | string;
  status: string;
  created_at: string;
  other_user_name: string;
  other_display_name: string | null;
  other_user_avatar: string | null;
  other_bio: string | null;
  other_pronouns: string | null;
  other_location: string | null;
  other_date_of_birth: string | null;
  other_pillar: string | null;
  other_support_type: string | null;
  other_interests: string | null;
  other_age_range: string | null;
  other_language: string | null;
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

function ProfileCard({ match, userId }: { match: Match; userId?: string }) {
  const [expanded, setExpanded] = useState(false);

  const displayName = match.other_display_name || match.other_user_name;
  const age = calcAge(match.other_date_of_birth);
  let otherInterests: string[] = [];
  try { otherInterests = JSON.parse(match.other_interests || "[]"); } catch {}

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

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {match.other_user_avatar ? (
              <img src={match.other_user_avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{displayName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>Score: {Math.round(Number(match.score))}%</span>
              {age && <><span>&middot;</span><span>{age} years old</span></>}
              {match.other_pronouns && (
                <><span>&middot;</span><span>{match.other_pronouns}</span></>
              )}
              {match.other_location && (
                <><span>&middot;</span><span>{match.other_location}</span></>
              )}
            </div>
          </div>
        </div>
        {userId && (
          <Link
            href={`/account/profile/${userId}`}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
          >
            View Profile <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Bio preview */}
      {match.other_bio && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {match.other_bio}
        </p>
      )}

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs font-medium text-primary mt-3 hover:underline"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Show less" : "Show more details"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {/* What they're looking for */}
          {(match.other_pillar || match.other_support_type) && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Looking For
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.other_pillar && (
                  <span className="inline-block rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1">
                    {pillarLabels[match.other_pillar] || match.other_pillar}
                  </span>
                )}
                {match.other_support_type && (
                  <span className="inline-block rounded-full bg-brand-pink/10 text-brand-pink text-xs px-2.5 py-1">
                    {supportLabels[match.other_support_type] || match.other_support_type}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Age range + language */}
          {(match.other_age_range || match.other_language) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {match.other_age_range && <span>Age: {match.other_age_range}</span>}
              {match.other_language && <span>Language: {match.other_language}</span>}
            </div>
          )}

          {/* Interests */}
          {otherInterests.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Interests
              </p>
              <div className="flex flex-wrap gap-1.5">
                {otherInterests.map((i) => (
                  <span key={i} className="inline-block rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-1">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [incomingMatches, setIncomingMatches] = useState<Match[]>([]);
  const [outgoingMatches, setOutgoingMatches] = useState<Match[]>([]);
  const [suggestedMentors, setSuggestedMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [processingMatch, setProcessingMatch] = useState<string | null>(null);
  const [processingCancel, setProcessingCancel] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [mentorRequesting, setMentorRequesting] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [matchRes, meRes, mentorRes] = await Promise.all([
        fetch("/api/match"),
        fetch("/api/auth/sibling/me"),
        fetch("/api/mentors/suggested"),
      ]);
      if (matchRes.ok) {
        const data = await matchRes.json();
        setRequests(data.requests || []);
        setIncomingMatches(data.incomingMatches || []);
        setOutgoingMatches(data.outgoingMatches || []);
      }
      if (meRes.ok) {
        const me = await meRes.json();
        setCurrentUserId(me.id);
      }
      if (mentorRes.ok) {
        const data = await mentorRes.json();
        setSuggestedMentors(data.suggested || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      matched: "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-gray-100 text-gray-500",
    };
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  const handleProcessMatch = async () => {
    setProcessing("processing");
    try {
      const res = await fetch("/api/match/process", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        if (data.matches?.length) {
          alert(`Found ${data.matches.length} potential matche(s)!`);
        } else {
          alert(data.message || "No matches found yet. We'll notify you when someone joins.");
        }
        loadData();
      } else {
        alert(data.error || "Failed to process");
      }
    } catch {
      alert("Network error");
    }
    setProcessing(null);
  };

  const handleMatchResponse = async (matchId: string, action: "accept" | "decline") => {
    setProcessingMatch(matchId);
    try {
      const res = await fetch(`/api/match/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed");
      }
    } catch {
      alert("Network error");
    }
    setProcessingMatch(null);
  };

  const handleRequestMentor = async (mentorProfileId: string) => {
    setMentorRequesting(mentorProfileId);
    try {
      const res = await fetch("/api/mentors/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorProfileId, message: "" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Mentorship request sent!");
        loadData();
      } else {
        alert(data.error || "Failed to request mentor");
      }
    } catch {
      alert("Network error");
    }
    setMentorRequesting(null);
  };

  const handleCancel = async (requestId: string) => {
    if (!confirm("Cancel this match request?")) return;
    setProcessingCancel(requestId);
    try {
      const res = await fetch(`/api/match/${requestId}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel");
      }
    } catch {
      alert("Network error");
    }
    setProcessingCancel(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-display font-bold">My Matches</h1>
        <Button
          onClick={handleProcessMatch}
          disabled={processing === "processing"}
          size="sm"
          className="rounded-full"
        >
          {processing === "processing" ? (
            <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
          ) : (
            <><Heart className="h-4 w-4 mr-1" /> Find Matches</>
          )}
        </Button>
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Track your sibling match requests and connections.
      </p>

      {/* Outgoing — waiting for their response */}
      {outgoingMatches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-display font-bold mb-1">
            Sent Matches ({outgoingMatches.length})
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            You&apos;ve been matched with these siblings. They need to respond.
          </p>
          <div className="space-y-3">
            {outgoingMatches.map((match) => (
              <div key={match.id} className="opacity-80">
                <ProfileCard match={match} userId={match.matched_user_id} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Incoming — needs your response */}
      {incomingMatches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-display font-bold mb-1">
            Needs Your Response ({incomingMatches.length})
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            These siblings want to connect with you. Review their profile and decide.
          </p>
          <div className="space-y-4">
            {incomingMatches.map((match) => (
              <div key={match.id}>
                <ProfileCard match={match} userId={match.other_user_id} />
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleMatchResponse(match.id, "accept")}
                    disabled={processingMatch === match.id}
                    className="rounded-full"
                  >
                    {processingMatch === match.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMatchResponse(match.id, "decline")}
                    disabled={processingMatch === match.id}
                    className="rounded-full text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Mentors */}
      {suggestedMentors.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Suggested Mentors ({suggestedMentors.length})
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Experienced mentors matched to your interests. Connect with them for one-on-one guidance.
          </p>
          <div className="space-y-3">
            {suggestedMentors.map((mentor: any) => (
              <div key={mentor.mentorProfileId} className="rounded-2xl border border-brand-yellow/30 bg-gradient-to-r from-brand-yellow/5 to-transparent p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {mentor.avatarUrl ? (
                        <img src={mentor.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{mentor.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {mentor.experienceYears}y experience</span>
                        {mentor.pronouns && <><span>&middot;</span><span>{mentor.pronouns}</span></>}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1 shrink-0">
                    <Sparkles className="h-3 w-3" /> Match
                  </span>
                </div>
                {mentor.bio && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{mentor.bio}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mentor.expertiseAreas.slice(0, 5).map((area: string) => (
                    <span key={area} className="inline-block rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1">{area}</span>
                  ))}
                  {mentor.expertiseAreas.length > 5 && (
                    <span className="inline-block rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-1">+{mentor.expertiseAreas.length - 5}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <Link
                    href={`/account/profile/${mentor.userId}`}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => handleRequestMentor(mentor.mentorProfileId)}
                    disabled={mentorRequesting === mentor.mentorProfileId}
                    className="rounded-full"
                  >
                    {mentorRequesting === mentor.mentorProfileId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <GraduationCap className="h-3 w-3" />
                    )}
                    Request Mentorship
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Match Requests */}
      {requests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No matches yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Submit a match request to find your sibling, then click &quot;Find Matches&quot; to process it.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/match">
              Find a Sibling <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            let interests: string[] = [];
            try { interests = JSON.parse(req.interests); } catch {}

            const cancellable = req.status === "pending" || req.status === "matched";

            return (
              <div key={req.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg capitalize">
                        {req.pillar?.replace(/-/g, " ")}
                      </h3>
                      {statusBadge(req.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 capitalize">
                      {req.support_type?.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {interests.map((i) => (
                      <span key={i} className="inline-block rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1">
                        {i}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(req.created_at)}
                  </div>
                  {cancellable && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancel(req.id)}
                      disabled={processingCancel === req.id}
                      className="text-red-600 hover:bg-red-50 text-xs"
                    >
                      {processingCancel === req.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {requests.some((r) => r.status === "pending") && requests.length > 0 && (
        <div className="mt-6 rounded-xl border border-brand-yellow/30 bg-brand-yellow/5 p-4 text-center">
          <p className="text-sm font-medium text-foreground mb-2">
            You have pending match requests. Click &quot;Find Matches&quot; above to process them!
          </p>
        </div>
      )}
    </div>
  );
}
