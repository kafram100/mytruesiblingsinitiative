import type { Metadata } from "next";
import { Activity, Clock, Filter } from "lucide-react";

import { getActivity } from "@/lib/activity-log";

export const metadata: Metadata = {
  title: "Audit Logs",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    login: "Logged in",
    logout: "Logged out",
    "settings.update": "Updated settings",
    "settings.test_email": "Sent test email",
    "export.contacts": "Exported contacts",
    "export.donations": "Exported donations",
  };
  return labels[action] || action;
}

function actionColor(action: string): string {
  if (action === "login") return "text-emerald-600 bg-emerald-100";
  if (action === "logout") return "text-red-600 bg-red-100";
  if (action.startsWith("settings")) return "text-blue-600 bg-blue-100";
  if (action.startsWith("export")) return "text-purple-600 bg-purple-100";
  return "text-gray-600 bg-gray-100";
}

export default async function AdminActivityPage() {
  const activities = await getActivity(200);

  const activityCount = activities.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Audit Logs
            </h1>
            <p className="text-sm text-muted-foreground">
              Track all admin actions on the platform.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{activityCount} recent entries</span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No activity recorded yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Action
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Details
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Admin
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${actionColor(a.action)}`}
                      >
                        {actionLabel(a.action)}
                      </span>
                    </td>
                    <td className="max-w-[300px] truncate px-4 py-3 text-muted-foreground">
                      {a.details || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.admin_email}
                    </td>
                    <td
                      className="whitespace-nowrap px-4 py-3 text-muted-foreground"
                      title={fullDate(a.created_at)}
                    >
                      {formatDate(a.created_at)}
                    </td>
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
