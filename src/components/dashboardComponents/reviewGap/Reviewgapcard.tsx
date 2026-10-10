// "use client";

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   Dot,
// } from "recharts";
// import { ArrowUp } from "lucide-react";

// /**
//  * ReviewGapCard
//  * --------------------------------------------------------------------------
//  * A single, self-contained "Review Gap" analytics component.
//  * - React + Next.js (App Router friendly, "use client" included)
//  * - TypeScript
//  * - Tailwind CSS
//  * - Fully responsive: stat grid reflows from 2 → 3 → 6 columns,
//  *   chart scales fluidly with ResponsiveContainer, spacing/typography
//  *   scale down gracefully on small screens.
//  *
//  * Drop this file into your Next.js project (e.g. components/ReviewGapCard.tsx)
//  * and render <ReviewGapCard /> anywhere. All data can be overridden via props.
//  * --------------------------------------------------------------------------
//  */

// export interface ReviewGapStat {
//   value: string;
//   label: string;
//   sublabel: string;
//   accent?: boolean;
// }

// export interface ReviewGapDataPoint {
//   month: string;
//   you: number;
//   competitor: number;
// }

// export interface ReviewGapCardProps {
//   title?: string;
//   subtitle?: string;
//   gapLabel?: string;
//   gapValue?: string;
//   gapCaption?: string;
//   badgeTitle?: string;
//   badgeSubtitle?: string;
//   stats?: ReviewGapStat[];
//   chartTitle?: string;
//   chartSubtitle?: string;
//   data?: ReviewGapDataPoint[];
//   yourLabel?: string;
//   competitorLabel?: string;
// }

// const defaultStats: ReviewGapStat[] = [
//   {
//     value: "178",
//     label: "Your Reviews",
//     sublabel: "Total Google reviews",
//     accent: true,
//   },
//   { value: "145", label: "Competitor Avg", sublabel: "Avg total reviews" },
//   {
//     value: "18.7%",
//     label: "Your Growth",
//     sublabel: "Monthly growth rate",
//     accent: true,
//   },
//   {
//     value: "7.4%",
//     label: "Competitor Avg Growth",
//     sublabel: "Monthly growth rate",
//   },
//   {
//     value: "+34",
//     label: "Reviews Gained (You)",
//     sublabel: "This month",
//     accent: true,
//   },
//   {
//     value: "+11",
//     label: "Reviews Gained (Avg)",
//     sublabel: "This month average",
//   },
// ];

// const defaultData: ReviewGapDataPoint[] = [
//   { month: "Apr", you: 4.1, competitor: 3.0 },
//   { month: "May", you: 5.2, competitor: 3.4 },
//   { month: "Jun", you: 6.3, competitor: 4.0 },
//   { month: "Jul", you: 10.0, competitor: 5.1 },
//   { month: "Aug", you: 15.2, competitor: 6.2 },
//   { month: "Sep", you: 18.7, competitor: 7.4 },
// ];

// function CustomTooltip({
//   active,
//   payload,
//   label,
//   yourLabel,
//   competitorLabel,
// }: {
//   active?: boolean;
//   payload?: any[];
//   label?: string;
//   yourLabel: string;
//   competitorLabel: string;
// }) {
//   if (!active || !payload || payload.length === 0) return null;
//   const you = payload.find((p) => p.dataKey === "you")?.value;
//   const competitor = payload.find((p) => p.dataKey === "competitor")?.value;

//   return (
//     <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
//       <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
//       {typeof you === "number" && (
//         <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
//           <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
//           {yourLabel}: {you.toFixed(1)}%
//         </p>
//       )}
//       {typeof competitor === "number" && (
//         <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
//           <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
//           {competitorLabel}: {competitor.toFixed(1)}%
//         </p>
//       )}
//     </div>
//   );
// }

// function ActiveDot(props: any) {
//   const { cx, cy, stroke } = props;
//   return (
//     <Dot cx={cx} cy={cy} r={5} fill={stroke} stroke="#ffffff" strokeWidth={2} />
//   );
// }

