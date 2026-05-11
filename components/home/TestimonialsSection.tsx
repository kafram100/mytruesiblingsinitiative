"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { useFadeAnimations } from "@/hooks/useFadeAnimations";

const testimonials = [
  {
    quote:
      "I finally felt heard. For the first time, someone listened without judgment.",
    name: "Anonymous · Adult Safe Place",
  },
  {
    quote:
      "This saved me during the hardest week of my life. My sibling showed up when no one else did.",
    name: "Anonymous · Sibling Connect",
  },
  {
    quote:
      "As a wheelchair user, I never thought online community could feel this human.",
    name: "Anonymous · Inclusive Hub",
  },
];

export default function TestimonialsSection() {
  const { fadeUp, reduce } = useFadeAnimations();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-20 md:py-28 bg-background scroll-mt-[5.75rem]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-brand-pink font-semibold text-sm uppercase tracking-widest mb-3">
            Real Voices
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-5xl font-display font-bold"
          >
            Stories From Our Siblings
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Names are withheld to protect privacy. Every quote reflects a real
            moment someone shared with us.
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.li
              key={t.name}
              {...fadeUp}
              transition={{ delay: reduce ? 0 : i * 0.1 }}
              className="p-7 rounded-3xl bg-card border-2 border-border hover:border-brand-yellow/50 transition-all"
            >
              <div
                role="img"
                aria-label="Rated 5 out of 5 stars"
                className="flex gap-1 mb-4"
              >
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={`${i}-star-${j}`}
                    className="h-4 w-4 fill-brand-yellow text-brand-yellow"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-foreground/85 italic mb-5 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t.name}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
