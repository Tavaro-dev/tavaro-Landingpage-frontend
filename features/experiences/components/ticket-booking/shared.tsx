import { type EventItem, type TicketType, formatEventDate, formatTime } from "@/lib/content/events";
import { formatInr } from "@/lib/format";
import styles from "./ticket-booking.module.css";

export const PAYMENT_METHODS = [
  { id: "upi", name: "UPI", description: "Pay with any UPI app — GPay, PhonePe, Paytm or CRED." },
  { id: "card", name: "Credit or Debit Card", description: "Visa, Mastercard and RuPay accepted." },
  { id: "netbanking", name: "Netbanking", description: "Pay directly from your bank account." },
] as const;

export const EMPTY_DETAILS = { name: "", email: "", phone: "", address: "", city: "", state: "", postal: "" };
export type Details = typeof EMPTY_DETAILS;

export type TicketLine = { type: TicketType; count: number };

/** What every step needs to know about the booking so far. */
export type Selection = { event: EventItem; date: string; time?: string; items: TicketLine[]; total: number };

export const lineTotal = (line: TicketLine) => line.count * line.type.price;

export const whenLabel = (date: string, time?: string) => `${formatEventDate(date)}${time ? ` · ${formatTime(time)}` : ""}`;

export function QtyStepper({ name, count, onChange }: { name: string; count: number; onChange: (count: number) => void }) {
  return (
    <span className="cart-stepper">
      <button type="button" onClick={() => onChange(count - 1)} aria-label={`Remove one ${name}`}>
        −
      </button>
      <span>{count}</span>
      <button type="button" onClick={() => onChange(count + 1)} aria-label={`Add one ${name}`}>
        +
      </button>
    </span>
  );
}

/** Side panel while booking; with `bookedBy` it becomes the confirmation receipt. */
export function TicketSummary({ event, date, time, items, total, bookedBy }: Selection & { bookedBy?: string }) {
  const receipt = bookedBy !== undefined;
  return (
    <aside className={receipt ? `order-summary ${styles["ticket-receipt"]}` : "order-summary"}>
      <h2 className={`display-3 ${styles["order-summary-title"]}`}>{event.title}</h2>
      <p className={`order-summary-muted ${styles["order-summary-when"]}`}>{whenLabel(date, time)}</p>
      {event.venue && <p className="order-summary-muted">{event.venue}</p>}

      <p className="order-summary-label">{receipt ? "Your Tickets" : "Tickets"}</p>
      {items.length === 0 ? (
        <p className="order-summary-muted">No tickets selected yet.</p>
      ) : (
        <ul className="order-summary-items">
          {items.map((line) => (
            <li key={line.type.id}>
              <span>
                {line.type.name} ({line.count})
              </span>
              <span>{formatInr(lineTotal(line))}</span>
            </li>
          ))}
        </ul>
      )}
      {receipt && (
        <div className="order-summary-row">
          <span>Booked by</span>
          <span>{bookedBy}</span>
        </div>
      )}

      <div className="order-summary-total">
        <span>{receipt ? "Paid" : "Total"}</span>
        <span>{formatInr(total)}</span>
      </div>
    </aside>
  );
}
