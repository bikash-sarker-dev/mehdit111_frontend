"use client";

import { useState, type ReactNode } from "react";

/* ----------------------------- Types & data ----------------------------- */

export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
  visible: boolean;
};

type PlansPricingProps = {
  initialPlans?: Plan[];
  initialTrialDays?: number;
  initialTrialEnabled?: boolean;
  /** Called when a plan's "Save" is pressed. Hook your API here. */
  onSavePlan?: (plan: Plan) => void | Promise<void>;
  onPlanChange?: (plan: Plan) => void;
  onTrialChange?: (days: number, enabled: boolean) => void;
};

const DEFAULT_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 79,
    description:
      "Perfect for businesses getting started with review collection.",
    features: [
      "Basic review collection",
      "Review monitoring",
      "100 review requests/month",
      "3 competitors tracked",
    ],
    popular: false,
    visible: true,
  },
  {
    id: "growth",
    name: "Growth",
    price: 149,
    description:
      "Everything you need to grow reviews and monitor your competition.",
    features: [
      "QuickSend",
      "NFC review collection",
      "QR code tracking",
      "5 competitors monitored",
      "Advanced Review Gap",
      "300 review requests/month",
    ],
    popular: true,
    visible: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    description:
      "For high-volume businesses that need maximum capacity and support.",
    features: [
      "1,000 review requests/month",
      "10 competitors monitored",
      "Multiple NFC locations/stands",
      "Priority support",
      "Future CRM integration readiness",
    ],
    popular: false,
    visible: true,
  },
];

const BRAND = "bg-[#1A5CFF] hover:bg-[#1249D6] active:bg-[#0F3DB8]";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5CFF] focus-visible:ring-offset-2";

/* -------------------------------- Icons --------------------------------- */

