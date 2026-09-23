"use client";

import React, { useState } from "react";

/**
 * CompetitorIntelligence
 * -----------------------------------------------------------------------
 * A single, self-contained component that reproduces the "Competitor
 * Intelligence" review-growth dashboard: a header with filter controls,
 * four summary metric cards, and a comparison table of the user's
 * business against nearby competitors.
 *
 * - React + Next.js (client component)
 * - TypeScript
 * - Tailwind CSS only, no external UI libraries
 * - Fully responsive: the table collapses into stacked cards on small
 *   screens so nothing is cut off or requires horizontal scrolling to
 *   read on mobile.
 *
 * Drop this file into your Next.js project (e.g. app/components/) and
 * render <CompetitorIntelligence /> wherever you need it. All data is
 * passed in as props with sensible defaults matching the reference
 * design, so you can wire it up to real data later without touching
 * the markup.
 * -----------------------------------------------------------------------
 */

/* ----------------------------- Types ----------------------------- */

type TimeRange = "7d" | "30d" | "90d";

export interface MetricCardData {
  id: string;
  icon: "star" | "trend" | "calendar" | "trendAhead";
  value: string;
  label: string;
  badgeText: string;
  badgeTone: "positive" | "neutral";
}

export interface CompetitorRow {
  id: string;
  initials: string;
  name: string;
  isYou?: boolean;
  totalReviews: number;
  reviewsGained: number;
  growthRate: number; // signed percentage, e.g. 8.2 or -2.2
  position: number;
  positionHighlighted?: boolean;
  gmbLink: string;
  avatarColor: string; // tailwind bg class for the avatar
}

export interface CompetitorIntelligenceProps {
  title?: string;
  subtitle?: string;
  competitorCountLabel?: string;
  metrics?: MetricCardData[];
  rows?: CompetitorRow[];
  tableTitle?: string;
  defaultRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  onCompetitorCountClick?: () => void;
}

/* --------------------------- Default data -------------------------- */

const DEFAULT_METRICS: MetricCardData[] = [
  {
    id: "total-reviews",
    icon: "star",
    value: "178",
    label: "Your Total Reviews",
    badgeText: "0.2 pts",
    badgeTone: "positive",
  },
  {
    id: "review-growth",
    icon: "trend",
    value: "18.7%",
    label: "Your Review Growth",
    badgeText: "34 new",
    badgeTone: "positive",
  },
  {
    id: "competitor-average",
    icon: "calendar",
    value: "7.4%",
    label: "Competitor Average",
    badgeText: "",
    badgeTone: "neutral",
  },
  {
    id: "growth-difference",
    icon: "trendAhead",
    value: "+0.8%",
    label: "Growth Difference",
    badgeText: "Ahead",
    badgeTone: "positive",
  },
];

const DEFAULT_ROWS: CompetitorRow[] = [
  {
    id: "you",
    initials: "★",
    name: "Your Business",
    isYou: true,
    totalReviews: 203,
    reviewsGained: 16,
    growthRate: 8.2,
    position: 5,
    positionHighlighted: true,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-blue-600",
  },
  {
    id: "comp-a1",
    initials: "CA",
    name: "Competitor A",
    totalReviews: 203,
    reviewsGained: 16,
    growthRate: 8.2,
    position: 1,
    positionHighlighted: true,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "comp-a2",
    initials: "CA",
    name: "Competitor A",
    totalReviews: 203,
    reviewsGained: 16,
    growthRate: 8.2,
    position: 2,
    positionHighlighted: true,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "comp-d",
    initials: "FL",
    name: "Competitor D",
    totalReviews: 160,
    reviewsGained: 12,
    growthRate: 8.1,
    position: 3,
    positionHighlighted: true,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "comp-c",
    initials: "TX",
    name: "Competitor C",
    totalReviews: 175,
    reviewsGained: -4,
    growthRate: -2.2,
    position: 4,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "comp-f",
    initials: "WA",
    name: "Competitor F",
    totalReviews: 140,
    reviewsGained: -2,
    growthRate: -1.4,
    position: 6,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "comp-e",
    initials: "IL",
    name: "Competitor E",
    totalReviews: 150,
    reviewsGained: 7,
    growthRate: 4.9,
    position: 7,
    gmbLink: "g.page/r/bellascafe/review",
    avatarColor: "bg-indigo-500",
  },
];

/* ------------------------------ Icons ------------------------------ */

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6.2 6.6.7-4.9 4.6 1.4 6.5L12 17l-5.9 3.5 1.4-6.5-4.9-4.6 6.6-.7L12 2.5z" />
    </svg>
  );
}

function TrendUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function ArrowUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

function ArrowDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M21 3l-9 9" />
      <path d="M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6" />
    </svg>
  );
}

function metricIcon(icon: MetricCardData["icon"]) {
  switch (icon) {
    case "star":
      return <StarIcon className="h-5 w-5 text-white" />;
    case "calendar":
      return <CalendarIcon className="h-5 w-5 text-white" />;
    case "trend":
    case "trendAhead":
    default:
      return <TrendUpIcon className="h-5 w-5 text-white" />;
  }
}

