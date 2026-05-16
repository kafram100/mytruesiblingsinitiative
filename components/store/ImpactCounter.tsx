"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  icon: string;
}

function AnimatedCounter({ end, suffix = "", label, icon }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const totalSteps = duration / step;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
    >
      <span className="text-3xl">{icon}</span>
      <div className="font-display text-3xl font-bold text-brand-teal md:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

const counters = [
  { end: 50000, suffix: "+", label: "People Supported", icon: "❤️" },
  { end: 3200, suffix: "+", label: "Mentorship Matches", icon: "🤝" },
  { end: 12000, suffix: "+", label: "Safe Conversations", icon: "💬" },
  { end: 15000, suffix: "+", label: "Community Members", icon: "🌍" },
  { end: 850, suffix: "+", label: "Sponsor A Sibling", icon: "🎗️" },
  { end: 120000, suffix: "+", label: "Donations Raised", icon: "💙" },
];

export default function ImpactCounter() {
  return (
    <section className="relative bg-gradient-to-br from-brand-teal/5 via-white to-brand-orange-hex/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Our Impact So Far
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Together, we are turning loneliness into belonging.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {counters.map((c) => (
            <AnimatedCounter key={c.label} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
