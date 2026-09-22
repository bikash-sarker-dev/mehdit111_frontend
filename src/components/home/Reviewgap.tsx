"use client";

import { TrendingUp } from "lucide-react";

interface MonthData {
  label: string;
  yourBusiness: number;
  avgCompetitor: number;
}

const data: MonthData[] = [
  { label: "Apr", yourBusiness: 55, avgCompetitor: 28 },
  { label: "May", yourBusiness: 68, avgCompetitor: 32 },
  { label: "Jun", yourBusiness: 58, avgCompetitor: 24 },
  { label: "Jul", yourBusiness: 82, avgCompetitor: 30 },
  { label: "Aug", yourBusiness: 88, avgCompetitor: 26 },
  { label: "Sep", yourBusiness: 96, avgCompetitor: 22 },
];

const MAX_VALUE = 100;

export default function ReviewGap() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Chart card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  New Reviews Per Month
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your Business vs. Average Competitor
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                <TrendingUp className="h-3.5 w-3.5" />
                Growing faster
              </span>
            </div>

            <div className="mt-8 flex h-56 items-end justify-between gap-3 sm:gap-4">
              {data.map((month) => (
                <div
                  key={month.label}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div className="flex h-44 w-full items-end justify-center gap-1.5">
                    <div
                      className="w-1/2 max-w-[18px] rounded-t-md bg-blue-500"
                      style={{
                        height: `${(month.yourBusiness / MAX_VALUE) * 100}%`,
                      }}
                    />
                    <div
                      className="w-1/2 max-w-[18px] rounded-t-md bg-slate-200"
                      style={{
                        height: `${(month.avgCompetitor / MAX_VALUE) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{month.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-6 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-xs text-slate-600">Your Business</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="text-xs text-slate-600">Avg Competitor</span>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <span className="text-sm font-semibold text-blue-600">
              Review Gap
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              See Your Review Gap
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              The Review Gap shows whether your business is gaining reviews
              faster or slower than local competitors. It answers the single
              most important question:
            </p>
            <blockquote className="mt-6 border-l-2 border-blue-600 pl-4 text-base font-semibold text-slate-900">
              &ldquo;Am I growing faster than my competitors?&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
