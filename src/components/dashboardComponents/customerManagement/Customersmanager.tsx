// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   Star,
//   TrendingUp,
//   Calendar,
//   Lightbulb,
//   Plus,
//   Copy,
//   Check,
//   MoreHorizontal,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Search,
// } from "lucide-react";

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// type ReviewStatus = "Review Received" | "Review Requested" | "Not Requested";

// interface Customer {
//   id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   location: string;
//   lastInteraction: string;
//   status: ReviewStatus;
// }

// type FilterKey = "All" | ReviewStatus;

// /* ------------------------------------------------------------------ */
// /*  Mock data (replace with real data / API results)                  */
// /* ------------------------------------------------------------------ */

// const INITIAL_CUSTOMERS: Customer[] = [
//   {
//     id: "1",
//     firstName: "Sarah",
//     lastName: "Mitchell",
//     phone: "+1 (555) 201-4892",
//     email: "sarah.m@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Sep 13, 2026",
//     status: "Review Received",
//   },
//   {
//     id: "2",
//     firstName: "James",
//     lastName: "Donovan",
//     phone: "+1 (555) 315-6728",
//     email: "james.d@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Oct 2, 2026",
//     status: "Review Requested",
//   },
//   {
//     id: "3",
//     firstName: "Alicia",
//     lastName: "Lopez",
//     phone: "+1 (555) 427-8391",
//     email: "alicia.l@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Sep 28, 2026",
//     status: "Not Requested",
//   },
//   {
//     id: "4",
//     firstName: "Michael",
//     lastName: "Kim",
//     phone: "+1 (555) 672-1045",
//     email: "michael.k@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Oct 8, 2026",
//     status: "Review Requested",
//   },
//   {
//     id: "5",
//     firstName: "Rebecca",
//     lastName: "Tran",
//     phone: "+1 (555) 983-2047",
//     email: "rebecca.t@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Sep 30, 2026",
//     status: "Not Requested",
//   },
//   {
//     id: "6",
//     firstName: "Carlos",
//     lastName: "Perez",
//     phone: "+1 (555) 746-8293",
//     email: "carlos.p@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Oct 5, 2026",
//     status: "Review Received",
//   },
//   {
//     id: "7",
//     firstName: "Emily",
//     lastName: "Larson",
//     phone: "+1 (555) 439-1827",
//     email: "emily.l@email.com",
//     location: "Dhaka, Bangladesh",
//     lastInteraction: "Sep 25, 2026",
//     status: "Not Requested",
//   },
// ];

// const PAGE_SIZE = 7;
// const TOTAL_PAGES = 5;

// /* ------------------------------------------------------------------ */
// /*  Small helpers                                                      */
// /* ------------------------------------------------------------------ */

// function initials(first: string, last: string) {
//   return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
// }

// function avatarColor(seed: string) {
//   const palette = [
//     "bg-indigo-600",
//     "bg-blue-600",
//     "bg-violet-600",
//     "bg-sky-600",
//     "bg-purple-600",
//   ];
//   const idx = seed.charCodeAt(0) % palette.length;
//   return palette[idx];
// }

// function statusStyles(status: ReviewStatus) {
//   switch (status) {
//     case "Review Received":
//       return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
//     case "Review Requested":
//       return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
//     case "Not Requested":
//     default:
//       return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
//   }
// }

// /* ------------------------------------------------------------------ */
// /*  Stat card                                                          */
// /* ------------------------------------------------------------------ */

// interface StatCardProps {
//   icon: React.ReactNode;
//   value: string | number;
//   label: string;
//   delta: string;
// }

// function StatCard({ icon, value, label, delta }: StatCardProps) {
//   return (
//     <div className="min-w-[150px] flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
//       <div className="flex items-start justify-between">
//         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
//           {icon}
//         </div>
//         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
//           {delta}
//         </span>
//       </div>
//       <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
//         {value}
//       </div>
//       <div className="mt-1 text-sm text-slate-500">{label}</div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Add Customer modal                                                 */
// /* ------------------------------------------------------------------ */

// interface AddCustomerModalProps {
//   open: boolean;
//   onClose: () => void;
//   onAdd: (c: Omit<Customer, "id" | "lastInteraction" | "status">) => void;
// }

// function AddCustomerModal({ open, onClose, onAdd }: AddCustomerModalProps) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   if (!open) return null;

