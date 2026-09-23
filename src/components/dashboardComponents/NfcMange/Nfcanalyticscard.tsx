"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUp, Calendar, Star, TrendingUp } from "lucide-react";

/**
 * NFCAnalyticsCard
 * -----------------
 * A single, self-contained analytics component showing NFC tap
 * performance: three summary stat cards + a tap-activity trend chart.
 *
 * Stack: React + Next.js (App Router, "use client") + TypeScript + Tailwind CSS
 * Chart: recharts (npm install recharts lucide-react)
 *
 * Fully responsive — stat cards stack to a single column on mobile and
 * the chart scales fluidly with ResponsiveContainer.
 */

/* ----------------------------- Types ----------------------------- */

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delta: string;
}

interface TapDataPoint {
  x: number;
  label: string;
  taps: number;
}

/* --------------------------- Chart data --------------------------- */

// Day-offset x-axis (Apr 1 = 0) so the curve can be smooth while only
// specific points carry a visible axis label, matching the reference.
const tapData: TapDataPoint[] = [
  { x: 0, label: "Apr", taps: 12 },
  { x: 12, label: "", taps: 13 },
  { x: 24, label: "", taps: 15 },
  { x: 31, label: "May", taps: 16 },
  { x: 43, label: "", taps: 18 },
  { x: 55, label: "", taps: 20 },
  { x: 61, label: "Jun", taps: 22 },
  { x: 73, label: "", taps: 26 },
  { x: 85, label: "", taps: 31 },
  { x: 92, label: "Jul", taps: 37 },
  { x: 101, label: "", taps: 47 },
  { x: 110, label: "", taps: 58 },
  { x: 118, label: "", taps: 66 },
  { x: 123, label: "Aug", taps: 70 },
  { x: 131, label: "", taps: 64 },
  { x: 138, label: "", taps: 48 },
  { x: 145, label: "", taps: 30 },
  { x: 150, label: "", taps: 18 },
  { x: 154, label: "Sep 1", taps: 13 },
  { x: 160, label: "Sep 7", taps: 21 },
  { x: 166, label: "Sep 13", taps: 39 },
];

const xTicks = tapData.filter((d) => d.label !== "").map((d) => d.x);
const tickLabelByX = Object.fromEntries(tapData.map((d) => [d.x, d.label]));

/* ---------------------------- Sub UI ---------------------------- */

function StatCard({ icon, value, label, delta }: StatCardProps) {
  return (
    <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          {icon}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
          {delta}
        </span>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
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
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-gray-900">{point.value} taps</div>
    </div>
  );
}

/* --------------------------- Main component --------------------------- */

export default function NFCAnalyticsCard() {
  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-900">NFC</h1>
        <p className="mt-1 text-sm text-gray-500">
          Make it easy for customers to start the review experience with one
          tap.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Star className="h-4 w-4 fill-white" />}
          value={241}
          label="Total NFC Taps"
          delta="0.2 pts"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" strokeWidth={2.5} />}
          value={38}
          label="Taps This Month"
          delta="34 new"
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" strokeWidth={2.5} />}
          value={55}
          label="Reviews from NFC"
          delta="12% vs Aug"
        />
      </div>

      {/* Chart card */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              NFC Tap Activity
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Taps recorded across all NFC locations
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Last 6 months
          </button>
        </div>

        <div className="mt-6 h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={tapData}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tapsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#e5e7eb"
                strokeDasharray="3 5"
              />

              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 166]}
                ticks={xTicks}
                tickFormatter={(x: number) => tickLabelByX[x] ?? ""}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={8}
              />

              <YAxis
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
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
        </div>
      </div>
    </div>
  );
}
