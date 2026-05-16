"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function FloatingSafetyButton() {
  const pathname = usePathname();
  const isCrisis = pathname === "/crisis";
  const isAdmin = pathname.startsWith("/admin");

  if (isCrisis || isAdmin) return null;

  return (
    <Link
      href="/crisis"
      aria-label="Open Crisis Support - immediate help available"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-brand-red-hex px-4 py-3 text-sm font-bold text-white shadow-xl shadow-brand-red-hex/30 transition-all hover:bg-brand-red-hex/90 hover:shadow-2xl hover:shadow-brand-red-hex/40 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red-hex md:px-5 md:py-3.5"
    >
      <Shield className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
      <span className="hidden md:inline">Need Help?</span>
      <span className="md:hidden">Help</span>
    </Link>
  );
}