//   const reset = () => {
//     setFirstName("");
//     setLastName("");
//     setPhone("");
//     setEmail("");
//     setError(null);
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const handleSubmit = () => {
//     if (!firstName.trim() || !lastName.trim()) {
//       setError("First and last name are required.");
//       return;
//     }
//     if (!phone.trim() && !email.trim()) {
//       setError("Provide a phone number or an email address.");
//       return;
//     }
//     onAdd({
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       phone: phone.trim(),
//       email: email.trim(),
//       location: "Dhaka, Bangladesh",
//     });
//     reset();
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="add-customer-title"
//       onClick={handleClose}
//     >
//       <div
//         className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-7"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="mb-5 flex items-start justify-between">
//           <div>
//             <h2
//               id="add-customer-title"
//               className="text-lg font-semibold text-slate-900"
//             >
//               Add Customer
//             </h2>
//           </div>
//           <button
//             type="button"
//             onClick={handleClose}
//             aria-label="Close"
//             className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="mb-5">
//           <h3 className="text-sm font-medium text-slate-900">
//             Customer Information
//           </h3>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Enter the customer&apos;s contact details.
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div>
//               <label
//                 htmlFor="firstName"
//                 className="mb-1.5 block text-sm font-medium text-slate-700"
//               >
//                 First Name
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 placeholder="e.g. Sarah"
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="lastName"
//                 className="mb-1.5 block text-sm font-medium text-slate-700"
//               >
//                 Last Name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 placeholder="e.g. Mitchell"
//                 className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="phone"
//               className="mb-1.5 block text-sm font-medium text-slate-700"
//             >
//               Phone Number
//             </label>
//             <input
//               id="phone"
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="+1 (555) 000-0000"
//               className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//             <p className="mt-1.5 text-xs text-slate-500">
//               Required if no email is provided. Used for SMS review requests.
//             </p>
//           </div>

//           <div>
//             <label
//               htmlFor="email"
//               className="mb-1.5 block text-sm font-medium text-slate-700"
//             >
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="customer@email.com"
//               className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//             <p className="mt-1.5 text-xs text-slate-500">
//               Required if no phone is provided. Used for Email review requests.
//             </p>
//           </div>

//           {error && (
//             <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
//               {error}
//             </p>
//           )}

//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:bg-blue-800"
//           >
//             <Plus className="h-4 w-4" />
//             Add Customer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Copy link button                                                   */
// /* ------------------------------------------------------------------ */

// function CopyLinkButton({ enabled, id }: { enabled: boolean; id: string }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     if (!enabled) return;
//     try {
//       await navigator.clipboard.writeText(
//         `https://reviews.example.com/r/${id}`,
//       );
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     } catch {
//       // clipboard unavailable — ignore silently
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleCopy}
//       disabled={!enabled}
//       className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
//         enabled
//           ? "border-blue-200 text-blue-700 hover:bg-blue-50 active:bg-blue-100"
//           : "cursor-not-allowed border-slate-200 text-slate-300"
//       }`}
//     >
//       {copied ? (
//         <Check className="h-3.5 w-3.5" />
//       ) : (
//         <Copy className="h-3.5 w-3.5" />
//       )}
//       {copied ? "Copied" : "Copy link"}
//     </button>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Main component                                                     */
// /* ------------------------------------------------------------------ */

// export default function CustomersManager() {
//   const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
//   const [filter, setFilter] = useState<FilterKey>("All");
//   const [query, setQuery] = useState("");
//   const [page, setPage] = useState(2); // matches the reference screenshot
//   const [modalOpen, setModalOpen] = useState(false);
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);

//   const filters: FilterKey[] = [
//     "All",
//     "Review Received",
//     "Review Requested",
//     "Not Requested",
//   ];

//   const filteredCustomers = useMemo(() => {
//     return customers.filter((c) => {
//       const matchesFilter = filter === "All" || c.status === filter;
//       const q = query.trim().toLowerCase();
//       const matchesQuery =
//         q.length === 0 ||
//         `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
//         c.email.toLowerCase().includes(q) ||
//         c.phone.toLowerCase().includes(q);
//       return matchesFilter && matchesQuery;
//     });
//   }, [customers, filter, query]);

//   const handleAddCustomer = (
//     data: Omit<Customer, "id" | "lastInteraction" | "status">,
//   ) => {
//     const newCustomer: Customer = {
//       ...data,
//       id: `${Date.now()}`,
//       lastInteraction: "—",
//       status: "Not Requested",
//     };
//     setCustomers((prev) => [newCustomer, ...prev]);
//     setFilter("All");
//     setPage(1);
//   };

//   return (
//     <div className="min-h-full w-full">
//       <div className="">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//               Customers
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Organize customer information and track interactions, review
//               requests, and activity in one place.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => setModalOpen(true)}
//             className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:bg-blue-800"
//           >
//             <Plus className="h-4 w-4" />
//             Add Customer
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="mb-6 flex flex-wrap gap-4">
//           <StatCard
//             icon={<Star className="h-4.5 w-4.5" />}
//             value={248}
//             label="Total Customers"
//             delta="0.2 pts"
//           />
//           <StatCard
//             icon={<TrendingUp className="h-4.5 w-4.5" />}
//             value={89}
//             label="Review Received"
//             delta="34 new"
//           />
//           <StatCard
//             icon={<Calendar className="h-4.5 w-4.5" />}
//             value={114}
//             label="Review Requested"
//             delta="12% vs Aug"
//           />
//           <StatCard
//             icon={<Lightbulb className="h-4.5 w-4.5" />}
//             value={45}
//             label="Not Requested"
//             delta="3.5pts"
//           />
//         </div>

//         {/* Panel */}
//         <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* Toolbar */}
//           <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
//             <div className="relative w-full sm:max-w-xs">
//               <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => {
//                   setQuery(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search customers..."
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
//               />
//             </div>

//             <div className="flex items-center justify-between gap-3 sm:justify-end">
//               <div className="flex flex-1 gap-1.5 overflow-x-auto rounded-xl bg-slate-50 p-1 sm:flex-none sm:bg-transparent sm:p-0">
//                 {filters.map((f) => {
//                   const active = filter === f;
//                   return (
//                     <button
//                       key={f}
//                       type="button"
//                       onClick={() => {
//                         setFilter(f);
//                         setPage(1);
//                       }}
//                       className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition sm:border sm:px-3.5 sm:py-2 sm:text-sm ${
//                         active
//                           ? "bg-blue-600 text-white shadow-sm sm:border-blue-600"
//                           : "text-slate-600 hover:bg-white sm:border-slate-200 sm:hover:bg-slate-50"
//                       }`}
//                     >
//                       {f}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-end px-4 pt-3 text-xs text-slate-500 sm:px-5">
//             {filteredCustomers.length} customer
//             {filteredCustomers.length === 1 ? "" : "s"}
//           </div>

