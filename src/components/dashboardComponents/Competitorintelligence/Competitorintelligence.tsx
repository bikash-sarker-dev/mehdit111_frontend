// "use client";

// import React, { useState } from "react";

// /**
//  * CompetitorIntelligence
//  * -----------------------------------------------------------------------
//  * A single, self-contained component that reproduces the "Competitor
//  * Intelligence" review-growth dashboard: a header with filter controls,
//  * four summary metric cards, and a comparison table of the user's
//  * business against nearby competitors.
//  *
//  * - React + Next.js (client component)
//  * - TypeScript
//  * - Tailwind CSS only, no external UI libraries
//  * - Fully responsive: the table collapses into stacked cards on small
//  *   screens so nothing is cut off or requires horizontal scrolling to
//  *   read on mobile.
//  *
//  * Drop this file into your Next.js project (e.g. app/components/) and
//  * render <CompetitorIntelligence /> wherever you need it. All data is
//  * passed in as props with sensible defaults matching the reference
//  * design, so you can wire it up to real data later without touching
//  * the markup.
//  * -----------------------------------------------------------------------
//  */

// /* ----------------------------- Types ----------------------------- */

// type TimeRange = "7d" | "30d" | "90d";

// export interface MetricCardData {
//   id: string;
//   icon: "star" | "trend" | "calendar" | "trendAhead";
//   value: string;
//   label: string;
//   badgeText: string;
//   badgeTone: "positive" | "neutral";
// }

// export interface CompetitorRow {
//   id: string;
//   initials: string;
//   name: string;
//   isYou?: boolean;
//   totalReviews: number;
//   reviewsGained: number;
//   growthRate: number; // signed percentage, e.g. 8.2 or -2.2
//   position: number;
//   positionHighlighted?: boolean;
//   gmbLink: string;
//   avatarColor: string; // tailwind bg class for the avatar
// }

// export interface CompetitorIntelligenceProps {
//   title?: string;
//   subtitle?: string;
//   competitorCountLabel?: string;
//   metrics?: MetricCardData[];
//   rows?: CompetitorRow[];
//   tableTitle?: string;
//   defaultRange?: TimeRange;
//   onRangeChange?: (range: TimeRange) => void;
//   onCompetitorCountClick?: () => void;
// }

// /* --------------------------- Default data -------------------------- */

// const DEFAULT_METRICS: MetricCardData[] = [
//   {
//     id: "total-reviews",
//     icon: "star",
//     value: "178",
//     label: "Your Total Reviews",
//     badgeText: "0.2 pts",
//     badgeTone: "positive",
//   },
//   {
//     id: "review-growth",
//     icon: "trend",
//     value: "18.7%",
//     label: "Your Review Growth",
//     badgeText: "34 new",
//     badgeTone: "positive",
//   },
//   {
//     id: "competitor-average",
//     icon: "calendar",
//     value: "7.4%",
//     label: "Competitor Average",
//     badgeText: "",
//     badgeTone: "neutral",
//   },
//   {
//     id: "growth-difference",
//     icon: "trendAhead",
//     value: "+0.8%",
//     label: "Growth Difference",
//     badgeText: "Ahead",
//     badgeTone: "positive",
//   },
// ];

// const DEFAULT_ROWS: CompetitorRow[] = [
//   {
//     id: "you",
//     initials: "★",
//     name: "Your Business",
//     isYou: true,
//     totalReviews: 203,
//     reviewsGained: 16,
//     growthRate: 8.2,
//     position: 5,
//     positionHighlighted: true,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-blue-600",
//   },
//   {
//     id: "comp-a1",
//     initials: "CA",
//     name: "Competitor A",
//     totalReviews: 203,
//     reviewsGained: 16,
//     growthRate: 8.2,
//     position: 1,
//     positionHighlighted: true,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-indigo-500",
//   },
//   {
//     id: "comp-a2",
//     initials: "CA",
//     name: "Competitor A",
//     totalReviews: 203,
//     reviewsGained: 16,
//     growthRate: 8.2,
//     position: 2,
//     positionHighlighted: true,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-indigo-500",
//   },
//   {
//     id: "comp-d",
//     initials: "FL",
//     name: "Competitor D",
//     totalReviews: 160,
//     reviewsGained: 12,
//     growthRate: 8.1,
//     position: 3,
//     positionHighlighted: true,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-indigo-500",
//   },
//   {
//     id: "comp-c",
//     initials: "TX",
//     name: "Competitor C",
//     totalReviews: 175,
//     reviewsGained: -4,
//     growthRate: -2.2,
//     position: 4,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-indigo-500",
//   },
//   {
//     id: "comp-f",
//     initials: "WA",
//     name: "Competitor F",
//     totalReviews: 140,
//     reviewsGained: -2,
//     growthRate: -1.4,
//     position: 6,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-indigo-500",
//   },
//   {
//     id: "comp-e",
//     initials: "IL",
//     name: "Competitor E",
//     totalReviews: 150,
//     reviewsGained: 7,
//     growthRate: 4.9,
//     position: 7,
//     gmbLink: "g.page/r/bellascafe/review",
//     avatarColor: "bg-indigo-500",
//   },
// ];

// /* ------------------------------ Icons ------------------------------ */

