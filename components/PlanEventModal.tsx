"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { CustomSelect } from "./CustomSelect";
import { CustomDatePicker } from "./CustomDatePicker";

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
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

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
        {/* Requirement 3: Header without 'Step 1 of 4' */}
        <div className="event-modal-head">
          <h3 className="event-modal-title">Tell us about your celebration</h3>
          <button type="button" className="event-modal-close" onClick={onClose} aria-label="Close modal">
            <Icon name="close" />
          </button>
        </div>

        <div className="event-modal-body">
          {submitted ? (
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
                  <label htmlFor="ev-name">YOUR NAME</label>
                  <input
                    id="ev-name"
                    type="text"
                    placeholder="e.g. Om Prakash"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="ev-phone">PHONE / WHATSAPP</label>
                  <input
                    id="ev-phone"
                    type="tel"
                    placeholder="+91 998 998 3029"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="ev-email">EMAIL</label>
                  <input
                    id="ev-email"
                    type="email"
                    placeholder="omprakash163@gmail.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Requirement 1: Theme-styled CustomSelect dropdown */}
                <div className="field">
                  <label htmlFor="ev-type">EVENT TYPE</label>
                  <CustomSelect
                    id="ev-type"
                    value={formData.eventType}
                    options={EVENT_TYPES}
                    onChange={(val) => setFormData({ ...formData, eventType: val })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="ev-date">EVENT DATE</label>
                  <CustomDatePicker
                    id="ev-date"
                    value={formData.eventDate}
                    placeholder="Select event date"
                    required
                    onChange={(val) => setFormData({ ...formData, eventDate: val })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="ev-guests">EXPECTED GUEST COUNT</label>
                  <input
                    id="ev-guests"
                    type="number"
                    placeholder="100"
                    required
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  />
                </div>

                {/* Requirement 1 & 2: Theme-styled dropdown with actual room counts (13 keys total) */}
                <div className="field">
                  <label htmlFor="ev-rooms">ROOMS</label>
                  <CustomSelect
                    id="ev-rooms"
                    value={formData.rooms}
                    options={ROOM_OPTIONS}
                    placeholder="Select no. of rooms"
                    onChange={(val) => setFormData({ ...formData, rooms: val })}
                  />
                </div>

                <div className="field full checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.needCatering}
                      onChange={(e) => setFormData({ ...formData, needCatering: e.target.checked })}
                    />
                    <span>I need catering</span>
                  </label>
                </div>
              </div>

              <div className="event-form-actions">
                <button type="submit" className="btn solid event-submit-btn">
                  ENQUIRE <span className="btn-arrow">→</span>
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
