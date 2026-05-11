import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Eye,
  Heart,
  Lightbulb,
  Shield,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "From pain to purpose: the story, mission, and values behind My True Siblings Initiative.",
};

/**
 * Thematic backdrop for "From Pain to Purpose": first light over wild country,
 * renewal and a way forward (not a literal portrait).
 */
const ABOUT_HERO_IMAGE =
  "https://images.pexels.com/photos/13634354/pexels-photo-13634354.jpeg?auto=compress&cs=tinysrgb&w=1920";

const coreValues: {
  icon: typeof Heart;
  title: string;
  description: string;
}[] = [
  {
    icon: Heart,
    title: "Love",
    description: "Every interaction is rooted in genuine care.",
  },
  {
    icon: Shield,
    title: "Safeguarding",
    description: "Protection of every individual, especially children.",
  },
  {
    icon: Users,
    title: "Belonging",
    description: "No one should walk through life alone.",
  },
  {
    icon: BadgeCheck,
    title: "Integrity",
    description:
      "Transparent, accountable, and ethical in all we do.",
  },
  {
    icon: Lightbulb,
    title: "Excellence",
    description: "Delivering impactful, measurable outcomes.",
  },
  {
    icon: BookOpen,
    title: "Inclusion",
    description: "Welcoming every background, faith, and identity.",
  },
];

export default function AboutPage() {
  return (
    <article className="bg-background">
      <header className="relative isolate overflow-hidden border-b border-border/60 bg-background py-16 md:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src={ABOUT_HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.12),transparent_55%)]"
        />
        <div className="container relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            From Pain to{" "}
            <span className="text-primary">Purpose</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl rounded-2xl bg-background/82 px-4 py-3 text-base leading-relaxed text-foreground shadow-sm backdrop-blur-sm md:text-lg">
            From loneliness to legacy: the story behind My True Siblings
            Initiative.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="our-story-heading"
        className="border-b border-border/40 bg-background py-16 md:py-24"
      >
        <div className="container mx-auto max-w-3xl px-4">
          <h2
            id="our-story-heading"
            className="font-display text-3xl font-bold text-foreground md:text-4xl"
          >
            Our Story
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              My True Siblings Initiative was born from a deeply personal place.
              The founder understood firsthand the ache of growing up without
              the guidance, protection, and companionship that siblings
              provide.
            </p>
            <p>
              That pain, rather than turning into bitterness, transformed into a
              burning purpose: to ensure that no child, no teenager, and no
              adult would ever have to navigate life&apos;s challenges
              completely alone.
            </p>
            <p>
              What began as a simple dream has grown into a structured global
              mentorship and emotional healing network under the TACE Foundation,
              reaching thousands of lives across multiple countries.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="mission-vision-heading"
        className="border-b border-border/40 bg-muted/50 py-16 md:py-24"
      >
        <h2 id="mission-vision-heading" className="sr-only">
          Mission and vision
        </h2>
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:gap-10">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
            <Eye
              className="mb-6 h-9 w-9 text-primary"
              strokeWidth={1.75}
              aria-hidden
            />
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Our Mission
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              To connect vulnerable individuals to trained volunteer siblings who
              provide mentorship, emotional healing, and lifelong support
              through structured, safeguarded programs.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
            <Star
              className="mb-6 h-9 w-9 text-brand-yellow"
              strokeWidth={1.75}
              aria-hidden
            />
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Our Vision
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A world where every person has access to a trusted sibling figure:
              someone who walks with them through life&apos;s challenges with
              love, guidance, and accountability.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="core-values-heading"
        className="bg-background py-16 md:py-24"
      >
        <div className="container mx-auto max-w-5xl px-4">
          <h2
            id="core-values-heading"
            className="text-center font-display text-3xl font-bold text-foreground md:text-4xl"
          >
            Core Values
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {coreValues.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 md:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon
                    className="h-5 w-5 text-primary"
                    strokeWidth={1.85}
                    aria-hidden
                  />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-foreground">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="safeguarding"
        aria-labelledby="safeguarding-heading"
        className="border-y border-primary-foreground/15 bg-[hsl(175_70%_29%)] py-16 text-primary-foreground md:py-24"
      >
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Shield
            className="mx-auto mb-8 h-14 w-14 stroke-[1.25] text-brand-yellow"
            aria-hidden
          />
          <h2
            id="safeguarding-heading"
            className="font-display text-3xl font-bold md:text-4xl"
          >
            Safeguarding Commitment
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
            Every volunteer undergoes mandatory background checks, child
            protection training, and monthly accountability reviews. We maintain
            a strict digital communication policy and zero tolerance approach to
            safeguarding violations.
          </p>
          <div className="mx-auto mt-12 grid max-w-2xl gap-6 text-left sm:grid-cols-2 md:gap-x-14 md:gap-y-5">
            {[
              "Background checks",
              "Child protection training",
              "Monthly accountability review",
              "Digital communication policy",
              "No private physical contact",
              "Escalation process",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <Shield
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-sm leading-snug md:text-base text-primary-foreground/95">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto flex justify-center px-4">
          <Button variant="secondary" className="rounded-full" asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
