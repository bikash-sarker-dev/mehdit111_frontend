// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   Star,
//   TrendingUp,
//   Calendar,
//   Lightbulb,
//   Zap,
//   Plus,
//   ArrowRight,
//   AlertTriangle,
// } from "lucide-react";

// /**
//  * ReviewDashboard
//  * -----------------------------------------------------------------------
//  * A single, self-contained review-growth dashboard component.
//  * Stack: React + Next.js (App Router, "use client") + TypeScript + Tailwind CSS.
//  * Fully responsive: stacks to a single column on mobile, 2-col on tablet,
//  * 4-col stat row + 2-col main grid on desktop.
//  *
//  * Drop this file into e.g. `app/components/ReviewDashboard.tsx` and render
//  * `<ReviewDashboard />` anywhere. All data is passed via the `data` prop
//  * with sensible defaults matching the reference design, so it works
//  * out of the box and is easy to wire up to real data later.
//  * -----------------------------------------------------------------------
//  */

// type Period = "7 Days" | "30 Days" | "90 Days" | "12 Months";

// interface StatCard {
//   icon: React.ReactNode;
//   value: string;
//   label: string;
//   sublabel: string;
//   delta: string;
// }

// interface RequestRow {
//   label: string;
//   value: number;
//   total: number;
//   barColor: string;
// }

// interface ReviewDashboardProps {
//   businessName?: string;
//   rangeLabel?: string;
//   stats?: StatCard[];
//   chartPoints?: number[]; // "This Period" series, left -> right
//   priorPoints?: number[]; // "Prior Period" series, left -> right
//   chartLabels?: string[];
//   totalReviews?: number;
//   vsPreviousPct?: string;
//   requestRows?: RequestRow[];
// }

// const defaultChartLabels = [
//   "Aug 14",
//   "Aug 18",
//   "Aug 22",
//   "Aug 26",
//   "Aug 30",
//   "Sep 3",
//   "Sep 7",
//   "Sep 11",
//   "Sep 13",
// ];

// const defaultThisPeriod = [96, 104, 112, 119, 126, 133, 140, 150, 158];
// const defaultPriorPeriod = [98, 100, 103, 106, 108, 110, 112, 114, 116];

// const defaultRequestRows: RequestRow[] = [
//   { label: "Requests Sent", value: 247, total: 247, barColor: "bg-blue-600" },
//   { label: "Delivered", value: 231, total: 247, barColor: "bg-blue-600" },
//   { label: "Responses", value: 89, total: 247, barColor: "bg-blue-300" },
//   {
//     label: "Reviews Generated",
//     value: 34,
//     total: 247,
//     barColor: "bg-emerald-400",
//   },
// ];

// const defaultStats = (): StatCard[] => [
//   {
//     icon: <Star className="h-5 w-5" fill="currentColor" strokeWidth={0} />,
//     value: "4.8",
//     label: "Google Rating",
//     sublabel: "Based on 178 reviews",
//     delta: "↑ 0.2 pts",
//   },
//   {
//     icon: <TrendingUp className="h-5 w-5" />,
//     value: "178",
//     label: "Total Reviews",
//     sublabel: "All-time Google reviews",
//     delta: "↑ 34 new",
//   },
//   {
//     icon: <Calendar className="h-5 w-5" />,
//     value: "34",
//     label: "Reviews This Month",
//     sublabel: "Sep 1–13, 2026",
//     delta: "↑ 12% vs Aug",
//   },
//   {
//     icon: <Lightbulb className="h-5 w-5" />,
//     value: "18.7%",
//     label: "Review Growth",
//     sublabel: "vs. last month 15.2%",
//     delta: "↑ 3.5pts",
//   },
// ];

// function buildSmoothPath(
//   values: number[],
//   width: number,
//   height: number,
//   min: number,
//   max: number,
// ) {
//   if (values.length === 0) return "";
//   const stepX = width / (values.length - 1);
//   const toY = (v: number) => height - ((v - min) / (max - min)) * height;

//   const pts = values.map((v, i) => ({ x: i * stepX, y: toY(v) }));

//   let d = `M ${pts[0].x},${pts[0].y}`;
//   for (let i = 0; i < pts.length - 1; i++) {
//     const p0 = pts[i];
//     const p1 = pts[i + 1];
//     const midX = (p0.x + p1.x) / 2;
//     d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
//   }
//   return d;
// }

