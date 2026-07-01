"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  searchable,
  loading = false,
  error,
  className = "",
  id,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-searchable if options > 8
  const isSearchable = searchable ?? options.length > 8;

  // Filtered options
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchQuery) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, isSearchable]);

  // Selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen) {
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          const option = filteredOptions[activeIndex];
          if (!option.disabled) {
            onChange(option.value);
            setIsOpen(false);
          }
        }
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[
        isSearchable ? activeIndex + 1 : activeIndex
      ] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, isOpen, isSearchable]);

  // Reset index on open
  useEffect(() => {
    if (isOpen) {
      const index = filteredOptions.findIndex((opt) => opt.value === value);
      setActiveIndex(index >= 0 ? index : 0);
      setSearchQuery("");
    } else {
      setActiveIndex(-1);
    }
  }, [isOpen, filteredOptions, value]);

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${className} ${disabled ? "disabled" : ""} ${error ? "has-error" : ""}`}
      onKeyDown={handleKeyDown}
      id={id}
    >
      {/* Hidden input for HTML form compliance */}
      {name && (
        <input type="hidden" name={name} value={value || ""} />
      )}

      {/* Select Trigger */}
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-value">
          {loading ? (
            <span className="select-loading-spinner" />
          ) : selectedOption?.icon ? (
            <span className="option-icon-wrapper">{selectedOption.icon}</span>
          ) : null}
          
          <span className={`trigger-text ${!selectedOption ? "placeholder" : ""}`}>
            {loading ? "Loading..." : selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        {/* Animated Chevron Arrow SVG */}
        <svg
          className={`chevron-icon ${isOpen ? "rotated" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Error state note */}
      {error && <span className="select-error-msg">{error}</span>}

      {/* Options Dropdown Menu Panel */}
      {isOpen && (
        <div ref={listRef} className="custom-select-dropdown dropdown-menu" role="listbox">
          {/* Search box */}
          {isSearchable && (
            <div className="select-search-wrapper">
              <svg
                className="search-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                className="select-search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()} // prevent dropdown toggle trigger
                autoFocus
              />
            </div>
          )}

          {/* Options container list */}
          <div className="options-scroller">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const isSelected = option.value === value;
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`select-option ${isSelected ? "selected" : ""} ${isActive ? "active" : ""} ${option.disabled ? "disabled" : ""}`}
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="option-content-left">
                      {option.icon && (
                        <span className="option-icon">{option.icon}</span>
                      )}
                      <div>
                        <div className="option-label">{option.label}</div>
                        {option.description && (
                          <div className="option-desc">{option.description}</div>
                        )}
                      </div>
                    </div>

                    {/* Selected Checkmark SVG */}
                    {isSelected && (
                      <svg
                        className="checkmark-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-options-msg">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
