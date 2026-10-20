"use client";

import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { ThirdPartyBookingModal } from "./ThirdPartyBookingModal";

// =========================================================================
// FUTURE RELEASE RESTORATION IMPORTS:
// To restore the in-house booking search bar and room cards grid:
// 1. Uncomment the imports below:
//    import { RoomSearchForm } from "./RoomSearchForm";
//    import { RoomCards } from "./RoomCards";
// 2. Uncomment the component blocks in the JSX below.
// =========================================================================
// import { RoomSearchForm } from "./RoomSearchForm";
// import { RoomCards } from "./RoomCards";

export function RoomAvailability() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="section on-panel tight" id="availability">
      <div className="container">
        <Reveal className="offer-head" style={{ alignItems: "flex-start" }}>
          <div>
            <p className="eyebrow">Book Your Stay</p>
            <h2 className="display-2" style={{ marginTop: 18 }}>
              Come away for a while.
            </h2>
          </div>
          <div style={{ maxWidth: "48ch" }}>
            <p className="lede">
              13 keys across the resort. Check your dates, then explore the spaces made for celebrations.
            </p>
            <div style={{ marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn solid"
                style={{ padding: "16px 36px", fontSize: "12px", letterSpacing: "0.2em" }}
              >
                <span>Check Availability</span>
                <span aria-hidden="true" style={{ fontSize: "14px" }}>&rarr;</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* =========================================================================
            FUTURE RELEASE RESTORATION (TEMPORARILY DISABLED):
            Do NOT delete these components. They are preserved for future releases.

            1. Room Search Bar with Check-in, Check-out, Guests, and Room Type:
            ------------------------------------------------------------------
            <Reveal className="availability-panel" style={{ marginTop: 36 }}>
              <RoomSearchForm />
            </Reveal>

            2. Room Cards Grid (Executive Rooms, Suites, Tavaro House):
            ----------------------------------------------------------
            <div style={{ marginTop: 56 }}>
              <RoomCards />
            </div>
            ========================================================================= */}

        {/* Third-Party Booking Modal (Agoda, Tripadvisor, Bluepillow, Vio, Google Hotels) */}
        <ThirdPartyBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
}
