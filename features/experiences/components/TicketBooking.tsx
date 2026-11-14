"use client";

import { useState } from "react";
import { Stepper } from "@/components/ui/Stepper";
import { type EventItem, getBookingDates } from "@/lib/content/events";
import { EMPTY_DETAILS, PAYMENT_METHODS, type Details, type Selection, TicketSummary, lineTotal } from "./ticket-booking/shared";
import { SelectTicketsStep } from "./ticket-booking/SelectTicketsStep";
import { CartStep } from "./ticket-booking/CartStep";
import { DetailsStep } from "./ticket-booking/DetailsStep";
import { PaymentStep } from "./ticket-booking/PaymentStep";
import { ConfirmationStep } from "./ticket-booking/ConfirmationStep";

const STEPS = ["Tickets", "Cart", "Details", "Payment", "Done"] as const;

function makeBookingRef() {
  const stamp = Date.now().toString(36).slice(-4);
  const rand = Math.random().toString(36).slice(2, 6);
  return `TVR-${(stamp + rand).toUpperCase()}`;
}

/** Owns the booking state and which step shows; each step renders itself. */
export function TicketBooking({ event }: { event: EventItem }) {
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

  const items = ticketTypes.map((type) => ({ type, count: qty[type.id] ?? 0 })).filter((line) => line.count > 0);
  const ticketCount = items.reduce((sum, line) => sum + line.count, 0);
  const total = items.reduce((sum, line) => sum + lineTotal(line), 0);
  const selection: Selection = { event, date, time, items, total };

  const setCount = (id: string, count: number) => setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(10, count)) }));

  // Each step replaces the one above it, so carry the reader back to the top —
  // otherwise "Pay" (low on step 4) drops them into the middle of step 5.
  // No `behavior` so the global `scroll-behavior: smooth` (and the
  // prefers-reduced-motion override) stays in charge.
  const goTo = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  if (step === 5) {
    return (
      <>
        <Stepper steps={STEPS} current={5} />
        <ConfirmationStep selection={selection} details={details} bookingRef={bookingRef} method={method} />
      </>
    );
  }

  return (
    <>
      <Stepper steps={STEPS} current={step} />

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 1 && (
            <SelectTicketsStep
              dates={dates}
              date={date}
              onDate={setDate}
              times={times}
              time={time}
              onTime={setTime}
              ticketTypes={ticketTypes}
              qty={qty}
              setCount={setCount}
              ticketCount={ticketCount}
              total={total}
              onNext={() => goTo(2)}
            />
          )}
          {step === 2 && <CartStep selection={selection} setCount={setCount} onBack={() => goTo(1)} onNext={() => goTo(3)} />}
          {step === 3 && (
            <DetailsStep
              details={details}
              onBack={() => goTo(2)}
              onSubmit={(d) => {
                setDetails(d);
                goTo(4);
              }}
            />
          )}
          {step === 4 && (
            <PaymentStep
              eventTitle={event.title}
              total={total}
              ticketCount={ticketCount}
              method={method}
              onMethod={setMethod}
              onBack={() => goTo(3)}
              onPaid={(reference) => {
                setBookingRef(reference || makeBookingRef());
                goTo(5);
              }}
            />
          )}
        </div>

        <TicketSummary {...selection} />
      </div>
    </>
  );
}
