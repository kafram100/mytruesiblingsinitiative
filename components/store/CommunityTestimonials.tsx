"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Community Member",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    quote:
      "Wearing this hoodie reminds me every day that I belong somewhere. The message on my sleeve gives me courage when I feel invisible.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Mentorship Program",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    quote:
      "I bought the journal for my sister who was struggling. She writes in it every night. Small gestures of connection matter more than we know.",
    rating: 5,
  },
  {
    name: "Amara O.",
    role: "Youth Ambassador",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    quote:
      "The 'You Are Not Alone' tee started so many conversations at my school. People actually stop me to talk about mental health. It's powerful.",
    rating: 5,
  },
  {
    name: "David L.",
    role: "Safe Space Facilitator",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    quote:
      "I gift MyTrueSiblings merch to everyone I mentor. It's a symbol that says 'I see you, I hear you, and you matter.' That changes lives.",
    rating: 5,
  },
];

export default function CommunityTestimonials() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            From Our Community
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Real stories from siblings around the world.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group rounded-3xl border border-border/50 bg-gradient-to-br from-white to-brand-light/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 md:p-8"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-yellow-hex text-brand-yellow-hex"
                  />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${t.image})` }}
                />
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
