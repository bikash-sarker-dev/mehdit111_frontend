// "use client";

// import { useState, useMemo } from "react";
// import {
//   Check,
//   Star,
//   TrendingUp,
//   Calendar,
//   Download,
//   CreditCard,
// } from "lucide-react";

// /* ------------------------------------------------------------------ */
// /*  Types                                                             */
// /* ------------------------------------------------------------------ */

// type PlanTier = {
//   id: string;
//   name: string;
//   price: number;
//   tagline: string;
//   features: string[];
//   popular?: boolean;
// };

// type InvoiceStatus = "Paid" | "Pending" | "Failed";

// type Invoice = {
//   id: string;
//   date: string;
//   billingPeriod: string;
//   plan: string;
//   amount: number;
//   status: InvoiceStatus;
//   paymentMethod: string;
//   pdfUrl?: string;
// };

// export type PlanAndBillingProps = {
//   currentPlanId?: string;
//   plans?: PlanTier[];
//   yearToDateSpend?: number;
//   yearToDateRange?: string;
//   totalInvoicesLabel?: string;
//   cardBrand?: string;
//   cardLast4?: string;
//   cardExpiry?: string;
//   nextInvoiceAmount?: number;
//   nextInvoiceDate?: string;
//   invoices?: Invoice[];
//   onSelectPlan?: (planId: string) => void;
//   onUpdateCard?: () => void;
//   onRemoveCard?: () => void;
//   onDownloadInvoice?: (invoiceId: string) => void;
//   onExportAll?: () => void;
// };

// /* ------------------------------------------------------------------ */
// /*  Default sample data                                               */
// /* ------------------------------------------------------------------ */

// const DEFAULT_PLANS: PlanTier[] = [
//   {
//     id: "starter",
//     name: "Starter",
//     price: 79,
//     tagline: "Perfect for businesses getting started with review collection.",
//     features: [
//       "Basic review collection",
//       "Review monitoring",
//       "100 review requests/month",
//       "3 competitors tracked",
//     ],
//   },
//   {
//     id: "growth",
//     name: "Growth",
//     price: 149,
//     tagline:
//       "Everything you need to grow reviews and monitor your competition.",
//     popular: true,
//     features: [
//       "QuickSend",
//       "NFC review collection",
//       "QR code tracking",
//       "5 competitors monitored",
//       "Advanced Review Gap",
//       "Monthly AI Growth Report",
//       "CSV upload",
//       "300 review requests/month",
//     ],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: 299,
//     tagline:
//       "For high-volume businesses that need maximum capacity and support.",
//     features: [
//       "1,000 review requests/month",
//       "10 competitors monitored",
//       "Multiple NFC locations/stands",
//       "Priority support",
//       "Future CRM integration readiness",
//     ],
//   },
// ];

// const DEFAULT_INVOICES: Invoice[] = [
//   {
//     id: "INV-2026-009",
//     date: "Sep 1, 2026",
//     billingPeriod: "Sep 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
//   {
//     id: "INV-2026-008",
//     date: "Aug 1, 2026",
//     billingPeriod: "Aug 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
//   {
//     id: "INV-2026-007",
//     date: "Jul 1, 2026",
//     billingPeriod: "Jul 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
//   {
//     id: "INV-2026-006",
//     date: "Jun 1, 2026",
//     billingPeriod: "Jun 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
//   {
//     id: "INV-2026-005",
//     date: "May 1, 2026",
//     billingPeriod: "May 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
//   {
//     id: "INV-2026-004",
//     date: "Apr 1, 2026",
//     billingPeriod: "Apr 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
//   {
//     id: "INV-2026-003",
//     date: "Mar 1, 2026",
//     billingPeriod: "Mar 2026",
//     plan: "Growth",
//     amount: 79,
//     status: "Paid",
//     paymentMethod: "Visa •••• 4242",
//   },
// ];

// /* ------------------------------------------------------------------ */
// /*  Small helpers                                                     */
// /* ------------------------------------------------------------------ */

// const currency = (n: number) =>
//   n.toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 2,
//   });

// const statusStyles: Record<InvoiceStatus, string> = {
//   Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
//   Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
//   Failed: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
// };

// /* ------------------------------------------------------------------ */
// /*  Component                                                         */
// /* ------------------------------------------------------------------ */

// export default function PlanAndBilling({
//   currentPlanId = "growth",
//   plans = DEFAULT_PLANS,
//   yearToDateSpend = 561,
//   yearToDateRange = "Jan – Sep 2026",
//   totalInvoicesLabel = "Since Oct 2025",
//   cardBrand = "VISA",
//   cardLast4 = "4242",
//   cardExpiry = "08/28",
//   nextInvoiceAmount = 79,
//   nextInvoiceDate = "Oct 1, 2026",
//   invoices = DEFAULT_INVOICES,
//   onSelectPlan,
//   onUpdateCard,
//   onRemoveCard,
//   onDownloadInvoice,
//   onExportAll,
// }: PlanAndBillingProps) {
//   const [search, setSearch] = useState("");
//   const [yearFilter, setYearFilter] = useState<"All" | string>("All");

//   const currentPlan = plans.find((p) => p.id === currentPlanId) ?? plans[0];

//   const years = useMemo(() => {
//     const set = new Set<string>();
//     invoices.forEach((inv) => {
//       const match = inv.date.match(/\d{4}/);
//       if (match) set.add(match[0]);
//     });
//     return Array.from(set).sort((a, b) => Number(b) - Number(a));
//   }, [invoices]);

