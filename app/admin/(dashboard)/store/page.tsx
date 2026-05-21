import type { Metadata } from "next";
import StoreSection from "@/components/admin/sections/StoreSection";

export const metadata: Metadata = { title: "Store" };

export default function AdminStorePage() {
  return <StoreSection />;
}
