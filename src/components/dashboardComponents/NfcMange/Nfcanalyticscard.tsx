// "use client";

// import React from "react";
// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { ArrowUp, Calendar, Star, TrendingUp } from "lucide-react";

// /**
//  * NFCAnalyticsCard
//  * -----------------
//  * A single, self-contained analytics component showing NFC tap
//  * performance: three summary stat cards + a tap-activity trend chart.
//  *
//  * Stack: React + Next.js (App Router, "use client") + TypeScript + Tailwind CSS
//  * Chart: recharts (npm install recharts lucide-react)
//  *
//  * Fully responsive — stat cards stack to a single column on mobile and
//  * the chart scales fluidly with ResponsiveContainer.
//  */

// /* ----------------------------- Types ----------------------------- */

// interface StatCardProps {
//   icon: React.ReactNode;
//   value: string | number;
//   label: string;
//   delta: string;
// }

// interface TapDataPoint {
//   x: number;
//   label: string;
//   taps: number;
// }

// /* --------------------------- Chart data --------------------------- */

// // Day-offset x-axis (Apr 1 = 0) so the curve can be smooth while only
// // specific points carry a visible axis label, matching the reference.
// const tapData: TapDataPoint[] = [
//   { x: 0, label: "Apr", taps: 12 },
//   { x: 12, label: "", taps: 13 },
//   { x: 24, label: "", taps: 15 },
//   { x: 31, label: "May", taps: 16 },
//   { x: 43, label: "", taps: 18 },
//   { x: 55, label: "", taps: 20 },
//   { x: 61, label: "Jun", taps: 22 },
//   { x: 73, label: "", taps: 26 },
//   { x: 85, label: "", taps: 31 },
//   { x: 92, label: "Jul", taps: 37 },
//   { x: 101, label: "", taps: 47 },
//   { x: 110, label: "", taps: 58 },
//   { x: 118, label: "", taps: 66 },
//   { x: 123, label: "Aug", taps: 70 },
//   { x: 131, label: "", taps: 64 },
//   { x: 138, label: "", taps: 48 },
//   { x: 145, label: "", taps: 30 },
//   { x: 150, label: "", taps: 18 },
//   { x: 154, label: "Sep 1", taps: 13 },
//   { x: 160, label: "Sep 7", taps: 21 },
//   { x: 166, label: "Sep 13", taps: 39 },
// ];

// const xTicks = tapData.filter((d) => d.label !== "").map((d) => d.x);
// const tickLabelByX = Object.fromEntries(tapData.map((d) => [d.x, d.label]));

// /* ---------------------------- Sub UI ---------------------------- */

// function StatCard({ icon, value, label, delta }: StatCardProps) {
//   return (
//     <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between">
//         <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
//           {icon}
//         </span>
//         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
//           <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
//           {delta}
//         </span>
//       </div>
//       <div className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
//         {value}
//       </div>
//       <div className="mt-1 text-sm text-gray-500">{label}</div>
//     </div>
//   );
// }

// function ChartTooltip({
//   active,
//   payload,
// }: {
//   active?: boolean;
//   payload?: { value: number; payload: TapDataPoint }[];
// }) {
//   if (!active || !payload || !payload.length) return null;
//   const point = payload[0];
//   return (
//     <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-lg">
//       <div className="font-medium text-gray-900">{point.value} taps</div>
//     </div>
//   );
// }

// /* --------------------------- Main component --------------------------- */

// export default function NFCAnalyticsCard() {
//   return (
//     <div className="mx-auto w-full">
//       {/* Header */}
//       <div className="mb-5">
//         <h1 className="text-2xl font-semibold text-gray-900">NFC</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Make it easy for customers to start the review experience with one
//           tap.
//         </p>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <StatCard
//           icon={<Star className="h-4 w-4 fill-white" />}
//           value={241}
//           label="Total NFC Taps"
//           delta="0.2 pts"
//         />
//         <StatCard
//           icon={<TrendingUp className="h-4 w-4" strokeWidth={2.5} />}
//           value={38}
//           label="Taps This Month"
//           delta="34 new"
//         />
//         <StatCard
//           icon={<Calendar className="h-4 w-4" strokeWidth={2.5} />}
//           value={55}
//           label="Reviews from NFC"
//           delta="12% vs Aug"
//         />
//       </div>

