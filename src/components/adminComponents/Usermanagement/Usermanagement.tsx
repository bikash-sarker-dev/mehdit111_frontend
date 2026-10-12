// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// /* ------------------------------------------------------------------ */
// /* Types                                                               */
// /* ------------------------------------------------------------------ */

// export type Plan = "Starter" | "Growth" | "Pro";
// export type SubscriptionStatus =
//   | "Active"
//   | "Trial"
//   | "Cancelled"
//   | "Expired"
//   | "Payment Failed";
// export type AccountStatus = "Active" | "Suspended";

// export interface BusinessDetails {
//   /** Overrides `owner` in the drawer if it differs from the table value. */
//   owner?: string;
//   type?: string;
//   address?: string;
//   phone?: string;
//   /** Falls back to the business `email`. */
//   email?: string;
//   /** Without protocol, e.g. "g.page/r/mycafe/review". */
//   gmbLink?: string;
//   /** ISO date (YYYY-MM-DD). Falls back to `joinedDate`. */
//   joinedDate?: string;
//   /** ISO date (YYYY-MM-DD). Falls back to `billingDate`. */
//   nextBillingDate?: string;
// }

// export interface Business {
//   id: string;
//   name: string;
//   email: string;
//   owner: string;
//   country: string;
//   plan: Plan;
//   subscription: SubscriptionStatus;
//   /** ISO date (YYYY-MM-DD) */
//   billingDate: string;
//   /** ISO date (YYYY-MM-DD) */
//   joinedDate: string;
//   status: AccountStatus;
//   /** Avatar initials. Generated from the name when omitted. */
//   initials?: string;
//   details?: BusinessDetails;
// }

// export interface UserManagementProps {
//   businesses?: Business[];
//   pageSize?: number;
//   initialPage?: number;
//   onDelete?: (business: Business) => void;
//   onStatusChange?: (business: Business, next: AccountStatus) => void;
//   onDownloadQr?: (business: Business) => void;
// }

// /* ------------------------------------------------------------------ */
// /* Demo data (matches the design mock; pass `businesses` to replace)   */
// /* ------------------------------------------------------------------ */

// const APEX: BusinessDetails = {
//   owner: "Mehdi",
//   type: "Cafe / Restaurant",
//   address: "142 West 3rd Street, New York, NY 10012",
//   phone: "+1 (555) 412-9900",
//   gmbLink: "g.page/r/bellascafe/review",
//   joinedDate: "2025-03-03",
//   nextBillingDate: "2026-10-14",
// };

// const BASE_ROWS: Omit<Business, "id">[] = [
//   {
//     name: "Apex Marketing Group",
//     email: "sarah@apexmarketing.co",
//     owner: "Sarah Chen",
//     country: "United States",
//     plan: "Growth",
//     subscription: "Active",
//     billingDate: "2026-10-02",
//     joinedDate: "2026-10-02",
//     status: "Active",
//     details: APEX,
//   },
//   {
//     name: "Luna Creative Studio",
//     email: "contact@lunacreative.com",
//     owner: "Miguel Torres",
//     country: "Canada",
//     plan: "Starter",
//     subscription: "Active",
//     billingDate: "2025-03-15",
//     joinedDate: "2026-03-15",
//     status: "Active",
//     details: {
//       type: "Design Studio",
//       address: "88 King Street West, Toronto, ON M5H 1A1",
//       phone: "+1 (416) 555-0142",
//       gmbLink: "g.page/r/lunacreative/review",
//     },
//   },
//   {
//     name: "GreenLeaf Solutions",
//     email: "info@greenleafsolutions.io",
//     owner: "Amina Yusuf",
//     country: "United Kingdom",
//     plan: "Pro",
//     subscription: "Cancelled",
//     billingDate: "2024-01-10",
//     joinedDate: "2025-01-10",
//     status: "Suspended",
//     details: {
//       type: "Consulting",
//       address: "21 Bishopsgate, London EC2N 3AQ",
//       phone: "+44 20 7946 0321",
//       gmbLink: "g.page/r/greenleaf/review",
//     },
//   },
//   {
//     name: "Everest Wellness",
//     email: "contact@everestwellness.org",
//     owner: "Liam O'Connor",
//     country: "Ireland",
//     plan: "Starter",
//     subscription: "Payment Failed",
//     billingDate: "2023-02-28",
//     joinedDate: "2024-02-28",
//     status: "Suspended",
//     details: {
//       type: "Health / Wellness",
//       address: "14 Grafton Street, Dublin 2, D02 XY45",
//       phone: "+353 1 555 0198",
//       gmbLink: "g.page/r/everestwellness/review",
//     },
//   },
//   {
//     name: "Vista Financial Advisors",
//     email: "support@vistafinancial.com",
//     owner: "Emily Knight",
//     country: "Australia",
//     plan: "Pro",
//     subscription: "Active",
//     billingDate: "2025-11-05",
//     joinedDate: "2026-11-05",
//     status: "Active",
//     details: {
//       type: "Financial Services",
//       address: "300 Collins Street, Melbourne VIC 3000",
//       phone: "+61 3 5550 1234",
//       gmbLink: "g.page/r/vistafinancial/review",
//     },
//   },
//   {
//     name: "Apex Marketing Group",
//     email: "sarah@apexmarketing.co",
//     owner: "Sarah Chen",
//     country: "United States",
//     plan: "Growth",
//     subscription: "Active",
//     billingDate: "2026-10-02",
//     joinedDate: "2026-10-02",
//     status: "Active",
//     details: APEX,
//   },
//   {
//     name: "Quantum Leap Tech",
//     email: "hello@quantumleaptech.com",
//     owner: "Raj Patel",
//     country: "India",
//     plan: "Starter",
//     subscription: "Expired",
//     billingDate: "2026-07-20",
//     joinedDate: "2027-07-20",
//     status: "Active",
//     details: {
//       type: "Software / IT",
//       address: "5th Floor, MG Road, Bengaluru 560001",
//       phone: "+91 80 5550 7788",
//       gmbLink: "g.page/r/quantumleap/review",
//     },
//   },
//   {
//     name: "Apex Marketing Group",
//     email: "sarah@apexmarketing.co",
//     owner: "Sarah Chen",
//     country: "United States",
//     plan: "Growth",
//     subscription: "Active",
//     billingDate: "2026-10-02",
//     joinedDate: "2026-10-02",
//     status: "Active",
//     details: APEX,
//   },
//   {
//     name: "Quantum Leap Tech",
//     email: "hello@quantumleaptech.com",
//     owner: "Raj Patel",
//     country: "India",
//     plan: "Starter",
//     subscription: "Expired",
//     billingDate: "2026-07-20",
//     joinedDate: "2027-07-20",
//     status: "Active",
//     details: {
//       type: "Software / IT",
//       address: "5th Floor, MG Road, Bengaluru 560001",
//       phone: "+91 80 5550 7788",
//       gmbLink: "g.page/r/quantumleap/review",
//     },
//   },
//   {
//     name: "Apex Marketing Group",
//     email: "sarah@apexmarketing.co",
//     owner: "Sarah Chen",
//     country: "United States",
//     plan: "Growth",
//     subscription: "Active",
//     billingDate: "2026-10-02",
//     joinedDate: "2026-10-02",
//     status: "Active",
//     details: APEX,
//   },
// ];

