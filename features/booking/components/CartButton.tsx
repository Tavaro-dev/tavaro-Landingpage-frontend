"use client";

import { useCart } from "@/features/booking/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";

export function CartButton({ className }: { className?: string }) {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      className={`cart-button ${className ?? ""}`.trim()}
      onClick={open}
      aria-label={`Open cart, ${count} night${count === 1 ? "" : "s"} selected`}
    >
      <Icon name="bag" />
      {count > 0 && <span className="cart-count">{count}</span>}
    </button>
  );
}
