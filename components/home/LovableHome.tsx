"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accessibility,
  Armchair,
  ArrowRight,
  Brain,
  DoorOpen,
  Ear,
  Eye,
  EyeOff,
  Globe,
  Heart,
  HeartHandshake,
  MessageCircle,
  PhoneCall,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";

import SafeMatchingSections from "./SafeMatchingSections";
import HeroVideo from "@/components/HeroVideo";
import { Button } from "@/components/ui/button";

const PHOTO_ADULT =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80";
const PHOTO_INCLUSIVE =
  "https://images.unsplash.com/photo-1626278664285-f796b9ee7806?auto=format&fit=crop&w=1200&q=80";

type PillarColor = "brand-yellow" | "brand-pink" | "primary";

const pillarVisual: Record<
  PillarColor,
  { iconBg: string; iconText: string }
> = {
  "brand-yellow": {
    iconBg: "bg-brand-yellow/15",
    iconText: "text-brand-yellow",
  },
  "brand-pink": {
    iconBg: "bg-brand-pink/15",
    iconText: "text-brand-pink",
  },
  primary: {
    iconBg: "bg-primary/15",
    iconText: "text-primary",
  },
};

const pillars = [
  {
    icon: Users,
    title: "Sibling Community",
    desc: "Connection, mentorship, and belonging for youth and general members.",
    color: "brand-yellow" as const,
    href: "/sibling-connect",
  },
  {
    icon: Heart,
    title: "Adult Safe Place",
    desc: "Confidential, judgment free emotional support for adults 18+.",
    color: "brand-pink" as const,
    href: "/adult-safe-place",
  },
  {
    icon: Accessibility,
    title: "Inclusive Support Hub",
    desc: "Belonging without barriers for people living with disabilities.",
    color: "primary" as const,
    href: "/inclusive-support-hub",
  },
];

const adultFeatures = [
  { icon: Users, label: "Emotional Support Circles" },
  { icon: MessageCircle, label: "Private one to one conversations" },
  { icon: EyeOff, label: "Anonymous Mode" },
  { icon: HeartHandshake, label: "Relationship & Life Support" },
  { icon: ShieldAlert, label: "Crisis Support Button" },
];

const inclusiveFeatures = [
  { icon: Armchair, label: "Mobility & Physical" },
  { icon: Ear, label: "Hearing Support" },
  { icon: Eye, label: "Vision Support" },
  { icon: Brain, label: "Neurodiversity" },
  { icon: HeartHandshake, label: "Caregiver Network" },
  { icon: Globe, label: "Global Resources" },
];

const steps = [
  {
    n: "01",
    title: "Join Safely",
    desc: "Create a free account in minutes (anonymously if you prefer).",
  },
  {
    n: "02",
    title: "Connect With People",
    desc: "Get matched to a circle, sibling, or one to one conversation.",
  },
  {
    n: "03",
    title: "Grow & Heal Together",
    desc: "Build belonging, share stories, and rise, one moment at a time.",
  },
];

const metrics = [
  { value: "12,400+", label: "People Connected" },
  { value: "38,900+", label: "Support Sessions" },
  { value: "27", label: "Countries Reached" },
  { value: "100K+", label: "Lives Impacted" },
];

const testimonials = [
  {
    quote:
      "I finally felt heard. For the first time, someone listened without judgment.",
    name: "Anonymous · Adult Safe Place",
  },
  {
    quote:
      "This saved me during the hardest week of my life. My sibling showed up when no one else did.",
    name: "Anonymous · Sibling Connect",
  },
  {
    quote:
      "As a wheelchair user, I never thought online community could feel this human.",
    name: "Anonymous · Inclusive Hub",
  },
];