// // 5 pages x 10 rows so pagination is fully working out of the box.
// const DEMO_BUSINESSES: Business[] = Array.from({ length: 5 }).flatMap((_, p) =>
//   BASE_ROWS.map((row, i) => ({
//     ...row,
//     id: `demo-${p}-${i}`,
//     initials: "SM", // same avatar text as the design mock
//   })),
// );

// /* ------------------------------------------------------------------ */
// /* Constants & helpers                                                 */
// /* ------------------------------------------------------------------ */

// const FILTERS = [
//   "All",
//   "Active",
//   "Trial",
//   "Cancelled",
//   "Expired",
//   "Payment Failed",
// ] as const;
// type Filter = (typeof FILTERS)[number];

// const PLAN_STYLES: Record<Plan, string> = {
//   Growth: "bg-purple-100 text-purple-600",
//   Starter: "bg-cyan-50 text-cyan-500",
//   Pro: "bg-blue-100 text-blue-600",
// };

// const SUBSCRIPTION_STYLES: Record<SubscriptionStatus, string> = {
//   Active: "bg-green-100 text-green-600",
//   Trial: "bg-sky-100 text-sky-600",
//   Cancelled: "bg-slate-100 text-slate-600",
//   Expired: "bg-orange-100 text-orange-500",
//   "Payment Failed": "bg-red-100 text-red-500",
// };

// const ACCOUNT_STYLES: Record<AccountStatus, string> = {
//   Active: "bg-green-100 text-green-600",
//   Suspended: "bg-amber-100 text-amber-600",
// };

// const RING_STYLES: Record<string, string> = {
//   Active: "ring-1 ring-inset ring-green-200",
//   Suspended: "ring-1 ring-inset ring-amber-200",
// };

// function formatDate(iso?: string): string {
//   if (!iso) return "—";
//   const [y, m, d] = iso.split("-").map(Number);
//   if (!y || !m || !d) return iso;
//   return new Date(y, m - 1, d).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function getInitials(name: string): string {
//   return name
//     .split(/\s+/)
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((w) => w[0]?.toUpperCase())
//     .join("");
// }

// function getPageItems(current: number, total: number): (number | string)[] {
//   if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
//   const items: (number | string)[] = [1];
//   const start = Math.max(2, current - 1);
//   const end = Math.min(total - 1, current + 1);
//   if (start > 2) items.push("ellipsis-left");
//   for (let i = start; i <= end; i++) items.push(i);
//   if (end < total - 1) items.push("ellipsis-right");
//   items.push(total);
//   return items;
// }

// /* ------------------------------------------------------------------ */
// /* Small presentational pieces                                         */
// /* ------------------------------------------------------------------ */

// function Badge({
//   className,
//   children,
//   outlined = false,
// }: {
//   className: string;
//   children: React.ReactNode;
//   outlined?: boolean;
// }) {
//   const label = String(children);
//   return (
//     <span
//       className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${className} ${
//         outlined ? (RING_STYLES[label] ?? "") : ""
//       }`}
//     >
//       {children}
//     </span>
//   );
// }

// function Avatar({ text }: { text: string }) {
//   return (
//     <span
//       aria-hidden="true"
//       className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-indigo-500 text-xs font-semibold text-white"
//     >
//       {text}
//     </span>
//   );
// }

// const iconProps = {
//   fill: "none",
//   stroke: "currentColor",
//   strokeWidth: 2,
//   strokeLinecap: "round" as const,
//   strokeLinejoin: "round" as const,
//   "aria-hidden": true,
// };

// function IconDots() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       className="h-[18px] w-[18px]"
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <circle cx="5" cy="12" r="1.6" />
//       <circle cx="12" cy="12" r="1.6" />
//       <circle cx="19" cy="12" r="1.6" />
//     </svg>
//   );
// }
// function IconClose() {
//   return (
//     <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
//       <path d="M18 6 6 18M6 6l12 12" />
//     </svg>
//   );
// }
// function IconDownload() {
//   return (
//     <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
//       <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
//     </svg>
//   );
// }
// function IconChevron({ dir }: { dir: "left" | "right" }) {
//   return (
//     <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
//       <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
//     </svg>
//   );
// }

// function DetailRow({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-xs last:border-b-0">
//       <dt className="shrink-0 text-slate-500">{label}</dt>
//       <dd className="min-w-0 break-words text-right font-medium text-slate-800">
//         {children}
//       </dd>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Main component                                                      */
// /* ------------------------------------------------------------------ */

// export default function UserManagement({
//   businesses = DEMO_BUSINESSES,
//   pageSize = 10,
//   initialPage = 2,
//   onDelete,
//   onStatusChange,
//   onDownloadQr,
// }: UserManagementProps) {
//   const [items, setItems] = useState<Business[]>(businesses);
//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState<Filter>("All");
//   const [page, setPage] = useState(initialPage);

//   const [open, setOpen] = useState(false);
//   const [activeId, setActiveId] = useState<string | null>(null);
//   const [confirmingDelete, setConfirmingDelete] = useState(false);

//   const panelRef = useRef<HTMLElement | null>(null);
//   const closeBtnRef = useRef<HTMLButtonElement | null>(null);
//   const triggerRef = useRef<HTMLElement | null>(null);
//   const lastActiveRef = useRef<Business | null>(null);

