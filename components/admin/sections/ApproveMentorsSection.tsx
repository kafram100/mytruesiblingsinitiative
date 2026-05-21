"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Check, X, Loader2, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/admin-utils";
import { Button } from "@/components/ui/button";

interface MentorEntry {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  occupation: string | null;
  organization: string | null;
  expertiseAreas: string[];
  experienceYears: number;
  mentorshipBio: string | null;
  certification: string | null;
  createdAt: string;
}

export default function ApproveMentorsSection() {
  const [mentors, setMentors] = useState<MentorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchMentors = () => {
    setLoading(true);
    fetch("/api/admin/mentors/pending")
      .then((r) => r.json())
      .then((data) => {
        setMentors(data.mentors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleApprove = async (mentorProfileId: string) => {
    setActionId(mentorProfileId);
    try {
      await fetch("/api/admin/mentors/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorProfileId, approved: true }),
      });
      setMentors((prev) => prev.filter((m) => m.id !== mentorProfileId));
    } catch {}
    setActionId(null);
  };

  const handleReject = async (mentorProfileId: string) => {
    setActionId(mentorProfileId);
    try {
      await fetch("/api/admin/mentors/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorProfileId, approved: false }),
      });
      setMentors((prev) => prev.filter((m) => m.id !== mentorProfileId));
    } catch {}
    setActionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Approve Mentors
            </h1>
            <p className="text-sm text-muted-foreground">
              Review and approve mentor/coach account registrations.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMentors} className="rounded-full">
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : mentors.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <GraduationCap className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No pending mentor approvals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{mentor.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.email}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 shrink-0">
                  Pending Review
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Occupation</p>
                  <p className="text-sm">{mentor.occupation || "\u2014"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Organization</p>
                  <p className="text-sm">{mentor.organization || "\u2014"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Experience</p>
                  <p className="text-sm">{mentor.experienceYears} years</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Certification</p>
                  <p className="text-sm">{mentor.certification || "\u2014"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Registered</p>
                  <p className="text-sm">{formatDate(mentor.createdAt)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expertise Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.expertiseAreas.map((area) => (
                    <span key={area} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {mentor.mentorshipBio && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{mentor.mentorshipBio}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button
                  size="sm"
                  onClick={() => handleApprove(mentor.id)}
                  disabled={actionId === mentor.id}
                  className="rounded-full"
                >
                  {actionId === mentor.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(mentor.id)}
                  disabled={actionId === mentor.id}
                  className="rounded-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
