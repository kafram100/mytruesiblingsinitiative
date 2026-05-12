"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  FileText,
  Filter,
  Heart,
  ListChecks,
  Lock,
  MessageCircle,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  UserCog,
  UserRound,
  Users,
} from "lucide-react";

import { useConsistentReducedMotion } from "@/hooks/useConsistentReducedMotion";
import { Button } from "@/components/ui/button";

type SafeStep = {
  n: string;
  title: string;
  text: string;
  Icon: LucideIcon;
  iconBox: string;
};

const safeSteps: SafeStep[] = [
  {
    n: "01",
    title: "Onboarding Complete",
    text: "User finishes profile setup: age, identity, language, goals captured securely.",
    Icon: UserRound,
    iconBox: "bg-primary text-primary-foreground",
  },
  {
    n: "02",
    title: "Safety & Risk Screening",
    text: "Check age category, safety restrictions, and emotional risk level.",
    Icon: Shield,
    iconBox: "bg-brand-red text-primary-foreground",
  },
  {
    n: "03",
    title: "High-Risk Routing",
    text: "If high risk, route to crisis support, notify safeguarding team, no peer matching.",
    Icon: AlertTriangle,
    iconBox: "bg-brand-orange text-primary-foreground",
  },
  {
    n: "04",
    title: "Build Match Profiles",
    text: "Create need, support preference, accessibility, and availability profiles.",
    Icon: FileText,
    iconBox: "bg-brand-pink text-primary-foreground",
  },
  {
    n: "05",
    title: "Filter Eligible Pool",
    text: "Remove blocked, flagged, age incompatible, gender mismatches, unavailable, or privacy conflicts.",
    Icon: Filter,
    iconBox: "bg-deep-teal text-primary-foreground",
  },
  {
    n: "06",
    title: "Score Each Candidate",
    text: "Need — Language — Life Stage — Interest — Availability — Time Zone — Style — Trust.",
    Icon: ListChecks,
    iconBox: "bg-brand-yellow text-foreground",
  },
  {
    n: "07",
    title: "Weighted Ranking",
    text: "Total = weighted sum. Rank highest to lowest. Return top 3 people + top 3 groups.",
    Icon: BarChart3,
    iconBox: "bg-brand-orange text-primary-foreground",
  },
  {
    n: "08",
    title: "User Sends Request",
    text: "User selects a match and sends a connection request with intent.",
    Icon: Send,
    iconBox: "bg-brand-pink text-primary-foreground",
  },
  {
    n: "09",
    title: "If Accepted",
    text: "Open guided conversation, display safety rules, schedule first check-in.",
    Icon: MessageCircle,
    iconBox: "bg-primary text-primary-foreground",
  },
  {
    n: "10",
    title: "If Declined",
    text: "Recommend the next best match. No stigma, no friction.",
    Icon: RefreshCw,
    iconBox: "bg-brand-red text-primary-foreground",
  },
];

type ScoreDim = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

const scoreDims: ScoreDim[] = [
  { label: "Need Alignment", value: "20%", Icon: Heart },
  { label: "Language", value: "10%", Icon: MessageCircle },
  { label: "Life Stage", value: "15%", Icon: Sparkles },
  { label: "Interest Match", value: "10%", Icon: Users },
  { label: "Availability", value: "10%", Icon: UserCog },
  { label: "Location / Time Zone", value: "10%", Icon: Filter },
  { label: "Support Style", value: "15%", Icon: Heart },
  { label: "Trust Score", value: "10%", Icon: Lock },
];

const fadeUp = {
  initial: { opacity: 1, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
} as const;

export default function SafeMatchingSections() {
  const reduceMotion = useConsistentReducedMotion();
  const motionProps = reduceMotion ? { initial: false } : fadeUp;

  return (
    <>
      {/* Section 1: safe matching engine (muted band only on this block) */}
      <section
        id="matching"
        aria-labelledby="safe-matching-heading"
        className="scroll-mt-[5.75rem] bg-muted/25 py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <p className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span aria-hidden className="mr-1 text-primary/80">
                #
              </span>
              Safe Matching Engine
            </p>
            <h2
              id="safe-matching-heading"
              className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              How We Match Siblings — Safely
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              A trauma-informed, safety-first algorithm that prioritises wellbeing
              before compatibility. Every match passes through 10 protective
              layers.
            </p>
          </div>

          <ol className="mx-auto grid max-w-6xl list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-5">
            {safeSteps.map((step, i) => {
              const Icon = step.Icon;
              return (
                <motion.li
                  key={step.n}
                  {...motionProps}
                  transition={{ delay: reduceMotion ? 0 : i * 0.04 }}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${step.iconBox}`}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {step.n}
                  </p>
                  <h3 className="mb-2 font-display text-base font-bold leading-snug text-foreground md:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Section 2: Match Score Composition — discrete teal card on page bg (not bundled with muted band above) */}
      <section
        aria-labelledby="match-score-heading"
        className="bg-background pb-6 pt-6 md:pb-10 md:pt-10"
      >
        <div className="container mx-auto px-4">
          <motion.div
            {...motionProps}
            transition={{ delay: reduceMotion ? 0 : 0.15 }}
            className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-deep-teal px-5 py-10 text-white shadow-[0_24px_48px_-18px_rgba(0,0,0,0.35)] ring-1 ring-black/10 md:rounded-[2.25rem] md:px-10 md:py-12"
          >
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
              <h2
                id="match-score-heading"
                className="font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.65rem]"
              >
                Match Score Composition
              </h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-white/90 md:text-base">
                Eight weighted dimensions create one trust-weighted match score.
              </p>
            </div>

            <ul className="mx-auto grid list-none gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {scoreDims.map((d, i) => {
                const Icon = d.Icon;
                return (
                  <motion.li
                    key={d.label}
                    {...motionProps}
                    transition={{ delay: reduceMotion ? 0 : 0.05 + i * 0.035 }}
                    className="h-full min-h-0"
                  >
                    <div className="flex h-full min-h-[11rem] flex-col items-center justify-center rounded-2xl border border-deep-teal/10 bg-white/5 px-5 py-8 text-center shadow-[0_8px_28px_-10px_rgba(0,0,0,0.55)] backdrop-blur-lg md:min-h-[12rem] md:rounded-[1.25rem] md:py-9">
                      <Icon
                        className="mb-4 h-7 w-7 shrink-0 text-brand-yellow"
                        strokeWidth={1.35}
                        aria-hidden
                      />
                      <p className="mb-3 px-1 font-sans text-sm font-bold leading-snug text-white">
                        {d.label}
                      </p>
                      <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-brand-yellow md:text-[2rem]">
                        {d.value}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}
