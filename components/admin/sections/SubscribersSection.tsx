"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";

import type { SubscriberRow } from "@/lib/auth";
import { formatDateTime } from "@/lib/admin-utils";

export default function SubscribersSection() {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((data) => setSubscribers(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gray-100 p-2 text-gray-600">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            Email subscribers who joined the belonging movement.
            {subscribers.length > 0 && <span className="ml-2 font-medium text-foreground">({subscribers.length} total)</span>}
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No subscribers yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Subscribed</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Updated</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <a href={`mailto:${s.email}`} className="underline underline-offset-2 hover:text-primary">{s.email}</a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(s.created_at)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(s.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
