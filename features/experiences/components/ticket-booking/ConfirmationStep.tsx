import Link from "next/link";
import { formatEventDate, formatTime } from "@/lib/content/events";
import { formatInr } from "@/lib/format";
import { type Details, PAYMENT_METHODS, type Selection, TicketSummary, lineTotal } from "./shared";

function downloadTickets({ event, date, time, items, total }: Selection, details: Details, bookingRef: string, method: string) {
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
    ...items.map((line) => `  ${line.count} × ${line.type.name} — ${formatInr(lineTotal(line))}`),
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
}

export function ConfirmationStep({ selection, details, bookingRef, method }: { selection: Selection; details: Details; bookingRef: string; method: string }) {
  return (
    <>
      <div className="center-col ticket-confirm">
        <p className="eyebrow center no-line status-eyebrow">Booking Confirmed</p>
        <h1 className="display-2 italic step-title">Thank you. Your tickets are booked.</h1>
        <p className="lede step-lede wide">
          A confirmation has been sent to {details.email}. Your booking reference is{" "}
          <strong className="booking-ref">{bookingRef}</strong>.
        </p>
      </div>

      <TicketSummary {...selection} bookedBy={details.name} />

      <div className="step-actions center ticket-receipt-actions">
        <button type="button" className="btn solid" onClick={() => downloadTickets(selection, details, bookingRef, method)}>
          Download Tickets
        </button>
        <Link href="/experiences" className="btn">
          Back to Experiences
        </Link>
      </div>

      <p className="checkout-demo-notice ticket-receipt-notice">
        This is a demo booking flow. No payment was processed and this ticket is not valid for entry.
      </p>
    </>
  );
}
