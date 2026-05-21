"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Check, Share2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductById, ALL_PRODUCTS } from "@/lib/store";
import { useCart } from "@/context/cart";
import { useWishlist } from "@/context/wishlist";

interface DbProduct {
  id: string;
  title: string;
  price: number;
  comparePrice: number | null;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const staticProduct = getProductById(slug);
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();

  const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
  const [loading, setLoading] = useState(!staticProduct);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (staticProduct) return;
    fetch(`/api/store/products/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.id) setDbProduct(data);
        else if (!staticProduct) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, staticProduct]);

  const product = staticProduct || null;
  const db = dbProduct;

  const imageUrl = product ? product.images[0] : db?.imageUrl || "";
  const productId = product?.id || db?.id || "";
  const title = product?.title || db?.title || "";
  const price = product?.price ?? db?.price ?? 0;
  const description = product?.description || db?.description || "";
  const category = product?.category || db?.category || "";
  const slogan = product?.slogan;
  const colors = product?.colors;
  const sizes = product?.sizes;
  const material = product?.material;
  const isBestseller = product?.isBestseller;
  const comparePrice = product?.comparePrice ?? db?.comparePrice;

  const [selectedColor, setSelectedColor] = useState(colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes?.[2] || sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-teal border-t-transparent" />
      </div>
    );
  }

  if (notFound || (!product && !db)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">Product not found</h1>
        <Button asChild variant="primary">
          <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === category && p.id !== productId
  ).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId,
      title,
      price,
      quantity,
      image: imageUrl,
      color: selectedColor,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const wishlisted = hasItem(productId);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Link
          href={`/store/categories/${category}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-teal"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {category}
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal/10 via-white to-brand-pink-hex/5">
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            {isBestseller && (
              <span className="absolute left-4 top-4 rounded-full bg-brand-orange-hex px-3 py-1 text-xs font-bold text-white shadow-lg">
                Best Seller
              </span>
            )}
            <Button
              type="button"
              variant="tertiary"
              size="icon"
              onClick={() => toggleItem(productId)}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 h-10 w-10 rounded-full border-0 bg-white/80 shadow-lg backdrop-blur-sm hover:scale-110 hover:bg-white hover:shadow-lg"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  wishlisted ? "fill-brand-red-hex text-brand-red-hex" : "text-gray-600"
                )}
              />
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              {slogan && (
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                  {slogan}
                </div>
              )}
              <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 capitalize">{category}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-brand-teal">
                ${price.toFixed(2)}
              </span>
              {comparePrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-base leading-relaxed text-gray-600">{description}</p>

            {material && (
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Material:</span> {material}
              </p>
            )}

            {colors && colors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-800">Color: {selectedColor}</p>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant="secondary"
                      onClick={() => setSelectedColor(c)}
                      className={cn(
                        "h-8 w-8 min-w-[2rem] rounded-full border-2 p-0 shadow-sm motion-safe:hover:-translate-y-0",
                        selectedColor === c ? "scale-110 border-brand-teal shadow-md" : "border-gray-200 hover:scale-105"
                      )}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes && sizes.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-800">Size: {selectedSize}</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant="secondary"
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium shadow-none motion-safe:hover:-translate-y-0",
                        selectedSize === s
                          ? "border-brand-teal bg-brand-teal/5 text-brand-teal hover:border-brand-teal hover:bg-brand-teal/10 hover:text-brand-teal"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl border-2 border-gray-200">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-10 rounded-none rounded-l-[10px] border-0 shadow-none hover:bg-transparent hover:text-brand-teal"
                >
                  -
                </Button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="h-10 w-10 rounded-none rounded-r-[10px] border-0 shadow-none hover:bg-transparent hover:text-brand-teal"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className={cn(
                  "flex-1 rounded-full px-8 py-6 text-base font-bold",
                  added
                    ? "bg-green-500 text-primary-foreground hover:bg-green-500/90"
                    : "bg-brand-teal text-primary-foreground hover:bg-brand-teal/90 shadow-xl shadow-brand-teal/20"
                )}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    Add to Cart: ${(price * quantity).toFixed(2)}
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-6 py-6"
                onClick={() => toggleItem(productId)}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    wishlisted ? "fill-brand-red-hex text-brand-red-hex" : ""
                  )}
                />
              </Button>
              <Button
                type="button"
                variant="tertiary"
                size="lg"
                onClick={handleShare}
                className="rounded-full px-6 py-6 shadow-none hover:shadow-sm"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="rounded-2xl bg-brand-light/70 p-4 text-center text-sm text-gray-500">
              <span className="font-medium text-brand-teal">100% of proceeds</span>{" "}
              fund safe spaces, mentorship, and belonging initiatives worldwide.
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="border-t border-border/50 bg-brand-light/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-gray-900">You May Also Like</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/store/product/${rp.id}`}>
                  <div className="group overflow-hidden rounded-2xl border border-border/50 bg-white transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-square bg-gradient-to-br from-brand-teal/10 to-brand-pink-hex/10">
                      <div
                        className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${rp.images[0]})` }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-brand-teal">{rp.slogan}</p>
                      <h3 className="mt-1 font-semibold text-gray-800">{rp.title}</h3>
                      <p className="mt-1 font-bold text-gray-900">${rp.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-brand-teal/5 via-white to-brand-pink-hex/5 py-12 text-center">
        <div className="container mx-auto px-4">
          <Heart className="mx-auto h-8 w-8 text-brand-pink-hex" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            &ldquo;My True Siblings Initiative exists to create spaces where people feel seen, heard, valued, and supported.&rdquo;
          </p>
          <Button asChild variant="primary" className="mt-6 rounded-full bg-brand-orange-hex text-white hover:bg-brand-orange-hex/90">
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
