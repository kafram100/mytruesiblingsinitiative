"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Heart, MessageCircle, Bell, History, Settings, LogOut, Menu, X, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiblingUser } from "@/lib/sibling-auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: "message" | "notification";
}

const baseNavItems: NavItem[] = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "My Profile", href: "/account/profile", icon: User },
  { label: "My Matches", href: "/account/matches", icon: Heart },
  { label: "Messages", href: "/account/messages", icon: MessageCircle, badge: "message" },
  { label: "Notifications", href: "/account/notifications", icon: Bell, badge: "notification" },
  { label: "Activity", href: "/account/activity", icon: History },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

const mentorNavItems: NavItem[] = [
  { label: "Mentor Dashboard", href: "/account/mentor", icon: GraduationCap },
  { label: "My Mentees", href: "/account/mentor/mentees", icon: Heart },
];

function roleBadge(role: string) {
  if (role === "sibling_coach") {
    return <span className="inline-flex items-center rounded-full bg-brand-yellow/15 px-2 py-0.5 text-[10px] font-semibold text-brand-yellow">Coach</span>;
  }
  if (role === "admin") {
    return <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Admin</span>;
  }
  return null;
}

export default function AccountShell({
  user,
  children,
}: {
  user: SiblingUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [msgRes, notifRes] = await Promise.all([
          fetch("/api/account/conversations"),
          fetch("/api/account/notifications"),
        ]);
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setUnreadMessages(msgData.unreadCount || 0);
        }
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setUnreadNotifications(notifData.unreadCount || 0);
        }
      } catch {}
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/sibling/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/account" || href === "/account/mentor") return pathname === "/account" || pathname === "/account/mentor";
    if (href === "/account/messages") return pathname.startsWith("/account/messages");
    return pathname.startsWith(href);
  };

  const displayName = (user.display_name || user.full_name).trim();

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-muted active:bg-muted touch-manipulation"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">My Account</span>
          <div className="w-9" />
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <Link href="/account" className="font-display font-bold text-lg text-primary" onClick={() => setSidebarOpen(false)}>
                My Account
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted active:bg-muted lg:hidden touch-manipulation"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {user.role === "sibling_coach" && (
                <div className="mb-2">
                  <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mentor</p>
                  {mentorNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
              {baseNavItems.filter((item) => !(user.role === "sibling_coach" && item.href === "/account/matches")).map((item) => {
                const Icon = item.icon;
                const href = (user.role === "sibling_coach" && item.href === "/account") ? "/account/mentor" : item.href;
                const active = isActive(item.href);
                const showBadge = item.badge === "message" ? unreadMessages > 0 : item.badge === "notification" ? unreadNotifications > 0 : false;
                const badgeCount = item.badge === "message" ? unreadMessages : item.badge === "notification" ? unreadNotifications : 0;
                return (
                  <Link
                    key={item.href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {showBadge && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                        {badgeCount > 9 ? "9+" : badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border px-3 py-3 space-y-2">
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate flex items-center gap-2">
                  {displayName}
                  {roleBadge(user.role)}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-dvh">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