//   useEffect(() => {
//     setItems(businesses);
//   }, [businesses]);

//   /* ---------- filtering & pagination ---------- */

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return items.filter((b) => {
//       if (filter !== "All" && b.subscription !== filter) return false;
//       if (!q) return true;
//       return (
//         b.name.toLowerCase().includes(q) ||
//         b.owner.toLowerCase().includes(q) ||
//         b.email.toLowerCase().includes(q)
//       );
//     });
//   }, [items, query, filter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentPage = Math.min(page, totalPages);
//   const pageRows = filtered.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   const handleQuery = (value: string) => {
//     setQuery(value);
//     setPage(1);
//   };
//   const handleFilter = (value: Filter) => {
//     setFilter(value);
//     setPage(1);
//   };
//   const clearFilters = () => {
//     setQuery("");
//     setFilter("All");
//     setPage(1);
//   };

//   /* ---------- drawer ---------- */

//   const found = items.find((b) => b.id === activeId) ?? null;
//   if (found) lastActiveRef.current = found;
//   const active = found ?? lastActiveRef.current;

//   const openDrawer = (id: string) => {
//     triggerRef.current = document.activeElement as HTMLElement | null;
//     setActiveId(id);
//     setConfirmingDelete(false);
//     setOpen(true);
//   };

//   const closeDrawer = useCallback(() => {
//     setOpen(false);
//     setConfirmingDelete(false);
//   }, []);

//   useEffect(() => {
//     if (!open) return;

//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         closeDrawer();
//         return;
//       }
//       if (e.key !== "Tab" || !panelRef.current) return;
//       const focusable = panelRef.current.querySelectorAll<HTMLElement>(
//         "a[href], button:not([disabled])",
//       );
//       if (!focusable.length) return;
//       const first = focusable[0];
//       const last = focusable[focusable.length - 1];
//       if (e.shiftKey && document.activeElement === first) {
//         e.preventDefault();
//         last.focus();
//       } else if (!e.shiftKey && document.activeElement === last) {
//         e.preventDefault();
//         first.focus();
//       }
//     };

//     document.addEventListener("keydown", onKeyDown);
//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     closeBtnRef.current?.focus();

//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//       document.body.style.overflow = previousOverflow;
//       triggerRef.current?.focus?.();
//     };
//   }, [open, closeDrawer]);

//   const handleSuspend = () => {
//     if (!active) return;
//     const next: AccountStatus =
//       active.status === "Suspended" ? "Active" : "Suspended";
//     setItems((prev) =>
//       prev.map((b) => (b.id === active.id ? { ...b, status: next } : b)),
//     );
//     onStatusChange?.(active, next);
//   };

//   const handleDelete = () => {
//     if (!active) return;
//     setItems((prev) => prev.filter((b) => b.id !== active.id));
//     onDelete?.(active);
//     closeDrawer();
//   };

//   /* ---------- render ---------- */

//   return (
//     <section className="w-full font-sans text-slate-900">
//       {/* Header */}
//       <header>
//         <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//           User Management
//         </h1>
//         <p className="mt-2 text-sm text-slate-500">
//           Manage users, roles, permissions, and account access from one place.
//         </p>
//       </header>

//       {/* Search + filters */}
//       <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
//         <div className="md:w-56 md:shrink-0">
//           <label htmlFor="um-search" className="sr-only">
//             Search businesses
//           </label>
//           <input
//             id="um-search"
//             type="search"
//             value={query}
//             onChange={(e) => handleQuery(e.target.value)}
//             placeholder="Search businesses..."
//             autoComplete="off"
//             className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
//           />
//         </div>

//         <div
//           role="group"
//           aria-label="Filter by subscription"
//           className="-mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
//         >
//           {FILTERS.map((f) => {
//             const selected = filter === f;
//             return (
//               <button
//                 key={f}
//                 type="button"
//                 aria-pressed={selected}
//                 onClick={() => handleFilter(f)}
//                 className={`h-9 shrink-0 rounded-lg border px-3.5 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
//                   selected
//                     ? "border-[#1f5eff] bg-[#1f5eff] text-white"
//                     : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
//                 }`}
//               >
//                 {f}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <p className="sr-only" role="status" aria-live="polite">
//         {filtered.length} {filtered.length === 1 ? "business" : "businesses"}{" "}
//         found
//       </p>

//       {/* Empty state */}
//       {filtered.length === 0 ? (
//         <div className="mt-6 flex flex-col items-center rounded-xl border border-slate-200/80 bg-white px-6 py-14 text-center">
//           <p className="text-sm font-medium text-slate-700">
//             No businesses match your search
//           </p>
//           <p className="mt-1 text-xs text-slate-500">
//             Try a different name or clear the filters.
//           </p>
//           <button
//             type="button"
//             onClick={clearFilters}
//             className="mt-4 h-9 rounded-lg bg-[#1f5eff] px-4 text-[13px] font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
//           >
//             Clear filters
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Desktop table */}
//           <div className="mt-6 hidden overflow-x-auto rounded-xl border border-slate-200/80 bg-white lg:block">
//             <table className="w-full min-w-[960px] text-left">
//               <thead>
//                 <tr className="text-xs font-normal text-slate-400">
//                   {[
//                     "Business Name",
//                     "Owner",
//                     "Country",
//                     "Plan",
//                     "Subscription",
//                     "Billing Date",
//                     "Joined",
//                     "Status",
//                   ].map((h) => (
//                     <th key={h} scope="col" className="px-4 py-4 font-normal">
//                       {h}
//                     </th>
//                   ))}
//                   <th scope="col" className="px-4 py-4 text-center font-normal">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageRows.map((b) => (
//                   <tr
//                     key={b.id}
//                     onClick={() => openDrawer(b.id)}
//                     className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50/80"
//                   >
//                     <td className="px-4 py-3.5">
//                       <div className="flex items-center gap-3">
//                         <Avatar text={b.initials ?? getInitials(b.name)} />
//                         <div className="min-w-0">
//                           <p className="text-[13px] font-medium text-slate-700">
//                             {b.name}
//                           </p>
//                           <p className="text-xs text-slate-400">{b.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
//                       {b.owner}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
//                       {b.country}
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <Badge className={PLAN_STYLES[b.plan]}>{b.plan}</Badge>
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <Badge className={SUBSCRIPTION_STYLES[b.subscription]}>
//                         {b.subscription}
//                       </Badge>
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
//                       {formatDate(b.billingDate)}
//                     </td>
//                     <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
//                       {formatDate(b.joinedDate)}
//                     </td>
//                     <td className="px-4 py-3.5">
//                       <Badge className={ACCOUNT_STYLES[b.status]}>
//                         {b.status}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-3.5 text-center">
//                       <button
//                         type="button"
//                         aria-label={`View details for ${b.name}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openDrawer(b.id);
//                         }}
//                         className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
//                       >
//                         <IconDots />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile / tablet cards */}
//           <ul className="mt-5 space-y-3 lg:hidden">
//             {pageRows.map((b) => (
//               <li key={b.id}>
//                 <button
//                   type="button"
//                   onClick={() => openDrawer(b.id)}
//                   aria-label={`View details for ${b.name}`}
//                   className="w-full rounded-xl border border-slate-200/80 bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 active:bg-slate-50"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Avatar text={b.initials ?? getInitials(b.name)} />
//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-medium text-slate-800">
//                         {b.name}
//                       </p>
//                       <p className="truncate text-xs text-slate-400">
//                         {b.email}
//                       </p>
//                     </div>
//                     <span className="text-slate-400">
//                       <IconDots />
//                     </span>
//                   </div>

//                   <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
//                     {[
//                       ["Owner", b.owner],
//                       ["Country", b.country],
//                       ["Billing date", formatDate(b.billingDate)],
//                       ["Joined", formatDate(b.joinedDate)],
//                     ].map(([label, value]) => (
//                       <div key={label} className="min-w-0">
//                         <dt className="text-slate-400">{label}</dt>
//                         <dd className="mt-0.5 truncate font-medium text-slate-700">
//                           {value}
//                         </dd>
//                       </div>
//                     ))}
//                   </dl>

//                   <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
//                     <Badge className={PLAN_STYLES[b.plan]}>{b.plan}</Badge>
//                     <Badge className={SUBSCRIPTION_STYLES[b.subscription]}>
//                       {b.subscription}
//                     </Badge>
//                     <Badge className={ACCOUNT_STYLES[b.status]}>
//                       {b.status}
//                     </Badge>
//                   </div>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}

//       {/* Pagination */}
//       {filtered.length > 0 && (
//         <nav
//           aria-label="Pagination"
//           className="mt-8 flex items-center justify-center gap-1.5 sm:gap-3"
//         >
//           <button
//             type="button"
//             aria-label="Previous page"
//             disabled={currentPage === 1}
//             onClick={() => setPage(currentPage - 1)}
//             className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-blue-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
//           >
//             <IconChevron dir="left" />
//           </button>

//           {getPageItems(currentPage, totalPages).map((item) =>
//             typeof item === "string" ? (
//               <span
//                 key={item}
//                 className="px-1 text-sm text-slate-400"
//                 aria-hidden="true"
//               >
//                 …
//               </span>
//             ) : (
//               <button
//                 key={item}
//                 type="button"
//                 aria-label={`Page ${item}`}
//                 aria-current={item === currentPage ? "page" : undefined}
//                 onClick={() => setPage(item)}
//                 className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:h-8 sm:min-w-8 ${
//                   item === currentPage
//                     ? "bg-[#1f5eff] font-medium text-white"
//                     : "text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 {item}
//               </button>
//             ),
//           )}

//           <button
//             type="button"
//             aria-label="Next page"
//             disabled={currentPage === totalPages}
//             onClick={() => setPage(currentPage + 1)}
//             className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-blue-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
//           >
//             <IconChevron dir="right" />
//           </button>
//         </nav>
//       )}

//       {/* Details drawer */}
//       <div
//         className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
//         aria-hidden={!open}
//       >
//         <div
//           onClick={closeDrawer}
//           className={`absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
//             open ? "opacity-100" : "opacity-0"
//           }`}
//         />

//         <aside
//           ref={panelRef}
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="um-drawer-title"
//           className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
//             open ? "visible translate-x-0" : "invisible translate-x-full"
//           }`}
//         >
//           {active && (
//             <>
//               <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5">
//                 <div className="min-w-0">
//                   <h2
//                     id="um-drawer-title"
//                     className="truncate text-lg font-semibold text-slate-900"
//                   >
//                     {active.name}
//                   </h2>
//                   <p className="mt-0.5 truncate text-xs text-slate-500">
//                     {active.email}
//                   </p>
//                 </div>
//                 <button
//                   ref={closeBtnRef}
//                   type="button"
//                   onClick={closeDrawer}
//                   aria-label="Close details"
//                   className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
//                 >
//                   <IconClose />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto px-5 py-5">
//                 <section aria-labelledby="um-business-info">
//                   <h3
//                     id="um-business-info"
//                     className="mb-1 text-xs font-semibold text-slate-800"
//                   >
//                     Business Information
//                   </h3>
//                   <dl>
//                     <DetailRow label="Owner">
//                       {active.details?.owner ?? active.owner}
//                     </DetailRow>
//                     <DetailRow label="Business Name">{active.name}</DetailRow>
//                     <DetailRow label="Business Type">
//                       {active.details?.type ?? "—"}
//                     </DetailRow>
//                     <DetailRow label="Business Address">
//                       {active.details?.address ?? "—"}
//                     </DetailRow>
//                     <DetailRow label="Phone">
//                       {active.details?.phone ?? "—"}
//                     </DetailRow>
//                     <DetailRow label="Business Email">
//                       {active.details?.email ?? active.email}
//                     </DetailRow>
//                     <DetailRow label="Country">{active.country}</DetailRow>
//                     <DetailRow label="GMB link">
//                       {active.details?.gmbLink ? (
//                         <a
//                           href={`https://${active.details.gmbLink}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="rounded hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
//                         >
//                           {active.details.gmbLink}
//                         </a>
//                       ) : (
//                         "—"
//                       )}
//                     </DetailRow>
//                     <DetailRow label="NFC QR Code">
//                       <button
//                         type="button"
//                         aria-label="Download NFC QR code"
//                         onClick={() => onDownloadQr?.(active)}
//                         className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
//                       >
//                         <IconDownload />
//                       </button>
//                     </DetailRow>
//                   </dl>
//                 </section>

//                 <section
//                   aria-labelledby="um-subscription-info"
//                   className="mt-7"
//                 >
//                   <h3
//                     id="um-subscription-info"
//                     className="mb-1 text-xs font-semibold text-slate-800"
//                   >
//                     Subscription Information
//                   </h3>
//                   <dl>
//                     <DetailRow label="Current Plan">{active.plan}</DetailRow>
//                     <DetailRow label="Subscription Status">
//                       <Badge
//                         className={SUBSCRIPTION_STYLES[active.subscription]}
//                         outlined
//                       >
//                         {active.subscription}
//                       </Badge>
//                     </DetailRow>
//                     <DetailRow label="Account Status">
//                       <Badge className={ACCOUNT_STYLES[active.status]} outlined>
//                         {active.status}
//                       </Badge>
//                     </DetailRow>
//                     <DetailRow label="Joined Date">
//                       {formatDate(
//                         active.details?.joinedDate ?? active.joinedDate,
//                       )}
//                     </DetailRow>
//                     <DetailRow label="Next Billing Date">
//                       {formatDate(
//                         active.details?.nextBillingDate ?? active.billingDate,
//                       )}
//                     </DetailRow>
//                   </dl>
//                 </section>
//               </div>

//               <div className="border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
//                 {confirmingDelete ? (
//                   <div className="space-y-3">
//                     <p className="text-xs text-slate-600" role="alert">
//                       Delete{" "}
//                       <span className="font-semibold">{active.name}</span>? This
//                       cannot be undone.
//                     </p>
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         type="button"
//                         onClick={() => setConfirmingDelete(false)}
//                         className="h-11 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 sm:h-10"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleDelete}
//                         className="h-11 rounded-lg bg-red-500 text-xs font-medium text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 sm:h-10"
//                       >
//                         Delete business
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-3">
//                     <button
//                       type="button"
//                       onClick={() => setConfirmingDelete(true)}
//                       className="h-11 rounded-lg border border-red-200 bg-red-100 text-xs font-medium text-red-500 transition hover:bg-red-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 sm:h-10"
//                     >
//                       Delete
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleSuspend}
//                       className="h-11 rounded-lg border border-amber-200 bg-amber-100 text-xs font-medium text-amber-600 transition hover:bg-amber-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 sm:h-10"
//                     >
//                       {active.status === "Suspended" ? "Reactivate" : "Suspend"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </aside>
//       </div>
//     </section>
//   );
// }
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ⚠️ Adjust these two import paths to match your project structure.
import {
  useDeleteBusinessProfileMutation,
  useDeleteUserAccountPermanentlyMutation,
  useGetAllUsersBusinessesQuery,
  useGetSingleBusinessProfileQuery,
  useGetSingleUserbyIDQuery,
  useSuspendOrActivateAccountMutation,
} from "@/redux/api/admin/userManagement/adminUserManagementlicApi";
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";

