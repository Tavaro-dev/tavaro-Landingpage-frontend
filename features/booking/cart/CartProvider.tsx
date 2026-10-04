"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  pricePerNight: number;
  nights: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "nights">) => void;
  removeItem: (slug: string) => void;
  setNights: (slug: string, nights: number) => void;
  clear: () => void;
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tavaro-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadCart = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // ignore malformed/unavailable storage
      }
      setHydrated(true);
    };
    loadCart();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) => (i.slug === item.slug ? { ...i, nights: i.nights + 1 } : i));
      }
      return [...prev, { ...item, nights: 1 }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const setNights: CartContextValue["setNights"] = (slug, nights) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, nights: Math.max(1, nights) } : i)));
  };

  const clear = () => setItems([]);
  const count = items.reduce((sum, i) => sum + i.nights, 0);
  const total = items.reduce((sum, i) => sum + i.nights * i.pricePerNight, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setNights,
        clear,
        count,
        total,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
