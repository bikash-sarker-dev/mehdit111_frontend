// "use client";

// import React, { useMemo } from "react";
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
// import { ArrowUp, ArrowDown, Minus } from "lucide-react";

// // ⚠️ Adjust these import paths to match your project
// import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
// import { useGetReviewGapAnalyticsQuery } from "@/redux/api/userDashboard/reviewGap/reviewGapAPI";

// /* -------------------------------------------------------------------------- */
// /* Types                                                                      */
// /* -------------------------------------------------------------------------- */

// interface TrendPoint {
//   date: string;
//   reviewsCount: number;
//   averageRating?: number;
// }

// /**
//  * Optional competitor block. The sample dashboard response does NOT include
//  * this yet — once your backend returns it, the card fills in automatically.
//  * Expected path: data.competitorBenchmark
//  */
// interface CompetitorBenchmark {
//   averageTotalReviews?: number;
//   averageGrowthRate?: number; // percent, e.g. 7.4
//   averageReviewsGained?: number;
//   trend?: { date: string; reviewsCount: number }[];
// }

// interface DashboardData {
//   kpi: {
//     totalReviews: number;
//     newReviewsInPeriod: number;
//   };
//   ratingTrend: TrendPoint[];
//   competitorBenchmark?: CompetitorBenchmark;
// }

// interface ChartPoint {
//   label: string;
//   you: number;
//   competitor?: number;
// }

// interface Stat {
//   value: string;
//   label: string;
//   sublabel: string;
//   accent?: boolean;
// }

// export interface ReviewGapCardProps {
//   period?: string; // e.g. "7d" | "30d" | "90d"
//   title?: string;
//   subtitle?: string;
//   yourLabel?: string;
//   competitorLabel?: string;
// }

// /* -------------------------------------------------------------------------- */
// /* Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// const NA = "—";

// const fmtNum = (n?: number | null) =>
//   typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : NA;

// const fmtPct = (n?: number | null) =>
//   typeof n === "number" && Number.isFinite(n) ? `${n.toFixed(1)}%` : NA;

// const fmtSigned = (n?: number | null) =>
//   typeof n === "number" && Number.isFinite(n)
//     ? `${n >= 0 ? "+" : ""}${n.toLocaleString()}`
//     : NA;

// const fmtDate = (iso: string) =>
//   new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// /** Growth % of reviews during the period relative to the count before it. */
// function computeGrowth(total: number, gained: number) {
//   const before = total - gained;
//   if (before > 0) return (gained / before) * 100;
//   return gained > 0 ? 100 : 0;
// }

// /* -------------------------------------------------------------------------- */
// /* Small UI pieces                                                            */
// /* -------------------------------------------------------------------------- */

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
//           {yourLabel}: {you} new
//         </p>
//       )}
//       {typeof competitor === "number" && (
//         <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
//           <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
//           {competitorLabel}: {competitor} new
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

// function CardSkeleton() {
//   return (
//     <div className="flex w-full animate-pulse flex-col gap-5 sm:gap-6">
//       <div>
//         <div className="h-7 w-40 rounded bg-slate-200" />
//         <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
//       </div>
//       <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6">
//         <div className="h-10 w-32 rounded bg-slate-200" />
//         <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div key={i} className="h-20 rounded-xl bg-slate-100" />
//           ))}
//         </div>
//       </div>
//       <div className="h-72 rounded-2xl border border-slate-200/80 bg-white" />
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Main component                                                             */
// /* -------------------------------------------------------------------------- */

// export default function ReviewGapCard({
//   period = "30d",
//   title = "Review Gap",
//   subtitle = "Understand how your review growth compares with competitors.",
//   yourLabel = "Your Business",
//   competitorLabel = "Competitor Avg",
// }: ReviewGapCardProps) {
//   /* 1) Profile → businessId (RTK Query caches this; no refetch if already loaded) */
//   const {
//     data: profile,
//     isLoading: profileLoading,
//     isError: profileError,
//   } = useGetMeProfileQuery(undefined);

