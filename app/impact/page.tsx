import type { Metadata } from "next";

import ImpactPageContent from "@/components/impact/ImpactPageContent";

export const metadata: Metadata = {
  title: "Impact & Reports",
  description:
    "Transparent impact measurement for My True Siblings: metrics, budgets, SDG alignment, funding model, partnerships, and risk framework.",
};

export default function ImpactPage() {
  return <ImpactPageContent />;
}
