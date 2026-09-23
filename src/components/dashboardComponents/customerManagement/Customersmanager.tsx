"use client";

import React, { useMemo, useState } from "react";
import {
  Star,
  TrendingUp,
  Calendar,
  Lightbulb,
  Plus,
  Copy,
  Check,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReviewStatus = "Review Received" | "Review Requested" | "Not Requested";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  lastInteraction: string;
  status: ReviewStatus;
}

type FilterKey = "All" | ReviewStatus;

/* ------------------------------------------------------------------ */
/*  Mock data (replace with real data / API results)                  */
/* ------------------------------------------------------------------ */

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Mitchell",
    phone: "+1 (555) 201-4892",
    email: "sarah.m@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Sep 13, 2026",
    status: "Review Received",
  },
  {
    id: "2",
    firstName: "James",
    lastName: "Donovan",
    phone: "+1 (555) 315-6728",
    email: "james.d@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Oct 2, 2026",
    status: "Review Requested",
  },
  {
    id: "3",
    firstName: "Alicia",
    lastName: "Lopez",
    phone: "+1 (555) 427-8391",
    email: "alicia.l@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Sep 28, 2026",
    status: "Not Requested",
  },
  {
    id: "4",
    firstName: "Michael",
    lastName: "Kim",
    phone: "+1 (555) 672-1045",
    email: "michael.k@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Oct 8, 2026",
    status: "Review Requested",
  },
  {
    id: "5",
    firstName: "Rebecca",
    lastName: "Tran",
    phone: "+1 (555) 983-2047",
    email: "rebecca.t@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Sep 30, 2026",
    status: "Not Requested",
  },
  {
    id: "6",
    firstName: "Carlos",
    lastName: "Perez",
    phone: "+1 (555) 746-8293",
    email: "carlos.p@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Oct 5, 2026",
    status: "Review Received",
  },
  {
    id: "7",
    firstName: "Emily",
    lastName: "Larson",
    phone: "+1 (555) 439-1827",
    email: "emily.l@email.com",
    location: "Dhaka, Bangladesh",
    lastInteraction: "Sep 25, 2026",
    status: "Not Requested",
  },
];

const PAGE_SIZE = 7;
const TOTAL_PAGES = 5;

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function avatarColor(seed: string) {
  const palette = [
    "bg-indigo-600",
    "bg-blue-600",
    "bg-violet-600",
    "bg-sky-600",
    "bg-purple-600",
  ];
  const idx = seed.charCodeAt(0) % palette.length;
  return palette[idx];
}

