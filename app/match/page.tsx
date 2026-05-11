import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  EyeOff,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Find Your Match",
  description:
    "Join My Siblings and get matched to a circle, sibling, or one on one conversation. Free, anonymous if you prefer, and always human.",
};

const HERO_IMAGE =
  "https://images.pexels.com/photos/9287491/pexels-photo-9287491.jpeg?cs=srgb&dl=pexels-sadockkaisibalaam-9287491.jpg&fm=jpg";

const pillars = [
  {
    href: "/sibling-connect",
    title: "Sibling Connect",
    detail:
      "Steady community, mentorship, and everyday belonging for youth and general members.",
    accent: "text-brand-orange",
    bg: "bg-brand-orange/10",
  },
  {
    href: "/adult-safe-place",
    title: "Adult Safe Place",
    detail:
      "Confidential, anonymous friendly emotional support for adults 18+.",
    accent: "text-brand-pink",
    bg: "bg-brand-pink/10",
  },
  {
    href: "/inclusive-support-hub",
    title: "Inclusive Support Hub",
    detail:
      "Disability led communities, accessible by design, with caregiver support and verified resources.",
    accent: "text-primary",
    bg: "bg-primary/10",
  },
];

const expectations = [
  {
    icon: Clock,
    title: "About three minutes",
    detail:
      "A short questionnaire to get a sense of what you need and what kind of sibling fits. Pause anytime.",
  },
  {
    icon: EyeOff,
    title: "Anonymous if you want",
    detail:
      "Use a pseudonym, hide your photo, choose what you share. We never require a legal name.",
  },
  {
    icon: ShieldCheck,
    title: "Free, no card required",
    detail:
      "There is no paid tier of belonging. The whole platform is free for the people who use it.",
  },
  {
    icon: Users,
    title: "Human reviewed match",
    detail:
      "A trained sibling coach reviews every proposed match before it reaches you.",
  },
];

export default function MatchPage() {
  return (
    <article className="bg-background">
      <header className="bg-gradient-to-br from-primary/15 via-background to-brand-pink/10">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Find Your Match
            </p>
            <h1 className="mb-5 text-4xl font-display font-bold leading-tight md:text-6xl">
              Find your sibling.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
              Tell us a little about you. We&apos;ll pair you with a sibling who
              fits your values, language, and life stage, and you decide what
              happens next.
            </p>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-[0_24px_80px_rgba(17,24,39,0.12)] backdrop-blur">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={HERO_IMAGE}
                  alt="A group of African young adults sharing a joyful moment together."
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="pillars-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Step 1 of 3
            </p>
            <h2
              id="pillars-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Where would you like to start?
            </h2>
            <p className="text-muted-foreground">
              You can switch between pillars later. This just helps us start
              you in the right room.
            </p>
          </div>

          <ul className="grid md:grid-cols-3 gap-4">
            {pillars.map((p) => (
              <li key={p.title}>
                <Link
                  href={p.href}
                  className="flex h-full flex-col p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${p.bg} ${p.accent} mb-4`}
                  >
                    <Heart className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="font-display font-bold text-lg mb-2 leading-tight">
                    {p.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {p.detail}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Start here <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="expect-heading"
        className="py-16 md:py-24 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-brand-pink font-semibold text-sm uppercase tracking-widest mb-3">
              What to expect
            </p>
            <h2
              id="expect-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              No tricks. Just a small commitment.
            </h2>
          </div>

          <ul className="grid sm:grid-cols-2 gap-4">
            {expectations.map((e) => (
              <li
                key={e.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <e.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-bold text-lg mb-1 leading-tight">
                    {e.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {e.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-deep-teal text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
            Ready when you are.
          </h2>
          <p className="text-primary-foreground/90 leading-relaxed mb-8">
            The full sign-up + matching flow lives here. We&apos;re still
            shipping the form (real human review, accessibility first inputs,
            anonymous mode by default). For now, drop us a note and we&apos;ll
            walk you through it personally.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 rounded-full px-7"
              asChild
            >
              <Link href="/contact">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Talk to a human
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-primary-foreground/25 bg-primary-foreground/12 px-7 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
