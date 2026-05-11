"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accessibility,
  Armchair,
  ArrowRight,
  Brain,
  Ear,
  Eye,
  Globe,
  HeartHandshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFadeAnimations } from "@/hooks/useFadeAnimations";

const PHOTO_INCLUSIVE =
  "https://images.unsplash.com/photo-1626278664285-f796b9ee7806?auto=format&fit=crop&w=1200&q=80";

const inclusiveFeatures = [
  { icon: Armchair, label: "Mobility & Physical" },
  { icon: Ear, label: "Hearing Support" },
  { icon: Eye, label: "Vision Support" },
  { icon: Brain, label: "Neurodiversity" },
  { icon: HeartHandshake, label: "Caregiver Network" },
  { icon: Globe, label: "Global Resources" },
];

export default function InclusiveHubSection() {
  const { slideLeft, slideRight, scaleIn, reduce } = useFadeAnimations();

  return (
    <section
      aria-labelledby="inclusive-heading"
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div {...slideLeft} className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={PHOTO_INCLUSIVE}
                alt="A wheelchair user in warm conversation, belonging without barriers"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-deep-teal/70 via-transparent to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5 text-background">
                <p className="text-xs uppercase tracking-widest text-brand-yellow font-bold mb-1">
                  Real voices
                </p>
                <p className="font-display text-xl italic">
                  &ldquo;I found my people.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...slideRight} className="order-1 lg:order-2">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              Inclusive Support Hub
            </p>
            <h2
              id="inclusive-heading"
              className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight"
            >
              Belonging Without Barriers
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Accessibility first tools, disability specific communities,
              caregiver support, opportunity access, and verified resources,
              designed with, not for, our community.
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-7">
              {inclusiveFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.li
                    key={f.label}
                    {...scaleIn}
                    transition={{ delay: reduce ? 0 : i * 0.05 }}
                    className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-brand-yellow/10 border text-center"
                  >
                    <Icon
                      className="h-5 w-5 text-primary mx-auto mb-1.5"
                      aria-hidden="true"
                    />
                    <p className="text-xs font-semibold leading-tight">
                      {f.label}
                    </p>
                  </motion.li>
                );
              })}
            </ul>
            <Button
              variant="primary"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7"
              asChild
            >
              <Link href="/inclusive-support-hub">
                <Accessibility className="h-4 w-4" aria-hidden="true" />
                Belong Without Barriers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
