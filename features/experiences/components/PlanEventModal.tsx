"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";

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

const emptySubscribe = () => () => {};

export default function PlanEventModal({ isOpen, onClose }: PlanEventModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "Wedding",
    eventDate: "",
    guestCount: "",
    rooms: "",
    needCatering: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="event-modal-head">
          <h3 className="event-modal-title">Tell us about your celebration</h3>
          <button type="button" className="event-modal-close" onClick={onClose} aria-label="Close modal">
            <Icon name="close" />
          </button>
        </div>

        {submitted ? (
          <div className="event-modal-body" style={{ textAlign: "center", padding: "40px 20px" }}>
            <span className="eyebrow center no-line">Enquiry Sent</span>
            <h4 className="display-3" style={{ marginTop: 12, marginBottom: 16 }}>
              Thank You
            </h4>
            <p className="lede" style={{ color: "var(--on-surface-muted)", maxWidth: "420px", margin: "0 auto" }}>
              We&apos;ve received your celebration details. Our events team will reach out shortly.
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
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="event-modal-body"
          >
            <div className="event-modal-field">
              <label className="event-modal-label">Your Name *</label>
              <input
                type="text"
                required
                className="event-modal-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="event-modal-field">
              <label className="event-modal-label">Phone Number *</label>
              <input
                type="tel"
                required
                className="event-modal-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="event-modal-field">
              <label className="event-modal-label">Email Address *</label>
              <input
                type="email"
                required
                className="event-modal-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="event-modal-field">
              <label className="event-modal-label">Type of Event *</label>
              <CustomSelect
                value={formData.eventType}
                onChange={(val) => setFormData({ ...formData, eventType: val })}
                options={EVENT_TYPES}
              />
            </div>

            <div className="event-modal-field">
              <label className="event-modal-label">Tentative Event Date *</label>
              <CustomDatePicker
                value={formData.eventDate}
                onChange={(val) => setFormData({ ...formData, eventDate: val })}
                placeholder="Select date"
              />
            </div>

            <div className="event-modal-field">
              <label className="event-modal-label">Guest Count *</label>
              <input
                type="text"
                required
                className="event-modal-input"
                placeholder="e.g. 50 guests"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              />
            </div>

            <div className="event-modal-field">
              <label className="event-modal-label">Accommodation / Rooms</label>
              <CustomSelect
                value={formData.rooms}
                onChange={(val) => setFormData({ ...formData, rooms: val })}
                options={ROOM_OPTIONS}
              />
            </div>

            <div className="event-modal-foot" style={{ marginTop: 24 }}>
              <button type="submit" className="btn solid" style={{ width: "100%" }}>
                Submit Enquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
