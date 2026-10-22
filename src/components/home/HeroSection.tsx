// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";

// const NAV_LINKS = [
//   { label: "Home", href: "#home" },
//   { label: "How It Works", href: "#howToworks" },
//   { label: "Features", href: "#features" },
//   { label: "Pricing", href: "#pricing" },
//   { label: "FAQ", href: "#faq" },
// ];

// interface LogoProps {
//   width?: number;
//   className?: string;
//   priority?: boolean;
// }

// function Logo({ width = 120, className = "", priority = true }: LogoProps) {
//   return (
//     <Link href="#home" className="flex shrink-0 items-center gap-2">
//       <Image
//         src="/images/logo/logo.png"
//         alt="Grow More Reviews — Grow More Reviews, Outgrow Your Competition"
//         width={459}
//         height={200}
//         priority={priority}
//         style={{ width, height: "auto" }}
//         className={`${className}`}
//       />
//     </Link>
//   );
// }

// export default function HeroSection() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <section
//       id="home"
//       className="relative isolate overflow-hidden bg-[#dbeefc]"
//     >
//       {/* Background: sky + clouds artwork */}
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src="/images/hero/hero_bg_iamge.png"
//           alt=""
//           fill
//           priority
//           sizes="100vw"
//           className="object-cover object-top"
//         />
//         {/* Fade the artwork into white at the very bottom of the section */}
//         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white sm:h-40 md:h-48" />
//       </div>

//       {/* Navbar */}
//       <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
//         <Logo />

//         <nav className="hidden items-center gap-1 rounded-full bg-white/60 p-1 backdrop-blur-sm lg:flex">
//           {NAV_LINKS.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               className={
//                 link.label === "Home"
//                   ? "rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
//                   : "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
//               }
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="hidden items-center gap-5 lg:flex">
//           <Link
//             href="/signIn"
//             className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
//           >
//             Log In
//           </Link>
//           <Link
//             href="/signup"
//             className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* Mobile menu toggle */}
//         <button
//           type="button"
//           onClick={() => setMenuOpen((open) => !open)}
//           aria-expanded={menuOpen}
//           aria-label="Toggle navigation menu"
//           className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm lg:hidden"
//         >
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 20 20"
//             fill="none"
//             aria-hidden="true"
//           >
//             {menuOpen ? (
//               <path
//                 d="M5 5l10 10M15 5L5 15"
//                 stroke="#1E293B"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//               />
//             ) : (
//               <path
//                 d="M3 5h14M3 10h14M3 15h14"
//                 stroke="#1E293B"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//               />
//             )}
//           </svg>
//         </button>
//       </header>

//       {/* Mobile nav panel */}
//       {menuOpen && (
//         <div className="relative z-20 mx-6 mb-4 flex flex-col gap-1 rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur-sm lg:hidden">
//           {NAV_LINKS.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               onClick={() => setMenuOpen(false)}
//               className={
//                 link.label === "Home"
//                   ? "rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
//                   : "rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
//               }
//             >
//               {link.label}
//             </Link>
//           ))}
//           <div className="mt-2 flex items-center gap-3 border-t border-slate-200 pt-3">
//             <Link
//               href="#login"
//               className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
//             >
//               Log In
//             </Link>
//             <Link
//               href="#get-started"
//               className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* Hero content — text on top, dashboard mockup stacked below it */}
//       <div className="relative z-10 mx-auto max-w-7xl px-6 pt-2 sm:pt-6 lg:px-10 lg:pt-14">
//         {/* Copy */}
//         <div className="max-w-xl">
//           <h1 className="text-[2.6rem] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[4.1rem]">
//             Get More Google Reviews.{" "}
//             <span className="text-blue-600">Grow Your Business.</span>
//           </h1>

//           <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
//             Automatically collect more customer reviews, track your review
//             growth, and see how you compare with local competitors.
//           </p>

