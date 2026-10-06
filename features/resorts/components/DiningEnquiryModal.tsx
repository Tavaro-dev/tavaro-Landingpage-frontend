"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";

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
    image: "/images/unsplash/resorts-wedding-celebration.jpg",
    placeholder: "ph-1",
  },
  {
    title: "EVENT CATERING",
    description: "Corporate & large-scale events",
    image: "/images/unsplash/mare-sunday-market.jpg",
    placeholder: "ph-2",
  },
  {
    title: "UNDER THE SKY",
    description: "Intimate outdoor & poolside dining",
    image: "/images/unsplash/wellness-future-retreat.jpg",
    placeholder: "ph-3",
  },
  {
    title: "PRIVATE DINING",
    description: "Bespoke tables & menus",
    image: "/images/unsplash/monsoon-table-culinary.jpg",
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
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"discover" | "form">("discover");
  const [submitted, setSubmitted] = useState(false);
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

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView("discover");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitted(false);
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        } else if (e.key === "Tab" && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]'
          );
          const first = focusableElements[0] as HTMLElement;
          const last = focusableElements[focusableElements.length - 1] as HTMLElement;

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

      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="event-modal-overlay" onClick={onClose}>
      <style>{`
        .discover-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 16px; border: none; background: transparent; }
        .discover-grid .event-card { border: none; background: transparent; }
        .discover-grid .event-media { aspect-ratio: 16 / 9; height: auto; }
        .discover-grid .event-title { font-size: 15px; }
        .discover-grid .event-meta { font-size: 14px; line-height: 1.4; padding-bottom: 0 !important; }
        
        @media (max-width: 900px) { 
          .discover-grid { grid-template-columns: repeat(2, 1fr) !important; } 
        }
        @media (max-width: 640px) { 
          .discover-grid { grid-template-columns: 1fr !important; gap: 12px; margin-bottom: 20px !important; } 
          .discover-grid .event-card { text-align: center; padding: 8px 0; }
          .discover-grid .event-media { display: none; }
          .discover-grid .event-title { margin-top: 0 !important; padding: 0 !important; font-size: 15px; }
          .discover-grid .event-meta { margin-top: 4px !important; padding: 0 !important; font-size: 13px; padding-bottom: 0 !important; }
        }
      `}</style>
      <div
        className={`event-modal-card ${view === "discover" ? "wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dining-enquiry-title"
        tabIndex={-1}
        ref={modalRef}
        style={view === "discover" ? { maxWidth: "1200px", width: "95vw" } : {}}
      >
        <div className="event-modal-head">
          <h3 id="dining-enquiry-title" className="event-modal-title">
            {view === "discover" ? "Discover Tavaro Dining" : "Plan Your Experience"}
          </h3>
          <button type="button" className="event-modal-close" onClick={onClose} aria-label="Close modal">
            <Icon name="close" />
          </button>
        </div>

        <div className="event-modal-body">
          {view === "discover" ? (
            <div className="discover-dining-view">
              <div className="event-grid discover-grid" style={{ marginBottom: "40px" }}>
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
                    <h3 className="event-title" style={{ marginTop: "16px", padding: "0 16px" }}>{exp.title}</h3>
                    <p className="event-meta" style={{ marginTop: "8px", padding: "0 16px", paddingBottom: "16px" }}>{exp.description}</p>
                  </article>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <button type="button" onClick={() => setView("form")} className="btn solid">
                  Plan your dining Experience <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          ) : submitted ? (
            <div className="event-success-box">
              <p className="eyebrow center no-line">Enquiry Received</p>
              <h4 className="event-success-heading">Thank You for Reaching Out</h4>
              <p className="event-success-body">
                We&apos;re delighted to hear from you. Your enquiry has been received, and our team will be in touch
                with you shortly to help bring your plans to life. We look forward to welcoming you to Tavaro.
              </p>
              <button
                type="button"
                className="btn solid"
                style={{ marginTop: 28 }}
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
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

              <div className="event-form-actions">
                <button type="submit" className="btn solid event-submit-btn">
                  SUBMIT ENQUIRY <span className="btn-arrow">→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