// function StarIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M12 2.5l2.9 6.2 6.6.7-4.9 4.6 1.4 6.5L12 17l-5.9 3.5 1.4-6.5-4.9-4.6 6.6-.7L12 2.5z" />
//     </svg>
//   );
// }

// function TrendUpIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2.2}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M3 17l6-6 4 4 8-8" />
//       <path d="M15 7h6v6" />
//     </svg>
//   );
// }

// function CalendarIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2.2}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <rect x="3" y="5" width="18" height="16" rx="2" />
//       <path d="M3 10h18M8 3v4M16 3v4" />
//     </svg>
//   );
// }

// function ArrowUpIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2.5}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M12 19V5M6 11l6-6 6 6" />
//     </svg>
//   );
// }

// function ArrowDownIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2.5}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M12 5v14M6 13l6 6 6-6" />
//     </svg>
//   );
// }

// function ChevronDownIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2.2}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M6 9l6 6 6-6" />
//     </svg>
//   );
// }

// function ExternalLinkIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={2.2}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M14 3h7v7" />
//       <path d="M21 3l-9 9" />
//       <path d="M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6" />
//     </svg>
//   );
// }

// function metricIcon(icon: MetricCardData["icon"]) {
//   switch (icon) {
//     case "star":
//       return <StarIcon className="h-5 w-5 text-white" />;
//     case "calendar":
//       return <CalendarIcon className="h-5 w-5 text-white" />;
//     case "trend":
//     case "trendAhead":
//     default:
//       return <TrendUpIcon className="h-5 w-5 text-white" />;
//   }
// }

// /* ----------------------------- Helpers ------------------------------ */

// function formatSigned(value: number, suffix = ""): string {
//   const sign = value > 0 ? "+" : value < 0 ? "" : "+";
//   return `${sign}${value}${suffix}`;
// }

// function positionBadgeClasses(highlighted?: boolean): string {
//   return highlighted
//     ? "bg-amber-100 text-amber-700"
//     : "bg-slate-100 text-slate-500";
// }

// /* ------------------------------ Component ---------------------------- */

// export default function CompetitorIntelligence({
//   title = "Competitor Intelligence",
//   subtitle = "See how your review growth compares with nearby competitors.",
//   competitorCountLabel = "3 competitors",
//   metrics = DEFAULT_METRICS,
//   rows = DEFAULT_ROWS,
//   tableTitle = "Your Business vs. Competitors",
//   defaultRange = "30d",
//   onRangeChange,
//   onCompetitorCountClick,
// }: CompetitorIntelligenceProps) {
//   const [range, setRange] = useState<TimeRange>(defaultRange);

//   const handleRangeChange = (next: TimeRange) => {
//     setRange(next);
//     onRangeChange?.(next);
//   };

//   const rangeOptions: { id: TimeRange; label: string }[] = [
//     { id: "7d", label: "7 Days" },
//     { id: "30d", label: "30 Days" },
//     { id: "90d", label: "90 Days" },
//   ];

//   const columns = [
//     "Business",
//     "Total Reviews",
//     "Reviews Gained",
//     "Growth Rate",
//     "Position",
//     "GMB link",
//   ];

//   return (
//     <section className="w-full">
//       {/* ---------------------------- Header ---------------------------- */}
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//         <div className="min-w-0">
//           <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
//             {title}
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
//         </div>

//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//           <button
//             type="button"
//             onClick={onCompetitorCountClick}
//             className="inline-flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//           >
//             {competitorCountLabel}
//             <ChevronDownIcon className="h-4 w-4 text-slate-400" />
//           </button>

//           <div
//             role="tablist"
//             aria-label="Time range"
//             className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:inline-flex"
//           >
//             {rangeOptions.map((opt) => {
//               const active = opt.id === range;
//               return (
//                 <button
//                   key={opt.id}
//                   type="button"
//                   role="tab"
//                   aria-selected={active}
//                   onClick={() => handleRangeChange(opt.id)}
//                   className={[
//                     "rounded-lg px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
//                     active
//                       ? "bg-blue-600 text-white shadow-sm"
//                       : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
//                   ].join(" ")}
//                 >
//                   {opt.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* --------------------------- Metric cards --------------------------- */}
//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {metrics.map((metric) => (
//           <div
//             key={metric.id}
//             className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
//           >
//             <div className="flex items-start justify-between">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
//                 {metricIcon(metric.icon)}
//               </div>
//               {metric.badgeText ? (
//                 <span
//                   className={[
//                     "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
//                     metric.badgeTone === "positive"
//                       ? "bg-emerald-50 text-emerald-600"
//                       : "bg-slate-100 text-slate-500",
//                   ].join(" ")}
//                 >
//                   <ArrowUpIcon className="h-3 w-3" />
//                   {metric.badgeText}
//                 </span>
//               ) : (
//                 <span className="inline-block h-6" />
//               )}
//             </div>

//             <p className="mt-4 text-2xl font-semibold text-slate-900 sm:text-[26px]">
//               {metric.value}
//             </p>
//             <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* ----------------------------- Table card ---------------------------- */}
//       <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
//           <h3 className="text-base font-semibold text-slate-900">
//             {tableTitle}
//           </h3>
//         </div>

