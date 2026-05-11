import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Church,
  Globe2,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  School,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "All Programs",
  description:
    "Explore the full My True Siblings program ecosystem, from school outreach and mentorship to emotional healing and inclusive support.",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80";

const pillars = [
  {
    id: "school-outreach",
    icon: School,
    eyebrow: "Pillar 01",
    title: "School Outreach",
    summary:
      "Belonging support for primary and secondary students through safe circles, mentorship, and confidence building activities.",
    bullets: [
      "Sibling to student mentorship",
      "Reading clubs and safe space circles",
      "Empowerment workshops for girls and boys",
      "Structured school partnership delivery",
    ],
    cta: { label: "Plan school outreach", href: "/contact" },
    accent: "from-sky-500/15 via-background to-transparent",
  },
  {
    id: "religious-outreach",
    icon: Church,
    eyebrow: "Pillar 02",
    title: "Religious Outreach",
    summary:
      "Community rooted belonging programs that work with faith institutions while preserving dignity, inclusion, and safeguarding.",
    bullets: [
      "Youth discipleship and support circles",
      "Parent and caregiver engagement",
      "Faith based volunteer mobilization",
      "Pastoral safeguarding collaboration",
    ],
    cta: { label: "Talk about faith partnerships", href: "/contact" },
    accent: "from-brand-yellow/20 via-background to-transparent",
  },
  {
    id: "age-stage-support",
    icon: Waypoints,
    eyebrow: "Pillar 03",
    title: "Age Stage Support",
    summary:
      "Support designed around where someone is in life, not just what they are struggling with right now.",
    bullets: [
      "Childhood belonging pathways",
      "Teen transition guidance",
      "Young adult life stage matching",
      "Long term continuity across milestones",
    ],
    cta: { label: "Explore matching", href: "/match" },
    accent: "from-primary/15 via-background to-transparent",
  },
  {
    id: "emotional-healing",
    icon: HeartPulse,
    eyebrow: "Pillar 04",
    title: "Emotional Healing",
    summary:
      "Real human support for grief, rupture, loneliness, and identity stress, with clear routes into safer care when needed.",
    bullets: [
      "Adult Safe Place conversations",
      "Trauma informed listening",
      "One on one and circle based support",
      "Escalation to crisis resources when required",
    ],
    cta: { label: "Enter Adult Safe Place", href: "/adult-safe-place" },
    accent: "from-brand-pink/20 via-background to-transparent",
  },
  {
    id: "match-a-sibling",
    icon: Users,
    eyebrow: "Pillar 05",
    title: "Match a Sibling",
    summary:
      "A guided pathway into meaningful sibling connection, pairing people thoughtfully by life stage, values, pace, and context.",
    bullets: [
      "Human reviewed matching",
      "Anonymous if preferred",
      "Values and rhythm alignment",
      "Safe, reversible introductions",
    ],
    cta: { label: "Start your match", href: "/match" },
    accent: "from-brand-orange/20 via-background to-transparent",
  },
  {
    id: "community-impact",
    icon: Globe2,
    eyebrow: "Pillar 06",
    title: "Community Impact",
    summary:
      "The infrastructure around the movement: sponsors, volunteers, partners, and advocates who make belonging scalable.",
    bullets: [
      "Volunteer and mentor activation",
      "Sponsor and adopt a sibling pathways",
      "Employer and NGO collaborations",
      "Global ecosystem growth",
    ],
    cta: { label: "See partnership options", href: "/corporate-partnership" },
    accent: "from-emerald-500/15 via-background to-transparent",
  },
] as const;

const roleCards = [
  {
    icon: Sparkles,
    title: "Find Your Sibling",
    detail:
      "For anyone seeking companionship, mentorship, or emotional connection.",
    href: "/match",
    cta: "Start your belonging journey",
  },
  {
    icon: HandHeart,
    title: "Mentor a Sibling",
    detail:
      "Volunteer to guide a child or youth with consistent, human support.",
    href: "/volunteer",
    cta: "Apply as a mentor",
  },
  {
    icon: HeartHandshake,
    title: "Adopt a Sibling",
    detail:
      "Provide practical support for someone who needs belonging plus stability.",
    href: "/donate",
    cta: "Support a sibling",
  },
  {
    icon: Users,
    title: "Match a Sibling",
    detail:
      "Join our guided matching flow and help create safe, meaningful pairings.",
    href: "/match",
    cta: "Open the matching flow",
  },
  {
    icon: Building2,
    title: "Sponsor a Sibling",
    detail:
      "Fund access to outreach, therapy support, resources, or program delivery.",
    href: "/donate",
    cta: "Back the mission",
  },
  {
    icon: BriefcaseBusiness,
    title: "Partner With Us",
    detail:
      "Bring belonging to your school, faith community, company, or NGO.",
    href: "/corporate-partnership",
    cta: "Discuss partnership",
  },
] as const;