//           <div className="mt-8">
//             <Link
//               href="#get-started"
//               className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 sm:text-base"
//             >
//               Get Started
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 16 16"
//                 fill="none"
//                 aria-hidden="true"
//               >
//                 <path
//                   d="M3.5 8h9M8.5 3.5L13 8l-4.5 4.5"
//                   stroke="currentColor"
//                   strokeWidth="1.6"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard mockup — large, stacked underneath the copy, bleeding toward
//           the right edge and fading into white at the bottom of the section */}
//       <div className="relative z-0 mt-6 sm:-mt-2 lg:-mt-14">
//         <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-10">
//           <div className="relative ml-auto w-full sm:w-[94%] lg:w-[86%] xl:w-[80%]">
//             {/* Aspect box keeps the mockup responsive at its native ratio */}
//             <div className="relative aspect-[4253/1955] w-full">
//               <Image
//                 src="/images/hero/hero_dashboard.png"
//                 alt="Review Growth AI dashboard showing 148 Google reviews, 284 review requests sent, 63 NFC taps recorded, and a +18 review gap versus competitors"
//                 fill
//                 priority
//                 sizes="(min-width: 1280px) 1200px, (min-width: 640px) 90vw, 100vw"
//                 className="object-contain object-top"
//                 style={{
//                   WebkitMaskImage:
//                     "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.55) 84%, transparent 98%)",
//                   maskImage:
//                     "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.55) 84%, transparent 98%)",
//                 }}
//               />
//             </div>

//             {/* Soft white glow so the fade reads as a shadow, not a hard cut */}
//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute inset-x-[4%] bottom-[-8%] h-[42%] bg-gradient-to-b from-white/0 via-white/70 to-white blur-2xl"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ⚠️ Adjust these three import paths to match your project structure
import type { RootState } from "@/redux/store";
import { logout, type User } from "@/redux/features/user/userSlice";
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#howToworks" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const USER_DASHBOARD_HREF = "/dashboard";
const ADMIN_DASHBOARD_HREF = "/dashboard/admin";

// admin → /dashboard/admin, every other role → /dashboard
function getDashboardHref(role?: string | null) {
  return role?.toLowerCase() === "admin"
    ? ADMIN_DASHBOARD_HREF
    : USER_DASHBOARD_HREF;
}
const LOGIN_HREF = "/signIn";
const SIGNUP_HREF = "/signup";

/* -------------------------------------------------------------------------- */
/*  Logo                                                                      */
/* -------------------------------------------------------------------------- */

interface LogoProps {
  width?: number;
  className?: string;
  priority?: boolean;
}