//   const filteredInvoices = useMemo(() => {
//     return invoices.filter((inv) => {
//       const matchesSearch =
//         search.trim() === "" ||
//         inv.id.toLowerCase().includes(search.trim().toLowerCase()) ||
//         inv.plan.toLowerCase().includes(search.trim().toLowerCase());
//       const matchesYear = yearFilter === "All" || inv.date.includes(yearFilter);
//       return matchesSearch && matchesYear;
//     });
//   }, [invoices, search, yearFilter]);

//   const totalPaid = filteredInvoices.reduce(
//     (sum, inv) => sum + (inv.status === "Paid" ? inv.amount : 0),
//     0,
//   );

//   return (
//     <div className="b w-full">
//       <div className="mx-auto flex w-full flex-col gap-10">
//         {/* ---------------------------------------------------------- */}
//         {/* Plan section                                               */}
//         {/* ---------------------------------------------------------- */}
//         <section>
//           <header className="mb-6">
//             <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//               Plan &amp; Billing
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               You are currently on the {currentPlan.name} plan. Upgrade or
//               change at any time.
//             </p>
//           </header>

//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {plans.map((plan) => {
//               const isPopular = plan.popular;
//               const isCurrent = plan.id === currentPlanId;

//               return (
//                 <div
//                   key={plan.id}
//                   className={[
//                     "relative flex flex-col rounded-2xl p-6 transition-shadow",
//                     isPopular
//                       ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 sm:scale-[1.02]"
//                       : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200",
//                   ].join(" ")}
//                 >
//                   {isPopular && (
//                     <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950 shadow">
//                       Most Popular
//                     </span>
//                   )}

//                   <div className="mb-1 flex items-center justify-between">
//                     <span
//                       className={[
//                         "text-xs font-semibold tracking-wide",
//                         isPopular ? "text-blue-100" : "text-slate-500",
//                       ].join(" ")}
//                     >
//                       {plan.name.toUpperCase()}
//                     </span>
//                     {isCurrent && (
//                       <span
//                         className={[
//                           "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
//                           isPopular
//                             ? "bg-white/15 text-white"
//                             : "bg-blue-50 text-blue-700",
//                         ].join(" ")}
//                       >
//                         <Star className="h-3 w-3" />
//                         Current
//                       </span>
//                     )}
//                   </div>

//                   <div className="mb-2 flex items-baseline gap-1">
//                     <span className="text-4xl font-bold">${plan.price}</span>
//                     <span
//                       className={isPopular ? "text-blue-100" : "text-slate-500"}
//                     >
//                       /month
//                     </span>
//                   </div>

//                   <p
//                     className={[
//                       "mb-5 text-sm leading-relaxed",
//                       isPopular ? "text-blue-50" : "text-slate-500",
//                     ].join(" ")}
//                   >
//                     {plan.tagline}
//                   </p>

//                   <ul className="mb-6 flex flex-1 flex-col gap-3">
//                     {plan.features.map((feature) => (
//                       <li
//                         key={feature}
//                         className="flex items-start gap-2 text-sm"
//                       >
//                         <span
//                           className={[
//                             "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
//                             isPopular ? "bg-white/20" : "bg-blue-100",
//                           ].join(" ")}
//                         >
//                           <Check
//                             className={[
//                               "h-2.5 w-2.5",
//                               isPopular ? "text-white" : "text-blue-600",
//                             ].join(" ")}
//                             strokeWidth={3}
//                           />
//                         </span>
//                         <span
//                           className={
//                             isPopular ? "text-white" : "text-slate-700"
//                           }
//                         >
//                           {feature}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   <button
//                     type="button"
//                     onClick={() => onSelectPlan?.(plan.id)}
//                     className={[
//                       "mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
//                       isPopular
//                         ? "bg-white text-blue-600 hover:bg-blue-50 focus-visible:ring-white"
//                         : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
//                     ].join(" ")}
//                   >
//                     Get Started
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ---------------------------------------------------------- */}
//         {/* Billing history section                                    */}
//         {/* ---------------------------------------------------------- */}
//         <section>
//           <header className="mb-6">
//             <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//               Billing History
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               View and download all past invoices for your account.
//             </p>
//           </header>

//           {/* Summary cards */}
//           <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//             <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
//               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
//                 <Star className="h-5 w-5 text-blue-600" />
//               </span>
//               <div className="min-w-0">
//                 <p className="truncate text-base font-semibold text-slate-900">
//                   {currentPlan.name}
//                 </p>
//                 <p className="text-sm text-slate-500">Current Plan</p>
//                 <p className="text-xs text-slate-400">
//                   ${currentPlan.price}.00 / month
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
//               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
//                 <TrendingUp className="h-5 w-5 text-emerald-600" />
//               </span>
//               <div className="min-w-0">
//                 <p className="truncate text-base font-semibold text-slate-900">
//                   {currency(yearToDateSpend)}
//                 </p>
//                 <p className="text-sm text-slate-500">Year-to-Date Spend</p>
//                 <p className="text-xs text-slate-400">{yearToDateRange}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
//               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
//                 <Calendar className="h-5 w-5 text-indigo-600" />
//               </span>
//               <div className="min-w-0">
//                 <p className="truncate text-base font-semibold text-slate-900">
//                   {invoices.length}
//                 </p>
//                 <p className="text-sm text-slate-500">Total Invoices</p>
//                 <p className="text-xs text-slate-400">{totalInvoicesLabel}</p>
//               </div>
//             </div>
//           </div>

