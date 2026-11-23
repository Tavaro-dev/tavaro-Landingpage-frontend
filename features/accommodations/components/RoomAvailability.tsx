"use client";

import { useState } from "react";
import { useShareLink } from "@/lib/useShareLink";
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
  useShareLink("#book-stay", () => setIsModalOpen(true));

  return (
    <section className="section on-panel tight" id="availability">
      <div className="container">
        <Reveal className="offer-head tw:items-start">
          <div>
            <p className="eyebrow">Book Your Stay</p>
            <h2 className="display-2 tw:mt-[18px]">
              Come away for a while.
            </h2>
          </div>
          <div className="tw:max-w-[48ch]">
            <p className="lede">
              13 keys across the resort. Check your dates, then explore the spaces made for celebrations.
            </p>
            <div className="tw:mt-[28px]">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn solid tw:py-[16px] tw:px-[36px] tw:text-[12px] tw:tracking-[0.2em]"
              >
                <span>Check Availability</span>
                <span aria-hidden="true" className="tw:text-[14px]">&rarr;</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* =========================================================================
            FUTURE RELEASE RESTORATION (TEMPORARILY DISABLED):
            Do NOT delete these components. They are preserved for future releases.

            1. Room Search Bar with Check-in, Check-out, Guests, and Room Type:
            ------------------------------------------------------------------
            <Reveal className="availability-panel tw:mt-[36px]">
              <RoomSearchForm />
            </Reveal>

            2. Room Cards Grid (Executive Rooms, Suites, Tavaro House):
            ----------------------------------------------------------
            <div className="tw:mt-[56px]">
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
