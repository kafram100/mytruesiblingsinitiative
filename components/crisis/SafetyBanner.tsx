"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SafetyBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-brand-red-hex/5 via-white to-brand-teal/5 border-y border-border/30"
    >
      <div className="container mx-auto px-4 py-5 md:py-7">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-red-hex/10">
            <Shield className="h-7 w-7 text-brand-red-hex" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-gray-900 md:text-2xl">
              You Are Not Alone
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 md:text-base">
              If you are in crisis, feeling unsafe, or worried about someone,
              visit our Crisis Support page for verified emergency resources and
              guidance. Quick exit available on the Crisis Support page.
            </p>
          </div>
          <Button
            asChild
            variant="primary"
            className="shrink-0 rounded-full bg-brand-red-hex px-6 text-primary-foreground shadow-lg shadow-brand-red-hex/20 hover:bg-brand-red-hex/90"
          >
            <Link href="/crisis">
              <Shield className="h-4 w-4" />
              Open Crisis Support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
