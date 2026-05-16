"use client";

import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-teal" />
                <span className="font-semibold text-gray-900">Cart ({itemCount})</span>
              </div>
              <Button
                type="button"
                variant="tertiary"
                size="icon"
                aria-label="Close cart"
                onClick={closeCart}
                className="h-9 w-9 text-gray-700 hover:bg-brand-light hover:shadow-none"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300" />
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Explore our collections and find something that speaks to you.
                  </p>
                </div>
                <Button
                  asChild
                  variant="primary"
                  className="rounded-full bg-brand-teal text-white hover:bg-brand-teal/90"
                  onClick={closeCart}
                >
                  <Link href="/store">Shop The Movement</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.color}-${item.size}`}
                        className="flex gap-4 rounded-2xl border border-border/50 bg-brand-light/30 p-3"
                      >
                        <div
                          className="h-20 w-20 shrink-0 rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Link
                                  href={`/store/product/${item.productId}`}
                                  onClick={closeCart}
                                  className="text-sm font-semibold text-gray-800 hover:text-brand-teal"
                                >
                                  {item.title}
                                </Link>
                                {(item.color || item.size) && (
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {item.color && `${item.color}`}
                                    {item.color && item.size && " / "}
                                    {item.size && `${item.size}`}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="tertiary"
                                size="icon"
                                aria-label="Remove item"
                                onClick={() => removeItem(item.productId, item.color, item.size)}
                                className="h-8 w-8 shrink-0 text-gray-400 hover:bg-transparent hover:text-brand-red-hex hover:shadow-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                  updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.color, item.size)
                                }
                                aria-label="Decrease quantity"
                                className="h-7 w-7 min-w-[1.75rem] rounded-full border-gray-200 p-0 text-gray-600 hover:border-brand-teal hover:text-brand-teal"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1, item.color, item.size)
                                }
                                aria-label="Increase quantity"
                                className="h-7 w-7 min-w-[1.75rem] rounded-full border-gray-200 p-0 text-gray-600 hover:border-brand-teal hover:text-brand-teal"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="font-display text-xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Shipping calculated at checkout
                  </p>
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="mt-4 w-full rounded-full bg-brand-teal py-6 text-base text-primary-foreground shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90"
                    onClick={closeCart}
                  >
                    <Link href="/store/checkout">
                      Checkout
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span>Secure checkout</span>
                    <span>·</span>
                    <span>Apple Pay</span>
                    <span>·</span>
                    <span>Google Pay</span>
                    <span>·</span>
                    <span>PayPal</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
