import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  DoorOpen,
  EyeOff,
  HeartHandshake,
  Lock,
  MessageCircle,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Adult Safe Place",
  description:
    "Confidential, judgment free emotional support for adults 18+. Anonymous if you wish, always human.",
};

const promises = [
  {
    icon: Lock,
    title: "Private by default",
    detail:
      "Your conversations are end to end encrypted. Moderators only see what you flag for review.",
  },
  {
    icon: EyeOff,
    title: "Anonymous if you want",
    detail:
      "Use a pseudonym, hide your photo, choose what you share. Identity is not the price of being heard.",
  },
  {
    icon: ShieldCheck,
    title: "Trauma aware moderation",
    detail:
      "Every moderator is trained in trauma informed care, mandated to listen first, never judge.",
  },
  {
    icon: UserCheck,
    title: "Always human",
    detail:
      "No AI sibling, no chatbot triage, no script. The person you talk to is a real human.",
  },
];

const topics = [
  "Relationships & love",
  "Identity & sexuality",
  "Grief & loss",
  "Anxiety & depression",
  "Career transitions",
  "Parenting & caregiving",
  "Faith & meaning",
  "Family rupture",
  "Recovery & relapse",
  "Loneliness",
  "Burnout",
  "Body & health",
];

const formats = [
  {
    icon: Users,
    title: "Support circles",
    detail:
      "Small, recurring groups around a shared theme. Show up weekly or drop in when you can.",
  },
  {
    icon: MessageCircle,
    title: "Private one on one conversations",
    detail:
      "Quiet, paced conversation with a single sibling. Text, voice, or video: your call.",
  },
  {
    icon: Sparkles,
    title: "Anonymous Mode",
    detail:
      "Toggle a one way veil that hides your name, photo, and history. Only your words go through.",
  },
  {
    icon: ShieldAlert,
    title: "Crisis Support",
    detail:
      "If a conversation turns to immediate danger, our crisis pathway routes you to trained help in seconds.",
  },
  {
    icon: HeartHandshake,
    title: "Relationship & life support",
    detail:
      "Long form chats for the messy middle of adulthood: divorce, illness, identity, ambition.",
  },
];

export default function AdultSafePlacePage() {
  return (
    <article className="bg-background">
      <header className="relative isolate overflow-hidden bg-background">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/65 to-background/85" />
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl text-center relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-pink/30 bg-brand-pink/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-pink mb-5 backdrop-blur-sm">
            Adult Safe Place · 18+
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
            A place to be heard, exactly as you are.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl rounded-2xl bg-background/82 px-4 py-3 text-lg leading-relaxed text-foreground shadow-sm backdrop-blur-sm md:text-xl">
            Confidential. Anonymous if you wish. Always human. A sanctuary for
            relationships, identity, healing, and the parts of life you can&apos;t
            say out loud anywhere else.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-brand-pink text-primary-foreground hover:bg-brand-pink/90 rounded-full px-7"
              asChild
            >
              <Link href="/match">
                <DoorOpen className="h-4 w-4" aria-hidden="true" />
                Enter Safe Space
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-brand-red/25 bg-background/85 px-7 text-brand-red shadow-sm hover:bg-brand-red/10 hover:text-brand-red"
              asChild
            >
              <Link href="/crisis">
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                In crisis? Get help now
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="promises-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Our promise
            </p>
            <h2
              id="promises-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Trust before features
            </h2>
            <p className="text-muted-foreground">
              We hold a small set of firm commitments, the same ones we&apos;d
              want before we said the hard thing out loud.
            </p>
          </div>

          <ul className="grid md:grid-cols-2 gap-4">
            {promises.map((p) => (
              <li
                key={p.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-pink/10 text-brand-pink">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-bold text-lg mb-1 leading-tight">
                    {p.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="topics-heading"
        className="py-16 md:py-24 bg-muted/40"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-brand-pink font-semibold text-sm uppercase tracking-widest mb-3">
              What people talk about
            </p>
            <h2
              id="topics-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              The things that don&apos;t fit anywhere else
            </h2>
            <p className="text-muted-foreground">
              No topic is too small. No story is too messy. If it matters to
              you, it belongs here.
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-2">
            {topics.map((t) => (
              <li
                key={t}
                className="rounded-full border bg-card px-4 py-2 text-sm font-semibold text-foreground/85"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="formats-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-pink font-semibold text-sm uppercase tracking-widest mb-3">
              Ways to connect
            </p>
            <h2
              id="formats-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              However you need to be heard
            </h2>
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((f) => (
              <li
                key={f.title}
                className="flex flex-col p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-pink/10 text-brand-pink mb-4">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="font-display font-bold text-lg mb-2 leading-tight">
                  {f.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-pink/15 via-background to-primary/10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
            Take the next quiet step.
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Create a free, anonymous account in under three minutes. No card,
            no commitment, no pressure to share more than you want to.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-brand-pink text-primary-foreground hover:bg-brand-pink/90 rounded-full px-7"
              asChild
            >
              <Link href="/match">
                Enter Safe Space <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
