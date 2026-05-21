"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function HomeSafetyBanner() {
  return (
    <section
      aria-labelledby="safety-banner-title"
      className="bg-background py-10 md:py-14"
    >
      <div className="container mx-auto px-4">
        <div
          className="mx-auto flex max-w-5xl flex-col items-start gap-5 rounded-3xl border p-6 md:flex-row md:items-center md:gap-8 md:p-8"
          style={{
            backgroundColor: "#F2F2F2",
            borderColor: "rgba(0,159,175,0.25)",
          }}
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(0,159,175,0.15)" }}
          >
            <Shield
              className="h-7 w-7"
              style={{ color: "#009FAF" }}
              aria-hidden
            />
          </div>
          <div className="flex-1">
            <h2
              id="safety-banner-title"
              className="font-display mb-2 text-2xl font-bold md:text-3xl"
              style={{ color: "#009FAF" }}
            >
              Your Safety Matters
            </h2>
            <p
              className="text-sm leading-relaxed md:text-base"
              style={{ color: "#555555" }}
            >
              If you or someone you know is in crisis, help is available. You are not alone. Our verified crisis support directory connects you with trusted resources in your country.
            </p>
          </div>
          <Link
            href="/crisis"
            aria-label="Get crisis support resources"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg sm:text-base"
            style={{ backgroundColor: "#F52A3D" }}
          >
            Get Help Now <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