//   const businessId: string | undefined =
//     profile?.data?.businessId ?? profile?.data?.businesses?.[0]?.id;

//   /* 2) Dashboard analytics — skipped until we have a businessId */
//   const {
//     data: analytics,
//     isLoading: analyticsLoading,
//     isFetching,
//     isError: analyticsError,
//     refetch,
//   } = useGetReviewGapAnalyticsQuery(
//     { businessId, period },
//     { skip: !businessId },
//   );

//   const dashboard: DashboardData | undefined = analytics?.data;

//   /* 3) Derive everything the UI needs */
//   const view = useMemo(() => {
//     if (!dashboard) return null;

//     const total = dashboard.kpi?.totalReviews ?? 0;
//     const gained = dashboard.kpi?.newReviewsInPeriod ?? 0;
//     const yourGrowth = computeGrowth(total, gained);

//     const comp = dashboard.competitorBenchmark;
//     const compGrowth = comp?.averageGrowthRate;
//     const gap =
//       typeof compGrowth === "number" ? yourGrowth - compGrowth : undefined;

//     const compTrendMap = new Map(
//       (comp?.trend ?? []).map((t) => [t.date, t.reviewsCount]),
//     );
//     const hasCompetitorTrend = compTrendMap.size > 0;

//     const chartData: ChartPoint[] = (dashboard.ratingTrend ?? []).map((p) => ({
//       label: fmtDate(p.date),
//       you: p.reviewsCount,
//       ...(hasCompetitorTrend
//         ? { competitor: compTrendMap.get(p.date) ?? 0 }
//         : {}),
//     }));

//     const stats: Stat[] = [
//       {
//         value: fmtNum(total),
//         label: "Your Reviews",
//         sublabel: "Total Google reviews",
//         accent: true,
//       },
//       {
//         value: fmtNum(comp?.averageTotalReviews),
//         label: "Competitor Avg",
//         sublabel: "Avg total reviews",
//       },
//       {
//         value: fmtPct(yourGrowth),
//         label: "Your Growth",
//         sublabel: "Growth this period",
//         accent: true,
//       },
//       {
//         value: fmtPct(compGrowth),
//         label: "Competitor Avg Growth",
//         sublabel: "Growth this period",
//       },
//       {
//         value: fmtSigned(gained),
//         label: "Reviews Gained (You)",
//         sublabel: "This period",
//         accent: true,
//       },
//       {
//         value: fmtSigned(comp?.averageReviewsGained),
//         label: "Reviews Gained (Avg)",
//         sublabel: "This period average",
//       },
//     ];

//     return { gap, stats, chartData, hasCompetitorTrend };
//   }, [dashboard]);

//   /* 4) States */
//   if (profileLoading || (businessId && analyticsLoading))
//     return <CardSkeleton />;

//   if (profileError || !businessId) {
//     return (
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
//         {profileError
//           ? "We couldn't load your profile. Please try again."
//           : "No business found on your profile yet."}
//       </div>
//     );
//   }

//   if (analyticsError || !view) {
//     return (
//       <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
//         <p>We couldn't load your review analytics.</p>
//         <button
//           onClick={() => refetch()}
//           className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   const { gap, stats, chartData, hasCompetitorTrend } = view;

//   const status =
//     gap === undefined
//       ? "unknown"
//       : gap > 0
//         ? "ahead"
//         : gap < 0
//           ? "behind"
//           : "even";

