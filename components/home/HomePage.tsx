"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accessibility,
  Armchair,
  ArrowRight,
  Brain,
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
  type LucideIcon,
} from "lucide-react";

import HeroVideo from "@/components/HeroVideo";
import HomeSafetyBanner from "@/components/HomeSafetyBanner";
import MatchingAlgorithmFlow from "@/components/MatchingAlgorithmFlow";
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

const pillarDefs: {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: PillarColor;
  href: string;
}[] = [
  {
    icon: Users,
    title: "Sibling Connect",
    desc: "Connect with a sibling who truly understands you. Build meaningful relationships through guided conversations, shared experiences, and mutual support.",
    color: "brand-yellow",
    href: "/sibling-connect",
  },
  {
    icon: Heart,
    title: "Adult Safe Place",
    desc: "A moderated 18+ space for adults seeking healing circles, emotional support groups, and safe conversations with trained peer mentors.",
    color: "brand-pink",
    href: "/adult-safe-place",
  },
  {
    icon: Accessibility,
    title: "Inclusive Support Hub",
    desc: "Accessible support for everyone, including those with disabilities, chronic conditions, and caregiving responsibilities.",
    color: "primary",
    href: "/inclusive-support-hub",
  },
];

const adultFeatures = [
  { icon: Users, label: "Emotional Support Circles" },
  { icon: MessageCircle, label: "Private One-on-One" },
  { icon: EyeOff, label: "Anonymous Mode" },
  { icon: HeartHandshake, label: "Relationship & Life" },
  { icon: ShieldAlert, label: "Crisis Button" },
] as const;

const inclusiveFeatures = [
  { icon: Armchair, label: "Mobility Support" },
  { icon: Ear, label: "Hearing Accessibility" },
  { icon: Eye, label: "Vision Support" },
  { icon: Brain, label: "Neurodiversity" },
  { icon: HeartHandshake, label: "Caregiver Network" },
  { icon: Globe, label: "Global Resources" },
] as const;

const stepDefs = [
  {
    n: "01",
    title: "Join the Community",
    desc: "Sign up and create your profile. Tell us about yourself, your needs, and what you are looking for.",
  },
  {
    n: "02",
    title: "Connect with a Sibling",
    desc: "Get matched with a compatible sibling based on your needs, interests, and values. Start your journey together.",
  },
  {
    n: "03",
    title: "Grow Together",
    desc: "Build a lasting bond through guided conversations, shared activities, and ongoing support from the community.",
  },
];

const METRIC_DEFS = [
  { value: "12,400+", label: "Siblings Connected" },
  { value: "38,900+", label: "Support Sessions" },
  { value: "27", label: "Countries Reached" },
  { value: "100K+", label: "Lives Impacted" },
];

const testimonialDefs = [
  {
    quote: "This platform gave me a family I never had. My sibling understood me without judgment.",
    name: "&mdash; Sarah, Sibling Connect",
  },
  {
    quote: "The Adult Safe Place helped me heal after a difficult chapter. I found grace, not judgment.",
    name: "&mdash; James, Adult Safe Place",
  },
  {
    quote: "As a person with a disability, I finally found a space that truly includes me.",
    name: "&mdash; Maria, Inclusive Hub",
  },
];

export default function HomePage() {
  return (
    <div>
      <HeroVideo />
      <HomeSafetyBanner />

      <section
        id="pillars"
        className="scroll-mt-28 bg-background py-20 md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Our Pillars
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
              Three Pillars of Belonging
            </h2>
            <p className="text-muted-foreground">
              Every sibling journey is anchored in one of our three core pillars, each designed to meet you where you are.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {pillarDefs.map((p, i) => {
              const vis = pillarVisual[p.color];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-3xl border-2 border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-teal"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${vis.iconBg}`}
                  >
                    <p.icon
                      className={`h-7 w-7 ${vis.iconText}`}
                      aria-hidden
                    />
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
                    Explore More{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden />
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
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-pink">
                Adult Safe Place
              </p>
              <h2 className="mb-5 font-display text-3xl font-bold leading-tight md:text-5xl">
                A Safe Space for Adults
              </h2>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                A moderated 18+ space where adults find emotional support, healing circles, and judgment-free conversations. You are never too old to need a sibling.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/adult-safe-place">
                    <Heart className="h-4 w-4" /> Enter Safe Space
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <PhoneCall className="h-4 w-4" /> Crisis Support
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={PHOTO_ADULT}
                  alt="Adults in a supportive group conversation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 start-5 end-5 text-background">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-yellow">
                    Real Moments
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
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={PHOTO_INCLUSIVE}
                  alt="Inclusive community gathering with diverse participants"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 start-5 end-5 text-background">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-yellow">
                    Real Voices
                  </p>
                  <p className="font-display text-xl italic">
                    &ldquo;Everyone belongs here.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Inclusive Support Hub
              </p>
              <h2 className="mb-4 font-display text-3xl font-bold leading-tight md:text-5xl">
                Belonging for Everyone
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                We believe that support should be accessible to all. Our Inclusive Support Hub is designed with and for people with disabilities, chronic conditions, and caregiving responsibilities.
              </p>
              <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3">
                {inclusiveFeatures.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
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
              <Button variant="primary" size="lg" asChild>
                <Link href="/inclusive-support-hub">
                  <Heart className="h-4 w-4" /> Explore the Hub
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
              Your Journey to Belonging
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {stepDefs.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border bg-card p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand-pink font-display text-2xl font-bold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="mb-3 font-display text-xl font-bold">
                  {s.title}
                </h3>
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
        className="scroll-mt-28 bg-primary py-20 text-primary-foreground md:py-28"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-yellow">
              Our Impact
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Promises Made, Lives Changed
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
            {METRIC_DEFS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center backdrop-blur"
              >
                <p className="mb-2 font-display text-4xl font-bold text-brand-yellow md:text-5xl">
                  {m.value}
                </p>
                <p className="text-sm text-primary-foreground/80">
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
              Testimonials
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              Stories from Our Siblings
            </h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {testimonialDefs.map((row, i) => (
              <motion.div
                key={row.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                  &ldquo;{row.quote}&rdquo;
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {row.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MatchingAlgorithmFlow />

      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-pink to-brand-red" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_0,transparent_60%)] opacity-20" />
        <div className="container relative mx-auto px-4 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="mb-5 font-display text-4xl font-bold leading-tight md:text-6xl">
              Ready to Find Your Sibling?
            </h2>
            <p className="mb-10 text-lg text-primary-foreground/90">
              Join thousands of siblings around the world. Whether you need support, want to mentor, or just want to belong &mdash; there is a place for you here.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="primary" asChild>
                <Link href="/save-a-sibling">
                  <Heart className="h-4 w-4" />{" "}
                  Save a Sibling
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/match">
                  Join Now{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="tertiary"
                className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15"
                asChild
              >
                <Link href="/volunteer">
                  <HeartHandshake className="h-4 w-4" />{" "}
                  Volunteer
                </Link>
              </Button>
              <Button
                variant="tertiary"
                className="text-primary-foreground hover:bg-primary-foreground/15"
                asChild
              >
                <Link href="/corporate-partnership">
                  <Globe className="h-4 w-4" /> Partner With Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
