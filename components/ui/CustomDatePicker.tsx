"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";

interface CustomDatePickerProps {
  id?: string;
  name?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string; // YYYY-MM-DD
  required?: boolean;
}

const emptySubscribe = () => () => {};

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
  name,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  required,
}: CustomDatePickerProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? parseDate(value) : null;

  const [viewYear, setViewYear] = useState(() => (selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (selectedDate ? selectedDate.getMonth() : new Date().getMonth()));

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    isMobileModal: boolean;
  }>({ left: 0, isMobileModal: false });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth <= 540;

    if (isMobile) {
      setPosition({
        left: 0,
        isMobileModal: true,
      });
      return;
    }

    const popoverWidth = 280;
    const popoverHeight = 330;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove = spaceBelow < popoverHeight + 10 && spaceAbove > spaceBelow;

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }
    if (left < 16) left = 16;

    if (openAbove) {
      setPosition({
        bottom: window.innerHeight - rect.top + 6,
        left,
        isMobileModal: false,
      });
    } else {
      setPosition({
        top: rect.bottom + 6,
        left,
        isMobileModal: false,
      });
    }
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    function onScrollOrResize() {
      updatePosition();
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { capture: true, passive: true });
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, { capture: true });
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, updatePosition]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      e.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const calendarId = id ? `${id}-calendar` : undefined;

  const calendarBody = (
    <>
      <div className="datepicker-header">
        <button type="button" className="datepicker-nav-btn" onClick={handlePrevMonth} aria-label="Previous Month">
          <Icon name="chevron-left" />
        </button>
        <span className="datepicker-title" aria-live="polite">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button type="button" className="datepicker-nav-btn" onClick={handleNextMonth} aria-label="Next Month">
          <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
            <Icon name="chevron-left" />
          </span>
        </button>
      </div>

      <div className="datepicker-weekdays" aria-hidden="true">
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
            <span key={`prev-${i}`} className="datepicker-day muted" aria-hidden="true">
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
          const ariaLabel = `${day} ${MONTH_NAMES[viewMonth]} ${viewYear}`;

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={disabled}
              aria-label={ariaLabel}
              aria-pressed={selected}
              aria-current={today ? "date" : undefined}
              className={`datepicker-day${selected ? " selected" : ""}${today ? " today" : ""}${
                disabled ? " disabled" : ""
              }`}
              onClick={() => {
                const newDateStr = formatDate(new Date(viewYear, viewMonth, day));
                onChange(newDateStr);
                setIsOpen(false);
                requestAnimationFrame(() => {
                  triggerRef.current?.focus();
                });
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );

  const popoverPortal = isOpen && mounted && typeof document !== "undefined" ? (
    createPortal(
      position.isMobileModal ? (
        <div 
          className="datepicker-portal-backdrop"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div 
            id={calendarId} 
            ref={popoverRef}
            className="custom-datepicker-popover portal-mobile-sheet" 
            role="dialog" 
            aria-modal="true"
            aria-label={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="datepicker-mobile-top">
              <span className="datepicker-mobile-title">Select Date</span>
              <button 
                type="button" 
                className="datepicker-mobile-close" 
                onClick={() => setIsOpen(false)}
                aria-label="Close date picker"
              >
                <Icon name="close" />
              </button>
            </div>
            {calendarBody}
          </div>
        </div>
      ) : (
        <div 
          id={calendarId} 
          ref={popoverRef}
          className="custom-datepicker-popover portal-floating" 
          role="dialog" 
          aria-label={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
          style={{
            position: "fixed",
            top: position.top !== undefined ? `${position.top}px` : "auto",
            bottom: position.bottom !== undefined ? `${position.bottom}px` : "auto",
            left: `${position.left}px`,
            zIndex: 99999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {calendarBody}
        </div>
      ),
      document.body
    )
  ) : null;

  return (
    <div 
      className={`custom-datepicker-container${isOpen ? " active-field" : ""}`} 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className={`custom-datepicker-trigger${isOpen ? " open" : ""}`}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? calendarId : undefined}
        suppressHydrationWarning
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
      <input type="hidden" name={name} value={value} required={required} />

      {popoverPortal}
    </div>
  );
}
