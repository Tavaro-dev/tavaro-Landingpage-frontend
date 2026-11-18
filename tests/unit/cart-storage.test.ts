import { describe, expect, it } from "vitest";
import { parseStoredCart } from "../../features/booking/cart/CartProvider";

const item = { slug: "suite", name: "Suite", image: "/x.jpg", pricePerNight: 32000, nights: 2 };

describe("parseStoredCart", () => {
  it("keeps a valid cart, without extra fields", () => {
    expect(parseStoredCart(JSON.stringify([{ ...item, extra: 1 }]))).toEqual([item]);
    expect(parseStoredCart("[]")).toEqual([]);
  });
  it("drops the whole cart when anything is wrong", () => {
    for (const bad of [{ ...item, slug: "" }, { ...item, nights: 0 }, { ...item, nights: 1.5 }, { ...item, pricePerNight: -1 }, { ...item, name: 3 }, null]) {
      expect(parseStoredCart(JSON.stringify([item, bad]))).toBeNull();
    }
    expect(parseStoredCart('{"slug":"suite"}')).toBeNull();
  });
});
