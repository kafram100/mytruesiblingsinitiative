"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { STORE_CATEGORIES } from "@/lib/store";

export default function CategoryGrid() {
  const [filter, setFilter] = useState("all");

  const categories = STORE_CATEGORIES;
  const filtered = filter === "all"
    ? categories
    : categories.filter((c) => {
        const collectionSlugs = ["hope", "community", "youth", "inclusive", "gifts"];
        const productSlugs = ["apparel", "wellness", "journals", "accessories", "home-living", "tech"];
        if (filter === "collections") return collectionSlugs.includes(c.slug);
        return productSlugs.includes(c.slug);
      });

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Find the perfect piece that speaks to your story.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {(["all", "collections", "products"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                filter === f
                  ? "bg-brand-teal text-white shadow-md"
                  : "bg-brand-light text-gray-600 hover:bg-gray-200"
              )}
            >
              {f === "all" ? "All" : f === "collections" ? "Collections" : "Products"}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cat) => (
            <Link
              key={cat.slug}
              href={`/store/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {cat.subtitle}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">{cat.productCount} products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
