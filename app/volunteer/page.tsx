import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardPenLine,
  Clock,
  GraduationCap,
  Heart,
  HeartHandshake,
  Languages,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Become a sibling. Volunteer your time, your story, and your steady presence, and get trained, supported, and never alone in the work.",
};

const whoCan = [
  {
    icon: Heart,
    title: "Anyone with steady empathy",
    detail:
      "You don't need a clinical background. We train all the rest. Lived experience is the most valued credential here.",
  },
  {
    icon: GraduationCap,
    title: "Students and early career",
    detail:
      "Build hours of meaningful experience while supporting people your own age.",
  },
  {
    icon: Languages,
    title: "Speakers of underrepresented languages",
    detail:
      "We need volunteers in every language a sibling might be most comfortable in.",
  },
  {
    icon: HeartHandshake,
    title: "Lived experience advocates",
    detail:
      "Disability, neurodiversity, queer identity, recovery, faith transitions: your story is a gift.",
  },
];

const commitments = [
  {
    label: "Light",
    hours: "1 to 2 hrs / week",
    detail:
      "A daily check in or two with one sibling. The smallest version of the gift.",
  },
  {
    label: "Steady",
    hours: "3 to 5 hrs / week",
    detail:
      "Two siblings, or one sibling plus a recurring story circle.",
  },
  {
    label: "Deep",
    hours: "6+ hrs / week",
    detail:
      "Ongoing one on one sessions, group facilitation, and crisis aware sibling work (extra training).",
  },
];

const journey = [
  {
    title: "Apply in fifteen minutes",
    detail:
      "Tell us about you, why you want to do this, and which pillar feels closest to home.",
  },
  {
    title: "We meet you (gently)",
    detail:
      "A 30-minute conversation with a sibling coach. No interrogation, no test: we just want to know you.",
  },
  {
    title: "Train with our team",
    detail:
      "Two short courses on trauma informed listening, safeguarding, and our community ethics. Your time is paid via stipend.",
  },
  {
    title: "Match with your first sibling",
    detail:
      "Light commitment first. We check in at week 1, week 4, and on demand. You are never alone in the work.",
  },
];

const promises = [
  "Free, evidence informed training",
  "Stipend for training hours",
  "On call mental health support",
  "Reference letters on request",
  "Time off without question",
  "A community of fellow siblings",
];

export default function VolunteerPage() {
  return (
    <article className="bg-background">
      <header className="bg-gradient-to-br from-brand-yellow/20 via-background to-primary/10">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-yellow/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-orange mb-5">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Become a Volunteer
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
            Show up for a sibling.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            You don&apos;t need a degree, a perfect story, or unlimited hours.
            You just need to be willing to listen well. We&apos;ll train, fund,
            and support you for the rest.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-primary-foreground rounded-full px-7"
              asChild
            >
              <Link href="/contact">
                <ClipboardPenLine className="h-4 w-4" aria-hidden="true" />
                Start your application
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/85 px-7 text-foreground shadow-sm hover:bg-card"
              asChild
            >
              <Link href="/sibling-connect">
                <Users className="h-4 w-4" aria-hidden="true" />
                See who you&apos;d be supporting
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="who-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
              Who can volunteer
            </p>
            <h2
              id="who-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              The right person is probably you
            </h2>
          </div>

          <ul className="grid md:grid-cols-2 gap-4">
            {whoCan.map((w) => (
              <li
                key={w.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/15 text-brand-orange">
                  <w.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-bold text-lg mb-1 leading-tight">
                    {w.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {w.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="time-heading"
        className="py-16 md:py-24 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Time commitments
            </p>
            <h2
              id="time-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Pick a pace that fits your life
            </h2>
            <p className="text-muted-foreground">
              You can step up or step down at any time, no questions asked.
            </p>
          </div>

          <ul className="grid md:grid-cols-3 gap-4">
            {commitments.map((c) => (
              <li
                key={c.label}
                className="flex flex-col p-6 rounded-3xl bg-card border text-center"
              >
                <span className="inline-flex items-center gap-2 self-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {c.label}
                </span>
                <p className="font-display font-bold text-2xl mb-2">
                  {c.hours}
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
        aria-labelledby="journey-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
              Your journey
            </p>
            <h2
              id="journey-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              From application to first sibling
            </h2>
          </div>

          <ol className="space-y-4">
            {journey.map((j, i) => (
              <li
                key={j.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-primary-foreground font-display font-bold"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-bold text-lg leading-tight mb-1">
                    {j.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {j.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="promises-heading"
        className="py-16 md:py-24 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-3xl border bg-card p-8 md:p-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Our side of the deal
            </p>
            <h2
              id="promises-heading"
              className="text-2xl md:text-3xl font-display font-bold mb-6 leading-tight"
            >
              You will never be alone in the work
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {promises.map((p, idx) => (
                <li key={`volunteer-promise:${idx}`} className="flex items-start gap-2 text-sm">
                  <CheckCircle2
                    className="h-5 w-5 text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-yellow/20 via-background to-brand-orange/15">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
            Be the sibling you needed.
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The application takes about fifteen minutes. There is no
            decision day pressure: we want to meet who you actually are.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-primary-foreground rounded-full px-7"
              asChild
            >
              <Link href="/contact">
                Apply to volunteer <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
