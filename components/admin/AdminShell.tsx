"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  LayoutDashboard,
  MessageSquare,
  Wallet,
  Users,
  Settings2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  user: { email: string };
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { label: "Donations", href: "/admin/donations", icon: Wallet },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Activity", href: "/admin/activity", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link
            href="/admin"
            className="text-lg font-bold tracking-tight text-primary"
          >
            Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-1 hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label === "Dashboard" && "Overview of your platform activity"}
                  {item.label === "Contacts" && "Contact form submissions"}
                  {item.label === "Donations" && "Donation transactions"}
                  {item.label === "Users" && "Registered user profiles"}
                  {item.label === "Activity" && "Admin action audit logs"}
                  {item.label === "Settings" && "Configure email and payment settings"}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">
            {user.email}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                Logout
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out of admin panel</TooltipContent>
          </Tooltip>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-full p-1 hover:bg-muted"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold tracking-tight text-primary">
            Admin
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
