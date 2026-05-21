import type { Metadata } from "next";
import EventsSection from "@/components/admin/sections/EventsSection";

export const metadata: Metadata = { title: "Events" };

export default function AdminEventsPage() {
  return <EventsSection />;
}
