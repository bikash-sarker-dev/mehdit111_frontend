import React from "react";

/** Small dependency-free icon set shared by the onboarding components. */
export const Icon = {
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Chevron: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.6} />
      <path d="M12 7v5l3.2 2" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  ),
  Download: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Spinner: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2.5} opacity={0.2} />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  ),
  Store: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 10.5V19a1 1 0 001 1h14a1 1 0 001-1v-8.5M3 6l1.2-3h15.6L21 6m-18 0h18m-18 0l.8 4.5a1.6 1.6 0 003.15 0M9.35 10.5a1.6 1.6 0 003.15 0m0 0a1.6 1.6 0 003.15 0m0 0a1.6 1.6 0 003.15 0L21 6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  /** The universal contactless / NFC "tap" symbol. */
  Contactless: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M8.5 9.5a4 4 0 010 5.66" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M6 7a8 8 0 010 10.6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
      <path d="M3.6 4.5a12 12 0 010 15.6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" opacity={0.45} />
      <rect x="11" y="6" width="9" height="12.5" rx="1.6" stroke="currentColor" strokeWidth={1.6} />
      <path d="M14 21.5h3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  ),
};
