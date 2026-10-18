// "use client";

// import { useEffect, useId, useMemo, useRef, useState } from "react";

// /* -------------------------------------------------------------------------- */
// /*  Types & data                                                              */
// /* -------------------------------------------------------------------------- */

// type PaymentStatus = "Successful" | "Failed" | "Pending";

// interface Transaction {
//   id: number;
//   business: string;
//   email: string;
//   plan: string;
//   amount: number;
//   date: string;
//   period: string;
//   status: PaymentStatus;
//   transactionId: string;
//   invoice: string;
// }

// interface StatCard {
//   label: string;
//   value: string;
//   change?: string;
//   iconBg: string;
// }

// const STATS: StatCard[] = [
//   {
//     label: "Total Revenue",
//     value: "$524,390",
//     change: "+12%",
//     iconBg: "bg-[#1f5eff]",
//   },
//   {
//     label: "Revenue This Month",
//     value: "$47,280",
//     change: "+8%",
//     iconBg: "bg-[#1f5eff]",
//   },
//   { label: "Successful Payments", value: "68", iconBg: "bg-green-600" },
//   { label: "Failed Payments", value: "4", iconBg: "bg-red-600" },
// ];

// /** Monthly recurring revenue in $k (Mar → Sep 2026). */
// const REVENUE_SERIES = [
//   { month: "Mar", value: 13 },
//   { month: "Apr", value: 19.5 },
//   { month: "May", value: 24.5 },
//   { month: "Jun", value: 30 },
//   { month: "Jul", value: 33.5 },
//   { month: "Aug", value: 40 },
//   { month: "Sep", value: 47.3 },
// ];

// /** Legend order = Starter, Growth, Pro. */
// const PLAN_DISTRIBUTION = [
//   { name: "Starter", value: 22, color: "#94a3b8" },
//   { name: "Growth", value: 38, color: "#2563eb" },
//   { name: "Pro", value: 14, color: "#0f172a" },
// ];

// const ROW_PLANS = [
//   "Pro Annual",
//   "Growth Monthly",
//   "Starter Monthly",
//   "Starter Annual",
//   "Growth Annual",
//   "Growth Annual",
//   "Starter Annual",
//   "Starter Monthly",
//   "Pro Monthly",
//   "Pro Annual",
// ];

// const PAGE_SIZE = 10;
// const TOTAL_PAGES = 5;
// /** The reference design shows page 2 selected. Change to 1 to start on the first page. */
// const INITIAL_PAGE = 2;

// const TRANSACTIONS: Transaction[] = Array.from(
//   { length: PAGE_SIZE * TOTAL_PAGES },
//   (_, i) => ({
//     id: i + 1,
//     business: "Apex Marketing Group",
//     email: "sarah@apexmarketing.co",
//     plan: ROW_PLANS[i % ROW_PLANS.length],
//     amount: 1908,
//     date: "Oct 2, 2026",
//     period: "Oct 2, 2026",
//     status: "Successful",
//     transactionId: "ch_3PqX9A2eZvKYlo2C0",
//     invoice: "INV-2026-0918",
//   }),
// );

// const STATUS_STYLES: Record<PaymentStatus, string> = {
//   Successful: "bg-green-100 text-green-600",
//   Failed: "bg-red-100 text-red-600",
//   Pending: "bg-amber-100 text-amber-600",
// };

// const currency = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
//   minimumFractionDigits: 2,
// });

// /* -------------------------------------------------------------------------- */
// /*  Icons                                                                     */
// /* -------------------------------------------------------------------------- */

// const iconProps = {
//   viewBox: "0 0 24 24",
//   fill: "none",
//   stroke: "currentColor",
//   strokeWidth: 2,
//   strokeLinecap: "round" as const,
//   strokeLinejoin: "round" as const,
//   "aria-hidden": true,
// };

// const WalletIcon = ({ className }: { className?: string }) => (
//   <svg {...iconProps} className={className}>
//     <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
//     <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
//   </svg>
// );

// const ChevronLeftIcon = ({ className }: { className?: string }) => (
//   <svg {...iconProps} className={className}>
//     <path d="m15 18-6-6 6-6" />
//   </svg>
// );

// const ChevronRightIcon = ({ className }: { className?: string }) => (
//   <svg {...iconProps} className={className}>
//     <path d="m9 18 6-6-6-6" />
//   </svg>
// );

