"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, User, Check, X, Calendar, ExternalLink, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function MentorMenteesPage() {
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<MenteeRequest[]>([]);
  const [activeMentees, setActiveMentees] = useState<MenteeRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch("/api/mentors/dashboard");
      if (res.ok) {
        const data = await res.json();
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

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Mentees</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your mentorship relationships.</p>
      </div>

      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-bold mb-3">Pending Requests ({pendingRequests.length})</h2>
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/5 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted shrink-0">
                    {req.avatar_url ? (
                      <img src={req.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{req.display_name || req.full_name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {req.pronouns && <span>{req.pronouns}</span>}
                      {req.location_city && <><span>&middot;</span><span>{req.location_city}</span></>}
                    </div>
                  </div>
                </div>
                {req.request_message && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Message</p>
                    <p className="text-sm text-muted-foreground bg-card rounded-xl p-3 border border-border">
                      &ldquo;{req.request_message}&rdquo;
                    </p>
                  </div>
                )}
                {req.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{req.bio}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDate(req.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleResponse(req.id, "accept")} disabled={processing === req.id} className="rounded-full">
                      {processing === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                      Accept
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleResponse(req.id, "decline")} disabled={processing === req.id} className="rounded-full text-red-600 hover:bg-red-50">
                      <X className="h-3 w-3" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-display font-bold mb-3">Active Mentees ({activeMentees.length})</h2>
        {activeMentees.length > 0 ? (
          <div className="space-y-3">
            {activeMentees.map((mentee) => (
              <div key={mentee.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted shrink-0">
                    {mentee.avatar_url ? (
                      <img src={mentee.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{mentee.display_name || mentee.full_name}</p>
                    <p className="text-xs text-muted-foreground">{mentee.location_city || mentee.pronouns || "Mentee"}</p>
                  </div>
                  <Link href="/account/messages" className="text-xs font-medium text-primary hover:underline shrink-0">
                    Message <ExternalLink className="h-3 w-3 inline" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No active mentees yet. Respond to pending requests above.</p>
          </div>
        )}
      </section>

      {pendingRequests.length === 0 && activeMentees.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No mentees yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Siblings will find you when they need guidance. Make sure your mentor profile is complete to attract mentees.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/account/mentor/profile">
              Complete Your Profile
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
