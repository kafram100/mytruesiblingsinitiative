"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LifeBuoy,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const trackHero = () => {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: "crisis_support_hero_click" });
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1920&q=80",
];

const HERO_ALTS = [
  "People embracing in a warm group hug",
  "A supportive conversation between two people",
  "Friends laughing together outdoors",
  "A diverse community gathering",
  "Someone receiving a comforting hand on their shoulder",
] as const;

export default function HeroVideo() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % HERO_IMAGES.length),
      7000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-deep-teal">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={idx}
          src={HERO_IMAGES[idx]}
          alt={HERO_ALTS[idx]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-24 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white lg:col-span-7"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-brand-yellow" aria-hidden />{" "}
              Safe Space
            </span>
            <h1 className="mb-6 font-display text-4xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
              Where Strangers Become{" "}
              <span className="bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink bg-clip-text text-transparent">
                Siblings
              </span>
            </h1>
            <p className="mb-9 max-w-xl text-base leading-relaxed text-white/90 md:text-xl">
              A global safe space for emotional support, mentorship, and belonging. You are not alone.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="animate-pulse-soft rounded-full bg-gradient-to-r from-brand-orange via-brand-pink to-brand-red px-7 font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                asChild
              >
                <Link href="/match">
                  <Users className="h-4 w-4" /> Find Your Circle
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/35 bg-transparent px-7 font-bold text-white backdrop-blur-md hover:bg-white hover:text-foreground"
                asChild
              >
                <Link href="/adult-safe-place">
                  <Shield className="h-4 w-4" /> Enter Safe Space
                </Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/crisis"
                onClick={trackHero}
                aria-label="Get urgent crisis support"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#F52A3D] px-6 py-3 font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                <LifeBuoy className="h-5 w-5 shrink-0" /> Need Help Now?
              </Link>
              <div className="flex min-w-0 flex-col text-xs leading-snug text-white/80">
                <Link
                  href="/crisis"
                  onClick={trackHero}
                  className="inline-flex w-fit shrink-0 items-center whitespace-nowrap font-semibold underline underline-offset-2 hover:text-brand-yellow"
                >
                  Crisis support resources
                </Link>
                <span className="mt-0.5 max-w-xs text-white/70">
                  Verified hotlines &amp; local help worldwide
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-widest text-white/70">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand-yellow" aria-hidden />{" "}
                Safe &amp; Trusted
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-brand-pink" aria-hidden />{" "}
                Completely Anonymous
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-brand-orange" aria-hidden />{" "}
                Moderated Community
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles
                  className="h-3.5 w-3.5 text-brand-yellow"
                  aria-hidden
                />{" "}
                Global &amp; Free
              </span>
            </div>
          </motion.div>

          <div className="relative hidden h-[480px] lg:col-span-5 lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="animate-float absolute right-0 top-4 w-72 rounded-2xl border border-background/40 bg-background/95 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-orange font-bold text-primary-foreground">
                  A
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Matched with Amina
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sibling Circle &middot; Lagos
                  </p>
                </div>
              </div>
              <p className="text-xs italic text-foreground/80">
                &ldquo;I finally found people who truly listen.&rdquo;
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="animate-float absolute right-20 top-44 w-64 rounded-2xl bg-gradient-to-br from-deep-teal to-primary p-4 text-primary-foreground shadow-2xl"
              style={{ animationDelay: "1.2s" }}
            >
              <Heart className="mb-2 h-5 w-5 text-brand-yellow" aria-hidden />
              <p className="font-display text-base font-bold leading-snug">
                You Are Not Alone
              </p>
              <p className="mt-1 text-xs text-primary-foreground/80">
                2,847 siblings online now
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="animate-float absolute bottom-8 right-12 w-72 rounded-2xl border border-background/40 bg-background/95 p-5 shadow-2xl backdrop-blur-xl"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                  Live Circle Now
                </p>
              </div>
              <p className="mb-1 text-sm font-bold text-foreground">
                Adult Safe Place &middot; Healing Circle
              </p>
              <p className="text-xs text-muted-foreground">
                Listening with grace &mdash; join anytime
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-xs uppercase tracking-widest text-white/65 md:block">
        Scroll to explore
      </div>
    </section>
  );
}
