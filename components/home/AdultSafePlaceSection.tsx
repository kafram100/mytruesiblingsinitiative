"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  DoorOpen,
  EyeOff,
  HeartHandshake,
  MessageCircle,
  PhoneCall,
  ShieldAlert,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFadeAnimations } from "@/hooks/useFadeAnimations";

const PHOTO_ADULT =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80";

const adultFeatures = [
  { icon: Users, label: "Emotional Support Circles" },
  { icon: MessageCircle, label: "Private one on one conversations" },
  { icon: EyeOff, label: "Anonymous Mode" },
  { icon: HeartHandshake, label: "Relationship & Life Support" },
  { icon: ShieldAlert, label: "Crisis Support Button" },
];

export default function AdultSafePlaceSection() {
  const { slideLeft, slideRight } = useFadeAnimations();

  return (
    <section
      aria-labelledby="adult-safe-place-heading"
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-brand-pink/10 via-background to-primary/10"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div {...slideLeft}>
            <p className="text-brand-pink font-semibold text-sm uppercase tracking-widest mb-3">
              Adult Safe Place · 18+
            </p>
            <h2
              id="adult-safe-place-heading"
              className="text-3xl md:text-5xl font-display font-bold mb-5 leading-tight"
            >
              A Safe Place for Adults to Be Heard
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Confidential. Anonymous if you wish. Always human. A sanctuary for
              relationships, life, healing, and identity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                className="bg-brand-pink text-primary-foreground hover:bg-brand-pink/90"
                asChild
              >
                <Link href="/adult-safe-place">
                  <DoorOpen className="h-4 w-4" aria-hidden="true" />
                  Enter Safe Space
                </Link>
              </Button>
              {/* QW #2: Crisis button points to the dedicated /crisis page. */}
              <Button variant="destructive" className="bg-brand-red text-primary-foreground hover:bg-brand-red/90" asChild>
                <Link href="/crisis">
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  Crisis Support
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div {...slideRight} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={PHOTO_ADULT}
                alt="Two adults in a quiet, supportive conversation, being heard without judgment"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5 text-background">
                <p className="text-xs uppercase tracking-widest text-brand-yellow font-bold mb-1">
                  Real moments
                </p>
                <p className="font-display text-xl italic">
                  &ldquo;I finally felt heard.&rdquo;
                </p>
              </div>
            </div>
            <ul className="hidden md:grid grid-cols-2 gap-2 mt-3">
              {adultFeatures.slice(0, 4).map((f) => {
                const Icon = f.icon;
                return (
                  <li
                    key={f.label}
                    className="p-3 rounded-xl bg-card border flex items-center gap-2"
                  >
                    <Icon
                      className="h-4 w-4 text-brand-pink shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-xs font-semibold leading-tight">
                      {f.label}
                    </p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
