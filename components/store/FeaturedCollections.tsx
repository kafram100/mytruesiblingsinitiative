"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "Belonging Collection",
    subtitle: "You Are Not Alone",
    gradient: "from-brand-teal to-brand-teal/80",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    href: "/store/categories/community",
  },
  {
    title: "Healing Through Connection",
    subtitle: "Love Listens",
    gradient: "from-brand-pink-hex to-brand-pink-hex/80",
    image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=800&q=80",
    href: "/store/categories/wellness",
  },
  {
    title: "Safe Space Collection",
    subtitle: "Built For Belonging",
    gradient: "from-brand-orange-hex to-brand-orange-hex/80",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?w=800&q=80",
    href: "/store/categories/home-living",
  },
  {
    title: "Inclusive Humanity",
    subtitle: "Seen. Heard. Valued.",
    gradient: "from-brand-yellow-hex to-brand-yellow-hex/80",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80",
    href: "/store/categories/inclusive",
  },
  {
    title: "Youth Voices",
    subtitle: "Hope Lives Here",
    gradient: "from-brand-red-hex to-brand-red-hex/80",
    image: "https://images.unsplash.com/photo-1478115043630-ace4b9e100e4?w=800&q=80",
    href: "/store/categories/youth",
  },
  {
    title: "Hope Collection",
    subtitle: "We Rise Together",
    gradient: "from-brand-teal to-brand-pink-hex",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
    href: "/store/categories/hope",
  },
];

export default function FeaturedCollections() {
  return (
    <section id="collections" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Wear The Movement
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Every piece tells a story of belonging, hope, and human connection.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${col.image})` }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${col.gradient} opacity-80`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {col.subtitle}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    {col.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
