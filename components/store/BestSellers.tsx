"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ALL_PRODUCTS } from "@/lib/store";
import { Loader2 } from "lucide-react";

interface DisplayProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  slogan?: string;
  colors?: string[];
}

const hardcoded: DisplayProduct[] = ALL_PRODUCTS.filter((p) => p.isBestseller).map((p) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  image: p.images[0],
  slogan: p.slogan,
  colors: p.colors,
}));

export default function BestSellers() {
  const [dbProducts, setDbProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/store/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          setDbProducts(
            data.products
              .filter((p: { imageUrl?: string }) => p.imageUrl)
              .slice(0, 4)
              .map((p: { id: string; title: string; price: number; imageUrl: string }) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                image: p.imageUrl,
              }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayProducts = [...hardcoded.slice(0, 4), ...dbProducts].slice(0, 8);

  return (
    <section className="bg-brand-light/50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange-hex/10 px-4 py-1.5 text-sm font-medium text-brand-orange-hex">
            Most Loved
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Best Sellers
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Worn and loved by the My True Siblings Initiative community worldwide.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading && (
            <div className="col-span-full flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading &&
            displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                slogan={product.slogan}
                colors={product.colors}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