// export default function ReviewGapCard({
//   title = "Review Gap",
//   subtitle = "Understand how your review growth compares with competitors.",
//   gapLabel = "Review Gap",
//   gapValue = "+11.3%",
//   gapCaption = "You vs. competitor average",
//   badgeTitle = "Ahead of Competitors",
//   badgeSubtitle = "Growing faster than the average competitor",
//   stats = defaultStats,
//   chartTitle = "Review Growth Comparison",
//   chartSubtitle = "Monthly growth rate — Your Business vs. Competitor Average",
//   data = defaultData,
//   yourLabel = "Your Business",
//   competitorLabel = "Competitor Avg",
// }: ReviewGapCardProps) {
//   return (
//     <div className="w-full">
//       <div className="mx-auto flex w-full flex-col gap-5 sm:gap-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//             {title}
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
//         </div>

//         {/* Summary card */}
//         <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
//             <div>
//               <p className="text-xs font-medium text-slate-400">{gapLabel}</p>
//               <p className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
//                 {gapValue}
//               </p>
//               <p className="mt-1 text-sm text-slate-500">{gapCaption}</p>
//             </div>

//             <div className="flex items-center gap-3 rounded-xl bg-emerald-100 px-4 py-3 sm:px-5 sm:py-4">
//               <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
//                 <ArrowUp
//                   className="h-12 w-12 text-emerald-600"
//                   strokeWidth={2.5}
//                 />
//               </span>
//               <div>
//                 <p className="text-sm font-extrabold text-emerald-700 sm:text-xl">
//                   {badgeTitle}
//                 </p>
//                 <p className="text-xs text-emerald-700/80 sm:text-sm">
//                   {badgeSubtitle}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Stats grid */}
//           <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
//             {stats.map((stat, i) => (
//               <div
//                 key={i}
//                 className="rounded-xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4"
//               >
//                 <p
//                   className={`text-base font-bold sm:text-lg ${
//                     stat.accent ? "text-blue-600" : "text-slate-900"
//                   }`}
//                 >
//                   {stat.value}
//                 </p>
//                 <p className="mt-1 text-xs font-semibold text-slate-800 sm:text-sm">
//                   {stat.label}
//                 </p>
//                 <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
//                   {stat.sublabel}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Chart card */}
//         <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h2 className="text-base font-bold text-slate-900 sm:text-lg">
//                 {chartTitle}
//               </h2>
//               <p className="mt-1 text-xs text-slate-500 sm:text-sm">
//                 {chartSubtitle}
//               </p>
//             </div>

//             <div className="flex items-center gap-4 text-xs text-slate-600 sm:text-sm">
//               <span className="flex items-center gap-1.5">
//                 <span className="inline-block h-0.5 w-4 rounded bg-blue-600" />
//                 {yourLabel}
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="inline-block h-0.5 w-4 rounded bg-slate-400" />
//                 {competitorLabel}
//               </span>
//             </div>
//           </div>

//           <div className="mt-4 h-56 w-full sm:h-72 lg:h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={data}
//                 margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
//               >
//                 <CartesianGrid
//                   vertical={false}
//                   strokeDasharray="3 3"
//                   stroke="#e2e8f0"
//                 />
//                 <XAxis
//                   dataKey="month"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#94a3b8", fontSize: 12 }}
//                   dy={8}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#94a3b8", fontSize: 12 }}
//                   tickFormatter={(v) => `${v}%`}
//                   width={40}
//                   domain={[0, "dataMax + 3"]}
//                 />
//                 <Tooltip
//                   content={
//                     <CustomTooltip
//                       yourLabel={yourLabel}
//                       competitorLabel={competitorLabel}
//                     />
//                   }
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="competitor"
//                   stroke="#94a3b8"
//                   strokeWidth={2}
//                   strokeDasharray="5 4"
//                   dot={false}
//                   activeDot={<ActiveDot />}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="you"
//                   stroke="#2563eb"
//                   strokeWidth={2.5}
//                   dot={{
//                     r: 4,
//                     fill: "#2563eb",
//                     stroke: "#ffffff",
//                     strokeWidth: 2,
//                   }}
//                   activeDot={<ActiveDot />}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Dot,
} from "recharts";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

// ⚠️ Adjust these import paths to match your project
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import { useGetReviewGapAnalyticsQuery } from "@/redux/api/userDashboard/reviewGap/reviewGapAPI";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface TrendPoint {
  date: string;
  reviewsCount: number;
  averageRating?: number;
}

/**
 * Optional competitor block. The sample dashboard response does NOT include
 * this yet — once your backend returns it, the card fills in automatically.
 * Expected path: data.competitorBenchmark
 */
