// // components/DashboardOverview.tsx
// // Single, self-contained dashboard component.
// // Stack: React · Next.js (App Router or Pages) · Tailwind CSS · TypeScript
// // No extra dependencies — icons and charts are inline SVG / CSS.
// // No hooks, so it works as a Server Component or a Client Component.

// /* ----------------------------- Types & data ----------------------------- */

// type IconName = "users" | "click" | "wallet" | "userPlus" | "x";

// type Stat = {
//   label: string;
//   value: string;
//   change: string;
//   icon: IconName;
//   tone: "blue" | "red";
// };

// type Activity = {
//   name: string;
//   detail: string;
//   status?: "Active" | "Trial";
// };

// const ICONS: Record<IconName, string[]> = {
//   users: [
//     "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
//     "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
//     "M22 21v-2a4 4 0 0 0-3-3.87",
//     "M16 3.13a4 4 0 0 1 0 7.75",
//   ],
//   click: [
//     "M14 4.1 12 6",
//     "m5.1 8-2.9-.8",
//     "m6 12-1.9 2",
//     "M7.2 2.2 8 5.1",
//     "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
//   ],
//   wallet: [
//     "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
//     "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
//   ],
//   userPlus: [
//     "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
//     "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
//     "M19 8v6",
//     "M22 11h-6",
//   ],
//   x: ["M18 6 6 18", "m6 6 12 12"],
// };

// const STATS: Stat[] = [
//   {
//     label: "Total User",
//     value: "74",
//     change: "+12%",
//     icon: "users",
//     tone: "blue",
//   },
//   {
//     label: "Active Subscriptions",
//     value: "178",
//     change: "+8%",
//     icon: "click",
//     tone: "blue",
//   },
//   {
//     label: "Total Revenue",
//     value: "$524,390",
//     change: "+34%",
//     icon: "wallet",
//     tone: "blue",
//   },
//   {
//     label: "New Subscribers",
//     value: "13",
//     change: "+12%",
//     icon: "userPlus",
//     tone: "blue",
//   },
//   {
//     label: "Canceled",
//     value: "13",
//     change: "-2% vs last month",
//     icon: "x",
//     tone: "red",
//   },
// ];

// const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

// // Monthly recurring revenue (in $k)
// const REVENUE = [13, 20, 25, 30, 33, 40, 47.5];
// const REVENUE_MAX = 60;
// const REVENUE_TICKS = [60, 45, 30, 15, 0];

// // Subscribers per month
// const ACTIVE = [18, 27, 35, 44, 52, 61, 75];
// const CANCELLED = [2, 3, 2, 4, 3, 5, 4];
// const SUBS_MAX = 80;
// const SUBS_TICKS = [80, 60, 40, 20, 0];

// // Plan distribution (drawn clockwise from 12 o'clock, in this order)
// const PLANS = [
//   { name: "Starter", count: 22, color: "#94a3b8" },
//   { name: "Pro", count: 14, color: "#111827" },
//   { name: "Growth", count: 38, color: "#2563eb" },
// ];
// const LEGEND_ORDER = ["Starter", "Growth", "Pro"];

// const NEW_USERS: Activity[] = [
//   { name: "Apex Marketing Group", detail: "United States · Mar 3, 2025" },
//   { name: "CloudScale Inc.", detail: "United Kingdom · Jan 18, 2025" },
//   { name: "RetailPro Solutions", detail: "Canada · Sep 14, 2026" },
//   { name: "BrightLocal Agency", detail: "Australia · Jun 7, 2025" },
//   { name: "FinServe Corp", detail: "India · Feb 20, 2025" },
// ];

// const RECENT: Activity[] = [
//   {
//     name: "Apex Marketing Group",
//     detail: "Growth · Monthly · $99/mo",
//     status: "Active",
//   },
//   {
//     name: "CloudScale Inc.",
//     detail: "Pro · Annual · $1,908/mo",
//     status: "Active",
//   },
//   {
//     name: "RetailPro Solutions",
//     detail: "Starter · Monthly · $49/mo",
//     status: "Trial",
//   },
//   {
//     name: "BrightLocal Agency",
//     detail: "Growth · Monthly · $99/mo",
//     status: "Active",
//   },
//   {
//     name: "FinServe Corp",
//     detail: "Pro · Annual · $1,908/mo",
//     status: "Active",
//   },
// ];

// const BADGE: Record<NonNullable<Activity["status"]>, string> = {
//   Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
//   Trial: "border-blue-200 bg-blue-50 text-blue-700",
// };

// /* ------------------------------ Chart helpers ---------------------------- */

