import StoreHero from "@/components/store/StoreHero";
import ImpactBanner from "@/components/store/ImpactBanner";
import CategoryGrid from "@/components/store/CategoryGrid";
import FeaturedCollections from "@/components/store/FeaturedCollections";
import BestSellers from "@/components/store/BestSellers";
import EmotionalStory from "@/components/store/EmotionalStory";
import CommunityTestimonials from "@/components/store/CommunityTestimonials";
import ImpactCounter from "@/components/store/ImpactCounter";
import DonateSection from "@/components/store/DonateSection";
import NewsletterSection from "@/components/store/NewsletterSection";
import FloatingNotifications from "@/components/store/FloatingNotifications";
export default function StorePage() {
  return (
    <>
      <StoreHero />
      <ImpactBanner />
      <CategoryGrid />
      <FeaturedCollections />
      <BestSellers />
      <EmotionalStory />
      <CommunityTestimonials />
      <ImpactCounter />
      <DonateSection />
      <NewsletterSection />
      <FloatingNotifications />
    </>
  );
}