//         {/* Desktop / tablet: real table, scrolls horizontally only if needed */}
//         <div className="hidden overflow-x-auto md:block">
//           <table className="w-full min-w-[760px] table-auto border-collapse text-left">
//             <thead>
//               <tr className="border-b border-slate-100">
//                 {columns.map((col) => (
//                   <th
//                     key={col}
//                     scope="col"
//                     className="whitespace-nowrap px-6 py-3 text-xs font-medium text-slate-400"
//                   >
//                     {col}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row) => (
//                 <tr
//                   key={row.id}
//                   className={[
//                     "border-b border-slate-50 last:border-b-0",
//                     row.isYou ? "bg-blue-50/60" : "hover:bg-slate-50",
//                   ].join(" ")}
//                 >
//                   <td className="whitespace-nowrap px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <span
//                         className={[
//                           "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
//                           row.avatarColor,
//                           row.isYou ? "rounded-xl" : "",
//                         ].join(" ")}
//                       >
//                         {row.isYou ? (
//                           <StarIcon className="h-4 w-4" />
//                         ) : (
//                           row.initials
//                         )}
//                       </span>
//                       <span className="text-sm font-medium text-slate-800">
//                         {row.name}
//                       </span>
//                       {row.isYou && (
//                         <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
//                           You
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
//                     {row.totalReviews}
//                   </td>
//                   <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
//                     {formatSigned(row.reviewsGained)}
//                   </td>
//                   <td className="whitespace-nowrap px-6 py-4">
//                     <span
//                       className={[
//                         "inline-flex items-center gap-1 text-sm font-medium",
//                         row.growthRate >= 0
//                           ? "text-emerald-600"
//                           : "text-red-500",
//                       ].join(" ")}
//                     >
//                       {row.growthRate >= 0 ? (
//                         <ArrowUpIcon className="h-3.5 w-3.5" />
//                       ) : (
//                         <ArrowDownIcon className="h-3.5 w-3.5" />
//                       )}
//                       {Math.abs(row.growthRate).toFixed(1)}%
//                     </span>
//                   </td>
//                   <td className="whitespace-nowrap px-6 py-4">
//                     <span
//                       className={[
//                         "inline-flex min-w-[36px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold",
//                         positionBadgeClasses(row.positionHighlighted),
//                       ].join(" ")}
//                     >
//                       #{row.position}
//                     </span>
//                   </td>
//                   <td className="whitespace-nowrap px-6 py-4">
//                     <a
//                       href={`https://${row.gmbLink}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
//                     >
//                       {row.gmbLink}
//                       <ExternalLinkIcon className="h-3.5 w-3.5" />
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile: stacked cards, no horizontal scrolling required */}
//         <ul className="divide-y divide-slate-100 md:hidden">
//           {rows.map((row) => (
//             <li
//               key={row.id}
//               className={["p-4", row.isYou ? "bg-blue-50/60" : ""].join(" ")}
//             >
//               <div className="flex items-center justify-between gap-3">
//                 <div className="flex min-w-0 items-center gap-3">
//                   <span
//                     className={[
//                       "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
//                       row.avatarColor,
//                       row.isYou ? "rounded-xl" : "",
//                     ].join(" ")}
//                   >
//                     {row.isYou ? (
//                       <StarIcon className="h-4 w-4" />
//                     ) : (
//                       row.initials
//                     )}
//                   </span>
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2">
//                       <span className="truncate text-sm font-medium text-slate-800">
//                         {row.name}
//                       </span>
//                       {row.isYou && (
//                         <span className="flex-shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
//                           You
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <span
//                   className={[
//                     "inline-flex flex-shrink-0 items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold",
//                     positionBadgeClasses(row.positionHighlighted),
//                   ].join(" ")}
//                 >
//                   #{row.position}
//                 </span>
//               </div>

//               <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
//                 <div className="rounded-lg bg-slate-50 py-2">
//                   <dt className="text-[11px] text-slate-400">Total</dt>
//                   <dd className="mt-0.5 text-sm font-semibold text-slate-800">
//                     {row.totalReviews}
//                   </dd>
//                 </div>
//                 <div className="rounded-lg bg-slate-50 py-2">
//                   <dt className="text-[11px] text-slate-400">Gained</dt>
//                   <dd className="mt-0.5 text-sm font-semibold text-slate-800">
//                     {formatSigned(row.reviewsGained)}
//                   </dd>
//                 </div>
//                 <div className="rounded-lg bg-slate-50 py-2">
//                   <dt className="text-[11px] text-slate-400">Growth</dt>
//                   <dd
//                     className={[
//                       "mt-0.5 inline-flex items-center justify-center gap-0.5 text-sm font-semibold",
//                       row.growthRate >= 0 ? "text-emerald-600" : "text-red-500",
//                     ].join(" ")}
//                   >
//                     {row.growthRate >= 0 ? (
//                       <ArrowUpIcon className="h-3 w-3" />
//                     ) : (
//                       <ArrowDownIcon className="h-3 w-3" />
//                     )}
//                     {Math.abs(row.growthRate).toFixed(1)}%
//                   </dd>
//                 </div>
//               </dl>

//               <a
//                 href={`https://${row.gmbLink}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
//               >
//                 {row.gmbLink}
//                 <ExternalLinkIcon className="h-3.5 w-3.5" />
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </section>
//   );
// }
"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import {
  useGetCompetitorStatsQuery,
  useGetCompetitorsAllQuery,
  useSearchLocalCompetitorsQuery,
} from "@/redux/api/userDashboard/competitor/competitorsApi";