// /* -------------------------------------------------------------------------- */
// /*  Chart helpers                                                             */
// /* -------------------------------------------------------------------------- */

// interface Point {
//   x: number;
//   y: number;
// }

// /** Smooth, non-overshooting curve through the points (monotone cubic). */
// function monotonePath(p: Point[]): string {
//   const n = p.length;
//   if (n < 2) return "";
//   const dx: number[] = [];
//   const m: number[] = [];
//   for (let i = 0; i < n - 1; i++) {
//     dx[i] = p[i + 1].x - p[i].x;
//     m[i] = (p[i + 1].y - p[i].y) / dx[i];
//   }
//   const t: number[] = [m[0]];
//   for (let i = 1; i < n - 1; i++) {
//     t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
//   }
//   t[n - 1] = m[n - 2];
//   for (let i = 0; i < n - 1; i++) {
//     if (m[i] === 0) {
//       t[i] = 0;
//       t[i + 1] = 0;
//       continue;
//     }
//     const a = t[i] / m[i];
//     const b = t[i + 1] / m[i];
//     const s = a * a + b * b;
//     if (s > 9) {
//       const k = 3 / Math.sqrt(s);
//       t[i] = k * a * m[i];
//       t[i + 1] = k * b * m[i];
//     }
//   }
//   let d = `M${p[0].x},${p[0].y}`;
//   for (let i = 0; i < n - 1; i++) {
//     d += ` C${p[i].x + dx[i] / 3},${p[i].y + (t[i] * dx[i]) / 3} ${
//       p[i + 1].x - dx[i] / 3
//     },${p[i + 1].y - (t[i + 1] * dx[i]) / 3} ${p[i + 1].x},${p[i + 1].y}`;
//   }
//   return d;
// }

// /* -------------------------------------------------------------------------- */
// /*  Sub-views (kept in this file so the whole thing is ONE component file)    */
// /* -------------------------------------------------------------------------- */

// function RevenueChart() {
//   const wrapRef = useRef<HTMLDivElement>(null);
//   const [width, setWidth] = useState(0);
//   const gradientId = useId().replace(/:/g, "");

//   useEffect(() => {
//     const el = wrapRef.current;
//     if (!el) return;
//     setWidth(el.clientWidth);
//     const observer = new ResizeObserver(([entry]) =>
//       setWidth(Math.round(entry.contentRect.width)),
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   const height = width < 480 ? 210 : 250;
//   const margin = { top: 8, right: 8, bottom: 28, left: 44 };
//   const yMax = 60;
//   const ticks = [0, 15, 30, 45, 60];
//   const plotW = width - margin.left - margin.right;
//   const plotH = height - margin.top - margin.bottom;

//   const points: Point[] = REVENUE_SERIES.map((d, i) => ({
//     x: margin.left + (i * plotW) / (REVENUE_SERIES.length - 1),
//     y: margin.top + (1 - d.value / yMax) * plotH,
//   }));

//   const line = width > 0 ? monotonePath(points) : "";
//   const baseY = margin.top + plotH;
//   const area = line
//     ? `${line} L${points[points.length - 1].x},${baseY} L${points[0].x},${baseY} Z`
//     : "";

//   return (
//     <div ref={wrapRef} className="w-full">
//       {width > 0 && (
//         <svg
//           width={width}
//           height={height}
//           role="img"
//           aria-label="Line chart of monthly recurring revenue from March to September 2026, growing from about $13k to about $47k"
//           className="block"
//         >
//           <defs>
//             <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
//               <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
//             </linearGradient>
//           </defs>

//           {/* horizontal grid + y labels */}
//           {ticks.map((tick) => {
//             const y = margin.top + (1 - tick / yMax) * plotH;
//             return (
//               <g key={tick}>
//                 <line
//                   x1={margin.left}
//                   x2={width - margin.right}
//                   y1={y}
//                   y2={y}
//                   stroke="#e2e8f0"
//                   strokeDasharray="3 4"
//                 />
//                 <text
//                   x={margin.left - 10}
//                   y={y + 4}
//                   textAnchor="end"
//                   fontSize="12"
//                   fill="#94a3b8"
//                 >
//                   ${tick}k
//                 </text>
//               </g>
//             );
//           })}