const Svg = ({
  children,
  className = "h-5 w-5",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const CheckIcon = () => (
  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-blue-100 text-[#1A5CFF]">
    <Svg className="h-2.5 w-2.5">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth={3.2} />
    </Svg>
  </span>
);

const EyeOffIcon = () => (
  <Svg>
    <path d="M9.9 4.24A9.1 9.1 0 0112 4c6 0 10 8 10 8a17.6 17.6 0 01-3.2 4.2M6.6 6.6A17.4 17.4 0 002 12s4 8 10 8a9.7 9.7 0 005.4-1.6" />
    <path d="M14.1 14.1a3 3 0 11-4.2-4.2" />
    <path d="M2 2l20 20" />
  </Svg>
);

const EyeIcon = () => (
  <Svg>
    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

const BrushIcon = () => (
  <Svg className="h-[18px] w-[18px]">
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 00-3-3.02z" />
  </Svg>
);

const CloseIcon = () => (
  <Svg className="h-4 w-4">
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

/* ------------------------------- Switch --------------------------------- */

function Switch({
  checked,
  onChange,
  label,
  tone = "blue",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  tone?: "blue" | "green";
}) {
  const on = tone === "green" ? "bg-green-500" : "bg-[#1A5CFF]";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${FOCUS} ${
        checked ? on : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ----------------------------- Main component --------------------------- */

export default function PlansPricing({
  initialPlans = DEFAULT_PLANS,
  initialTrialDays = 14,
  initialTrialEnabled = true,
  onSavePlan,
  onPlanChange,
  onTrialChange,
}: PlansPricingProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  // A draft exists only while a card is in edit mode.
  const [drafts, setDrafts] = useState<Record<string, Plan>>({});
  const [focusLastOf, setFocusLastOf] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const [trialDays, setTrialDays] = useState(initialTrialDays);
  const [trialDraft, setTrialDraft] = useState<string | null>(null);
  const [trialEnabled, setTrialEnabled] = useState(initialTrialEnabled);

  /* ---- plan helpers ---- */
  const updatePlan = (id: string, patch: Partial<Plan>) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...patch };
        onPlanChange?.(next);
        return next;
      }),
    );
  };

  const setPopular = (id: string, value: boolean) => {
    // Only one plan carries the "Most Popular" badge at a time.
    setPlans((prev) =>
      prev.map((p) => {
        const next = {
          ...p,
          popular: p.id === id ? value : value ? false : p.popular,
        };
        if (next.popular !== p.popular) onPlanChange?.(next);
        return next;
      }),
    );
    setDrafts((d) =>
      d[id] ? { ...d, [id]: { ...d[id], popular: value } } : d,
    );
  };

  const startEdit = (plan: Plan) =>
    setDrafts((d) => ({ ...d, [plan.id]: { ...plan } }));

  const patchDraft = (id: string, patch: Partial<Plan>) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const setFeature = (id: string, index: number, value: string) =>
    setDrafts((d) => ({
      ...d,
      [id]: {
        ...d[id],
        features: d[id].features.map((f, i) => (i === index ? value : f)),
      },
    }));

  const addFeature = (id: string) => {
    setDrafts((d) => ({
      ...d,
      [id]: { ...d[id], features: [...d[id].features, ""] },
    }));
    setFocusLastOf(id);
  };

  const removeFeature = (id: string, index: number) =>
    setDrafts((d) => ({
      ...d,
      [id]: {
        ...d[id],
        features: d[id].features.filter((_, i) => i !== index),
      },
    }));

  const savePlan = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const cleaned: Plan = {
      ...draft,
      features: draft.features.map((f) => f.trim()).filter(Boolean),
    };
    try {
      setSaving(id);
      await onSavePlan?.(cleaned);
      updatePlan(id, cleaned);
      setDrafts((d) => {
        const { [id]: _removed, ...rest } = d;
        return rest;
      });
    } finally {
      setSaving(null);
    }
  };

  /* ---- trial helpers ---- */
  const commitTrial = () => {
    if (trialDraft === null) return;
    const n = Math.min(365, Math.max(1, parseInt(trialDraft, 10) || trialDays));
    setTrialDays(n);
    setTrialDraft(null);
    onTrialChange?.(n, trialEnabled);
  };

  /* -------------------------------- UI -------------------------------- */
  return (
    <section className="w-full font-sans text-slate-900">
      <div className="mx-auto w-full">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
            Plans &amp; Pricing
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-[13px]">
            Manage subscription plans and pricing for Review Growth AI
          </p>
        </header>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {plans.map((plan, idx) => {
            const draft = drafts[plan.id];
            const editing = Boolean(draft);
            const view = draft ?? plan;
            const isSaving = saving === plan.id;

            return (
              <article
                key={plan.id}
                aria-label={`${plan.name} plan`}
                className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-opacity sm:p-6 lg:min-h-[540px] ${
                  idx === 2 ? "md:col-span-2 lg:col-span-1" : ""
                } ${plan.visible ? "" : "opacity-60"}`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium uppercase tracking-wide text-slate-600">
                    {plan.name}
                  </h2>
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-full py-1 pl-3 pr-1.5 text-[13px] font-medium transition-colors ${
                      view.popular
                        ? "bg-green-50 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    Most Popular
                    <Switch
                      tone="green"
                      checked={view.popular}
                      onChange={(v) => setPopular(plan.id, v)}
                      label={`Mark ${plan.name} as most popular`}
                    />
                  </label>
                </div>

                {/* Price */}
                <div className="mt-5 flex items-baseline">
                  {editing ? (
                    <div className="flex items-baseline text-4xl font-bold text-slate-600 sm:text-[42px]">
                      <span>$</span>
                      <input
                        inputMode="numeric"
                        aria-label={`${plan.name} monthly price`}
                        value={draft.price || ""}
                        onChange={(e) =>
                          patchDraft(plan.id, {
                            price:
                              parseInt(e.target.value.replace(/\D/g, ""), 10) ||
                              0,
                          })
                        }
                        className="w-[3.4ch] min-w-0 border-b-2 border-slate-200 bg-transparent leading-tight outline-none focus:border-[#1A5CFF]"
                        style={{
                          width: `${Math.max(String(draft.price).length, 2) + 0.4}ch`,
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-slate-600 sm:text-[42px]">
                      ${plan.price}
                    </span>
                  )}
                  <span className="ml-1.5 text-sm font-medium text-slate-500">
                    /month
                  </span>
                </div>

                {/* Description */}
                {editing ? (
                  <textarea
                    aria-label={`${plan.name} description`}
                    rows={2}
                    value={draft.description}
                    onChange={(e) =>
                      patchDraft(plan.id, { description: e.target.value })
                    }
                    className="mt-4 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-base leading-6 text-slate-600 outline-none focus:border-[#1A5CFF] focus:bg-white sm:text-sm"
                  />
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {plan.description}
                  </p>
                )}

                {/* Features */}
                <ul className="mt-6 space-y-3.5">
                  {view.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      {editing ? (
                        <>
                          <input
                            aria-label={`Feature ${i + 1}`}
                            autoFocus={
                              focusLastOf === plan.id &&
                              i === view.features.length - 1
                            }
                            value={feature}
                            onChange={(e) =>
                              setFeature(plan.id, i, e.target.value)
                            }
                            className="min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 text-base leading-5 text-slate-600 outline-none focus:border-[#1A5CFF] sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(plan.id, i)}
                            aria-label={`Remove feature ${i + 1}`}
                            className={`-my-1.5 -mr-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 ${FOCUS}`}
                          >
                            <CloseIcon />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm leading-5 text-slate-600">
                          {feature}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {editing && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => addFeature(plan.id)}
                      className={`rounded-md px-1 py-1.5 text-sm font-medium text-[#1A5CFF] hover:underline ${FOCUS}`}
                    >
                      Add on
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex items-center gap-3 pt-8">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() =>
                      editing ? savePlan(plan.id) : startEdit(plan)
                    }
                    className={`h-12 flex-1 rounded-xl text-[15px] font-medium text-white transition-colors disabled:opacity-70 ${BRAND} ${FOCUS}`}
                  >
                    {editing ? (isSaving ? "Saving…" : "Save") : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updatePlan(plan.id, { visible: !plan.visible })
                    }
                    aria-pressed={!plan.visible}
                    aria-label={
                      plan.visible
                        ? `Hide ${plan.name} plan`
                        : `Show ${plan.name} plan`
                    }
                    title={plan.visible ? "Hide plan" : "Show plan"}
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 ${FOCUS}`}
                  >
                    {plan.visible ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Free trial */}
        <div className="mt-8 sm:mt-9">
          <h2 className="text-base font-medium text-slate-900">
            Free trial Management
          </h2>
          <div className="mt-3 flex items-center gap-3.5">
            <div className="flex h-12 w-full max-w-[176px] items-center justify-between rounded-lg border border-slate-200 bg-slate-50 pl-3.5 pr-2 sm:h-11">
              {trialDraft !== null ? (
                <div className="flex min-w-0 items-center gap-1.5 text-sm text-slate-600">
                  <input
                    autoFocus
                    inputMode="numeric"
                    aria-label="Free trial length in days"
                    value={trialDraft}
                    onChange={(e) =>
                      setTrialDraft(
                        e.target.value.replace(/\D/g, "").slice(0, 3),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitTrial();
                      if (e.key === "Escape") setTrialDraft(null);
                    }}
                    onBlur={commitTrial}
                    className="w-10 bg-transparent text-base outline-none sm:text-sm"
                  />
                  days
                </div>
              ) : (
                <span className="text-sm text-slate-600">{trialDays} days</span>
              )}
              <button
                type="button"
                aria-label="Edit free trial length"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  trialDraft !== null
                    ? commitTrial()
                    : setTrialDraft(String(trialDays))
                }
                className={`grid h-9 w-9 place-items-center rounded-md text-[#1A5CFF] hover:bg-blue-50 ${FOCUS}`}
              >
                <BrushIcon />
              </button>
            </div>
            <Switch
              checked={trialEnabled}
              onChange={(v) => {
                setTrialEnabled(v);
                onTrialChange?.(trialDays, v);
              }}
              label="Enable free trial"
              tone="blue"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