/**
 * CompetitorIntelligence
 * -----------------------------------------------------------------------
 * Data flow
 *   1. useGetMeProfileQuery()  -> businessId (cached by RTK Query, so every
 *      remount/navigation reuses it without another network request)
 *   2. useGetCompetitorStatsQuery({ businessId })      -> metric cards, ranks
 *   3. useGetCompetitorsAllQuery({ businessId, page })  -> paginated table
 *   4. useSearchLocalCompetitorsQuery(query)            -> debounced search
 *
 * Tailwind only, no extra UI libraries. Table collapses into cards on mobile.
 * -----------------------------------------------------------------------
 */

/* ------------------------------ Types ------------------------------ */

interface ApiEnvelope<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

interface ProfileData {
  id: string;
  name: string;
  businessId?: string;
  businesses?: Array<{
    id: string;
    name: string;
    googleMapsUrl?: string | null;
  }>;
}

interface CompetitorStats {
  businessId: string;
  businessName: string;
  myBusiness: {
    rating: number;
    userRatingsTotal: number;
    ratingRank: number;
    volumeRank: number;
    totalTracked: number;
  };
  marketAverages: { averageRating: number; averageReviewVolume: number };
  leaderboard: Array<{
    rank: number;
    name: string;
    rating: number;
    userRatingsTotal: number;
    isMyBusiness: boolean;
  }>;
  gaps: {
    topRatingLeader?: { name: string; rating: number } | null;
    topVolumeLeader?: { name: string; reviews: number } | null;
    reviewsNeededToOvertakeVolumeLeader: number;
    ratingDifferenceFromLeader: number;
  };
  insight?: string;
}

interface TrackedCompetitor {
  id: string;
  businessId: string;
  name: string;
  placeId: string;
  address?: string | null;
  rating: number;
  userRatingsTotal: number;
  lastSyncedAt?: string;
}

interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CompetitorsPage {
  meta: PageMeta;
  data: TrackedCompetitor[];
}

export interface SearchResult {
  placeId: string;
  name: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
}

interface MetricCardData {
  id: string;
  icon: "star" | "trend" | "calendar" | "trendAhead";
  value: string;
  label: string;
  badgeText: string;
  badgeTone: "positive" | "neutral" | "negative";
}

interface TableRow {
  id: string;
  name: string;
  address?: string | null;
  isYou?: boolean;
  rating: number;
  totalReviews: number;
  reviewLead?: number; // positive = you are ahead
  ratingLead?: number; // positive = you are ahead
  rank?: number;
  mapsUrl?: string;
}

export interface CompetitorIntelligenceProps {
  title?: string;
  subtitle?: string;
  defaultPageSize?: number;
  searchPageSize?: number;
  minSearchLength?: number;
  debounceMs?: number;
}

/* ----------------------------- Helpers ----------------------------- */

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

type SortBy = "rating" | "userRatingsTotal" | "name";
type SortOrder = "asc" | "desc";

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "rating", label: "Rating" },
  { value: "userRatingsTotal", label: "Total reviews" },
  { value: "name", label: "Name" },
];

const TABLE_COLUMNS: Array<{ label: string; sort?: SortBy }> = [
  { label: "Business", sort: "name" },
  { label: "Rating", sort: "rating" },
  { label: "Total reviews", sort: "userRatingsTotal" },
  { label: "Review lead" },
  { label: "Rating lead" },
  { label: "Rank" },
  { label: "Google Maps" },
];

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-amber-500",
];

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

function unwrap<T>(response: unknown): T | undefined {
  return (response as ApiEnvelope<T> | undefined)?.data;
}

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as
    | { data?: { message?: string }; error?: string; message?: string }
    | undefined;
  return e?.data?.message ?? e?.error ?? e?.message ?? fallback;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function signed(n: number, decimals = 0): string {
  const v = decimals ? n.toFixed(decimals) : String(n);
  return n > 0 ? `+${v}` : v;
}

function mapsUrlFor(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * The search endpoint's payload shape isn't documented, so this accepts the
 * common variants: data: [] | data.data: [] | data.results: []
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeSearchResults(payload: unknown): SearchResult[] {
  const root: any = (payload as any)?.data ?? payload;
  const list: any[] = Array.isArray(root)
    ? root
    : Array.isArray(root?.data)
      ? root.data
      : Array.isArray(root?.results)
        ? root.results
        : [];

  return list
    .map((item) => ({
      placeId: String(item.placeId ?? item.place_id ?? item.id ?? ""),
      name: String(item.name ?? item.title ?? "Unnamed place"),
      address: item.address ?? item.formatted_address ?? item.vicinity,
      rating: typeof item.rating === "number" ? item.rating : undefined,
      userRatingsTotal:
        item.userRatingsTotal ?? item.user_ratings_total ?? undefined,
    }))
    .filter((r) => r.placeId || r.name);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function getPageItems(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: Array<number | "gap-start" | "gap-end"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("gap-start");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("gap-end");
  items.push(total);
  return items;
}

/* ------------------------------ Icons ------------------------------ */

function Svg({
  className = "",
  strokeWidth = 2.2,
  children,
}: {
  className?: string;
  strokeWidth?: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

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
const TrendUpIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Svg>
);
const CalendarIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);
const ArrowUpIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className} strokeWidth={2.5}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Svg>
);
const ArrowDownIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className} strokeWidth={2.5}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
);
const ExternalLinkIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <path d="M14 3h7v7" />
    <path d="M21 3l-9 9" />
    <path d="M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6" />
  </Svg>
);
const SearchIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);
const CloseIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
const ChevronLeftIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);
const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);
const RefreshIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <path d="M20 11a8 8 0 00-14.9-3M4 5v4h4" />
    <path d="M4 13a8 8 0 0014.9 3M20 19v-4h-4" />
  </Svg>
);
const AlertIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5v.01" />
  </Svg>
);
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <Svg className={className} strokeWidth={2.6}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cx("animate-spin motion-reduce:animate-none", className)}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SortIcon({ order }: { order: SortOrder | null }) {
  if (order === "asc") return <ArrowUpIcon className="h-3 w-3" />;
  if (order === "desc") return <ArrowDownIcon className="h-3 w-3" />;
  return (
    <Svg className="h-3 w-3 text-slate-300">
      <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </Svg>
  );
}