//           {/* vertical grid + x labels */}
//           {points.map((p, i) => (
//             <g key={REVENUE_SERIES[i].month}>
//               <line
//                 x1={p.x}
//                 x2={p.x}
//                 y1={margin.top}
//                 y2={baseY}
//                 stroke="#e2e8f0"
//                 strokeDasharray="3 4"
//               />
//               <text
//                 x={i === 0 ? p.x + 4 : i === points.length - 1 ? p.x - 4 : p.x}
//                 y={height - 6}
//                 textAnchor={
//                   i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"
//                 }
//                 fontSize="12"
//                 fill="#94a3b8"
//               >
//                 {REVENUE_SERIES[i].month}
//               </text>
//             </g>
//           ))}

//           <path d={area} fill={`url(#${gradientId})`} />
//           <path
//             d={line}
//             fill="none"
//             stroke="#2563eb"
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </svg>
//       )}
//     </div>
//   );
// }

// function PlanDonut() {
//   const size = 140;
//   const stroke = 19;
//   const r = (size - stroke) / 2;
//   const circumference = 2 * Math.PI * r;
//   const gap = 3;
//   const total = PLAN_DISTRIBUTION.reduce((sum, p) => sum + p.value, 0);

//   // Ring is drawn clockwise: Starter → Pro → Growth (matches the reference).
//   const drawOrder = ["Starter", "Pro", "Growth"]
//     .map((name) => PLAN_DISTRIBUTION.find((p) => p.name === name)!)
//     .filter(Boolean);

//   let offset = 0;
//   const segments = drawOrder.map((plan) => {
//     const full = (plan.value / total) * circumference;
//     const seg = {
//       ...plan,
//       len: Math.max(full - gap, 0),
//       start: offset + gap / 2,
//     };
//     offset += full;
//     return seg;
//   });

//   return (
//     <svg
//       viewBox={`0 0 ${size} ${size}`}
//       className="h-[140px] w-[140px] sm:h-[150px] sm:w-[150px]"
//       role="img"
//       aria-label={`Plan distribution: ${PLAN_DISTRIBUTION.map((p) => `${p.name} ${p.value}`).join(", ")}`}
//     >
//       <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
//         {segments.map((s) => (
//           <circle
//             key={s.name}
//             cx={size / 2}
//             cy={size / 2}
//             r={r}
//             fill="none"
//             stroke={s.color}
//             strokeWidth={stroke}
//             strokeDasharray={`${s.len} ${circumference - s.len}`}
//             strokeDashoffset={-s.start}
//           />
//         ))}
//       </g>
//     </svg>
//   );
// }

// function StatusPill({ status }: { status: PaymentStatus }) {
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
//     >
//       {status}
//     </span>
//   );
// }

// function Avatar({ name }: { name: string }) {
//   const initials = name
//     .split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
//   return (
//     <span
//       aria-hidden="true"
//       className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-xs font-semibold text-white"
//     >
//       {initials}
//     </span>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Main component                                                            */
// /* -------------------------------------------------------------------------- */

// export default function RevenueBilling() {
//   const [page, setPage] = useState(INITIAL_PAGE);

//   const rows = useMemo(
//     () => TRANSACTIONS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
//     [page],
//   );

//   const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

//   return (
//     <section className="min-h-screen w-full font-sans text-slate-900">
//       {/* Header */}
//       <header>
//         <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//           Revenue &amp; Billing
//         </h1>
//         <p className="mt-2 text-sm text-slate-600">
//           Monitor revenue, payments, invoices, and billing activity in one
//           place.
//         </p>
//       </header>

//       {/* Stat cards */}
//       <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//         {STATS.map((stat) => (
//           <article
//             key={stat.label}
//             className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
//           >
//             <span
//               className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${stat.iconBg}`}
//             >
//               <WalletIcon className="h-[18px] w-[18px]" />
//             </span>
//             <p className="mt-4 text-2xl font-semibold leading-tight text-slate-900 sm:text-[28px]">
//               {stat.value}
//             </p>
//             <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
//               <p className="text-xs text-slate-600 sm:text-sm">{stat.label}</p>
//               {stat.change && (
//                 <span className="text-xs font-medium text-green-600 sm:text-sm">
//                   {stat.change}
//                 </span>
//               )}
//             </div>
//           </article>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
//         <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
//           <h2 className="text-base font-medium text-slate-900">
//             Revenue Growth
//           </h2>
//           <p className="mt-2 text-sm text-slate-600">
//             Monthly recurring revenue — 2026
//           </p>
//           <div className="mt-4">
//             <RevenueChart />
//           </div>
//         </article>

