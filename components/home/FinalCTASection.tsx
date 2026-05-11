"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake } from "lucide-react";

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
          <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="primary"
              size="lg"
              className="group w-full justify-center gap-2 rounded-full !bg-card !text-primary px-7 shadow-xl shadow-black/25 hover:!bg-card/92 hover:shadow-2xl hover:shadow-black/25"
              asChild
            >
              <Link href="/match">
                Join Now
                <ArrowRight
                  className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="group w-full justify-center gap-2 rounded-full border-white/35 !bg-white/12 px-7 !text-white shadow-md backdrop-blur hover:border-white/50 hover:!bg-white/20 hover:!text-white hover:shadow-lg"
              asChild
            >
              <Link href="/volunteer">
                Become a Volunteer
                <HeartHandshake
                  className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-px"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
