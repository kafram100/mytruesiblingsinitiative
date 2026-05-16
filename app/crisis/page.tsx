import type { Metadata } from "next";

import CrisisSupportPage from "@/components/crisis/CrisisSupportPage";

export const metadata: Metadata = {
  title: "Crisis Support | MyTrueSiblings",
  description:
    "Find urgent crisis support, emergency resources, suicide prevention helplines, mental health support, domestic violence resources, and local help worldwide.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Crisis Support · MyTrueSiblings",
    description:
      "Find urgent crisis support, emergency resources, suicide prevention helplines, and local help worldwide.",
    type: "website",
  },
};

export default function CrisisRoute() {
  return <CrisisSupportPage />;
}
