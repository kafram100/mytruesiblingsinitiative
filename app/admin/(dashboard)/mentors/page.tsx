import type { Metadata } from "next";
import ApproveMentorsSection from "@/components/admin/sections/ApproveMentorsSection";

export const metadata: Metadata = { title: "Approve Mentors" };

export default function AdminMentorsPage() {
  return <ApproveMentorsSection />;
}
