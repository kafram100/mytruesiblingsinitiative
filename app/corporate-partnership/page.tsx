import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  ChevronDown,
  Coins,
  Globe,
  HeartHandshake,
  MessageSquare,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Corporate Partnership",
  description:
    "Partner with My Siblings to bring belonging at scale to your customers, employees, and community.",
};

const tiers = [
  {
    icon: Coins,
    label: "Sponsor",
    title: "Fund free belonging",
    detail:
      "Underwrite sibling matches for people who need them most, disclosed transparently in our annual impact report.",
    bullets: [
      "From $5,000 / year",
      "Logo on impact report",
      "Quarterly impact briefing",
    ],
  },
  {
    icon: Briefcase,
    label: "Employer benefit",
    title: "Offer it to your team",
    detail:
      "Give your employees free, anonymous access to sibling support. Shows up as a benefit, not a referral.",
    bullets: [
      "Per-seat pricing",
      "SSO / SCIM provisioning",
      "Anonymous aggregate dashboards",
    ],
  },
  {
    icon: HeartHandshake,
    label: "NGO collaboration",
    title: "Co-build a community",
    detail:
      "Bring a constituency you serve into a dedicated, jointly moderated space inside My Siblings.",
    bullets: [
      "Collaborative onboarding",
      "Shared moderator training",
      "Custom impact reporting",
    ],
  },
];

const why = [
  {
    icon: Users,
    title: "Real human connection at scale",
    detail:
      "We don't replace therapy or chatbots. We solve the missing layer: the sibling shaped support that catches you before crisis.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first by design",
    detail:
      "We never expose individual user data. Aggregate, anonymous, opt-in only.",
  },
  {
    icon: Globe,
    title: "Global from day one",
    detail:
      "Pillar communities active across multiple countries and time zones. Translations developed with native speakers.",
  },
  {
    icon: TrendingUp,
    title: "Measurable impact",
    detail:
      "We measure belonging the way we measure health: validated scales, longitudinal tracking, peer reviewed methodology.",
  },
];

const trustItems = [
  "Trauma-informed moderator training",
  "Independent ethics advisory board",
  "Annual third party safety audit",
  "Transparent annual impact report",
  "Open source moderation policies",
  "Pay equity stipends for volunteers",
];

export default function CorporatePartnershipPage() {
  return (
    <article className="bg-background">
      <header className="bg-gradient-to-br from-deep-teal to-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 backdrop-blur px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-yellow mb-5">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Corporate Partnership
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
            Belonging, at the scale of your business.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8">
            Sponsors, employers, and aligned non-profits help us turn loneliness
            into belonging, without compromising the privacy or autonomy of
            the people we serve.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 rounded-full px-7"
              asChild
            >
              <Link href="/contact">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Talk to partnerships
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full border border-primary-foreground/25 bg-primary-foreground/12 px-7 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <a href="#tiers">
                See partnership tiers{" "}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="why-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Why partner
            </p>
            <h2
              id="why-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              The belonging layer your audience is missing
            </h2>
          </div>

          <ul className="grid md:grid-cols-2 gap-4">
            {why.map((w) => (
              <li
                key={w.title}
                className="flex gap-4 p-6 rounded-3xl bg-card border"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
        id="tiers"
        aria-labelledby="tiers-heading"
        className="py-16 md:py-24 bg-muted/40 scroll-mt-16"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
              Partnership tiers
            </p>
            <h2
              id="tiers-heading"
              className="text-3xl md:text-4xl font-display font-bold mb-3"
            >
              Three ways to show up
            </h2>
          </div>

          <ul className="grid md:grid-cols-3 gap-4">
            {tiers.map((t) => (
              <li
                key={t.label}
                className="flex flex-col p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/40 transition-colors"
              >
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  <t.icon className="h-3 w-3" aria-hidden="true" />
                  {t.label}
                </span>
                <p className="font-display font-bold text-xl mb-2 leading-tight">
                  {t.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {t.detail}
                </p>
                <ul className="space-y-2 mt-auto">
                  {t.bullets.map((b, bIdx) => (
                    <li key={`${t.label}:bullet:${bIdx}`} className="flex items-start gap-2 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="trust-heading"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-3xl border bg-card p-8 md:p-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Why we&apos;re safe to associate with
            </p>
            <h2
              id="trust-heading"
              className="text-2xl md:text-3xl font-display font-bold mb-6 leading-tight"
            >
              We hold ourselves to the same standards we&apos;d want of our
              partners
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {trustItems.map((item, idx) => (
                <li key={`trust:${idx}`} className="flex items-start gap-2 text-sm">
                  <ScrollText
                    className="h-5 w-5 text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-deep-teal text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight">
            Let&apos;s build belonging together.
          </h2>
          <p className="text-primary-foreground/90 leading-relaxed mb-8">
            We&apos;ll respond within two working days with a partnership
            briefing tailored to your team: no boilerplate decks, no fluff.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 rounded-full px-7"
              asChild
            >
              <Link href="/contact">
                Talk to partnerships <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
