"use client";

import { useState, useEffect } from "react";
import { Loader2, Package } from "lucide-react";
import ProductCard from "./ProductCard";

interface DbProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export default function AllProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/store/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          setProducts(
            data.products
              .filter((p: { imageUrl?: string }) => p.imageUrl)
              .map((p: { id: string; title: string; price: number; imageUrl: string }) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                imageUrl: p.imageUrl,
              }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            All Products
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Every purchase supports safe spaces and belonging initiatives.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              title={product.title}
              price={product.price}
              image={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