//           {/* Desktop table */}
//           <div className="hidden overflow-x-auto lg:block">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="text-xs font-medium text-slate-500">
//                   <th className="px-5 py-3 font-medium">Customer</th>
//                   <th className="px-5 py-3 font-medium">Phone / Email</th>
//                   <th className="px-5 py-3 font-medium">Location</th>
//                   <th className="px-5 py-3 font-medium">Last Interaction</th>
//                   <th className="px-5 py-3 font-medium">Review Status</th>
//                   <th className="px-5 py-3 font-medium">QuickSend</th>
//                   <th className="px-5 py-3 text-right font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCustomers.map((c) => (
//                   <tr
//                     key={c.id}
//                     className="border-t border-slate-100 transition hover:bg-slate-50/60"
//                   >
//                     <td className="px-5 py-3.5">
//                       <div className="flex items-center gap-3">
//                         <span
//                           className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(c.firstName)}`}
//                         >
//                           {initials(c.firstName, c.lastName)}
//                         </span>
//                         <span className="text-sm font-medium text-slate-900">
//                           {c.firstName} {c.lastName}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <div className="text-sm text-slate-900">{c.phone}</div>
//                       <div className="text-xs text-slate-500">{c.email}</div>
//                     </td>
//                     <td className="px-5 py-3.5 text-sm text-slate-600">
//                       {c.location}
//                     </td>
//                     <td className="px-5 py-3.5 text-sm text-slate-600">
//                       {c.lastInteraction}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <span
//                         className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles(c.status)}`}
//                       >
//                         {c.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <CopyLinkButton
//                         enabled={c.status !== "Review Received"}
//                         id={c.id}
//                       />
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <div className="relative flex justify-end">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setOpenMenuId(openMenuId === c.id ? null : c.id)
//                           }
//                           aria-label="More actions"
//                           className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
//                         >
//                           <MoreHorizontal className="h-4.5 w-4.5" />
//                         </button>
//                         {openMenuId === c.id && (
//                           <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
//                             <button
//                               className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
//                               onClick={() => setOpenMenuId(null)}
//                             >
//                               View profile
//                             </button>
//                             <button
//                               className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
//                               onClick={() => setOpenMenuId(null)}
//                             >
//                               Edit customer
//                             </button>
//                             <button
//                               className="block w-full px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                               onClick={() => setOpenMenuId(null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {filteredCustomers.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="px-5 py-14 text-center text-sm text-slate-500"
//                     >
//                       No customers match your search or filter.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile / tablet cards */}
//           <div className="divide-y divide-slate-100 lg:hidden">
//             {filteredCustomers.map((c) => (
//               <div key={c.id} className="p-4 sm:p-5">
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-3">
//                     <span
//                       className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(c.firstName)}`}
//                     >
//                       {initials(c.firstName, c.lastName)}
//                     </span>
//                     <div>
//                       <div className="text-sm font-medium text-slate-900">
//                         {c.firstName} {c.lastName}
//                       </div>
//                       <div className="text-xs text-slate-500">{c.location}</div>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setOpenMenuId(openMenuId === c.id ? null : c.id)
//                       }
//                       aria-label="More actions"
//                       className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
//                     >
//                       <MoreHorizontal className="h-4.5 w-4.5" />
//                     </button>
//                     {openMenuId === c.id && (
//                       <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
//                         <button
//                           className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
//                           onClick={() => setOpenMenuId(null)}
//                         >
//                           View profile
//                         </button>
//                         <button
//                           className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
//                           onClick={() => setOpenMenuId(null)}
//                         >
//                           Edit customer
//                         </button>
//                         <button
//                           className="block w-full px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
//                           onClick={() => setOpenMenuId(null)}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
//                   <div>
//                     <div className="text-slate-400">Phone</div>
//                     <div className="mt-0.5 text-slate-700">{c.phone}</div>
//                   </div>
//                   <div>
//                     <div className="text-slate-400">Email</div>
//                     <div className="mt-0.5 truncate text-slate-700">
//                       {c.email}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-slate-400">Last Interaction</div>
//                     <div className="mt-0.5 text-slate-700">
//                       {c.lastInteraction}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-slate-400">Status</div>
//                     <span
//                       className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles(c.status)}`}
//                     >
//                       {c.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <CopyLinkButton
//                     enabled={c.status !== "Review Received"}
//                     id={c.id}
//                   />
//                 </div>
//               </div>
//             ))}

//             {filteredCustomers.length === 0 && (
//               <div className="px-5 py-14 text-center text-sm text-slate-500">
//                 No customers match your search or filter.
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 p-4 sm:p-5">
//             <button
//               type="button"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               aria-label="Previous page"
//               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </button>

//             {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 type="button"
//                 onClick={() => setPage(p)}
//                 className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
//                   p === page
//                     ? "bg-blue-600 text-white shadow-sm"
//                     : "text-slate-600 hover:bg-slate-100"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}

