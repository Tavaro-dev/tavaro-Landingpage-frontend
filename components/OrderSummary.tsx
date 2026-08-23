import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import type { Enhancement } from "@/lib/enhancements";

export function OrderSummary({ selectedEnhancements }: { selectedEnhancements: Enhancement[] }) {
  const { items, total: roomTotal } = useCart();
  const enhancementsTotal = selectedEnhancements.reduce((sum, e) => sum + e.price, 0);
  const subtotal = roomTotal + enhancementsTotal;
  const taxes = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + taxes;

  return (
    <div className="order-summary">
      <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
        Tavaro Resorts, Kokapet
      </p>

      <p className="order-summary-label">Stay</p>
      <ul className="order-summary-items">
        {items.map((item) => (
          <li key={item.slug}>
            <div>
              <p>{item.name}</p>
              <p className="order-summary-muted">
                {item.nights} night{item.nights === 1 ? "" : "s"}
              </p>
            </div>
            <span>{formatInr(item.pricePerNight * item.nights)}</span>
          </li>
        ))}
      </ul>

      {selectedEnhancements.length > 0 && (
        <>
          <p className="order-summary-label">Enhancements</p>
          <ul className="order-summary-items">
            {selectedEnhancements.map((e) => (
              <li key={e.id}>
                <p>{e.name}</p>
                <span>{formatInr(e.price)}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>{formatInr(subtotal)}</span>
      </div>
      <div className="order-summary-row order-summary-muted">
        <span>Taxes &amp; Fees (est.)</span>
        <span>{formatInr(taxes)}</span>
      </div>
      <div className="order-summary-total">
        <span>Est. Total</span>
        <span>{formatInr(grandTotal)}</span>
      </div>
    </div>
  );
}
