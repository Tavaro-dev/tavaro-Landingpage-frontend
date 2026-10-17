"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore, KeyboardEvent, useId } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const emptySubscribe = () => () => {};

export function CustomSelect({
  id,
  name,
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: CustomSelectProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const [position, setPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  }>({ left: 0, width: 200 });

  const baseId = useId();
  const listboxId = `custom-select-listbox-${baseId}`;

  const selectedOption = options.find((opt) => opt.value === value);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const listboxHeight = Math.min(options.length * 40 + 16, 240);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove = spaceBelow < listboxHeight + 8 && spaceAbove > spaceBelow;

    if (openAbove) {
      setPosition({
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: Math.max(rect.width, 180),
      });
    } else {
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 180),
      });
    }
  }, [options.length]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    function onScrollOrResize() {
      updatePosition();
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        listboxRef.current && !listboxRef.current.contains(target)
      ) {
        closeListbox();
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

  useEffect(() => {
    if (isOpen && activeIndex !== null && listboxRef.current) {
      const activeElement = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.focus({ preventScroll: true });
        const listbox = listboxRef.current;
        if (
          activeElement.offsetTop < listbox.scrollTop ||
          activeElement.offsetTop + activeElement.offsetHeight > listbox.scrollTop + listbox.clientHeight
        ) {
          activeElement.scrollIntoView({ block: "nearest" });
        }
      }
    }
  }, [activeIndex, isOpen]);

  function openListbox() {
    if (disabled || isOpen) return;
    const selectedIdx = options.findIndex((opt) => opt.value === value);
    setActiveIndex(selectedIdx !== -1 ? selectedIdx : 0);
    setIsOpen(true);
  }

  function closeListbox() {
    setIsOpen(false);
    setActiveIndex(null);
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || isOpen) return;

    switch (e.key) {
      case "Enter":
      case " ":
      case "Spacebar":
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        openListbox();
        break;
    }
  }

  function handleListboxKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        e.preventDefault();
        if (activeIndex !== null) {
          onChange(options[activeIndex].value);
        }
        closeListbox();
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev === null || prev === options.length - 1 ? 0 : prev + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev === null || prev === 0 ? options.length - 1 : prev - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        closeListbox();
        triggerRef.current?.focus();
        break;
      case "Tab":
        closeListbox();
        break;
    }
  }

  function handleOptionClick(optionValue: string) {
    if (disabled) return;
    onChange(optionValue);
    closeListbox();
    triggerRef.current?.focus();
  }

  const dropdownPortal = isOpen && mounted && typeof document !== "undefined" ? (
    createPortal(
      <ul
        className="custom-select-dropdown portal-floating"
        role="listbox"
        id={listboxId}
        ref={listboxRef}
        aria-label={label || placeholder}
        onKeyDown={handleListboxKeyDown}
        style={{
          position: "fixed",
          top: position.top !== undefined ? `${position.top}px` : "auto",
          bottom: position.bottom !== undefined ? `${position.bottom}px` : "auto",
          left: `${position.left}px`,
          width: `${position.width}px`,
          zIndex: 99999,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isActive = index === activeIndex;
          return (
            <li
              key={option.value}
              id={`${listboxId}-option-${index}`}
              className={`custom-select-option${isActive ? " active" : ""}`}
              onClick={() => handleOptionClick(option.value)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              aria-selected={isSelected}
              tabIndex={isActive ? 0 : -1}
            >
              {option.label}
            </li>
          );
        })}
      </ul>,
      document.body
    )
  ) : null;

  return (
    <div className={`custom-select-container${isOpen ? " active-field" : ""}`} ref={containerRef} id={id}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled}
        className={`custom-select-trigger${isOpen ? " open" : ""}`}
        onClick={() => {
          if (!disabled) {
            if (isOpen) {
              closeListbox();
              triggerRef.current?.focus();
            } else {
              openListbox();
            }
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        suppressHydrationWarning
      >
        <span className={selectedOption ? "selected-text" : "placeholder-text"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`select-arrow${isOpen ? " rotated" : ""}`}>
          <Icon name="chevron-left" />
        </span>
      </button>

      {dropdownPortal}
    </div>
  );
}
