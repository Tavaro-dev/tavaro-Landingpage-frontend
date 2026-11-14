import { type TicketType, formatEventDate, formatTime } from "@/lib/content/events";
import { formatInr } from "@/lib/format";
import { QtyStepper } from "./shared";
import styles from "../experiences.module.css";
import gstyles from "./ticket-booking.module.css";

function ChoiceTabs({ options, value, onChange, format }: { options: readonly string[]; value?: string; onChange: (v: string) => void; format: (v: string) => string }) {
  return (
    <div className={`${styles["events-tabs"]} ${gstyles["ticket-tabs"]}`}>
      {options.map((o) => (
        <button key={o} type="button" className={`${styles["events-tab"]}${o === value ? " active" : ""}`} aria-pressed={o === value} onClick={() => onChange(o)}>
          {format(o)}
        </button>
      ))}
    </div>
  );
}

export function SelectTicketsStep({
  dates,
  date,
  onDate,
  times,
  time,
  onTime,
  ticketTypes,
  qty,
  setCount,
  ticketCount,
  total,
  onNext,
}: {
  dates: string[];
  date: string;
  onDate: (d: string) => void;
  times: readonly string[];
  time?: string;
  onTime: (t: string) => void;
  ticketTypes: readonly TicketType[];
  qty: Record<string, number>;
  setCount: (id: string, count: number) => void;
  ticketCount: number;
  total: number;
  onNext: () => void;
}) {
  return (
    <div>
      <p className="eyebrow">Step 1</p>
      <h1 className="display-2 step-title">Select your tickets</h1>

      <p className="order-summary-label first">Select Date</p>
      <ChoiceTabs options={dates} value={date} onChange={onDate} format={formatEventDate} />

      {times.length > 0 && (
        <>
          <p className="order-summary-label">Select Time</p>
          <ChoiceTabs options={times} value={time} onChange={onTime} format={formatTime} />
        </>
      )}

      <p className="order-summary-label">Choose Tickets</p>
      {ticketTypes.map((type) => {
        const count = qty[type.id] ?? 0;
        return (
          <div className="enhance-item" key={type.id}>
            <div>
              <p className="enhance-item-name">{type.name}</p>
              <p className="enhance-item-desc">{type.description}</p>
              <p className="enhance-item-price">{formatInr(type.price)}</p>
            </div>
            {count === 0 ? (
              <button type="button" className="btn sm" onClick={() => setCount(type.id, 1)}>
                + Add
              </button>
            ) : (
              <QtyStepper name={type.name} count={count} onChange={(n) => setCount(type.id, n)} />
            )}
          </div>
        );
      })}

      <div className="step-actions">
        <button type="button" className="btn solid" disabled={ticketCount === 0} onClick={onNext}>
          {ticketCount === 0 ? "Select a Ticket" : `Add to Cart · ${formatInr(total)}`}
        </button>
      </div>
    </div>
  );
}
