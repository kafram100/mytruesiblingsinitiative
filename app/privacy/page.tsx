import type { Metadata } from "next";

import StubPage from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How My True Siblings Initiative handles your information.",
};

export default function PrivacyPage() {
  return (
    <StubPage
      eyebrow="Privacy"
      title="Privacy policy"
      description="We are preparing a clear, human readable privacy policy tailored to our global community. Until it is published here, contact us for privacy questions or data requests."
      accent="text-primary"
    />
  );
}
