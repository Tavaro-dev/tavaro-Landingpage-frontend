"use client";

import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import "./ThirdPartyBookingModal.css";

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

export function ThirdPartyBookingModal({
  isOpen,
  onClose,
  searchData,
}: ThirdPartyBookingModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="ota-modal-title" bare>
      <div className="ota-modal-overlay" onClick={onClose}>
        <div className="ota-modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="ota-modal-header">
            <div>
              <p className="ota-modal-eyebrow">Tavaro Resorts · Kokapet</p>
              <h3 id="ota-modal-title" className="ota-modal-title">
                Book Your Stay
              </h3>
            </div>
            <button
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
      </div>
    </Modal>
  );
}
