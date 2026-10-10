"use client";

import { useCallback, useEffect, useState } from "react";

import {
  useGetAvailablePlansPricingQuery,
  useGetMyCurrentSubscriptionQuery,
} from "@/redux/api/userDashboard/subscription/subscriptionApi";

import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";

/* ------------------------------------------------------------------ */
/*  Constants (same keys the Plan & Billing page writes)              */
/* ------------------------------------------------------------------ */

const BUSINESS_CACHE_KEY = "gmr_business_id";
const PENDING_KEY = "gmr_pending_checkout";
const POLL_MS = 2500;
const GIVE_UP_MS = 45_000;

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                    */
/* ------------------------------------------------------------------ */

export const currency = (n?: number, cur = "USD") =>
  typeof n === "number"
    ? n.toLocaleString("en-US", {
        style: "currency",
        currency: cur,
        maximumFractionDigits: 2,
      })
    : "—";

export const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export type PaymentState =
  /** payment is done, waiting for the backend webhook to switch the plan */
  | "activating"
  /** the new plan is live */
  | "active"
  /** waited too long, plan still not switched */
  | "delayed"
  /** page opened without a recent checkout and without a paid plan */
  | "none";

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

export function usePaymentSuccess() {
  const { data: profileRes, isLoading: profileLoading } =
    useGetMeProfileQuery(undefined);
  const { data: plansRes } = useGetAvailablePlansPricingQuery(undefined);

  const [ready, setReady] = useState(false);
  const [cachedBusinessId, setCachedBusinessId] = useState("");
  const [expectedPlan, setExpectedPlan] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  // Read what the billing page stored before redirecting to Stripe
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BUSINESS_CACHE_KEY);
      if (saved) setCachedBusinessId(saved);
    } catch {}

    let sid = new URLSearchParams(window.location.search).get("session_id");
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (raw) {
        const pending = JSON.parse(raw);
        if (Date.now() - pending.startedAt < 60 * 60 * 1000) {
          setExpectedPlan(pending.plan);
          sid = sid ?? pending.sessionId ?? null;
        }
      }
    } catch {}
    setSessionId(sid);
    setReady(true);
  }, []);

  const profile = profileRes?.data;
  const businessId: string =
    profile?.businessId ?? profile?.businesses?.[0]?.id ?? cachedBusinessId;
  const businessName: string =
    profile?.businesses?.[0]?.name ?? profile?.name ?? "";

  const {
    data: subRes,
    isLoading: subLoading,
    refetch,
  } = useGetMyCurrentSubscriptionQuery(businessId, { skip: !businessId });

  const sub = subRes?.data?.subscription;
  const quotas = subRes?.data?.quotas;
  const plans: any[] = plansRes?.data ?? [];

  const loading = !ready || profileLoading || (!!businessId && subLoading);

  /* ---------------- state machine ---------------- */
  const subIsActive = sub?.status === "ACTIVE";
  const subIsPaid = !!sub && sub.plan !== "FREE_TRIAL";

  let state: PaymentState;
  if (expectedPlan) {
    if (sub?.plan === expectedPlan && subIsActive) state = "active";
    else state = timedOut ? "delayed" : "activating";
  } else {
    state = subIsPaid && subIsActive ? "active" : "none";
  }

  // Poll while we wait for the webhook to switch the plan
  useEffect(() => {
    if (loading || state !== "activating" || !businessId) return;
    const poll = setInterval(() => refetch(), POLL_MS);
    const giveUp = setTimeout(() => setTimedOut(true), GIVE_UP_MS);
    return () => {
      clearInterval(poll);
      clearTimeout(giveUp);
    };
  }, [loading, state, businessId, refetch]);

  // Done: forget the pending checkout so a later visit doesn't re-check it
  useEffect(() => {
    if (state === "active" && expectedPlan) {
      try {
        sessionStorage.removeItem(PENDING_KEY);
      } catch {}
    }
  }, [state, expectedPlan]);

  const recheck = useCallback(() => {
    setTimedOut(false);
    if (businessId) refetch();
  }, [businessId, refetch]);

  /* ---------------- values to display ---------------- */
  // While activating, show the plan being bought. Once active, show the real one.
  const showLive = state === "active" || !expectedPlan;
  const planData = plans.find((p) => p.plan === (expectedPlan ?? sub?.plan));

  return {
    loading,
    state,
    recheck,
    businessName,
    planName:
      (showLive ? sub?.planName : planData?.name) ?? planData?.name ?? "",
    price: showLive ? sub?.priceMonthly : planData?.priceMonthly,
    currencyCode: (showLive ? sub?.currency : planData?.currency) ?? "USD",
    periodStart: state === "active" ? sub?.currentPeriodStart : undefined,
    periodEnd: state === "active" ? sub?.currentPeriodEnd : undefined,
    limits: {
      sms: showLive ? quotas?.sms?.limit : planData?.smsLimit,
      aiReply: showLive ? quotas?.aiReply?.limit : planData?.aiReplyLimit,
      nfc: showLive ? quotas?.nfcCardsIncluded : planData?.nfcCardsIncluded,
    },
    reference: sessionId ? `cs_…${sessionId.slice(-8)}` : null,
  };
}
