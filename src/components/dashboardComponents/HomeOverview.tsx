"use client";

import React, { useMemo, useState } from "react";
import {
  Star,
  TrendingUp,
  Calendar,
  Lightbulb,
  Zap,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

/**
 * ReviewDashboard
 * -----------------------------------------------------------------------
 * A single, self-contained review-growth dashboard component.
 * Stack: React + Next.js (App Router, "use client") + TypeScript + Tailwind CSS.
 * Fully responsive: stacks to a single column on mobile, 2-col on tablet,
 * 4-col stat row + 2-col main grid on desktop.
 *
 * Drop this file into e.g. `app/components/ReviewDashboard.tsx` and render
 * `<ReviewDashboard />` anywhere. All data is passed via the `data` prop
 * with sensible defaults matching the reference design, so it works
 * out of the box and is easy to wire up to real data later.
 * -----------------------------------------------------------------------
 */

type Period = "7 Days" | "30 Days" | "90 Days" | "12 Months";

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  delta: string;
}

interface RequestRow {
  label: string;
  value: number;
  total: number;
  barColor: string;
}

interface ReviewDashboardProps {
  businessName?: string;
  rangeLabel?: string;
  stats?: StatCard[];
  chartPoints?: number[]; // "This Period" series, left -> right
  priorPoints?: number[]; // "Prior Period" series, left -> right
  chartLabels?: string[];
  totalReviews?: number;
  vsPreviousPct?: string;
  requestRows?: RequestRow[];
}

const defaultChartLabels = [
  "Aug 14",
  "Aug 18",
  "Aug 22",
  "Aug 26",
  "Aug 30",
  "Sep 3",
  "Sep 7",
  "Sep 11",
  "Sep 13",
];

const defaultThisPeriod = [96, 104, 112, 119, 126, 133, 140, 150, 158];
const defaultPriorPeriod = [98, 100, 103, 106, 108, 110, 112, 114, 116];

const defaultRequestRows: RequestRow[] = [
  { label: "Requests Sent", value: 247, total: 247, barColor: "bg-blue-600" },
  { label: "Delivered", value: 231, total: 247, barColor: "bg-blue-600" },
  { label: "Responses", value: 89, total: 247, barColor: "bg-blue-300" },
  {
    label: "Reviews Generated",
    value: 34,
    total: 247,
    barColor: "bg-emerald-400",
  },
];

const defaultStats = (): StatCard[] => [
  {
    icon: <Star className="h-5 w-5" fill="currentColor" strokeWidth={0} />,
    value: "4.8",
    label: "Google Rating",
    sublabel: "Based on 178 reviews",
    delta: "↑ 0.2 pts",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    value: "178",
    label: "Total Reviews",
    sublabel: "All-time Google reviews",
    delta: "↑ 34 new",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    value: "34",
    label: "Reviews This Month",
    sublabel: "Sep 1–13, 2026",
    delta: "↑ 12% vs Aug",
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    value: "18.7%",
    label: "Review Growth",
    sublabel: "vs. last month 15.2%",
    delta: "↑ 3.5pts",
  },
];

function buildSmoothPath(
  values: number[],
  width: number,
  height: number,
  min: number,
  max: number,
) {
  if (values.length === 0) return "";
  const stepX = width / (values.length - 1);
  const toY = (v: number) => height - ((v - min) / (max - min)) * height;

  const pts = values.map((v, i) => ({ x: i * stepX, y: toY(v) }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

export default function ReviewDashboard({
  businessName = "Bella's Cafe",
  rangeLabel = "Last 30 Days",
  stats,
  chartPoints = defaultThisPeriod,
  priorPoints = defaultPriorPeriod,
  chartLabels = defaultChartLabels,
  totalReviews = 178,
  vsPreviousPct = "43.5%",
  requestRows = defaultRequestRows,
}: ReviewDashboardProps) {
  const [period, setPeriod] = useState<Period>("30 Days");
  const resolvedStats = stats ?? defaultStats();

  const { pathThis, pathPrior, yTicks, gridWidth, gridHeight } = useMemo(() => {
    const width = 1000;
    const height = 220;
    const allVals = [...chartPoints, ...priorPoints];
    const max = Math.max(...allVals, 1) * 1.1;
    const min = 0;
    return {
      pathThis: buildSmoothPath(chartPoints, width, height, min, max),
      pathPrior: buildSmoothPath(priorPoints, width, height, min, max),
      yTicks: [0, 45, 90, 135, 180].filter((t) => t <= max || t === 180),
      gridWidth: width,
      gridHeight: height,
    };
  }, [chartPoints, priorPoints]);

  const periods: Period[] = ["7 Days", "30 Days", "90 Days", "12 Months"];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Good morning, {businessName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s how your review growth is performing — {rangeLabel}.
          </p>
        </header>

        {/* Stat cards */}
        <div className="xs:grid-cols-2 mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resolvedStats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  {s.icon}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  {s.delta}
                </span>
              </div>
              <div className="text-2xl font-semibold text-slate-900 sm:text-[28px]">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-700">
                {s.label}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">{s.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Review Growth chart */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Review Growth
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Track how your Google reviews are growing over time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-blue-600" />
                  This Period
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-slate-400" />
                  Prior Period
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Chart time range"
                className="flex w-full flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 sm:w-auto"
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
                        : "text-slate-500 hover:text-slate-700"
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
              <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {totalReviews}
              </div>
              <div className="text-sm text-blue-600">Total Reviews</div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                ↑ {vsPreviousPct}
              </span>
              <div className="mt-1 text-xs text-slate-400">
                vs. previous period
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-4 w-full overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="flex">
                <div className="flex w-8 flex-col justify-between py-1 text-[11px] text-slate-400 sm:w-10">
                  {[...yTicks].reverse().map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="relative flex-1">
                  <svg
                    viewBox={`0 0 ${gridWidth} ${gridHeight}`}
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
                          stopOpacity="0.18"
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* horizontal gridlines */}
                    {yTicks.map((_, i) => {
                      const y =
                        gridHeight - (i / (yTicks.length - 1)) * gridHeight;
                      return (
                        <line
                          key={i}
                          x1={0}
                          x2={gridWidth}
                          y1={y}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray="3 4"
                          strokeWidth={1}
                        />
                      );
                    })}

                    {/* prior period (dashed grey) */}
                    <path
                      d={pathPrior}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />

                    {/* fill under this period */}
                    <path
                      d={`${pathThis} L ${gridWidth},${gridHeight} L 0,${gridHeight} Z`}
                      fill="url(#fillGradient)"
                      stroke="none"
                    />

                    {/* this period (solid blue) */}
                    <path
                      d={pathThis}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="ml-8 mt-2 flex justify-between text-[11px] text-slate-400 sm:ml-10">
                {chartLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom grid: Review Requests + Quick Actions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          {/* Review Requests */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Review Requests
            </h2>
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              Last 30 days performance
            </p>

            <div className="mt-5 space-y-5">
              {requestRows.map((row) => {
                const pct = Math.round((row.value / row.total) * 100);
                return (
                  <div key={row.label}>
                    <div className="mb-1.5 flex items-baseline justify-between text-sm">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="font-semibold text-slate-900">
                        {row.value}{" "}
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          {pct}%
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${row.barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View Requests
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Quick Actions
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              <button className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
                <AlertTriangle className="h-4 w-4" />
                Send Review Request
              </button>

              <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <Zap className="h-4 w-4 text-slate-400" />
                QuickSend
              </button>

              <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <Plus className="h-4 w-4 text-slate-400" />
                Add Customer
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
