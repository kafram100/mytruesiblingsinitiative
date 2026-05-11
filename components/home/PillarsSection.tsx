"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Accessibility, ArrowRight, Heart, Users } from "lucide-react";

import { useFadeAnimations } from "@/hooks/useFadeAnimations";

// Tailwind cannot resolve template-literal class names at build time.
// Each pillar carries the FULL static class strings so the JIT picks them up.
const pillars = [
  {
    icon: Users,
    title: "Sibling Community",
    desc: "Connection, mentorship, and belonging for youth and general members.",
    iconBg: "bg-brand-yellow/15",
    iconText: "text-brand-yellow",
    href: "/sibling-connect",
  },
  {
    icon: Heart,
    title: "Adult Safe Place",
    desc: "Confidential, judgment free emotional support for adults 18+.",
    iconBg: "bg-brand-pink/15",
    iconText: "text-brand-pink",
    href: "/adult-safe-place",
  },
  {
    icon: Accessibility,
    title: "Inclusive Support Hub",
    desc: "Belonging without barriers for people living with disabilities.",
    iconBg: "bg-primary/15",
    iconText: "text-primary",
    href: "/inclusive-support-hub",
  },
];

export default function PillarsSection() {
  const { fadeUp, reduce } = useFadeAnimations();

  return (
    <section
      id="pillars"
      aria-labelledby="pillars-heading"
      className="py-20 md:py-28 bg-background scroll-mt-[5.75rem]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
            Three Pillars · One Family
          </p>
          <h2
            id="pillars-heading"
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            A Lifetime Platform for Every Stage
          </h2>
          <p className="text-muted-foreground">
            From childhood to adulthood, from ability to vulnerability, there
            is a place for you here.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.li
                key={p.title}
                {...fadeUp}
                transition={{ delay: reduce ? 0 : i * 0.1 }}
                className="group"
              >
                {/* The whole card is the link target. Keyboard users get the
                    same hit area as mouse users, with a focus-visible ring. */}
                <Link
                  href={p.href}
                  className="relative flex h-full flex-col p-8 rounded-3xl bg-card border-2 border-border transition-all hover:border-primary/40 hover:shadow-teal hover:-translate-y-1 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center mb-5`}
                  >
                    <Icon
                      className={`h-7 w-7 ${p.iconText}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {p.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all mt-auto">
                    Explore
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