//   const badge = {
//     ahead: {
//       title: "Ahead of Competitors",
//       subtitle: "Growing faster than the average competitor",
//       Icon: ArrowUp,
//       box: "bg-emerald-100",
//       text: "text-emerald-700",
//       icon: "text-emerald-600",
//     },
//     behind: {
//       title: "Behind Competitors",
//       subtitle: "Growing slower than the average competitor",
//       Icon: ArrowDown,
//       box: "bg-rose-100",
//       text: "text-rose-700",
//       icon: "text-rose-600",
//     },
//     even: {
//       title: "On Par with Competitors",
//       subtitle: "Growing at the same pace as the average competitor",
//       Icon: Minus,
//       box: "bg-slate-100",
//       text: "text-slate-700",
//       icon: "text-slate-500",
//     },
//     unknown: {
//       title: "No Competitor Data Yet",
//       subtitle: "Add competitors to see how you compare",
//       Icon: Minus,
//       box: "bg-slate-100",
//       text: "text-slate-700",
//       icon: "text-slate-500",
//     },
//   }[status];

//   const gapValue =
//     gap === undefined ? NA : `${gap > 0 ? "+" : ""}${gap.toFixed(1)}%`;

//   return (
//     <div className={`w-full ${isFetching ? "opacity-80" : ""}`}>
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
//               <p className="text-xs font-medium text-slate-400">Review Gap</p>
//               <p className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
//                 {gapValue}
//               </p>
//               <p className="mt-1 text-sm text-slate-500">
//                 You vs. competitor average
//               </p>
//             </div>

//             <div
//               className={`flex items-center gap-3 rounded-xl px-4 py-3 sm:px-5 sm:py-4 ${badge.box}`}
//             >
//               <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
//                 <badge.Icon
//                   className={`h-12 w-12 ${badge.icon}`}
//                   strokeWidth={2.5}
//                 />
//               </span>
//               <div>
//                 <p
//                   className={`text-sm font-extrabold sm:text-xl ${badge.text}`}
//                 >
//                   {badge.title}
//                 </p>
//                 <p className={`text-xs opacity-80 sm:text-sm ${badge.text}`}>
//                   {badge.subtitle}
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
//                 Review Growth Comparison
//               </h2>
//               <p className="mt-1 text-xs text-slate-500 sm:text-sm">
//                 Daily new reviews — {yourLabel}
//                 {hasCompetitorTrend ? ` vs. ${competitorLabel}` : ""}
//               </p>
//             </div>

//             <div className="flex items-center gap-4 text-xs text-slate-600 sm:text-sm">
//               <span className="flex items-center gap-1.5">
//                 <span className="inline-block h-0.5 w-4 rounded bg-blue-600" />
//                 {yourLabel}
//               </span>
//               {hasCompetitorTrend && (
//                 <span className="flex items-center gap-1.5">
//                   <span className="inline-block h-0.5 w-4 rounded bg-slate-400" />
//                   {competitorLabel}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="mt-4 h-56 w-full sm:h-72 lg:h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={chartData}
//                 margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
//               >
//                 <CartesianGrid
//                   vertical={false}
//                   strokeDasharray="3 3"
//                   stroke="#e2e8f0"
//                 />
//                 <XAxis
//                   dataKey="label"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#94a3b8", fontSize: 12 }}
//                   dy={8}
//                   interval="preserveStartEnd"
//                   minTickGap={24}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#94a3b8", fontSize: 12 }}
//                   width={40}
//                   allowDecimals={false}
//                   domain={[0, (max: number) => Math.max(max + 1, 4)]}
//                 />
//                 <Tooltip
//                   content={
//                     <CustomTooltip
//                       yourLabel={yourLabel}
//                       competitorLabel={competitorLabel}
//                     />
//                   }
//                 />
//                 {hasCompetitorTrend && (
//                   <Line
//                     type="monotone"
//                     dataKey="competitor"
//                     stroke="#94a3b8"
//                     strokeWidth={2}
//                     strokeDasharray="5 4"
//                     dot={false}
//                     activeDot={<ActiveDot />}
//                   />
//                 )}
//                 <Line
//                   type="monotone"
//                   dataKey="you"
//                   stroke="#2563eb"
//                   strokeWidth={2.5}
//                   dot={false}
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Dot,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Star,
} from "lucide-react";

