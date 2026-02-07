"use client";

import React, { useEffect, useRef, useState } from "react";
import { useI18n, Locale } from "@/contexts/I18nContext";

const options: { value: Locale; label: string }[] = [
  { value: "gu", label: "ગુજરાતી" },
  { value: "hi", label: "हिंदी" },
  { value: "en", label: "English" }
];

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLabel = options.find((opt) => opt.value === locale)?.label ?? locale;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-gradient-to-r from-white via-emerald-50 to-white border border-emerald-200 text-gray-800 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeLabel}
      </button>

      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M3 9h6m-6 4h12m-6 4h6" />
        </svg>
      </span>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-lg border border-emerald-200 bg-white shadow-lg overflow-hidden"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`w-full px-3 py-2 text-xs sm:text-sm text-left hover:bg-emerald-50 transition-colors ${
                  opt.value === locale ? "font-semibold text-green-700" : "text-gray-700"
                }`}
                onClick={() => {
                  setLocale(opt.value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={opt.value === locale}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
