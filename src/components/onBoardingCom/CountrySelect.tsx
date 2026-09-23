"use client";

import { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Icon } from "@/components/onBoardingCom/icons";

export interface CountryOption {
  code: string; // ISO 3166-1 alpha-2, e.g. "GB"
  name: string;
}

interface CountrySelectProps {
  value: string;
  options: CountryOption[];
  onChange: (code: string) => void;
}

/**
 * A flag-aware country picker. Uses `react-country-flag`, which renders real
 * flag images instead of Unicode flag emoji — emoji flags render as plain
 * two-letter text on Windows, so a proper flag icon library is what actually
 * shows a flag next to the selected country everywhere.
 */
export default function CountrySelect({
  value,
  options,
  onChange,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.code === value) ?? options[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <ReactCountryFlag
          countryCode={selected.code}
          svg
          style={{ width: "1.15em", height: "1.15em", borderRadius: "2px" }}
          aria-label={selected.name}
        />
        <span className="flex-1 truncate">{selected.name}</span>
        <Icon.Chevron
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
        >
          {options.map((opt) => {
            const isSelected = opt.code === value;
            return (
              <li key={opt.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.code);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <ReactCountryFlag
                    countryCode={opt.code}
                    svg
                    style={{
                      width: "1.1em",
                      height: "1.1em",
                      borderRadius: "2px",
                    }}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{opt.name}</span>
                  {isSelected && <Icon.Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
