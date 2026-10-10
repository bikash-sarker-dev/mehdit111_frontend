"use client";

import Link from "next/link";
import {
  Bot,
  ChevronRight,
  Loader2,
  Lock,
  MessageSquare,
  Printer,
  QrCode,
  RefreshCw,
} from "lucide-react";

import {
  currency,
  fmtDate,
  usePaymentSuccess,
} from "@/hooks/usePaymentSuccess";

/* ------------------------------------------------------------------ */
/*  Types & defaults                                                  */
/* ------------------------------------------------------------------ */

type NextStep = { title: string; description: string; href: string };

type Props = {
  dashboardHref?: string;
  billingHref?: string;
  /** ⚠️ Point these at your real routes */
  nextSteps?: NextStep[];
};

const DEFAULT_STEPS: NextStep[] = [
  {
    title: "Set up your NFC stand",
    description: "Link a stand or QR code to your Google review page.",
    href: "/dashboard/nfc",
  },
  {
    title: "Send your first review request",
    description: "Invite recent customers by SMS or email.",
    href: "/dashboard/campaigns",
  },
  {
    title: "Add your competitors",
    description: "Benchmark your rating against nearby businesses.",
    href: "/dashboard/competitors",
  },
];

/* Plex Sans for everything, tabular figures for amounts.
   The check draws once when the plan becomes active. */
const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');
.gmr-corp { font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.gmr-corp .num { font-variant-numeric: tabular-nums; }
@keyframes gmr-draw { to { stroke-dashoffset: 0; } }
.gmr-corp .gmr-check { stroke-dasharray: 30; stroke-dashoffset: 30; animation: gmr-draw .55s .1s ease-out forwards; }
@media (prefers-reduced-motion: reduce) {
  .gmr-corp .gmr-check { animation: none; stroke-dashoffset: 0; }
}
`;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PaymentSuccessCorporate({
  dashboardHref = "/dashboard",
  billingHref = "/billing",
  nextSteps = DEFAULT_STEPS,
}: Props) {
  const p = usePaymentSuccess();

  /* ---------------- loading ---------------- */
  if (p.loading) {
    return (
      <div className="gmr-corp flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
        <style>{css}</style>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading your receipt...
      </div>
    );
  }

  /* ---------------- opened without a payment ---------------- */
  if (p.state === "none") {
    return (
      <div className="gmr-corp flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <style>{css}</style>
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            No recent payment found
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            This page confirms a payment right after checkout. To start or
            change a plan, go to Plan &amp; Billing.
          </p>
          <Link
            href={billingHref}
            className="mt-6 inline-flex rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Open Plan &amp; Billing
          </Link>
        </div>
      </div>
    );
  }

  const active = p.state === "active";
  const delayed = p.state === "delayed";

  const heading = active ? "Payment successful" : "Payment received";
  const lead = active
    ? `Your ${p.planName} plan is active. The current period ends on ${fmtDate(p.periodEnd)}.`
    : delayed
      ? "Your payment went through, but activating the plan is taking longer than usual."
      : `We're applying your ${p.planName} plan. This usually takes a few seconds, so you can stay on this page.`;

  const rows: [string, string][] = [
    ["Business", p.businessName || "—"],
    ["Plan", p.planName || "—"],
    ["Billing", "Monthly subscription"],
    [
      "Plan period",
      active
        ? `${fmtDate(p.periodStart)} to ${fmtDate(p.periodEnd)}`
        : "Starts when the plan is activated",
    ],
    ["Reference", p.reference ?? "—"],
  ];

  const allowances = [
    {
      icon: MessageSquare,
      label: "SMS invites per month",
      value: p.limits.sms,
    },
    { icon: Bot, label: "AI auto-replies", value: p.limits.aiReply },
    { icon: QrCode, label: "NFC stands / QR codes", value: p.limits.nfc },
  ];

  return (
    <div className="gmr-corp min-h-screen bg-slate-100 px-4 py-10 text-slate-900 print:bg-white print:p-0">
      <style>{css}</style>

      <div className="mx-auto w-full max-w-5xl">
        {/* Top line */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">
            {p.businessName || "Your account"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            Secure payment confirmation
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* ------------------------ Statement ------------------------ */}
          <main className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-7 sm:flex-row sm:items-start sm:justify-between sm:px-8">
              <div className="flex items-start gap-4">
                <span
                  className={[
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                    active
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : delayed
                        ? "bg-amber-50 text-amber-700 ring-amber-200"
                        : "bg-blue-50 text-blue-700 ring-blue-200",
                  ].join(" ")}
                >
                  {active ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path className="gmr-check" d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  ) : delayed ? (
                    <RefreshCw className="h-6 w-6" />
                  ) : (
                    <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" />
                  )}
                </span>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {heading}
                  </h1>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
                    {lead}
                  </p>
                </div>
              </div>

              <span
                role="status"
                className={[
                  "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
                  active
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                    : delayed
                      ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                      : "bg-blue-50 text-blue-700 ring-blue-600/20",
                ].join(" ")}
              >
                {active
                  ? "Plan active"
                  : delayed
                    ? "Activation delayed"
                    : "Activating plan"}
              </span>
            </div>

            {delayed && (
              <div className="flex flex-col gap-3 border-b border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p>
                  Activation can take a minute after payment. Check again, or
                  refresh this page shortly. If it still hasn't changed, contact
                  support.
                </p>
                <button
                  type="button"
                  onClick={p.recheck}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-1.5 font-medium text-amber-900 transition-colors hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Check again
                </button>
              </div>
            )}

            {/* Line items */}
            <dl className="px-6 sm:px-8">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-6 border-b border-dashed border-slate-200 py-3.5 text-sm"
                >
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="num text-right font-medium text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Total */}
            <div className="flex items-center justify-between bg-slate-50 px-6 py-5 sm:px-8">
              <span className="text-sm font-medium text-slate-600">
                Amount charged
              </span>
              <span className="num text-2xl font-semibold text-slate-900">
                {currency(p.price, p.currencyCode)}
                <span className="ml-1 text-sm font-normal text-slate-500">
                  / month
                </span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:px-8 print:hidden">
              <Link
                href={dashboardHref}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Go to dashboard
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <Printer className="h-4 w-4" />
                Print receipt
              </button>
              <Link
                href={billingHref}
                className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline sm:ml-auto"
              >
                Manage billing
              </Link>
            </div>
          </main>

          {/* ------------------------ Side rail ------------------------ */}
          <aside className="flex flex-col gap-6 print:hidden">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Your plan now includes
              </h2>
              <ul className="mt-4 divide-y divide-slate-100">
                {allowances.map(({ icon: Icon, label, value }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-sm text-slate-500">
                      {label}
                    </span>
                    <span className="num text-base font-semibold text-slate-900">
                      {typeof value === "number" ? value.toLocaleString() : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Get started with your plan
              </h2>
              <ul className="-mx-2 mt-3">
                {nextSteps.map((s) => (
                  <li key={s.title}>
                    <Link
                      href={s.href}
                      className="group flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-slate-900">
                          {s.title}
                        </span>
                        <span className="block text-xs leading-relaxed text-slate-500">
                          {s.description}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-blue-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 print:hidden">
          Payments are processed by Stripe. Your card details never reach our
          servers.
        </p>
      </div>
    </div>
  );
}
