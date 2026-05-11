import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Armchair,
  Brain,
  Captions,
  Ear,
  Eye,
  Globe,
  HeartHandshake,
  Keyboard,
  Languages,
  ScanText,
  UserPlus,
  UserRoundSearch,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inclusive Support Hub",
  description:
    "Belonging without barriers: accessibility first tools, disability specific communities, caregiver support, and verified resources.",
};

const communities = [
  {
    icon: Armchair,
    title: "Mobility & physical disability",
    detail:
      "Wheelchair users, chronic pain, EDS, MS, post injury, and beyond. Practical tips, advocacy, daily life.",
  },
  {
    icon: Ear,
    title: "Deaf & hard of hearing",
    detail:
      "Sign language circles (ASL, BSL, ISL), captioned video calls, and a Deaf led space within the platform.",
  },
  {
    icon: Eye,
    title: "Blind & low vision",
    detail:
      "Screen reader first interface, audio described content, and connection with siblings who navigate the world the same way.",
  },
  {
    icon: Brain,
    title: "Neurodiversity",
    detail:
      "Autism, ADHD, dyslexia, dyspraxia, Tourette's. Communication styles you don't have to mask, paced to your bandwidth.",
  },
  {
    icon: HeartHandshake,
    title: "Caregivers & family",
    detail:
      "Parents, partners, siblings of disabled loved ones: a circle for the grief, joy, and exhaustion no one else sees.",
  },
  {
    icon: Globe,
    title: "Chronic illness",
    detail:
      "Long Covid, ME/CFS, POTS, autoimmune conditions, cancer recovery. For when energy is currency.",
  },
];

const features = [
  {
    icon: ScanText,
    title: "Screen reader first",
    detail: "Every page tested with VoiceOver, NVDA, and JAWS before ship.",
  },
  {
    icon: Captions,
    title: "Captions on every video",
    detail: "Open captions by default. Transcripts available for download.",
  },
  {
    icon: Languages,
    title: "Sign language circles",
    detail: "ASL, BSL, ISL, Auslan rooms, Deaf led, scheduled weekly.",
  },
  {
    icon: Keyboard,
    title: "Keyboard only navigable",
    detail: "Skip links, focus rings, no mouse traps. Tab moves where you'd expect.",
  },
  {
    icon: Volume2,
    title: "Reduced motion respected",
    detail:
      "All animation honors your OS preference. Nothing flashes, nothing jolts.",
  },
  {
    icon: Accessibility,
    title: "Easy-read mode",
    detail:
      "Plain language version of every page, on demand. Bigger type, simpler sentences, no jargon.",
  },
];

export default function InclusiveSupportHubPage() {
  return (
    <article className="bg-background">
      <header className="relative isolate overflow-hidden bg-background">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/65 to-background/85" />
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl text-center relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5 backdrop-blur-sm">
            <Accessibility className="h-4 w-4" aria-hidden="true" />
            Inclusive Support Hub
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
            Belonging without barriers.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl rounded-2xl bg-background/82 px-4 py-3 text-lg leading-relaxed text-foreground shadow-sm backdrop-blur-sm md:text-xl">
            Accessibility first tools, disability specific communities, caregiver
            support, opportunity access, and verified resources, designed
            <em className="not-italic font-semibold"> with</em>, not for, our
            community.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7"
              asChild
            >
              <Link href="/match">
                <UserRoundSearch className="h-4 w-4" aria-hidden="true" />
                Find your community
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/85 px-7 text-foreground shadow-sm hover:bg-card"
              asChild
            >
              <Link href="/volunteer">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Become a sibling
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="communities-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Communities by need
            </p>
            <h2
              id="communities-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Find people who get it
            </h2>
            <p className="text-muted-foreground">
              Each space is moderated by someone with lived experience of that
              community. None of these are pity rooms: they&apos;re for the
              good days too.
            </p>
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((c) => (
              <li
                key={c.title}
                className="flex flex-col p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-display font-bold text-lg mb-2 leading-tight">
                  {c.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {c.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="py-16 md:py-24 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
              Accessibility first
            </p>
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Built for assistive tech, not retrofitted
            </h2>
            <p className="text-muted-foreground">
              We don&apos;t add an &ldquo;accessibility mode.&rdquo; The whole
              platform is the accessibility mode.
            </p>
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <li
                key={f.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/15 text-brand-orange">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-bold text-base mb-1 leading-tight">
                    {f.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="codesign-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-3xl border bg-card p-8 md:p-12 text-center">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Designed with, not for
            </p>
            <h2
              id="codesign-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight"
            >
              Our community shapes the product
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Every feature is designed together with disabled users, paid for their
              time, and credited by name (or pseudonym, on request). If you
              want a seat in our quarterly accessibility council, we&apos;d
              love to have you.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full px-7"
              asChild
            >
              <Link href="/contact">
                <Accessibility className="h-4 w-4" aria-hidden="true" />
                Join the accessibility council
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-brand-yellow/10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
            Belong without barriers.
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Find your community in under three minutes. Adjust accessibility
            preferences before, during, or after: your settings travel with
            you across the entire platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7"
              asChild
            >
              <Link href="/match">
                Find your community <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/85 text-foreground shadow-sm hover:bg-background"
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
