"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { useConsistentReducedMotion } from "@/hooks/useConsistentReducedMotion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type HeroVideoSlide = {
  kind: "video";
  id: string;
  poster: string;
  mp4: string;
};

type HeroImageSlide = {
  kind: "image";
  id: string;
  src: string;
  alt: string;
};

type HeroSlide = HeroVideoSlide | HeroImageSlide;

/**
 * Rotating hero backdrop: multiple videos + stills. Replace `mp4` / `src` with
 * self-hosted assets in production (see public/videos/README.md).
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    kind: "video",
    id: "hero-ocean-moments",
    poster:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1920&q=80",
    mp4:
      "https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4",
  },
  {
    kind: "image",
    id: "hero-circle-laugh",
    src:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=85",
    alt: "Group of friends sitting together, relaxed and connected",
  },
  {
    kind: "image",
    id: "hero-two-listening",
    src:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1920&q=85",
    alt: "Two people in a warm, supportive conversation",
  },
  {
    kind: "video",
    id: "hero-city-together",
    poster:
      "https://images.unsplash.com/photo-1469571486292-0bba724bfbc9?auto=format&fit=crop&w=1920&q=85",
    mp4:
      "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
  },
  {
    kind: "image",
    id: "hero-hands-community",
    src:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1920&q=85",
    alt: "Circle of people sharing stories and support together",
  },
];

const trustChips = [
  { icon: ShieldCheck, label: "Safe", color: "text-brand-yellow" },
  { icon: Heart, label: "Anonymous", color: "text-brand-pink" },
  { icon: Users, label: "Moderated", color: "text-primary" },
  { icon: Sparkles, label: "Global", color: "text-brand-yellow" },
];

/** Stagger + gentle float timings for hero cards, offset so they don't move in sync. */
const CARD_MOTION = [
  { entranceDelay: 0.15, floatDuration: 5.25, floatY: [0, -9, 0] as [number, number, number] },
  { entranceDelay: 0.32, floatDuration: 6.4, floatY: [0, -7, 0] as [number, number, number] },
  { entranceDelay: 0.5, floatDuration: 4.85, floatY: [0, -10, 0] as [number, number, number] },
];

const HERO_AUTO_ADVANCE_MS = 7000;