// // Smooth curve through points (Catmull-Rom → cubic Bézier), coordinates in a 0–100 box.
// function smoothPath(pts: [number, number][]): string {
//   let d = `M${pts[0][0]},${pts[0][1]}`;
//   for (let i = 0; i < pts.length - 1; i++) {
//     const p0 = pts[i - 1] ?? pts[i];
//     const p1 = pts[i];
//     const p2 = pts[i + 1];
//     const p3 = pts[i + 2] ?? p2;
//     const c1x = p1[0] + (p2[0] - p0[0]) / 6;
//     const c1y = p1[1] + (p2[1] - p0[1]) / 6;
//     const c2x = p2[0] - (p3[0] - p1[0]) / 6;
//     const c2y = p2[1] - (p3[1] - p1[1]) / 6;
//     d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
//   }
//   return d;
// }

// const CARD = "rounded-2xl border border-slate-200/80 bg-white";

// /* -------------------------------- Component ------------------------------ */

// export default function DashboardOverviewAdmin({
//   businessName = "Bella's Cafe",
// }: {
//   businessName?: string;
// }) {
//   // Revenue area chart
//   const points: [number, number][] = REVENUE.map((v, i) => [
//     (i / (REVENUE.length - 1)) * 100,
//     100 - (v / REVENUE_MAX) * 100,
//   ]);
//   const line = smoothPath(points);
//   const area = `${line} L100,100 L0,100 Z`;

//   // Donut chart
//   const R = 42;
//   const C = 2 * Math.PI * R;
//   const GAP = 1.6;
//   const total = PLANS.reduce((sum, p) => sum + p.count, 0);
//   let offset = 0;
//   const segments = PLANS.map((p) => {
//     const len = (p.count / total) * C;
//     const seg = {
//       ...p,
//       dash: `${Math.max(len - GAP, 0)} ${C - Math.max(len - GAP, 0)}`,
//       offset: -offset,
//     };
//     offset += len;
//     return seg;
//   });

//   return (
//     <div className="min-h-screen w-full font-sans text-slate-900 antialiased">
//       <div className="mx-auto flex w-full flex-col gap-4 sm:gap-6">
//         {/* Header */}
//         <header>
//           <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//             Good morning, {businessName}
//           </h1>
//           <p className="mt-1.5 text-sm text-slate-500">
//             Here&apos;s how your review growth is performing — Last 30 Days.
//           </p>
//         </header>

//         {/* Stat cards */}
//         <section
//           aria-label="Key metrics"
//           className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6"
//         >
//           {STATS.map((s) => (
//             <article key={s.label} className={`${CARD} p-4 sm:p-5`}>
//               <div
//                 className={`flex h-9 w-9 items-center justify-center rounded-xl text-white sm:h-10 sm:w-10 ${
//                   s.tone === "red" ? "bg-red-600" : "bg-[#175cff]"
//                 }`}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   className="h-[18px] w-[18px]"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   aria-hidden="true"
//                 >
//                   {ICONS[s.icon].map((d) => (
//                     <path key={d} d={d} />
//                   ))}
//                 </svg>
//               </div>
//               <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight sm:mt-4 sm:text-[28px]">
//                 {s.value}
//               </p>
//               <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
//                 {s.label}
//               </p>
//               <p className="mt-2 text-xs text-green-600">{s.change}</p>
//             </article>
//           ))}
//         </section>

//         {/* Revenue + Plan distribution */}
//         <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.75fr_1fr]">
//           {/* Revenue growth */}
//           <article className={`${CARD} p-4 sm:p-6`}>
//             <h2 className="text-[15px] font-medium">Revenue Growth</h2>
//             <p className="mt-1.5 text-xs text-slate-500">
//               Monthly recurring revenue — 2026
//             </p>

