"use client";

import { useState, useEffect } from "react";
import { History, Loader2 } from "lucide-react";

interface ActivityEntry {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  match_processed: "Match request processed",
  match_accepted: "Match accepted",
  match_declined: "Match declined",
  match_request_cancelled: "Match request cancelled",
  onboarding_completed: "Onboarding completed",
  profile_updated: "Profile updated",
  message_sent: "Message sent",
};

function actionLabel(action: string): string {
  return ACTION_LABELS[action] || action.replace(/_/g, " ");
}

const ACTION_ICONS: Record<string, string> = {
  match_processed: "💚",
  match_accepted: "✅",
  match_declined: "❌",
  match_request_cancelled: "🚫",
  onboarding_completed: "🎉",
  profile_updated: "👤",
  message_sent: "💬",
};

function actionIcon(action: string): string {
  return ACTION_ICONS[action] || "📌";
}

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/activity")
      .then((r) => r.json())
      .then((data) => {
        setActivity(data.activity || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
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
      <h1 className="text-2xl font-display font-bold mb-1">Activity History</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Your recent activity on the platform.
      </p>

      {activity.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <History className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No activity yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Your recent actions will appear here.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {activity.map((entry) => (
              <div key={entry.id} className="relative flex gap-4 pl-2">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm">
                  {actionIcon(entry.action)}
                </div>
                <div className="flex-1 min-w-0 py-1.5">
                  <p className="text-sm font-semibold capitalize">
                    {actionLabel(entry.action)}
                  </p>
                  {entry.details && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.details}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {formatTime(entry.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
