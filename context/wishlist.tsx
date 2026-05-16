"use client";

import { createContext, useContext, useCallback, useState, type ReactNode } from "react";

interface WishlistContextType {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const addItem = useCallback((productId: string) =>
    setItems((prev) => (prev.includes(productId) ? prev : [...prev, productId])), []);

  const removeItem = useCallback((productId: string) =>
    setItems((prev) => prev.filter((id) => id !== productId)), []);

  const toggleItem = useCallback((productId: string) =>
    setItems((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]), []);

  const hasItem = useCallback((productId: string) => items.includes(productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, hasItem, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