//             <div
//               className="mt-5 flex gap-3"
//               role="img"
//               aria-label={`Monthly recurring revenue rising from $${REVENUE[0]}k in ${MONTHS[0]} to $${REVENUE[REVENUE.length - 1]}k in ${MONTHS[MONTHS.length - 1]}`}
//             >
//               <div className="relative h-44 w-9 shrink-0 text-xs text-slate-400 sm:h-56">
//                 {REVENUE_TICKS.map((t) => (
//                   <span
//                     key={t}
//                     className="absolute right-0 -translate-y-1/2 tabular-nums"
//                     style={{ top: `${100 - (t / REVENUE_MAX) * 100}%` }}
//                   >
//                     ${t}k
//                   </span>
//                 ))}
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="relative h-44 sm:h-56">
//                   <svg
//                     viewBox="0 0 100 100"
//                     preserveAspectRatio="none"
//                     className="absolute inset-0 h-full w-full overflow-visible"
//                     aria-hidden="true"
//                   >
//                     <defs>
//                       <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
//                         <stop
//                           offset="0%"
//                           stopColor="#2563eb"
//                           stopOpacity="0.12"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor="#2563eb"
//                           stopOpacity="0"
//                         />
//                       </linearGradient>
//                     </defs>
//                     {REVENUE_TICKS.map((t) => (
//                       <line
//                         key={`h${t}`}
//                         x1="0"
//                         x2="100"
//                         y1={100 - (t / REVENUE_MAX) * 100}
//                         y2={100 - (t / REVENUE_MAX) * 100}
//                         stroke="#e2e8f0"
//                         strokeOpacity="0.7"
//                         strokeDasharray="3 3"
//                         vectorEffect="non-scaling-stroke"
//                       />
//                     ))}
//                     {MONTHS.map((m, i) => (
//                       <line
//                         key={`v${m}`}
//                         x1={(i / (MONTHS.length - 1)) * 100}
//                         x2={(i / (MONTHS.length - 1)) * 100}
//                         y1="0"
//                         y2="100"
//                         stroke="#e2e8f0"
//                         strokeOpacity="0.7"
//                         strokeDasharray="3 3"
//                         vectorEffect="non-scaling-stroke"
//                       />
//                     ))}
//                     <path d={area} fill="url(#rev-fill)" />
//                     <path
//                       d={line}
//                       fill="none"
//                       stroke="#2563eb"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       vectorEffect="non-scaling-stroke"
//                     />
//                   </svg>
//                 </div>
//                 <div className="mt-3 flex justify-between text-xs text-slate-400">
//                   {MONTHS.map((m) => (
//                     <span key={m}>{m}</span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </article>

//           {/* Plan distribution */}
//           <article className={`${CARD} p-4 sm:p-6`}>
//             <h2 className="text-[15px] font-medium">Plan Distribution</h2>
//             <p className="mt-1.5 text-xs text-slate-500">
//               Active subscribers by plan
//             </p>

//             <div className="mx-auto mt-6 flex w-full max-w-[240px] flex-col items-center">
//               <svg
//                 viewBox="0 0 100 100"
//                 className="h-36 w-36 sm:h-40 sm:w-40"
//                 role="img"
//                 aria-label={`Plan distribution: ${PLANS.map((p) => `${p.name} ${p.count}`).join(", ")}`}
//               >
//                 <g transform="rotate(-90 50 50)">
//                   {segments.map((s) => (
//                     <circle
//                       key={s.name}
//                       cx="50"
//                       cy="50"
//                       r={R}
//                       fill="none"
//                       stroke={s.color}
//                       strokeWidth="15"
//                       strokeDasharray={s.dash}
//                       strokeDashoffset={s.offset}
//                     />
//                   ))}
//                 </g>
//               </svg>

//               <ul className="mt-6 w-full space-y-2.5 text-[13px]">
//                 {LEGEND_ORDER.map((name) => {
//                   const plan = PLANS.find((p) => p.name === name)!;
//                   return (
//                     <li
//                       key={name}
//                       className="flex items-center justify-between"
//                     >
//                       <span className="flex items-center gap-2.5 text-slate-500">
//                         <span
//                           className="h-2 w-2 rounded-full"
//                           style={{ backgroundColor: plan.color }}
//                           aria-hidden="true"
//                         />
//                         {name}
//                       </span>
//                       <span className="font-semibold tabular-nums text-slate-900">
//                         {plan.count}
//                       </span>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </article>
//         </section>

//         {/* Subscription growth */}
//         <section className={`${CARD} p-4 sm:p-6`}>
//           <h2 className="text-[15px] font-medium">Subscription Growth</h2>
//           <p className="mt-1.5 text-xs text-slate-500">
//             Active vs. cancelled subscribers per month
//           </p>

//           <div
//             className="mt-5 flex gap-3"
//             role="img"
//             aria-label={`Active and cancelled subscribers per month, ${MONTHS[0]} to ${MONTHS[MONTHS.length - 1]}. Active grew from ${ACTIVE[0]} to ${ACTIVE[ACTIVE.length - 1]}.`}
//           >
//             <div className="relative h-44 w-6 shrink-0 text-xs text-slate-400 sm:h-56">
//               {SUBS_TICKS.map((t) => (
//                 <span
//                   key={t}
//                   className="absolute right-0 -translate-y-1/2 tabular-nums"
//                   style={{ top: `${100 - (t / SUBS_MAX) * 100}%` }}
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>

