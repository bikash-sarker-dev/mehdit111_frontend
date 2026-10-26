
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  ShieldCheck,
  Zap,
  Layers,
  X,
} from "lucide-react";

// ⚠️ Adjust these paths to match your project
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";
import {
  useGetAvailablePlansPricingQuery,
  useGetMyCurrentSubscriptionQuery,
  useUpgradeChangePlanCheckoutMutation,
} from "@/redux/api/userDashboard/subscription/subscriptionApi";
import {
  detectUserCountrySync,
  detectUserCountryAsync,
  getPlanPricing,
  getCountryDetail,
  COUNTRY_CACHE_KEY,
} from "@/utils/pricingCurrency";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                 */
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

export interface PricingSectionProps {
  /** Login page. The user is sent back to `returnTo` after logging in. */
  loginHref?: string;
  /** Sign-up page, used by the free-trial button. */
  signupHref?: string;
  /** Where the login page should send the user back to. */
  returnTo?: string;
  /** Query-string key your login page reads for the return URL. */
  redirectParam?: string;
  /** Show the "14-day free trial" button to visitors who are not logged in. */
  showTrialButton?: boolean;
}

const BUSINESS_CACHE_KEY = "gmr_business_id";
const PENDING_KEY = "gmr_pending_checkout"; // read by the success page after Stripe
const INTENT_KEY = "gmr_intended_plan"; // plan chosen before logging in

const currency = (n: number, cur = "USD") =>
  Number(n ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: cur || "USD",
    maximumFractionDigits: 0,
  });

const errMsg = (e: any, fallback: string) =>
  e?.data?.message || e?.error || e?.message || fallback;

