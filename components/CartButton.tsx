"use client";

import { useCart } from "@/lib/cart";
import { Icon } from "./Icon";

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
