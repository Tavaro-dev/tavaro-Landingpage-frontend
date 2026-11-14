import { formatInr } from "@/lib/format";
import { QtyStepper, type Selection, lineTotal, whenLabel } from "./shared";

export function CartStep({
  selection: { event, date, time, items },
  setCount,
  onBack,
  onNext,
}: {
  selection: Selection;
  setCount: (id: string, count: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <p className="eyebrow">Step 2</p>
      <h1 className="display-2 step-title">Review your cart</h1>

      {items.length === 0 ? (
        <>
          <p className="lede step-lede wide">Your cart is empty. Go back and choose your tickets.</p>
          <div className="status-actions">
            <button type="button" className="btn solid" onClick={onBack}>
              Back to Tickets
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="lede step-lede">
            {whenLabel(date, time)}
            {event.venue ? ` · ${event.venue}` : ""}
          </p>

          {items.map((line) => (
            <div className="enhance-item" key={line.type.id}>
              <div>
                <p className="enhance-item-name">{line.type.name}</p>
                <p className="enhance-item-desc">
                  {formatInr(line.type.price)} each · {whenLabel(date, time)}
                </p>
                <p className="enhance-item-price">{formatInr(lineTotal(line))}</p>
              </div>
              <div className="ticket-line-controls">
                <QtyStepper name={line.type.name} count={line.count} onChange={(n) => setCount(line.type.id, n)} />
                <button type="button" className="cart-remove" onClick={() => setCount(line.type.id, 0)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="step-actions">
            <button type="button" className="btn" onClick={onBack}>
              Back
            </button>
            <button type="button" className="btn solid" onClick={onNext}>
              Continue to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
