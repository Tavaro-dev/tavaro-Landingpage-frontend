"use client";

import { useCart } from "@/features/booking/cart/CartProvider";
import { formatInr } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import styles from "./booking.module.css";

export function CartStickyBar() {
  const { items, count, total, open } = useCart();
  const hasItems = items.length > 0;

  return (
    <button
      type="button"
      className={`${styles["cart-float"]}${hasItems ? " show" : ""}`}
      onClick={open}
      aria-hidden={!hasItems}
      tabIndex={hasItems ? 0 : -1}
      aria-label={`Open cart, ${count} night${count === 1 ? "" : "s"} selected, total ${formatInr(total)}`}
    >
      <Icon name="bag" />
      <span className={styles["cart-float-total"]}>{formatInr(total)}</span>
      <span className={styles["cart-float-count"]}>{count}</span>
    </button>
  );
}
