"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";

export interface BookingSearchData {
  checkin?: string;
  checkout?: string;
  guests?: number;
  roomType?: string;
}

interface ThirdPartyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchData?: BookingSearchData;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const AGODA_TAVARO_URL =
  "https://www.agoda.com/search?searchdatetype=default&lt=73&numberofchildren=0&gsite=mapresults&partnercurrency=INR&roomid=1344690503&masterroomid=1344690503&pricetotal=5510.25&pricetax=325.00&pricefee=0.00&rateplan=7a898d0f-100c-ec3f-908a-80294c829aca&usercountry=IN&currency=INR&userdevice=mobile&verif=false&mcid=332&booking_source=cpc&adtype=0&mpt=QVJOWGN3clJITHFLUTkrd0VVWXlEN2V2VnA0Z1hWQTRKRlZNUUhzaG5tZ0lWcjQ2SUpsYkFiWWV0dzJDV3luaFdQcDAvSzFLczh4YUV3PT0&original_rr=IN_mobile_LQ&clicktype=hotel&lang=en&pkgid=false_false_3&los=1&adults=2&rooms=1&checkin=2027-01-01&checkout=2027-01-02&selectedproperty=86138338&city=8801&cid=1833981&pslc=1&ds=lLj0z2QjzCiZGvCl";

export const BLUEPILLOW_TAVARO_URL =
  "https://www.bluepillow.in/search/6aa7a3796306e5637d7f6381?utm_campaign=hotel&begin=2027-01-01&end=2027-01-02&childrens=0&goback=false&currency=INR&language=en&chngback=true&block_id=-b,8vLaP_h1WoB3T6j2AsNuWcBzAjLYmNR_xlnwvFor-uc,-bpag-Hotel&total=5515.75&prid=domestic_mobile&country=IN";

export const GOOGLE_HOTELS_TAVARO_URL =
  "https://www.google.com/travel/search?q=Tavaro%20Resorts%20Hyderabad&qs=MidDaGtJNE16SDJQbjlycWNtR2cwdlp5OHhNVzFrTUdwMmJXMDJFQUU4DUgA&ts=CAEaPAocEhoKDS9nLzExbWQwanZtbTY6CUh5ZGVyYWJhZBIcEhQKBwjqDxAKGBgSBwjqDxAKGBkYATIECAAQACoHCgU6A0lOUg&ap=MAC6AQZwcmljZXM";

interface BookingOption {
  id: string;
  name: string;
  url: string;
  badge?: string;
  tagline: string;
  ctaText: string;
  isPrimary?: boolean;
  brandColor?: string;
}

const BOOKING_OPTIONS: BookingOption[] = [
  {
    id: "agoda",
    name: "Agoda",
    url: AGODA_TAVARO_URL,
    badge: "Best Rate",
    tagline: "Free cancellation · Instant confirmation",
    ctaText: "Check Rates",
    isPrimary: true,
    brandColor: "#003580",
  },
  {
    id: "bluepillow",
    name: "Bluepillow.in",
    url: BLUEPILLOW_TAVARO_URL,
    tagline: "Direct property rates · Free cancellation",
    ctaText: "Check Rates",
    brandColor: "#1a73e8",
  },
  {
    id: "google-hotels",
    name: "Google Hotels & All Partner Rates",
    url: GOOGLE_HOTELS_TAVARO_URL,
    tagline: "Compare all live partner rates & reviews",
    ctaText: "Compare All",
    brandColor: "#c9a45a",
  },
];

const emptySubscribe = () => () => {};