//  Adjust this import path to match your project
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import { useGetReviewGapAnalyticsQuery } from "@/redux/api/userDashboard/reviewGap/reviewGapAPI";

/* -------------------------------------------------------------------------- */
/* Types (match the API response: analytics.data)                             */
/* -------------------------------------------------------------------------- */

interface ReviewGapData {
  success: boolean;
  business_id: string;
  business_name: string;
  review_gap: {
    gap_percentage: string; // "-2.1%"
    status: string; // "Behind Competitors"
    status_description: string;
    review_count_difference: number; // -145
  };
  metrics: {
    your_reviews: number;
    competitor_avg_reviews: number;
    your_growth_rate: string; // "0.0%"
    competitor_avg_growth_rate: string; // "2.1%"
    reviews_gained_you: string; // "+5"
    reviews_gained_avg: string; // "+3"
    your_rating: number;
    competitor_avg_rating: number;
  };
  growth_comparison_chart: {
    month: string;
    your_business: number;
    competitor_avg: number;
  }[];
  ai_strategic_insights?: {
    analysis: string; // markdown
    model?: string;
  };
}

export interface ReviewGapCardProps {
  /** Optional override. If omitted, the id is taken from the logged-in profile. */
  businessId?: string;
  title?: string;
  subtitle?: string;
  yourLabel?: string;
  competitorLabel?: string;
}

type Tone = "ahead" | "behind" | "even";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const NA = "—";

/** "-2.1%" | "+5" | 3 → number (or undefined) */
const toNum = (v: unknown): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v !== "string") return undefined;
  const n = parseFloat(v.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
};

const fmtNum = (n?: number) =>
  typeof n === "number" ? n.toLocaleString() : NA;

const fmtRating = (n?: number) =>
  typeof n === "number" && n > 0 ? n.toFixed(1) : NA;

const fmtSignedStr = (v: unknown) => {
  const n = toNum(v);
  if (n === undefined) return NA;
  return `${n > 0 ? "+" : ""}${n.toLocaleString()}`;
};

const fmtPctStr = (v: unknown) => {
  const n = toNum(v);
  return n === undefined ? NA : `${n.toFixed(1)}%`;
};

function resolveTone(
  status: string | undefined,
  gap: number | undefined,
): Tone {
  const s = (status ?? "").toLowerCase();
  if (s.includes("behind")) return "behind";
  if (s.includes("ahead")) return "ahead";
  if (typeof gap === "number") {
    if (gap > 0) return "ahead";
    if (gap < 0) return "behind";
  }
  return "even";
}

const TONES: Record<
  Tone,
  {
    Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    box: string;
    ring: string;
    title: string;
    body: string;
    iconWrap: string;
    number: string;
  }
> = {
  ahead: {
    Icon: ArrowUp,
    box: "bg-emerald-50 dark:bg-emerald-950/30",
    ring: "ring-emerald-200/70 dark:ring-emerald-800/60",
    title: "text-emerald-800 dark:text-emerald-300",
    body: "text-emerald-700/80 dark:text-emerald-400/90",
    iconWrap: "bg-emerald-500 text-white",
    number: "text-emerald-600 dark:text-emerald-400",
  },
  behind: {
    Icon: ArrowDown,
    box: "bg-rose-50 dark:bg-rose-950/30",
    ring: "ring-rose-200/70 dark:ring-rose-800/60",
    title: "text-rose-800 dark:text-rose-300",
    body: "text-rose-700/80 dark:text-rose-400/90",
    iconWrap: "bg-rose-500 text-white",
    number: "text-rose-600 dark:text-rose-400",
  },
  even: {
    Icon: Minus,
    box: "bg-slate-50 dark:bg-slate-900/60",
    ring: "ring-slate-200 dark:ring-slate-800",
    title: "text-slate-800 dark:text-white",
    body: "text-slate-600 dark:text-slate-300",
    iconWrap: "bg-slate-500 text-white",
    number: "text-slate-700 dark:text-slate-300",
  },
};