//         <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
//           <h2 className="text-base font-medium text-slate-900">
//             Plan Distribution
//           </h2>
//           <p className="mt-2 text-sm text-slate-600">
//             Active subscribers by plan
//           </p>
//           <div className="mt-5 flex justify-center">
//             <PlanDonut />
//           </div>
//           <ul className="mx-auto mt-5 w-full max-w-[260px] space-y-2.5">
//             {PLAN_DISTRIBUTION.map((plan) => (
//               <li
//                 key={plan.name}
//                 className="flex items-center justify-between text-sm"
//               >
//                 <span className="flex items-center gap-2.5 text-slate-600">
//                   <span
//                     className="h-2.5 w-2.5 rounded-full"
//                     style={{ backgroundColor: plan.color }}
//                   />
//                   {plan.name}
//                 </span>
//                 <span className="font-semibold text-slate-900">
//                   {plan.value}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </article>
//       </div>

//       {/* Payments & Transactions */}
//       <article className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
//         <div className="border-b border-slate-100 px-4 py-4">
//           <h2 className="text-base font-medium text-slate-900">
//             Payments &amp; Transactions
//           </h2>
//           <p className="mt-1 text-sm text-slate-600">
//             All billing transactions across subscriptions
//           </p>
//         </div>

//         {/* Desktop / tablet: table */}
//         <div className="hidden overflow-x-auto lg:block">
//           <table className="w-full min-w-[960px] border-collapse text-left text-sm">
//             <caption className="sr-only">
//               All billing transactions across subscriptions
//             </caption>
//             <thead>
//               <tr className="border-b border-slate-100 text-slate-400">
//                 {[
//                   "Business Name",
//                   "Plan",
//                   "Amount",
//                   "Date",
//                   "Period",
//                   "Status",
//                   "Transaction ID",
//                   "Invoice",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     scope="col"
//                     className="whitespace-nowrap px-4 py-3 font-normal"
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((t) => (
//                 <tr
//                   key={t.id}
//                   className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
//                 >
//                   <td className="px-4 py-3.5">
//                     <div className="flex items-center gap-3">
//                       <Avatar name={t.business} />
//                       <div className="min-w-0">
//                         <p className="whitespace-nowrap font-medium text-slate-800">
//                           {t.business}
//                         </p>
//                         <p className="whitespace-nowrap text-slate-400">
//                           {t.email}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
//                     {t.plan}
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-900">
//                     {currency.format(t.amount)}
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
//                     {t.date}
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
//                     {t.period}
//                   </td>
//                   <td className="px-4 py-3.5">
//                     <StatusPill status={t.status} />
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
//                     {t.transactionId}
//                   </td>
//                   <td className="whitespace-nowrap px-4 py-3.5">
//                     <a
//                       href={`#${t.invoice}`}
//                       className="font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                     >
//                       {t.invoice}
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile: stacked cards */}
//         <ul className="divide-y divide-slate-100 lg:hidden">
//           {rows.map((t) => (
//             <li key={t.id} className="px-4 py-4">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex min-w-0 items-center gap-3">
//                   <Avatar name={t.business} />
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-medium text-slate-800">
//                       {t.business}
//                     </p>
//                     <p className="truncate text-sm text-slate-400">{t.email}</p>
//                   </div>
//                 </div>
//                 <StatusPill status={t.status} />
//               </div>

//               <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
//                 <div>
//                   <dt className="text-xs text-slate-400">Plan</dt>
//                   <dd className="mt-0.5 text-slate-600">{t.plan}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-xs text-slate-400">Amount</dt>
//                   <dd className="mt-0.5 font-semibold text-slate-900">
//                     {currency.format(t.amount)}
//                   </dd>
//                 </div>
//                 <div>
//                   <dt className="text-xs text-slate-400">Date</dt>
//                   <dd className="mt-0.5 text-slate-600">{t.date}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-xs text-slate-400">Period</dt>
//                   <dd className="mt-0.5 text-slate-600">{t.period}</dd>
//                 </div>
//                 <div className="min-w-0">
//                   <dt className="text-xs text-slate-400">Transaction ID</dt>
//                   <dd className="mt-0.5 truncate text-slate-500">
//                     {t.transactionId}
//                   </dd>
//                 </div>
//                 <div>
//                   <dt className="text-xs text-slate-400">Invoice</dt>
//                   <dd className="mt-0.5">
//                     <a
//                       href={`#${t.invoice}`}
//                       className="font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                     >
//                       {t.invoice}
//                     </a>
//                   </dd>
//                 </div>
//               </dl>
//             </li>
//           ))}
//         </ul>
//       </article>

//       {/* Pagination */}
//       <nav
//         aria-label="Transactions pagination"
//         className="mt-6 flex items-center justify-center gap-1 pb-2 sm:gap-2"
//       >
//         <button
//           type="button"
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           aria-label="Previous page"
//           className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dfe7f3] text-blue-600 transition hover:bg-[#d2ddee] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <ChevronLeftIcon className="h-4 w-4" />
//         </button>

//         {pages.map((n) => {
//           const active = n === page;
//           return (
//             <button
//               key={n}
//               type="button"
//               onClick={() => setPage(n)}
//               aria-label={`Page ${n}`}
//               aria-current={active ? "page" : undefined}
//               className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:h-10 sm:w-10 sm:text-base ${
//                 active
//                   ? "bg-blue-600 font-medium text-white"
//                   : "text-slate-700 hover:bg-slate-200/70"
//               }`}
//             >
//               {n}
//             </button>
//           );
//         })}

//         <button
//           type="button"
//           onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
//           disabled={page === TOTAL_PAGES}
//           aria-label="Next page"
//           className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dfe7f3] text-blue-600 transition hover:bg-[#d2ddee] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <ChevronRightIcon className="h-4 w-4" />
//         </button>
//       </nav>
//     </section>
//   );
// }
"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
// ⚠️ Adjust this import path to wherever your slice file lives.
import {
  useGetPaymentsTransactionsTableQuery,
  useGetRevenueBillingPlatformStatsQuery,
} from "@/redux/api/admin/subscription/adminSubscriptionPlanSliceApi";

/* -------------------------------------------------------------------------- */
/*  API types                                                                 */
/* -------------------------------------------------------------------------- */

interface RevenuePoint {
  month: string;
  revenue: number;
  formattedRevenue: string;
}

interface PlanItem {
  plan: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  monthlyPrice: number;
}

interface SubscriptionPoint {
  month: string;
  active: number;
  cancelled: number;
}

interface PlatformStatsResponse {
  data?: {
    revenueGrowth?: {
      title?: string;
      subtitle?: string;
      currentMrr?: number;
      formattedCurrentMrr?: string;
      currency?: string;
      monthlyData?: RevenuePoint[];
    };
    planDistribution?: {
      title?: string;
      subtitle?: string;
      totalSubscribers?: number;
      plans?: PlanItem[];
    };
    subscriptionGrowth?: {
      monthlyData?: SubscriptionPoint[];
    };
  };
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  data?: ApiUser[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
    totalPages?: number;
  };
}

/* -------------------------------------------------------------------------- */
/*  UI types                                                                  */
/* -------------------------------------------------------------------------- */

type PaymentStatus = "Successful" | "Failed" | "Pending";

interface Transaction {
  id: string;
  business: string;
  email: string;
  image: string | null;
  plan: string;
  amount: number | null;
  date: string;
  period: string;
  status: PaymentStatus;
  transactionId: string;
  invoice: string;
}

interface StatCard {
  label: string;
  value: string;
  change?: string;
  iconBg: string;
}

const PAGE_SIZE = 10;
const PLAN_ORDER = ["Starter", "Pro", "Growth"]; // ring draw order

const STATUS_STYLES: Record<PaymentStatus, string> = {
  Successful: "bg-green-100 text-green-600",
  Failed: "bg-red-100 text-red-600",
  Pending: "bg-amber-100 text-amber-600",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/* -------------------------------------------------------------------------- */
/*  Mappers                                                                   */
/* -------------------------------------------------------------------------- */

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFormat.format(d);
}

/**
 * The `/user` endpoint returns users, not payments, so billing-only fields
 * (plan, amount, transaction id, invoice) are not available yet and render as "—".
 * When a real payments endpoint exists, only this function needs to change.
 */
function mapUserToRow(u: ApiUser): Transaction {
  const status: PaymentStatus =
    u.status === "active"
      ? "Successful"
      : u.status === "blocked"
        ? "Failed"
        : "Pending";

  return {
    id: u.id,
    business: u.name,
    email: u.email,
    image: u.image,
    plan: "—",
    amount: null,
    date: formatDate(u.createdAt),
    period: formatDate(u.updatedAt),
    status,
    transactionId: "—",
    invoice: "—",
  };
}

function percentChange(current: number, previous: number): string | undefined {
  if (!previous) return undefined;
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${Math.round(pct)}%`;
}

/** Round a max value up to a "nice" axis ceiling divisible into 4 steps. */
function niceMax(value: number): number {
  if (value <= 0) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(value / 4)));
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * step);
  const tick = candidates.find((c) => c * 4 >= value) ?? candidates[4];
  return tick * 4;
}

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const WalletIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Chart helpers                                                             */
/* -------------------------------------------------------------------------- */

interface Point {
  x: number;
  y: number;
}

/** Smooth, non-overshooting curve through the points (monotone cubic). */
function monotonePath(p: Point[]): string {
  const n = p.length;
  if (n < 2) return "";
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1].x - p[i].x;
    m[i] = (p[i + 1].y - p[i].y) / dx[i];
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) {
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  }
  t[n - 1] = m[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    d += ` C${p[i].x + dx[i] / 3},${p[i].y + (t[i] * dx[i]) / 3} ${
      p[i + 1].x - dx[i] / 3
    },${p[i + 1].y - (t[i + 1] * dx[i]) / 3} ${p[i + 1].x},${p[i + 1].y}`;
  }
  return d;
}

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                           */
/* -------------------------------------------------------------------------- */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70 ${className}`}
    />
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {message}
    </p>
  );
}

