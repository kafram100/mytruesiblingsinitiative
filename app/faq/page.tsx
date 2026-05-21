import type { Metadata } from "next";

import FaqContent from "@/components/faq/FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about My True Siblings Initiative: our programs, shop, donations, membership, matching, safety, and global belonging movement.",
  openGraph: {
    title: "FAQ · My True Siblings Initiative",
    description: "Everything you need to know about the My True Siblings Initiative belonging movement.",
  },
};

export default function FaqPage() {
  return <FaqContent />;
}
