"use client";

import { motion } from "framer-motion";

import { useFadeAnimations } from "@/hooks/useFadeAnimations";

// TODO(metrics): replace these honest qualifiers with audited numbers once we
// have validated baselines (people connected, support sessions, countries
// reached, lives impacted). Until then, we don't ship fabricated stats.
const promises = [
  { value: "Free", label: "Always, for the people who use it" },
  { value: "Anonymous", label: "If you prefer" },
  { value: "Worldwide", label: "Active across continents" },
  { value: "Human", label: "Every conversation, every match" },
];

export default function PromisesSection() {
  const { fadeUp, reduce } = useFadeAnimations();

  return (
    <section
      id="promises"
      aria-labelledby="promises-heading"
      className="py-20 md:py-28 bg-gradient-to-br from-primary to-deep-teal text-primary-foreground scroll-mt-[5.75rem]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
            Our promises
          </p>
          <h2
            id="promises-heading"
            className="text-3xl md:text-5xl font-display font-bold"
          >
            Belonging, on these terms
          </h2>
          <p className="mt-4 text-primary-foreground/85 leading-relaxed">
            We will not sell your attention, your inbox, or your story. Metrics
            you see elsewhere are audited first: we promise honesty over hype.
          </p>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {promises.map((p, i) => (
            <motion.li
              key={p.label}
              {...fadeUp}
              transition={{ delay: reduce ? 0 : i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur border border-primary-foreground/10"
            >
              <p
                className={`mb-2 text-2xl font-display font-bold leading-tight text-brand-yellow md:text-[2rem] lg:text-3xl ${
                  p.value === "Anonymous" || p.value === "Worldwide"
                    ? "lg:whitespace-nowrap"
                    : "break-words"
                }`}
              >
                {p.value}
              </p>
              <p className="text-sm text-primary-foreground/80 leading-snug">
                {p.label}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
