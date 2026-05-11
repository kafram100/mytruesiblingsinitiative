"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Framer Motion's `useReducedMotion()` can disagree between SSR and the first
 * client render (server ref stays `null`; client reads `matchMedia` immediately).
 * Branching motion props on that value causes hydration mismatches and noisy dev
 * overlays. Until after mount, match SSR by treating reduced motion as off; then
 * honor the real preference.
 */
export function useConsistentReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const prefers = useReducedMotion();
  if (!mounted) return false;
  return prefers === true;
}
