"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WelcomeModal from "@/components/WelcomeModal";
import InstallPrompt from "@/components/InstallPrompt";
import CartDrawer from "@/components/store/CartDrawer";
import FloatingSafetyButton from "@/components/crisis/FloatingSafetyButton";
import SafetyReminderPopup from "@/components/crisis/SafetyReminderPopup";
import OnboardingWizard from "@/components/OnboardingWizard";
import GuidedTour from "@/components/GuidedTour";
import VisitTracker from "@/components/VisitTracker";
import { CartProvider } from "@/context/cart";
import { WishlistProvider } from "@/context/wishlist";
import { SiblingAuthProvider } from "@/context/sibling-auth";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isCrisis = pathname === "/crisis";
  const isStore = pathname.startsWith("/store");

  return (
    <CartProvider>
      <WishlistProvider>
        <SiblingAuthProvider>
          {!isAdmin && !isCrisis && <WelcomeModal />}
          {!isAdmin && <InstallPrompt />}
          {!isAdmin && <SiteHeader />}
          <VisitTracker />
          <main id="main-content">{children}</main>
          {!isAdmin && isStore && <CartDrawer />}
          <FloatingSafetyButton />
          {!isAdmin && !isCrisis && <SafetyReminderPopup />}
          {!isAdmin && <GuidedTour />}
          {!isAdmin && <OnboardingWizard />}
          {!isAdmin && <SiteFooter />}
        </SiblingAuthProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