//             <button
//               type="button"
//               onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
//               disabled={page === TOTAL_PAGES}
//               aria-label="Next page"
//               className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <AddCustomerModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onAdd={handleAddCustomer}
//       />
//     </div>
//   );
// }
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  FileUp,
  Loader2,
  Mail,
  MessageSquare,
  MousePointerClick,
  Nfc,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Star,
  Trash2,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";

// ⚠️ Adjust this import path to wherever your customerApi file lives
import {
  useAddCustomerEmailMutation,
  useAddCustomerSMSMutation,
  useBulkImportCustomersMutation,
  useDeleteCustomerMutation,
  useGetAllCustomerQuery,
  useGetCustomerStatsQuery,
  useResendRequestCustomerMutation,
} from "@/redux/api/userDashboard/customer/customerApi";
// ⚠️ Adjust this import path to wherever your profile API lives
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type InviteStatus =
  "PENDING" | "SENT" | "DELIVERED" | "CLICKED" | "REVIEWED" | "FAILED";

type Channel = "SMS" | "EMAIL" | "NFC" | "QR";

interface Invite {
  id: string;
  businessId: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  channel: Channel;
  status: InviteStatus;
  shortCode: string;
  customMessage: string | null;
  feedbackRating: number | null;
  feedbackComment: string | null;
  sentAt: string | null;
  clickedAt: string | null;
  reviewedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  business?: { id: string; name: string; logo?: string | null };
  reviewUrl: string;
}

