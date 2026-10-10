"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Loader2,
  MessageSquare,
  Printer,
  QrCode,
  RefreshCw,
  Star,
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
    title: "Put your NFC stand to work",
    description: "Link a stand or QR code to your Google review page.",
    href: "/dashboard/nfc",
  },
  {
    title: "Ask your first customers for a review",
    description: "Send a request by SMS or email in under a minute.",
    href: "/dashboard/campaigns",
  },
  {
    title: "See how you compare",
    description: "Add the competitors you want to be ahead of.",
    href: "/dashboard/competitors",
  },
];

const STAR_COUNT = 5;

/* Bricolage Grotesque for headline and numbers, DM Sans for text. */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');
.gmr-modern { font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.gmr-modern .display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.03em; }
`;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PaymentSuccessModern({
  dashboardHref = "/dashboard",
  billingHref = "/billing",
  nextSteps = DEFAULT_STEPS,
}: Props) {
  const p = usePaymentSuccess();

  /* ---------------- loading ---------------- */
  if (p.loading) {
    return (
      <div className="gmr-modern flex min-h-screen items-center justify-center bg-[#F5F7FC] text-slate-500">
        <style>{css}</style>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Almost there...
      </div>
    );
  }

  /* ---------------- opened without a payment ---------------- */
  if (p.state === "none") {
    return (
      <div className="gmr-modern flex min-h-screen items-center justify-center bg-[#F5F7FC] px-4">
        <style>{css}</style>
        <div className="max-w-md text-center">
          <h1 className="display text-4xl font-extrabold text-[#0B1B3A]">
            Nothing to confirm yet
          </h1>
          <p className="mt-3 text-slate-500">
            This page appears right after a payment. To start or change a plan,
            head to Plan &amp; Billing.
          </p>
          <Link
            href={billingHref}
            className="mt-7 inline-flex rounded-full bg-[#2F5BFF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1F47E0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF] focus-visible:ring-offset-2"
          >
            Open Plan &amp; Billing
          </Link>
        </div>
      </div>
    );
  }

  const active = p.state === "active";
  const delayed = p.state === "delayed";
  const name = p.planName || "Your plan";

  const headline = active
    ? `${name} is live.`
    : delayed
      ? "Payment received."
      : `Switching on ${name}…`;

  const lead = active
    ? `Thanks${p.businessName ? `, ${p.businessName}` : ""}. Your payment went through and your new limits are ready to use.`
    : delayed
      ? "Your payment went through, but the plan is taking longer than usual to switch over."
      : "Your payment went through. We're switching on your new limits now, which takes a few seconds.";

  const receipt: [string, string][] = [
    ["Amount", `${currency(p.price, p.currencyCode)} / month`],
    ["Billing", "Monthly"],
    [
      "Current period",
      active
        ? `${fmtDate(p.periodStart)} to ${fmtDate(p.periodEnd)}`
        : "Starts on activation",
    ],
    ["Reference", p.reference ?? "—"],
  ];

  const fmt = (n?: number) =>
    typeof n === "number" ? n.toLocaleString() : "—";

  return (
    <div className="gmr-modern min-h-screen bg-[#F5F7FC] px-4 py-12 text-[#0B1B3A] sm:py-20 print:bg-white print:py-4">
      <style>{css}</style>

      <div className="mx-auto w-full max-w-5xl">
        {/* ------------------------ Hero ------------------------ */}
        <section className="max-w-2xl">
          {/* The one moment: stars fill in once the plan is live */}
          <div className="mb-7 flex items-center gap-1.5" aria-hidden>
            {Array.from({ length: STAR_COUNT }).map((_, i) => (
              <Star
                key={i}
                className={[
                  "h-9 w-9 transition-all duration-500 motion-reduce:transition-none",
                  active
                    ? "scale-100 fill-amber-400 text-amber-400"
                    : "scale-90 animate-pulse fill-transparent text-slate-300 motion-reduce:animate-none",
                ].join(" ")}
                style={{ transitionDelay: active ? `${i * 140}ms` : "0ms" }}
              />
            ))}
          </div>

          <h1
            role="status"
            className="display text-5xl font-extrabold leading-[1.02] sm:text-6xl"
          >
            {headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            {lead}
          </p>

          {delayed && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Check again in a moment. If the plan still hasn't changed,
                contact support and mention the reference below.
              </p>
              <button
                type="button"
                onClick={p.recheck}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 font-semibold text-amber-900 ring-1 ring-amber-300 transition-colors hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Check again
              </button>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#2F5BFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2F5BFF]/25 transition-colors hover:bg-[#1F47E0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF] focus-visible:ring-offset-2"
            >
              Go to dashboard
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0B1B3A] ring-1 ring-slate-200 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF] focus-visible:ring-offset-2"
            >
              <Printer className="h-4 w-4" />
              Print receipt
            </button>
          </div>
        </section>

        {/* ------------------------ Tiles ------------------------ */}
        <section className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* SMS: the big one */}
          <div className="relative overflow-hidden rounded-[32px] bg-[#2F5BFF] p-7 text-white md:col-span-3 md:row-span-2 md:p-9">
            <MessageSquare className="h-6 w-6 text-white/70" />
            <p className="display mt-16 text-7xl font-extrabold leading-none sm:text-8xl">
              {fmt(p.limits.sms)}
            </p>
            <p className="mt-3 text-base font-medium text-white/80">
              SMS invites every month
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200 md:col-span-3">
            <div className="flex items-center justify-between">
              <Bot className="h-6 w-6 text-[#2F5BFF]" />
              <p className="text-sm font-medium text-slate-500">
                AI auto-replies
              </p>
            </div>
            <p className="display mt-6 text-5xl font-extrabold leading-none">
              {fmt(p.limits.aiReply)}
            </p>
          </div>

          <div className="rounded-[28px] bg-amber-100 p-7 md:col-span-3">
            <div className="flex items-center justify-between">
              <QrCode className="h-6 w-6 text-amber-700" />
              <p className="text-sm font-medium text-amber-900/70">
                NFC stands &amp; QR codes
              </p>
            </div>
            <p className="display mt-6 text-5xl font-extrabold leading-none text-amber-950">
              {fmt(p.limits.nfc)}
            </p>
          </div>
        </section>

        {/* ------------------------ Receipt + next steps ------------------------ */}
        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="display text-xl font-extrabold">Receipt</h2>
            <dl className="mt-4">
              {receipt.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-t border-slate-100 py-3 text-sm first:border-t-0"
                >
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-semibold tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href={billingHref}
              className="mt-2 inline-block text-sm font-semibold text-[#2F5BFF] underline-offset-4 hover:underline print:hidden"
            >
              Manage billing
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200 sm:p-4 lg:col-span-3 print:hidden">
            <h2 className="display px-4 pb-1 pt-4 text-xl font-extrabold">
              Get your first reviews in
            </h2>
            <ul>
              {nextSteps.map((s) => (
                <li key={s.title}>
                  <Link
                    href={s.href}
                    className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-[#F5F7FC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BFF]"
                  >
                    <span className="flex-1">
                      <span className="block font-semibold">{s.title}</span>
                      <span className="mt-0.5 block text-sm text-slate-500">
                        {s.description}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-[#2F5BFF] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="mt-8 text-sm text-slate-400 print:hidden">
          Payments are processed by Stripe. Your card details never reach our
          servers.
        </p>
      </div>
    </div>
  );
}