// export default function ReviewDashboard({
//   businessName = "Bella's Cafe",
//   rangeLabel = "Last 30 Days",
//   stats,
//   chartPoints = defaultThisPeriod,
//   priorPoints = defaultPriorPeriod,
//   chartLabels = defaultChartLabels,
//   totalReviews = 178,
//   vsPreviousPct = "43.5%",
//   requestRows = defaultRequestRows,
// }: ReviewDashboardProps) {
//   const [period, setPeriod] = useState<Period>("30 Days");
//   const resolvedStats = stats ?? defaultStats();

//   const { pathThis, pathPrior, yTicks, gridWidth, gridHeight } = useMemo(() => {
//     const width = 1000;
//     const height = 220;
//     const allVals = [...chartPoints, ...priorPoints];
//     const max = Math.max(...allVals, 1) * 1.1;
//     const min = 0;
//     return {
//       pathThis: buildSmoothPath(chartPoints, width, height, min, max),
//       pathPrior: buildSmoothPath(priorPoints, width, height, min, max),
//       yTicks: [0, 45, 90, 135, 180].filter((t) => t <= max || t === 180),
//       gridWidth: width,
//       gridHeight: height,
//     };
//   }, [chartPoints, priorPoints]);

//   const periods: Period[] = ["7 Days", "30 Days", "90 Days", "12 Months"];

//   return (
//     <div className="min-h-screen w-full text-slate-900">
//       <div className="">
//         {/* Header */}
//         <header className="mb-6 sm:mb-8">
//           <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//             Good morning, {businessName}
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Here&apos;s how your review growth is performing — {rangeLabel}.
//           </p>
//         </header>

//         {/* Stat cards */}
//         <div className="xs:grid-cols-2 mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {resolvedStats.map((s, i) => (
//             <div
//               key={i}
//               className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
//             >
//               <div className="mb-4 flex items-center justify-between">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
//                   {s.icon}
//                 </span>
//                 <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
//                   {s.delta}
//                 </span>
//               </div>
//               <div className="text-2xl font-semibold text-slate-900 sm:text-[28px]">
//                 {s.value}
//               </div>
//               <div className="mt-1 text-sm font-medium text-slate-700">
//                 {s.label}
//               </div>
//               <div className="mt-0.5 text-xs text-slate-400">{s.sublabel}</div>
//             </div>
//           ))}
//         </div>

//         {/* Review Growth chart */}
//         <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//           <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//             <div>
//               <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
//                 Review Growth
//               </h2>
//               <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
//                 Track how your Google reviews are growing over time.
//               </p>
//             </div>

//             <div className="flex flex-col gap-3 sm:items-end">
//               <div className="flex items-center gap-4 text-xs text-slate-500">
//                 <span className="inline-flex items-center gap-1.5">
//                   <span className="h-0.5 w-4 rounded-full bg-blue-600" />
//                   This Period
//                 </span>
//                 <span className="inline-flex items-center gap-1.5">
//                   <span className="h-0.5 w-4 rounded-full bg-slate-400" />
//                   Prior Period
//                 </span>
//               </div>

//               <div
//                 role="tablist"
//                 aria-label="Chart time range"
//                 className="flex w-full flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-auto"
//               >
//                 {periods.map((p) => (
//                   <button
//                     key={p}
//                     role="tab"
//                     aria-selected={period === p}
//                     onClick={() => setPeriod(p)}
//                     className={`flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${
//                       period === p
//                         ? "bg-blue-600 text-white shadow-sm"
//                         : "text-slate-500 hover:text-slate-700"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
//             <div>
//               <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">
//                 {totalReviews}
//               </div>
//               <div className="text-sm text-blue-600">Total Reviews</div>
//             </div>
//             <div className="text-right">
//               <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
//                 ↑ {vsPreviousPct}
//               </span>
//               <div className="mt-1 text-xs text-slate-400">
//                 vs. previous period
//               </div>
//             </div>
//           </div>

//           {/* Chart */}
//           <div className="mt-4 w-full overflow-x-auto">
//             <div className="min-w-[480px]">
//               <div className="flex">
//                 <div className="flex w-8 flex-col justify-between py-1 text-[11px] text-slate-400 sm:w-10">
//                   {[...yTicks].reverse().map((t) => (
//                     <span key={t}>{t}</span>
//                   ))}
//                 </div>
//                 <div className="relative flex-1">
//                   <svg
//                     viewBox={`0 0 ${gridWidth} ${gridHeight}`}
//                     preserveAspectRatio="none"
//                     className="h-[180px] w-full sm:h-[220px]"
//                   >
//                     <defs>
//                       <linearGradient
//                         id="fillGradient"
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor="#2563eb"
//                           stopOpacity="0.18"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor="#2563eb"
//                           stopOpacity="0"
//                         />
//                       </linearGradient>
//                     </defs>

