"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Users, Clock, CheckCircle, UserPlus, Settings, Loader2, User, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MentorProfile {
  expertiseAreas: string[];
  experienceYears: number;
  mentorshipBio: string | null;
  certification: string | null;
  maxMentees: number;
  currentMentees: number;
  isAvailable: boolean;
  approved?: boolean;
}

interface MenteeRequest {
  id: string;
  request_message: string | null;
  created_at: string;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  pronouns: string | null;
  location_city: string | null;
}

export default function MentorDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MenteeRequest[]>([]);
  const [activeMentees, setActiveMentees] = useState<MenteeRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch("/api/mentors/dashboard");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.mentorProfile);
        setPendingRequests(data.pendingRequests || []);
        setActiveMentees(data.activeMentees || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleResponse = async (id: string, action: "accept" | "decline") => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/mentors/request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) loadData();
    } catch {}
    setProcessing(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isApproved = profile?.approved ?? true;

  if (!loading && profile && !isApproved) {
    return (
      <div className="max-w-lg mx-auto py-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-amber-800 mb-2">Pending Admin Approval</h2>
          <p className="text-sm text-amber-700">
            Your mentor account is pending review. An administrator will review your application shortly.
            You will be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Mentor Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your mentorship journey.</p>
      </div>

      {profile && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{activeMentees.length}</p>
            <p className="text-sm text-muted-foreground">Active Mentees</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{pendingRequests.length}</p>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 mb-3">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{profile.currentMentees}/{profile.maxMentees}</p>
            <p className="text-sm text-muted-foreground">Capacity</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-3">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{profile.experienceYears}y</p>
            <p className="text-sm text-muted-foreground">Experience</p>
          </div>
        </div>
      )}

      {profile && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold">Mentor Profile</h2>
            <Button size="sm" variant="outline" asChild className="rounded-full">
              <Link href="/account/mentor/profile">
                <Settings className="h-3.5 w-3.5 mr-1" /> Edit
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.expertiseAreas.map((area) => (
              <span key={area} className="inline-block rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1">{area}</span>
            ))}
          </div>
          {profile.mentorshipBio && <p className="text-sm text-muted-foreground">{profile.mentorshipBio}</p>}
          {profile.certification && <p className="text-xs text-muted-foreground mt-2">Certification: {profile.certification}</p>}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${profile.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {profile.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-bold mb-3">Mentee Requests ({pendingRequests.length})</h2>
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted shrink-0">
                    {req.avatar_url ? (
                      <img src={req.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{req.display_name || req.full_name}</p>
                    {req.pronouns && <p className="text-xs text-muted-foreground">{req.pronouns}</p>}
                  </div>
                </div>
                {req.request_message && (
                  <p className="text-sm text-muted-foreground mb-3 bg-card rounded-xl p-3 border border-border">
                    &ldquo;{req.request_message}&rdquo;
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDate(req.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleResponse(req.id, "accept")} disabled={processing === req.id} className="rounded-full">
                      {processing === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" />}
                      Accept
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleResponse(req.id, "decline")} disabled={processing === req.id} className="rounded-full text-red-600 hover:bg-red-50">
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeMentees.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-bold mb-3">Active Mentees ({activeMentees.length})</h2>
          <div className="space-y-3">
            {activeMentees.map((mentee) => (
              <div key={mentee.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted shrink-0">
                    {mentee.avatar_url ? (
                      <img src={mentee.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{mentee.display_name || mentee.full_name}</p>
                    <p className="text-xs text-muted-foreground">{mentee.location_city || mentee.pronouns || ""}</p>
                  </div>
                  <Link href={`/account/messages`} className="text-xs font-medium text-primary hover:underline shrink-0">
                    Message <ExternalLink className="h-3 w-3 inline" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pendingRequests.length === 0 && activeMentees.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">Welcome to the Mentor Program</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Your profile is live. Siblings looking for guidance will find you here. You'll get notified when someone requests your mentorship.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/account/mentor/profile">
              <Settings className="h-4 w-4 mr-1" /> Customize Your Profile
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
