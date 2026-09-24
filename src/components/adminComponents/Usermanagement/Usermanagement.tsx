"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Plan = "Starter" | "Growth" | "Pro";
export type SubscriptionStatus =
  | "Active"
  | "Trial"
  | "Cancelled"
  | "Expired"
  | "Payment Failed";
export type AccountStatus = "Active" | "Suspended";

export interface BusinessDetails {
  /** Overrides `owner` in the drawer if it differs from the table value. */
  owner?: string;
  type?: string;
  address?: string;
  phone?: string;
  /** Falls back to the business `email`. */
  email?: string;
  /** Without protocol, e.g. "g.page/r/mycafe/review". */
  gmbLink?: string;
  /** ISO date (YYYY-MM-DD). Falls back to `joinedDate`. */
  joinedDate?: string;
  /** ISO date (YYYY-MM-DD). Falls back to `billingDate`. */
  nextBillingDate?: string;
}

export interface Business {
  id: string;
  name: string;
  email: string;
  owner: string;
  country: string;
  plan: Plan;
  subscription: SubscriptionStatus;
  /** ISO date (YYYY-MM-DD) */
  billingDate: string;
  /** ISO date (YYYY-MM-DD) */
  joinedDate: string;
  status: AccountStatus;
  /** Avatar initials. Generated from the name when omitted. */
  initials?: string;
  details?: BusinessDetails;
}

export interface UserManagementProps {
  businesses?: Business[];
  pageSize?: number;
  initialPage?: number;
  onDelete?: (business: Business) => void;
  onStatusChange?: (business: Business, next: AccountStatus) => void;
  onDownloadQr?: (business: Business) => void;
}

/* ------------------------------------------------------------------ */
/* Demo data (matches the design mock; pass `businesses` to replace)   */
/* ------------------------------------------------------------------ */

const APEX: BusinessDetails = {
  owner: "Mehdi",
  type: "Cafe / Restaurant",
  address: "142 West 3rd Street, New York, NY 10012",
  phone: "+1 (555) 412-9900",
  gmbLink: "g.page/r/bellascafe/review",
  joinedDate: "2025-03-03",
  nextBillingDate: "2026-10-14",
};

const BASE_ROWS: Omit<Business, "id">[] = [
  {
    name: "Apex Marketing Group",
    email: "sarah@apexmarketing.co",
    owner: "Sarah Chen",
    country: "United States",
    plan: "Growth",
    subscription: "Active",
    billingDate: "2026-10-02",
    joinedDate: "2026-10-02",
    status: "Active",
    details: APEX,
  },
  {
    name: "Luna Creative Studio",
    email: "contact@lunacreative.com",
    owner: "Miguel Torres",
    country: "Canada",
    plan: "Starter",
    subscription: "Active",
    billingDate: "2025-03-15",
    joinedDate: "2026-03-15",
    status: "Active",
    details: {
      type: "Design Studio",
      address: "88 King Street West, Toronto, ON M5H 1A1",
      phone: "+1 (416) 555-0142",
      gmbLink: "g.page/r/lunacreative/review",
    },
  },
  {
    name: "GreenLeaf Solutions",
    email: "info@greenleafsolutions.io",
    owner: "Amina Yusuf",
    country: "United Kingdom",
    plan: "Pro",
    subscription: "Cancelled",
    billingDate: "2024-01-10",
    joinedDate: "2025-01-10",
    status: "Suspended",
    details: {
      type: "Consulting",
      address: "21 Bishopsgate, London EC2N 3AQ",
      phone: "+44 20 7946 0321",
      gmbLink: "g.page/r/greenleaf/review",
    },
  },
  {
    name: "Everest Wellness",
    email: "contact@everestwellness.org",
    owner: "Liam O'Connor",
    country: "Ireland",
    plan: "Starter",
    subscription: "Payment Failed",
    billingDate: "2023-02-28",
    joinedDate: "2024-02-28",
    status: "Suspended",
    details: {
      type: "Health / Wellness",
      address: "14 Grafton Street, Dublin 2, D02 XY45",
      phone: "+353 1 555 0198",
      gmbLink: "g.page/r/everestwellness/review",
    },
  },
  {
    name: "Vista Financial Advisors",
    email: "support@vistafinancial.com",
    owner: "Emily Knight",
    country: "Australia",
    plan: "Pro",
    subscription: "Active",
    billingDate: "2025-11-05",
    joinedDate: "2026-11-05",
    status: "Active",
    details: {
      type: "Financial Services",
      address: "300 Collins Street, Melbourne VIC 3000",
      phone: "+61 3 5550 1234",
      gmbLink: "g.page/r/vistafinancial/review",
    },
  },
  {
    name: "Apex Marketing Group",
    email: "sarah@apexmarketing.co",
    owner: "Sarah Chen",
    country: "United States",
    plan: "Growth",
    subscription: "Active",
    billingDate: "2026-10-02",
    joinedDate: "2026-10-02",
    status: "Active",
    details: APEX,
  },
  {
    name: "Quantum Leap Tech",
    email: "hello@quantumleaptech.com",
    owner: "Raj Patel",
    country: "India",
    plan: "Starter",
    subscription: "Expired",
    billingDate: "2026-07-20",
    joinedDate: "2027-07-20",
    status: "Active",
    details: {
      type: "Software / IT",
      address: "5th Floor, MG Road, Bengaluru 560001",
      phone: "+91 80 5550 7788",
      gmbLink: "g.page/r/quantumleap/review",
    },
  },
  {
    name: "Apex Marketing Group",
    email: "sarah@apexmarketing.co",
    owner: "Sarah Chen",
    country: "United States",
    plan: "Growth",
    subscription: "Active",
    billingDate: "2026-10-02",
    joinedDate: "2026-10-02",
    status: "Active",
    details: APEX,
  },
  {
    name: "Quantum Leap Tech",
    email: "hello@quantumleaptech.com",
    owner: "Raj Patel",
    country: "India",
    plan: "Starter",
    subscription: "Expired",
    billingDate: "2026-07-20",
    joinedDate: "2027-07-20",
    status: "Active",
    details: {
      type: "Software / IT",
      address: "5th Floor, MG Road, Bengaluru 560001",
      phone: "+91 80 5550 7788",
      gmbLink: "g.page/r/quantumleap/review",
    },
  },
  {
    name: "Apex Marketing Group",
    email: "sarah@apexmarketing.co",
    owner: "Sarah Chen",
    country: "United States",
    plan: "Growth",
    subscription: "Active",
    billingDate: "2026-10-02",
    joinedDate: "2026-10-02",
    status: "Active",
    details: APEX,
  },
];

