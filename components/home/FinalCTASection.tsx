"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFadeAnimations } from "@/hooks/useFadeAnimations";

export default function FinalCTASection() {
  const { fadeUp } = useFadeAnimations();

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-24 md:py-32 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-brand-orange via-brand-pink to-brand-red"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,white_0,transparent_60%)]"
      />
      <div className="container mx-auto px-4 relative text-center text-primary-foreground">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <h2
            id="final-cta-heading"
            className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight"
          >
            You don&apos;t have to do life alone.
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-10">
            Join a global movement turning loneliness into belonging, one
            sibling at a time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-brand-yellow text-foreground hover:bg-brand-yellow/90"
              asChild
            >
              <Link href="/save-a-sibling">
                <Heart className="h-4 w-4" aria-hidden="true" />
                Save A Sibling
              </Link>
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="!bg-card !text-primary hover:!bg-card/90"
              asChild
            >
              <Link href="/match">
                Join Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-white/35 !bg-white/12 !text-white backdrop-blur hover:border-white/50 hover:!bg-white/20 hover:!text-white"
              asChild
            >
              <Link href="/volunteer">
                Become a Volunteer
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-white/35 !bg-white/12 !text-white backdrop-blur hover:border-white/50 hover:!bg-white/20 hover:!text-white"
              asChild
            >
              <Link href="/corporate-partnership">
                Partner With Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
