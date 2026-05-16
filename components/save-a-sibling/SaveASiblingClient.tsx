"use client";

import dynamic from "next/dynamic";

const SaveASiblingPage = dynamic(
  () => import("@/components/save-a-sibling/SaveASiblingPage"),
  { ssr: false }
);

export default function SaveASiblingClient() {
  return <SaveASiblingPage />;
}