//             <div className="min-w-0 flex-1">
//               <div className="relative h-44 sm:h-56">
//                 {SUBS_TICKS.map((t) => (
//                   <div
//                     key={t}
//                     className="absolute inset-x-0 border-t border-dashed border-slate-200/70"
//                     style={{ top: `${100 - (t / SUBS_MAX) * 100}%` }}
//                   />
//                 ))}
//                 <div className="absolute inset-0 flex">
//                   {MONTHS.map((m, i) => (
//                     <div
//                       key={m}
//                       className="flex h-full flex-1 items-end justify-center gap-0.5 border-l border-dashed border-slate-200/70 last:border-r sm:gap-1"
//                     >
//                       <div
//                         className="w-3 rounded-t-md bg-blue-600 sm:w-5 lg:w-6"
//                         style={{ height: `${(ACTIVE[i] / SUBS_MAX) * 100}%` }}
//                       />
//                       <div
//                         className="w-3 rounded-t-sm bg-red-300 sm:w-5 lg:w-6"
//                         style={{
//                           height: `${(CANCELLED[i] / SUBS_MAX) * 100}%`,
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-3 flex text-xs text-slate-400">
//                 {MONTHS.map((m) => (
//                   <span key={m} className="flex-1 text-center">
//                     {m}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Lists */}
//         <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
//           {/* New registered users */}
//           <article className={CARD}>
//             <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
//               <h2 className="text-[15px] font-medium">New Registered User</h2>
//               <a
//                 href="#"
//                 className="rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
//               >
//                 View all
//               </a>
//             </div>
//             <ul>
//               {NEW_USERS.map((u) => (
//                 <li
//                   key={u.name}
//                   className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
//                 >
//                   <span
//                     className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[13px] font-medium text-slate-600"
//                     aria-hidden="true"
//                   >
//                     {u.name[0]}
//                   </span>
//                   <div className="min-w-0">
//                     <p className="truncate text-[13px] font-medium text-slate-900">
//                       {u.name}
//                     </p>
//                     <p className="mt-0.5 truncate text-xs text-slate-500">
//                       {u.detail}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </article>

//           {/* Recent subscription activity */}
//           <article className={CARD}>
//             <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
//               <h2 className="text-[15px] font-medium">
//                 Recent Subscription Activity
//               </h2>
//               <a
//                 href="#"
//                 className="shrink-0 rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
//               >
//                 View all
//               </a>
//             </div>
//             <ul>
//               {RECENT.map((r) => (
//                 <li
//                   key={r.name}
//                   className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
//                 >
//                   <div className="min-w-0">
//                     <p className="truncate text-[13px] font-medium text-slate-900">
//                       {r.name}
//                     </p>
//                     <p className="mt-0.5 truncate text-xs text-slate-500">
//                       {r.detail}
//                     </p>
//                   </div>
//                   {r.status && (
//                     <span
//                       className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE[r.status]}`}
//                     >
//                       {r.status}
//                     </span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </article>
//         </section>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";

// Adjust these two import paths to match your project.
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import {
  useGetOverviewChartQuery,
  useGetPlatformOverviewStatCardsQuery,
  useGetRecentRegisteredUsersQuery,
} from "@/redux/api/admin/dashboardOverview/adminOverViewSlicApi";

/* --------------------------------- Types --------------------------------- */

type IconName = "users" | "click" | "wallet" | "userPlus" | "x";

type Change = { text: string; good: boolean };

type Stat = {
  label: string;
  value: string;
  change?: Change;
  icon: IconName;
  tone: "blue" | "red";
};

type Business = { id: string; name: string };

// API response shapes (only the fields this component uses)
type ProfileResponse = {
  data?: {
    businessId?: string;
    businesses?: Business[];
  };
};

type PlatformOverviewResponse = {
  data?: {
    platformTotals: { users: number };
    subscriptionDistribution: Record<string, number>;
    recentBusinesses: {
      id: string;
      name: string;
      owner: string;
      email: string;
      plan: string;
      createdAt: string;
    }[];
  };
};

type RecentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
};

type RecentUsersResponse = { data?: RecentUser[] };

type OverviewChartResponse = {
  data?: {
    revenueGrowth: {
      currentMrr: number;
      formattedCurrentMrr: string;
      monthlyData: { month: string; revenue: number }[];
    };
    planDistribution: {
      totalSubscribers: number;
      plans: {
        plan: string;
        name: string;
        count: number;
        color: string;
        monthlyPrice: number;
      }[];
    };
    subscriptionGrowth: {
      monthlyData: { month: string; active: number; cancelled: number }[];
    };
  };
};

/* ------------------------------ Static config ----------------------------- */