//           {/* Payment method */}
//           <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
//             <p className="mb-3 text-sm font-semibold text-slate-900">
//               Payment Method
//             </p>
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold tracking-wide text-white">
//                   {cardBrand}
//                 </span>
//                 <p className="text-sm text-slate-700">
//                   {cardBrand === "VISA" ? "Visa" : cardBrand} ending in{" "}
//                   {cardLast4}
//                   <span className="mx-1.5 text-slate-300">·</span>
//                   <span className="text-slate-400">Expires {cardExpiry}</span>
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={onUpdateCard}
//                   className="rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//                 >
//                   Update Card
//                 </button>
//                 <button
//                   type="button"
//                   onClick={onRemoveCard}
//                   className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Next invoice notice */}
//           <div className="mb-6 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 ring-1 ring-inset ring-blue-100">
//             <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
//             <p>
//               Your next invoice of{" "}
//               <span className="font-semibold">
//                 {currency(nextInvoiceAmount)}
//               </span>{" "}
//               will be charged on{" "}
//               <span className="font-semibold">{nextInvoiceDate}</span> to{" "}
//               {cardBrand === "VISA" ? "Visa" : cardBrand} ···· {cardLast4}.
//             </p>
//           </div>

//           {/* Toolbar */}
//           <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search invoices..."
//               className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
//             />
//             <div className="flex items-center justify-between gap-2 sm:justify-end">
//               <div className="flex rounded-lg bg-slate-100 p-1">
//                 {(["All", ...years] as const).map((y) => (
//                   <button
//                     key={y}
//                     type="button"
//                     onClick={() => setYearFilter(y)}
//                     className={[
//                       "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
//                       yearFilter === y
//                         ? "bg-blue-600 text-white shadow-sm"
//                         : "text-slate-600 hover:text-slate-900",
//                     ].join(" ")}
//                   >
//                     {y}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 type="button"
//                 onClick={onExportAll}
//                 className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//               >
//                 <Download className="h-4 w-4" />
//                 Export All
//               </button>
//             </div>
//           </div>

//           {/* Table — desktop */}
//           <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 md:block">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[720px] text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
//                     <th className="px-5 py-3">Invoice</th>
//                     <th className="px-5 py-3">Date</th>
//                     <th className="px-5 py-3">Billing Period</th>
//                     <th className="px-5 py-3">Plan</th>
//                     <th className="px-5 py-3">Amount</th>
//                     <th className="px-5 py-3">Status</th>
//                     <th className="px-5 py-3">Payment Method</th>
//                     <th className="px-5 py-3 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {filteredInvoices.map((inv) => (
//                     <tr
//                       key={inv.id + inv.date}
//                       className="transition-colors hover:bg-slate-50"
//                     >
//                       <td className="whitespace-nowrap px-5 py-3.5 font-medium text-blue-600">
//                         {inv.id}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
//                         {inv.date}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
//                         {inv.billingPeriod}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5">
//                         <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
//                           {inv.plan}
//                         </span>
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">
//                         {currency(inv.amount)}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5">
//                         <span
//                           className={[
//                             "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
//                             statusStyles[inv.status],
//                           ].join(" ")}
//                         >
//                           {inv.status}
//                         </span>
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
//                         {inv.paymentMethod}
//                       </td>
//                       <td className="whitespace-nowrap px-5 py-3.5 text-right">
//                         <button
//                           type="button"
//                           onClick={() => onDownloadInvoice?.(inv.id)}
//                           className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
//                         >
//                           <Download className="h-3.5 w-3.5" />
//                           PDF
//                         </button>
//                       </td>
//                     </tr>
//                   ))}

//                   {filteredInvoices.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={8}
//                         className="px-5 py-10 text-center text-sm text-slate-400"
//                       >
//                         No invoices match your search.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
//               <span>{filteredInvoices.length} invoices shown</span>
//               <span>
//                 Total paid{" "}
//                 <span className="font-semibold text-slate-900">
//                   {currency(totalPaid)}
//                 </span>
//               </span>
//             </div>
//           </div>

//           {/* Cards — mobile */}
//           <div className="flex flex-col gap-3 md:hidden">
//             {filteredInvoices.map((inv) => (
//               <div
//                 key={inv.id + inv.date}
//                 className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
//               >
//                 <div className="mb-3 flex items-start justify-between">
//                   <div>
//                     <p className="text-sm font-semibold text-blue-600">
//                       {inv.id}
//                     </p>
//                     <p className="text-xs text-slate-400">{inv.date}</p>
//                   </div>
//                   <span
//                     className={[
//                       "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
//                       statusStyles[inv.status],
//                     ].join(" ")}
//                   >
//                     {inv.status}
//                   </span>
//                 </div>

//                 <dl className="grid grid-cols-2 gap-y-2 text-sm">
//                   <dt className="text-slate-400">Billing Period</dt>
//                   <dd className="text-right text-slate-700">
//                     {inv.billingPeriod}
//                   </dd>

//                   <dt className="text-slate-400">Plan</dt>
//                   <dd className="text-right">
//                     <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
//                       {inv.plan}
//                     </span>
//                   </dd>

//                   <dt className="text-slate-400">Amount</dt>
//                   <dd className="text-right font-medium text-slate-900">
//                     {currency(inv.amount)}
//                   </dd>

//                   <dt className="text-slate-400">Payment</dt>
//                   <dd className="text-right text-slate-700">
//                     {inv.paymentMethod}
//                   </dd>
//                 </dl>

//                 <button
//                   type="button"
//                   onClick={() => onDownloadInvoice?.(inv.id)}
//                   className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
//                 >
//                   <Download className="h-3.5 w-3.5" />
//                   Download PDF
//                 </button>
//               </div>
//             ))}

//             {filteredInvoices.length === 0 && (
//               <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 ring-1 ring-slate-200">
//                 No invoices match your search.
//               </div>
//             )}

