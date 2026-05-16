"use client";

import { Heart, Quote } from "lucide-react";

export default function EmotionalStory() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-teal/10 via-white to-brand-pink-hex/5 py-20 md:py-28">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-yellow-hex/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-pink-hex/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-teal/10">
              <Heart className="h-8 w-8 text-brand-teal" />
            </div>

            <blockquote className="relative">
              <Quote className="absolute -left-8 -top-6 h-12 w-12 text-brand-teal/20 md:-left-12" />
              <p className="font-display text-2xl leading-relaxed text-gray-800 md:text-3xl lg:text-4xl">
                &ldquo;MyTrueSiblings exists to create spaces where people feel
                seen, heard, valued, and supported.&rdquo;
              </p>
            </blockquote>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600">
              Every item you wear carries this mission. When you choose
              MyTrueSiblings merchandise, you are not just buying a product,
              you are declaring that belonging matters, that connection heals,
              and that no one should walk through life alone.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Safe Conversations", value: "50,000+" },
                { label: "Community Members", value: "12,000+" },
                { label: "Mentorship Matches", value: "3,200+" },
                { label: "Countries Reached", value: "40+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/70 p-4 text-center backdrop-blur-sm"
                >
                  <div className="font-display text-2xl font-bold text-brand-teal md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
