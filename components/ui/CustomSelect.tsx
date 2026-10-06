"use client";

import { useState, useRef, useEffect, KeyboardEvent, useId } from "react";
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

export function CustomSelect({
  id,
  name,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const baseId = useId();
  const listboxId = `custom-select-listbox-${baseId}`;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeListbox();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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

      {isOpen && (
        <ul
          className="custom-select-dropdown"
          role="listbox"
          id={listboxId}
          ref={listboxRef}
          onKeyDown={handleListboxKeyDown}
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
        </ul>
      )}
    </div>
  );
}