//                     {/* horizontal gridlines */}
//                     {yTicks.map((_, i) => {
//                       const y =
//                         gridHeight - (i / (yTicks.length - 1)) * gridHeight;
//                       return (
//                         <line
//                           key={i}
//                           x1={0}
//                           x2={gridWidth}
//                           y1={y}
//                           y2={y}
//                           stroke="#e2e8f0"
//                           strokeDasharray="3 4"
//                           strokeWidth={1}
//                         />
//                       );
//                     })}

//                     {/* prior period (dashed grey) */}
//                     <path
//                       d={pathPrior}
//                       fill="none"
//                       stroke="#94a3b8"
//                       strokeWidth={2}
//                       strokeDasharray="4 4"
//                     />

//                     {/* fill under this period */}
//                     <path
//                       d={`${pathThis} L ${gridWidth},${gridHeight} L 0,${gridHeight} Z`}
//                       fill="url(#fillGradient)"
//                       stroke="none"
//                     />

//                     {/* this period (solid blue) */}
//                     <path
//                       d={pathThis}
//                       fill="none"
//                       stroke="#2563eb"
//                       strokeWidth={2.5}
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               <div className="ml-8 mt-2 flex justify-between text-[11px] text-slate-400 sm:ml-10">
//                 {chartLabels.map((l) => (
//                   <span key={l}>{l}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Bottom grid: Review Requests + Quick Actions */}
//         <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
//           {/* Review Requests */}
//           <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//             <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
//               Review Requests
//             </h2>
//             <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
//               Last 30 days performance
//             </p>

//             <div className="mt-5 space-y-5">
//               {requestRows.map((row) => {
//                 const pct = Math.round((row.value / row.total) * 100);
//                 return (
//                   <div key={row.label}>
//                     <div className="mb-1.5 flex items-baseline justify-between text-sm">
//                       <span className="text-slate-500">{row.label}</span>
//                       <span className="font-semibold text-slate-900">
//                         {row.value}{" "}
//                         <span className="ml-1 text-xs font-normal text-slate-400">
//                           {pct}%
//                         </span>
//                       </span>
//                     </div>
//                     <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
//                       <div
//                         className={`h-full rounded-full ${row.barColor}`}
//                         style={{ width: `${pct}%` }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <button className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
//               View Requests
//               <ArrowRight className="h-4 w-4" />
//             </button>
//           </section>

//           {/* Quick Actions */}
//           <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//             <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
//               Quick Actions
//             </h2>

//             <div className="mt-5 flex flex-col gap-3">
//               <button className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
//                 <AlertTriangle className="h-4 w-4" />
//                 Send Review Request
//               </button>

//               <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
//                 <Zap className="h-4 w-4 text-slate-400" />
//                 QuickSend
//               </button>

//               <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
//                 <Plus className="h-4 w-4 text-slate-400" />
//                 Add Customer
//               </button>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useMemo, useState } from "react";
import {
  Star,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Plus,
  ArrowRight,
  Send,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

// ⚠️ Adjust these import paths to match your project
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import {
  useGetChartsQuery,
  useGetMyBusinessProfileQuery,
  useGetCampaignStatsQuery,
  useSyncGoogleReviewsMutation,
} from "@/redux/api/userDashboard/overview/overviewApi";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Period = "7 Days" | "30 Days" | "90 Days";

// Backend documents 7 | 30 | 90. "12 Months" is sent as 365d — confirm the
// backend supports it, or remove that tab from `periods` below.
const PERIOD_API: Record<Period, string> = {
  "7 Days": "7d",
  "30 Days": "30d",
  "90 Days": "90d",
};

interface ApiEnvelope<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

interface MeProfile {
  id: string;
  name: string;
  businessId?: string;
  businesses?: BusinessProfile[];
}

interface BusinessProfile {
  id: string;
  name: string;
  rating?: number;
  userRatingsTotal?: number;
  monthlyGoal?: number;
}

interface TrendPoint {
  date: string; // YYYY-MM-DD
  reviewsCount: number;
  averageRating: number;
}

interface DashboardData {
  kpi: {
    averageRating: number;
    periodAverageRating: number;
    totalReviews: number;
    newReviewsInPeriod: number;
    monthlyGoal: number;
    monthlyGoalProgressPercentage: number;
  };
  ratingTrend: TrendPoint[];
}

interface CampaignStats {
  totalInvites: number;
  sent: number;
  clicked: number;
  reviewed: number;
  failed: number;
  subscriptionSms?: { limit: number; used: number; remaining: number };
}

type Tone = "up" | "down" | "flat";

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  delta: string;
  tone: Tone;
}