//             {filteredInvoices.length > 0 && (
//               <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
//                 <span>{filteredInvoices.length} invoices shown</span>
//                 <span>
//                   Total{" "}
//                   <span className="font-semibold text-slate-900">
//                     {currency(totalPaid)}
//                   </span>
//                 </span>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Star,
  Calendar,
  Download,
  CreditCard,
  MessageSquare,
  Loader2,
  AlertTriangle,
  X,
  Lock,
  ShieldCheck,
  ArrowRight,
  Zap,
  Layers,
  Bot,
} from "lucide-react";

// ⚠️ Adjust these paths to match your project

import {
  useGetAvailablePlansPricingQuery,
  useGetMyCurrentSubscriptionQuery,
  useUpgradeChangePlanCheckoutMutation,
  useCancelSubscriptionMutation,
} from "@/redux/api/userDashboard/subscription/subscriptionApi";

import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import {
  detectUserCountrySync,
  detectUserCountryAsync,
  getPlanPricing,
  getCountryDetail,
} from "@/utils/pricingCurrency";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const BUSINESS_CACHE_KEY = "gmr_business_id";
const PENDING_KEY = "gmr_pending_checkout";
const POLL_TRIES = 8;
const POLL_DELAY_MS = 2000;

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type ApiPlan = {
  plan: string; // FREE_TRIAL | STARTER | GROWTH | ENTERPRISE
  name: string;
  tagline: string;
  priceMonthly: number;
  currency: string;
  smsLimit: number;
  aiReplyLimit: number;
  nfcCardsIncluded: number;
  isPopular?: boolean;
  features: string[];
};

type InvoiceStatus = "Paid" | "Pending" | "Failed";

type Invoice = {
  id: string;
  date: string;
  billingPeriod: string;
  plan: string;
  amount: number;
  status: InvoiceStatus;
  paymentMethod: string;
};

type Notice = { type: "success" | "error" | "info"; text: string } | null;

type PendingCheckout = { plan: string; sessionId?: string; startedAt: number };

export type PlanAndBillingProps = {
  invoices?: Invoice[];
  onDownloadInvoice?: (invoiceId: string) => void;
  onExportAll?: () => void;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const currency = (n: number, cur = "USD") =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 2,
  });

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  Failed: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
};

const noticeStyles: Record<NonNullable<Notice>["type"], string> = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  error: "bg-red-50 text-red-800 ring-red-200",
  info: "bg-blue-50 text-blue-800 ring-blue-200",
};

const errMsg = (e: any, fallback: string) =>
  e?.data?.message || e?.error || e?.message || fallback;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const readPending = (): PendingCheckout | null => {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PendingCheckout;
    // ignore anything older than 1 hour
    if (Date.now() - p.startedAt > 60 * 60 * 1000) {
      sessionStorage.removeItem(PENDING_KEY);
      return null;
    }
    return p;
  } catch {
    return null;
  }
};

const clearPending = () => {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {}
};

const extractPlans = (res: any): ApiPlan[] => {
  const candidates = [
    res,
    res?.data,
    res?.data?.plans,
    res?.data?.data,
    res?.data?.items,
    res?.plans,
    res?.items,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c as ApiPlan[];
  }
  return [];
};