interface Business {
  id: string;
  name: string;
  logo?: string | null;
  defaultRequestChannel?: Channel;
  subscription?: {
    plan: string;
    smsLimit: number;
    smsUsed: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                */
/* ------------------------------------------------------------------ */

const STATUS_OPTIONS: { value: InviteStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "SENT", label: "Sent" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CLICKED", label: "Clicked" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "FAILED", label: "Failed" },
];

const CHANNEL_OPTIONS: { value: Channel | ""; label: string }[] = [
  { value: "", label: "All channels" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
  { value: "NFC", label: "NFC" },
  { value: "QR", label: "QR code" },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const DEFAULT_MESSAGE =
  "Thank you for visiting! We'd love your feedback. Would you mind leaving us a quick review?";

const STATUS_STYLE: Record<InviteStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600 ring-slate-200",
  SENT: "bg-blue-50 text-blue-700 ring-blue-200",
  DELIVERED: "bg-sky-50 text-sky-700 ring-sky-200",
  CLICKED: "bg-amber-50 text-amber-700 ring-amber-200",
  REVIEWED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
};

const STATUS_DOT: Record<InviteStatus, string> = {
  PENDING: "bg-slate-400",
  SENT: "bg-blue-500",
  DELIVERED: "bg-sky-500",
  CLICKED: "bg-amber-500",
  REVIEWED: "bg-emerald-500",
  FAILED: "bg-red-500",
};

const AVATAR_PALETTE = [
  "bg-indigo-600",
  "bg-blue-600",
  "bg-violet-600",
  "bg-sky-600",
  "bg-purple-600",
  "bg-teal-600",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function titleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorMessage(
  err: any,
  fallback = "Something went wrong. Please try again.",
) {
  return err?.data?.message || err?.error || err?.message || fallback;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Page numbers with ellipsis, e.g. [1, "…", 4, 5, 6, "…", 12] */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

/* ------------------------------------------------------------------ */
/*  Small UI pieces                                                    */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: InviteStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[status] ?? STATUS_STYLE.PENDING}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.PENDING}`}
      />
      {titleCase(status)}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: Channel }) {
  const Icon =
    channel === "SMS"
      ? MessageSquare
      : channel === "EMAIL"
        ? Mail
        : channel === "NFC"
          ? Nfc
          : QrCode;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      {channel === "EMAIL" ? "Email" : channel}
    </span>
  );
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-slate-300">—</span>;
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </span>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-35 ${
        tone === "danger"
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

interface ToastState {
  type: "success" | "error";
  message: string;
}

function Toast({
  toast,
  onClose,
}: {
  toast: ToastState | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:bottom-6">
      <div
        role="status"
        className={`pointer-events-auto flex max-w-md items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${
          ok ? "bg-slate-900" : "bg-red-600"
        }`}
      >
        {ok ? (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="-mr-1 ml-1 rounded p-0.5 text-white/60 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal shell                                                        */
/* ------------------------------------------------------------------ */

function Modal({
  open,
  onClose,
  title,
  description,
  maxWidth = "sm:max-w-lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Customer modal (Single SMS / Single Email / Bulk import)       */
/* ------------------------------------------------------------------ */

type AddMode = "SMS" | "EMAIL" | "BULK";

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  businessId: string;
  smsRemaining?: number;
  defaultChannel?: Channel;
  onDone: (message: string) => void;
  onError: (message: string) => void;
}

interface ParsedRow {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
}

function parseBulk(text: string, channel: "SMS" | "EMAIL") {
  const rows: ParsedRow[] = [];
  const invalid: string[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  lines.forEach((line, i) => {
    const parts = line
      .split(/[,;\t]/)
      .map((p) => p.trim().replace(/^"|"$/g, ""));
    // skip a header row like "name,phone"
    if (
      i === 0 &&
      /name/i.test(parts[0]) &&
      /(phone|email)/i.test(parts[1] ?? "")
    )
      return;
    const [name, contact] = parts;
    if (!name || !contact) return void invalid.push(line);
    if (channel === "SMS") {
      if (contact.replace(/\D/g, "").length < 7) return void invalid.push(line);
      rows.push({ customerName: name, customerPhone: contact });
    } else {
      if (!EMAIL_RE.test(contact)) return void invalid.push(line);
      rows.push({ customerName: name, customerEmail: contact });
    }
  });
  return { rows, invalid };
}

function AddCustomerModal({
  open,
  onClose,
  businessId,
  smsRemaining,
  defaultChannel,
  onDone,
  onError,
}: AddCustomerModalProps) {
  const [mode, setMode] = useState<AddMode>("SMS");

  // Open on the business's preferred request channel (from settings)
  useEffect(() => {
    if (open) setMode(defaultChannel === "EMAIL" ? "EMAIL" : "SMS");
  }, [open, defaultChannel]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [bulkChannel, setBulkChannel] = useState<"SMS" | "EMAIL">("SMS");
  const [bulkText, setBulkText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [addSms, { isLoading: smsLoading }] = useAddCustomerSMSMutation();
  const [addEmail, { isLoading: emailLoading }] = useAddCustomerEmailMutation();
  const [bulkImport, { isLoading: bulkLoading }] =
    useBulkImportCustomersMutation();
  const busy = smsLoading || emailLoading || bulkLoading;

  const parsed = useMemo(
    () => parseBulk(bulkText, bulkChannel),
    [bulkText, bulkChannel],
  );

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setMessage(DEFAULT_MESSAGE);
    setBulkText("");
    setError(null);
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  const switchMode = (m: AddMode) => {
    setMode(m);
    setError(null);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBulkText(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = "";
  };

  const submit = async () => {
    setError(null);
    try {
      if (mode === "SMS") {
        if (!name.trim()) return setError("Enter the customer's name.");
        if (phone.replace(/\D/g, "").length < 7)
          return setError("Enter a valid phone number.");
        await addSms({
          businessId,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          channel: "SMS",
          customMessage: message.trim() || DEFAULT_MESSAGE,
        }).unwrap();
        onDone(`Review request sent to ${name.trim()} by SMS.`);
      } else if (mode === "EMAIL") {
        if (!name.trim()) return setError("Enter the customer's name.");
        if (!EMAIL_RE.test(email.trim()))
          return setError("Enter a valid email address.");
        await addEmail({
          businessId,
          customerName: name.trim(),
          customerEmail: email.trim(),
          channel: "EMAIL",
          customMessage: message.trim() || DEFAULT_MESSAGE,
        }).unwrap();
        onDone(`Review request sent to ${name.trim()} by email.`);
      } else {
        if (parsed.rows.length === 0)
          return setError("Add at least one valid customer row.");
        await bulkImport({
          businessId,
          channel: bulkChannel,
          customMessage: message.trim() || DEFAULT_MESSAGE,
          customers: parsed.rows,
        }).unwrap();
        onDone(
          `${parsed.rows.length} review request${parsed.rows.length === 1 ? "" : "s"} queued.`,
        );
      }
      reset();
      onClose();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      onError(msg);
    }
  };

  const tabs: { key: AddMode; label: string; icon: React.ReactNode }[] = [
    { key: "SMS", label: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
    { key: "EMAIL", label: "Email", icon: <Mail className="h-4 w-4" /> },
    { key: "BULK", label: "Bulk import", icon: <Upload className="h-4 w-4" /> },
  ];

  const smsLow =
    typeof smsRemaining === "number" &&
    (mode === "SMS" || (mode === "BULK" && bulkChannel === "SMS")) &&
    smsRemaining <= 0;

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add customers"
      description="Send a review request by SMS or email, or import a list."
      maxWidth="sm:max-w-xl"
    >
      {/* Tabs */}
      <div
        className="mb-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1"
        role="tablist"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={mode === t.key}
            onClick={() => switchMode(t.key)}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition ${
              mode === t.key
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mode !== "BULK" && (
          <>
            <Field label="Customer name" htmlFor="c-name">
              <input
                id="c-name"
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
              />
            </Field>

            {mode === "SMS" ? (
              <Field
                label="Phone number"
                htmlFor="c-phone"
                hint="Include the country code. The request is sent as a text message."
              >
                <input
                  id="c-phone"
                  type="tel"
                  className={inputCls}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </Field>
            ) : (
              <Field
                label="Email address"
                htmlFor="c-email"
                hint="The request is sent by email."
              >
                <input
                  id="c-email"
                  type="email"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@email.com"
                />
              </Field>
            )}
          </>
        )}

        {mode === "BULK" && (
          <>
            <div className="flex gap-2">
              {(["SMS", "EMAIL"] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setBulkChannel(ch)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    bulkChannel === ch
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Send by {ch === "SMS" ? "SMS" : "email"}
                </button>
              ))}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="bulk"
                  className="text-sm font-medium text-slate-700"
                >
                  Customers
                </label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <FileUp className="h-3.5 w-3.5" />
                  Upload CSV
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.txt,text/csv,text/plain"
                  className="hidden"
                  onChange={onFile}
                />
              </div>
              <textarea
                id="bulk"
                rows={6}
                className={`${inputCls} resize-y font-mono text-[13px] leading-relaxed`}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={
                  bulkChannel === "SMS"
                    ? "Alice Lopez, +1 (555) 407-8800\nMichael Cox, +1 (555) 612-7645"
                    : "Alice Lopez, alice@email.com\nMichael Cox, michael@email.com"
                }
              />
              <p className="mt-1.5 text-xs text-slate-500">
                One customer per line: name, then{" "}
                {bulkChannel === "SMS" ? "phone" : "email"}.
              </p>

              {bulkText.trim() && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <Check className="h-3 w-3" />
                    {parsed.rows.length} ready
                  </span>
                  {parsed.invalid.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700 ring-1 ring-inset ring-red-200">
                      <AlertTriangle className="h-3 w-3" />
                      {parsed.invalid.length} skipped
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        <Field
          label="Message"
          htmlFor="c-msg"
          hint={`${message.length}/320 characters`}
        >
          <textarea
            id="c-msg"
            rows={3}
            maxLength={320}
            className={`${inputCls} resize-none`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>

        {smsLow && (
          <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-inset ring-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            You've used all your SMS credits for this plan. Use email or upgrade
            to keep texting.
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy || smsLow}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? <Spinner /> : <Send className="h-4 w-4" />}
            {mode === "BULK"
              ? parsed.rows.length > 0
                ? `Send ${parsed.rows.length} request${parsed.rows.length === 1 ? "" : "s"}`
                : "Send requests"
              : "Send request"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Details modal                                                      */
/* ------------------------------------------------------------------ */

function DetailsModal({
  invite,
  onClose,
}: {
  invite: Invite | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={!!invite}
      onClose={onClose}
      title={invite?.customerName ?? ""}
      description={invite ? `Invite sent via ${invite.channel}` : undefined}
    >
      {invite && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={invite.status} />
            <ChannelBadge channel={invite.channel} />
            <Stars rating={invite.feedbackRating} />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Phone</dt>
              <dd className="mt-0.5 text-slate-800">
                {invite.customerPhone || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Email</dt>
              <dd className="mt-0.5 break-all text-slate-800">
                {invite.customerEmail || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Sent</dt>
              <dd className="mt-0.5 text-slate-800">
                {formatDateTime(invite.sentAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Clicked</dt>
              <dd className="mt-0.5 text-slate-800">
                {formatDateTime(invite.clickedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Reviewed</dt>
              <dd className="mt-0.5 text-slate-800">
                {formatDateTime(invite.reviewedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Short code</dt>
              <dd className="mt-0.5 font-mono text-[13px] text-slate-800">
                {invite.shortCode}
              </dd>
            </div>
          </dl>

          {invite.customMessage && (
            <div>
              <div className="mb-1.5 text-xs text-slate-400">Message sent</div>
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                {invite.customMessage}
              </p>
            </div>
          )}

          {invite.feedbackComment && (
            <div>
              <div className="mb-1.5 text-xs text-slate-400">
                Private feedback
              </div>
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100">
                {invite.feedbackComment}
              </p>
            </div>
          )}

          {invite.errorMessage && (
            <div>
              <div className="mb-1.5 text-xs text-slate-400">
                Delivery error
              </div>
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100">
                {invite.errorMessage}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete confirm                                                     */
/* ------------------------------------------------------------------ */

function DeleteModal({
  invite,
  loading,
  onCancel,
  onConfirm,
}: {
  invite: Invite | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={!!invite}
      onClose={() => !loading && onCancel()}
      title="Remove customer?"
      maxWidth="sm:max-w-md"
    >
      <p className="text-sm leading-relaxed text-slate-600">
        <span className="font-medium text-slate-900">
          {invite?.customerName}
        </span>{" "}
        and their review request will be permanently removed. This can't be
        undone.
      </p>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Keep customer
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? <Spinner /> : <Trash2 className="h-4 w-4" />}
          Remove
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat cards                                                         */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  value,
  label,
  sub,
  loading,
  tone = "blue",
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  sub?: string;
  loading?: boolean;
  tone?: "blue" | "amber" | "emerald" | "red";
}) {
  const tones = {
    blue: "bg-blue-600 shadow-blue-200",
    amber: "bg-amber-500 shadow-amber-200",
    emerald: "bg-emerald-600 shadow-emerald-200",
    red: "bg-red-500 shadow-red-200",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm ${tones[tone]}`}
        >
          {icon}
        </div>
        {sub && !loading && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
            {sub}
          </span>
        )}
      </div>
      {loading ? (
        <div className="mt-4 h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
      ) : (
        <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
          {value}
        </div>
      )}
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function QuotaCard({
  used,
  limit,
  loading,
}: {
  used?: number;
  limit?: number;
  loading?: boolean;
}) {
  const pct = limit
    ? Math.min(100, Math.round(((used ?? 0) / limit) * 100))
    : 0;
  const warn = pct >= 90;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm shadow-slate-300">
          <MessageSquare className="h-4 w-4" />
        </div>
        {!loading && limit != null && (
          <span
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${
              warn ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {limit - (used ?? 0)} left
          </span>
        )}
      </div>
      {loading ? (
        <div className="mt-4 h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
      ) : (
        <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
          {used ?? 0}
          <span className="text-base font-normal text-slate-400">
            {" "}
            / {limit ?? 0}
          </span>
        </div>
      )}
      <div className="mt-1 text-sm text-slate-500">SMS credits used</div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${warn ? "bg-red-500" : "bg-blue-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeletons                                                  */
/* ------------------------------------------------------------------ */

function RowSkeleton() {
  return (
    <tr className="border-t border-slate-100">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className={`h-4 animate-pulse rounded bg-slate-100 ${i === 0 ? "w-36" : "w-20"}`}
          />
        </td>
      ))}
    </tr>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="h-10 animate-pulse rounded bg-slate-50" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CustomersManager() {
  /* ---- Profile (cached by RTK Query) -> businessId ---- */
  // Call with `undefined` exactly like the rest of your app so it reuses the
  // same cache entry instead of making another request.
  const {
    data: profileRes,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useGetMeProfileQuery(undefined);

  const profile = profileRes?.data;
  const business: Business | undefined = useMemo(() => {
    const list: Business[] = profile?.businesses ?? [];
    return list.find((b) => b.id === profile?.businessId) ?? list[0];
  }, [profile]);
  const businessId: string = profile?.businessId ?? business?.id ?? "";

  /* ---- Filters / pagination state ---- */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InviteStatus | "">("");
  const [channel, setChannel] = useState<Channel | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounced(search.trim(), 400);

  /* ---- UI state ---- */
  const [addOpen, setAddOpen] = useState(false);
  const [details, setDetails] = useState<Invite | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invite | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  /* ---- Data ---- */
  const {
    data: listRes,
    isLoading,
    isFetching,
    isError,
    error: listError,
    refetch,
  } = useGetAllCustomerQuery(
    {
      businessId,
      page,
      limit,
      status: status || undefined,
      channel: channel || undefined,
      searchTerm: debouncedSearch || undefined,
    },
    { skip: !businessId },
  );

  const { data: statsRes, isLoading: statsLoading } = useGetCustomerStatsQuery(
    businessId,
    {
      skip: !businessId,
    },
  );

  const [resend] = useResendRequestCustomerMutation();
  const [deleteCustomer, { isLoading: deleting }] = useDeleteCustomerMutation();

  const invites: Invite[] = listRes?.data?.data ?? [];
  const meta = listRes?.data?.meta ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  };
  const stats = statsRes?.data;

  // Prefer live stats; fall back to the subscription that came with the profile
  const sms: { limit: number; used: number; remaining: number } | undefined =
    stats?.subscriptionSms ??
    (business?.subscription
      ? {
          limit: business.subscription.smsLimit,
          used: business.subscription.smsUsed,
          remaining:
            business.subscription.smsLimit - business.subscription.smsUsed,
        }
      : undefined);

  const totalPages = Math.max(1, meta.totalPages || 1);
  const hasFilters = !!(debouncedSearch || status || channel);

  // If the current page disappears (e.g. after deleting the last row), step back.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  /* ---- Handlers ---- */
  const notify = (type: ToastState["type"], message: string) =>
    setToast({ type, message });

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setChannel("");
    setPage(1);
  };

  const handleCopy = async (invite: Invite) => {
    try {
      await navigator.clipboard.writeText(invite.reviewUrl);
      setCopiedId(invite.id);
      setTimeout(() => setCopiedId((c) => (c === invite.id ? null : c)), 1500);
    } catch {
      notify(
        "error",
        "Couldn't copy the link. Copy it manually from the details view.",
      );
    }
  };

  const handleResend = async (invite: Invite) => {
    setResendingId(invite.id);
    try {
      await resend(invite.id).unwrap();
      notify("success", `Review request resent to ${invite.customerName}.`);
    } catch (err) {
      notify("error", getErrorMessage(err));
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget.id).unwrap();
      notify("success", `${deleteTarget.customerName} was removed.`);
      setDeleteTarget(null);
    } catch (err) {
      notify("error", getErrorMessage(err));
    }
  };

  const canResend = (i: Invite) => i.status !== "REVIEWED";

  /* ---- Actions cell (shared by table + cards) ---- */
  const Actions = ({ c }: { c: Invite }) => (
    <div className="flex items-center justify-end gap-0.5">
      <IconButton label="View details" onClick={() => setDetails(c)}>
        <Eye className="h-4 w-4" />
      </IconButton>
      <IconButton
        label={copiedId === c.id ? "Copied" : "Copy review link"}
        onClick={() => handleCopy(c)}
        disabled={!c.reviewUrl}
      >
        {copiedId === c.id ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </IconButton>
      <IconButton
        label="Resend request"
        onClick={() => handleResend(c)}
        disabled={!canResend(c) || resendingId === c.id}
      >
        {resendingId === c.id ? <Spinner /> : <RefreshCw className="h-4 w-4" />}
      </IconButton>
      <IconButton
        label="Remove customer"
        tone="danger"
        onClick={() => setDeleteTarget(c)}
      >
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </div>
  );

  /* ---- Pagination range text ---- */
  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  /* ---- No business selected ---- */
  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-700">
        We couldn't load your profile, so your customers can't be shown yet.
        <button
          type="button"
          onClick={() => refetchProfile()}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-inset ring-red-200 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Add a business to your account to start sending review requests.
      </div>
    );
  }