interface RequestRow {
  label: string;
  value: number;
  total: number;
  barColor: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const toneClass: Record<Tone, string> = {
  up: "bg-emerald-50 text-emerald-600",
  down: "bg-rose-50 text-rose-600",
  flat: "bg-slate-100 text-slate-500",
};

const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function buildSmoothPath(
  values: number[],
  width: number,
  height: number,
  min: number,
  max: number,
) {
  if (values.length === 0) return "";
  // a single point can't draw a line — duplicate it
  const vals = values.length === 1 ? [values[0], values[0]] : values;
  const range = max - min || 1;
  const stepX = width / (vals.length - 1);
  const toY = (v: number) => height - ((v - min) / range) * height;
  const pts = vals.map((v, i) => ({ x: i * stepX, y: toY(v) }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

/** Pick up to `count` evenly spaced items (always includes first & last). */
function pickEvenly<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) return arr;
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(arr[Math.round((i * (arr.length - 1)) / (count - 1))]);
  }
  return out;
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/70 ${className}`}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function ReviewDashboard() {
  const [period, setPeriod] = useState<Period>("30 Days");
  const periods: Period[] = ["7 Days", "30 Days", "90 Days"];

  /* 1) Profile — fetched once and cached by RTK Query. Every other query reads
        the businessId from here and is skipped until it's available. */
  const { data: meRes, isLoading: meLoading } = useGetMeProfileQuery(undefined);
  const me = (meRes as ApiEnvelope<MeProfile> | undefined)?.data;
  const businessId = me?.businessId ?? me?.businesses?.[0]?.id;
  const meBusiness = me?.businesses?.find((b) => b.id === businessId);
  const skip = !businessId;

  /* 2) Business-scoped queries (cached per businessId / period argument with auto-polling) */
  const { data: bizRes, refetch: refetchBiz } = useGetMyBusinessProfileQuery(
    businessId,
    { skip, pollingInterval: 4000, refetchOnFocus: true },
  );
  const {
    data: dashRes,
    isLoading: dashLoading,
    isFetching: dashFetching,
    isError: dashError,
    refetch: refetchDash,
  } = useGetChartsQuery(
    { businessId, period: PERIOD_API[period] },
    { skip, pollingInterval: 4000, refetchOnFocus: true },
  );
  const { data: campRes, isLoading: campLoading, refetch: refetchCamp } =
    useGetCampaignStatsQuery(businessId, {
      skip,
      pollingInterval: 4000,
      refetchOnFocus: true,
    });

  const [syncGoogleReviews, { isLoading: isSyncing }] =
    useSyncGoogleReviewsMutation();

  const handleSyncReviews = async () => {
    if (!businessId) return;
    try {
      await syncGoogleReviews(businessId).unwrap();
      toast.success("Google reviews synced successfully!");
      refetchBiz();
      refetchDash();
      refetchCamp();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to sync reviews");
    }
  };

  const business =
    (bizRes as ApiEnvelope<BusinessProfile> | undefined)?.data ?? meBusiness;
  const dash = (dashRes as ApiEnvelope<DashboardData> | undefined)?.data;
  const camp = (campRes as ApiEnvelope<CampaignStats> | undefined)?.data;

  const businessName = business?.name ?? me?.name ?? "";
  const rangeLabel = `Last ${period}`;

  /* ----------------------------- Stat cards ------------------------------ */
  const stats: StatCard[] = useMemo(() => {
    if (!dash) return [];
    const { kpi, ratingTrend } = dash;

    const overallRating = business?.rating ?? kpi.averageRating;
    const allTimeTotal = business?.userRatingsTotal ?? kpi.totalReviews;

    // rating delta: this period's average vs. overall average
    const hasPeriodRating =
      kpi.newReviewsInPeriod > 0 && kpi.periodAverageRating > 0;
    const ratingDiff = hasPeriodRating
      ? +(kpi.periodAverageRating - kpi.averageRating).toFixed(1)
      : 0;
    const ratingTone: Tone =
      ratingDiff > 0 ? "up" : ratingDiff < 0 ? "down" : "flat";

    const first = ratingTrend[0]?.date;
    const last = ratingTrend[ratingTrend.length - 1]?.date;

    return [
      {
        icon: <Star className="h-5 w-5" fill="currentColor" strokeWidth={0} />,
        value: overallRating.toFixed(1),
        label: "Google Rating",
        sublabel: `Based on ${allTimeTotal.toLocaleString()} reviews`,
        delta: hasPeriodRating
          ? `${ratingDiff > 0 ? "↑" : ratingDiff < 0 ? "↓" : "–"} ${Math.abs(ratingDiff)} pts`
          : "No change",
        tone: ratingTone,
      },
      {
        icon: <TrendingUp className="h-5 w-5" />,
        value: allTimeTotal.toLocaleString(),
        label: "Total Reviews",
        sublabel: "All-time Google reviews",
        delta: `↑ ${kpi.newReviewsInPeriod} new`,
        tone: kpi.newReviewsInPeriod > 0 ? "up" : "flat",
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        value: String(kpi.newReviewsInPeriod),
        label: "New Reviews",
        sublabel:
          first && last ? `${fmtDay(first)} – ${fmtDay(last)}` : rangeLabel,
        delta: hasPeriodRating
          ? `${kpi.periodAverageRating.toFixed(1)} avg ★`
          : "No reviews yet",
        tone: hasPeriodRating ? "up" : "flat",
      },
      {
        icon: <Target className="h-5 w-5" />,
        value: `${kpi.monthlyGoalProgressPercentage}%`,
        label: "Monthly Goal",
        sublabel: `${kpi.newReviewsInPeriod} of ${kpi.monthlyGoal} reviews`,
        delta:
          kpi.monthlyGoalProgressPercentage >= 100
            ? "Goal reached"
            : "In progress",
        tone: kpi.monthlyGoalProgressPercentage >= 100 ? "up" : "flat",
      },
    ];
  }, [dash, business, rangeLabel]);

  /* ------------------------------ Chart data ----------------------------- */
  // Cumulative new reviews across the selected period, built from the daily trend.
  const chart = useMemo(() => {
    const width = 1000;
    const height = 220;
    const trend = dash?.ratingTrend ?? [];

    let running = 0;
    const points = trend.map((t) => (running += t.reviewsCount));

    const peak = Math.max(...points, 0);
    const step = Math.max(1, Math.ceil(peak / 4));
    const top = step * 4;
    const yTicks = [0, 1, 2, 3, 4].map((i) => i * step);

    return {
      path: buildSmoothPath(points, width, height, 0, top),
      yTicks,
      labels: pickEvenly(trend, 9).map((t) => fmtDay(t.date)),
      width,
      height,
      hasData: trend.length > 0,
    };
  }, [dash]);

  /* ------------------------- Review request funnel ----------------------- */
  const requestRows: RequestRow[] = camp
    ? [
        {
          label: "Requests Created",
          value: camp.totalInvites,
          total: camp.totalInvites,
          barColor: "bg-blue-600",
        },
        {
          label: "Sent",
          value: camp.sent,
          total: camp.totalInvites,
          barColor: "bg-blue-600",
        },
        {
          label: "Clicked",
          value: camp.clicked,
          total: camp.totalInvites,
          barColor: "bg-blue-300",
        },
        {
          label: "Reviews Generated",
          value: camp.reviewed,
          total: camp.totalInvites,
          barColor: "bg-emerald-400",
        },
      ]
    : [];

  const allTimeTotal =
    business?.userRatingsTotal ?? dash?.kpi.totalReviews ?? 0;
  const newInPeriod = dash?.kpi.newReviewsInPeriod ?? 0;

  /* -------------------------------- Render ------------------------------- */
  return (
    <div className="min-h-screen w-full text-slate-900 dark:text-slate-100">
      <div>
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {meLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {greeting()}, {businessName}
              </h1>
            )}
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Here&apos;s how your review growth is performing — {rangeLabel}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSyncReviews}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1727] px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`} />
            {isSyncing ? "Syncing Reviews..." : "Sync Google Reviews"}
          </button>
        </header>