/* ----------------------------- Helpers ------------------------------ */

function formatSigned(value: number, suffix = ""): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "+";
  return `${sign}${value}${suffix}`;
}

function positionBadgeClasses(highlighted?: boolean): string {
  return highlighted
    ? "bg-amber-100 text-amber-700"
    : "bg-slate-100 text-slate-500";
}

/* ------------------------------ Component ---------------------------- */

export default function CompetitorIntelligence({
  title = "Competitor Intelligence",
  subtitle = "See how your review growth compares with nearby competitors.",
  competitorCountLabel = "3 competitors",
  metrics = DEFAULT_METRICS,
  rows = DEFAULT_ROWS,
  tableTitle = "Your Business vs. Competitors",
  defaultRange = "30d",
  onRangeChange,
  onCompetitorCountClick,
}: CompetitorIntelligenceProps) {
  const [range, setRange] = useState<TimeRange>(defaultRange);

  const handleRangeChange = (next: TimeRange) => {
    setRange(next);
    onRangeChange?.(next);
  };

  const rangeOptions: { id: TimeRange; label: string }[] = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
  ];

  const columns = [
    "Business",
    "Total Reviews",
    "Reviews Gained",
    "Growth Rate",
    "Position",
    "GMB link",
  ];

  return (
    <section className="w-full">
      {/* ---------------------------- Header ---------------------------- */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onCompetitorCountClick}
            className="inline-flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {competitorCountLabel}
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </button>

          <div
            role="tablist"
            aria-label="Time range"
            className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:inline-flex"
          >
            {rangeOptions.map((opt) => {
              const active = opt.id === range;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleRangeChange(opt.id)}
                  className={[
                    "rounded-lg px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --------------------------- Metric cards --------------------------- */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                {metricIcon(metric.icon)}
              </div>
              {metric.badgeText ? (
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    metric.badgeTone === "positive"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  <ArrowUpIcon className="h-3 w-3" />
                  {metric.badgeText}
                </span>
              ) : (
                <span className="inline-block h-6" />
              )}
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900 sm:text-[26px]">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* ----------------------------- Table card ---------------------------- */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-slate-900">
            {tableTitle}
          </h3>
        </div>

        {/* Desktop / tablet: real table, scrolls horizontally only if needed */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] table-auto border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="whitespace-nowrap px-6 py-3 text-xs font-medium text-slate-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={[
                    "border-b border-slate-50 last:border-b-0",
                    row.isYou ? "bg-blue-50/60" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                          row.avatarColor,
                          row.isYou ? "rounded-xl" : "",
                        ].join(" ")}
                      >
                        {row.isYou ? (
                          <StarIcon className="h-4 w-4" />
                        ) : (
                          row.initials
                        )}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {row.name}
                      </span>
                      {row.isYou && (
                        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {row.totalReviews}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {formatSigned(row.reviewsGained)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={[
                        "inline-flex items-center gap-1 text-sm font-medium",
                        row.growthRate >= 0
                          ? "text-emerald-600"
                          : "text-red-500",
                      ].join(" ")}
                    >
                      {row.growthRate >= 0 ? (
                        <ArrowUpIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownIcon className="h-3.5 w-3.5" />
                      )}
                      {Math.abs(row.growthRate).toFixed(1)}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={[
                        "inline-flex min-w-[36px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold",
                        positionBadgeClasses(row.positionHighlighted),
                      ].join(" ")}
                    >
                      #{row.position}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      href={`https://${row.gmbLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {row.gmbLink}
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards, no horizontal scrolling required */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {rows.map((row) => (
            <li
              key={row.id}
              className={["p-4", row.isYou ? "bg-blue-50/60" : ""].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={[
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                      row.avatarColor,
                      row.isYou ? "rounded-xl" : "",
                    ].join(" ")}
                  >
                    {row.isYou ? (
                      <StarIcon className="h-4 w-4" />
                    ) : (
                      row.initials
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-800">
                        {row.name}
                      </span>
                      {row.isYou && (
                        <span className="flex-shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={[
                    "inline-flex flex-shrink-0 items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold",
                    positionBadgeClasses(row.positionHighlighted),
                  ].join(" ")}
                >
                  #{row.position}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 py-2">
                  <dt className="text-[11px] text-slate-400">Total</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                    {row.totalReviews}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                  <dt className="text-[11px] text-slate-400">Gained</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                    {formatSigned(row.reviewsGained)}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                  <dt className="text-[11px] text-slate-400">Growth</dt>
                  <dd
                    className={[
                      "mt-0.5 inline-flex items-center justify-center gap-0.5 text-sm font-semibold",
                      row.growthRate >= 0 ? "text-emerald-600" : "text-red-500",
                    ].join(" ")}
                  >
                    {row.growthRate >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    )}
                    {Math.abs(row.growthRate).toFixed(1)}%
                  </dd>
                </div>
              </dl>

              <a
                href={`https://${row.gmbLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                {row.gmbLink}
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
