import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Compass,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Sun,
  UserPlus,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sibling Connect",
  description:
    "Connection, mentorship, and belonging for youth and general members. Build a circle of siblings who show up for the everyday and the hard days alike.",
};

const audiences = [
  {
    icon: Backpack,
    title: "Students & teens",
    detail:
      "Find a sibling who's a few steps ahead: homework, identity, friendships, family.",
  },
  {
    icon: GraduationCap,
    title: "Recent graduates",
    detail:
      "First job, first city, first time away from home. Be matched with someone who's been there.",
  },
  {
    icon: Compass,
    title: "People in transition",
    detail:
      "New parent, new country, new chapter. A sibling makes the unknown a little less lonely.",
  },
  {
    icon: Sun,
    title: "Anyone in a quiet season",
    detail:
      "You don't need a crisis to deserve company. Loneliness counts.",
  },
];

const ways = [
  {
    icon: MessageCircle,
    title: "Regular check ins",
    detail:
      "A quick \"how was today?\" that turns into a habit of being known.",
  },
  {
    icon: Lightbulb,
    title: "Mentorship moments",
    detail:
      "Real advice from someone with lived experience: not a coach, just a sibling.",
  },
  {
    icon: HeartHandshake,
    title: "Story circles",
    detail:
      "Small group conversations on belonging, identity, and life, facilitated by trained members.",
  },
  {
    icon: Users,
    title: "Open community",
    detail:
      "Drop-in spaces for film nights, book clubs, and Sunday \"just talk\" hangs.",
  },
];

export default function SiblingConnectPage() {
  return (
    <article className="bg-background">
      <header className="relative isolate overflow-hidden bg-background">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src="https://images.pexels.com/photos/30980280/pexels-photo-30980280.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/92 via-background/80 to-background/92" />
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl text-center relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-orange mb-5 backdrop-blur-sm">
            Pillar · Sibling Connect
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
            A sibling for every season.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl rounded-2xl bg-background/82 px-4 py-3 text-lg leading-relaxed text-foreground shadow-sm backdrop-blur-sm md:text-xl">
            Connection, mentorship, and belonging for youth and general
            members. Build a circle of siblings who show up for the everyday and
            the hard days alike.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-brand-orange text-primary-foreground hover:bg-brand-orange/90 rounded-full px-7"
              asChild
            >
              <Link href="/match">
                <UserRoundSearch className="h-4 w-4" aria-hidden="true" />
                Find your sibling
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
        aria-labelledby="audiences-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
              Who it&apos;s for
            </p>
            <h2
              id="audiences-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              You don&apos;t have to do this part alone
            </h2>
            <p className="text-foreground/75">
              Sibling Connect is open to everyone who wants steady company on the
              everyday. No diagnosis, no story to justify, no minimum life stage.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 gap-4">
            {audiences.map((a) => (
              <li
                key={a.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/15 text-brand-orange">
                  <a.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-bold text-lg mb-1 leading-tight">
                    {a.title}
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {a.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="ways-heading"
        className="py-16 md:py-24 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
              How siblings show up
            </p>
            <h2
              id="ways-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Small acts. Real belonging.
            </h2>
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ways.map((w) => (
              <li
                key={w.title}
                className="flex flex-col p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                  <w.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-display font-bold text-lg mb-2 leading-tight">
                  {w.title}
                </p>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {w.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-yellow/15 via-background to-brand-orange/15">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
            Ready to meet your sibling?
          </h2>
          <p className="text-foreground/75 mb-8 leading-relaxed">
            It takes about three minutes. You can pause, edit, or step away at
            any point, and you can stay anonymous for as long as you want.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-brand-orange text-primary-foreground hover:bg-brand-orange/90 rounded-full px-7"
              asChild
            >
              <Link href="/match">
                Start matching <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/85 text-foreground shadow-sm hover:bg-muted hover:border-foreground/20"
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
