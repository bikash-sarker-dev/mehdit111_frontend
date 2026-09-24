"use client";

import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  altPrices: string;
  description: string;
  features: string[];
  /** Instant purchase / signup button, shown on every plan. */
  startLabel: string;
  /** Optional trial button, shown under the primary button. */
  trialLabel?: string;
  featured?: boolean;
  badge?: string;
}

export interface PricingSectionProps {
  /** Called when someone clicks the instant "Start now" button on a plan. */
  onStartNow?: (planName: string) => void;
  /** Called when someone clicks the free-trial button on a plan. */
  onStartTrial?: (planName: string) => void;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$79",
    altPrices: "£79/mo  •  C$99/mo",
    description:
      "Perfect for businesses getting started with review collection.",
    features: [
      "Basic review collection",
      "Review monitoring",
      "100 review requests/month",
      "3 competitors tracked",
    ],
    startLabel: "Start now",
  },
  {
    name: "Growth",
    price: "$149",
    altPrices: "£149/mo  •  C$199/mo",
    description:
      "Everything you need to grow reviews and monitor your competition.",
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
    startLabel: "Start now",
    trialLabel: "14-day free trial",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: "$299",
    altPrices: "£299/mo  •  C$399/mo",
    description:
      "For high-volume businesses that need maximum capacity and support.",
    features: [
      "1,000 review requests/month",
      "10 competitors monitored",
      "Multiple NFC locations/stands",
      "Priority support",
      "Future CRM integration readiness",
    ],
    startLabel: "Start now",
  },
];

export default function PricingSection({
  onStartNow,
  onStartTrial,
}: PricingSectionProps) {
  return (
    <section id="pricing" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-blue-600">Pricing</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose the Plan That Fits Your Business
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-6 sm:mt-16 lg:max-w-6xl lg:grid-cols-3 lg:items-stretch lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.featured
                  ? "bg-blue-600 shadow-xl shadow-blue-600/20 lg:-my-4 lg:py-12"
                  : "border border-slate-200 bg-white"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950">
                  {plan.badge}
                </span>
              )}

              <p
                className={`text-xs font-semibold tracking-wide ${
                  plan.featured ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {plan.name.toUpperCase()}
              </p>

              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${
                    plan.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.featured ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  /month
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${
                  plan.featured ? "text-blue-200" : "text-slate-400"
                }`}
              >
                {plan.altPrices}
              </p>

              <p
                className={`mt-4 text-sm leading-relaxed ${
                  plan.featured ? "text-blue-100" : "text-slate-500"
                }`}
              >
                {plan.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        plan.featured ? "bg-blue-500" : "bg-blue-100"
                      }`}
                    >
                      <Check
                        className={`h-2.5 w-2.5 ${
                          plan.featured ? "text-white" : "text-blue-600"
                        }`}
                        strokeWidth={3}
                      />
                    </span>
                    <span
                      className={`text-sm ${
                        plan.featured ? "text-blue-50" : "text-slate-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Instant purchase / signup */}
              <button
                type="button"
                onClick={() => onStartNow?.(plan.name)}
                className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.startLabel}
              </button>

              {/* Standard trial option, kept alongside the instant option */}
              {plan.trialLabel && (
                <button
                  type="button"
                  onClick={() => onStartTrial?.(plan.name)}
                  className="mt-3 w-full rounded-lg border border-white/40 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  {plan.trialLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
