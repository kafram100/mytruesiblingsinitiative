"use client";

import { useEffect } from "react";

/**
 * Tracks a single anonymous page-view per browser tab (marketing analytics).
 * Storage/network failures never throw — avoids console noise during navigation.
 */
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
        return;
      }
      const key = "visit_tracked";
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }

    const path =
      typeof window !== "undefined" ? window.location.pathname : "/";

    let id = "";
    try {
      id = crypto.randomUUID();
    } catch {
      id = Math.random().toString(36).slice(2);
    }

    void fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, visitorId: id }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
