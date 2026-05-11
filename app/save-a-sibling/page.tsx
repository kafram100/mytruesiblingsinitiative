import type { Metadata } from "next";

import SaveASiblingPage from "@/components/save-a-sibling/SaveASiblingPage";

export const metadata: Metadata = {
  title: "Save A Sibling",
  description:
    "Save A Sibling — restore hope and build belonging. Donate to strengthen safe spaces, sibling matching, disability inclusion, mentorship, adult emotional support, emergency help, and outreach worldwide.",
  openGraph: {
    title: "Save A Sibling · My True Siblings",
    description:
      "Your gift helps someone feel seen, heard, supported, and never alone.",
    type: "website",
  },
};

export default function SaveASiblingRoute() {
  return <SaveASiblingPage />;
}
