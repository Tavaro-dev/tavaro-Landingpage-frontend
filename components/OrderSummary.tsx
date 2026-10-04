import { formatInr } from "@/lib/format";
import type { BookingQuote } from "@/lib/booking/types";

export function OrderSummary({ quote, loading }: { quote: BookingQuote | null; loading?: boolean }) {
  if (!quote) {
    return (
      <div className="order-summary" style={{ opacity: 0.5 }}>
        <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
          Tavaro Resorts, Kokapet
        </p>
        <p className="order-summary-label">Calculating your stay...</p>
      </div>
    );
  }

  return (
    <div className={`order-summary ${loading ? "loading" : ""}`}>
      <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
        Tavaro Resorts, Kokapet
      </p>

      <p className="order-summary-label">Stay</p>
      <ul className="order-summary-items">
        {quote.items.map((item) => (
          <li key={item.slug}>
            <div>
              <p>{item.name}</p>
              <p className="order-summary-muted">
                {item.nights} night{item.nights === 1 ? "" : "s"}
              </p>
            </div>
            <span>{formatInr(item.itemTotal)}</span>
          </li>
        ))}
      </ul>

      {quote.enhancements.length > 0 && (
        <>
          <p className="order-summary-label">Enhancements</p>
          <ul className="order-summary-items">
            {quote.enhancements.map((e) => (
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
        <span>{formatInr(quote.subtotal)}</span>
      </div>
      <div className="order-summary-row order-summary-muted">
        <span>Taxes &amp; Fees (est.)</span>
        <span>{formatInr(quote.taxes)}</span>
      </div>
      <div className="order-summary-total">
        <span>Est. Total</span>
        <span>{formatInr(quote.grandTotal)}</span>
      </div>
    </div>
  );
}