  return (
    <div className="min-h-full w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Send review requests, follow each customer's progress, and resend or
            clean up in one place.
          </p>
          {business && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3 text-xs font-medium text-slate-600">
              {business.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.logo}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                  {initials(business.name)}
                </span>
              )}
              {business.name}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add customers
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          value={stats?.totalInvites ?? 0}
          label="Total requests"
          sub={stats ? `${stats.sent} sent` : undefined}
          loading={statsLoading}
        />
        <StatCard
          icon={<MousePointerClick className="h-4 w-4" />}
          value={stats?.clicked ?? 0}
          label="Clicked"
          sub={
            stats
              ? `${stats.conversionRates?.clickThroughRate ?? 0}% CTR`
              : undefined
          }
          tone="amber"
          loading={statsLoading}
        />
        <StatCard
          icon={<Star className="h-4 w-4" />}
          value={stats?.reviewed ?? 0}
          label="Reviewed"
          sub={
            stats
              ? `${stats.conversionRates?.reviewCompletionRate ?? 0}% rate`
              : undefined
          }
          tone="emerald"
          loading={statsLoading}
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4" />}
          value={stats?.failed ?? 0}
          label="Failed"
          tone="red"
          loading={statsLoading}
        />
        <div className="col-span-2 lg:col-span-1">
          <QuotaCard
            used={sms?.used}
            limit={sms?.limit}
            loading={statsLoading && !sms}
          />
        </div>
      </div>

