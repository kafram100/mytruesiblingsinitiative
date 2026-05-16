"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WelcomeModal from "@/components/WelcomeModal";
import InstallPrompt from "@/components/InstallPrompt";
import CartDrawer from "@/components/store/CartDrawer";
import FloatingSafetyButton from "@/components/crisis/FloatingSafetyButton";
import SafetyReminderPopup from "@/components/crisis/SafetyReminderPopup";
import { CartProvider } from "@/context/cart";
import { WishlistProvider } from "@/context/wishlist";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isCrisis = pathname === "/crisis";
  const isStore = pathname.startsWith("/store");

  return (
    <CartProvider>
      <WishlistProvider>
        {!isAdmin && !isCrisis && <WelcomeModal />}
        {!isAdmin && <InstallPrompt />}
        {!isAdmin && <SiteHeader />}
        <main id="main-content">{children}</main>
        {!isAdmin && isStore && <CartDrawer />}
        {!isAdmin && <FloatingSafetyButton />}
        {!isAdmin && !isCrisis && <SafetyReminderPopup />}
        {!isAdmin && <SiteFooter />}
      </WishlistProvider>
    </CartProvider>
  );
}
