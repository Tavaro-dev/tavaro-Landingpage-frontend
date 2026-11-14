"use client";

import Link from "next/link";
import { useId, useState, useEffect, type FormEvent } from "react";
import { useCart } from "@/features/booking/cart/CartProvider";
import { ENHANCEMENTS } from "@/lib/content/enhancements";
import { OrderSummary } from "./OrderSummary";
import { Stepper } from "@/components/ui/Stepper";
import type { BookingQuote, BookingResult } from "@/lib/booking/types";
import { processPaymentAction, createBookingAction, createQuoteAction } from "@/app/actions/transaction";

import { DomainError } from "@/lib/api/errors";
import styles from "./booking.module.css";

const STEPS = ["Enhance", "Complete", "Confirm"] as const;

const ENHANCEMENT_CATEGORIES = Array.from(new Set(ENHANCEMENTS.map((e) => e.category)));

export function CheckoutFlow() {
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const { items, clear, hydrated } = useCart();
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteFailed, setQuoteFailed] = useState(false);
  const [quoteAttempt, setQuoteAttempt] = useState(0);
  // Kept across retries so a "paid but booking failed" retry never pays twice.
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [guestDetails, setGuestDetails] = useState({ name: "", email: "", phone: "" });
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  
  // Explicitly separate payment processing state from booking result state
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing_payment" | "verifying_booking">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (items.length === 0) return;
    
    const fetchQuote = async () => {
      setLoadingQuote(true);
      setQuoteFailed(false);
      try {
        const q = await createQuoteAction({
          roomSlugs: items.map(i => ({ slug: i.slug, nights: i.nights })),
          enhancementIds: selectedIds
        });
        if (!active) return;
        setQuote(q);
        setQuoteFailed(!q);
      } catch {
        if (active) setQuoteFailed(true);
      } finally {
        if (active) setLoadingQuote(false);
      }
    };
    fetchQuote();
    return () => { active = false; };
  }, [items, selectedIds, quoteAttempt]);

  // Each step swaps the whole panel; bring the user back to its heading.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const toggleEnhancement = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleGuestSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setGuestDetails({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "")
    });
    setStep(3);
  };

  const getUserFriendlyMessage = (code?: string, fallback?: string): string => {
    switch (code) {
      case "PAYMENT_FAILED": return "Your bank declined the transaction. Please try another card.";
      case "UNAVAILABLE": return fallback || "Online booking is currently unavailable. Please contact reservations.";
      case "NETWORK_ERROR": return "A network error occurred. Please check your connection.";
      case "VALIDATION_ERROR": return "Please check your details and try again.";
      case "BOOKING_FAILED": return "Payment succeeded, but booking failed to confirm. Please contact support.";
      default: return fallback || "An unexpected error occurred. Please try again.";
    }
  };

  const handleConfirm = async () => {
    if (!quote || loadingQuote || checkoutStatus !== "idle") return; // prevent duplicate submission
    
    setPaymentError(null);
    setCheckoutStatus("processing_payment");
    
    try {
      // 1. Process Payment (skipped on retry if an earlier attempt already paid)
      // In production, the backend determines the authoritative amount, and the frontend SDK processes it.
      let reference = paymentReference;
      if (!reference) {
        const paymentRes = await processPaymentAction({ quoteId: quote.quoteId });
        if (!paymentRes.success || !paymentRes.paymentReference) {
          setPaymentError(getUserFriendlyMessage(paymentRes.errorCode, paymentRes.error));
          setCheckoutStatus("idle");
          return; // Booking remains unconfirmed
        }
        reference = paymentRes.paymentReference;
        setPaymentReference(reference);
      }
      
      // 2. Verify and Create Booking
      setCheckoutStatus("verifying_booking");
      const res = await createBookingAction({ 
        intent: {
          roomSlugs: items.map(i => ({ slug: i.slug, nights: i.nights })),
          enhancementIds: selectedIds
        }, 
        guest: guestDetails,
        paymentReference: reference
      });
      
      if (res.status === "confirmed") {
        setBookingResult(res);
        setCheckoutStatus("idle");
        clear();
      } else {
        setPaymentError(getUserFriendlyMessage(res.errorCode, res.message));
        setCheckoutStatus("idle");
      }
    } catch (err) {
      console.error("Failed to create booking", err);
      if (err instanceof DomainError) {
        setPaymentError(getUserFriendlyMessage(err.code));
      } else {
        setPaymentError("An unexpected error occurred. Please try again.");
      }
      setCheckoutStatus("idle");
    }
  };

  const isConfirmed = bookingResult?.status === "confirmed";

  // Cart loads from localStorage after mount; don't flash "empty" before then.
  if (!hydrated) return null;

  if (items.length === 0 && !isConfirmed) {
    return (
      <div className={`center-col ${styles["checkout-status"]}`}>
        <p className="eyebrow center no-line status-eyebrow">
          Checkout
        </p>
        <h1 className="display-2 step-title">
          Your cart is empty
        </h1>
        <p className="lede step-lede wide">
          Add a room from Accommodations before checking out.
        </p>
        <div className="status-actions">
          <Link href="/resorts/accommodations" className="btn solid">
            Browse Accommodations
          </Link>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className={`center-col ${styles["checkout-status"]}`}>
        <p className="eyebrow center no-line status-eyebrow">
          Booking Received
        </p>
        <h1 className="display-2 italic step-title">
          Thank you for choosing Tavaro.
        </h1>
        <p className="lede step-lede wide narrow">
          This is a demo checkout — no real payment has been processed and no card details were transmitted or
          stored. Our reservations team will be in touch shortly to confirm availability and arrange secure
          payment.
          <br /><br />
          Booking Reference: <strong>{bookingResult?.reference}</strong>
        </p>
        <div className="status-actions">
          <Link href="/" className="btn solid">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const processing = checkoutStatus !== "idle";

  return (
    <>
      <Stepper steps={STEPS} current={step} />

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 1 && (
            <div>
              <p className="eyebrow">Step 1</p>
              <h1 className="display-2 step-title">
                Enhance your stay
              </h1>
              <p className="lede step-lede">
                Treat yourself to something special so you can relax when you get here.
              </p>

              {ENHANCEMENT_CATEGORIES.map((category) => (
                <div key={category} className={styles["enhance-group"]}>
                  <p className={`display-3 italic ${styles["enhance-group-title"]}`}>
                    {category}
                  </p>
                  {ENHANCEMENTS.filter((e) => e.category === category).map((enhancement) => {
                    const active = selectedIds.includes(enhancement.id);
                    return (
                      <div className="enhance-item" key={enhancement.id}>
                        <div>
                          <p className="enhance-item-name">{enhancement.name}</p>
                          <p className="enhance-item-desc">{enhancement.description}</p>
                          <p className="enhance-item-price">{`₹${enhancement.price.toLocaleString("en-IN")}`}</p>
                        </div>
                        <button
                          type="button"
                          className={`btn sm${active ? " solid" : ""}`}
                          onClick={() => toggleEnhancement(enhancement.id)}
                        >
                          {active ? "Added ✓" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="step-actions">
                <button type="button" className="btn solid" onClick={() => setStep(2)}>
                  Continue
                </button>
                <button type="button" className="btn" onClick={() => setStep(2)}>
                  Continue Without Enhancements
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleGuestSubmit}>
              <p className="eyebrow">Step 2</p>
              <h1 className="display-2 step-title">
                Guest &amp; payment details
              </h1>

              <div className={`form-grid ${styles["step-form"]}`}>
                <div className="field">
                  <label htmlFor={fieldId("name")}>Full Name</label>
                  <input id={fieldId("name")} name="name" defaultValue={guestDetails.name} type="text" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("email")}>Email</label>
                  <input id={fieldId("email")} name="email" defaultValue={guestDetails.email} type="email" autoComplete="email" required />
                </div>
                <div className="field full">
                  <label htmlFor={fieldId("phone")}>Phone</label>
                  <input id={fieldId("phone")} name="phone" defaultValue={guestDetails.phone} type="tel" autoComplete="tel" required />
                </div>
              </div>

              <div className={styles["demo-payment-box"]}>
                <p className="eyebrow no-line">Demo Payment</p>
                <p className={`lede ${styles["demo-payment-text"]}`}>
                  No payment provider is currently connected. Real card details are not collected or stored. 
                  Continuing will simulate a successful transaction.
                </p>
              </div>

              <div className="step-actions">
                <button type="button" className="btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn solid">
                  Continue to Confirm
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <p className="eyebrow">Step 3</p>
              <h1 className="display-2 step-title">
                Confirm your booking
              </h1>
              <p className="lede step-lede">
                Please review your stay in the summary before confirming.
              </p>

              {quoteFailed && (
                <div className="checkout-error" role="alert">
                  <p>We couldn&apos;t price your stay right now.</p>
                  <button type="button" className={`btn sm ${styles["checkout-error-retry"]}`} onClick={() => setQuoteAttempt((n) => n + 1)}>
                    Try again
                  </button>
                </div>
              )}

              {paymentError && (
                <div className="checkout-error" role="alert">
                  <p><strong>Payment Error:</strong> {paymentError}</p>
                </div>
              )}

              <div className="step-actions">
                <button type="button" className="btn" onClick={() => setStep(2)} disabled={processing}>
                  Back
                </button>
                <button type="button" className="btn solid" disabled={processing || loadingQuote || !quote} onClick={handleConfirm}>
                  {checkoutStatus === "processing_payment" ? "Processing Payment..." : checkoutStatus === "verifying_booking" ? "Verifying Booking..." : "Pay & Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>

        <OrderSummary quote={quote} loading={loadingQuote} />
      </div>
    </>
  );
}
