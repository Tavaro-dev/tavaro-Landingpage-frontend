"use client";

import { useCart } from "@/features/booking/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";

export function CartButton({ className }: { className?: string }) {
  const { count, open, hydrated } = useCart();

  return (
    <button
      type="button"
      className={`cart-button ${className ?? ""}`.trim()}
      onClick={open}
      aria-label={`Open cart, ${hydrated ? count : 0} night${(hydrated ? count : 0) === 1 ? "" : "s"} selected`}
      suppressHydrationWarning
    >
      <Icon name="bag" />
      {hydrated && count > 0 && <span className="cart-count">{count}</span>}
    </button>
  );
}