/* -------------------------------------------------------------------------- */
/* Tiny markdown renderer for the AI analysis (no dependencies)               */
/* -------------------------------------------------------------------------- */

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

interface Section {
  num?: string;
  heading: string;
  blocks: Block[];
}

interface ParsedAnalysis {
  title?: string;
  sections: Section[];
  callout?: string;
}

function parseAnalysis(md: string): ParsedAnalysis {
  const out: ParsedAnalysis = { sections: [] };
  let current: Section | null = null;

  const ensure = () => {
    if (!current) {
      current = { heading: "", blocks: [] };
      out.sections.push(current);
    }
    return current;
  };

  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    if (/^##\s+/.test(line) && !/^###/.test(line)) {
      out.title = line.replace(/^##\s+/, "");
      continue;
    }

    if (/^###\s+/.test(line)) {
      const text = line.replace(/^###\s+/, "");
      const m = text.match(/^(\d+)\.\s*(.*)$/);
      current = { num: m?.[1], heading: m ? m[2] : text, blocks: [] };
      out.sections.push(current);
      continue;
    }

    if (/^\*?\s*bottom line:?/i.test(line)) {
      out.callout = line
        .replace(/^\*+\s*/, "")
        .replace(/\*+$/, "")
        .replace(/^bottom line:?\s*/i, "");
      continue;
    }

    const sec = ensure();
    if (/^[-*]\s+/.test(line)) {
      const item = line.replace(/^[-*]\s+/, "");
      const last = sec.blocks[sec.blocks.length - 1];
      if (last && last.type === "ul") last.items.push(item);
      else sec.blocks.push({ type: "ul", items: [item] });
    } else {
      sec.blocks.push({ type: "p", text: line });
    }
  }

  return out;
}

/** **bold** and *italic* inline formatting */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
          return (
            <em key={i} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Small UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function ChartTooltip({
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
  const comp = payload.find((p) => p.dataKey === "competitor")?.value;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      {typeof you === "number" && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
          {yourLabel}: {you.toFixed(1)}%
        </p>
      )}
      {typeof comp === "number" && (
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
          {competitorLabel}: {comp.toFixed(1)}%
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

/** One metric, you vs. competitors, as paired bars scaled to the larger value. */
function VersusRow({
  label,
  hint,
  youText,
  compText,
  you,
  comp,
  yourLabel,
  competitorLabel,
}: {
  label: string;
  hint: string;
  youText: string;
  compText: string;
  you?: number;
  comp?: number;
  yourLabel: string;
  competitorLabel: string;
}) {
  const max = Math.max(Math.abs(you ?? 0), Math.abs(comp ?? 0), 0.0001);
  const pct = (v?: number) =>
    `${Math.min(100, (Math.abs(v ?? 0) / max) * 100)}%`;

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-400">{hint}</p>
      </div>

      <div className="mt-3 space-y-2.5">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-300">{yourLabel}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{youText}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] duration-700"
              style={{ width: pct(you) }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500 dark:text-slate-400">
              {competitorLabel}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{compText}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-400 transition-[width] duration-700"
              style={{ width: pct(comp) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-5 sm:gap-6">
      <div>
        <div className="h-7 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1727] sm:p-6">
        <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/70" />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800/70" />
          ))}
        </div>
      </div>
      <div className="h-72 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-[#0b1727]" />
      <div className="h-64 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-[#0b1727]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ReviewGapCard({
  businessId: businessIdProp,
  title = "Review Gap",
  subtitle = "Understand how your review growth compares with competitors.",
  yourLabel = "Your Business",
  competitorLabel = "Competitor Avg",
}: ReviewGapCardProps) {
  /* 1) Profile -> business id (RTK Query caches this) */
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetMeProfileQuery(undefined, { skip: !!businessIdProp });

  const businessId: string | undefined =
    businessIdProp ??
    profile?.data?.businessId ??
    profile?.data?.businesses?.[0]?.id ??
    profile?.data?.businesses?.[0]?._id;

  /* 2) Analytics - skipped until we have a valid 24-char ObjectId */
  const isValidId = !!businessId && /^[a-f\d]{24}$/i.test(businessId);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching,
    isError,
    refetch,
  } = useGetReviewGapAnalyticsQuery(businessId as string, {
    skip: !isValidId,
  });

  const isLoading = profileLoading || (isValidId && analyticsLoading);

  const data: ReviewGapData | undefined = analytics?.data;

  const view = useMemo(() => {
    if (!data) return null;

    const gapNum = toNum(data.review_gap?.gap_percentage);
    const tone = resolveTone(data.review_gap?.status, gapNum);
    const m = data.metrics;

    const chartData = (data.growth_comparison_chart ?? []).map((p) => ({
      label: p.month,
      you: p.your_business,
      competitor: p.competitor_avg,
    }));

    const analysis = data.ai_strategic_insights?.analysis
      ? parseAnalysis(data.ai_strategic_insights.analysis)
      : null;

    return { gapNum, tone, m, chartData, analysis };
  }, [data]);

  /* ----------------------------- States ----------------------------------- */

  if (isLoading) return <CardSkeleton />;

  if (profileError || !isValidId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        {profileError
          ? "We couldn't load your profile. Please try again."
          : "No business found on your profile yet."}
      </div>
    );
  }

  if (isError || !data || !view) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        <p>We couldn&apos;t load your review analytics.</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const { gapNum, tone, m, chartData, analysis } = view;
  const t = TONES[tone];
  const diff = data.review_gap.review_count_difference;

  const gapDisplay =
    gapNum === undefined ? NA : `${gapNum > 0 ? "+" : ""}${gapNum.toFixed(1)}%`;

  const diffText =
    typeof diff === "number"
      ? diff === 0
        ? "Same review count as competitors"
        : `${Math.abs(diff).toLocaleString()} ${
            Math.abs(diff) === 1 ? "review" : "reviews"
          } ${diff < 0 ? "fewer" : "more"} than the competitor average`
      : null;

  const hasChart = chartData.length > 0;
  const chartMax = Math.max(
    0,
    ...chartData.flatMap((d) => [d.you ?? 0, d.competitor ?? 0]),
  );

  return (
    <div
      className={`w-full transition-opacity ${isFetching ? "opacity-80" : ""}`}
    >
      <div className="mx-auto flex w-full flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          {data.business_name && (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {data.business_name}
            </p>
          )}
        </div>

        {/* Summary */}
        <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-4 shadow-sm sm:p-6">
          <div
            className={`flex flex-col gap-5 rounded-2xl p-5 ring-1 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${t.box} ${t.ring}`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16 ${t.iconWrap}`}
              >
                <t.Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={2.5} />
              </span>
              <div>
                <p className={`text-lg font-bold sm:text-2xl ${t.title}`}>
                  {data.review_gap.status || "Review gap"}
                </p>
                <p className={`mt-0.5 text-sm ${t.body}`}>
                  {data.review_gap.status_description}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p
                className={`text-4xl font-bold tabular-nums sm:text-5xl ${t.number}`}
              >
                {gapDisplay}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Growth vs. competitor average
              </p>
            </div>
          </div>

          {diffText && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                {diff < 0 ? "Review count gap:" : "Review count lead:"}
              </span>{" "}
              {diffText}.
            </p>
          )}

          {/* Head-to-head */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <VersusRow
              label="Total reviews"
              hint="All-time Google reviews"
              youText={fmtNum(m.your_reviews)}
              compText={fmtNum(m.competitor_avg_reviews)}
              you={m.your_reviews}
              comp={m.competitor_avg_reviews}
              yourLabel={yourLabel}
              competitorLabel={competitorLabel}
            />
            <VersusRow
              label="Growth rate"
              hint="This period"
              youText={fmtPctStr(m.your_growth_rate)}
              compText={fmtPctStr(m.competitor_avg_growth_rate)}
              you={toNum(m.your_growth_rate)}
              comp={toNum(m.competitor_avg_growth_rate)}
              yourLabel={yourLabel}
              competitorLabel={competitorLabel}
            />
            <VersusRow
              label="Reviews gained"
              hint="This period"
              youText={fmtSignedStr(m.reviews_gained_you)}
              compText={fmtSignedStr(m.reviews_gained_avg)}
              you={toNum(m.reviews_gained_you)}
              comp={toNum(m.reviews_gained_avg)}
              yourLabel={yourLabel}
              competitorLabel={competitorLabel}
            />
            <VersusRow
              label="Average rating"
              hint="Out of 5"
              youText={
                typeof m.your_rating === "number" && m.your_rating > 0
                  ? `${fmtRating(m.your_rating)} ★`
                  : "No rating"
              }
              compText={
                typeof m.competitor_avg_rating === "number" && m.competitor_avg_rating > 0
                  ? `${fmtRating(m.competitor_avg_rating)} ★`
                  : "No rating"
              }
              you={m.your_rating}
              comp={m.competitor_avg_rating}
              yourLabel={yourLabel}
              competitorLabel={competitorLabel}
            />
          </div>
        </section>

        {/* Chart */}
        <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Review Growth Comparison
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Monthly growth rate — {yourLabel} vs. {competitorLabel}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded bg-blue-600" />
                {yourLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded bg-slate-400" />
                {competitorLabel}
              </span>
            </div>
          </div>

          {hasChart ? (
            <div className="mt-4 h-56 w-full sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 8, left: -8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rg-you" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rg-comp" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#94a3b8"
                        stopOpacity={0.2}
                      />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#334155"
                    strokeOpacity={0.25}
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    width={44}
                    tickFormatter={(v: number) => `${v}%`}
                    domain={[0, Math.max(Math.ceil(chartMax + 0.5), 3)]}
                  />
                  <Tooltip
                    cursor={{ stroke: "#64748b", strokeDasharray: "3 3" }}
                    content={
                      <ChartTooltip
                        yourLabel={yourLabel}
                        competitorLabel={competitorLabel}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="competitor"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    fill="url(#rg-comp)"
                    dot={false}
                    activeDot={<ActiveDot />}
                  />
                  <Area
                    type="monotone"
                    dataKey="you"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#rg-you)"
                    dot={false}
                    activeDot={<ActiveDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-500 dark:text-slate-400">
              No growth history available yet.
            </div>
          )}
        </section>

        {/* AI strategic insights */}
        {analysis && (
          <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-4 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    AI Strategic Insights
                  </h2>
                  {analysis.title && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      {analysis.title.replace(
                        /^Google Review Gap Analysis:\s*/i,
                        "",
                      )}
                    </p>
                  )}
                </div>
              </div>
              {data.ai_strategic_insights?.model && (
                <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {data.ai_strategic_insights.model}
                </span>
              )}
            </div>

            <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
              {analysis.sections.map((section, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  {section.heading && (
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      {section.heading}
                    </h3>
                  )}

                  <div className="mt-2 space-y-3">
                    {section.blocks.map((b, j) =>
                      b.type === "p" ? (
                        <p
                          key={j}
                          className="max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                          <Inline text={b.text} />
                        </p>
                      ) : (
                        <ul key={j} className="space-y-2.5">
                          {b.items.map((item, k) => (
                            <li
                              key={k}
                              className="flex gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                            >
                              <Star className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
                              <span>
                                <Inline text={item} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {analysis.callout && (
              <div className="mt-5 flex gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4 ring-1 ring-blue-100 dark:ring-blue-900/50">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
                  <span className="font-semibold">Bottom line: </span>
                  <Inline text={analysis.callout} />
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
