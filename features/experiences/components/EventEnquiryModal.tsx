"use client";

import { useEffect, useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { VENUES, ENQUIRY_MENU_ITEMS, ENQUIRY_GST_RATE, ENQUIRY_BASE_PLATE_PRICE, computeEnquiryTotal } from "@/lib/content/venues";
import { formatInr } from "@/lib/format";

const emptySubscribe = () => () => {};

const EMPTY_DETAILS = { name: "", phone: "", email: "", eventType: "Wedding", eventDate: "", budget: "" };
type Details = typeof EMPTY_DETAILS;

export function EventEnquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Every trigger on the page mounts its own always-present instance of this
  // modal (hidden via CSS until opened), so field ids must be unique per
  // instance — a hardcoded "eq-name" would collide across instances.
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [guestCount, setGuestCount] = useState(100);
  const [venueKey, setVenueKey] = useState<string | null>(null);
  const [withFood, setWithFood] = useState<boolean | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const venue = VENUES.find((v) => v.key === venueKey) ?? null;

  // Triggers can sit inside a `.reveal` wrapper, whose `transform` (even at
  // rest, `.reveal.in` sets `translateY(0) scale(1)`, not `none`) makes it
  // the containing block for `position: fixed` descendants per spec — the
  // overlay would track that ancestor's scroll position instead of the
  // viewport. Portalling to <body> sidesteps that entirely.
  const portalRoot = useSyncExternalStore(emptySubscribe, () => document.body, () => null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reset once the close transition finishes, so the wizard reopens fresh next time.
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setDetails(EMPTY_DETAILS);
      setGuestCount(100);
      setVenueKey(null);
      setWithFood(null);
      setSelectedItems(new Set());
    }, 350);
  };

  const toggleItem = (i: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const total = venue
    ? computeEnquiryTotal({ venue, guestCount, withFood: Boolean(withFood), selectedItemIndexes: selectedItems })
    : 0;

  const handleStep1 = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setDetails({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      eventType: String(form.get("eventType") ?? "Wedding"),
      eventDate: String(form.get("eventDate") ?? ""),
      budget: String(form.get("budget") ?? ""),
    });
    setGuestCount(Math.max(10, Number(form.get("guests")) || 100));
    setStep(2);
  };

  const step1FormId = fieldId("step1-form");
  const eyebrow = step === 5 ? "Received" : `Step ${step} of 4`;
  const title =
    step === 1
      ? "Tell us about your celebration"
      : step === 2
        ? "Live availability — all spaces"
        : step === 3
          ? "Build your catering"
          : step === 4
            ? "Send this to our sales team"
            : "";

  if (!portalRoot) return null;

  return createPortal(
    <div className={`modal-overlay${open ? " open" : ""}`} onClick={handleClose} aria-hidden={!open}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title || "Enquiry received"}>
        <div className="modal-head">
          <div>
            <p className="eyebrow no-line" style={{ color: "var(--gold-dark)" }}>
              {eyebrow}
            </p>
            {title && <h3 style={{ marginTop: 6, fontFamily: "var(--font-display)" }}>{title}</h3>}
          </div>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <form id={step1FormId} onSubmit={handleStep1}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor={fieldId("name")}>Your Name</label>
                  <input id={fieldId("name")} name="name" type="text" autoComplete="name" defaultValue={details.name} required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("phone")}>Phone / WhatsApp</label>
                  <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" defaultValue={details.phone} required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("email")}>Email</label>
                  <input id={fieldId("email")} name="email" type="email" autoComplete="email" defaultValue={details.email} required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("type")}>Event Type</label>
                  <select id={fieldId("type")} name="eventType" defaultValue={details.eventType}>
                    <option>Wedding</option>
                    <option>Engagement / Sangeet</option>
                    <option>Corporate Event</option>
                    <option>Other Celebration</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={fieldId("date")}>Event Date</label>
                  <input id={fieldId("date")} name="eventDate" type="date" defaultValue={details.eventDate} required />
                </div>
                <div className="field">
                  <label htmlFor={fieldId("guests")}>Expected Guest Count</label>
                  <input id={fieldId("guests")} name="guests" type="number" min={10} defaultValue={guestCount} required />
                </div>
                <div className="field full">
                  <label htmlFor={fieldId("budget")}>Budget (₹)</label>
                  <input id={fieldId("budget")} name="budget" type="number" placeholder="e.g. 1,500,000" defaultValue={details.budget} />
                </div>
              </div>
            </form>
          )}

          {step === 2 && (
            <>
              <p className="order-summary-muted" style={{ marginBottom: 18 }}>
                All spaces shown, live — not filtered by your guest count, since group size and layout are
                worth weighing yourself. Unavailable spaces list their next open date.
              </p>
              <div className="venue-list">
                {VENUES.map((v) => (
                  <button
                    type="button"
                    key={v.key}
                    className={`venue-row${v.key === venueKey ? " selected" : ""}`}
                    aria-pressed={v.key === venueKey}
                    onClick={() => setVenueKey(v.key)}
                  >
                    <span>
                      <span className="venue-row-name">{v.name}</span>
                      <span className="venue-row-meta">
                        {v.capacity ? `Up to ${v.capacity.toLocaleString()} guests` : ""}
                        {!v.available && ` · Next available: ${v.next}`}
                      </span>
                    </span>
                    <span className="venue-row-end">
                      <span className={`venue-row-status ${v.available ? "avail" : "unavail"}`}>
                        {v.available ? "Available" : "Unavailable"}
                      </span>
                      <span className="venue-row-price">
                        {v.price
                          ? `${formatInr(v.price)} + GST (${formatInr(Math.round(v.price * ENQUIRY_GST_RATE))})`
                          : (v.note ?? "—")}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && venue && (
            <>
              <p style={{ fontSize: 14, marginBottom: 6 }}>
                {venue.name}
                {venue.price ? ` — ${formatInr(venue.price)} + GST` : ""}
              </p>
              <div className="toggle-pair">
                <button
                  type="button"
                  className={`toggle-btn${withFood === true ? " active" : ""}`}
                  onClick={() => setWithFood(true)}
                >
                  With Food
                </button>
                <button
                  type="button"
                  className={`toggle-btn${withFood === false ? " active" : ""}`}
                  onClick={() => setWithFood(false)}
                >
                  Without Food
                </button>
              </div>

              {withFood && (
                <>
                  <p className="order-summary-muted" style={{ margin: "16px 0 10px" }}>
                    Basic menu starts at {formatInr(ENQUIRY_BASE_PLATE_PRICE)} + GST per plate. Add items —
                    your estimate updates as you go. Final pricing is confirmed by our team.
                  </p>
                  {ENQUIRY_MENU_ITEMS.map((item, i) => (
                    <label className="menu-item" key={item.name}>
                      <span>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(i)}
                          onChange={() => toggleItem(i)}
                          style={{ marginRight: 10, accentColor: "var(--gold)" }}
                        />
                        {item.name}
                      </span>
                      <span className="mprice">+ {formatInr(item.price)}/plate</span>
                    </label>
                  ))}
                  <div className="total-bar">
                    <span className="tlabel">Estimated Total</span>
                    <span className="tvalue">{formatInr(total)}</span>
                  </div>
                </>
              )}
            </>
          )}

          {step === 4 && venue && (
            <>
              <div className="total-bar" style={{ borderTop: "none", marginTop: 0 }}>
                <span className="tlabel">Estimated Total (incl. GST)</span>
                <span className="tvalue">{formatInr(total)}</span>
              </div>
              <p className="order-summary-muted" style={{ margin: "14px 0 22px" }}>
                {venue.name} · {guestCount} guests · {withFood ? "With food" : "Without food"}. This is an
                estimate — no payment is taken here. Submitting sends your full requirement to our sales
                team, who&apos;ll call to confirm your date and finalize pricing.
              </p>
            </>
          )}

          {step === 5 && venue && (
            <div className="enquiry-confirm">
              <div className="enquiry-confirm-ok">✓</div>
              <h3 style={{ marginBottom: 10, fontFamily: "var(--font-display)" }}>
                Thank you — we&apos;ve got your requirement.
              </h3>
              <p className="order-summary-muted" style={{ maxWidth: 420, margin: "0 auto" }}>
                {venue.name} · {guestCount} guests · {withFood ? "With food" : "Without food"} · Estimate{" "}
                {formatInr(total)}. A Guest Relations Officer will call or WhatsApp {details.phone || "you"}{" "}
                shortly to confirm availability and finalize pricing.
              </p>
              <button type="button" className="btn solid" style={{ marginTop: 20 }} onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="modal-foot" style={{ justifyContent: "flex-end" }}>
            <button type="submit" form={step1FormId} className="btn solid">
              See Live Availability <span className="btn-arrow">→</span>
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="modal-foot">
            <button type="button" className="btn" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button type="button" className="btn solid" disabled={!venue} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="modal-foot">
            <button type="button" className="btn" onClick={() => setStep(2)}>
              ← Back
            </button>
            <button type="button" className="btn solid" disabled={withFood === null} onClick={() => setStep(4)}>
              Continue →
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="modal-foot" style={{ justifyContent: "space-between" }}>
            <button type="button" className="btn" onClick={() => setStep(3)}>
              ← Back
            </button>
            <button type="button" className="btn solid" onClick={() => setStep(5)}>
              Enquire Now →
            </button>
          </div>
        )}
      </div>
    </div>,
    portalRoot,
  );
}
