import type { Metadata } from "next";

import FaqContent from "@/components/faq/FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about MyTrueSiblings — our programs, shop, donations, membership, matching, safety, and global belonging movement.",
  openGraph: {
    title: "FAQ · MyTrueSiblings",
    description: "Everything you need to know about the MyTrueSiblings belonging movement.",
  },
};

export default function FaqPage() {
  return <FaqContent />;
}
