"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

interface CustomDatePickerProps {
  id?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string; // YYYY-MM-DD
  required?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  if (y && m && d) return new Date(y, m - 1, d);
  return new Date();
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = parseDate(dateStr);
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

export function CustomDatePicker({
  id,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  required,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? parseDate(value) : null;

  const [viewYear, setViewYear] = useState(() => (selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (selectedDate ? selectedDate.getMonth() : new Date().getMonth()));

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const isPast = (day: number) => {
    if (!minDate) return false;
    const current = new Date(viewYear, viewMonth, day);
    const min = parseDate(minDate);
    min.setHours(0, 0, 0, 0);
    return current < min;
  };

  return (
    <div className={`custom-datepicker-container${isOpen ? " active-field" : ""}`} ref={containerRef} id={id}>
      <button
        type="button"
        className={`custom-datepicker-trigger${isOpen ? " open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={value ? "selected-text" : "placeholder-text"}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <span className="datepicker-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Hidden native input for form compatibility */}
      {id && <input type="hidden" id={id} name={id} value={value} required={required} />}

      {isOpen && (
        <div className="custom-datepicker-popover">
          <div className="datepicker-header">
            <button type="button" className="datepicker-nav-btn" onClick={handlePrevMonth} aria-label="Previous Month">
              <Icon name="chevron-left" />
            </button>
            <span className="datepicker-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" className="datepicker-nav-btn" onClick={handleNextMonth} aria-label="Next Month">
              <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
                <Icon name="chevron-left" />
              </span>
            </button>
          </div>

          <div className="datepicker-weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day} className="datepicker-weekday">
                {day}
              </span>
            ))}
          </div>

          <div className="datepicker-days">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = prevMonthDays - firstDayOfWeek + i + 1;
              return (
                <span key={`prev-${i}`} className="datepicker-day muted">
                  {dayNum}
                </span>
              );
            })}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const today = isToday(day);
              const disabled = isPast(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={disabled}
                  className={`datepicker-day${selected ? " selected" : ""}${today ? " today" : ""}${
                    disabled ? " disabled" : ""
                  }`}
                  onClick={() => {
                    const newDateStr = formatDate(new Date(viewYear, viewMonth, day));
                    onChange(newDateStr);
                    setIsOpen(false);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