/* ------------------------------------------------------------------ */
/* Types (shaped after the API responses)                              */
/* ------------------------------------------------------------------ */

export type AccountStatus = "active" | "inactive" | "blocked";
type StatusFilter = "all" | AccountStatus;

export interface ApiSubscription {
  id: string;
  businessId: string;
  plan: string; // "GROWTH"
  status: string; // "ACTIVE"
  smsLimit?: number;
  smsUsed?: number;
  aiReplyLimit?: number;
  aiReplyUsed?: number;
  nfcCardsIncluded?: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface ApiBusiness {
  id: string;
  userId?: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string | null;
  logo?: string | null;
  rating?: number | null;
  userRatingsTotal?: number | null;
  googleReviewUrl?: string | null;
  googleMapsUrl?: string | null;
  nfcActive?: boolean;
  isOnboardingCompleted?: boolean;
  createdAt?: string;
  subscription?: ApiSubscription | null;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  /** Present on /user/me (and on list rows if the backend includes them). */
  businessId?: string | null;
  businesses?: ApiBusiness[];
  business?: ApiBusiness | null;
}

export interface UserManagementProps {
  pageSize?: number;
  initialPage?: number;
  onDelete?: (user: ApiUser) => void;
  onStatusChange?: (user: ApiUser, next: AccountStatus) => void;
  /** Called when the admin clicks the NFC QR download icon. */
  onDownloadQr?: (user: ApiUser, business?: ApiBusiness) => void;
}

type ToastState = { type: "success" | "error" | "info"; message: string };

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

// The list endpoint filters by *account* status (active | inactive | blocked).
const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

const ACCOUNT_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  blocked: "Suspended",
};