const cleanUrl = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  ["payment", "success", "canceled", "cancelled", "session_id", "plan"].forEach(
    (k) => url.searchParams.delete(k),
  );
  window.history.replaceState({}, "", url.pathname + url.search);
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PlanAndBilling({
  invoices = [],
  onDownloadInvoice,
  onExportAll,
}: PlanAndBillingProps) {
  /* ---------------- 1. Profile -> businessId (cached) ---------------- */
  const { data: profileRes, isLoading: profileLoading } =
    useGetMeProfileQuery(undefined);

  const [cachedBusinessId, setCachedBusinessId] = useState<string>("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BUSINESS_CACHE_KEY);
      if (saved) setCachedBusinessId(saved);
    } catch {}
  }, []);

  const liveBusinessId: string =
    profileRes?.data?.businessId ?? profileRes?.data?.businesses?.[0]?.id ?? "";

  useEffect(() => {
    if (liveBusinessId) {
      setCachedBusinessId(liveBusinessId);
      try {
        sessionStorage.setItem(BUSINESS_CACHE_KEY, liveBusinessId);
      } catch {}
    }
  }, [liveBusinessId]);

  const businessId = liveBusinessId || cachedBusinessId;

  /* ---------------- 2. Plans + current subscription ---------------- */
  const { data: plansRes, isLoading: plansLoading } =
    useGetAvailablePlansPricingQuery(undefined);

  const {
    data: subRes,
    isLoading: subLoading,
    refetch: refetchSub,
  } = useGetMyCurrentSubscriptionQuery(businessId, { skip: !businessId });

  const allPlans: ApiPlan[] = useMemo(() => extractPlans(plansRes), [plansRes]);
  const paidPlans = useMemo(
    () => allPlans.filter((p) => p && p.plan !== "FREE_TRIAL"),
    [allPlans],
  );

  const subscription = subRes?.data?.subscription;
  const quotas = subRes?.data?.quotas;
  const currentPlanKey: string = subscription?.plan ?? "";
  const currentPlanData = allPlans.find((p) => p?.plan === currentPlanKey);
  const currentPrice: number =
    subscription?.priceMonthly ?? currentPlanData?.priceMonthly ?? 0;
  const isActive = subscription?.status === "ACTIVE";
  const isPaidPlan = currentPlanKey !== "" && currentPlanKey !== "FREE_TRIAL";

  /* ---------------- 3. Mutations ---------------- */
  const [upgradeChangePlanCheckout, { isLoading: creatingCheckout }] =
    useUpgradeChangePlanCheckoutMutation();
  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();

  /* ---------------- UI state ---------------- */
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedPlan, setSelectedPlan] = useState<ApiPlan | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [planCategory, setPlanCategory] = useState<"standard" | "scale">("standard");
  const [showCancel, setShowCancel] = useState(false);
  const [confirming, setConfirming] = useState(false);

  /* ---------------- Multi-Currency & Location Detection ---------------- */
  const businessCountry =
    profileRes?.data?.business?.country ||
    profileRes?.data?.businesses?.[0]?.country ||
    (profileRes?.data as any)?.country;

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() =>
    detectUserCountrySync(businessCountry)
  );

  useEffect(() => {
    let alive = true;
    detectUserCountryAsync(businessCountry).then((code) => {
      if (alive && code) setSelectedCountryCode(code);
    });
    return () => {
      alive = false;
    };
  }, [businessCountry]);

  const currentCountry = useMemo(
    () => getCountryDetail(selectedCountryCode),
    [selectedCountryCode]
  );

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<"All" | string>("All");

  /* ---------------- 4. Handle return from Stripe ---------------- */
  // The backend creates the session and Stripe's real webhook activates the
  // plan. So after coming back we poll the subscription until it changes.
  const handledReturn = useRef(false);

  useEffect(() => {
    if (!businessId || handledReturn.current) return;

    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");

    // User pressed "back" on the Stripe page
    if (
      payment === "cancelled" ||
      payment === "canceled" ||
      params.get("canceled")
    ) {
      handledReturn.current = true;
      clearPending();
      setNotice({
        type: "error",
        text: "Payment was cancelled. You were not charged.",
      });
      cleanUrl();
      return;
    }

    const pending = readPending();
    if (!pending) return;

    handledReturn.current = true;
    const returnedFromStripe =
      payment === "success" ||
      params.get("success") === "true" ||
      !!params.get("session_id");

    setConfirming(true);

    (async () => {
      let updated = false;
      for (let i = 0; i < POLL_TRIES; i++) {
        try {
          const fresh = await refetchSub().unwrap();
          const sub = fresh?.data?.subscription;
          if (sub?.plan === pending.plan && sub?.status === "ACTIVE") {
            updated = true;
            break;
          }
        } catch {}
        await sleep(POLL_DELAY_MS);
      }

      if (updated) {
        setNotice({
          type: "success",
          text: "Payment confirmed! Your plan has been updated.",
        });
      } else if (returnedFromStripe) {
        setNotice({
          type: "info",
          text: "We received your payment, but your plan has not updated yet. It can take a minute. Please refresh shortly or contact support.",
        });
      }
      // else: the user just came back without paying, so say nothing

      clearPending();
      setConfirming(false);
      cleanUrl();
    })();
  }, [businessId, refetchSub]);

  /* ---------------- 5. Actions ---------------- */
  const handleCheckout = async (plan: ApiPlan) => {
    if (!businessId) {
      setNotice({ type: "error", text: "Business not found. Please reload." });
      return;
    }
    setNotice(null);

    try {
      const res = await upgradeChangePlanCheckout({
        businessId,
        plan: plan.plan,
        currency: currentCountry.currency.toLowerCase(),
        country: currentCountry.code,
      }).unwrap();

      const checkoutUrl: string | undefined = res?.data?.checkoutUrl;
      const sessionId: string | undefined = res?.data?.sessionId;

      if (!checkoutUrl) {
        setNotice({
          type: "error",
          text: "Could not start checkout. Please try again.",
        });
        return;
      }

      // remember what we're paying for so we can verify when the user returns
      try {
        const pending: PendingCheckout = {
          plan: plan.plan,
          sessionId,
          startedAt: Date.now(),
        };
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      } catch {}

      window.location.href = checkoutUrl;
    } catch (e) {
      setNotice({
        type: "error",
        text: errMsg(e, "Could not start checkout."),
      });
      setSelectedPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!businessId) return;
    try {
      await cancelSubscription(businessId).unwrap();
      setNotice({
        type: "success",
        text: "Your subscription has been cancelled.",
      });
      setShowCancel(false);
      refetchSub();
    } catch (e) {
      setNotice({
        type: "error",
        text: errMsg(e, "Could not cancel subscription."),
      });
    }
  };

  /* ---------------- Invoices (derived from active subscription or props) ---------------- */
  const activeInvoices: Invoice[] = useMemo(() => {
    if (invoices && invoices.length > 0) return invoices;
    if (isPaidPlan && subscription) {
      const pName = subscription.planName || subscription.plan;
      const start = fmtDate(subscription.currentPeriodStart);
      const end = fmtDate(subscription.currentPeriodEnd);
      return [
        {
          id: `INV-${subscription.id?.slice(-6)?.toUpperCase() || "SUB-01"}`,
          date: start,
          billingPeriod: `${start} – ${end}`,
          plan: pName,
          amount: currentPrice,
          status: "Paid",
          paymentMethod: "Online Card Payment",
        },
      ];
    }
    return [];
  }, [invoices, isPaidPlan, subscription, currentPrice]);

  const handleDownloadPdf = (inv: Invoice) => {
    if (onDownloadInvoice) {
      onDownloadInvoice(inv.id);
      return;
    }
    // Professional print-to-PDF invoice window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${inv.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #2563eb; }
            .badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #15803d; border-radius: 9999px; font-weight: 700; font-size: 12px; }
            .details { margin-bottom: 30px; }
            .details table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details th, .details td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
            .details th { background: #f8fafc; font-size: 12px; text-transform: uppercase; color: #64748b; }
            .total { text-align: right; margin-top: 30px; font-size: 18px; font-weight: 800; }
            .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">GrowMoreReviews</div>
              <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Official Billing Receipt</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 20px;">${inv.id}</h2>
              <span class="badge">${inv.status}</span>
              <p style="color: #64748b; font-size: 12px; margin: 6px 0 0 0;">Date: ${inv.date}</p>
            </div>
          </div>

          <div class="details">
            <p><strong>Billed To:</strong> ${profileRes?.data?.business?.name || profileRes?.data?.name || "Customer"}</p>
            <p style="color: #64748b; font-size: 13px; margin: 2px 0 20px 0;">Billing Period: ${inv.billingPeriod}</p>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Payment Method</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${inv.plan} Subscription</strong><br/><span style="font-size: 12px; color: #64748b;">Monthly Recurring Platform Access</span></td>
                  <td>${inv.paymentMethod}</td>
                  <td style="text-align: right; font-weight: bold;">$${inv.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="total">
              Total Paid: $${inv.amount.toFixed(2)} USD
            </div>
          </div>

          <div class="footer">
            Thank you for partnering with GrowMoreReviews.<br/>
            For billing inquiries or questions, contact support@growmorereviews.com
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const years = useMemo(() => {
    const set = new Set<string>();
    activeInvoices.forEach((inv) => {
      const m = inv.date.match(/\d{4}/);
      if (m) set.add(m[0]);
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [activeInvoices]);

  const filteredInvoices = useMemo(
    () =>
      activeInvoices.filter((inv) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          q === "" ||
          inv.id.toLowerCase().includes(q) ||
          inv.plan.toLowerCase().includes(q);
        const matchesYear =
          yearFilter === "All" || inv.date.includes(yearFilter);
        return matchesSearch && matchesYear;
      }),
    [invoices, search, yearFilter],
  );

  const totalPaid = filteredInvoices.reduce(
    (s, inv) => s + (inv.status === "Paid" ? inv.amount : 0),
    0,
  );

  /* ---------------- Loading ---------------- */
  if (profileLoading || plansLoading || (subLoading && !!businessId)) {
    return (
      <div className="flex w-full items-center justify-center py-24 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading plan & billing...
      </div>
    );
  }

  const modalAction =
    selectedPlan && isPaidPlan
      ? selectedPlan.priceMonthly > currentPrice
        ? "Upgrade"
        : "Switch"
      : "Subscribe";

  /* ---------------- Render ---------------- */
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full flex-col gap-10">
        {/* Notice */}
        {notice && (
          <div
            className={[
              "flex items-start justify-between gap-3 rounded-xl px-4 py-3 text-sm ring-1 ring-inset",
              noticeStyles[notice.type],
            ].join(" ")}
          >
            <p>{notice.text}</p>
            <button type="button" onClick={() => setNotice(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {confirming && (
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 ring-1 ring-inset ring-blue-100">
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming your payment, this can take a few seconds...
          </div>
        )}

        {/* ---------------- Current Plan & Overview ---------------- */}
        <section>
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Plan &amp; Billing
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your active subscription, quotas, and invoices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none"
              >
                <Zap className="h-4 w-4" />
                {currentPlanKey === "FREE_TRIAL" || !isPaidPlan ? "Upgrade to Paid Plan" : "Change / Upgrade Plan"}
              </button>
            </div>
          </header>

          {/* Active Plan Hero Card */}
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:from-[#0b1727] dark:via-[#0b1727] dark:to-blue-950/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
                    {subscription?.status === "CANCELED" ? "Current Plan (Cancels At Period End)" : "Active Plan"}
                  </span>
                  {subscription?.status && (
                    <span
                      className={[
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                        subscription.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : subscription.status === "CANCELED"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
                      ].join(" ")}
                    >
                      {subscription.status}
                    </span>
                  )}
                  {currentPlanKey === "FREE_TRIAL" && subscription?.daysRemaining != null && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      ⏳ {subscription.daysRemaining} days left in trial
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {subscription?.planName ?? "Free Trial"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                    {currentPlanData?.tagline ??
                      "Full access to automated review collection, SMS invite workflows, and AI auto-responses."}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    ${currentPrice}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    / month
                  </span>
                  {subscription?.currentPeriodEnd && (
                    <span className="ml-3 text-xs text-slate-400 dark:text-slate-500">
                      • {subscription.status === "CANCELED" ? "Access ends on" : currentPlanKey === "FREE_TRIAL" ? "Trial ends" : "Renews on"}{" "}
                      <strong className="font-semibold text-slate-700 dark:text-slate-300">
                        {fmtDate(subscription.currentPeriodEnd)}
                      </strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons on card */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700"
                >
                  <Zap className="h-4 w-4" />
                  {currentPlanKey === "FREE_TRIAL" || !isPaidPlan ? "Upgrade Now" : "Change Plan"}
                </button>
                {isPaidPlan && isActive && (
                  <button
                    type="button"
                    onClick={() => setShowCancel(true)}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Quotas & Billing Metrics ---------------- */}
        <section>
          <header className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Usage &amp; Quotas
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Current period usage allocations and hardware entitlement.
            </p>
          </header>

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-[#0b1727] p-5 ring-1 ring-slate-200 dark:ring-slate-800">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                  {quotas?.sms?.used ?? 0} / {quotas?.sms?.limit ?? 0}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">SMS Invites Used</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.min(quotas?.sms?.usagePercentage ?? 0, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-[#0b1727] p-5 ring-1 ring-slate-200 dark:ring-slate-800">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                  {quotas?.aiReply?.used ?? 0} / {quotas?.aiReply?.limit ?? 0}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">AI Auto-Replies</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(quotas?.aiReply?.usagePercentage ?? 0, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-[#0b1727] p-5 ring-1 ring-slate-200 dark:ring-slate-800">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                  {fmtDate(subscription?.currentPeriodEnd)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentPlanKey === "FREE_TRIAL" ? "Trial Ends" : "Billing Cycle Renews"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Started {fmtDate(subscription?.currentPeriodStart)}
                </p>
              </div>
            </div>
          </div>

          {/* AI reply quota + NFC */}
          {quotas && (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white dark:bg-[#0b1727] p-5 ring-1 ring-slate-200 dark:ring-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  AI Auto-Replies
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {quotas.aiReply.used} of {quotas.aiReply.limit} used ·{" "}
                  {quotas.aiReply.remaining} remaining
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(quotas.aiReply.usagePercentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#0b1727] p-5 ring-1 ring-slate-200 dark:ring-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  NFC Stands Included
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {quotas.nfcCardsIncluded} smart NFC stand
                  {quotas.nfcCardsIncluded === 1 ? "" : "s"} / QR code
                  {quotas.nfcCardsIncluded === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}

          {/* Current period notice + cancel */}
          {subscription && (
            <div
              className={[
                "mb-6 flex flex-col gap-3 rounded-xl px-4 py-3 text-sm ring-1 ring-inset sm:flex-row sm:items-center sm:justify-between",
                subscription.status === "CANCELED"
                  ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/50"
                  : "bg-blue-50 text-blue-800 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900/50",
              ].join(" ")}
            >
              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {subscription.status === "CANCELED"
                    ? `Your subscription has been cancelled. You retain full access to all ${subscription.planName || "Enterprise"} features until ${fmtDate(subscription.currentPeriodEnd)}, after which you will not be billed again.`
                    : isPaidPlan
                    ? `Your current period runs until ${fmtDate(subscription.currentPeriodEnd)}.`
                    : `Your free trial ends on ${fmtDate(subscription.currentPeriodEnd)}. Choose a plan above to keep your access.`}
                </p>
              </div>
              {isPaidPlan && isActive && (
                <button
                  type="button"
                  onClick={() => setShowCancel(true)}
                  className="shrink-0 rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          )}

          {/* Invoice toolbar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
            />
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {years.length > 0 && (
                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                  {["All", ...years].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYearFilter(y)}
                      className={[
                        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        yearFilter === y
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                      ].join(" ")}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={onExportAll}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                Export All
              </button>
            </div>
          </div>

          {/* Table — desktop */}
          <div className="hidden overflow-hidden rounded-2xl bg-white dark:bg-[#0b1727] ring-1 ring-slate-200 dark:ring-slate-800 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Billing Period</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Payment Method</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id + inv.date}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-blue-600 dark:text-blue-400">
                        {inv.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400">
                        {inv.date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400">
                        {inv.billingPeriod}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                          {inv.plan}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                        {currency(inv.amount)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statusStyles[inv.status],
                          ].join(" ")}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400">
                        {inv.paymentMethod}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(inv)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500"
                      >
                        {activeInvoices.length === 0
                          ? "No invoices yet."
                          : "No invoices match your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{filteredInvoices.length} invoices shown</span>
              <span>
                Total paid{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {currency(totalPaid)}
                </span>
              </span>
            </div>
          </div>

          {/* Cards — mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id + inv.date}
                className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      {inv.id}
                    </p>
                    <p className="text-xs text-slate-400">{inv.date}</p>
                  </div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[inv.status],
                    ].join(" ")}
                  >
                    {inv.status}
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Billing Period</dt>
                  <dd className="text-right text-slate-700">
                    {inv.billingPeriod}
                  </dd>
                  <dt className="text-slate-400">Plan</dt>
                  <dd className="text-right">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {inv.plan}
                    </span>
                  </dd>
                  <dt className="text-slate-400">Amount</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {currency(inv.amount)}
                  </dd>
                  <dt className="text-slate-400">Payment</dt>
                  <dd className="text-right text-slate-700">
                    {inv.paymentMethod}
                  </dd>
                </dl>
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(inv)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 ring-1 ring-slate-200">
                {activeInvoices.length === 0
                  ? "No invoices yet."
                  : "No invoices match your search."}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ---------------- Checkout modal ---------------- */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !creatingCheckout && setSelectedPlan(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 px-6 pb-8 pt-6 text-white">
              <button
                type="button"
                disabled={creatingCheckout}
                onClick={() => setSelectedPlan(null)}
                className="absolute right-4 top-4 rounded-full bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                <Zap className="h-3 w-3" />
                {modalAction} plan
              </span>
              <h3 className="mt-3 text-2xl font-bold">{selectedPlan.name}</h3>
              <p className="mt-1 text-sm text-blue-100">
                {selectedPlan.tagline}
              </p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold">
                  {getPlanPricing(selectedPlan.plan, selectedCountryCode, selectedPlan.priceMonthly).formatted}
                </span>
                <span className="text-sm text-blue-100">
                  / month {getPlanPricing(selectedPlan.plan, selectedCountryCode, selectedPlan.priceMonthly).currency}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {isPaidPlan && (
                <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200">
                  <div>
                    <p className="text-xs text-slate-400">Current plan</p>
                    <p className="font-medium text-slate-700">
                      {subscription?.planName} ·{" "}
                      {currency(currentPrice, subscription?.currency)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="text-right">
                    <p className="text-xs text-slate-400">New plan</p>
                    <p className="font-semibold text-blue-600">
                      {selectedPlan.name} ·{" "}
                      {currency(
                        selectedPlan.priceMonthly,
                        selectedPlan.currency,
                      )}
                    </p>
                  </div>
                </div>
              )}

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                What's included
              </p>
              <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-blue-50 px-2 py-3">
                  <p className="text-base font-bold text-blue-700">
                    {(selectedPlan.smsLimit ?? 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-blue-600/80">SMS invites</p>
                </div>
                <div className="rounded-xl bg-indigo-50 px-2 py-3">
                  <p className="text-base font-bold text-indigo-700">
                    {(selectedPlan.aiReplyLimit ?? 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-indigo-600/80">AI replies</p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-2 py-3">
                  <p className="text-base font-bold text-emerald-700">
                    {selectedPlan.nfcCardsIncluded ?? 0}
                  </p>
                  <p className="text-[11px] text-emerald-600/80">NFC stands</p>
                </div>
              </div>

              <ul className="mb-5 space-y-2">
                {(selectedPlan.features ?? []).slice(0, 4).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
                      strokeWidth={3}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mb-5 flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
                <span className="text-sm text-slate-500">Billed monthly</span>
                <span className="text-lg font-bold text-slate-900">
                  {getPlanPricing(selectedPlan.plan, selectedCountryCode, selectedPlan.priceMonthly).formatted}{" "}
                  {getPlanPricing(selectedPlan.plan, selectedCountryCode, selectedPlan.priceMonthly).currency}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCheckout(selectedPlan)}
                disabled={creatingCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creatingCheckout ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay securely with Stripe
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                disabled={creatingCheckout}
                className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Maybe later
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Payments are encrypted and processed by Stripe. We never see
                your card.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Cancel modal ---------------- */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Cancel subscription?
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  You may lose access to your {subscription?.planName} plan
                  features after the current period ends on{" "}
                  {fmtDate(subscription?.currentPeriodEnd)}.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancel(false)}
                disabled={cancelling}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Keep Plan
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------------- Available Plans / Upgrade Modal ---------------- */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="my-8 w-full max-w-5xl overflow-hidden rounded-3xl bg-white dark:bg-[#0b1727] shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative border-b border-slate-100 dark:border-slate-800 px-6 py-6 sm:px-8">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                Select a Package
              </div>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                Choose the best plan for your business
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Scale your review generation, SMS quota, and Google presence. Switch or cancel anytime.
              </p>

              {/* Toggle switch between 2 plans each */}
              <div className="mt-5 flex items-center justify-center">
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setPlanCategory("standard")}
                    className={[
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                      planCategory === "standard"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                    ].join(" ")}
                  >
                    <span>Standard Plans</span>
                    <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] text-blue-600 dark:text-blue-300">
                      Starter &amp; Growth
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanCategory("scale")}
                    className={[
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                      planCategory === "scale"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                    ].join(" ")}
                  >
                    <span>Scale &amp; High-Volume</span>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] text-indigo-600 dark:text-indigo-300">
                      Pro &amp; Enterprise
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Plans Grid — 2 Clean Cards per View */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
                {(planCategory === "standard"
                  ? paidPlans.filter((p) => p.plan === "STARTER" || p.plan === "GROWTH")
                  : paidPlans.filter((p) => p.plan === "PRO" || p.plan === "ENTERPRISE")
                ).map((plan) => {
                  const isPopular = !!plan.isPopular;
                  const isCurrent = plan.plan === currentPlanKey && isActive;
                  const isUpgrade = plan.priceMonthly > currentPrice;

                  let label = "Get Started";
                  if (isCurrent) label = "Current Plan";
                  else if (isPaidPlan) label = isUpgrade ? "Upgrade" : "Downgrade";

                  return (
                    <div
                      key={plan.plan}
                      className={[
                        "relative flex flex-col rounded-2xl p-6 transition-all",
                        isPopular
                          ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 md:scale-[1.02]"
                          : "bg-slate-50/60 dark:bg-slate-900/60 text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-800",
                      ].join(" ")}
                    >
                      {isPopular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950 shadow">
                          Most Popular
                        </span>
                      )}

                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={[
                            "text-xs font-semibold tracking-wide",
                            isPopular ? "text-blue-100" : "text-slate-500 dark:text-slate-400",
                          ].join(" ")}
                        >
                          {plan.name.toUpperCase()}
                        </span>
                        {isCurrent && (
                          <span
                            className={[
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                              isPopular
                                ? "bg-white/15 text-white"
                                : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
                            ].join(" ")}
                          >
                            <Star className="h-3 w-3" />
                            Current
                          </span>
                        )}
                      </div>

                      <div className="mb-2 flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold">
                          {getPlanPricing(plan.plan, selectedCountryCode, plan.priceMonthly).formatted}
                        </span>
                        <span className={isPopular ? "text-blue-100 text-xs" : "text-slate-500 dark:text-slate-400 text-xs"}>
                          /month {getPlanPricing(plan.plan, selectedCountryCode, plan.priceMonthly).currency}
                        </span>
                      </div>

                      <p
                        className={[
                          "mb-4 text-xs leading-relaxed",
                          isPopular ? "text-blue-50" : "text-slate-500 dark:text-slate-400",
                        ].join(" ")}
                      >
                        {plan.tagline}
                      </p>

                      <ul className="mb-6 flex flex-1 flex-col gap-2.5 text-xs">
                        {(plan.features ?? []).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span
                              className={[
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                                isPopular ? "bg-white/20" : "bg-blue-100 dark:bg-blue-950/50",
                              ].join(" ")}
                            >
                              <Check
                                className={[
                                  "h-2.5 w-2.5",
                                  isPopular ? "text-white" : "text-blue-600 dark:text-blue-400",
                                ].join(" ")}
                                strokeWidth={3}
                              />
                            </span>
                            <span className={isPopular ? "text-white" : "text-slate-700 dark:text-slate-200"}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        disabled={isCurrent || confirming}
                        onClick={() => {
                          setShowUpgradeModal(false);
                          setSelectedPlan(plan);
                        }}
                        className={[
                          "mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
                          isPopular
                            ? "bg-white text-blue-600 hover:bg-blue-50"
                            : "bg-blue-600 text-white hover:bg-blue-700",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