function statusStyles(status: ReviewStatus) {
  switch (status) {
    case "Review Received":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
    case "Review Requested":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
    case "Not Requested":
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delta: string;
}

function StatCard({ icon, value, label, delta }: StatCardProps) {
  return (
    <div className="min-w-[150px] flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
          {icon}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
          {delta}
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
        {value}
      </div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Customer modal                                                 */
/* ------------------------------------------------------------------ */

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (c: Omit<Customer, "id" | "lastInteraction" | "status">) => void;
}

function AddCustomerModal({ open, onClose, onAdd }: AddCustomerModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Provide a phone number or an email address.");
      return;
    }
    onAdd({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location: "Dhaka, Bangladesh",
    });
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-customer-title"
      onClick={handleClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2
              id="add-customer-title"
              className="text-lg font-semibold text-slate-900"
            >
              Add Customer
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-slate-900">
            Customer Information
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Enter the customer&apos;s contact details.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Mitchell"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Required if no email is provided. Used for SMS review requests.
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Required if no phone is provided. Used for Email review requests.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Copy link button                                                   */
/* ------------------------------------------------------------------ */

function CopyLinkButton({ enabled, id }: { enabled: boolean; id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!enabled) return;
    try {
      await navigator.clipboard.writeText(
        `https://reviews.example.com/r/${id}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore silently
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!enabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        enabled
          ? "border-blue-200 text-blue-700 hover:bg-blue-50 active:bg-blue-100"
          : "cursor-not-allowed border-slate-200 text-slate-300"
      }`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [filter, setFilter] = useState<FilterKey>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(2); // matches the reference screenshot
  const [modalOpen, setModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filters: FilterKey[] = [
    "All",
    "Review Received",
    "Review Requested",
    "Not Requested",
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesFilter = filter === "All" || c.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [customers, filter, query]);

  const handleAddCustomer = (
    data: Omit<Customer, "id" | "lastInteraction" | "status">,
  ) => {
    const newCustomer: Customer = {
      ...data,
      id: `${Date.now()}`,
      lastInteraction: "—",
      status: "Not Requested",
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setFilter("All");
    setPage(1);
  };

  return (
    <div className="min-h-full w-full">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Customers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Organize customer information and track interactions, review
              requests, and activity in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap gap-4">
          <StatCard
            icon={<Star className="h-4.5 w-4.5" />}
            value={248}
            label="Total Customers"
            delta="0.2 pts"
          />
          <StatCard
            icon={<TrendingUp className="h-4.5 w-4.5" />}
            value={89}
            label="Review Received"
            delta="34 new"
          />
          <StatCard
            icon={<Calendar className="h-4.5 w-4.5" />}
            value={114}
            label="Review Requested"
            delta="12% vs Aug"
          />
          <StatCard
            icon={<Lightbulb className="h-4.5 w-4.5" />}
            value={45}
            label="Not Requested"
            delta="3.5pts"
          />
        </div>

        {/* Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search customers..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="flex flex-1 gap-1.5 overflow-x-auto rounded-xl bg-slate-50 p-1 sm:flex-none sm:bg-transparent sm:p-0">
                {filters.map((f) => {
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setFilter(f);
                        setPage(1);
                      }}
                      className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition sm:border sm:px-3.5 sm:py-2 sm:text-sm ${
                        active
                          ? "bg-blue-600 text-white shadow-sm sm:border-blue-600"
                          : "text-slate-600 hover:bg-white sm:border-slate-200 sm:hover:bg-slate-50"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end px-4 pt-3 text-xs text-slate-500 sm:px-5">
            {filteredCustomers.length} customer
            {filteredCustomers.length === 1 ? "" : "s"}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-medium text-slate-500">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Phone / Email</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Last Interaction</th>
                  <th className="px-5 py-3 font-medium">Review Status</th>
                  <th className="px-5 py-3 font-medium">QuickSend</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(c.firstName)}`}
                        >
                          {initials(c.firstName, c.lastName)}
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-slate-900">{c.phone}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {c.location}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {c.lastInteraction}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <CopyLinkButton
                        enabled={c.status !== "Review Received"}
                        id={c.id}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(openMenuId === c.id ? null : c.id)
                          }
                          aria-label="More actions"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </button>
                        {openMenuId === c.id && (
                          <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                            <button
                              className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => setOpenMenuId(null)}
                            >
                              View profile
                            </button>
                            <button
                              className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Edit customer
                            </button>
                            <button
                              className="block w-full px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-sm text-slate-500"
                    >
                      No customers match your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredCustomers.map((c) => (
              <div key={c.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(c.firstName)}`}
                    >
                      {initials(c.firstName, c.lastName)}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {c.firstName} {c.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{c.location}</div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === c.id ? null : c.id)
                      }
                      aria-label="More actions"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreHorizontal className="h-4.5 w-4.5" />
                    </button>
                    {openMenuId === c.id && (
                      <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                        <button
                          className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setOpenMenuId(null)}
                        >
                          View profile
                        </button>
                        <button
                          className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setOpenMenuId(null)}
                        >
                          Edit customer
                        </button>
                        <button
                          className="block w-full px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          onClick={() => setOpenMenuId(null)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <div className="text-slate-400">Phone</div>
                    <div className="mt-0.5 text-slate-700">{c.phone}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Email</div>
                    <div className="mt-0.5 truncate text-slate-700">
                      {c.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Last Interaction</div>
                    <div className="mt-0.5 text-slate-700">
                      {c.lastInteraction}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Status</div>
                    <span
                      className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles(c.status)}`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <CopyLinkButton
                    enabled={c.status !== "Review Received"}
                    id={c.id}
                  />
                </div>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="px-5 py-14 text-center text-sm text-slate-500">
                No customers match your search or filter.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                  p === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={page === TOTAL_PAGES}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AddCustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </div>
  );
}