      {/* Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email or phone"
              aria-label="Search customers"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as InviteStatus | "");
                setPage(1);
              }}
              aria-label="Filter by status"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:flex-none"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value as Channel | "");
                setPage(1);
              }}
              aria-label="Filter by channel"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:flex-none"
            >
              {CHANNEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Count row */}
        <div className="flex items-center justify-between px-4 pt-3 text-xs text-slate-500 sm:px-5">
          <span>
            {meta.total} customer{meta.total === 1 ? "" : "s"}
            {hasFilters ? " match your filters" : ""}
          </span>
          {isFetching && !isLoading && (
            <span className="inline-flex items-center gap-1.5 text-blue-600">
              <Spinner className="h-3 w-3" /> Updating
            </span>
          )}
        </div>

        {/* Error */}
        {isError && (
          <div className="m-4 flex flex-col items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-inset ring-red-200 sm:m-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {getErrorMessage(listError, "We couldn't load your customers.")}
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Desktop table */}
        <div
          className={`hidden overflow-x-auto transition-opacity lg:block ${isFetching && !isLoading ? "opacity-60" : ""}`}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-medium text-slate-500">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Sent</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                [...Array(5)].map((_, i) => <RowSkeleton key={i} />)}

              {!isLoading &&
                invites.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(c.customerName)}`}
                        >
                          {initials(c.customerName)}
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {c.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-slate-900">
                        {c.customerPhone || c.customerEmail || "—"}
                      </div>
                      {c.customerPhone && c.customerEmail && (
                        <div className="text-xs text-slate-500">
                          {c.customerEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <ChannelBadge channel={c.channel} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-600">
                      {formatDate(c.sentAt ?? c.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Stars rating={c.feedbackRating} />
                    </td>
                    <td className="px-4 py-3.5">
                      <Actions c={c} />
                    </td>
                  </tr>
                ))}

              {!isLoading && !isError && invites.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16">
                    <EmptyState
                      hasFilters={hasFilters}
                      onClear={clearFilters}
                      onAdd={() => setAddOpen(true)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / tablet cards */}
        <div
          className={`divide-y divide-slate-100 transition-opacity lg:hidden ${isFetching && !isLoading ? "opacity-60" : ""}`}
        >
          {isLoading && [...Array(4)].map((_, i) => <CardSkeleton key={i} />)}

          {!isLoading &&
            invites.map((c) => (
              <div key={c.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(c.customerName)}`}
                    >
                      {initials(c.customerName)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {c.customerName}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {c.customerPhone || c.customerEmail || "—"}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">Channel</div>
                    <div className="mt-1">
                      <ChannelBadge channel={c.channel} />
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Sent</div>
                    <div className="mt-1 text-sm text-slate-700">
                      {formatDate(c.sentAt ?? c.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Rating</div>
                    <div className="mt-1">
                      <Stars rating={c.feedbackRating} />
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2">
                  <Actions c={c} />
                </div>
              </div>
            ))}