/**
 * Pulls the plans array out of whatever shape the API returns.
 * Handles: [...], { data: [...] }, { data: { plans: [...] } },
 * { data: { data: [...] } }, { data: { items: [...] } }, etc.
 */
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

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PricingSection({
  loginHref = "/signIn",
  signupHref = "/signup",
  returnTo = "/#pricing",
  redirectParam = "redirect",
  showTrialButton = true,
}: PricingSectionProps) {
  const router = useRouter();

  /* ---------------- 1. Is the user logged in? ---------------- */
  // A successful profile request means logged in; a 401 means a visitor.
  // (The 401 shown in the browser console for visitors is expected.)
  const {
    data: profileRes,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetMeProfileQuery(undefined);

  const profile = profileRes?.data;
  const isLoggedIn = !profileError && !!profile?.id;

  const [cachedBusinessId, setCachedBusinessId] = useState("");
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BUSINESS_CACHE_KEY);
      if (saved) setCachedBusinessId(saved);
    } catch {}
  }, []);

  const liveBusinessId: string =
    profile?.businessId ?? profile?.businesses?.[0]?.id ?? "";
  useEffect(() => {
    if (liveBusinessId) {
      try {
        sessionStorage.setItem(BUSINESS_CACHE_KEY, liveBusinessId);
      } catch {}
    }
  }, [liveBusinessId]);
  const businessId = liveBusinessId || (isLoggedIn ? cachedBusinessId : "");

  /* ---------------- 2. Plans (public) + current plan (logged in) ---------------- */
  const {
    data: plansRes,
    isLoading: plansLoading,
    isError: plansError,
    refetch: refetchPlans,
  } = useGetAvailablePlansPricingQuery(undefined);

  // FIX: `plansRes.data` was not always an array, so `.filter` crashed.
  // extractPlans() always returns an array, whatever shape the API sends.
  const paidPlans: ApiPlan[] = useMemo(
    () => extractPlans(plansRes).filter((p) => p?.plan !== "FREE_TRIAL"),
    [plansRes],
  );

  const { data: subRes, isLoading: subLoading } =
    useGetMyCurrentSubscriptionQuery(businessId, {
      skip: !isLoggedIn || !businessId,
    });
  const subscription = subRes?.data?.subscription;
  const currentPlanKey: string = subscription?.plan ?? "";
  const currentPrice: number = subscription?.priceMonthly ?? 0;
  const isActive = subscription?.status === "ACTIVE";
  const isPaidPlan = currentPlanKey !== "" && currentPlanKey !== "FREE_TRIAL";

  /* ---------------- 3. Checkout ---------------- */
  const [createCheckout, { isLoading: creatingCheckout }] =
    useUpgradeChangePlanCheckoutMutation();

  const [selectedPlan, setSelectedPlan] = useState<ApiPlan | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [planCategory, setPlanCategory] = useState<"standard" | "scale">("standard");

  /* ---------------- Location-based Automatic Currency Detection ---------------- */
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() =>
    detectUserCountrySync()
  );

  useEffect(() => {
    let alive = true;
    const profileCountry = (profile as any)?.businesses?.[0]?.country || (profile as any)?.country;
    detectUserCountryAsync(profileCountry).then((code) => {
      if (alive && code) setSelectedCountryCode(code);
    });
    return () => {
      alive = false;
    };
  }, [profile]);

  const currentCountry = useMemo(
    () => getCountryDetail(selectedCountryCode),
    [selectedCountryCode]
  );

  const getPlanPrice = (p: ApiPlan): number => {
    return getPlanPricing(p.plan, selectedCountryCode, p.priceMonthly).price;
  };

  const handleSelect = (plan: ApiPlan) => {
    if (profileLoading) return;

    // Not logged in: remember plan and send to signup/signin with return redirect
    if (!isLoggedIn) {
      try {
        sessionStorage.setItem(INTENT_KEY, plan.plan);
        sessionStorage.setItem("gmr_intended_currency", currentCountry.currency);
        sessionStorage.setItem("gmr_intended_country", currentCountry.code);
      } catch {}
      router.push(`${signupHref}?plan=${encodeURIComponent(plan.plan)}&redirect=${encodeURIComponent(returnTo)}`);
      return;
    }

    setModalError(null);
    setSelectedPlan(plan);
  };

  // After logging in and coming back, reopen the plan they picked
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current || profileLoading || !isLoggedIn || plansLoading)
      return;
    if (businessId && subLoading) return;
    resumed.current = true;
    try {
      const wanted = sessionStorage.getItem(INTENT_KEY);
      if (!wanted) return;
      sessionStorage.removeItem(INTENT_KEY);
      const found = paidPlans.find((p) => p.plan === wanted);
      if (found && !(found.plan === currentPlanKey && isActive)) {
        setSelectedPlan(found);
      }
    } catch {}
  }, [
    profileLoading,
    isLoggedIn,
    plansLoading,
    businessId,
    subLoading,
    paidPlans,
    currentPlanKey,
    isActive,
  ]);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setModalError(null);
    try {
      const res = await createCheckout({
        businessId: businessId || undefined,
        plan: selectedPlan.plan,
        currency: currentCountry.currency.toLowerCase(),
        country: currentCountry.code,
      }).unwrap();

      const url: string | undefined = res?.data?.checkoutUrl;
      if (!url) throw new Error("Could not start checkout. Please try again.");

      // So the success/error page knows what is being paid for
      try {
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({
            plan: selectedPlan.plan,
            sessionId: res?.data?.sessionId,
            startedAt: Date.now(),
          }),
        );
      } catch {}

      window.location.href = url; // Stripe Checkout
    } catch (e) {
      setModalError(errMsg(e, "Could not start checkout. Please try again."));
    }
  };

  const buttonLabel = (plan: ApiPlan) => {
    if (!isLoggedIn) return "Start now";
    if (plan.plan === currentPlanKey && isActive) return "Current plan";
    if (isPaidPlan)
      return plan.priceMonthly > currentPrice ? "Upgrade" : "Downgrade";
    return "Get started";
  };

  const modalAction =
    selectedPlan && isPaidPlan
      ? selectedPlan.priceMonthly > currentPrice
        ? "Upgrade"
        : "Switch"
      : "Subscribe";

  /* ---------------- Render ---------------- */
  return (
    <section id="pricing" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-blue-600">Pricing</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose the Plan That Fits Your Business
          </h2>
          {!profileLoading && !isLoggedIn && (
            <p className="mt-4 text-sm text-slate-500">
              You&apos;ll sign in before paying. New here?{" "}
              <Link
                href={signupHref}
                className="font-medium text-blue-600 underline-offset-4 hover:underline"
              >
                Create a free account
              </Link>
              .
            </p>
          )}

          {/* Toggle Category */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
              <button
                type="button"
                onClick={() => setPlanCategory("standard")}
                className={[
                  "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
                  planCategory === "standard"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                <span>Standard Plans</span>
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    planCategory === "standard"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  Starter &amp; Growth
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPlanCategory("scale")}
                className={[
                  "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
                  planCategory === "scale"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                <span>High-Volume &amp; Agency</span>
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    planCategory === "scale"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  Pro &amp; Enterprise
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Error loading plans */}
        {plansError && (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <p className="text-sm text-slate-600">
              We couldn&apos;t load the plans right now.
            </p>
            <button
              type="button"
              onClick={() => refetchPlans()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {plansLoading && (
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:gap-8">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-[28rem] animate-pulse rounded-2xl border border-slate-200 bg-white motion-reduce:animate-none"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!plansLoading && !plansError && paidPlans.length === 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">
              No plans are available right now. Please check back soon.
            </p>
          </div>
        )}

        {/* Plans: 2 Balanced Cards per view */}
        {!plansLoading && !plansError && paidPlans.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:items-stretch lg:gap-8">
            {(planCategory === "standard"
              ? paidPlans.filter((p) => p.plan === "STARTER" || p.plan === "GROWTH")
              : paidPlans.filter((p) => p.plan === "PRO" || p.plan === "ENTERPRISE")
            ).map((plan) => {
              const featured = !!plan.isPopular;
              const isCurrent =
                isLoggedIn && plan.plan === currentPlanKey && isActive;
              const showTrial = featured && showTrialButton && !isLoggedIn;
              const features: string[] = Array.isArray(plan.features)
                ? plan.features
                : [];

              return (
                <div
                  key={plan.plan}
                  className={`relative flex flex-col rounded-2xl p-8 ${
                    featured
                      ? "bg-blue-600 shadow-xl shadow-blue-600/20 lg:-my-4 lg:py-12"
                      : "border border-slate-200 bg-white"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950">
                      Most Popular
                    </span>
                  )}

                  <p
                    className={`text-xs font-semibold tracking-wide ${
                      featured ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {plan.name?.toUpperCase()}
                  </p>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span
                      className={`text-4xl font-bold tracking-tight ${
                        featured ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {currentCountry.currencySymbol}{getPlanPrice(plan)}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        featured ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      /month
                    </span>
                    <span
                      className={`ml-1 rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                        featured
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {currentCountry.currency}
                    </span>
                  </div>

                  <p
                    className={`mt-4 text-sm leading-relaxed ${
                      featured ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            featured ? "bg-blue-500" : "bg-blue-100"
                          }`}
                        >
                          <Check
                            className={`h-2.5 w-2.5 ${
                              featured ? "text-white" : "text-blue-600"
                            }`}
                            strokeWidth={3}
                          />
                        </span>
                        <span
                          className={`text-sm ${
                            featured ? "text-blue-50" : "text-slate-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={isCurrent || profileLoading}
                    onClick={() => handleSelect(plan)}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      featured
                        ? "bg-white text-blue-600 hover:bg-blue-50 focus-visible:ring-white focus-visible:ring-offset-blue-600"
                        : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600"
                    }`}
                  >
                    {profileLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {buttonLabel(plan)}
                  </button>

                  {showTrial && (
                    <Link
                      href={signupHref}
                      className="mt-3 w-full rounded-lg border border-white/40 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      14-day free trial
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- Checkout modal (logged-in users only) ---------------- */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !creatingCheckout && setSelectedPlan(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${modalAction} ${selectedPlan.name}`}
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
                  {currentCountry.currencySymbol}{getPlanPrice(selectedPlan)}
                </span>
                <span className="text-sm text-blue-100">/ month</span>
                <span className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-xs font-semibold text-white">
                  {currentCountry.currency}
                </span>
              </div>
            </div>

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
                What&apos;s included
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
                {(Array.isArray(selectedPlan.features)
                  ? selectedPlan.features
                  : []
                )
                  .slice(0, 4)
                  .map((f) => (
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
                  {currency(selectedPlan.priceMonthly, selectedPlan.currency)}
                </span>
              </div>

              {modalError && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200"
                >
                  {modalError}
                </p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
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
    </section>
  );
}