const specializedPrograms = [
  {
    title: "Sibling Connect",
    detail:
      "The core community experience for youth and members who want connection, circles, and long term belonging.",
    href: "/sibling-connect",
  },
  {
    title: "Adult Safe Place (18+)",
    detail:
      "Confidential, judgment free emotional support for adults navigating the hard parts of life.",
    href: "/adult-safe-place",
  },
  {
    title: "Inclusive Support Hub",
    detail:
      "Belonging pathways designed for people living with disabilities, with accessibility considered from the start.",
    href: "/inclusive-support-hub",
  },
] as const;

export default function ProgramsPage() {
  return (
    <article className="bg-background">
      <header className="relative overflow-hidden border-b border-border/50 bg-[linear-gradient(135deg,hsl(186_36%_94%),hsl(42_100%_95%)_45%,hsl(340_100%_96%))]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(13_95%_60%/0.12),transparent_30%)]"
        />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              All Programs
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              A full ecosystem for
              <span className="text-primary"> belonging, healing, and guidance.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Explore the six pillars behind My True Siblings, from school
              outreach and faith communities to human reviewed matching,
              emotional healing, and long-term community impact.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <a href="#pillars">
                  Explore the pillars <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full border border-border/60 bg-background/85 px-7 text-foreground shadow-sm hover:bg-card"
                asChild
              >
                <Link href="/contact">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Talk to our team
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-3xl bg-brand-yellow/35 blur-2xl" />
            <div className="absolute -bottom-6 -right-4 h-28 w-28 rounded-full bg-brand-pink/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-[0_24px_80px_rgba(17,24,39,0.12)] backdrop-blur">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.4rem]">
                <Image
                  src={HERO_IMAGE}
                  alt="Volunteers organizing support supplies together."
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-3 px-2 pb-2 pt-4 sm:grid-cols-3">
                {[
                  ["6 pillars", "A structured support system"],
                  ["Real humans", "No AI sibling relationships"],
                  ["Global reach", "Programs shaped for different communities"],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-2xl bg-background/85 p-4">
                    <p className="font-display text-lg font-bold text-foreground">
                      {title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-border/50 bg-background/80 py-6">
        <div className="container mx-auto flex flex-wrap items-center gap-3 px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Browse the system
          </span>
          {pillars.map((pillar) => (
            <a
              key={pillar.id}
              href={`#${pillar.id}`}
              className="rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {pillar.title}
            </a>
          ))}
        </div>
      </section>

      <section
        id="pillars"
        aria-labelledby="pillars-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.22em]">
              The Six Pillars
            </p>
            <h2
              id="pillars-heading"
              className="mt-4 font-display text-3xl font-bold text-foreground md:text-5xl"
            >
              One movement, six ways people find support
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              The screenshot you shared showed the right intent but too little
              hierarchy. This version makes scanning easier, keeps every pillar
              visible, and gives each one a clear action path.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <section
                key={pillar.id}
                id={pillar.id}
                className={`scroll-mt-28 overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br ${pillar.accent} shadow-sm`}
              >
                <div className="p-7 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background shadow-sm">
                      <pillar.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        {pillar.eyebrow}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    {pillar.summary}
                  </p>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {pillar.bullets.map((bullet, bIdx) => (
                      <li
                        key={`${pillar.id}:b${bIdx}`}
                        className="flex items-start gap-2 rounded-2xl bg-background/80 px-4 py-3 text-sm text-foreground/85"
                      >
                        <ShieldCheck
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button variant="primary" className="rounded-full px-6" asChild>
                      <Link href={pillar.cta.href}>
                        {pillar.cta.label}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section
        id="roles"
        aria-labelledby="roles-heading"
        className="border-y border-border/50 bg-muted/35 py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-[0.22em]">
              Global Belonging Infrastructure
            </p>
            <h2
              id="roles-heading"
              className="mt-4 font-display text-3xl font-bold text-foreground md:text-5xl"
            >
              Choose your role in the movement
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              People rarely arrive knowing exactly where they fit. These entry
              points make the next step obvious.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roleCards.map((role, idx) => (
              <li
                key={`role:${idx}:${role.title}`}
                className="group rounded-[1.75rem] border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <role.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {role.detail}
                </p>
                <Link
                  href={role.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {role.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="specialized-programs"
        aria-labelledby="specialized-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.22em]">
              Specialized Programs
            </p>
            <h2
              id="specialized-heading"
              className="mt-4 font-display text-3xl font-bold text-foreground md:text-5xl"
            >
              Dedicated spaces for deeper support
            </h2>
          </div>

          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {specializedPrograms.map((program, index) => {
              const icons = [BookOpenCheck, HeartHandshake, Globe2] as const;
              const Icon = icons[index];

              return (
                <li
                  key={program.title}
                  className="rounded-[1.8rem] border border-border bg-card p-7 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/15 text-brand-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {program.detail}
                  </p>
                  <Button variant="secondary" className="mt-6 rounded-full" asChild>
                    <Link href={program.href}>
                      Visit program <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary to-deep-teal py-20 text-primary-foreground md:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            Need help choosing the right program?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-primary-foreground/90 md:text-lg">
            We can route you to the right doorway based on age, situation,
            urgency, and the kind of support you actually need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="rounded-full bg-card px-7 text-primary hover:bg-card/90"
              asChild
            >
              <Link href="/contact">
                Talk to our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-primary-foreground/25 bg-primary-foreground/12 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
