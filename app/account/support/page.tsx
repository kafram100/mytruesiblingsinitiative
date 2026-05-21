"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LifeBuoy, Plus, MessageCircle, Clock, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportRequest } from "@/lib/support";

const STATUS_BADGES: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-amber-100 text-amber-700" },
  in_review: { label: "In Review", class: "bg-blue-100 text-blue-700" },
  resolved: { label: "Resolved", class: "bg-green-100 text-green-700" },
  closed: { label: "Closed", class: "bg-gray-100 text-gray-500" },
};

const TYPE_LABELS: Record<string, string> = {
  financial_assistance: "Financial Assistance",
  general_support: "General Support",
  other: "Other",
};

export default function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/support/requests")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setRequests(data?.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Get Help</h1>
          <p className="text-muted-foreground text-sm mt-1">Reach out for financial assistance or other support.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/account/support/new">
            <Plus className="h-4 w-4 mr-1" /> New Request
          </Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <LifeBuoy className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No Support Requests Yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            If you need financial assistance, emotional support, or have any other concerns, we are here for you.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/account/support/new">
              <Plus className="h-4 w-4 mr-1" /> Submit a Request
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const badge = STATUS_BADGES[req.status] || STATUS_BADGES.pending;
            return (
              <Link
                key={req.id}
                href={`/account/support/${req.id}`}
                className="block rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.class}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {TYPE_LABELS[req.type] || req.type}
                      </span>
                    </div>
                    <h3 className="font-semibold truncate">{req.subject}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {req.reply_count && req.reply_count > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {req.reply_count}
                      </span>
                    ) : null}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
