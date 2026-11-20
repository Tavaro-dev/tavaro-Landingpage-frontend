"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";

interface PlanEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPES = [
  { value: "Wedding", label: "Wedding" },
  { value: "Social Celebration", label: "Social Celebration" },
  { value: "Corporate Offsite", label: "Corporate Offsite" },
  { value: "Private Gathering", label: "Private Gathering" },
  { value: "Other", label: "Other" },
];

/* Actual room counts reflecting Tavaro Resorts estate (13 total keys across the estate) */
const ROOM_OPTIONS = [
  { value: "", label: "Select no. of rooms" },
  { value: "No rooms required", label: "No rooms required" },
  { value: "1 Room", label: "1 Room" },
  { value: "2 - 4 Rooms", label: "2 - 4 Rooms" },
  { value: "5 - 8 Rooms", label: "5 - 8 Rooms" },
  { value: "9 - 12 Rooms", label: "9 - 12 Rooms" },
  { value: "Entire Estate (13 Rooms)", label: "Entire Estate (13 Rooms)" },
];

export default function PlanEventModal({ isOpen, onClose }: PlanEventModalProps) {
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "Wedding",
    eventDate: "",
    guestCount: "",
    rooms: "",
  });
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy={fieldId("title")}>
      <div className="event-modal-card sheet-card">
        {/* Header */}
        <div className="event-modal-head">
          <h3 className="event-modal-title" id={fieldId("title")}>Tell us about your celebration</h3>
          <button type="button" className="event-modal-close" onClick={onClose} aria-label="Close modal">
            <Icon name="close" />
          </button>
        </div>

        {submitted ? (
          <div className="event-modal-body tw:text-center tw:py-[40px] tw:px-[20px]">
            <span className="eyebrow center no-line">Enquiry Sent</span>
            <h4 className="display-3 tw:mt-[12px] tw:mb-[16px]">
              Thank You
            </h4>
            <p className="lede tw:text-(color:--on-surface-muted) tw:max-w-[420px] tw:my-[0] tw:mx-auto">
              We&apos;ve received your celebration details. Our events team will reach out shortly.
            </p>
            {isDemo && (
              <p className="order-summary-muted tw:mt-[12px] tw:text-(color:--gold-dark)">
                (Demo: No real enquiry was delivered.)
              </p>
            )}
            <button
              type="button"
              className="btn solid tw:mt-[28px]"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              
              await submit({
                type: "plan_event",
                data: formData,
              });
            }}
            className="event-modal-body"
          >
            <div className="event-form-grid">
              <div className="field">
                <label htmlFor={fieldId("name")}>Your Name *</label>
                <input
                  id={fieldId("name")}
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor={fieldId("phone")}>Phone Number *</label>
                <input
                  id={fieldId("phone")}
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor={fieldId("email")}>Email Address *</label>
                <input
                  id={fieldId("email")}
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor={fieldId("eventType")}>Type of Event *</label>
                <CustomSelect
                  id={fieldId("eventType")}
                  value={formData.eventType}
                  onChange={(val) => setFormData({ ...formData, eventType: val })}
                  options={EVENT_TYPES}
                />
              </div>

              <div className="field">
                <label htmlFor={fieldId("eventDate")}>Tentative Event Date *</label>
                <CustomDatePicker
                  id={fieldId("eventDate")}
                  value={formData.eventDate}
                  onChange={(val) => setFormData({ ...formData, eventDate: val })}
                  placeholder="Select date"
                />
              </div>

              <div className="field">
                <label htmlFor={fieldId("guestCount")}>Guest Count *</label>
                <input
                  id={fieldId("guestCount")}
                  type="text"
                  required
                  placeholder="e.g. 50 guests"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor={fieldId("rooms")}>Accommodation / Rooms</label>
                <CustomSelect
                  id={fieldId("rooms")}
                  value={formData.rooms}
                  onChange={(val) => setFormData({ ...formData, rooms: val })}
                  options={ROOM_OPTIONS}
                />
              </div>
            </div>
            
            {submitError && (
              <div className="form-error tw:mt-[20px] tw:text-center tw:text-(color:--danger)" role="alert">
                {submitError}
              </div>
            )}

            <div className="event-modal-foot tw:mt-[24px] tw:flex tw:justify-center">
              <button type="submit" className="btn solid tw:py-[14px] tw:px-[28px]" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Enquiry →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
