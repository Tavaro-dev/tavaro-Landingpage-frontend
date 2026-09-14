"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  label?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomSelect({
  id,
  value,
  options,
  onChange,
  placeholder = "Select an option",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container${isOpen ? " active-field" : ""}`} ref={containerRef} id={id}>
      <button
        type="button"
        className={`custom-select-trigger${isOpen ? " open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "selected-text" : "placeholder-text"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`select-arrow${isOpen ? " rotated" : ""}`}>
          <Icon name="chevron-left" />
        </span>
      </button>

      {isOpen && (
        <ul className="custom-select-dropdown" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-select-option${option.value === value ? " active" : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
