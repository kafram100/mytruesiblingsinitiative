"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingBag, XCircle, Loader2, CreditCard, Lock } from "lucide-react";
import { useState, Suspense } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");
  const { items, total, itemCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (success === "true") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
        <p className="max-w-md text-gray-600">
          Thank you for your order. You will receive a confirmation email shortly with your order details.
        </p>
        <Button asChild variant="primary" className="rounded-full bg-brand-teal text-white hover:bg-brand-teal/90">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (cancelled === "true") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <XCircle className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Checkout Cancelled</h1>
        <p className="max-w-md text-gray-600">Your order was not placed. Your cart items are still saved.</p>
        <div className="flex gap-3">
          <Button asChild variant="primary" className="rounded-full bg-brand-teal text-white hover:bg-brand-teal/90">
            <Link href="/store/checkout">Try Again</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="max-w-md text-gray-600">Add some items to your cart before checking out.</p>
        <Button asChild variant="primary" className="rounded-full bg-brand-teal text-white hover:bg-brand-teal/90">
          <Link href="/store">Shop The Movement</Link>
        </Button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }
      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-teal">
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>

      <div className="container mx-auto max-w-3xl px-4 pb-24">
        <h1 className="font-display text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-gray-600">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4 rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
              <div className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {(item.color || item.size) && (
                    <p className="text-xs text-gray-500">
                      {item.color}{item.color && item.size ? " / " : ""}{item.size}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-600">Subtotal</span>
            <span className="font-display text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Shipping calculated at checkout</p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={loading}
            variant="primary"
            size="lg"
            className="mt-6 w-full rounded-full bg-brand-teal py-6 text-base text-white shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay ${total.toFixed(2)}
              </>
            )}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure checkout powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
