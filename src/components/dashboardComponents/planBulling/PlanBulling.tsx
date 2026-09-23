"use client";

import { useState, useMemo } from "react";
import {
  Check,
  Star,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type PlanTier = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
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
  pdfUrl?: string;
};

export type PlanAndBillingProps = {
  currentPlanId?: string;
  plans?: PlanTier[];
  yearToDateSpend?: number;
  yearToDateRange?: string;
  totalInvoicesLabel?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardExpiry?: string;
  nextInvoiceAmount?: number;
  nextInvoiceDate?: string;
  invoices?: Invoice[];
  onSelectPlan?: (planId: string) => void;
  onUpdateCard?: () => void;
  onRemoveCard?: () => void;
  onDownloadInvoice?: (invoiceId: string) => void;
  onExportAll?: () => void;
};

/* ------------------------------------------------------------------ */
/*  Default sample data                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 79,
    tagline: "Perfect for businesses getting started with review collection.",
    features: [
      "Basic review collection",
      "Review monitoring",
      "100 review requests/month",
      "3 competitors tracked",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 149,
    tagline:
      "Everything you need to grow reviews and monitor your competition.",
    popular: true,
    features: [
      "QuickSend",
      "NFC review collection",
      "QR code tracking",
      "5 competitors monitored",
      "Advanced Review Gap",
      "Monthly AI Growth Report",
      "CSV upload",
      "300 review requests/month",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    tagline:
      "For high-volume businesses that need maximum capacity and support.",
    features: [
      "1,000 review requests/month",
      "10 competitors monitored",
      "Multiple NFC locations/stands",
      "Priority support",
      "Future CRM integration readiness",
    ],
  },
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "INV-2026-009",
    date: "Sep 1, 2026",
    billingPeriod: "Sep 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2026-008",
    date: "Aug 1, 2026",
    billingPeriod: "Aug 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2026-007",
    date: "Jul 1, 2026",
    billingPeriod: "Jul 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2026-006",
    date: "Jun 1, 2026",
    billingPeriod: "Jun 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2026-005",
    date: "May 1, 2026",
    billingPeriod: "May 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2026-004",
    date: "Apr 1, 2026",
    billingPeriod: "Apr 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-2026-003",
    date: "Mar 1, 2026",
    billingPeriod: "Mar 2026",
    plan: "Growth",
    amount: 79,
    status: "Paid",
    paymentMethod: "Visa •••• 4242",
  },
];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */

const currency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  Failed: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PlanAndBilling({
  currentPlanId = "growth",
  plans = DEFAULT_PLANS,
  yearToDateSpend = 561,
  yearToDateRange = "Jan – Sep 2026",
  totalInvoicesLabel = "Since Oct 2025",
  cardBrand = "VISA",
  cardLast4 = "4242",
  cardExpiry = "08/28",
  nextInvoiceAmount = 79,
  nextInvoiceDate = "Oct 1, 2026",
  invoices = DEFAULT_INVOICES,
  onSelectPlan,
  onUpdateCard,
  onRemoveCard,
  onDownloadInvoice,
  onExportAll,
}: PlanAndBillingProps) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<"All" | string>("All");

  const currentPlan = plans.find((p) => p.id === currentPlanId) ?? plans[0];

  const years = useMemo(() => {
    const set = new Set<string>();
    invoices.forEach((inv) => {
      const match = inv.date.match(/\d{4}/);
      if (match) set.add(match[0]);
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        search.trim() === "" ||
        inv.id.toLowerCase().includes(search.trim().toLowerCase()) ||
        inv.plan.toLowerCase().includes(search.trim().toLowerCase());
      const matchesYear = yearFilter === "All" || inv.date.includes(yearFilter);
      return matchesSearch && matchesYear;
    });
  }, [invoices, search, yearFilter]);

  const totalPaid = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.status === "Paid" ? inv.amount : 0),
    0,
  );

  return (
    <div className="b w-full">
      <div className="mx-auto flex w-full flex-col gap-10">
        {/* ---------------------------------------------------------- */}
        {/* Plan section                                               */}
        {/* ---------------------------------------------------------- */}
        <section>
          <header className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Plan &amp; Billing
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              You are currently on the {currentPlan.name} plan. Upgrade or
              change at any time.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isPopular = plan.popular;
              const isCurrent = plan.id === currentPlanId;

              return (
                <div
                  key={plan.id}
                  className={[
                    "relative flex flex-col rounded-2xl p-6 transition-shadow",
                    isPopular
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 sm:scale-[1.02]"
                      : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200",
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
                        isPopular ? "text-blue-100" : "text-slate-500",
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
                            : "bg-blue-50 text-blue-700",
                        ].join(" ")}
                      >
                        <Star className="h-3 w-3" />
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mb-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span
                      className={isPopular ? "text-blue-100" : "text-slate-500"}
                    >
                      /month
                    </span>
                  </div>

                  <p
                    className={[
                      "mb-5 text-sm leading-relaxed",
                      isPopular ? "text-blue-50" : "text-slate-500",
                    ].join(" ")}
                  >
                    {plan.tagline}
                  </p>

                  <ul className="mb-6 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span
                          className={[
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                            isPopular ? "bg-white/20" : "bg-blue-100",
                          ].join(" ")}
                        >
                          <Check
                            className={[
                              "h-2.5 w-2.5",
                              isPopular ? "text-white" : "text-blue-600",
                            ].join(" ")}
                            strokeWidth={3}
                          />
                        </span>
                        <span
                          className={
                            isPopular ? "text-white" : "text-slate-700"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onSelectPlan?.(plan.id)}
                    className={[
                      "mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      isPopular
                        ? "bg-white text-blue-600 hover:bg-blue-50 focus-visible:ring-white"
                        : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
                    ].join(" ")}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Billing history section                                    */}
        {/* ---------------------------------------------------------- */}
        <section>
          <header className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Billing History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and download all past invoices for your account.
            </p>
          </header>

          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Star className="h-5 w-5 text-blue-600" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {currentPlan.name}
                </p>
                <p className="text-sm text-slate-500">Current Plan</p>
                <p className="text-xs text-slate-400">
                  ${currentPlan.price}.00 / month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {currency(yearToDateSpend)}
                </p>
                <p className="text-sm text-slate-500">Year-to-Date Spend</p>
                <p className="text-xs text-slate-400">{yearToDateRange}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {invoices.length}
                </p>
                <p className="text-sm text-slate-500">Total Invoices</p>
                <p className="text-xs text-slate-400">{totalInvoicesLabel}</p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Payment Method
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold tracking-wide text-white">
                  {cardBrand}
                </span>
                <p className="text-sm text-slate-700">
                  {cardBrand === "VISA" ? "Visa" : cardBrand} ending in{" "}
                  {cardLast4}
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="text-slate-400">Expires {cardExpiry}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onUpdateCard}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Update Card
                </button>
                <button
                  type="button"
                  onClick={onRemoveCard}
                  className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Next invoice notice */}
          <div className="mb-6 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 ring-1 ring-inset ring-blue-100">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Your next invoice of{" "}
              <span className="font-semibold">
                {currency(nextInvoiceAmount)}
              </span>{" "}
              will be charged on{" "}
              <span className="font-semibold">{nextInvoiceDate}</span> to{" "}
              {cardBrand === "VISA" ? "Visa" : cardBrand} ···· {cardLast4}.
            </p>
          </div>

          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
            />
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <div className="flex rounded-lg bg-slate-100 p-1">
                {(["All", ...years] as const).map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYearFilter(y)}
                    className={[
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      yearFilter === y
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {y}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onExportAll}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Download className="h-4 w-4" />
                Export All
              </button>
            </div>
          </div>

          {/* Table — desktop */}
          <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
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
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id + inv.date}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-blue-600">
                        {inv.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                        {inv.date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                        {inv.billingPeriod}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {inv.plan}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">
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
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                        {inv.paymentMethod}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onDownloadInvoice?.(inv.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
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
                        className="px-5 py-10 text-center text-sm text-slate-400"
                      >
                        No invoices match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
              <span>{filteredInvoices.length} invoices shown</span>
              <span>
                Total paid{" "}
                <span className="font-semibold text-slate-900">
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
                  onClick={() => onDownloadInvoice?.(inv.id)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 ring-1 ring-slate-200">
                No invoices match your search.
              </div>
            )}

            {filteredInvoices.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                <span>{filteredInvoices.length} invoices shown</span>
                <span>
                  Total{" "}
                  <span className="font-semibold text-slate-900">
                    {currency(totalPaid)}
                  </span>
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
