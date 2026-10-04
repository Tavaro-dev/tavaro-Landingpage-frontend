"use client";

import Link from "next/link";
import { useId, useState, useEffect, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { ENHANCEMENTS } from "@/lib/enhancements";
import { OrderSummary } from "./OrderSummary";
import { Stepper } from "./Stepper";
import { bookingService } from "@/lib/booking/service";
import type { BookingQuote, BookingResult } from "@/lib/booking/types";
import { paymentService } from "@/lib/payment/service";

import { DomainError } from "@/lib/api/errors";

const STEPS = ["Enhance", "Complete", "Confirm"] as const;

const ENHANCEMENT_CATEGORIES = Array.from(new Set(ENHANCEMENTS.map((e) => e.category)));

export function CheckoutFlow() {
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const { items, clear } = useCart();
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
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
      try {
        const q = await bookingService.createQuote({
          roomSlugs: items.map(i => ({ slug: i.slug, nights: i.nights })),
          enhancementIds: selectedIds
        });
        if (active) setQuote(q);
      } catch (err) {
        console.error("Failed to fetch quote", err);
      } finally {
        if (active) setLoadingQuote(false);
      }
    };
    fetchQuote();
    return () => { active = false; };
  }, [items, selectedIds]);

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
      case "UNAVAILABLE": return "One of your selected rooms is no longer available.";
      case "NETWORK_ERROR": return "A network error occurred. Please check your connection.";
      case "VALIDATION_ERROR": return "Please check your details and try again.";
      case "BOOKING_FAILED": return "Payment succeeded, but booking failed to confirm. Please contact support.";
      default: return fallback || "An unexpected error occurred. Please try again.";
    }
  };

  const handleConfirm = async () => {
    if (!quote || checkoutStatus !== "idle") return; // prevent duplicate submission
    
    setPaymentError(null);
    setCheckoutStatus("processing_payment");
    
    try {
      // 1. Process Payment
      // In production, the backend determines the authoritative amount, and the frontend SDK processes it.
      const paymentRes = await paymentService.processPayment({ quoteId: quote.quoteId });
      
      if (!paymentRes.success) {
        setPaymentError(getUserFriendlyMessage(paymentRes.errorCode, paymentRes.error));
        setCheckoutStatus("idle");
        return; // Booking remains unconfirmed
      }
      
      // 2. Verify and Create Booking
      setCheckoutStatus("verifying_booking");
      const res = await bookingService.createBooking({ 
        intent: {
          roomSlugs: items.map(i => ({ slug: i.slug, nights: i.nights })),
          enhancementIds: selectedIds
        }, 
        guest: guestDetails,
        paymentReference: paymentRes.paymentReference
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

  if (items.length === 0 && !isConfirmed) {
    return (
      <div className="center-col" style={{ padding: "60px 0" }}>
        <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
          Checkout
        </p>
        <h1 className="display-2" style={{ marginTop: 18 }}>
          Your cart is empty
        </h1>
        <p className="lede" style={{ marginTop: 20 }}>
          Add a room from Accommodations before checking out.
        </p>
        <div style={{ marginTop: 32 }}>
          <Link href="/resorts/accommodations" className="btn solid">
            Browse Accommodations
          </Link>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="center-col" style={{ padding: "60px 0" }}>
        <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
          Booking Received
        </p>
        <h1 className="display-2 italic" style={{ marginTop: 18 }}>
          Thank you for choosing Tavaro.
        </h1>
        <p className="lede" style={{ marginTop: 20, maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
          This is a demo checkout — no real payment has been processed and no card details were transmitted or
          stored. Our reservations team will be in touch shortly to confirm availability and arrange secure
          payment.
          <br /><br />
          Booking Reference: <strong>{bookingResult?.reference}</strong>
        </p>
        <div style={{ marginTop: 32 }}>
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
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Enhance your stay
              </h1>
              <p className="lede" style={{ marginTop: 16 }}>
                Treat yourself to something special so you can relax when you get here.
              </p>

              {ENHANCEMENT_CATEGORIES.map((category) => (
                <div key={category} style={{ marginTop: 40 }}>
                  <p className="display-3 italic" style={{ fontSize: 20, marginBottom: 20 }}>
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

              <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" }}>
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
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Guest &amp; payment details
              </h1>

              <div className="form-grid" style={{ marginTop: 30 }}>
                <div className="field">
                  <label htmlFor={fieldId("name")}>Full Name</label>
                  <input id={fieldId("name")} name="name" type="text" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("email")}>Email</label>
                  <input id={fieldId("email")} name="email" type="email" autoComplete="email" required />
                </div>
                <div className="field full">
                  <label htmlFor={fieldId("phone")}>Phone</label>
                  <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" required />
                </div>
              </div>

              <div style={{ marginTop: 40, padding: 24, border: "1px dashed var(--border)", borderRadius: 4, background: "var(--background-alt)" }}>
                <p className="eyebrow no-line">Demo Payment</p>
                <p className="lede" style={{ marginTop: 8, fontSize: 16 }}>
                  No payment provider is currently connected. Real card details are not collected or stored. 
                  Continuing will simulate a successful transaction.
                </p>
              </div>

              <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" }}>
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
              <h1 className="display-2" style={{ marginTop: 18 }}>
                Confirm your booking
              </h1>
              <p className="lede" style={{ marginTop: 16 }}>
                Please review your stay in the summary before confirming.
              </p>

              {paymentError && (
                <div style={{ marginTop: 24, padding: "16px 20px", background: "#fee2e2", color: "#991b1b", borderRadius: 4 }}>
                  <p><strong>Payment Error:</strong> {paymentError}</p>
                </div>
              )}

              <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
                <button type="button" className="btn" onClick={() => setStep(2)} disabled={processing}>
                  Back
                </button>
                <button type="button" className="btn solid" disabled={processing || !quote} onClick={handleConfirm}>
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