// 5 pages x 10 rows so pagination is fully working out of the box.
const DEMO_BUSINESSES: Business[] = Array.from({ length: 5 }).flatMap((_, p) =>
  BASE_ROWS.map((row, i) => ({
    ...row,
    id: `demo-${p}-${i}`,
    initials: "SM", // same avatar text as the design mock
  })),
);

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

const FILTERS = [
  "All",
  "Active",
  "Trial",
  "Cancelled",
  "Expired",
  "Payment Failed",
] as const;
type Filter = (typeof FILTERS)[number];

const PLAN_STYLES: Record<Plan, string> = {
  Growth: "bg-purple-100 text-purple-600",
  Starter: "bg-cyan-50 text-cyan-500",
  Pro: "bg-blue-100 text-blue-600",
};

const SUBSCRIPTION_STYLES: Record<SubscriptionStatus, string> = {
  Active: "bg-green-100 text-green-600",
  Trial: "bg-sky-100 text-sky-600",
  Cancelled: "bg-slate-100 text-slate-600",
  Expired: "bg-orange-100 text-orange-500",
  "Payment Failed": "bg-red-100 text-red-500",
};

const ACCOUNT_STYLES: Record<AccountStatus, string> = {
  Active: "bg-green-100 text-green-600",
  Suspended: "bg-amber-100 text-amber-600",
};

