"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFadeAnimations } from "@/hooks/useFadeAnimations";

const steps = [
  {
    n: "01",
    title: "Join Safely",
    desc: "Create a free account in minutes, anonymously if you prefer.",
  },
  {
    n: "02",
    title: "Connect With People",
    desc: "Get matched to a circle, sibling, or one on one conversation.",
  },
  {
    n: "03",
    title: "Grow & Heal Together",
    desc: "Build belonging, share stories, and rise, one moment at a time.",
  },
];

export default function HowItWorksSection() {
  const { fadeUp, reduce } = useFadeAnimations();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-20 md:py-28 bg-muted/40 scroll-mt-[5.75rem]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-5xl font-display font-bold"
          >
            Three simple steps to belonging
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Free to join. Anonymous when you want to be. A human reviewed match
            when you are ready.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              {...fadeUp}
              transition={{ delay: reduce ? 0 : i * 0.1 }}
              className="relative p-8 rounded-3xl bg-card border text-center"
            >
              <div
                aria-hidden="true"
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-brand-pink text-primary-foreground font-display text-2xl font-bold flex items-center justify-center mx-auto mb-5"
              >
                {s.n}
              </div>
              <h3 className="font-display font-bold text-xl mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.desc}
              </p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/match">
              Start your journey
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="rounded-full px-6" asChild>
            <Link href="/contact">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Talk to our team
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