//       {/* Chart card */}
//       <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//           <div>
//             <h2 className="text-base font-semibold text-gray-900">
//               NFC Tap Activity
//             </h2>
//             <p className="mt-1 text-xs text-gray-400">
//               Taps recorded across all NFC locations
//             </p>
//           </div>
//           <button
//             type="button"
//             className="inline-flex w-fit items-center rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//           >
//             Last 6 months
//           </button>
//         </div>

//         <div className="mt-6 h-64 w-full sm:h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart
//               data={tapData}
//               margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="tapsFill" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#10b981" stopOpacity={0.18} />
//                   <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
//                 </linearGradient>
//               </defs>

//               <CartesianGrid
//                 vertical={false}
//                 stroke="#e5e7eb"
//                 strokeDasharray="3 5"
//               />

//               <XAxis
//                 dataKey="x"
//                 type="number"
//                 domain={[0, 166]}
//                 ticks={xTicks}
//                 tickFormatter={(x: number) => tickLabelByX[x] ?? ""}
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#9ca3af", fontSize: 12 }}
//                 dy={8}
//               />

//               <YAxis
//                 domain={[0, 80]}
//                 ticks={[0, 20, 40, 60, 80]}
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#9ca3af", fontSize: 12 }}
//                 width={32}
//               />

//               <Tooltip
//                 content={<ChartTooltip />}
//                 cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
//               />

//               <Area
//                 type="monotone"
//                 dataKey="taps"
//                 stroke="#10b981"
//                 strokeWidth={2.5}
//                 fill="url(#tapsFill)"
//                 dot={false}
//                 activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Minus,
  Star,
  TrendingUp,
} from "lucide-react";

import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import { useGetNfcAnalyticsQuery } from "@/redux/api/userDashboard/reviewGap/reviewGapAPI";
import NfcStandsList from "./NfcStandsList";

/* ----------------------------- Types ----------------------------- */

type Trend = "up" | "down" | "neutral";

interface TapDataPoint {
  x: number;
  label: string;
  taps: number;
}

interface ApiCard {
  title?: string;
  value?: number;
  change?: string;
  trend?: Trend;
}

