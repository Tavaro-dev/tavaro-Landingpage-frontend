"use client";


import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";

import { useState } from "react";
import { DiningEnquiryModal } from "./DiningEnquiryModal";



export function ResortDining() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="offer-block on-panel" id="culinary">
        <div className="container">
          <SplitSection
            reverse
            wide
            placeholder="ph-5"
            src="/images/unsplash/monsoon-table-culinary.jpg"
            alt="Tavaro Dining"
          >
            <OfferHead num="03 — The Table Awaits" heading="Tavaro Dining" />
            <p>
              From intimate dinners beneath the trees to celebrations shared with hundreds,
              Tavaro brings food and hospitality together in thoughtful ways. Curated around the
              occasion, our dining experiences move effortlessly from beautifully considered
              tables to generous feasts — from the first plate to the last toast.
            </p>
            <ul className="split-list">
              <li>Curated tables for intimate gatherings</li>
              <li>Plated &amp; family-style dining</li>
              <li>Bespoke buffets for grand celebrations</li>
              <li>Wedding, corporate &amp; social event catering</li>
              <li>Seasonal menus &amp; chef-led experiences</li>
            </ul>
            <div style={{ marginTop: "24px" }}>
              <button type="button" onClick={() => setModalOpen(true)} className="btn">
                DISCOVER TAVARO DINING <span className="btn-arrow">→</span>
              </button>
            </div>
          </SplitSection>
        </div>
      </section>

      <DiningEnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
