"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2, ArrowRight } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/account/notifications?limit=5");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleMarkAllRead = async () => {
    setLoading(true);
    await fetch("/api/account/notifications", { method: "PUT" });
    await fetchData();
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/account/notifications/${id}`, { method: "PUT" });
    await fetchData();
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

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-muted hover:text-brand-teal"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[360px] rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const unread = !notif.read_at;
                return (
                  <div
                    key={notif.id}
                    className={`relative border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/30 ${
                      unread ? "bg-primary/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {notif.title}
                        </p>
                        {notif.message && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground/60">
                            {formatTime(notif.created_at)}
                          </span>
                          {notif.link && (
                            <Link
                              href={notif.link}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:underline"
                            >
                              View <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                      {unread && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="shrink-0 text-muted-foreground hover:text-primary"
                          aria-label="Mark as read"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    {unread && (
                      <div className="absolute right-4 top-3 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted/30 rounded-b-2xl"
            >
              View all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
