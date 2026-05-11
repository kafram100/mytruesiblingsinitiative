import type { Metadata } from "next";

import StubPage from "@/components/StubPage";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about My True Siblings Initiative.",
};

export default function FaqPage() {
  return (
    <StubPage
      eyebrow="Help"
      title="Frequently asked questions"
      description="We are building a full FAQ. Many questions are quickest to answer through our contact channels. Choose the topic that fits and we will reply as soon as we can."
      accent="text-brand-yellow"
    />
  );
}
