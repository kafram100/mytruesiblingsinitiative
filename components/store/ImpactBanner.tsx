"use client";

import { Heart, Users, Globe, Sparkles } from "lucide-react";

const impacts = [
  {
    icon: Heart,
    label: "Safe Spaces",
    color: "text-brand-pink-hex",
    bg: "bg-brand-pink-hex/10",
  },
  {
    icon: Users,
    label: "Youth Mentorship",
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
  },
  {
    icon: Globe,
    label: "Community Outreach",
    color: "text-brand-orange-hex",
    bg: "bg-brand-orange-hex/10",
  },
  {
    icon: Sparkles,
    label: "Emotional Wellness",
    color: "text-brand-yellow-hex",
    bg: "bg-brand-yellow-hex/10",
  },
];

export default function ImpactBanner() {
  return (
    <section className="relative bg-gradient-to-br from-brand-teal/5 via-white to-brand-pink-hex/5 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm font-medium text-brand-teal">
            <Heart className="h-3.5 w-3.5" />
            Your Purchase Creates Impact
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Every Purchase Supports
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            100% of proceeds fund safe spaces, mentorship, and community
            wellness programs worldwide.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {impacts.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-white p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <span className="font-semibold text-gray-800">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-white/70 p-4 text-center text-sm text-gray-500 backdrop-blur-sm">
          <span className="font-medium text-brand-teal">Belonging Initiatives</span>
          {" "}— Every item purchased helps fund our global belonging movement.
        </div>
      </div>
    </section>
  );
}
