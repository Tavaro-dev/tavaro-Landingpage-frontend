"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Stepper } from "./Stepper";
import { type EventItem, getBookingDates, formatEventDate, formatTime } from "@/lib/events";
import { formatInr } from "@/lib/format";

const STEPS = ["Tickets", "Cart", "Details", "Payment", "Done"] as const;

const PAYMENT_METHODS = [
  { id: "upi", name: "UPI", description: "Pay with any UPI app — GPay, PhonePe, Paytm or CRED." },
  { id: "card", name: "Credit or Debit Card", description: "Visa, Mastercard and RuPay accepted." },
  { id: "netbanking", name: "Netbanking", description: "Pay directly from your bank account." },
] as const;

const EMPTY_DETAILS = { name: "", email: "", phone: "", address: "", city: "", state: "", postal: "" };
type Details = typeof EMPTY_DETAILS;

function makeBookingRef() {
  const stamp = Date.now().toString(36).slice(-4);
  const rand = Math.random().toString(36).slice(2, 6);
  return `TVR-${(stamp + rand).toUpperCase()}`;
}

export function TicketBooking({ event }: { event: EventItem }) {
  // Prefix ids/names per instance so this stays safe to mount more than
  // once — including the radio group name, which isn't scoped to a <form>
  // here and would otherwise cross-select between two instances.
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const dates = getBookingDates(event);
  const times = event.times ?? [];
  const ticketTypes = event.ticketTypes ?? [];

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState(times[0]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0].id);
  const [bookingRef, setBookingRef] = useState("");

  const items = ticketTypes
    .map((type) => ({ type, count: qty[type.id] ?? 0 }))
    .filter((line) => line.count > 0);
  const ticketCount = items.reduce((sum, line) => sum + line.count, 0);
  const total = items.reduce((sum, line) => sum + line.count * line.type.price, 0);

  const setCount = (id: string, count: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(10, count)) }));

  // Each step replaces the one above it, so carry the reader back to the top —
  // otherwise "Pay" (low on step 4) drops them into the middle of step 5.
  // No `behavior` so the global `scroll-behavior: smooth` (and the
  // prefers-reduced-motion override) stays in charge.
  const goTo = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  const handleDetails = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setDetails({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? ""),
      postal: String(form.get("postal") ?? ""),
    });
    goTo(4);
  };

  const handlePay = () => {
    setBookingRef(makeBookingRef());
    goTo(5);
  };

  const downloadTickets = () => {
    const methodName = PAYMENT_METHODS.find((m) => m.id === method)?.name ?? method;
    const lines = [
      "TAVARO — E-TICKET",
      "==================================",
      `Booking reference : ${bookingRef}`,
      `Experience        : ${event.title}`,
      `Date              : ${formatEventDate(date)}`,
      ...(time ? [`Time              : ${formatTime(time)}`] : []),
      ...(event.venue ? [`Venue             : ${event.venue}`] : []),
      "",
      "TICKETS",
      ...items.map((line) => `  ${line.count} × ${line.type.name} — ${formatInr(line.count * line.type.price)}`),
      "",
      `Total paid        : ${formatInr(total)} (${methodName})`,
      "",
      "GUEST",
      `  ${details.name}`,
      `  ${details.email} · ${details.phone}`,
      "",
      "Please carry a valid photo ID. This is a demo booking —",
      "no payment was processed and this ticket is not valid for entry.",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `tavaro-tickets-${bookingRef}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const summary = (
    <aside className="order-summary">
      <h2 className="display-3" style={{ fontSize: 22 }}>
        {event.title}
      </h2>
      <p className="order-summary-muted" style={{ marginTop: 8 }}>
        {formatEventDate(date)}
        {time ? ` · ${formatTime(time)}` : ""}
      </p>
      {event.venue && <p className="order-summary-muted">{event.venue}</p>}

      <p className="order-summary-label">Tickets</p>
      {items.length === 0 ? (
        <p className="order-summary-muted">No tickets selected yet.</p>
      ) : (
        <ul className="order-summary-items">
          {items.map((line) => (
            <li key={line.type.id}>
              <span>
                {line.type.name} ({line.count})
              </span>
              <span>{formatInr(line.count * line.type.price)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="order-summary-total">
        <span>Total</span>
        <span>{formatInr(total)}</span>
      </div>
    </aside>
  );

  if (step === 5) {
    return (
      <>
        <Stepper steps={STEPS} current={5} />
        <div className="center-col" style={{ padding: "20px 0 40px" }}>
          <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
            Booking Confirmed
          </p>
          <h1 className="display-2 italic" style={{ marginTop: 18 }}>
            Thank you. Your tickets are booked.
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            A confirmation has been sent to {details.email}. Your booking reference is{" "}
            <strong style={{ color: "var(--gold)" }}>{bookingRef}</strong>.
          </p>
        </div>

        <div className="order-summary" style={{ maxWidth: 560, margin: "0 auto", position: "static" }}>
          <h2 className="display-3" style={{ fontSize: 22 }}>
            {event.title}
          </h2>
          <p className="order-summary-muted" style={{ marginTop: 8 }}>
            {formatEventDate(date)}
            {time ? ` · ${formatTime(time)}` : ""}
          </p>
          {event.venue && <p className="order-summary-muted">{event.venue}</p>}

          <p className="order-summary-label">Your Tickets</p>
          <ul className="order-summary-items">
            {items.map((line) => (
              <li key={line.type.id}>
                <span>
                  {line.type.name} ({line.count})
                </span>
                <span>{formatInr(line.count * line.type.price)}</span>
              </li>
            ))}
          </ul>
          <div className="order-summary-row">
            <span>Booked by</span>
            <span>{details.name}</span>
          </div>
          <div className="order-summary-total">
            <span>Paid</span>
            <span>{formatInr(total)}</span>
          </div>
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
          <button type="button" className="btn solid" onClick={downloadTickets}>
            Download Tickets
          </button>
          <Link href="/experiences" className="btn">
            Back to Experiences
          </Link>
        </div>

        <p className="checkout-demo-notice" style={{ maxWidth: 560, margin: "36px auto 0" }}>
          This is a demo booking flow. No payment was processed and this ticket is not valid for entry.
        </p>
      </>
    );
  }

  return (
    <>
      <Stepper steps={STEPS} current={step} />

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 1 && (
            <div>
              <p className="eyebrow">Step 1</p>
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Select your tickets
              </h1>

              <p className="order-summary-label" style={{ marginTop: 40 }}>
                Select Date
              </p>
              <div className="events-tabs" style={{ marginBottom: 24 }}>
                {dates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`events-tab${d === date ? " active" : ""}`}
                    aria-pressed={d === date}
                    onClick={() => setDate(d)}
                  >
                    {formatEventDate(d)}
                  </button>
                ))}
              </div>

              {times.length > 0 && (
                <>
                  <p className="order-summary-label">Select Time</p>
                  <div className="events-tabs" style={{ marginBottom: 24 }}>
                    {times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`events-tab${t === time ? " active" : ""}`}
                        aria-pressed={t === time}
                        onClick={() => setTime(t)}
                      >
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
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
                      <span className="cart-stepper">
                        <button type="button" onClick={() => setCount(type.id, count - 1)} aria-label={`Remove one ${type.name}`}>
                          −
                        </button>
                        <span>{count}</span>
                        <button type="button" onClick={() => setCount(type.id, count + 1)} aria-label={`Add one ${type.name}`}>
                          +
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}

              <div style={{ marginTop: 40 }}>
                <button type="button" className="btn solid" disabled={ticketCount === 0} onClick={() => goTo(2)}>
                  {ticketCount === 0 ? "Select a Ticket" : `Add to Cart · ${formatInr(total)}`}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="eyebrow">Step 2</p>
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Review your cart
              </h1>

              {items.length === 0 ? (
                <>
                  <p className="lede" style={{ marginTop: 20 }}>
                    Your cart is empty. Go back and choose your tickets.
                  </p>
                  <div style={{ marginTop: 32 }}>
                    <button type="button" className="btn solid" onClick={() => goTo(1)}>
                      Back to Tickets
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="lede" style={{ marginTop: 16 }}>
                    {formatEventDate(date)}
                    {time ? ` · ${formatTime(time)}` : ""}
                    {event.venue ? ` · ${event.venue}` : ""}
                  </p>

                  {items.map((line) => (
                    <div className="enhance-item" key={line.type.id}>
                      <div>
                        <p className="enhance-item-name">{line.type.name}</p>
                        <p className="enhance-item-desc">
                          {formatInr(line.type.price)} each · {formatEventDate(date)}
                          {time ? ` · ${formatTime(time)}` : ""}
                        </p>
                        <p className="enhance-item-price">{formatInr(line.count * line.type.price)}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <span className="cart-stepper">
                          <button
                            type="button"
                            onClick={() => setCount(line.type.id, line.count - 1)}
                            aria-label={`Remove one ${line.type.name}`}
                          >
                            −
                          </button>
                          <span>{line.count}</span>
                          <button
                            type="button"
                            onClick={() => setCount(line.type.id, line.count + 1)}
                            aria-label={`Add one ${line.type.name}`}
                          >
                            +
                          </button>
                        </span>
                        <button type="button" className="cart-remove" onClick={() => setCount(line.type.id, 0)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" }}>
                    <button type="button" className="btn" onClick={() => goTo(1)}>
                      Back
                    </button>
                    <button type="button" className="btn solid" onClick={() => goTo(3)}>
                      Continue to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleDetails}>
              <p className="eyebrow">Step 3</p>
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Enter your details
              </h1>
              <p className="lede" style={{ marginTop: 16 }}>
                We&apos;ll email your tickets and invoice to the address below.
              </p>

              <p className="order-summary-label">Personal &amp; Contact</p>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor={fieldId("name")}>Full Name</label>
                  <input id={fieldId("name")} name="name" type="text" autoComplete="name" defaultValue={details.name} required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("email")}>Email</label>
                  <input id={fieldId("email")} name="email" type="email" autoComplete="email" defaultValue={details.email} required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("phone")}>Phone</label>
                  <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" defaultValue={details.phone} required />
                </div>
              </div>

              <p className="order-summary-label">Billing Address</p>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor={fieldId("address")}>Address</label>
                  <input
                    id={fieldId("address")}
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    defaultValue={details.address}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("city")}>City</label>
                  <input
                    id={fieldId("city")}
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    defaultValue={details.city}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("state")}>State</label>
                  <input
                    id={fieldId("state")}
                    name="state"
                    type="text"
                    autoComplete="address-level1"
                    defaultValue={details.state}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("postal")}>Postal Code</label>
                  <input
                    id={fieldId("postal")}
                    name="postal"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    defaultValue={details.postal}
                    required
                  />
                </div>
              </div>

              <label
                style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 30, fontSize: 13.5 }}
              >
                <input type="checkbox" name="terms" required style={{ marginTop: 4 }} />
                <span>I have read and accept the terms and conditions.</span>
              </label>

              <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" }}>
                <button type="button" className="btn" onClick={() => goTo(2)}>
                  Back
                </button>
                <button type="submit" className="btn solid">
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div>
              <p className="eyebrow">Step 4</p>
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Payment
              </h1>
              <p className="lede" style={{ marginTop: 16 }}>
                Paying {formatInr(total)} for {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"} to{" "}
                {event.title}.
              </p>

              <p className="order-summary-label">Payment Method</p>
              {PAYMENT_METHODS.map((option) => (
                <label className="enhance-item" key={option.id} style={{ cursor: "pointer" }}>
                  <span>
                    <span className="enhance-item-name" style={{ display: "block" }}>
                      {option.name}
                    </span>
                    <span className="enhance-item-desc" style={{ display: "block" }}>
                      {option.description}
                    </span>
                  </span>
                  <input
                    type="radio"
                    name={fieldId("payment-method")}
                    value={option.id}
                    checked={method === option.id}
                    onChange={() => setMethod(option.id)}
                    style={{ accentColor: "var(--gold)", width: 18, height: 18, flexShrink: 0 }}
                  />
                </label>
              ))}

              <p className="checkout-demo-notice">
                This is a demo payment step. No payment is taken and no card, UPI or bank details are
                collected, transmitted or stored.
              </p>

              <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" }}>
                <button type="button" className="btn" onClick={() => goTo(3)}>
                  Back
                </button>
                <button type="button" className="btn solid" onClick={handlePay}>
                  Pay {formatInr(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {summary}
      </div>
    </>
  );
}
