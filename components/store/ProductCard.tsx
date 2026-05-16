"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart";
import { useWishlist } from "@/context/wishlist";

interface ProductCardProps {
  productId: string;
  title: string;
  price: number;
  image: string;
  slogan: string;
  colors?: string[];
  className?: string;
}

const gradients = [
  "from-brand-teal/20 to-brand-orange-hex/10",
  "from-brand-pink-hex/20 to-brand-yellow-hex/10",
  "from-brand-orange-hex/20 to-brand-pink-hex/10",
  "from-brand-yellow-hex/20 to-brand-teal/10",
  "from-brand-red-hex/20 to-brand-orange-hex/10",
];

export default function ProductCard({
  productId,
  title,
  price,
  image,
  slogan,
  colors,
  className,
}: ProductCardProps) {
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const wishlisted = hasItem(productId);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-brand-teal/10 hover:-translate-y-1",
        className
      )}
    >
      <Link href={`/store/product/${productId}`} className="block">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
            gradient
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <button
            onClick={(e) => { e.preventDefault(); toggleItem(productId); }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                wishlisted ? "fill-brand-red-hex text-brand-red-hex" : "text-gray-600"
              )}
            />
          </button>
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-dark backdrop-blur-sm">
              {slogan}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/store/product/${productId}`}>
          <h3 className="font-semibold text-gray-800 hover:text-brand-teal transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-gray-500">from ${price.toFixed(2)}</p>
        {colors && (
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <span
                key={c}
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          className="mt-auto w-full rounded-xl bg-brand-teal text-white hover:bg-brand-teal/90"
          onClick={() =>
            addItem({
              productId,
              title,
              price,
              quantity: 1,
              image,
            })
          }
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