export default function HeroVideo() {
  const prefersReducedMotion = useConsistentReducedMotion();
  const [slide, setSlide] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const setVideoRef = useCallback((index: number, el: HTMLVideoElement | null) => {
    if (el) videoRefs.current[index] = el;
    else delete videoRefs.current[index];
  }, []);

  const goNext = useCallback(() => {
    setSlide((s) => (s + 1) % HERO_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (hoverPaused) return;
    const t = window.setInterval(goNext, HERO_AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [hoverPaused, goNext]);

  useEffect(() => {
    HERO_SLIDES.forEach((item, i) => {
      if (item.kind !== "video") return;
      const el = videoRefs.current[i];
      if (!el) return;
      if (i === slide && !prefersReducedMotion) {
        el.play().catch(() => {
          /* autoplay policies / missing source */
        });
      } else {
        el.pause();
      }
    });
  }, [slide, prefersReducedMotion]);

  useEffect(() => {
    HERO_SLIDES.forEach((item, i) => {
      if (item.kind !== "video") return;
      const el = videoRefs.current[i];
      if (!el) return;
      if (prefersReducedMotion) el.pause();
    });
  }, [prefersReducedMotion]);

  return (
    <section
      aria-labelledby="hero-heading"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      className="relative isolate overflow-hidden bg-deep-teal text-primary-foreground min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100svh-5.75rem)]"
    >
      <div
        className="absolute inset-0 -z-20"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hero photos and video"
      >
        {HERO_SLIDES.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === slide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={i !== slide}
          >
            {item.kind === "video" ? (
              <video
                ref={(el) => setVideoRef(i, el)}
                className="h-full w-full object-cover"
                poster={item.poster}
                autoPlay={false}
                muted
                loop
                playsInline
                preload={i === slide ? "metadata" : "none"}
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src={item.mp4} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={item.src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-deep-teal/85 via-deep-teal/60 to-deep-teal/90"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-14 items-center justify-start pl-3 sm:flex md:pl-5">
        <Button
          type="button"
          variant="tertiary"
          size="icon"
          onClick={goPrev}
          aria-label="Previous hero slide"
          className="pointer-events-auto h-11 w-11 border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-lg backdrop-blur-md hover:bg-primary-foreground/20 hover:shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-14 items-center justify-end pr-3 sm:flex md:pr-5">
        <Button
          type="button"
          variant="tertiary"
          size="icon"
          onClick={goNext}
          aria-label="Next hero slide"
          className="pointer-events-auto h-11 w-11 border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-lg backdrop-blur-md hover:bg-primary-foreground/20 hover:shadow-lg"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>

      <div className="container relative z-0 mx-auto px-4 pt-12 md:pt-20 pb-28 md:pb-32 grid lg:grid-cols-12 gap-10 items-center min-h-[calc(100svh-3.75rem)] md:min-h-[calc(100svh-5.75rem)]">
        {/* LEFT: narrative + CTAs */}
        <div className="lg:col-span-7 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] mb-6">
            <Sparkles
              className="h-3 w-3 text-brand-yellow"
              aria-hidden="true"
            />
            A Global Safe Space
          </p>

          <h1
            id="hero-heading"
            className="font-display font-bold leading-[1.04] mb-5 text-5xl md:text-6xl xl:text-7xl"
          >
            Where Strangers Become{" "}
            <span className="bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink bg-clip-text text-transparent">
              Siblings
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-2 max-w-xl">
            A global safe space built on love, belonging, and real human
            connection.
          </p>
          <p className="italic text-primary-foreground/75 mb-8 max-w-xl">
            You are seen. You are heard. You are not alone.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-brand-orange to-brand-red text-primary-foreground hover:opacity-95 rounded-full px-7 shadow-lg shadow-brand-red/20"
              asChild
            >
              <Link href="/match">
                <UserRoundSearch className="h-4 w-4" aria-hidden="true" />
                Find Your Sibling Circle
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/15 backdrop-blur rounded-full px-6 shadow-md"
              asChild
            >
              <Link href="/crisis">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Talk to Someone Now
              </Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/85">
            {trustChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-1.5"
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${chip.color}`}
                    aria-hidden="true"
                  />
                  <span>{chip.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT: floating notification cards (lg+ only) */}
        <aside
          aria-label="Live community moments"
          className="hidden lg:flex lg:col-span-5 flex-col gap-4 max-w-sm ml-auto"
        >
          <motion.div
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              x: prefersReducedMotion ? 0 : 44,
              scale: prefersReducedMotion ? 1 : 0.92,
              rotate: prefersReducedMotion ? 0 : -1.2,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: prefersReducedMotion ? 0 : CARD_MOTION[0].floatY,
              scale: 1,
              rotate: prefersReducedMotion ? 0 : 0.35,
            }}
            transition={{
              opacity: {
                duration: 0.55,
                delay: CARD_MOTION[0].entranceDelay,
                ease: "easeOut",
              },
              x: {
                type: "spring",
                stiffness: 90,
                damping: 18,
                delay: CARD_MOTION[0].entranceDelay,
              },
              scale: {
                type: "spring",
                stiffness: 90,
                damping: 18,
                delay: CARD_MOTION[0].entranceDelay,
              },
              rotate: {
                type: "spring",
                stiffness: 70,
                damping: 20,
                delay: CARD_MOTION[0].entranceDelay,
              },
              y: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: CARD_MOTION[0].floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: CARD_MOTION[0].entranceDelay + 0.5,
                  },
            }}
            whileHover={
              prefersReducedMotion
                ? undefined
                : { y: -4, rotate: 0, transition: { duration: 0.25 } }
            }
            className="rounded-2xl bg-card/90 backdrop-blur border border-border p-4 shadow-xl flex items-start gap-3 text-foreground will-change-transform motion-reduce:transform-none"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-primary-foreground font-display font-bold"
            >
              A
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">
                Matched with Amina
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sibling Circle · Lagos
              </p>
              <p className="text-xs italic text-foreground/75 mt-1.5">
                &ldquo;I&apos;m so glad we connected today&nbsp;💛&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              x: prefersReducedMotion ? 0 : 56,
              scale: prefersReducedMotion ? 1 : 0.9,
              rotate: prefersReducedMotion ? 0 : 1.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: prefersReducedMotion ? 0 : CARD_MOTION[1].floatY,
              scale: 1,
              rotate: prefersReducedMotion ? 0 : -0.4,
            }}
            transition={{
              opacity: {
                duration: 0.55,
                delay: CARD_MOTION[1].entranceDelay,
                ease: "easeOut",
              },
              x: {
                type: "spring",
                stiffness: 82,
                damping: 18,
                delay: CARD_MOTION[1].entranceDelay,
              },
              scale: {
                type: "spring",
                stiffness: 82,
                damping: 18,
                delay: CARD_MOTION[1].entranceDelay,
              },
              rotate: {
                type: "spring",
                stiffness: 65,
                damping: 20,
                delay: CARD_MOTION[1].entranceDelay,
              },
              y: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: CARD_MOTION[1].floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: CARD_MOTION[1].entranceDelay + 0.5,
                  },
            }}
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    y: -5,
                    rotate: 0,
                    scale: 1.03,
                    transition: { duration: 0.22 },
                  }
            }
            className="rounded-2xl bg-primary text-primary-foreground p-4 shadow-xl will-change-transform motion-reduce:transform-none"
          >
            <Heart
              className="h-5 w-5 mb-2"
              aria-hidden="true"
              fill="currentColor"
            />
            <p className="font-display font-bold leading-tight">
              You are not alone.
            </p>
            {/* TODO(presence): wire to live count from /api/presence; until
                we have audited numbers we ship an honest qualifier. */}
            <p className="text-sm text-primary-foreground/85 mt-1">
              Real humans, ready right now
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              x: prefersReducedMotion ? 0 : 50,
              scale: prefersReducedMotion ? 1 : 0.91,
              rotate: prefersReducedMotion ? 0 : -2.2,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: prefersReducedMotion ? 0 : CARD_MOTION[2].floatY,
              scale: 1,
              rotate: prefersReducedMotion ? 0 : 0.65,
            }}
            transition={{
              opacity: {
                duration: 0.55,
                delay: CARD_MOTION[2].entranceDelay,
                ease: "easeOut",
              },
              x: {
                type: "spring",
                stiffness: 88,
                damping: 18,
                delay: CARD_MOTION[2].entranceDelay,
              },
              scale: {
                type: "spring",
                stiffness: 88,
                damping: 18,
                delay: CARD_MOTION[2].entranceDelay,
              },
              rotate: {
                type: "spring",
                stiffness: 72,
                damping: 20,
                delay: CARD_MOTION[2].entranceDelay,
              },
              y: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: CARD_MOTION[2].floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: CARD_MOTION[2].entranceDelay + 0.5,
                  },
            }}
            whileHover={
              prefersReducedMotion
                ? undefined
                : { y: -4, rotate: 0, transition: { duration: 0.24 } }
            }
            className="rounded-2xl bg-card/90 backdrop-blur border border-border p-4 shadow-xl text-foreground will-change-transform motion-reduce:transform-none"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange mb-1.5 flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-brand-orange motion-safe:animate-pulse"
              />
              Live Circle
            </p>
            <p className="font-display font-bold leading-tight">
              Adult Safe Place · Healing Together
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Listening together · moderated by Grace
            </p>
          </motion.div>
        </aside>
      </div>

      {/* Scroll + carousel indicators */}
      <div className="pointer-events-none absolute bottom-5 inset-x-0 z-20 flex flex-col items-center gap-3 px-4 sm:bottom-6">
        <Button
          variant="tertiary"
          asChild
          className="pointer-events-auto h-auto rounded-full border-transparent px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground/85 shadow-none hover:bg-transparent hover:text-brand-yellow hover:shadow-none motion-safe:hover:-translate-y-0.5"
        >
          <a href="#pillars">
            <span className="inline-flex items-center gap-1.5">
              Scroll to explore
              <ChevronDown
                className="h-3 w-3 motion-safe:animate-bounce"
                aria-hidden="true"
              />
            </span>
          </a>
        </Button>
        <div
          className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-2"
          role="tablist"
          aria-label="Hero slide"
        >
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            aria-label="Previous hero slide"
            onClick={goPrev}
            className="h-9 w-9 shrink-0 border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-md backdrop-blur-md hover:bg-primary-foreground/25 sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          {HERO_SLIDES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={`Show slide ${i + 1} of ${HERO_SLIDES.length}`}
              onClick={() => setSlide(i)}
              className={`rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-110 motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-deep-teal ${
                i === slide
                  ? "h-2.5 w-8 bg-brand-yellow"
                  : "h-2.5 w-2.5 bg-primary-foreground/45 hover:bg-primary-foreground/70"
              }`}
            />
          ))}
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            aria-label="Next hero slide"
            onClick={goNext}
            className="h-9 w-9 shrink-0 border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-md backdrop-blur-md hover:bg-primary-foreground/25 sm:hidden"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