const RING_STYLES: Record<string, string> = {
  Active: "ring-1 ring-inset ring-green-200",
  Suspended: "ring-1 ring-inset ring-amber-200",
};

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function getPageItems(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | string)[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis-left");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis-right");
  items.push(total);
  return items;
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Badge({
  className,
  children,
  outlined = false,
}: {
  className: string;
  children: React.ReactNode;
  outlined?: boolean;
}) {
  const label = String(children);
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${className} ${
        outlined ? (RING_STYLES[label] ?? "") : ""
      }`}
    >
      {children}
    </span>
  );
}

function Avatar({ text }: { text: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-indigo-500 text-xs font-semibold text-white"
    >
      {text}
    </span>
  );
}

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconDots() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
    </svg>
  );
}
function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-xs last:border-b-0">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium text-slate-800">
        {children}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function UserManagement({
  businesses = DEMO_BUSINESSES,
  pageSize = 10,
  initialPage = 2,
  onDelete,
  onStatusChange,
  onDownloadQr,
}: UserManagementProps) {
  const [items, setItems] = useState<Business[]>(businesses);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [page, setPage] = useState(initialPage);

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const panelRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const lastActiveRef = useRef<Business | null>(null);

  useEffect(() => {
    setItems(businesses);
  }, [businesses]);

  /* ---------- filtering & pagination ---------- */

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((b) => {
      if (filter !== "All" && b.subscription !== filter) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleFilter = (value: Filter) => {
    setFilter(value);
    setPage(1);
  };
  const clearFilters = () => {
    setQuery("");
    setFilter("All");
    setPage(1);
  };

  /* ---------- drawer ---------- */

  const found = items.find((b) => b.id === activeId) ?? null;
  if (found) lastActiveRef.current = found;
  const active = found ?? lastActiveRef.current;

  const openDrawer = (id: string) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setActiveId(id);
    setConfirmingDelete(false);
    setOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setConfirmingDelete(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus?.();
    };
  }, [open, closeDrawer]);

  const handleSuspend = () => {
    if (!active) return;
    const next: AccountStatus =
      active.status === "Suspended" ? "Active" : "Suspended";
    setItems((prev) =>
      prev.map((b) => (b.id === active.id ? { ...b, status: next } : b)),
    );
    onStatusChange?.(active, next);
  };

  const handleDelete = () => {
    if (!active) return;
    setItems((prev) => prev.filter((b) => b.id !== active.id));
    onDelete?.(active);
    closeDrawer();
  };

  /* ---------- render ---------- */

  return (
    <section className="w-full font-sans text-slate-900">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          User Management
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage users, roles, permissions, and account access from one place.
        </p>
      </header>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-56 md:shrink-0">
          <label htmlFor="um-search" className="sr-only">
            Search businesses
          </label>
          <input
            id="um-search"
            type="search"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search businesses..."
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by subscription"
          className="-mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((f) => {
            const selected = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={selected}
                onClick={() => handleFilter(f)}
                className={`h-9 shrink-0 rounded-lg border px-3.5 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  selected
                    ? "border-[#1f5eff] bg-[#1f5eff] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "business" : "businesses"}{" "}
        found
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-slate-200/80 bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-700">
            No businesses match your search
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try a different name or clear the filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 h-9 rounded-lg bg-[#1f5eff] px-4 text-[13px] font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-slate-200/80 bg-white lg:block">
            <table className="w-full min-w-[960px] text-left">
              <thead>
                <tr className="text-xs font-normal text-slate-400">
                  {[
                    "Business Name",
                    "Owner",
                    "Country",
                    "Plan",
                    "Subscription",
                    "Billing Date",
                    "Joined",
                    "Status",
                  ].map((h) => (
                    <th key={h} scope="col" className="px-4 py-4 font-normal">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-4 text-center font-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => openDrawer(b.id)}
                    className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar text={b.initials ?? getInitials(b.name)} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-slate-700">
                            {b.name}
                          </p>
                          <p className="text-xs text-slate-400">{b.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
                      {b.owner}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
                      {b.country}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={PLAN_STYLES[b.plan]}>{b.plan}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={SUBSCRIPTION_STYLES[b.subscription]}>
                        {b.subscription}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
                      {formatDate(b.billingDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
                      {formatDate(b.joinedDate)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={ACCOUNT_STYLES[b.status]}>
                        {b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        aria-label={`View details for ${b.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDrawer(b.id);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                      >
                        <IconDots />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <ul className="mt-5 space-y-3 lg:hidden">
            {pageRows.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => openDrawer(b.id)}
                  aria-label={`View details for ${b.name}`}
                  className="w-full rounded-xl border border-slate-200/80 bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 active:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar text={b.initials ?? getInitials(b.name)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {b.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {b.email}
                      </p>
                    </div>
                    <span className="text-slate-400">
                      <IconDots />
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
                    {[
                      ["Owner", b.owner],
                      ["Country", b.country],
                      ["Billing date", formatDate(b.billingDate)],
                      ["Joined", formatDate(b.joinedDate)],
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="text-slate-400">{label}</dt>
                        <dd className="mt-0.5 truncate font-medium text-slate-700">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <Badge className={PLAN_STYLES[b.plan]}>{b.plan}</Badge>
                    <Badge className={SUBSCRIPTION_STYLES[b.subscription]}>
                      {b.subscription}
                    </Badge>
                    <Badge className={ACCOUNT_STYLES[b.status]}>
                      {b.status}
                    </Badge>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-center gap-1.5 sm:gap-3"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-blue-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
          >
            <IconChevron dir="left" />
          </button>

          {getPageItems(currentPage, totalPages).map((item) =>
            typeof item === "string" ? (
              <span
                key={item}
                className="px-1 text-sm text-slate-400"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                onClick={() => setPage(item)}
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:h-8 sm:min-w-8 ${
                  item === currentPage
                    ? "bg-[#1f5eff] font-medium text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-blue-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
          >
            <IconChevron dir="right" />
          </button>
        </nav>
      )}

      {/* Details drawer */}
      <div
        className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="um-drawer-title"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
            open ? "visible translate-x-0" : "invisible translate-x-full"
          }`}
        >
          {active && (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5">
                <div className="min-w-0">
                  <h2
                    id="um-drawer-title"
                    className="truncate text-lg font-semibold text-slate-900"
                  >
                    {active.name}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {active.email}
                  </p>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close details"
                  className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <IconClose />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <section aria-labelledby="um-business-info">
                  <h3
                    id="um-business-info"
                    className="mb-1 text-xs font-semibold text-slate-800"
                  >
                    Business Information
                  </h3>
                  <dl>
                    <DetailRow label="Owner">
                      {active.details?.owner ?? active.owner}
                    </DetailRow>
                    <DetailRow label="Business Name">{active.name}</DetailRow>
                    <DetailRow label="Business Type">
                      {active.details?.type ?? "—"}
                    </DetailRow>
                    <DetailRow label="Business Address">
                      {active.details?.address ?? "—"}
                    </DetailRow>
                    <DetailRow label="Phone">
                      {active.details?.phone ?? "—"}
                    </DetailRow>
                    <DetailRow label="Business Email">
                      {active.details?.email ?? active.email}
                    </DetailRow>
                    <DetailRow label="Country">{active.country}</DetailRow>
                    <DetailRow label="GMB link">
                      {active.details?.gmbLink ? (
                        <a
                          href={`https://${active.details.gmbLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                        >
                          {active.details.gmbLink}
                        </a>
                      ) : (
                        "—"
                      )}
                    </DetailRow>
                    <DetailRow label="NFC QR Code">
                      <button
                        type="button"
                        aria-label="Download NFC QR code"
                        onClick={() => onDownloadQr?.(active)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                      >
                        <IconDownload />
                      </button>
                    </DetailRow>
                  </dl>
                </section>

                <section
                  aria-labelledby="um-subscription-info"
                  className="mt-7"
                >
                  <h3
                    id="um-subscription-info"
                    className="mb-1 text-xs font-semibold text-slate-800"
                  >
                    Subscription Information
                  </h3>
                  <dl>
                    <DetailRow label="Current Plan">{active.plan}</DetailRow>
                    <DetailRow label="Subscription Status">
                      <Badge
                        className={SUBSCRIPTION_STYLES[active.subscription]}
                        outlined
                      >
                        {active.subscription}
                      </Badge>
                    </DetailRow>
                    <DetailRow label="Account Status">
                      <Badge className={ACCOUNT_STYLES[active.status]} outlined>
                        {active.status}
                      </Badge>
                    </DetailRow>
                    <DetailRow label="Joined Date">
                      {formatDate(
                        active.details?.joinedDate ?? active.joinedDate,
                      )}
                    </DetailRow>
                    <DetailRow label="Next Billing Date">
                      {formatDate(
                        active.details?.nextBillingDate ?? active.billingDate,
                      )}
                    </DetailRow>
                  </dl>
                </section>
              </div>

              <div className="border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {confirmingDelete ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600" role="alert">
                      Delete{" "}
                      <span className="font-semibold">{active.name}</span>? This
                      cannot be undone.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(false)}
                        className="h-11 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 sm:h-10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="h-11 rounded-lg bg-red-500 text-xs font-medium text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 sm:h-10"
                      >
                        Delete business
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="h-11 rounded-lg border border-red-200 bg-red-100 text-xs font-medium text-red-500 transition hover:bg-red-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 sm:h-10"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleSuspend}
                      className="h-11 rounded-lg border border-amber-200 bg-amber-100 text-xs font-medium text-amber-600 transition hover:bg-amber-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 sm:h-10"
                    >
                      {active.status === "Suspended" ? "Reactivate" : "Suspend"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
