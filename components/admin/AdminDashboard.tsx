"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Wallet,
  Users,
  Settings2,
  Menu,
  BarChart3,
  HeartHandshake,
  School,
  ShieldCheck,
  Gem,
  Building2,
  Cpu,
  ShoppingBag,
  Calendar,
} from "lucide-react";

import DashboardOverview from "@/components/admin/sections/DashboardOverview";
import UsersSection from "@/components/admin/sections/UsersSection";
import ContactsSection from "@/components/admin/sections/ContactsSection";
import DonationsSection from "@/components/admin/sections/DonationsSection";
import OrdersSection from "@/components/admin/sections/OrdersSection";
import SubscribersSection from "@/components/admin/sections/SubscribersSection";
import ActivitySection from "@/components/admin/sections/ActivitySection";
import SettingsSection from "@/components/admin/sections/SettingsSection";
import StoreSection from "@/components/admin/sections/StoreSection";
import EventsSection from "@/components/admin/sections/EventsSection";
import RealStatsBar from "@/components/admin/RealStatsBar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { SidebarItem } from "@/components/admin/AdminSidebar";

type AdminSection =
  | "dashboard"
  | "users"
  | "contacts"
  | "donations"
  | "orders"
  | "subscribers"
  | "activity"
  | "settings"
  | "store"
  | "events";

const ADMIN_RESOURCE_SEGMENTS = [
  "users",
  "contacts",
  "donations",
  "orders",
  "subscribers",
  "activity",
  "settings",
  "store",
  "events",
] as const;

type AdminResourceSegment = (typeof ADMIN_RESOURCE_SEGMENTS)[number];

function segmentToSection(seg: string): AdminSection | null {
  if (ADMIN_RESOURCE_SEGMENTS.includes(seg as AdminResourceSegment)) {
    return seg as AdminSection;
  }
  return null;
}

interface AdminDashboardProps {
  user: { email: string };
  children?: React.ReactNode;
}

interface NavItem {
  label: string;
  section: AdminSection;
  icon: React.ComponentType<{ className?: string }>;
  scrollId?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", section: "dashboard", icon: LayoutDashboard, scrollId: "overview" },
      { label: "Siblings & Mentors", section: "dashboard", icon: Users, scrollId: "siblings" },
      { label: "Match A Sibling", section: "dashboard", icon: HeartHandshake, scrollId: "matching" },
    ],
  },
  {
    label: "Programs",
    items: [
      { label: "Programs & Outreach", section: "dashboard", icon: School, scrollId: "programs" },
      { label: "Lifecycle Support", section: "dashboard", icon: Activity, scrollId: "lifecycle" },
      { label: "Safeguarding", section: "dashboard", icon: ShieldCheck, scrollId: "safeguarding" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Membership Tiers", section: "dashboard", icon: Gem, scrollId: "membership" },
      { label: "Corporate Partners", section: "dashboard", icon: Building2, scrollId: "partners" },
      { label: "Save A Sibling", section: "donations", icon: Wallet },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Content & CMS", section: "dashboard", icon: BarChart3, scrollId: "content" },
      { label: "Integrations", section: "dashboard", icon: Cpu, scrollId: "integrations" },
      { label: "Store", section: "store", icon: ShoppingBag },
      { label: "Events", section: "events", icon: Calendar },
      { label: "Settings", section: "settings", icon: Settings2 },
    ],
  },
];

export default function AdminDashboard({ user, children }: AdminDashboardProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  /** Which dashboard anchor is selected (only one subsection should look "active"). */
  const [activeScrollId, setActiveScrollId] = useState<string | undefined>(
    "overview"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const adminSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );
  const isAdminNestedRoute = useMemo(() => {
    if (adminSegments.length < 2 || adminSegments[0] !== "admin") return false;
    return Boolean(segmentToSection(adminSegments[1]!));
  }, [adminSegments]);

  const routeSection = useMemo((): AdminSection | null => {
    if (!isAdminNestedRoute) return null;
    return segmentToSection(adminSegments[1]!);
  }, [adminSegments, isAdminNestedRoute]);

  const goToSection = useCallback(
    (section: AdminSection) => {
      if (section === "dashboard") {
        router.push("/admin");
        setActiveSection("dashboard");
        setActiveScrollId((prev) => prev ?? "overview");
        return;
      }
      if (ADMIN_RESOURCE_SEGMENTS.includes(section as AdminResourceSegment)) {
        router.push(`/admin/${section}`);
      }
      setActiveSection(section);
      setActiveScrollId(undefined);
    },
    [router]
  );

  const handleNavClick = useCallback(
    (item: NavItem) => {
      if (item.scrollId) {
        router.push("/admin");
        setActiveSection("dashboard");
        setActiveScrollId(item.scrollId);
        requestAnimationFrame(() => {
          const el = document.getElementById(item.scrollId!);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      } else {
        const seg = item.section;
        if (
          ADMIN_RESOURCE_SEGMENTS.includes(seg as AdminResourceSegment)
        ) {
          router.push(`/admin/${seg}`);
        }
        setActiveSection(item.section);
        setActiveScrollId(undefined);
      }
      setSidebarOpen(false);
    },
    [router]
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isSectionActive = (item: NavItem) => {
    if (routeSection) {
      if (item.scrollId) return false;
      return item.section === routeSection;
    }
    if (activeSection !== item.section) return false;
    if (item.scrollId) return activeScrollId === item.scrollId;
    return true;
  };

  const sidebarNavGroups = navGroups.map((group) => ({
    label: group.label,
    items: group.items.map((item) => {
      const navItem: SidebarItem = {
        label: item.label,
        icon: item.icon,
        isActive: isSectionActive(item),
        onClick: () => handleNavClick(item),
      };
      return navItem;
    }),
  }));

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <RealStatsBar />
            <DashboardOverview onNavigate={(s) => goToSection(s as AdminSection)} />
          </>
        );
      case "users":
        return <UsersSection />;
      case "contacts":
        return <ContactsSection />;
      case "donations":
        return <DonationsSection />;
      case "orders":
        return <OrdersSection />;
      case "subscribers":
        return <SubscribersSection />;
      case "activity":
        return <ActivitySection />;
      case "store":
        return <StoreSection />;
      case "events":
        return <EventsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return (
          <DashboardOverview onNavigate={(s) => goToSection(s as AdminSection)} />
        );
    }
  };

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-[#F4F1EA]">
      <AdminSidebar
        user={user}
        navGroups={sidebarNavGroups}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        appSubtitle="Admin Console"
      />

      <div className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[#E6E1D6] bg-[#FBF7EF]/90 px-6 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#0F1B2D] transition-colors hover:bg-black/5"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold tracking-tight text-[#1E5F5E]">
            MyTrueSiblings
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl py-6 md:py-8 lg:py-10">
            {isAdminNestedRoute ? children : renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