function metricIcon(icon: MetricCardData["icon"]) {
  const cls = "h-5 w-5 text-white";
  if (icon === "star") return <StarIcon className={cls} />;
  if (icon === "calendar") return <CalendarIcon className={cls} />;
  return <TrendUpIcon className={cls} />;
}

/* --------------------------- Small components --------------------------- */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx(
        "animate-pulse rounded-lg bg-slate-100 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

function Avatar({
  name,
  isYou,
  size = "md",
}: {
  name: string;
  isYou?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <span
      className={cx(
        "flex flex-shrink-0 items-center justify-center font-semibold text-white",
        size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs",
        isYou ? "rounded-xl bg-blue-600" : cx("rounded-full", colorFor(name)),
      )}
    >
      {isYou ? <StarIcon className="h-4 w-4" /> : initialsOf(name)}
    </span>
  );
}

function RatingPill({ rating }: { rating?: number }) {
  if (typeof rating !== "number")
    return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-800">
      <StarIcon className="h-3.5 w-3.5 text-amber-400" />
      {rating.toFixed(1)}
    </span>
  );
}

function Lead({ value, decimals = 0 }: { value?: number; decimals?: number }) {
  if (value === undefined) {
    return <span className="text-slate-300">—</span>;
  }
  if (value === 0) {
    return <span className="text-sm font-medium text-slate-400">Even</span>;
  }
  const ahead = value > 0;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 text-sm font-medium",
        ahead ? "text-emerald-600" : "text-red-500",
      )}
      title={ahead ? "You're ahead" : "They're ahead"}
    >
      {ahead ? (
        <ArrowUpIcon className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownIcon className="h-3.5 w-3.5" />
      )}
      {signed(value, decimals).replace("-", "−")}
    </span>
  );
}

function RankBadge({
  rank,
  highlight,
}: {
  rank?: number;
  highlight?: boolean;
}) {
  if (!rank) return <span className="text-slate-400">—</span>;
  return (
    <span
      className={cx(
        "inline-flex min-w-[36px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold",
        highlight
          ? "bg-amber-100 text-amber-700"
          : "bg-slate-100 text-slate-500",
      )}
    >
      #{rank}
    </span>
  );
}

function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2.5 text-sm text-red-700">
        <AlertIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:self-auto"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      {hint && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{hint}</p>
      )}
    </div>
  );
}

/* ------------------------------ Pagination ------------------------------ */

function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions,
  busy,
  noun,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  busy?: boolean;
  noun: string;
}) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const items = getPageItems(page, totalPages);

  const navBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <p aria-live="polite">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {from}–{to}
          </span>{" "}
          of <span className="font-medium text-slate-700">{total}</span> {noun}
        </p>
        {onLimitChange && limitOptions && (
          <label className="flex items-center gap-2">
            <span className="sr-only">Rows per page</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white py-1 pl-2 pr-6 text-sm text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </label>
        )}
        {busy && <Spinner className="h-4 w-4 text-blue-600" />}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label={`${noun} pagination`}
          className="flex items-center gap-1"
        >
          <button
            type="button"
            className={navBtn}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {items.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cx(
                  "h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  item === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {item}
              </button>
            ) : (
              <span
                key={item}
                className="px-1 text-slate-400"
                aria-hidden="true"
              >
                …
              </span>
            ),
          )}

          <button
            type="button"
            className={navBtn}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

/* ------------------------------ Component ------------------------------ */