function Logo({ width = 120, className = "", priority = true }: LogoProps) {
  return (
    <Link href="#home" className="flex shrink-0 items-center gap-2">
      <Image
        src="/images/logo/logo.png"
        alt="Grow More Reviews — Grow More Reviews, Outgrow Your Competition"
        width={459}
        height={200}
        priority={priority}
        style={{ width, height: "auto" }}
        className={`transition-[width] duration-300 ease-out ${className}`}
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Avatar (photo, with initials fallback)                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function Avatar({ user, size = 40 }: { user: User; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (user.image && !failed) {
    return (
      <img
        src={user.image}
        alt={user.name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <span
      aria-label={user.name}
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
    >
      {getInitials(user.name)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  User dropdown (desktop)                                                   */
/* -------------------------------------------------------------------------- */

function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex items-center gap-2 rounded-full bg-white/70 p-1 pr-2.5 shadow-sm ring-1 ring-slate-200/70 backdrop-blur-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <Avatar user={user} size={36} />
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className={`text-slate-600 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel — always mounted so it can animate in and out */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200 transition duration-200 ease-out ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {/* Who is logged in */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <Avatar user={user} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-0.5">
          <Link
            href={getDashboardHref(user.role)}
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="6"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="10"
                y="2"
                width="6"
                height="4"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="2"
                y="10"
                width="6"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="10"
                y="8"
                width="6"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Dashboard
          </Link>

          <button
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 3H4.5A1.5 1.5 0 003 4.5v9A1.5 1.5 0 004.5 15H7M11.5 12.5L15 9l-3.5-3.5M15 9H7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero section                                                              */
/* -------------------------------------------------------------------------- */

export default function HeroSection() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");

  /* ----- Auth: Redux first (instant), then refresh from the API ----- */
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);

  // If your token is NOT kept in Redux (e.g. cookie only), remove `skip`.
  const { data: profileRes } = useGetMeProfileQuery(undefined, {
    skip: !token,
  });

  const user: User | null =
    (profileRes?.data as User | undefined) ?? reduxUser ?? null;
  const isLoggedIn = Boolean(token && user);

  const handleLogout = useCallback(() => {
    // 1. Clear in-memory Redux state (so the navbar updates immediately)
    dispatch(logout());

    // 2. Clear persisted storage
    try {
      [
        "accessToken",
        "refreshToken",
        "userEmail",
        "user",
        "persist:root",
      ].forEach((k) => localStorage.removeItem(k));
    } catch {}

    // 3. Clear cookies — names must match what saveSession() writes
    ["token", "refreshToken"].forEach((name) => {
      document.cookie = `${name}=; path=/; max-age=0`;
    });

    // 4. Close the mobile menu and go to the sign-in page
    setMenuOpen(false);
    router.push(LOGIN_HREF);
  }, [dispatch, router]);

  /* ----- Avoid a Log In → avatar flicker on first paint ----- */
  useEffect(() => setMounted(true), []);

  /* ----- Sticky navbar: shrink + blur once the page is scrolled ----- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ----- Highlight the nav link of the section currently on screen ----- */
  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.getElementById(l.href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* ----- Auth area: logged-out buttons / loading placeholder / avatar ----- */
  const renderDesktopAuth = () => {
    if (!mounted) {
      return (
        <div className="h-10 w-24 animate-pulse rounded-full bg-white/50" />
      );
    }
    if (isLoggedIn && user) {
      return <UserMenu user={user} onLogout={handleLogout} />;
    }
    return (
      <>
        <Link
          href={LOGIN_HREF}
          className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
        >
          Log In
        </Link>
        <Link
          href={SIGNUP_HREF}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Get Started
        </Link>
      </>
    );
  };

  const heroCtaHref =
    mounted && isLoggedIn && user ? getDashboardHref(user.role) : SIGNUP_HREF;
  const heroCtaLabel =
    mounted && isLoggedIn ? "Go to Dashboard" : "Get Started";

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/*  Sticky navbar (fixed, lives outside the overflow-hidden section)  */}
      {/* ------------------------------------------------------------------ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? "border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ease-out lg:px-10 ${
            scrolled ? "py-3" : "py-6"
          }`}
        >
          <Logo width={scrolled ? 96 : 120} />

          <nav className="hidden items-center gap-1 rounded-full bg-white/60 p-1 backdrop-blur-sm lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeHref === link.href
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            {renderDesktopAuth()}
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
        </div>

        {/* Mobile nav panel (animated open / close) */}
        <div
          className={`mx-6 overflow-hidden transition-all duration-300 ease-out lg:hidden ${
            menuOpen
              ? "mb-4 max-h-[32rem] opacity-100"
              : "pointer-events-none mb-0 max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeHref === link.href
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-slate-200 pt-3">
              {mounted && isLoggedIn && user ? (
                <div className="flex flex-col gap-1">
                  <div className="mb-1 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <Avatar user={user} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardHref(user.role)}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href={LOGIN_HREF}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Log In
                  </Link>
                  <Link
                    href={SIGNUP_HREF}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/*  Hero                                                              */}
      {/* ------------------------------------------------------------------ */}
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

        {/* Spacer: the navbar is fixed now, so reserve its original height */}
        <div aria-hidden="true" className="h-[100px]" />

        {/* Hero content — text on top, dashboard mockup stacked below it */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-2 sm:pt-6 lg:px-10 lg:pt-14">
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
                href={heroCtaHref}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 sm:text-base"
              >
                {heroCtaLabel}
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
        <div className="relative z-0 mt-6 sm:-mt-2 lg:-mt-14">
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
    </>
  );
}
