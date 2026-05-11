import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support My True Siblings — donation and sponsorship options on Save A Sibling.",
};

export default function DonatePage() {
  redirect("/save-a-sibling");
}