interface NfcStatsData {
  totalNfcTaps?: number;
  totalNfcTapsChange?: string;
  tapsThisMonth?: number;
  tapsThisMonthChange?: string;
  reviewsFromNfc?: number;
  reviewsFromNfcChange?: string;
  cards?: {
    totalNfcTaps?: ApiCard;
    tapsThisMonth?: ApiCard;
    reviewsFromNfc?: ApiCard;
  };
  tapData?: TapDataPoint[];
  chart?: {
    title?: string;
    subtitle?: string;
    period?: string;
    data?: TapDataPoint[];
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delta?: string;
  trend?: Trend;
}

/* ---------------------------- Helpers ---------------------------- */

/** The arrow already shows direction, so drop a leading +/- from the text. */
const cleanDelta = (s?: string) => (s ? s.replace(/^[+-]\s*/, "") : "");

/** Round the y-axis max up to a "nice" multiple of 20 (min 20). */
const niceMax = (max: number) => Math.max(20, Math.ceil(max / 20) * 20);

/* ---------------------------- Sub UI ---------------------------- */

function StatCard({ icon, value, label, delta, trend = "up" }: StatCardProps) {
  const style =
    trend === "down"
      ? { box: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400", Icon: ArrowDown }
      : trend === "neutral"
        ? { box: "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400", Icon: Minus }
        : { box: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400", Icon: ArrowUp };

  return (
    <div className="flex-1 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          {icon}
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.box}`}
          >
            <style.Icon className="h-3 w-3" strokeWidth={2.5} />
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: TapDataPoint }[];
}) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0];
  return (
    <div className="rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-gray-900 dark:text-white">{point.value} taps</div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="mx-auto w-full animate-pulse">
      <div className="mb-5">
        <div className="h-7 w-24 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-80 max-w-full rounded bg-gray-100 dark:bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-gray-100 dark:bg-slate-800/80 dark:border dark:border-slate-800" />
        ))}
      </div>
      <div className="mt-4 h-80 rounded-2xl border border-gray-100 bg-white dark:border-slate-800 dark:bg-[#0b1727]" />
    </div>
  );
}

/* --------------------------- Main component --------------------------- */

export default function NFCAnalyticsCard() {
  /* 1) Profile → businessId (cached by RTK Query) */
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetMeProfileQuery(undefined);

  // Works whether or not your baseApi unwraps the `data` envelope
  const profileData = profile?.data ?? profile;
  const rawId: unknown =
    profileData?.businessId ?? profileData?.businesses?.[0]?.id;

  // Only query with a valid 24-char hex ObjectId (prevents the 400 error)
  const businessId: string | undefined =
    typeof rawId === "string" && /^[a-f0-9]{24}$/i.test(rawId)
      ? rawId
      : undefined;

  /* 2) NFC stats — skipped until businessId is available */
  const {
    data: nfc,
    isLoading: nfcLoading,
    isFetching,
    isError: nfcError,
    refetch,
  } = useGetNfcAnalyticsQuery(businessId, { skip: !businessId });

  const stats: NfcStatsData | undefined = nfc?.data ?? nfc;

  /* 3) Derive chart data + ticks from the response */
  const chart = useMemo(() => {
    const data: TapDataPoint[] = stats?.chart?.data ?? stats?.tapData ?? [];
    const labelled = data.filter((d) => d.label !== "");
    const ticks = labelled.map((d) => d.x);
    const labelByX: Record<number, string> = Object.fromEntries(
      data.map((d) => [d.x, d.label]),
    );
    const maxX = data.length ? Math.max(...data.map((d) => d.x)) : 1;
    const maxY = data.length ? Math.max(...data.map((d) => d.taps)) : 0;
    const yMax = niceMax(maxY);
    const yTicks = [0, 1, 2, 3, 4].map((i) => (yMax / 4) * i);
    return { data, ticks, labelByX, maxX, yMax, yTicks };
  }, [stats]);

  /* 4) States */
  if (profileLoading || (businessId && nfcLoading)) return <CardSkeleton />;

  if (profileError || !businessId) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
        {profileError
          ? "We couldn't load your profile. Please try again."
          : "No business found on your profile yet."}
      </div>
    );
  }

  if (nfcError || !stats) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
        <p>We couldn't load your NFC analytics.</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const total = stats.cards?.totalNfcTaps;
  const month = stats.cards?.tapsThisMonth;
  const reviews = stats.cards?.reviewsFromNfc;

  return (
    <div className={`mx-auto w-full ${isFetching ? "opacity-80" : ""}`}>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">NFC</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Make it easy for customers to start the review experience with one
          tap.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Star className="h-4 w-4 fill-white" />}
          value={(total?.value ?? stats.totalNfcTaps ?? 0).toLocaleString()}
          label={total?.title ?? "Total NFC Taps"}
          delta={cleanDelta(total?.change ?? stats.totalNfcTapsChange)}
          trend={total?.trend}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" strokeWidth={2.5} />}
          value={(month?.value ?? stats.tapsThisMonth ?? 0).toLocaleString()}
          label={month?.title ?? "Taps This Month"}
          delta={cleanDelta(month?.change ?? stats.tapsThisMonthChange)}
          trend={month?.trend}
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" strokeWidth={2.5} />}
          value={(reviews?.value ?? stats.reviewsFromNfc ?? 0).toLocaleString()}
          label={reviews?.title ?? "Reviews from NFC"}
          delta={cleanDelta(reviews?.change ?? stats.reviewsFromNfcChange)}
          trend={reviews?.trend}
        />
      </div>

      {/* Chart card */}
      <div className="mt-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0b1727] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {stats.chart?.title ?? "NFC Tap Activity"}
            </h2>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-400">
              {stats.chart?.subtitle ??
                "Taps recorded across all NFC locations"}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {stats.chart?.period ?? "Last 6 months"}
          </button>
        </div>

        <div className="mt-6 h-64 w-full sm:h-80">
          {chart.data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-slate-500">
              No tap activity recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chart.data}
                margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tapsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="#334155"
                  strokeOpacity={0.25}
                  strokeDasharray="3 5"
                />

                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, chart.maxX]}
                  ticks={chart.ticks}
                  tickFormatter={(x: number) => chart.labelByX[x] ?? ""}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={8}
                />

                <YAxis
                  domain={[0, chart.yMax]}
                  ticks={chart.yTicks}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  width={32}
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
                />

                <Area
                  type="monotone"
                  dataKey="taps"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#tapsFill)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Physical NFC Stands & QR Codes Generator / Manager */}
      <NfcStandsList
        businessId={businessId}
        businessName={profileData?.businessName ?? profileData?.businesses?.[0]?.name}
      />
    </div>
  );
}
