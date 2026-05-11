"use client";

import { useConsistentReducedMotion } from "@/hooks/useConsistentReducedMotion";

/**
 * Shared on-scroll motion variants used across the landing page sections.
 *
 * Content should never depend on Framer Motion hydration or IntersectionObserver
 * callbacks to become visible. Every variant therefore renders in its final
 * visible state on first paint and only uses `whileInView` opportunistically.
 *
 * When the user has `prefers-reduced-motion: reduce` set at the OS level,
 * every variant still collapses to `{ initial: false }`, which tells
 * framer-motion to skip motion entirely. This is critical for the Inclusive
 * Support Hub audience (vestibular conditions, autism, ADHD, post-concussion)
 * and is required by WCAG 2.3.3.
 *
 * Returned values are stable per-render and safe to spread onto <motion.*>:
 *   const { fadeUp, reduce } = useFadeAnimations();
 *   <motion.div {...fadeUp} transition={{ delay: reduce ? 0 : i * 0.1 }} />
 */
export function useFadeAnimations() {
  const reduce = useConsistentReducedMotion();

  const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

  return {
    reduce,
    fadeUp: reduce
      ? ({ initial: false } as const)
      : ({
          initial: false,
          whileInView: { opacity: 1, y: 0 },
          viewport,
        } as const),
    slideLeft: reduce
      ? ({ initial: false } as const)
      : ({
          initial: false,
          whileInView: { opacity: 1, x: 0 },
          viewport,
        } as const),
    slideRight: reduce
      ? ({ initial: false } as const)
      : ({
          initial: false,
          whileInView: { opacity: 1, x: 0 },
          viewport,
        } as const),
    scaleIn: reduce
      ? ({ initial: false } as const)
      : ({
          initial: false,
          whileInView: { opacity: 1, scale: 1 },
          viewport,
        } as const),
  };
}
