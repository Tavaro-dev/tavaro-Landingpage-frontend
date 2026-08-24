"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { ENHANCEMENTS } from "@/lib/enhancements";
import { OrderSummary } from "./OrderSummary";
import { Stepper } from "./Stepper";

const STEPS = ["Enhance", "Complete", "Confirm"] as const;

const ENHANCEMENT_CATEGORIES = Array.from(new Set(ENHANCEMENTS.map((e) => e.category)));

export function CheckoutFlow() {
  // Prefix ids per instance so this form stays safe to mount more than once.
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const { items, clear } = useCart();
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const selectedEnhancements = ENHANCEMENTS.filter((e) => selectedIds.includes(e.id));

  const toggleEnhancement = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleGuestSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    clear();
  };

  if (items.length === 0 && !confirmed) {
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

  if (confirmed) {
    return (
      <div className="center-col" style={{ padding: "60px 0" }}>
        <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
          Booking Received
        </p>
        <h1 className="display-2 italic" style={{ marginTop: 18 }}>
          Thank you for choosing Tavaro.
        </h1>
        <p className="lede" style={{ marginTop: 20, maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
          This is a demo checkout — no payment has been processed and no card details were transmitted or
          stored. Our reservations team will be in touch shortly to confirm availability and arrange secure
          payment.
        </p>
        <div style={{ marginTop: 32 }}>
          <Link href="/" className="btn solid">
            Back to Home
          </Link>
        </div>
      </div>
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

              <p className="checkout-demo-notice">
                This is a demo checkout. Card details below are never transmitted, processed, or stored —
                no real payment is taken.
              </p>

              <div className="form-grid">
                <div className="field full">
                  <label htmlFor={fieldId("card-name")}>Name on Card</label>
                  <input id={fieldId("card-name")} name="cc-name" type="text" autoComplete="cc-name" required />
                </div>
                <div className="field full">
                  <label htmlFor={fieldId("card-number")}>Card Number</label>
                  <input
                    id={fieldId("card-number")}
                    name="cc-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="•••• •••• •••• ••••"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("card-expiry")}>Expiry (MM/YY)</label>
                  <input
                    id={fieldId("card-expiry")}
                    name="cc-exp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("card-cvv")}>CVV</label>
                  <input
                    id={fieldId("card-cvv")}
                    name="cc-csc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    required
                  />
                </div>
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

              <div style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" }}>
                <button type="button" className="btn" onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="button" className="btn solid" onClick={handleConfirm}>
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>

        <OrderSummary selectedEnhancements={selectedEnhancements} />
      </div>
    </>
  );
}