export function ThirdPartyBookingModal({
  isOpen,
  onClose,
  searchData,
  triggerRef,
}: ThirdPartyBookingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Lock scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timeout);
    };
  }, [isOpen]);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      className="ota-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <style>{`
        .ota-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 9, 8, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 3vw, 32px);
          animation: otaFadeIn 0.25s ease-out both;
        }

        .ota-modal-card {
          width: min(580px, 96vw);
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          background: var(--surface-2, #181512);
          border: 1px solid var(--surface-line, rgba(201, 164, 90, 0.4));
          border-radius: 6px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
          color: var(--on-surface, #f7f2e7);
          overflow: hidden;
          position: relative;
          animation: otaScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        [data-theme="light"] .ota-modal-card {
          background: #fbf8f2;
          color: #1c1712;
          border: 1px solid rgba(156, 124, 62, 0.38);
          box-shadow: 0 24px 60px rgba(28, 24, 20, 0.18);
        }

        .ota-modal-header {
          padding: 22px 28px 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--surface-line, rgba(201, 164, 90, 0.2));
          background: inherit;
        }

        [data-theme="light"] .ota-modal-header {
          border-bottom-color: rgba(156, 124, 62, 0.22);
        }

        .ota-modal-title {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 400;
          color: var(--on-surface, #f7f2e7);
          margin: 4px 0 0;
          letter-spacing: 0.02em;
        }

        [data-theme="light"] .ota-modal-title {
          color: #1c1712;
        }

        .ota-modal-eyebrow {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold, #c9a45a);
          margin: 0;
        }

        [data-theme="light"] .ota-modal-eyebrow {
          color: #8c6e32;
        }

        .ota-modal-close {
          background: none;
          border: 1px solid var(--surface-line, rgba(201, 164, 90, 0.3));
          color: var(--on-surface, #f7f2e7);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          padding: 0;
        }

        .ota-modal-close svg {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          display: block;
        }

        .ota-modal-close:hover {
          border-color: var(--gold, #c9a45a);
          color: var(--gold, #c9a45a);
          transform: rotate(90deg);
        }

        [data-theme="light"] .ota-modal-close {
          border-color: rgba(156, 124, 62, 0.35);
          color: #1c1712;
        }

        [data-theme="light"] .ota-modal-close:hover {
          background: #8c6e32;
          border-color: #8c6e32;
          color: #ffffff;
        }

        .ota-modal-body {
          padding: 20px 28px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Search summary chips bar */
        .ota-search-summary {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(10, 9, 8, 0.45);
          border: 1px solid rgba(201, 164, 90, 0.2);
          border-radius: 4px;
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          color: var(--on-surface-muted, #b9b2a2);
        }

        [data-theme="light"] .ota-search-summary {
          background: rgba(156, 124, 62, 0.08);
          border-color: rgba(156, 124, 62, 0.25);
          color: #5c5344;
        }

        .ota-search-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .ota-search-dot {
          color: var(--gold, #c9a45a);
        }

        [data-theme="light"] .ota-search-dot {
          color: #8c6e32;
        }

        .ota-options-label {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--on-surface-muted, #b9b2a2);
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        [data-theme="light"] .ota-options-label {
          color: #7c7261;
        }

        .ota-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ota-option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(10, 9, 8, 0.5);
          border: 1px solid rgba(201, 164, 90, 0.2);
          border-radius: 4px;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s var(--ease);
          cursor: pointer;
        }

        [data-theme="light"] .ota-option-row {
          background: #ffffff;
          border-color: rgba(156, 124, 62, 0.25);
          color: #1c1712;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .ota-option-row:hover {
          border-color: var(--gold, #c9a45a);
          background: rgba(201, 164, 90, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        [data-theme="light"] .ota-option-row:hover {
          background: #ffffff;
          border-color: #8c6e32;
          box-shadow: 0 8px 24px rgba(156, 124, 62, 0.16);
        }

        .ota-option-row.primary {
          border-color: var(--gold, #c9a45a);
          background: linear-gradient(90deg, rgba(201, 164, 90, 0.12) 0%, rgba(10, 9, 8, 0.6) 100%);
        }

        [data-theme="light"] .ota-option-row.primary {
          background: linear-gradient(90deg, rgba(201, 164, 90, 0.14) 0%, #ffffff 100%);
          border-color: #8c6e32;
        }

        .ota-option-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ota-option-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display, serif);
          font-size: 16px;
          font-weight: 600;
          flex-shrink: 0;
          background: rgba(201, 164, 90, 0.15);
          color: var(--gold, #c9a45a);
          border: 1px solid rgba(201, 164, 90, 0.3);
        }

        [data-theme="light"] .ota-option-badge-icon {
          background: rgba(156, 124, 62, 0.12);
          color: #7a5f27;
          border-color: rgba(156, 124, 62, 0.3);
        }

        .ota-option-row.primary .ota-option-badge-icon {
          background: var(--gold, #c9a45a);
          color: #0a0908;
          font-weight: 700;
        }

        [data-theme="light"] .ota-option-row.primary .ota-option-badge-icon {
          background: #8c6e32;
          color: #ffffff;
        }

        .ota-option-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .ota-option-name {
          font-family: var(--font-sans, sans-serif);
          font-size: 15px;
          font-weight: 600;
          color: var(--on-surface, #f7f2e7);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        [data-theme="light"] .ota-option-name {
          color: #1c1712;
        }

        .ota-featured-tag {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--gold, #c9a45a);
          color: #0a0908;
          padding: 2px 7px;
          border-radius: 2px;
        }

        [data-theme="light"] .ota-featured-tag {
          background: #8c6e32;
          color: #ffffff;
        }

        .ota-option-sub {
          font-family: var(--font-sans, sans-serif);
          font-size: 12px;
          color: var(--on-surface-muted, #b9b2a2);
        }

        [data-theme="light"] .ota-option-sub {
          color: #6a6152;
        }

        .ota-option-right {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: right;
        }

        .ota-action-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 4px;
          border: 1px solid rgba(201, 164, 90, 0.4);
          background: rgba(201, 164, 90, 0.1);
          color: var(--gold, #c9a45a);
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.25s var(--ease);
          white-space: nowrap;
        }

        [data-theme="light"] .ota-action-cta {
          background: rgba(156, 124, 62, 0.08);
          border-color: rgba(156, 124, 62, 0.35);
          color: #1c1712;
        }

        .ota-option-row:hover .ota-action-cta {
          background: var(--gold, #c9a45a);
          color: #0a0908;
          border-color: var(--gold, #c9a45a);
        }

        [data-theme="light"] .ota-option-row:hover .ota-action-cta {
          background: #8c6e32;
          border-color: #8c6e32;
          color: #ffffff;
        }

        .ota-action-arrow {
          font-size: 14px;
          line-height: 1;
          transition: transform 0.25s var(--ease);
        }

        .ota-option-row:hover .ota-action-arrow {
          transform: translateX(3px);
        }

        .ota-modal-footer {
          padding: 16px 28px 20px;
          border-top: 1px solid var(--surface-line, rgba(201, 164, 90, 0.2));
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          font-family: var(--font-sans, sans-serif);
          font-size: 12px;
          color: var(--on-surface-muted, #b9b2a2);
          background: inherit;
        }

        [data-theme="light"] .ota-modal-footer {
          border-top-color: rgba(156, 124, 62, 0.22);
          color: #6a6152;
        }

        .ota-concierge-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--gold, #c9a45a);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        [data-theme="light"] .ota-concierge-link {
          color: #8c6e32;
        }

        .ota-concierge-link:hover {
          color: var(--gold-light, #e6cf9e);
          text-decoration: underline;
        }

        [data-theme="light"] .ota-concierge-link:hover {
          color: #1c1712;
        }

        @keyframes otaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes otaScaleUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 600px) {
          .ota-modal-header {
            padding: 18px 20px 14px;
          }
          .ota-modal-body {
            padding: 16px 20px;
          }
          .ota-modal-footer {
            padding: 14px 20px;
            flex-direction: column;
            align-items: flex-start;
          }
          .ota-action-cta span:first-child {
            display: none;
          }
        }
      `}</style>

      <div
        ref={modalRef}
        className="ota-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ota-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ota-modal-header">
          <div>
            <p className="ota-modal-eyebrow">Tavaro Resorts · Kokapet</p>
            <h3 id="ota-modal-title" className="ota-modal-title">
              Book Your Stay
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="ota-modal-close"
            onClick={onClose}
            aria-label="Close booking options modal"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Body */}
        <div className="ota-modal-body">
          {/* Selected search dates pill */}
          <div className="ota-search-summary">
            {searchData?.checkin ? (
              <>
                <span className="ota-search-chip">
                  <strong>Check-in:</strong> {searchData.checkin}
                </span>
                <span className="ota-search-dot">&bull;</span>
                <span className="ota-search-chip">
                  <strong>Check-out:</strong> {searchData.checkout || "Next day"}
                </span>
                <span className="ota-search-dot">&bull;</span>
                <span className="ota-search-chip">
                  {searchData?.guests ?? 2} Guests
                </span>
                {searchData?.roomType && searchData.roomType !== "Any" && (
                  <>
                    <span className="ota-search-dot">&bull;</span>
                    <span className="ota-search-chip">{searchData.roomType}</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span className="ota-search-chip">
                  <strong>Property:</strong> Tavaro Resorts · Kokapet
                </span>
                <span className="ota-search-dot">&bull;</span>
                <span className="ota-search-chip">Best Rate Guarantee</span>
                <span className="ota-search-dot">&bull;</span>
                <span className="ota-search-chip">Live Partner Availability</span>
              </>
            )}
          </div>

          <div className="ota-options-label">
            <span>Verified Booking Partners</span>
            <span style={{ fontSize: "10px", opacity: 0.85 }}>Instant confirmation</span>
          </div>

          {/* Options List */}
          <div className="ota-options-list">
            {BOOKING_OPTIONS.map((opt) => (
              <a
                key={opt.id}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`ota-option-row ${opt.isPrimary ? "primary" : ""}`}
                aria-label={`View live rates on ${opt.name}`}
              >
                <div className="ota-option-left">
                  <span className="ota-option-badge-icon" aria-hidden="true">
                    {opt.name.charAt(0)}
                  </span>
                  <div className="ota-option-details">
                    <span className="ota-option-name">
                      {opt.name}
                      {opt.badge && (
                        <span className="ota-featured-tag">{opt.badge}</span>
                      )}
                    </span>
                    <span className="ota-option-sub">{opt.tagline}</span>
                  </div>
                </div>

                <div className="ota-option-right">
                  <span className="ota-action-cta">
                    <span>{opt.ctaText}</span>
                    <span className="ota-action-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="ota-modal-footer">
          <span>Need custom arrangements or villa buyouts?</span>
          <a
            href="https://wa.me/919989983029?text=Hello%20Tavaro%2C%20I%20would%20like%20to%20enquire%20about%20booking%20a%20stay"
            target="_blank"
            rel="noopener noreferrer"
            className="ota-concierge-link"
          >
            <span>WhatsApp Concierge (+91 99899 83029)</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