function EmptyNote({ message }: { message: string }) {
  return (
    <p className="px-4 py-10 text-center text-sm text-slate-500">{message}</p>
  );
}

function StatusPill({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-xs font-semibold text-white"
    >
      {initials || "?"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Charts                                                                    */
/* -------------------------------------------------------------------------- */

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const series = data.map((d) => ({ month: d.month, value: d.revenue / 1000 }));
  const height = width < 480 ? 210 : 250;
  const margin = { top: 8, right: 8, bottom: 28, left: 44 };
  const yMax = niceMax(Math.max(...series.map((d) => d.value), 0));
  const ticks = [0, 1, 2, 3, 4].map((i) => (yMax / 4) * i);
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const denom = Math.max(series.length - 1, 1);

  const points: Point[] = series.map((d, i) => ({
    x: margin.left + (i * plotW) / denom,
    y: margin.top + (1 - d.value / yMax) * plotH,
  }));

  const line = width > 0 ? monotonePath(points) : "";
  const baseY = margin.top + plotH;
  const area = line
    ? `${line} L${points[points.length - 1].x},${baseY} L${points[0].x},${baseY} Z`
    : "";

  const first = series[0];
  const last = series[series.length - 1];
  const ariaLabel = `Line chart of monthly recurring revenue from ${first.month} to ${last.month}, growing from about $${first.value}k to about $${last.value}k`;

  return (
    <div ref={wrapRef} className="w-full">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel}
          className="block"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => {
            const y = margin.top + (1 - tick / yMax) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={margin.left}
                  x2={width - margin.right}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 4"
                />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#94a3b8"
                >
                  ${Number.isInteger(tick) ? tick : tick.toFixed(1)}k
                </text>
              </g>
            );
          })}

          {points.map((p, i) => (
            <g key={`${series[i].month}-${i}`}>
              <line
                x1={p.x}
                x2={p.x}
                y1={margin.top}
                y2={baseY}
                stroke="#e2e8f0"
                strokeDasharray="3 4"
              />
              <text
                x={i === 0 ? p.x + 4 : i === points.length - 1 ? p.x - 4 : p.x}
                y={height - 6}
                textAnchor={
                  i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"
                }
                fontSize="12"
                fill="#94a3b8"
              >
                {series[i].month}
              </text>
            </g>
          ))}

          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

