"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { STORE_CATEGORIES, getProductsByCategory, getCategory } from "@/lib/store";
import ProductCard from "@/components/store/ProductCard";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = getCategory(slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">Category not found</h1>
        <Link href="/store" className="rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal/90">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-teal">
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>

      <section className="container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm font-medium text-brand-teal">
            {category.subtitle}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            {category.title}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{category.description}</p>
        </div>

        {products.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-gray-500">No products found in this category yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                title={product.title}
                price={product.price}
                image={product.images[0]}
                slogan={product.slogan}
                colors={product.colors}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