          {!isLoading && !isError && invites.length === 0 && (
            <div className="px-5 py-14">
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
                onAdd={() => setAddOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.total > 0 && (
          <div className="flex flex-col items-center gap-3 border-t border-slate-100 p-4 sm:p-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>
                Showing{" "}
                <span className="font-medium text-slate-700">{from}</span>–
                <span className="font-medium text-slate-700">{to}</span> of{" "}
                <span className="font-medium text-slate-700">{meta.total}</span>
              </span>
              <label className="flex items-center gap-1.5">
                <span className="sr-only sm:not-sr-only">Rows</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  aria-label="Rows per page"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <nav className="flex items-center gap-1.5" aria-label="Pagination">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {buildPageList(page, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="px-1 text-sm text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCustomerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        businessId={businessId}
        smsRemaining={sms?.remaining}
        defaultChannel={business?.defaultRequestChannel}
        onDone={(m) => {
          notify("success", m);
          setPage(1);
        }}
        onError={(m) => notify("error", m)}
      />
      <DetailsModal invite={details} onClose={() => setDetails(null)} />
      <DeleteModal
        invite={deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({
  hasFilters,
  onClear,
  onAdd,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {hasFilters ? (
          <Search className="h-5 w-5" />
        ) : (
          <Users className="h-5 w-5" />
        )}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {hasFilters ? "No customers match" : "No customers yet"}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {hasFilters
          ? "Try a different search or clear your filters."
          : "Add your first customer to send a review request."}
      </p>
      <button
        type="button"
        onClick={hasFilters ? onClear : onAdd}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {hasFilters ? (
          "Clear filters"
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add customers
          </>
        )}
      </button>
    </div>
  );
}
