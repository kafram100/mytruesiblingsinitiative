import type { Metadata } from "next";

import CrisisSupportPage from "@/components/crisis/CrisisSupportPage";
import {
  VERIFIED_CRISIS_RESOURCES,
  CRISIS_FAQ_ITEMS,
  COUNTRIES,
  US_STATES,
} from "@/lib/crisis";

export const metadata: Metadata = {
  title: "Crisis Support | My True Siblings Initiative",
  description:
    "Find urgent crisis support, emergency resources, suicide prevention helplines, mental health support, domestic violence resources, and local help worldwide.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Crisis Support · My True Siblings Initiative",
    description:
      "Find urgent crisis support, emergency resources, suicide prevention helplines, and local help worldwide.",
    type: "website",
  },
};

export default function CrisisRoute() {
  return (
    <CrisisSupportPage
      resources={VERIFIED_CRISIS_RESOURCES}
      countries={COUNTRIES}
      usStates={US_STATES}
      faqItems={CRISIS_FAQ_ITEMS}
    />
  );
}
