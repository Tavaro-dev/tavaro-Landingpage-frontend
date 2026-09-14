"use client";

import { useId, useState } from "react";
import { Reveal } from "./Reveal";
import { RoomCards } from "./RoomCards";
import { CustomDatePicker } from "./CustomDatePicker";
import { CustomSelect } from "./CustomSelect";

const ROOM_TYPE_OPTIONS = [
  { value: "Any", label: "Any Room Type" },
  { value: "Executive Rooms", label: "Executive Rooms" },
  { value: "Suites", label: "Suites" },
  { value: "Tavaro House", label: "Tavaro House" },
];

export function RoomAvailability() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomType, setRoomType] = useState("Any");

  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  return (
    <section className="section on-panel tight" id="availability">
      <div className="container">
        <Reveal className="offer-head">
          <div>
            <p className="eyebrow">Book Your Stay</p>
            <h2 className="display-2" style={{ marginTop: 18 }}>
              Start with a room.
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: "34ch" }}>
            13 keys across the estate — check dates, then browse the estate&apos;s celebration spaces below.
          </p>
        </Reveal>

        <Reveal className="availability-panel">
          <form className="availability-search" action="/resorts/accommodations" method="get">
            <div className="availability-field">
              <label htmlFor={fieldId("checkin")}>Check-in</label>
              <CustomDatePicker
                id={fieldId("checkin")}
                value={checkin}
                placeholder="Select check-in"
                required
                onChange={(val) => setCheckin(val)}
              />
            </div>
            <div className="availability-field">
              <label htmlFor={fieldId("checkout")}>Check-out</label>
              <CustomDatePicker
                id={fieldId("checkout")}
                value={checkout}
                placeholder="Select check-out"
                minDate={checkin}
                required
                onChange={(val) => setCheckout(val)}
              />
            </div>
            <div className="availability-field">
              <label htmlFor={fieldId("guests")}>Guests</label>
              <input id={fieldId("guests")} name="guests" type="number" min={1} defaultValue={2} />
            </div>
            <div className="availability-field">
              <label htmlFor={fieldId("roomType")}>Room Type</label>
              <CustomSelect
                id={fieldId("roomType")}
                value={roomType}
                options={ROOM_TYPE_OPTIONS}
                onChange={(val) => setRoomType(val)}
              />
            </div>
            <button type="submit" className="btn solid availability-submit">
              Check Availability
            </button>
          </form>
        </Reveal>

        <div style={{ marginTop: 56 }}>
          <RoomCards />
        </div>
      </div>
    </section>
  );
}