interface CompetitorBenchmark {
  averageTotalReviews?: number;
  averageGrowthRate?: number; // percent, e.g. 7.4
  averageReviewsGained?: number;
  trend?: { date: string; reviewsCount: number }[];
}

interface DashboardData {
  kpi: {
    totalReviews: number;
    newReviewsInPeriod: number;
  };
  ratingTrend: TrendPoint[];
  competitorBenchmark?: CompetitorBenchmark;
}

interface ChartPoint {
  label: string;
  you: number;
  competitor?: number;
}

interface Stat {
  value: string;
  label: string;
  sublabel: string;
  accent?: boolean;
}

export interface ReviewGapCardProps {
  period?: string; // e.g. "7d" | "30d" | "90d"
  title?: string;
  subtitle?: string;
  yourLabel?: string;
  competitorLabel?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const NA = "—";

const fmtNum = (n?: number | null) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : NA;

const fmtPct = (n?: number | null) =>
  typeof n === "number" && Number.isFinite(n) ? `${n.toFixed(1)}%` : NA;

const fmtSigned = (n?: number | null) =>
  typeof n === "number" && Number.isFinite(n)
    ? `${n >= 0 ? "+" : ""}${n.toLocaleString()}`
    : NA;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Growth % of reviews during the period relative to the count before it. */
function computeGrowth(total: number, gained: number) {
  const before = total - gained;
  if (before > 0) return (gained / before) * 100;
  return gained > 0 ? 100 : 0;
}

/* -------------------------------------------------------------------------- */
/* Small UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function CustomTooltip({
  active,
  payload,
  label,
  yourLabel,
  competitorLabel,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  yourLabel: string;
  competitorLabel: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const you = payload.find((p) => p.dataKey === "you")?.value;
  const competitor = payload.find((p) => p.dataKey === "competitor")?.value;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      {typeof you === "number" && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
          {yourLabel}: {you} new
        </p>
      )}
      {typeof competitor === "number" && (
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
          {competitorLabel}: {competitor} new
        </p>
      )}
    </div>
  );
}

function ActiveDot(props: any) {
  const { cx, cy, stroke } = props;
  return (
    <Dot cx={cx} cy={cy} r={5} fill={stroke} stroke="#ffffff" strokeWidth={2} />
  );
}

function CardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-5 sm:gap-6">
      <div>
        <div className="h-7 w-40 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6">
        <div className="h-10 w-32 rounded bg-slate-200" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="h-72 rounded-2xl border border-slate-200/80 bg-white" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ReviewGapCard({
  period = "30d",
  title = "Review Gap",
  subtitle = "Understand how your review growth compares with competitors.",
  yourLabel = "Your Business",
  competitorLabel = "Competitor Avg",
}: ReviewGapCardProps) {
  /* 1) Profile → businessId (RTK Query caches this; no refetch if already loaded) */
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetMeProfileQuery(undefined);

  const businessId: string | undefined =
    profile?.data?.businessId ?? profile?.data?.businesses?.[0]?.id;

