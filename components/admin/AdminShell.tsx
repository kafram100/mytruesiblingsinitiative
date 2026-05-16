"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  LayoutDashboard,
  Wallet,
  Users,
  Settings2,
  LogOut,
  Menu,
  X,
  HandHeart,
  ShieldCheck,
  Building2,
  BarChart3,
  FileSearch,
  GitMerge,
  ShoppingBag,
  Mail,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  user: { email: string };
}

interface NavGroup {
  label: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Contacts", href: "/admin/contacts", icon: Mail },
      { label: "Match a sibling", href: "/admin#matching", icon: GitMerge },
    ],
  },
  {
    label: "Programs",
    items: [
      { label: "Programs & Outreach", href: "/admin#programs", icon: HandHeart },
      { label: "Lifecycle Support", href: "/admin#lifecycle", icon: BarChart3 },
      { label: "Safeguarding", href: "/admin#safeguarding", icon: ShieldCheck },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Donations", href: "/admin/donations", icon: Wallet },
      { label: "Store Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Content & CMS", href: "/admin#content", icon: FileSearch },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
      { label: "Settings", href: "/admin/settings", icon: Settings2 },
    ],
  },
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

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/admin") return pathname === "/admin";
    return pathname.startsWith(base);
  };

  return (
    <div className="flex min-h-screen bg-[#FBF7EF]">
      {sidebarOpen && (
        <Button
          type="button"
          variant="secondary"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 h-full min-h-12 w-full rounded-none border-0 bg-black/50 lg:hidden hover:bg-black/50 hover:shadow-none motion-safe:hover:translate-y-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[#0e3a3a] to-[#1E5F5E] text-white transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-yellow to-brand-orange text-sm font-extrabold text-[#1b1b1b]">
            M
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">MyTrueSiblings</p>
            <p className="text-[10px] leading-tight text-white/60">Admin Console v2.0</p>
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white shadow-none hover:bg-white/15 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Tooltip key={item.href + item.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-white/12 text-white"
                            : "text-white/65 hover:bg-white/8 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 truncate text-xs text-white/50">
            {user.email}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="tertiary"
                onClick={handleLogout}
                className="flex w-full items-center justify-start gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2 text-sm font-medium text-white/65 shadow-none hover:bg-white/10 hover:text-white motion-safe:hover:translate-y-0"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Logout
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out of admin panel</TooltipContent>
          </Tooltip>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#E6E1D6] bg-[#FBF7EF] px-4 lg:hidden">
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-[#0F1B2D] hover:bg-black/8"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold tracking-tight text-[#1E5F5E]">
            MyTrueSiblings
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