export default function LovableHome() {
  return (
    <div>
      <HeroVideo />

      <section id="pillars" className="scroll-mt-28 bg-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Three Pillars · One Family
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
              A Lifetime Platform for Every Stage
            </h2>
            <p className="text-muted-foreground">
              From childhood to adulthood, from ability to vulnerability, there is
              a place for you here.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p, i) => {
              const vis = pillarVisual[p.color];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 1, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-3xl border-2 border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-teal"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${vis.iconBg}`}
                  >
                    <p.icon className={`h-7 w-7 ${vis.iconText}`} aria-hidden />
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-bold">
                    {p.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2"
                  >
                    Explore <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-pink/8 via-background to-primary/8 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 1, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.08 }}
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-pink">
                Adult Safe Place · 18+
              </p>
              <h2 className="mb-5 font-display text-3xl font-bold leading-tight md:text-5xl">
                A Safe Place for Adults to Be Heard
              </h2>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Confidential. Anonymous if you wish. Always human. A sanctuary
                for relationships, life, healing, and identity.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  className="rounded-full bg-brand-pink text-primary-foreground hover:bg-brand-pink/90"
                  asChild
                >
                  <Link href="/adult-safe-place">
                    <DoorOpen className="h-4 w-4" aria-hidden />
                    Enter Safe Space
                  </Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden />
                    Crisis Support
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 1, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={PHOTO_ADULT}
                  alt="Two adults in a quiet, supportive conversation, being heard without judgment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-background">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-yellow">
                    Real moments
                  </p>
                  <p className="font-display text-xl italic">
                    &ldquo;I finally felt heard.&rdquo;
                  </p>
                </div>
              </div>
              <div className="mt-3 hidden grid-cols-2 gap-2 md:grid">
                {adultFeatures.slice(0, 4).map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2 rounded-xl border bg-card p-3"
                  >
                    <f.icon
                      className="h-4 w-4 shrink-0 text-brand-pink"
                      aria-hidden
                    />
                    <p className="text-xs font-semibold leading-tight">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 1, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={PHOTO_INCLUSIVE}
                  alt="A wheelchair user in warm conversation, belonging without barriers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-background">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-yellow">
                    Real voices
                  </p>
                  <p className="font-display text-xl italic">
                    &ldquo;I found my people.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 1, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              className="order-1 lg:order-2"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Inclusive Support Hub
              </p>
              <h2 className="mb-4 font-display text-3xl font-bold leading-tight md:text-5xl">
                Belonging Without Barriers
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Accessibility first tools and disability focused communities,
                caregiver support, opportunity access, and verified resources,
                designed with, not for, our community.
              </p>
              <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3">
                {inclusiveFeatures.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 1, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border bg-gradient-to-br from-primary/5 to-brand-yellow/10 p-3 text-center"
                  >
                    <f.icon
                      className="mx-auto mb-1.5 h-5 w-5 text-primary"
                      aria-hidden
                    />
                    <p className="text-xs font-semibold leading-tight">
                      {f.label}
                    </p>
                  </motion.div>
                ))}
              </div>
              <Button
                variant="primary"
                size="lg"
                className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/inclusive-support-hub">
                  <Accessibility className="h-4 w-4" aria-hidden />
                  Belong Without Barriers
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-28 bg-muted/40 py-20 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-yellow">
              How It Works
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Three simple steps to belonging
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 1, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border bg-card p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand-pink font-display text-2xl font-bold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="mb-3 font-display text-xl font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="promises"
        className="scroll-mt-28 bg-gradient-to-br from-primary to-deep-teal py-20 text-primary-foreground md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-yellow">
              Community Impact
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Belonging at Scale
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 1, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ delay: i * 0.1 }}
                className="min-w-0 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 text-center backdrop-blur sm:p-5 md:p-6"
              >
                <p className="mb-1 break-words font-display text-xl font-bold leading-none tracking-tight text-brand-yellow sm:mb-2 sm:text-2xl md:text-3xl lg:text-[1.75rem] xl:text-4xl">
                  {m.value}
                </p>
                <p className="text-xs leading-snug text-primary-foreground/80 sm:text-sm">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="scroll-mt-28 bg-background py-20 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-pink">
              Real Voices
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Stories From Our Siblings
            </h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 1, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border-2 border-border bg-card p-7 transition-all hover:border-brand-yellow/50"
              >
                <div className="mb-4 flex gap-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={`${i}-star-${j}`}
                      className="h-4 w-4 fill-brand-yellow text-brand-yellow"
                    />
                  ))}
                </div>
                <p className="mb-5 leading-relaxed italic text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SafeMatchingSections />

      <section className="mt-10 w-full bg-background pb-12 pt-2 md:mt-16 md:pb-16 md:pt-4">
        <div className="relative isolate w-full min-h-[320px] overflow-hidden rounded-none shadow-[0_24px_48px_-18px_rgba(0,0,0,0.22)] ring-1 ring-black/5">
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-brand-orange via-brand-pink to-brand-red"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,white_0,transparent_60%)] opacity-20"
            aria-hidden
          />
          <div className="relative z-10 px-4 py-16 text-center text-primary-foreground md:px-8 md:py-24 lg:py-28">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-5 font-display text-4xl font-bold leading-tight md:text-6xl">
                You don&apos;t have to do life alone.
              </h2>
              <p className="mb-10 text-lg text-primary-foreground/90">
                Join a global movement turning loneliness into belonging, one
                sibling at a time.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-primary-foreground/25 bg-card text-primary hover:bg-card/90"
                  asChild
                >
                  <Link href="/match">
                    Join Now
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-brand-yellow text-foreground hover:bg-brand-yellow/90"
                  asChild
                >
                  <Link href="/save-a-sibling">
                    Save A Sibling
                    <Heart className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  variant="tertiary"
                  size="lg"
                  className="border border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/12"
                  asChild
                >
                  <Link href="/volunteer">
                    Become a Volunteer
                    <HeartHandshake className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