        {dashError && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            We couldn&apos;t load your dashboard data. Try another time range or
            refresh the page.
          </div>
        )}

        {/* Stat cards */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashLoading || meLoading || !dash
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-28 rounded" />
                  <Skeleton className="mt-1.5 h-3 w-36 rounded" />
                </div>
              ))
            : stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#0b1727] sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
                      {s.icon}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneClass[s.tone]}`}
                    >
                      {s.delta}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white sm:text-[28px]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {s.sublabel}
                  </div>
                </div>
              ))}
        </div>

        {/* Review Growth chart */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-6">
          <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Review Growth
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Track how your Google reviews are growing over time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-blue-600" />
                  New reviews (cumulative)
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Chart time range"
                className="flex w-full flex-wrap gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1 sm:w-auto"
              >
                {periods.map((p) => (
                  <button
                    key={p}
                    role="tab"
                    aria-selected={period === p}
                    onClick={() => setPeriod(p)}
                    className={`flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${
                      period === p
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                {allTimeTotal.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Reviews</div>
            </div>
            <div className="text-right">
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                  newInPeriod > 0 ? toneClass.up : toneClass.flat
                }`}
              >
                {newInPeriod > 0 ? "↑ " : ""}
                {newInPeriod} new
              </span>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-400">in this period</div>
            </div>
          </div>

          {/* Chart */}
          <div
            className={`mt-4 w-full overflow-x-auto transition-opacity ${
              dashFetching ? "opacity-50" : "opacity-100"
            }`}
          >
            {dashLoading ? (
              <div className="flex h-[220px] min-w-[480px] items-center justify-center rounded-xl bg-slate-50/50 p-6 dark:bg-slate-900/40">
                <Skeleton className="h-[180px] w-full rounded-lg" />
              </div>
            ) : !chart.hasData ? (
              <div className="flex h-[220px] min-w-[480px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No review activity recorded for this period.
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Reviews collected via NFC cards or invite links will appear here.
                </p>
              </div>
            ) : (
              <div className="min-w-[480px]">
                <div className="flex">
                  <div className="flex w-8 flex-col justify-between py-1 text-[11px] text-slate-400 dark:text-slate-400 sm:w-10">
                    {[...chart.yTicks].reverse().map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <svg
                      viewBox={`0 0 ${chart.width} ${chart.height}`}
                      preserveAspectRatio="none"
                      className="h-[180px] w-full sm:h-[220px]"
                    >
                      <defs>
                        <linearGradient
                          id="fillGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor="#2563eb"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {chart.yTicks.map((_, i) => {
                        const y =
                          chart.height -
                          (i / (chart.yTicks.length - 1)) * chart.height;
                        return (
                          <line
                            key={i}
                            x1={0}
                            x2={chart.width}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            className="text-slate-200 dark:text-slate-800"
                            strokeDasharray="3 4"
                            strokeWidth={1}
                          />
                        );
                      })}

                      <path
                        d={`${chart.path} L ${chart.width},${chart.height} L 0,${chart.height} Z`}
                        fill="url(#fillGradient)"
                        stroke="none"
                      />
                      <path
                        d={chart.path}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>

                <div className="ml-8 mt-2 flex justify-between text-[11px] text-slate-400 dark:text-slate-400 sm:ml-10">
                  {chart.labels.map((l, i) => (
                    <span key={`${l}-${i}`}>{l}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom grid: Review Requests + Quick Actions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          {/* Review Requests */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              Review Requests
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              All-time campaign performance
            </p>

            {campLoading || !camp ? (
              <div className="mt-5 space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : camp.totalInvites === 0 ? (
              <p className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 text-sm text-slate-500 dark:text-slate-400">
                No review requests yet. Send your first request to start
                tracking results here.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                {requestRows.map((row) => {
                  const pct =
                    row.total > 0
                      ? Math.round((row.value / row.total) * 100)
                      : 0;
                  return (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-baseline justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {row.value}
                          <span className="ml-1 text-xs font-normal text-slate-400 dark:text-slate-400">
                            {pct}%
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${row.barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              View Requests
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              Quick Actions
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              <button className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
                <Send className="h-4 w-4" />
                Send Review Request
              </button>

              <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <Zap className="h-4 w-4 text-slate-400 dark:text-slate-400" />
                QuickSend
              </button>

              <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <Plus className="h-4 w-4 text-slate-400 dark:text-slate-400" />
                Add Customer
              </button>
            </div>

            {camp?.subscriptionSms && (
              <p className="mt-4 text-xs text-slate-400 dark:text-slate-400">
                {camp.subscriptionSms.remaining} of {camp.subscriptionSms.limit}{" "}
                SMS remaining
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
