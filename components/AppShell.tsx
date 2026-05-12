"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WelcomeModal from "@/components/WelcomeModal";
import InstallPrompt from "@/components/InstallPrompt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <WelcomeModal />}
      {!isAdmin && <InstallPrompt />}
      {!isAdmin && <SiteHeader />}
      <main id="main-content">{children}</main>
      {!isAdmin && <SiteFooter />}
    </>
  );
}
