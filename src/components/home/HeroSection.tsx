"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

interface LogoProps {
  width?: number;
  className?: string;
  priority?: boolean;
}

function Logo({ width = 170, className = "", priority = true }: LogoProps) {
  return (
    <Link href="#home" className="flex shrink-0 items-center gap-2">
      <Image
        src="/images/logo/logo.png"
        alt="Grow More Reviews — Grow More Reviews, Outgrow Your Competition"
        width={459}
        height={200}
        priority={priority}
        style={{ width, height: "auto" }}
        className={className}
      />
    </Link>
  );
}

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#dbeefc]"
    >
      {/* Background: sky + clouds artwork */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/hero_bg_iamge.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Fade the artwork into white at the very bottom of the section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white sm:h-40 md:h-48" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-1 rounded-full bg-white/60 p-1 backdrop-blur-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.label === "Home"
                  ? "rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                  : "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="#login"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Log In
          </Link>
          <Link
            href="#get-started"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="#1E293B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="#1E293B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile nav panel */}
      {menuOpen && (
        <div className="relative z-20 mx-6 mb-4 flex flex-col gap-1 rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur-sm lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={
                link.label === "Home"
                  ? "rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
                  : "rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              }
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-3 border-t border-slate-200 pt-3">
            <Link
              href="#login"
              className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Log In
            </Link>
            <Link
              href="#get-started"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero content — text on top, dashboard mockup stacked below it */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-2 sm:pt-6 lg:px-10 lg:pt-10">
        {/* Copy */}
        <div className="max-w-xl">
          <h1 className="text-[2.6rem] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[4.1rem]">
            Get More Google Reviews.{" "}
            <span className="text-blue-600">Grow Your Business.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            Automatically collect more customer reviews, track your review
            growth, and see how you compare with local competitors.
          </p>

          <div className="mt-8">
            <Link
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 sm:text-base"
            >
              Get Started
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8h9M8.5 3.5L13 8l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard mockup — large, stacked underneath the copy, bleeding toward
          the right edge and fading into white at the bottom of the section */}
      <div className="relative z-0 mt-6 sm:-mt-2 lg:-mt-6">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-10">
          <div className="relative ml-auto w-full sm:w-[94%] lg:w-[86%] xl:w-[80%]">
            {/* Aspect box keeps the mockup responsive at its native ratio */}
            <div className="relative aspect-[4253/1955] w-full">
              <Image
                src="/images/hero/hero_dashboard.png"
                alt="Review Growth AI dashboard showing 148 Google reviews, 284 review requests sent, 63 NFC taps recorded, and a +18 review gap versus competitors"
                fill
                priority
                sizes="(min-width: 1280px) 1200px, (min-width: 640px) 90vw, 100vw"
                className="object-contain object-top"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.55) 84%, transparent 98%)",
                  maskImage:
                    "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.55) 84%, transparent 98%)",
                }}
              />
            </div>

            {/* Soft white glow so the fade reads as a shadow, not a hard cut */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[4%] bottom-[-8%] h-[42%] bg-gradient-to-b from-white/0 via-white/70 to-white blur-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
