"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import { Icon } from "./Icon";

export function CartDrawer() {
  const { items, removeItem, setNights, total, isOpen, close } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <div className={`cart-overlay${isOpen ? " open" : ""}`} onClick={close} aria-hidden={!isOpen} />
      <aside className={`cart-drawer${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
        <div className="cart-drawer-head">
          <h3>Your Stay</h3>
          <button type="button" className="cart-close" onClick={close} aria-label="Close cart">
            <Icon name="close" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">No rooms added yet. Add a room to start planning your stay.</p>
        ) : (
          <ul className="cart-items">
            {items.map((item) => (
              <li className="cart-item" key={item.slug}>
                <div className="cart-item-media">
                  <Image src={item.image} alt="" fill sizes="80px" />
                </div>
                <div className="cart-item-body">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">{formatInr(item.pricePerNight)} / night</p>
                  <div className="cart-item-controls">
                    <div className="cart-stepper">
                      <button type="button" onClick={() => setNights(item.slug, item.nights - 1)} aria-label="Fewer nights">
                        −
                      </button>
                      <span>{item.nights} night{item.nights === 1 ? "" : "s"}</span>
                      <button type="button" onClick={() => setNights(item.slug, item.nights + 1)} aria-label="More nights">
                        +
                      </button>
                    </div>
                    <button type="button" className="cart-remove" onClick={() => removeItem(item.slug)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="cart-drawer-foot">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatInr(total)}</span>
            </div>
            <Link href="/checkout" className="btn solid" style={{ width: "100%", justifyContent: "center" }} onClick={close}>
              Book Now
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