const ICONS: Record<IconName, string[]> = {
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  click: [
    "M14 4.1 12 6",
    "m5.1 8-2.9-.8",
    "m6 12-1.9 2",
    "M7.2 2.2 8 5.1",
    "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
  ],
  wallet: [
    "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
    "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
  ],
  userPlus: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    "M19 8v6",
    "M22 11h-6",
  ],
  x: ["M18 6 6 18", "m6 6 12 12"],
};

const BADGE = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Trial: "border-blue-200 bg-blue-50 text-blue-700",
} as const;

const PLAN_LABEL: Record<string, string> = {
  FREE_TRIAL: "Free trial",
  STARTER: "Starter",
  GROWTH: "Growth",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

const CARD = "rounded-2xl border border-slate-200/80 bg-white";
const BUSINESS_CACHE_KEY = "dashboard:business";

/* -------------------------------- Helpers -------------------------------- */

// Smooth curve through points (Catmull-Rom → cubic Bézier), 0–100 box.
function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// Rounds an axis maximum up to a clean value and returns evenly spaced ticks (top → 0).
function niceScale(maxRaw: number, divisions = 4) {
  if (!(maxRaw > 0)) {
    return {
      max: divisions,
      ticks: Array.from({ length: divisions + 1 }, (_, i) => divisions - i),
    };
  }
  const rough = maxRaw / divisions;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / mag;
  const step = ([1, 1.5, 2, 2.5, 3, 5, 10].find((n) => n >= norm) ?? 10) * mag;
  return {
    max: step * divisions,
    ticks: Array.from({ length: divisions + 1 }, (_, i) =>
      Number((step * (divisions - i)).toFixed(2)),
    ),
  };
}

function pctChange(current?: number, previous?: number): number | null {
  if (current == null || previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function toChange(pct: number | null, inverse = false): Change | undefined {
  if (pct == null) return undefined;
  const rounded = Math.round(pct);
  const sign = rounded > 0 ? "+" : "";
  return {
    text: `${sign}${rounded}% vs last month`,
    good: inverse ? rounded <= 0 : rounded >= 0,
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC", // avoids server/client hydration mismatches
  });

const formatMoney = (n: number) => `$${n.toLocaleString("en-US")}`;

/* ------------------------- Business ID (cached) hook ---------------------- */

// Reads the business from the profile query (RTK Query already caches the
// response in memory) and also mirrors { id, name } to localStorage, so the
// business ID/name is available instantly on the next visit.
export function useCachedBusiness() {
  const { data } = useGetMeProfileQuery(undefined) as {
    data?: ProfileResponse;
  };
  const [cached, setCached] = useState<Business | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BUSINESS_CACHE_KEY);
      if (raw) setCached(JSON.parse(raw) as Business);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const profile = data?.data;
  const fresh =
    profile?.businesses?.find((b) => b.id === profile.businessId) ??
    profile?.businesses?.[0] ??
    null;

  useEffect(() => {
    if (!fresh) return;
    const next = { id: fresh.id, name: fresh.name };
    setCached(next);
    try {
      localStorage.setItem(BUSINESS_CACHE_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage errors */
    }
  }, [fresh?.id, fresh?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const business = fresh ?? cached;
  return {
    businessId: business?.id ?? null,
    businessName: business?.name ?? null,
  };
}

/* ------------------------------ Small pieces ------------------------------ */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70 ${className}`}
      aria-hidden="true"
    />
  );
}

function Notice({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2 py-6 text-sm text-slate-500">
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2 className="text-[15px] font-medium">{title}</h2>
      <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>
    </>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <article className={`${CARD} p-4 sm:p-5`}>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white sm:h-10 sm:w-10 ${
          stat.tone === "red" ? "bg-red-600" : "bg-[#175cff]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {ICONS[stat.icon].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight sm:mt-4 sm:text-[28px]">
        {stat.value}
      </p>
      <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">{stat.label}</p>
      {stat.change && (
        <p
          className={`mt-2 text-xs ${
            stat.change.good ? "text-green-600" : "text-red-600"
          }`}
        >
          {stat.change.text}
        </p>
      )}
    </article>
  );
}

function StatCardSkeleton() {
  return (
    <div className={`${CARD} p-4 sm:p-5`}>
      <Skeleton className="h-9 w-9 sm:h-10 sm:w-10" />
      <Skeleton className="mt-4 h-7 w-24" />
      <Skeleton className="mt-2 h-4 w-32" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
        >
          <Skeleton className="h-9 w-9 shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="mt-2 h-3 w-56 max-w-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------- Component ------------------------------ */

export default function DashboardOverview() {
  const { businessName } = useCachedBusiness();

  const overview = useGetPlatformOverviewStatCardsQuery(undefined);
  const chart = useGetOverviewChartQuery(undefined);
  // This endpoint destructures its argument, so an object must be passed.
  const users = useGetRecentRegisteredUsersQuery({ page: 1, limit: 10 });

  const overviewData = (overview.data as PlatformOverviewResponse | undefined)
    ?.data;
  const chartData = (chart.data as OverviewChartResponse | undefined)?.data;
  const usersData = (users.data as RecentUsersResponse | undefined)?.data;

  /* ---------- Stat cards ---------- */
  const stats: Stat[] | null = useMemo(() => {
    if (!overviewData || !chartData) return null;

    const growth = chartData.subscriptionGrowth.monthlyData;
    const last = growth[growth.length - 1];
    const prev = growth[growth.length - 2];
    const prevPrev = growth[growth.length - 3];

    const revenue = chartData.revenueGrowth.monthlyData;
    const revLast = revenue[revenue.length - 1]?.revenue;
    const revPrev = revenue[revenue.length - 2]?.revenue;

    // Paid subscriptions only (free trials are not counted as active subscriptions)
    const activeSubscriptions = Object.entries(
      overviewData.subscriptionDistribution,
    )
      .filter(([plan]) => plan !== "FREE_TRIAL")
      .reduce((sum, [, count]) => sum + count, 0);

    // Net new subscribers = change in active count from the previous month
    const newSubs = last && prev ? last.active - prev.active : undefined;
    const prevNewSubs =
      prev && prevPrev ? prev.active - prevPrev.active : undefined;

    return [
      {
        label: "Total User",
        value: overviewData.platformTotals.users.toLocaleString("en-US"),
        icon: "users",
        tone: "blue",
      },
      {
        label: "Active Subscriptions",
        value: activeSubscriptions.toLocaleString("en-US"),
        change: toChange(pctChange(last?.active, prev?.active)),
        icon: "click",
        tone: "blue",
      },
      {
        label: "Total Revenue",
        value:
          chartData.revenueGrowth.formattedCurrentMrr ??
          formatMoney(chartData.revenueGrowth.currentMrr),
        change: toChange(pctChange(revLast, revPrev)),
        icon: "wallet",
        tone: "blue",
      },
      {
        label: "New Subscribers",
        value: (newSubs ?? 0).toLocaleString("en-US"),
        change: toChange(pctChange(newSubs, prevNewSubs)),
        icon: "userPlus",
        tone: "blue",
      },
      {
        label: "Canceled",
        value: (last?.cancelled ?? 0).toLocaleString("en-US"),
        change: toChange(pctChange(last?.cancelled, prev?.cancelled), true),
        icon: "x",
        tone: "red",
      },
    ];
  }, [overviewData, chartData]);

  /* ---------- Revenue chart ---------- */
  const revenueMonthly = chartData?.revenueGrowth.monthlyData ?? [];
  const revenueK = revenueMonthly.map((m) => m.revenue / 1000);
  const revenueScale = niceScale(Math.max(0, ...revenueK));
  const lastIdx = Math.max(revenueK.length - 1, 1);
  const revenuePoints: [number, number][] = revenueK.map((v, i) => [
    (i / lastIdx) * 100,
    100 - (v / revenueScale.max) * 100,
  ]);
  const revenueLine = smoothPath(revenuePoints);
  const revenueArea = revenueLine ? `${revenueLine} L100,100 L0,100 Z` : "";

  /* ---------- Plan donut ---------- */
  const plans = chartData?.planDistribution.plans ?? [];
  const R = 42;
  const C = 2 * Math.PI * R;
  const GAP = 1.6;
  const planTotal = plans.reduce((sum, p) => sum + p.count, 0);
  let offset = 0;
  const segments = plans
    .filter((p) => p.count > 0)
    .map((p) => {
      const len = (p.count / planTotal) * C;
      const dashLen = Math.max(len - GAP, 0);
      const seg = {
        ...p,
        dash: `${dashLen} ${C - dashLen}`,
        offset: -offset,
      };
      offset += len;
      return seg;
    });
  const priceByPlan = Object.fromEntries(
    plans.map((p) => [p.plan, p.monthlyPrice]),
  );

  /* ---------- Subscription bars ---------- */
  const subsMonthly = chartData?.subscriptionGrowth.monthlyData ?? [];
  const subsScale = niceScale(
    Math.max(0, ...subsMonthly.flatMap((m) => [m.active, m.cancelled])),
  );

  /* ---------- Lists ---------- */
  const newUsers = useMemo(
    () =>
      [...(usersData ?? [])]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [usersData],
  );
  const recentBusinesses = (overviewData?.recentBusinesses ?? []).slice(0, 5);

  return (
    <div className="min-h-screen w-full font-sans text-slate-900 antialiased">
      <div className="mx-auto flex w-full flex-col gap-4 sm:gap-6">
        {/* Header */}
        <header>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Good morning{businessName ? `, ${businessName}` : ""}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Here&apos;s how your review growth is performing — Last 30 Days.
          </p>
        </header>

        {/* Stat cards */}
        <section
          aria-label="Key metrics"
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6"
        >
          {stats ? (
            stats.map((s) => <StatCard key={s.label} stat={s} />)
          ) : overview.isError || chart.isError ? (
            <div className={`${CARD} col-span-2 px-5 lg:col-span-3`}>
              <Notice
                message="Couldn't load the key metrics."
                onRetry={() => {
                  overview.refetch();
                  chart.refetch();
                }}
              />
            </div>
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          )}
        </section>

        {/* Revenue + Plan distribution */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.75fr_1fr]">
          {/* Revenue growth */}
          <article className={`${CARD} p-4 sm:p-6`}>
            <ChartHeader
              title="Revenue Growth"
              subtitle={
                (chartData as any)?.revenueGrowth?.subtitle ??
                "Monthly recurring revenue"
              }
            />

            {chart.isLoading ? (
              <Skeleton className="mt-5 h-44 w-full sm:h-56" />
            ) : chart.isError ? (
              <Notice
                message="Couldn't load revenue data."
                onRetry={chart.refetch}
              />
            ) : revenueMonthly.length === 0 ? (
              <Notice message="No revenue data yet." />
            ) : (
              <div
                className="mt-5 flex gap-3"
                role="img"
                aria-label={`Monthly recurring revenue rising from $${revenueK[0]}k in ${revenueMonthly[0].month} to $${revenueK[revenueK.length - 1]}k in ${revenueMonthly[revenueMonthly.length - 1].month}`}
              >
                <div className="relative h-44 w-9 shrink-0 text-xs text-slate-400 sm:h-56">
                  {revenueScale.ticks.map((t) => (
                    <span
                      key={t}
                      className="absolute right-0 -translate-y-1/2 tabular-nums"
                      style={{ top: `${100 - (t / revenueScale.max) * 100}%` }}
                    >
                      ${t}k
                    </span>
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="relative h-44 sm:h-56">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full overflow-visible"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="rev-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity="0.12"
                          />
                          <stop
                            offset="100%"
                            stopColor="#2563eb"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      {revenueScale.ticks.map((t) => (
                        <line
                          key={`h${t}`}
                          x1="0"
                          x2="100"
                          y1={100 - (t / revenueScale.max) * 100}
                          y2={100 - (t / revenueScale.max) * 100}
                          stroke="#e2e8f0"
                          strokeOpacity="0.7"
                          strokeDasharray="3 3"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                      {revenueMonthly.map((m, i) => (
                        <line
                          key={`v${m.month}`}
                          x1={(i / lastIdx) * 100}
                          x2={(i / lastIdx) * 100}
                          y1="0"
                          y2="100"
                          stroke="#e2e8f0"
                          strokeOpacity="0.7"
                          strokeDasharray="3 3"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                      <path d={revenueArea} fill="url(#rev-fill)" />
                      <path
                        d={revenueLine}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    {revenueMonthly.map((m) => (
                      <span key={m.month}>{m.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Plan distribution */}
          <article className={`${CARD} p-4 sm:p-6`}>
            <ChartHeader
              title="Plan Distribution"
              subtitle="Active subscribers by plan"
            />

            {chart.isLoading ? (
              <div className="mx-auto mt-6 flex max-w-[240px] flex-col items-center gap-6">
                <Skeleton className="h-36 w-36 rounded-full sm:h-40 sm:w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : chart.isError ? (
              <Notice
                message="Couldn't load plan data."
                onRetry={chart.refetch}
              />
            ) : (
              <div className="mx-auto mt-6 flex w-full max-w-[240px] flex-col items-center">
                <svg
                  viewBox="0 0 100 100"
                  className="h-36 w-36 sm:h-40 sm:w-40"
                  role="img"
                  aria-label={`Plan distribution: ${plans.map((p) => `${p.name} ${p.count}`).join(", ")}`}
                >
                  {segments.length === 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r={R}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="15"
                    />
                  )}
                  <g transform="rotate(-90 50 50)">
                    {segments.map((s) => (
                      <circle
                        key={s.plan}
                        cx="50"
                        cy="50"
                        r={R}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="15"
                        strokeDasharray={s.dash}
                        strokeDashoffset={s.offset}
                      />
                    ))}
                  </g>
                </svg>

                <ul className="mt-6 w-full space-y-2.5 text-[13px]">
                  {plans.map((plan) => (
                    <li
                      key={plan.plan}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5 text-slate-500">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: plan.color }}
                          aria-hidden="true"
                        />
                        {plan.name}
                      </span>
                      <span className="font-semibold tabular-nums text-slate-900">
                        {plan.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </section>

        {/* Subscription growth */}
        <section className={`${CARD} p-4 sm:p-6`}>
          <ChartHeader
            title="Subscription Growth"
            subtitle="Active vs. cancelled subscribers per month"
          />

          {chart.isLoading ? (
            <Skeleton className="mt-5 h-44 w-full sm:h-56" />
          ) : chart.isError ? (
            <Notice
              message="Couldn't load subscription data."
              onRetry={chart.refetch}
            />
          ) : subsMonthly.length === 0 ? (
            <Notice message="No subscription data yet." />
          ) : (
            <div
              className="mt-5 flex gap-3"
              role="img"
              aria-label={`Active and cancelled subscribers per month, ${subsMonthly[0].month} to ${subsMonthly[subsMonthly.length - 1].month}. Active grew from ${subsMonthly[0].active} to ${subsMonthly[subsMonthly.length - 1].active}.`}
            >
              <div className="relative h-44 w-6 shrink-0 text-xs text-slate-400 sm:h-56">
                {subsScale.ticks.map((t) => (
                  <span
                    key={t}
                    className="absolute right-0 -translate-y-1/2 tabular-nums"
                    style={{ top: `${100 - (t / subsScale.max) * 100}%` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <div className="relative h-44 sm:h-56">
                  {subsScale.ticks.map((t) => (
                    <div
                      key={t}
                      className="absolute inset-x-0 border-t border-dashed border-slate-200/70"
                      style={{ top: `${100 - (t / subsScale.max) * 100}%` }}
                    />
                  ))}
                  <div className="absolute inset-0 flex">
                    {subsMonthly.map((m) => (
                      <div
                        key={m.month}
                        className="flex h-full flex-1 items-end justify-center gap-0.5 border-l border-dashed border-slate-200/70 last:border-r sm:gap-1"
                      >
                        <div
                          className="w-3 rounded-t-md bg-blue-600 sm:w-5 lg:w-6"
                          style={{
                            height: `${(m.active / subsScale.max) * 100}%`,
                          }}
                        />
                        <div
                          className="w-3 rounded-t-sm bg-red-300 sm:w-5 lg:w-6"
                          style={{
                            height: `${(m.cancelled / subsScale.max) * 100}%`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex text-xs text-slate-400">
                  {subsMonthly.map((m) => (
                    <span key={m.month} className="flex-1 text-center">
                      {m.month}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Lists */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* New registered users */}
          <article className={CARD}>
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-[15px] font-medium">New Registered User</h2>
              <a
                href="#"
                className="rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                View all
              </a>
            </div>
            {users.isLoading ? (
              <ListSkeleton />
            ) : users.isError ? (
              <div className="border-t border-slate-100 px-4 sm:px-6">
                <Notice
                  message="Couldn't load new users."
                  onRetry={users.refetch}
                />
              </div>
            ) : newUsers.length === 0 ? (
              <div className="border-t border-slate-100 px-4 sm:px-6">
                <Notice message="No users have registered yet." />
              </div>
            ) : (
              <ul>
                {newUsers.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
                  >
                    {u.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 shrink-0 rounded-xl bg-slate-100 object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[13px] font-medium text-slate-600"
                        aria-hidden="true"
                      >
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-slate-900">
                        {u.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {u.email} · {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>

          {/* Recent subscription activity */}
          <article className={CARD}>
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-[15px] font-medium">
                Recent Subscription Activity
              </h2>
              <a
                href="#"
                className="shrink-0 rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                View all
              </a>
            </div>
            {overview.isLoading ? (
              <ListSkeleton />
            ) : overview.isError ? (
              <div className="border-t border-slate-100 px-4 sm:px-6">
                <Notice
                  message="Couldn't load recent activity."
                  onRetry={overview.refetch}
                />
              </div>
            ) : recentBusinesses.length === 0 ? (
              <div className="border-t border-slate-100 px-4 sm:px-6">
                <Notice message="No subscription activity yet." />
              </div>
            ) : (
              <ul>
                {recentBusinesses.map((b) => {
                  const isTrial = b.plan === "FREE_TRIAL";
                  const status = isTrial ? "Trial" : "Active";
                  const price = priceByPlan[b.plan];
                  return (
                    <li
                      key={b.id}
                      className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-slate-900">
                          {b.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {PLAN_LABEL[b.plan] ?? b.plan}
                          {price ? ` · $${price}/mo` : ""} ·{" "}
                          {formatDate(b.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE[status]}`}
                      >
                        {status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