  /* 2) Dashboard analytics — skipped until we have a businessId */
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching,
    isError: analyticsError,
    refetch,
  } = useGetReviewGapAnalyticsQuery(
    { businessId, period },
    { skip: !businessId },
  );

  const dashboard: DashboardData | undefined = analytics?.data;

  /* 3) Derive everything the UI needs */
  const view = useMemo(() => {
    if (!dashboard) return null;

    const total = dashboard.kpi?.totalReviews ?? 0;
    const gained = dashboard.kpi?.newReviewsInPeriod ?? 0;
    const yourGrowth = computeGrowth(total, gained);

    const comp = dashboard.competitorBenchmark;
    const compGrowth = comp?.averageGrowthRate;
    const gap =
      typeof compGrowth === "number" ? yourGrowth - compGrowth : undefined;

    const compTrendMap = new Map(
      (comp?.trend ?? []).map((t) => [t.date, t.reviewsCount]),
    );
    const hasCompetitorTrend = compTrendMap.size > 0;

    const chartData: ChartPoint[] = (dashboard.ratingTrend ?? []).map((p) => ({
      label: fmtDate(p.date),
      you: p.reviewsCount,
      ...(hasCompetitorTrend
        ? { competitor: compTrendMap.get(p.date) ?? 0 }
        : {}),
    }));

    const stats: Stat[] = [
      {
        value: fmtNum(total),
        label: "Your Reviews",
        sublabel: "Total Google reviews",
        accent: true,
      },
      {
        value: fmtNum(comp?.averageTotalReviews),
        label: "Competitor Avg",
        sublabel: "Avg total reviews",
      },
      {
        value: fmtPct(yourGrowth),
        label: "Your Growth",
        sublabel: "Growth this period",
        accent: true,
      },
      {
        value: fmtPct(compGrowth),
        label: "Competitor Avg Growth",
        sublabel: "Growth this period",
      },
      {
        value: fmtSigned(gained),
        label: "Reviews Gained (You)",
        sublabel: "This period",
        accent: true,
      },
      {
        value: fmtSigned(comp?.averageReviewsGained),
        label: "Reviews Gained (Avg)",
        sublabel: "This period average",
      },
    ];

    return { gap, stats, chartData, hasCompetitorTrend };
  }, [dashboard]);

  /* 4) States */
  if (profileLoading || (businessId && analyticsLoading))
    return <CardSkeleton />;

  if (profileError || !businessId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        {profileError
          ? "We couldn't load your profile. Please try again."
          : "No business found on your profile yet."}
      </div>
    );
  }

  if (analyticsError || !view) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        <p>We couldn't load your review analytics.</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { gap, stats, chartData, hasCompetitorTrend } = view;

  const status =
    gap === undefined
      ? "unknown"
      : gap > 0
        ? "ahead"
        : gap < 0
          ? "behind"
          : "even";

  const badge = {
    ahead: {
      title: "Ahead of Competitors",
      subtitle: "Growing faster than the average competitor",
      Icon: ArrowUp,
      box: "bg-emerald-100",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    },
    behind: {
      title: "Behind Competitors",
      subtitle: "Growing slower than the average competitor",
      Icon: ArrowDown,
      box: "bg-rose-100",
      text: "text-rose-700",
      icon: "text-rose-600",
    },
    even: {
      title: "On Par with Competitors",
      subtitle: "Growing at the same pace as the average competitor",
      Icon: Minus,
      box: "bg-slate-100",
      text: "text-slate-700",
      icon: "text-slate-500",
    },
    unknown: {
      title: "No Competitor Data Yet",
      subtitle: "Add competitors to see how you compare",
      Icon: Minus,
      box: "bg-slate-100",
      text: "text-slate-700",
      icon: "text-slate-500",
    },
  }[status];

  const gapValue =
    gap === undefined ? NA : `${gap > 0 ? "+" : ""}${gap.toFixed(1)}%`;

  return (
    <div className={`w-full ${isFetching ? "opacity-80" : ""}`}>
      <div className="mx-auto flex w-full flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        {/* Summary card */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs font-medium text-slate-400">Review Gap</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                {gapValue}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                You vs. competitor average
              </p>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl px-4 py-3 sm:px-5 sm:py-4 ${badge.box}`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <badge.Icon
                  className={`h-12 w-12 ${badge.icon}`}
                  strokeWidth={2.5}
                />
              </span>
              <div>
                <p
                  className={`text-sm font-extrabold sm:text-xl ${badge.text}`}
                >
                  {badge.title}
                </p>
                <p className={`text-xs opacity-80 sm:text-sm ${badge.text}`}>
                  {badge.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4"
              >
                <p
                  className={`text-base font-bold sm:text-lg ${
                    stat.accent ? "text-blue-600" : "text-slate-900"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-800 sm:text-sm">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Chart card */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Review Growth Comparison
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Daily new reviews — {yourLabel}
                {hasCompetitorTrend ? ` vs. ${competitorLabel}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded bg-blue-600" />
                {yourLabel}
              </span>
              {hasCompetitorTrend && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-0.5 w-4 rounded bg-slate-400" />
                  {competitorLabel}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 h-56 w-full sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={8}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={40}
                  allowDecimals={false}
                  domain={[0, (max: number) => Math.max(max + 1, 4)]}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      yourLabel={yourLabel}
                      competitorLabel={competitorLabel}
                    />
                  }
                />
                {hasCompetitorTrend && (
                  <Line
                    type="monotone"
                    dataKey="competitor"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={false}
                    activeDot={<ActiveDot />}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="you"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={<ActiveDot />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
