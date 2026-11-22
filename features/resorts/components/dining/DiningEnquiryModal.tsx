"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { Modal } from "@/components/ui/Modal";
import { ThankYou } from "@/components/shared/ThankYou";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import styles from "./DiningEnquiryModal.module.css";
import gstyles from "../enquiry.module.css";

interface DiningEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type DiningEnquiry = {
  planningType: string;
  requestType: string;
  name: string;
  contact: string;
  eventDate: string;
  guestCount: string;
  occasion: string;
  diningStyle: string;
  gatheringDescription: string;
};

const EXPERIENCES = [
  {
    title: "CELEBRATION CATERING",
    description: "Weddings, social occasions & grand celebrations",
    image: "/images/resorts/wedding-celebration.jpg",
    placeholder: "ph-1",
  },
  {
    title: "EVENT CATERING",
    description: "Corporate & large-scale events",
    image: "/images/mare/sunday-market.jpg",
    placeholder: "ph-2",
  },
  {
    title: "UNDER THE SKY",
    description: "Intimate outdoor & poolside dining",
    image: "/images/wellness/future-retreat.jpg",
    placeholder: "ph-3",
  },
  {
    title: "PRIVATE DINING",
    description: "Bespoke tables & menus",
    image: "/images/resorts/monsoon-table.jpg",
    placeholder: "ph-4",
  },
];

const PLANNING_OPTIONS = [
  { value: "Under the Sky", label: "Under the Sky" },
  { value: "Private Dining", label: "Private Dining" },
  { value: "Celebration", label: "Celebration" },
  { value: "Corporate / Large Event", label: "Corporate / Large Event" },
  { value: "Not sure yet", label: "Not sure yet" },
];

const REQUEST_OPTIONS = [
  { value: "Event Menu", label: "Event Menu" },
  { value: "Quote", label: "Quote" },
  { value: "Both", label: "Both" },
];

const DINING_STYLE_OPTIONS = [
  { value: "Curated Table", label: "Curated Table" },
  { value: "Plated", label: "Plated" },
  { value: "Family Style", label: "Family Style" },
  { value: "Buffet", label: "Buffet" },
  { value: "Food Stations", label: "Food Stations" },
  { value: "Not sure yet", label: "Not sure yet" },
];

export function DiningEnquiryModal({ isOpen, onClose }: DiningEnquiryModalProps) {
  const [view, setView] = useState<"discover" | "form">("discover");
  const [formData, setFormData] = useState<DiningEnquiry>({
    planningType: "Under the Sky",
    requestType: "Event Menu",
    name: "",
    contact: "",
    eventDate: "",
    guestCount: "",
    occasion: "",
    diningStyle: "Curated Table",
    gatheringDescription: "",
  });
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();

  // Every close path (Escape, backdrop, ×, Close) goes through here, so the modal reopens on "discover".
  const close = () => {
    onClose();
    setView("discover");
    reset();
  };

  return (
    <Modal open={isOpen} onClose={close} labelledBy="dining-enquiry-title" bare>
      <div className={`${gstyles["event-modal-overlay"]} sheet-overlay`} onClick={close}>
        <div
          className={`event-modal-card sheet-card ${view === "discover" ? "wide" : ""}`}
          onClick={(e) => e.stopPropagation()}
          style={view === "discover" ? { maxWidth: "1200px", width: "95vw" } : {}}
        >
          <div className="event-modal-head">
            <h3 id="dining-enquiry-title" className="event-modal-title">
              {view === "discover" ? "Discover Tavaro Dining" : "Plan Your Experience"}
            </h3>
            <button type="button" className="event-modal-close" onClick={close} aria-label="Close modal">
              <Icon name="close" />
            </button>
          </div>

          <div className="event-modal-body">
            {view === "discover" ? (
              <div className="discover-dining-view">
                <div className={`event-grid ${styles["discover-grid"]} tw:mb-[40px]`}>
                  {EXPERIENCES.map((exp) => (
                    <article className="event-card" key={exp.title}>
                      <div className={`event-media ${exp.placeholder}`}>
                        <Image
                          src={exp.image}
                          alt={exp.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                      <h3 className="event-title tw:mt-[16px] tw:py-[0] tw:px-[16px]">{exp.title}</h3>
                      <p className="event-meta tw:mt-[8px] tw:py-[0] tw:px-[16px] tw:pb-[16px]">{exp.description}</p>
                    </article>
                  ))}
                </div>
                <div className="tw:text-center">
                  <button type="button" onClick={() => setView("form")} className="btn solid">
                    Plan your dining Experience <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            ) : submitted ? (
              <ThankYou isDemo={isDemo} onClose={close} />
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await submit({ type: "dining", data: formData });
                }}
                className="event-form"
              >
                <div className="event-form-grid">
                  <div className="field">
                    <label htmlFor="dn-planning">What are you planning?</label>
                    <CustomSelect
                      id="dn-planning"
                      value={formData.planningType}
                      options={PLANNING_OPTIONS}
                      onChange={(val) => setFormData({ ...formData, planningType: val })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-request">What would you like?</label>
                    <CustomSelect
                      id="dn-request"
                      value={formData.requestType}
                      options={REQUEST_OPTIONS}
                      onChange={(val) => setFormData({ ...formData, requestType: val })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-name">Name</label>
                    <input
                      id="dn-name"
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-contact">Contact</label>
                    <input
                      id="dn-contact"
                      type="text"
                      placeholder="+91 998 998 3029 or Email"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-date">Event date</label>
                    <CustomDatePicker
                      id="dn-date"
                      value={formData.eventDate}
                      placeholder="Select event date"
                      required
                      onChange={(val) => setFormData({ ...formData, eventDate: val })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-guests">Number of guests</label>
                    <input
                      id="dn-guests"
                      type="number"
                      placeholder="10"
                      required
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-occasion">Occasion</label>
                    <input
                      id="dn-occasion"
                      type="text"
                      placeholder="e.g. Anniversary"
                      required
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="dn-style">Preferred dining style</label>
                    <CustomSelect
                      id="dn-style"
                      value={formData.diningStyle}
                      options={DINING_STYLE_OPTIONS}
                      onChange={(val) => setFormData({ ...formData, diningStyle: val })}
                    />
                  </div>

                  <div className="field full">
                    <label htmlFor="dn-desc">Tell us about your gathering</label>
                    <textarea
                      id="dn-desc"
                      rows={4}
                      placeholder="Any specific preferences or ideas..."
                      required
                      value={formData.gatheringDescription}
                      onChange={(e) => setFormData({ ...formData, gatheringDescription: e.target.value })}
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="form-error tw:mb-[20px] tw:text-(color:--danger)">
                    {submitError}
                  </div>
                )}

                <div className={gstyles["event-form-actions"]}>
                  <button type="submit" className={`btn solid ${gstyles["event-submit-btn"]}`} disabled={isSubmitting}>
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT ENQUIRY"} <span className="btn-arrow">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