function PlanDonut({ plans }: { plans: PlanItem[] }) {
  const size = 140;
  const stroke = 19;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const gap = 3;
  const total = plans.reduce((sum, p) => sum + p.count, 0);

  const drawOrder = [...plans].sort((a, b) => {
    const ai = PLAN_ORDER.indexOf(a.name);
    const bi = PLAN_ORDER.indexOf(b.name);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  let offset = 0;
  const segments = drawOrder
    .filter((p) => p.count > 0)
    .map((plan) => {
      const full = total ? (plan.count / total) * circumference : 0;
      const seg = {
        ...plan,
        len: Math.max(full - gap, 0),
        start: offset + gap / 2,
      };
      offset += full;
      return seg;
    });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-[140px] w-[140px] sm:h-[150px] sm:w-[150px]"
      role="img"
      aria-label={`Plan distribution: ${plans.map((p) => `${p.name} ${p.count}`).join(", ")}`}
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {total === 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
        )}
        {segments.map((s) => (
          <circle
            key={s.plan}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.len} ${circumference - s.len}`}
            strokeDashoffset={-s.start}
          />
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function RevenueBilling() {
  const [page, setPage] = useState(1);

  /* ---- Platform stats (cards + charts) ---- */
  const {
    data: statsRes,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetRevenueBillingPlatformStatsQuery(undefined);

  /* ---- Transactions table (server-side pagination) ---- */
  const {
    data: txRes,
    isLoading: txLoading,
    isFetching: txFetching,
    isError: txError,
  } = useGetPaymentsTransactionsTableQuery({ page, limit: PAGE_SIZE });

  const stats = (statsRes as PlatformStatsResponse | undefined)?.data;
  const revenueMonthly = stats?.revenueGrowth?.monthlyData ?? [];
  const plans = stats?.planDistribution?.plans ?? [];
  const subsMonthly = stats?.subscriptionGrowth?.monthlyData ?? [];

  const statCards: StatCard[] = useMemo(() => {
    const lastRev = revenueMonthly[revenueMonthly.length - 1];
    const prevRev = revenueMonthly[revenueMonthly.length - 2];
    const currentMrr =
      stats?.revenueGrowth?.currentMrr ?? lastRev?.revenue ?? 0;
    const totalRevenue = revenueMonthly.reduce((sum, m) => sum + m.revenue, 0);

    return [
      {
        label: "Total Revenue",
        value: currencyCompact.format(totalRevenue),
        iconBg: "bg-[#1f5eff]",
      },
      {
        label: "Revenue This Month",
        value:
          stats?.revenueGrowth?.formattedCurrentMrr ??
          currencyCompact.format(currentMrr),
        change: prevRev
          ? percentChange(currentMrr, prevRev.revenue)
          : undefined,
        iconBg: "bg-[#1f5eff]",
      },
      {
        label: "Successful Payments",
        value: String(stats?.planDistribution?.totalSubscribers ?? 0),
        iconBg: "bg-green-600",
      },
      {
        label: "Failed Payments",
        value: String(subsMonthly[subsMonthly.length - 1]?.cancelled ?? 0),
        iconBg: "bg-red-600",
      },
    ];
  }, [stats, revenueMonthly, subsMonthly]);

  const rows: Transaction[] = useMemo(() => {
    const list = (txRes as UsersResponse | undefined)?.data ?? [];
    return list.map(mapUserToRow);
  }, [txRes]);

  /* ---- Pagination info (uses `meta` when the backend sends it) ---- */
  const meta = (txRes as UsersResponse | undefined)?.meta;
  const knownTotalPages =
    meta?.totalPage ??
    meta?.totalPages ??
    (meta?.total
      ? Math.ceil(meta.total / (meta.limit ?? PAGE_SIZE))
      : undefined);
  const hasNext = knownTotalPages
    ? page < knownTotalPages
    : rows.length === PAGE_SIZE;
  const pageNumbers = knownTotalPages
    ? Array.from({ length: knownTotalPages }, (_, i) => i + 1)
    : [page];

  return (
    <section className="min-h-screen w-full font-sans text-slate-900">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Revenue &amp; Billing
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor revenue, payments, invoices, and billing activity in one
          place.
        </p>
      </header>

      {statsError && (
        <div className="mt-6">
          <ErrorNote message="Couldn't load revenue stats. Refresh the page to try again." />
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <article
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <Skeleton className="h-9 w-9" />
                <Skeleton className="mt-4 h-8 w-28" />
                <Skeleton className="mt-2 h-4 w-24" />
              </article>
            ))
          : statCards.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${stat.iconBg}`}
                >
                  <WalletIcon className="h-[18px] w-[18px]" />
                </span>
                <p className="mt-4 text-2xl font-semibold leading-tight text-slate-900 sm:text-[28px]">
                  {stat.value}
                </p>
                <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="text-xs text-slate-600 sm:text-sm">
                    {stat.label}
                  </p>
                  {stat.change && (
                    <span
                      className={`text-xs font-medium sm:text-sm ${
                        stat.change.startsWith("-")
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
              </article>
            ))}
      </div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-base font-medium text-slate-900">
            {stats?.revenueGrowth?.title ?? "Revenue Growth"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {stats?.revenueGrowth?.subtitle ?? "Monthly recurring revenue"}
          </p>
          <div className="mt-4">
            {statsLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : revenueMonthly.length > 0 ? (
              <RevenueChart data={revenueMonthly} />
            ) : (
              <EmptyNote message="No revenue data yet." />
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-base font-medium text-slate-900">
            {stats?.planDistribution?.title ?? "Plan Distribution"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {stats?.planDistribution?.subtitle ?? "Active subscribers by plan"}
          </p>

          {statsLoading ? (
            <div className="mt-5 flex flex-col items-center gap-5">
              <Skeleton className="h-[140px] w-[140px] rounded-full sm:h-[150px] sm:w-[150px]" />
              <Skeleton className="h-16 w-full max-w-[260px]" />
            </div>
          ) : plans.length > 0 ? (
            <>
              <div className="mt-5 flex justify-center">
                <PlanDonut plans={plans} />
              </div>
              <ul className="mx-auto mt-5 w-full max-w-[260px] space-y-2.5">
                {plans.map((plan) => (
                  <li
                    key={plan.plan}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2.5 text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: plan.color }}
                      />
                      {plan.name}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {plan.count}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyNote message="No subscribers yet." />
          )}
        </article>
      </div>

      {/* Payments & Transactions */}
      <article className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-4">
          <h2 className="text-base font-medium text-slate-900">
            Payments &amp; Transactions
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            All billing transactions across subscriptions
          </p>
        </div>

        {txError ? (
          <div className="p-4">
            <ErrorNote message="Couldn't load transactions. Try again in a moment." />
          </div>
        ) : txLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyNote message="No transactions found." />
        ) : (
          <div className={txFetching ? "opacity-60 transition-opacity" : ""}>
            {/* Desktop / tablet: table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  All billing transactions across subscriptions
                </caption>
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400">
                    {[
                      "Business Name",
                      "Plan",
                      "Amount",
                      "Date",
                      "Period",
                      "Status",
                      "Transaction ID",
                      "Invoice",
                    ].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={t.business} image={t.image} />
                          <div className="min-w-0">
                            <p className="whitespace-nowrap font-medium text-slate-800">
                              {t.business}
                            </p>
                            <p className="whitespace-nowrap text-slate-400">
                              {t.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                        {t.plan}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-900">
                        {t.amount === null ? "—" : currency.format(t.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                        {t.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                        {t.period}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusPill status={t.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
                        {t.transactionId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        {t.invoice === "—" ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <a
                            href={`#${t.invoice}`}
                            className="font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            {t.invoice}
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards */}
            <ul className="divide-y divide-slate-100 lg:hidden">
              {rows.map((t) => (
                <li key={t.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={t.business} image={t.image} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {t.business}
                        </p>
                        <p className="truncate text-sm text-slate-400">
                          {t.email}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={t.status} />
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <dt className="text-xs text-slate-400">Plan</dt>
                      <dd className="mt-0.5 text-slate-600">{t.plan}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Amount</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">
                        {t.amount === null ? "—" : currency.format(t.amount)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Date</dt>
                      <dd className="mt-0.5 text-slate-600">{t.date}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Period</dt>
                      <dd className="mt-0.5 text-slate-600">{t.period}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-400">Transaction ID</dt>
                      <dd className="mt-0.5 truncate text-slate-500">
                        {t.transactionId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Invoice</dt>
                      <dd className="mt-0.5">
                        {t.invoice === "—" ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <a
                            href={`#${t.invoice}`}
                            className="font-medium text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            {t.invoice}
                          </a>
                        )}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Pagination */}
      <nav
        aria-label="Transactions pagination"
        className="mt-6 flex items-center justify-center gap-1 pb-2 sm:gap-2"
      >
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || txFetching}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dfe7f3] text-blue-600 transition hover:bg-[#d2ddee] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {pageNumbers.map((n) => {
          const active = n === page;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-label={`Page ${n}`}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:h-10 sm:w-10 sm:text-base ${
                active
                  ? "bg-blue-600 font-medium text-white"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              {n}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext || txFetching}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dfe7f3] text-blue-600 transition hover:bg-[#d2ddee] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </nav>
    </section>
  );
}
