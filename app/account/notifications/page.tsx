"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/account/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/account/notifications/${id}`, { method: "PUT" });
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await fetch("/api/account/notifications", { method: "PUT" });
    fetchNotifications();
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "match": return "💚";
      case "message": return "💬";
      case "system": return "🔔";
      default: return "📌";
    }
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
        <h1 className="text-2xl font-display font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Stay updated on matches, messages, and community activity.
      </p>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">All clear</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            You have no notifications right now. We&apos;ll notify you about matches, messages, and updates.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const unread = !notif.read_at;
            return (
              <div
                key={notif.id}
                className={`relative rounded-2xl border p-4 transition-colors ${
                  unread
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{typeIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-sm ${unread ? "text-foreground" : "text-muted-foreground"}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notif.created_at)}
                        </span>
                        {unread && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="text-primary hover:text-primary/70"
                            aria-label="Mark as read"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {notif.message && (
                      <p className={`text-sm mt-1 ${unread ? "text-foreground/80" : "text-muted-foreground"}`}>
                        {notif.message}
                      </p>
                    )}
                    {notif.link && (
                      <Link
                        href={notif.link}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 hover:underline"
                      >
                        View details <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
                {unread && (
                  <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