export default function CompetitorIntelligence({
  title = "Competitor Intelligence",
  subtitle = "See how your reviews and rating compare with nearby competitors.",
  defaultPageSize = 10,
  searchPageSize = 5,
  minSearchLength = 2,
  debounceMs = 400,
}: CompetitorIntelligenceProps) {
  /* ---- local state ---- */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [term, setTerm] = useState("");
  const [searchPage, setSearchPage] = useState(1);

  const trimmed = term.trim();
  const debouncedTerm = useDebouncedValue(trimmed, debounceMs);
  const searchEnabled = debouncedTerm.length >= minSearchLength;

  /* ---- 1. profile -> businessId (cached by RTK Query) ---- */
  const profileQ = useGetMeProfileQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const profile = unwrap<ProfileData>(profileQ.data);
  const businessId = profile?.businessId ?? profile?.businesses?.[0]?.id;
  const myBusinessProfile = profile?.businesses?.find(
    (b) => b.id === businessId,
  );
  const skip = !businessId;

  /* ---- 2. benchmark stats ---- */
  const statsQ = useGetCompetitorStatsQuery(businessId as string, { skip });
  const stats = unwrap<CompetitorStats>(statsQ.data);

  /* ---- 3. tracked competitors (paginated) ---- */
  const listQ = useGetCompetitorsAllQuery(
    { businessId: businessId as string, page, limit, sortBy, sortOrder },
    { skip },
  );
  const list = unwrap<CompetitorsPage>(listQ.data);
  const meta = list?.meta;

  /* ---- 4. search ---- */
  const searchQ = useSearchLocalCompetitorsQuery(debouncedTerm, {
    skip: !searchEnabled,
  });

  /* ---- effects: keep pagination in range ---- */
  useEffect(() => {
    if (meta && meta.totalPages > 0 && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
  }, [meta, page]);

  useEffect(() => {
    setSearchPage(1);
  }, [debouncedTerm]);

  /* ---- derived: metric cards ---- */
  const metrics = useMemo<MetricCardData[]>(() => {
    if (!stats) return [];
    const { myBusiness, marketAverages, gaps } = stats;
    const leader = gaps.topRatingLeader;
    const behindOnRating = gaps.ratingDifferenceFromLeader < 0;

    return [
      {
        id: "total-reviews",
        icon: "star",
        value: myBusiness.userRatingsTotal.toLocaleString(),
        label: "Your total reviews",
        badgeText: `#${myBusiness.volumeRank} of ${myBusiness.totalTracked}`,
        badgeTone: myBusiness.volumeRank === 1 ? "positive" : "neutral",
      },
      {
        id: "rating",
        icon: "trend",
        value: myBusiness.rating.toFixed(1),
        label: "Your average rating",
        badgeText: `#${myBusiness.ratingRank} of ${myBusiness.totalTracked}`,
        badgeTone: myBusiness.ratingRank === 1 ? "positive" : "neutral",
      },
      {
        id: "market-average",
        icon: "calendar",
        value: marketAverages.averageRating.toFixed(1),
        label: "Market average rating",
        badgeText: `${marketAverages.averageReviewVolume.toLocaleString()} avg reviews`,
        badgeTone: "neutral",
      },
      {
        id: "rating-gap",
        icon: "trendAhead",
        value: signed(round1(gaps.ratingDifferenceFromLeader), 1).replace(
          "-",
          "−",
        ),
        label: leader ? `Rating gap to ${leader.name}` : "Rating gap to leader",
        badgeText:
          gaps.reviewsNeededToOvertakeVolumeLeader === 0
            ? "Review leader"
            : `${gaps.reviewsNeededToOvertakeVolumeLeader.toLocaleString()} reviews to lead`,
        badgeTone: behindOnRating ? "negative" : "positive",
      },
    ];
  }, [stats]);

  /* ---- derived: table rows (your row is pinned on every page) ---- */
  const rows = useMemo<TableRow[]>(() => {
    const mine = stats?.myBusiness;
    const rankByName = new Map(
      (stats?.leaderboard ?? []).map((l) => [
        l.name.trim().toLowerCase(),
        l.rank,
      ]),
    );

    const youRow: TableRow | null =
      stats && mine
        ? {
            id: "you",
            name: stats.businessName,
            isYou: true,
            rating: mine.rating,
            totalReviews: mine.userRatingsTotal,
            rank: mine.ratingRank,
            mapsUrl: myBusinessProfile?.googleMapsUrl ?? undefined,
          }
        : null;

    const competitorRows: TableRow[] = (list?.data ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      address: c.address,
      rating: c.rating,
      totalReviews: c.userRatingsTotal,
      reviewLead: mine ? mine.userRatingsTotal - c.userRatingsTotal : undefined,
      ratingLead: mine ? round1(mine.rating - c.rating) : undefined,
      rank: rankByName.get(c.name.trim().toLowerCase()),
      mapsUrl: c.placeId ? mapsUrlFor(c.placeId) : undefined,
    }));

    return youRow ? [youRow, ...competitorRows] : competitorRows;
  }, [stats, list, myBusinessProfile]);

  /* ---- derived: search ---- */
  const results = useMemo(
    () => (searchEnabled ? normalizeSearchResults(searchQ.currentData) : []),
    [searchEnabled, searchQ.currentData],
  );
  const searchTotalPages = Math.max(
    1,
    Math.ceil(results.length / searchPageSize),
  );
  const pagedResults = results.slice(
    (searchPage - 1) * searchPageSize,
    searchPage * searchPageSize,
  );
  const searchPending =
    trimmed.length >= minSearchLength &&
    (trimmed !== debouncedTerm || searchQ.isFetching);

  const trackedPlaceIds = useMemo(
    () => new Set((list?.data ?? []).map((c) => c.placeId)),
    [list],
  );
  const trackedNames = useMemo(
    () =>
      new Set(
        (stats?.leaderboard ?? []).map((l) => l.name.trim().toLowerCase()),
      ),
    [stats],
  );
  const isTracked = (r: SearchResult) =>
    (r.placeId && trackedPlaceIds.has(r.placeId)) ||
    trackedNames.has(r.name.trim().toLowerCase());

  /* ---- handlers ---- */
  const handleRefresh = () => {
    profileQ.refetch();
    statsQ.refetch();
    listQ.refetch();
  };

  const handleSort = (next: SortBy) => {
    if (next === sortBy) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(next);
      setSortOrder(next === "name" ? "asc" : "desc");
    }
    setPage(1);
  };

  const handleLimitChange = (next: number) => {
    setLimit(next);
    setPage(1);
  };

  const refreshing = statsQ.isFetching || listQ.isFetching;
  const coreLoading =
    profileQ.isLoading || (!skip && (statsQ.isLoading || listQ.isLoading));

  /* ------------------------------- Render ------------------------------- */

  // Profile failed, or the user has no business yet
  if (profileQ.isError) {
    return (
      <section className="w-full">
        <InlineError
          message={getErrorMessage(
            profileQ.error,
            "We couldn't load your profile.",
          )}
          onRetry={() => profileQ.refetch()}
        />
      </section>
    );
  }
  if (!profileQ.isLoading && profile && !businessId) {
    return (
      <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EmptyState
          title="No business connected yet"
          hint="Finish setting up your business profile to start comparing with competitors."
        />
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* ---------------------------- Header ---------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {meta && (
            <span className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
              {meta.total} {meta.total === 1 ? "competitor" : "competitors"}{" "}
              tracked
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || skip}
            aria-label="Refresh data"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            <RefreshIcon
              className={cx(
                "h-4 w-4",
                refreshing && "animate-spin motion-reduce:animate-none",
              )}
            />
          </button>
        </div>
      </div>

      {/* --------------------------- Metric cards --------------------------- */}
      <div className="mt-6">
        {statsQ.isError ? (
          <InlineError
            message={getErrorMessage(
              statsQ.error,
              "We couldn't load your benchmark stats.",
            )}
            onRetry={() => statsQ.refetch()}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {coreLoading || !stats
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="mt-4 h-7 w-24" />
                    <Skeleton className="mt-2 h-4 w-36" />
                  </div>
                ))
              : metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600">
                        {metricIcon(metric.icon)}
                      </div>
                      <span
                        className={cx(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                          metric.badgeTone === "positive" &&
                            "bg-emerald-50 text-emerald-600",
                          metric.badgeTone === "negative" &&
                            "bg-red-50 text-red-500",
                          metric.badgeTone === "neutral" &&
                            "bg-slate-100 text-slate-500",
                        )}
                      >
                        {metric.badgeTone === "positive" && (
                          <ArrowUpIcon className="h-3 w-3" />
                        )}
                        {metric.badgeTone === "negative" && (
                          <ArrowDownIcon className="h-3 w-3" />
                        )}
                        {metric.badgeText}
                      </span>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-slate-900 sm:text-[26px]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {metric.label}
                    </p>
                  </div>
                ))}
          </div>
        )}

        {stats?.insight && (
          <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
            {stats.insight}
          </p>
        )}
      </div>

      {/* ------------------------------ Search ------------------------------ */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-slate-900">
            Find local competitors
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Search Google for businesses near you. Add the business type and
            city for the best results.
          </p>

          <div className="relative mt-4">
            <label htmlFor="competitor-search" className="sr-only">
              Search local competitors
            </label>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="competitor-search"
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setTerm("");
              }}
              placeholder="e.g. Coffee Shop Amsterdam"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-20 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              {searchPending && <Spinner className="h-4 w-4 text-blue-600" />}
              {term && (
                <button
                  type="button"
                  onClick={() => setTerm("")}
                  aria-label="Clear search"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results area */}
        {trimmed.length > 0 && (
          <div className="border-t border-slate-100" aria-live="polite">
            {trimmed.length < minSearchLength ? (
              <p className="px-5 py-6 text-sm text-slate-500 sm:px-6">
                Type at least {minSearchLength} characters to search.
              </p>
            ) : searchPending && results.length === 0 ? (
              <ul className="divide-y divide-slate-100" aria-busy="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-5 py-4 sm:px-6"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48 max-w-full" />
                      <Skeleton className="h-3 w-72 max-w-full" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : searchQ.isError ? (
              <div className="p-4 sm:p-5">
                <InlineError
                  message={getErrorMessage(
                    searchQ.error,
                    "Search failed. Check your connection and try again.",
                  )}
                  onRetry={() => searchQ.refetch()}
                />
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                title={`No places found for “${debouncedTerm}”`}
                hint="Try a different spelling, or add the city name."
              />
            ) : (
              <>
                <ul
                  className={cx(
                    "divide-y divide-slate-100",
                    searchPending && "opacity-60",
                  )}
                >
                  {pagedResults.map((r) => {
                    const key = r.placeId || r.name;
                    const tracked = isTracked(r);
                    return (
                      <li
                        key={key}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={r.name} size="lg" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {r.name}
                            </p>
                            {r.address && (
                              <p className="truncate text-sm text-slate-500">
                                {r.address}
                              </p>
                            )}
                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                              <RatingPill rating={r.rating} />
                              {typeof r.userRatingsTotal === "number" && (
                                <span>
                                  {r.userRatingsTotal.toLocaleString()} reviews
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2 pl-13 sm:pl-0">
                          {r.placeId && (
                            <a
                              href={mapsUrlFor(r.placeId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              View on Maps
                              <ExternalLinkIcon className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {tracked ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm font-medium text-emerald-600">
                              <CheckIcon className="h-3.5 w-3.5" />
                              Tracking
                            </span>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <Pagination
                  page={searchPage}
                  totalPages={searchTotalPages}
                  total={results.length}
                  limit={searchPageSize}
                  onPageChange={setSearchPage}
                  noun="places"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------- Table card ---------------------------- */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-slate-900">
            Your business vs. competitors
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Green means you&apos;re ahead of that competitor, red means
            they&apos;re ahead.
          </p>
        </div>

        {listQ.isError ? (
          <div className="p-4 sm:p-5">
            <InlineError
              message={getErrorMessage(
                listQ.error,
                "We couldn't load your competitors.",
              )}
              onRetry={() => listQ.refetch()}
            />
          </div>
        ) : profileQ.isLoading || listQ.isLoading ? (
          <div className="space-y-3 p-5 sm:p-6" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div
            className={cx(
              "transition-opacity",
              listQ.isFetching && "opacity-60",
            )}
          >
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px] table-auto border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {TABLE_COLUMNS.map((col) => {
                      const active = col.sort === sortBy;
                      return (
                        <th
                          key={col.label}
                          scope="col"
                          aria-sort={
                            col.sort
                              ? active
                                ? sortOrder === "asc"
                                  ? "ascending"
                                  : "descending"
                                : "none"
                              : undefined
                          }
                          className="whitespace-nowrap px-6 py-3 text-xs font-medium text-slate-400"
                        >
                          {col.sort ? (
                            <button
                              type="button"
                              onClick={() => handleSort(col.sort as SortBy)}
                              className={cx(
                                "inline-flex items-center gap-1 rounded transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                active && "text-slate-700",
                              )}
                            >
                              {col.label}
                              <SortIcon order={active ? sortOrder : null} />
                            </button>
                          ) : (
                            col.label
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cx(
                        "border-b border-slate-50 last:border-b-0",
                        row.isYou ? "bg-blue-50/60" : "hover:bg-slate-50",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={row.name} isYou={row.isYou} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-800">
                                {row.name}
                              </span>
                              {row.isYou && (
                                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
                                  You
                                </span>
                              )}
                            </div>
                            {row.address && (
                              <p className="mt-0.5 max-w-[260px] truncate text-xs text-slate-400">
                                {row.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <RatingPill rating={row.rating} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {row.totalReviews.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {row.isYou ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          <Lead value={row.reviewLead} />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {row.isYou ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          <Lead value={row.ratingLead} decimals={1} />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <RankBadge
                          rank={row.rank}
                          highlight={!!row.rank && row.rank <= 3}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {row.mapsUrl ? (
                          <a
                            href={row.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            View
                            <ExternalLinkIcon className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 md:hidden">
              <label
                htmlFor="competitor-sort"
                className="text-xs text-slate-500"
              >
                Sort by
              </label>
              <select
                id="competitor-sort"
                value={sortBy}
                onChange={(e) => {
                  const next = e.target.value as SortBy;
                  setSortBy(next);
                  setSortOrder(next === "name" ? "asc" : "desc");
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white py-1 pl-2 pr-6 text-sm text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
                  setPage(1);
                }}
                aria-label={
                  sortOrder === "desc"
                    ? "Sorted descending, switch to ascending"
                    : "Sorted ascending, switch to descending"
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <SortIcon order={sortOrder} />
              </button>
            </div>

            <ul className="divide-y divide-slate-100 md:hidden">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className={cx("p-4", row.isYou && "bg-blue-50/60")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={row.name} isYou={row.isYou} />
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
                        {row.address && (
                          <p className="truncate text-xs text-slate-400">
                            {row.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <RankBadge
                      rank={row.rank}
                      highlight={!!row.rank && row.rank <= 3}
                    />
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                    <div className="rounded-lg bg-slate-50 py-2">
                      <dt className="text-[11px] text-slate-400">Rating</dt>
                      <dd className="mt-0.5 flex justify-center">
                        <RatingPill rating={row.rating} />
                      </dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <dt className="text-[11px] text-slate-400">Reviews</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                        {row.totalReviews.toLocaleString()}
                      </dd>
                    </div>
                    {!row.isYou && (
                      <>
                        <div className="rounded-lg bg-slate-50 py-2">
                          <dt className="text-[11px] text-slate-400">
                            Review lead
                          </dt>
                          <dd className="mt-0.5 flex justify-center">
                            <Lead value={row.reviewLead} />
                          </dd>
                        </div>
                        <div className="rounded-lg bg-slate-50 py-2">
                          <dt className="text-[11px] text-slate-400">
                            Rating lead
                          </dt>
                          <dd className="mt-0.5 flex justify-center">
                            <Lead value={row.ratingLead} decimals={1} />
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>

                  {row.mapsUrl && (
                    <a
                      href={row.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View on Google Maps
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {list && list.data.length === 0 && (
              <EmptyState
                title="You're not tracking any competitors yet"
                hint="Use the search above to find nearby businesses and compare their reviews with yours."
              />
            )}

            {meta && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
                limitOptions={PAGE_SIZE_OPTIONS}
                busy={listQ.isFetching}
                noun="competitors"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