const ACCOUNT_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-600",
  inactive: "bg-slate-100 text-slate-600",
  blocked: "bg-amber-100 text-amber-600",
};

const ACCOUNT_RINGS: Record<string, string> = {
  active: "ring-1 ring-inset ring-green-200",
  inactive: "ring-1 ring-inset ring-slate-200",
  blocked: "ring-1 ring-inset ring-amber-200",
};

const PLAN_STYLES: Record<string, string> = {
  growth: "bg-purple-100 text-purple-600",
  starter: "bg-cyan-50 text-cyan-500",
  pro: "bg-blue-100 text-blue-600",
};

const SUBSCRIPTION_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-600",
  trial: "bg-sky-100 text-sky-600",
  cancelled: "bg-slate-100 text-slate-600",
  expired: "bg-orange-100 text-orange-500",
  "payment failed": "bg-red-100 text-red-500",
};

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-indigo-100 text-indigo-600",
  user: "bg-slate-100 text-slate-600",
};

const FALLBACK_BADGE = "bg-slate-100 text-slate-600";

function titleCase(value?: string | null): string {
  if (!value) return "—";
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeKey(value?: string | null): string {
  return (value ?? "").toLowerCase().replace(/[_-]+/g, " ").trim();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function safeHref(url?: string | null): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : undefined;
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return e?.data?.message ?? e?.error ?? e?.message ?? fallback;
}

/** Finds a business id on a user object, whichever shape the backend uses. */
function extractBusinessId(user?: Partial<ApiUser> | null): string | undefined {
  if (!user) return undefined;
  return (
    user.businessId ??
    user.businesses?.[0]?.id ??
    user.business?.id ??
    undefined
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Reads rows + pagination meta from the list response, tolerating a few shapes. */
function parseUsersResponse(res: any, limit: number) {
  const d = res?.data;
  const rows: ApiUser[] = Array.isArray(d)
    ? d
    : Array.isArray(d?.data)
      ? d.data
      : Array.isArray(d?.users)
        ? d.users
        : [];

  const meta = res?.meta ?? res?.pagination ?? d?.meta ?? d?.pagination ?? null;
  const total = toNumber(
    meta?.total ?? meta?.totalItems ?? meta?.totalCount ?? meta?.count,
  );
  let totalPages = toNumber(meta?.totalPages ?? meta?.totalPage ?? meta?.pages);
  if (!totalPages && total) totalPages = Math.ceil(total / limit);

  return { rows, total, totalPages };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function getPageItems(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | string)[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis-left");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis-right");
  items.push(total);
  return items;
}

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Badge({
  className,
  ring = "",
  children,
}: {
  className: string;
  ring?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${className} ${ring}`}
    >
      {children}
    </span>
  );
}

function AccountBadge({
  status,
  outlined = false,
}: {
  status: string;
  outlined?: boolean;
}) {
  const key = status.toLowerCase();
  return (
    <Badge
      className={ACCOUNT_STYLES[key] ?? FALLBACK_BADGE}
      ring={outlined ? (ACCOUNT_RINGS[key] ?? "") : ""}
    >
      {ACCOUNT_LABELS[key] ?? titleCase(status)}
    </Badge>
  );
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const [failed, setFailed] = useState(false);
  const showImage = !!image && !failed;
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-indigo-500 text-xs font-semibold text-white"
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconDots() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
    </svg>
  );
}
function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...iconProps}>
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-xs last:border-b-0">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium text-slate-800">
        {children}
      </dd>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded bg-slate-100 motion-reduce:animate-none ${className}`}
    />
  );
}

function ExternalLink({ href, label }: { href?: string; label: string }) {
  if (!href) return <>{label}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      {label}
    </a>
  );
}

function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  const tone =
    toast.type === "success"
      ? "bg-slate-900 text-white"
      : toast.type === "error"
        ? "bg-red-600 text-white"
        : "bg-slate-700 text-white";
  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg px-4 py-2.5 text-[13px] font-medium shadow-lg ${tone}`}
    >
      {toast.message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function UserManagement({
  pageSize = 10,
  initialPage = 1,
  onDelete,
  onStatusChange,
  onDownloadQr,
}: UserManagementProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(initialPage);

  const [open, setOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<ApiUser | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  /** userId -> businessId. Built from the cached /me profile and list rows. */
  const [businessIdCache, setBusinessIdCache] = useState<
    Record<string, string>
  >({});

  const panelRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const debouncedQuery = useDebouncedValue(query, 400);

  /* ---------- API: current admin profile (cached by RTK Query) ---------- */

  const meQuery = useGetMeProfileQuery(undefined);
  const me = (meQuery.data as { data?: ApiUser } | undefined)?.data;

  /* ---------- API: user list ---------- */

  const queryArgs = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: debouncedQuery.trim(),
      status: filter === "all" ? undefined : filter,
    }),
    [page, pageSize, debouncedQuery, filter],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllUsersBusinessesQuery(queryArgs);

  const { rows, total, totalPages } = useMemo(
    () => parseUsersResponse(data, pageSize),
    [data, pageSize],
  );

  const hasKnownPages = typeof totalPages === "number";
  const hasNext = hasKnownPages
    ? page < (totalPages as number)
    : rows.length >= pageSize;

  // If the last row of a page was deleted, step back a page.
  useEffect(() => {
    if (!isFetching && !isError && rows.length === 0 && page > 1) {
      setPage((p) => Math.max(1, p - 1));
    }
  }, [isFetching, isError, rows.length, page]);

  /* ---------- cache userId -> businessId ---------- */

  useEffect(() => {
    const next: Record<string, string> = {};
    if (me?.id) {
      const id = extractBusinessId(me);
      if (id) next[me.id] = id;
    }
    rows.forEach((u) => {
      const id = extractBusinessId(u);
      if (id) next[u.id] = id;
    });
    const keys = Object.keys(next);
    if (!keys.length) return;
    setBusinessIdCache((prev) =>
      keys.every((k) => prev[k] === next[k]) ? prev : { ...prev, ...next },
    );
  }, [me, rows]);

  /* ---------- API: selected user + business ---------- */

  const userQuery = useGetSingleUserbyIDQuery(activeUser?.id ?? "", {
    skip: !open || !activeUser,
  });
  const freshUser = (userQuery.currentData as { data?: ApiUser } | undefined)
    ?.data;

  // Priority: fresh single-user response > list row > snapshot taken on open.
  const active: ApiUser | null = useMemo(() => {
    if (!activeUser) return null;
    const listUser = rows.find((u) => u.id === activeUser.id);
    return { ...activeUser, ...listUser, ...freshUser };
  }, [activeUser, rows, freshUser]);

  const businessId = active
    ? (businessIdCache[active.id] ?? extractBusinessId(active))
    : undefined;

  const businessQuery = useGetSingleBusinessProfileQuery(businessId ?? "", {
    skip: !open || !businessId,
  });
  const fetchedBusiness = (
    businessQuery.currentData as { data?: ApiBusiness } | undefined
  )?.data;

  // Show cached data instantly while the full profile loads.
  const instantBusiness =
    active && me && active.id === me.id
      ? (me.businesses?.find((b) => b.id === businessId) ?? me.businesses?.[0])
      : active?.businesses?.[0];
  const business = fetchedBusiness ?? instantBusiness;
  const businessLoading = !!businessId && businessQuery.isFetching && !business;
  const subscription = business?.subscription ?? null;

  /* ---------- mutations ---------- */

  const [suspendOrActivate, { isLoading: isUpdatingStatus }] =
    useSuspendOrActivateAccountMutation();
  const [deleteBusiness, { isLoading: isDeletingBusiness }] =
    useDeleteBusinessProfileMutation();
  const [deleteUser, { isLoading: isDeletingUser }] =
    useDeleteUserAccountPermanentlyMutation();
  const busy = isUpdatingStatus || isDeletingBusiness || isDeletingUser;

  /* ---------- toast ---------- */

  const showToast = useCallback((type: ToastState["type"], message: string) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  /* ---------- filters & pagination handlers ---------- */

  const handleQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleFilter = (value: StatusFilter) => {
    setFilter(value);
    setPage(1);
  };
  const clearFilters = () => {
    setQuery("");
    setFilter("all");
    setPage(1);
  };

  /* ---------- drawer ---------- */

  const openDrawer = (user: ApiUser) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setActiveUser(user);
    setConfirmingDelete(false);
    setOpen(true);
  };

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setConfirmingDelete(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus?.();
    };
  }, [open, closeDrawer]);

  /* ---------- actions ---------- */

  // Admin accounts and the signed-in account can't be suspended or deleted here.
  const isProtected =
    !!active && (active.role === "admin" || active.id === me?.id);

  const handleToggleStatus = async () => {
    if (!active || isProtected) return;
    const next: AccountStatus =
      active.status === "blocked" ? "active" : "blocked";
    try {
      await suspendOrActivate({ userId: active.id, status: next }).unwrap();
      onStatusChange?.(active, next);
      showToast(
        "success",
        next === "blocked" ? "Account suspended" : "Account reactivated",
      );
    } catch (err) {
      showToast(
        "error",
        getErrorMessage(err, "Couldn't update the account status"),
      );
    }
  };

  const handleDelete = async () => {
    if (!active || isProtected) return;
    let businessDeleted = false;
    try {
      if (businessId) {
        await deleteBusiness(businessId).unwrap();
        businessDeleted = true;
      }
      await deleteUser(active.id).unwrap();
      setBusinessIdCache((prev) => {
        const { [active.id]: _removed, ...rest } = prev;
        void _removed;
        return rest;
      });
      onDelete?.(active);
      closeDrawer();
      showToast("success", `${active.name} was deleted`);
    } catch (err) {
      showToast(
        "error",
        businessDeleted
          ? `Business deleted, but the account couldn't be removed: ${getErrorMessage(err, "try again")}`
          : getErrorMessage(err, "Couldn't delete the account"),
      );
    }
  };

  const handleDownloadQr = () => {
    if (!active) return;
    if (onDownloadQr) onDownloadQr(active, business);
    else showToast("info", "QR download isn't connected yet");
  };

  /* ---------- render ---------- */

  const showSkeleton = isLoading;
  const showError = isError && !data;
  const isEmpty = !showSkeleton && !showError && rows.length === 0;
  const resultCount = total ?? rows.length;

  return (
    <section className="w-full font-sans text-slate-900">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          User Management
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage users, roles, permissions, and account access from one place.
        </p>
      </header>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-56 md:shrink-0">
          <label htmlFor="um-search" className="sr-only">
            Search users or businesses
          </label>
          <input
            id="um-search"
            type="search"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Search businesses..."
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by account status"
          className="-mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((f) => {
            const selected = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={selected}
                onClick={() => handleFilter(f.value)}
                className={`h-9 shrink-0 rounded-lg border px-3.5 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  selected
                    ? "border-[#1f5eff] bg-[#1f5eff] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {showSkeleton
          ? "Loading users"
          : `${resultCount} ${resultCount === 1 ? "user" : "users"} found`}
      </p>

      {/* Loading skeleton */}
      {showSkeleton && (
        <div
          className="mt-6 space-y-px overflow-hidden rounded-xl border border-slate-200/80 bg-white"
          aria-busy="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="h-8 w-8 shrink-0 rounded-[10px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="hidden h-5 w-16 rounded-full lg:block" />
              <Skeleton className="hidden h-5 w-20 rounded-full lg:block" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {showError && (
        <div
          role="alert"
          className="mt-6 flex flex-col items-center rounded-xl border border-red-100 bg-red-50/60 px-6 py-12 text-center"
        >
          <p className="text-sm font-medium text-red-600">
            Couldn&apos;t load users
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {getErrorMessage(error, "Check your connection and try again.")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 h-9 rounded-lg bg-[#1f5eff] px-4 text-[13px] font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-slate-200/80 bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-700">
            No users match your search
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try a different name or clear the filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 h-9 rounded-lg bg-[#1f5eff] px-4 text-[13px] font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Results */}
      {!showSkeleton && !showError && rows.length > 0 && (
        <div
          aria-busy={isFetching}
          className={`transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
        >
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-slate-200/80 bg-white lg:block">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="text-xs font-normal text-slate-400">
                  {[
                    "User",
                    "Role",
                    "Verified",
                    "Joined",
                    "Last Updated",
                    "Status",
                  ].map((h) => (
                    <th key={h} scope="col" className="px-4 py-4 font-normal">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-4 text-center font-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => openDrawer(u)}
                    className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} image={u.image} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-slate-700">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={ROLE_STYLES[u.role] ?? FALLBACK_BADGE}>
                        {titleCase(u.role)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        className={
                          u.isVerified
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-500"
                        }
                      >
                        {u.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600">
                      {formatDate(u.updatedAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <AccountBadge status={u.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        aria-label={`View details for ${u.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDrawer(u);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                      >
                        <IconDots />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <ul className="mt-5 space-y-3 lg:hidden">
            {rows.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => openDrawer(u)}
                  aria-label={`View details for ${u.name}`}
                  className="w-full rounded-xl border border-slate-200/80 bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 active:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} image={u.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {u.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {u.email}
                      </p>
                    </div>
                    <span className="text-slate-400">
                      <IconDots />
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    {[
                      ["Joined", formatDate(u.createdAt)],
                      ["Last updated", formatDate(u.updatedAt)],
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="text-slate-400">{label}</dt>
                        <dd className="mt-0.5 truncate font-medium text-slate-700">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <Badge className={ROLE_STYLES[u.role] ?? FALLBACK_BADGE}>
                      {titleCase(u.role)}
                    </Badge>
                    <Badge
                      className={
                        u.isVerified
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-500"
                      }
                    >
                      {u.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <AccountBadge status={u.status} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {!showSkeleton && !showError && (rows.length > 0 || page > 1) && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-center gap-1.5 sm:gap-3"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-blue-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
          >
            <IconChevron dir="left" />
          </button>

          {hasKnownPages ? (
            getPageItems(page, totalPages as number).map((item) =>
              typeof item === "string" ? (
                <span
                  key={item}
                  className="px-1 text-sm text-slate-400"
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                  onClick={() => setPage(item)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:h-8 sm:min-w-8 ${
                    item === page
                      ? "bg-[#1f5eff] font-medium text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ),
            )
          ) : (
            // The backend didn't send page totals, so show the current page only.
            <span
              aria-current="page"
              className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#1f5eff] px-2 text-sm font-medium text-white sm:h-8 sm:min-w-8"
            >
              {page}
            </span>
          )}

          <button
            type="button"
            aria-label="Next page"
            disabled={!hasNext || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200/70 text-blue-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
          >
            <IconChevron dir="right" />
          </button>
        </nav>
      )}

      {/* Details drawer */}
      <div
        className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="um-drawer-title"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
            open ? "visible translate-x-0" : "invisible translate-x-full"
          }`}
        >
          {active && (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5">
                <div className="min-w-0">
                  <h2
                    id="um-drawer-title"
                    className="truncate text-lg font-semibold text-slate-900"
                  >
                    {business?.name ?? active.name}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {active.email}
                  </p>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close details"
                  className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <IconClose />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <section aria-labelledby="um-business-info">
                  <h3
                    id="um-business-info"
                    className="mb-1 text-xs font-semibold text-slate-800"
                  >
                    Business Information
                  </h3>

                  {businessLoading ? (
                    <div className="space-y-4 py-3" aria-busy="true">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex justify-between gap-6">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      ))}
                    </div>
                  ) : business ? (
                    <dl>
                      <DetailRow label="Owner">{active.name}</DetailRow>
                      <DetailRow label="Business Name">
                        {business.name}
                      </DetailRow>
                      <DetailRow label="Business Type">
                        {business.category ?? "—"}
                      </DetailRow>
                      <DetailRow label="Business Address">
                        {business.address ?? "—"}
                      </DetailRow>
                      <DetailRow label="Phone">
                        {business.phone ?? "—"}
                      </DetailRow>
                      <DetailRow label="Business Email">
                        {active.email}
                      </DetailRow>
                      <DetailRow label="Website">
                        {business.website ? (
                          <ExternalLink
                            href={safeHref(business.website)}
                            label={stripProtocol(business.website)}
                          />
                        ) : (
                          "—"
                        )}
                      </DetailRow>
                      <DetailRow label="Rating">
                        {typeof business.rating === "number"
                          ? `${business.rating.toFixed(1)} (${(business.userRatingsTotal ?? 0).toLocaleString("en-US")} reviews)`
                          : "—"}
                      </DetailRow>
                      <DetailRow label="GMB link">
                        {business.googleReviewUrl ? (
                          <ExternalLink
                            href={safeHref(business.googleReviewUrl)}
                            label={stripProtocol(business.googleReviewUrl)}
                          />
                        ) : (
                          "—"
                        )}
                      </DetailRow>
                      <DetailRow label="NFC QR Code">
                        <button
                          type="button"
                          aria-label="Download NFC QR code"
                          onClick={handleDownloadQr}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                        >
                          <IconDownload />
                        </button>
                      </DetailRow>
                    </dl>
                  ) : (
                    <p className="py-3 text-xs text-slate-500">
                      {businessQuery.isError
                        ? getErrorMessage(
                            businessQuery.error,
                            "Couldn't load the business profile.",
                          )
                        : "No business profile is linked to this account yet."}
                    </p>
                  )}
                </section>

                <section
                  aria-labelledby="um-subscription-info"
                  className="mt-7"
                >
                  <h3
                    id="um-subscription-info"
                    className="mb-1 text-xs font-semibold text-slate-800"
                  >
                    Subscription Information
                  </h3>
                  <dl>
                    <DetailRow label="Current Plan">
                      {subscription ? titleCase(subscription.plan) : "—"}
                    </DetailRow>
                    <DetailRow label="Subscription Status">
                      {subscription ? (
                        <Badge
                          className={
                            SUBSCRIPTION_STYLES[
                              normalizeKey(subscription.status)
                            ] ?? FALLBACK_BADGE
                          }
                        >
                          {titleCase(subscription.status)}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </DetailRow>
                    <DetailRow label="Account Status">
                      <AccountBadge status={active.status} outlined />
                    </DetailRow>
                    <DetailRow label="Joined Date">
                      {formatDate(active.createdAt)}
                    </DetailRow>
                    <DetailRow label="Next Billing Date">
                      {formatDate(subscription?.currentPeriodEnd)}
                    </DetailRow>
                    {subscription && (
                      <>
                        <DetailRow label="SMS Usage">
                          {(subscription.smsUsed ?? 0).toLocaleString("en-US")}{" "}
                          /{" "}
                          {(subscription.smsLimit ?? 0).toLocaleString("en-US")}
                        </DetailRow>
                        <DetailRow label="AI Replies">
                          {(subscription.aiReplyUsed ?? 0).toLocaleString(
                            "en-US",
                          )}{" "}
                          /{" "}
                          {(subscription.aiReplyLimit ?? 0).toLocaleString(
                            "en-US",
                          )}
                        </DetailRow>
                      </>
                    )}
                  </dl>
                </section>
              </div>

              <div className="border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {isProtected ? (
                  <p className="text-center text-xs text-slate-500">
                    {active.role === "admin"
                      ? "Admin accounts can't be suspended or deleted here."
                      : "You can't suspend or delete your own account."}
                  </p>
                ) : confirmingDelete ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600" role="alert">
                      Delete{" "}
                      <span className="font-semibold">{active.name}</span>
                      {businessId ? " and their business profile" : ""}? This
                      cannot be undone.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmingDelete(false)}
                        className="h-11 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handleDelete}
                        className="h-11 rounded-lg bg-red-500 text-xs font-medium text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10"
                      >
                        {isDeletingBusiness || isDeletingUser
                          ? "Deleting…"
                          : "Delete permanently"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmingDelete(true)}
                      className="h-11 rounded-lg border border-red-200 bg-red-100 text-xs font-medium text-red-500 transition hover:bg-red-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleToggleStatus}
                      className="h-11 rounded-lg border border-amber-200 bg-amber-100 text-xs font-medium text-amber-600 transition hover:bg-amber-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10"
                    >
                      {isUpdatingStatus
                        ? "Saving…"
                        : active.status === "blocked"
                          ? "Reactivate"
                          : "Suspend"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      <Toast toast={toast} />
    </section>
  );
}
