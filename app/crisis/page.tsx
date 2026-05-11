import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  DoorOpen,
  Globe2,
  HeartPulse,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Crisis Support",
  description:
    "If you are in crisis, you are not alone. Free, confidential hotlines, text lines, and warmlines, available 24/7.",
  robots: { index: true, follow: true },
};

interface Hotline {
  region: string;
  name: string;
  number: string;
  tel: string;
  note: string;
}

const hotlines: Hotline[] = [
  {
    region: "United States & Canada",
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    tel: "988",
    note: "Call or text · 24/7 · free · confidential",
  },
  {
    region: "United Kingdom & Ireland",
    name: "Samaritans",
    number: "116 123",
    tel: "116123",
    note: "Free · 24/7 · confidential",
  },
  {
    region: "Australia",
    name: "Lifeline",
    number: "13 11 14",
    tel: "131114",
    note: "24/7 crisis support",
  },
  {
    region: "New Zealand",
    name: "1737 Need to talk?",
    number: "1737",
    tel: "1737",
    note: "Call or text · free · 24/7",
  },
  {
    region: "Nigeria",
    name: "Mentally Aware Nigeria Initiative",
    number: "0809 210 6493",
    tel: "+2348092106493",
    note: "Daily · trauma informed",
  },
  {
    region: "South Africa",
    name: "SADAG Suicide Crisis Line",
    number: "0800 567 567",
    tel: "+27800567567",
    note: "24/7 · free from any landline",
  },
];

interface TextOption {
  name: string;
  detail: string;
  cta: string;
  href: string;
}

const textOptions: TextOption[] = [
  {
    name: "Crisis Text Line",
    detail:
      "Text HOME to 741741 in the US/Canada, 85258 in the UK, 50808 in Ireland.",
    cta: "Open Crisis Text Line",
    href: "https://www.crisistextline.org",
  },
  {
    name: "The Trevor Project (LGBTQ+ youth)",
    detail: "TrevorChat web chat, TrevorText to 678-678, TrevorLifeline 1-866-488-7386.",
    cta: "Open Trevor Project",
    href: "https://www.thetrevorproject.org/get-help/",
  },
  {
    name: "Find a Helpline (every country)",
    detail:
      "International directory of crisis lines, vetted by Throughline. Choose your country to see local options.",
    cta: "Open Find a Helpline",
    href: "https://findahelpline.com",
  },
];

const safetySteps = [
  {
    title: "Reach a person, not a screen",
    detail:
      "Call or text one of the lines above. If you can't speak, the operator will guide you with simple yes/no questions.",
  },
  {
    title: "Move to a safer space",
    detail:
      "Step away from anything you might use to harm yourself. Move to a different room. Open a window. Step outside if it's safe.",
  },
  {
    title: "Tell one person",
    detail:
      "Text a friend, a sibling, a coworker: anyone you trust. You don't have to explain. \"I'm not okay\" is enough.",
  },
  {
    title: "Stay until the wave passes",
    detail:
      "Crisis moments are storms: they pass. Keep talking, keep moving, keep breathing. You do not have to make any other decision tonight.",
  },
];

export default function CrisisPage() {
  return (
    <article className="bg-background">
      <header className="bg-brand-red text-primary-foreground">
        <div className="container mx-auto px-4 py-14 md:py-20 max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 backdrop-blur px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
            Crisis Support
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
            You are not alone.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/95 leading-relaxed">
            If you are thinking about suicide, self harm, or are in immediate
            danger, please reach out to someone who can help right now. The lines
            below are free, confidential, and available 24/7.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="hotlines-heading"
        className="py-16 md:py-20"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-brand-red font-semibold text-sm uppercase tracking-widest mb-3">
              Call right now
            </p>
            <h2
              id="hotlines-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Free, confidential, 24/7
            </h2>
            <p className="text-muted-foreground">
              Tap any number to call directly from your device.
            </p>
          </div>

          <ul className="grid md:grid-cols-2 gap-4">
            {hotlines.map((line) => (
              <li key={line.name}>
                <a
                  href={`tel:${line.tel}`}
                  className="group flex items-start gap-4 p-6 rounded-3xl bg-card border-2 border-border hover:border-brand-red/60 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                    <PhoneCall className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      {line.region}
                    </p>
                    <p className="font-display font-bold text-lg leading-tight mb-1">
                      {line.name}
                    </p>
                    <p className="text-2xl font-bold text-brand-red mb-1 tabular-nums">
                      {line.number}
                    </p>
                    <p className="text-xs text-muted-foreground">{line.note}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="text-heading"
        className="py-16 md:py-20 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              If calling feels hard
            </p>
            <h2
              id="text-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Text or chat instead
            </h2>
            <p className="text-muted-foreground">
              Trained counsellors. Confidential. No video, no voice: just words,
              at your pace.
            </p>
          </div>

          <ul className="grid md:grid-cols-3 gap-4">
            {textOptions.map((opt) => (
              <li
                key={opt.name}
                className="flex flex-col p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-display font-bold text-lg mb-2 leading-snug">
                  {opt.name}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {opt.detail}
                </p>
                <a
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all focus-visible:outline-none focus-visible:underline"
                >
                  {opt.cta}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-card border max-w-3xl mx-auto">
            <Globe2 className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Outside these regions? <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Find a Helpline</a> lists vetted crisis lines for over 130 countries.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="safety-heading"
        className="py-16 md:py-20"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
              In the next few minutes
            </p>
            <h2
              id="safety-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              A small safety plan
            </h2>
            <p className="text-muted-foreground">
              You don&apos;t have to fix everything tonight. Just one of these,
              right now, is enough.
            </p>
          </div>

          <ol className="space-y-4">
            {safetySteps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 p-5 rounded-2xl bg-card border"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange font-display font-bold"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-bold text-lg leading-tight mb-1">
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="platform-heading"
        className="py-16 md:py-20 bg-gradient-to-br from-primary to-deep-teal text-primary-foreground"
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
            On My Siblings
          </p>
          <h2
            id="platform-heading"
            className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight"
          >
            When you&apos;re ready, we&apos;ll be here
          </h2>
          <p className="text-primary-foreground/90 leading-relaxed mb-8">
            Crisis lines come first. When the wave passes, our community is a
            place to keep being heard: anonymously if you wish, always with a
            real human on the other side.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 rounded-full px-7"
              asChild
            >
              <Link href="/adult-safe-place">
                <DoorOpen className="h-4 w-4" aria-hidden="true" />
                Enter Safe Space
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-primary-foreground/25 bg-primary-foreground/12 px-7 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <Link href="/match">
                <UserRoundSearch className="h-4 w-4" aria-hidden="true" />
                Find a sibling
              </Link>
            </Button>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-primary-foreground/80">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Free · Anonymous if you prefer · Always human
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 text-center">
        <Button variant="secondary" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
          </Link>
        </Button>
      </div>
    </article>
  );
}
