"use client";

import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import { Icon } from "./Icon";

export function CartStickyBar() {
  const { items, count, total, open } = useCart();
  const hasItems = items.length > 0;

  return (
    <button
      type="button"
      className={`cart-float${hasItems ? " show" : ""}`}
      onClick={open}
      aria-hidden={!hasItems}
      tabIndex={hasItems ? 0 : -1}
      aria-label={`Open cart, ${count} night${count === 1 ? "" : "s"} selected, total ${formatInr(total)}`}
    >
      <Icon name="bag" />
      <span className="cart-float-total">{formatInr(total)}</span>
      <span className="cart-float-count">{count}</span>
    </button>
  );
}
