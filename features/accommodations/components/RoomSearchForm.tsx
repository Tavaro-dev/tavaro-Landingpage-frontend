"use client";

import { useId, useState } from "react";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomSelect } from "@/components/ui/CustomSelect";

const ROOM_TYPE_OPTIONS = [
  { value: "Any", label: "Any Room Type" },
  { value: "Executive Rooms", label: "Executive Rooms" },
  { value: "Suites", label: "Suites" },
  { value: "Tavaro House", label: "Tavaro House" },
];

export function RoomSearchForm() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomType, setRoomType] = useState("Any");

  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  return (
    <form className="availability-search" action="/resorts/accommodations" method="get">
      <div className="availability-field">
        <label htmlFor={fieldId("checkin")}>Check-in</label>
        <CustomDatePicker
          id={fieldId("checkin")}
          name="checkin"
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
          name="checkout"
          value={checkout}
          placeholder="Select check-out"
          minDate={checkin}
          required
          onChange={(val) => setCheckout(val)}
        />
      </div>
      <div className="availability-field">
        <label htmlFor={fieldId("guests")}>Guests</label>
        <input id={fieldId("guests")} name="guests" type="number" min={1} defaultValue={2} suppressHydrationWarning />
      </div>
      <div className="availability-field">
        <label htmlFor={fieldId("roomType")}>Room Type</label>
        <CustomSelect
          id={fieldId("roomType")}
          name="roomType"
          value={roomType}
          options={ROOM_TYPE_OPTIONS}
          onChange={(val) => setRoomType(val)}
        />
      </div>
      <button type="submit" className="btn solid availability-submit" suppressHydrationWarning>
        Check Availability
      </button>
    </form>
  );
}
