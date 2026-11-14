import { useId, useState } from "react";
import { formatInr } from "@/lib/format";
import { createTicketBookingAction } from "@/app/actions/transaction";
import { PAYMENT_METHODS } from "./shared";
import styles from "./ticket-booking.module.css";

export function PaymentStep({
  eventTitle,
  total,
  ticketCount,
  method,
  onMethod,
  onPaid,
  onBack,
}: {
  eventTitle: string;
  total: number;
  ticketCount: number;
  method: string;
  onMethod: (m: string) => void;
  onPaid: (reference?: string) => void;
  onBack: () => void;
}) {
  // The radio group isn't scoped to a <form>, so its name must be unique per instance.
  const groupName = `${useId()}-payment-method`;
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      const res = await createTicketBookingAction();
      if (!res.success) {
        setError(res.error || "An error occurred");
        return;
      }
      onPaid(res.reference);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <p className="eyebrow">Step 4</p>
      <h1 className="display-2 step-title">Payment</h1>
      <p className="lede step-lede">
        Paying {formatInr(total)} for {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"} to {eventTitle}.
      </p>

      <p className="order-summary-label">Payment Method</p>
      {PAYMENT_METHODS.map((option) => (
        <label className={`enhance-item ${styles["pay-method"]}`} key={option.id}>
          <span>
            <span className="enhance-item-name">{option.name}</span>
            <span className="enhance-item-desc">{option.description}</span>
          </span>
          <input type="radio" name={groupName} value={option.id} checked={method === option.id} onChange={() => onMethod(option.id)} />
        </label>
      ))}

      <p className={styles["checkout-demo-notice"]}>
        This is a demo payment step. No payment is taken and no card, UPI or bank details are collected, transmitted or
        stored.
      </p>

      {error && (
        <div className="checkout-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="step-actions">
        <button type="button" className="btn" onClick={onBack} disabled={isProcessing}>
          Back
        </button>
        <button type="button" className="btn solid" onClick={handlePay} disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay ${formatInr(total)}`}
        </button>
      </div>
    </div>
  );
}
