"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import QRCode from "qrcode";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import CountrySelect, { CountryOption } from "./CountrySelect";
import { Icon } from "./icons";
import { MapPin } from "@/components/onBoardingCom/MapView";
import { useRouter } from "next/navigation";

// Leaflet touches `window` on import, so it must never run during SSR.
const MapView = dynamic(() => import("@/components/onBoardingCom/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
  ),
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
type ReviewTiming = "2h" | "5h" | "24h" | "custom";

interface Competitor {
  id: string;
  name: string;
  initials: string;
  color: string;
  offset: [number, number]; // lat/lng offset from the business, for the map
}

interface FormState {
  businessName: string;
  country: string;
  gmbLink: string;
  gmbConnected: boolean;
  reviewTiming: ReviewTiming;
  customHours: string;
  selectedCompetitors: string[];
  nfcStatus: "idle" | "generating" | "ready";
}

export interface GrowMoreReviewsOnboardingProps {
  /** Public path (or remote URL) for the storefront hero photo shown on the right. */
  heroImageSrc?: string;
  /** Optional photo of the physical NFC/QR review stand. Falls back to a drawn mockup. */
  nfcPhotoSrc?: string;
  /** Called once the person finishes the wizard and clicks "Go Dashboard". */
  onComplete?: (data: FormState) => void;
  /** Called on every successful step change — useful for analytics. */
  onStepChange?: (step: StepIndex) => void;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STEPS: { id: StepIndex; label: string }[] = [
  { id: 1, label: "Business Setup" },
  { id: 2, label: "GMB Connect" },
  { id: 3, label: "Review request" },
  { id: 4, label: "Competitor" },
  { id: 5, label: "NFC Setup" },
  { id: 6, label: "Complete" },
];

/** ISO 3166-1 alpha-2 codes power both the flag icon and the map center. */
const COUNTRIES: (CountryOption & { center: [number, number] })[] = [
  { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
  { code: "US", name: "United States", center: [40.7128, -74.006] },
  { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
  { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
  { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
  { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
  { code: "IN", name: "India", center: [28.6139, 77.209] },
];

const COMPETITORS: Competitor[] = [
  {
    id: "c1",
    name: "The Roasted Bean",
    initials: "RB",
    color: "#6D5BD0",
    offset: [0.004, 0.006],
  },
  {
    id: "c2",
    name: "Java & Co.",
    initials: "JC",
    color: "#0EA5A4",
    offset: [-0.006, 0.003],
  },
  {
    id: "c3",
    name: "Filter House",
    initials: "FH",
    color: "#E1A32A",
    offset: [0.002, -0.007],
  },
  {
    id: "c4",
    name: "Bean There Cafe",
    initials: "BT",
    color: "#DC5F45",
    offset: [-0.003, -0.004],
  },
  {
    id: "c5",
    name: "Northside Coffee",
    initials: "NC",
    color: "#3B82C4",
    offset: [0.007, -0.001],
  },
];

const TIMING_OPTIONS: { id: ReviewTiming; label: string }[] = [
  { id: "2h", label: "2 hours after service" },
  { id: "5h", label: "5 hours after service" },
  { id: "24h", label: "24 hours after service" },
  { id: "custom", label: "Custom time" },
];

const DEFAULT_STATE: FormState = {
  businessName: "",
  country: "GB",
  gmbLink: "",
  gmbConnected: false,
  reviewTiming: "2h",
  customHours: "3",
  selectedCompetitors: COMPETITORS.map((c) => c.id),
  nfcStatus: "idle",
};

/* ------------------------------------------------------------------ */
/*  Stepper                                                             */
/* ------------------------------------------------------------------ */

function Stepper({
  current,
  onJump,
}: {
  current: StepIndex;
  onJump: (step: StepIndex) => void;
}) {
  return (
    <ol className="flex w-full items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
      {STEPS.map((step, idx) => {
        const done = step.id <= current;
        const isLast = idx === STEPS.length - 1;
        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex min-w-[52px] flex-col items-center text-center sm:min-w-[64px]">
              <button
                type="button"
                onClick={() => done && onJump(step.id)}
                disabled={!done}
                aria-current={step.id === current ? "step" : undefined}
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs",
                  done
                    ? "bg-emerald-500 text-white enabled:cursor-pointer enabled:hover:bg-emerald-600"
                    : "border border-gray-300 bg-white text-gray-400",
                ].join(" ")}
              >
                {done ? (
                  <Icon.Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  String(step.id).padStart(2, "0")
                )}
              </button>
              <span
                className={[
                  "mt-1.5 text-[10px] leading-tight sm:text-xs",
                  step.id === current
                    ? "font-medium text-gray-900"
                    : "text-gray-500",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={[
                  "mx-1 mt-3.5 h-px flex-1 sm:mt-4",
                  step.id < current ? "bg-emerald-400" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared UI bits                                                      */
/* ------------------------------------------------------------------ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function PrimaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={[
        "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors",
        "hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export default function GrowMoreReviewsOnboarding({
  heroImageSrc = "/images/onBoarding/right-side.png",
  nfcPhotoSrc,
  onComplete,
  onStepChange,
}: GrowMoreReviewsOnboardingProps) {
  const [step, setStep] = useState<StepIndex>(1);
  const [data, setData] = useState<FormState>(DEFAULT_STATE);
  const [nameError, setNameError] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const router = useRouter();

  const goTo = useCallback(
    (next: StepIndex) => {
      setStep(next);
      onStepChange?.(next);
    },
    [onStepChange],
  );

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
    [data.country],
  );

  const businessPin: MapPin[] = useMemo(
    () => [
      {
        id: "business",
        position: selectedCountry.center,
        label: data.businessName || "Your business",
        color: "#2563EB",
        primary: true,
      },
    ],
    [selectedCountry, data.businessName],
  );

  const competitorPins: MapPin[] = useMemo(
    () => [
      ...businessPin,
      ...COMPETITORS.map((c) => ({
        id: c.id,
        position: [
          selectedCountry.center[0] + c.offset[0],
          selectedCountry.center[1] + c.offset[1],
        ] as [number, number],
        label: c.name,
        color: c.color,
      })),
    ],
    [businessPin, selectedCountry],
  );

  /* ---- step handlers ---- */

  const handleBusinessContinue = () => {
    if (!data.businessName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    goTo(2);
  };

  const handleConnectGMB = () => {
    if (data.gmbConnected) return;
    setConnecting(true);
    // Simulated connection round-trip — swap for a real Google Business Profile API call.
    setTimeout(() => {
      setConnecting(false);
      setData((d) => ({ ...d, gmbConnected: true }));
    }, 900);
  };

  const toggleCompetitor = (id: string) => {
    setData((d) => ({
      ...d,
      selectedCompetitors: d.selectedCompetitors.includes(id)
        ? d.selectedCompetitors.filter((c) => c !== id)
        : [...d.selectedCompetitors, id],
    }));
  };

  const handleGenerateNfc = async () => {
    setQrError(null);
    setData((d) => ({ ...d, nfcStatus: "generating" }));
    // The payload is the actual link customers land on when they tap or scan —
    // their real GMB review link if they gave one, else a placeholder.
    const payload =
      data.gmbLink.trim() ||
      `https://search.google.com/local/writereview?business=${encodeURIComponent(data.businessName || "your-business")}`;
    try {
      const url = await QRCode.toDataURL(payload, {
        width: 240,
        margin: 1,
        color: { dark: "#111827", light: "#ffffff" },
      });
      setQrDataUrl(url);
      setData((d) => ({ ...d, nfcStatus: "ready" }));
    } catch (err) {
      setQrError("Couldn't generate the code. Try again.");
      setData((d) => ({ ...d, nfcStatus: "idle" }));
    }
  };

  const handleDownloadQr = async () => {
    if (!qrDataUrl) return;
    const res = await fetch(qrDataUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleGoDashboard = () => {
    onComplete?.(data);
    console.log(data);
    router.push("/dashboard");
  };

  // Regenerate the code automatically if the person edits their GMB link
  // after already generating one, so the printed code never goes stale.
  useEffect(() => {
    if (data.nfcStatus === "ready") {
      setData((d) => ({ ...d, nfcStatus: "idle" }));
      setQrDataUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.gmbLink]);

  /* ---- step content ---- */

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome to Grow More Reviews!
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Let&apos;s get your business ready to grow more reviews.
            </p>

            <div className="mt-7">
              <FieldLabel>Business Name</FieldLabel>
              <input
                type="text"
                value={data.businessName}
                onChange={(e) => {
                  setData((d) => ({ ...d, businessName: e.target.value }));
                  if (nameError) setNameError(false);
                }}
                placeholder="e.g. Coffee House"
                className={[
                  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400",
                  "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                  nameError ? "border-red-400" : "border-gray-200",
                ].join(" ")}
              />
              {nameError && (
                <p className="mt-1.5 text-xs text-red-500">
                  Enter your business name to continue.
                </p>
              )}
            </div>

            <div className="mt-5">
              <FieldLabel>Country</FieldLabel>
              <CountrySelect
                value={data.country}
                options={COUNTRIES}
                onChange={(code: any) =>
                  setData((d) => ({ ...d, country: code }))
                }
              />
            </div>

            <PrimaryButton className="mt-8" onClick={handleBusinessContinue}>
              Continue
            </PrimaryButton>
          </div>
        );

      case 2:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Connect your Google Business Profile
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Get real-time reviews, insights and manage your online reputation.
            </p>

            <div className="mt-7">
              <FieldLabel>Google Business Profile (GMB) Link</FieldLabel>
              <input
                type="url"
                value={data.gmbLink}
                onChange={(e) =>
                  setData((d) => ({ ...d, gmbLink: e.target.value }))
                }
                placeholder="https://g.page/your-business"
                disabled={data.gmbConnected}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            <PrimaryButton
              className="mt-5"
              onClick={handleConnectGMB}
              disabled={connecting || data.gmbConnected}
            >
              {connecting && <Icon.Spinner className="h-4 w-4 animate-spin" />}
              {data.gmbConnected
                ? "Connected"
                : connecting
                  ? "Connecting…"
                  : "Connect GMB"}
            </PrimaryButton>

            {data.gmbConnected && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon.Store className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {data.businessName || "Your business"}
                  </span>
                </div>
                <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
                  <MapView
                    center={selectedCountry.center}
                    zoom={14}
                    pins={businessPin}
                  />
                </div>
                <PrimaryButton onClick={() => goTo(3)}>Continue</PrimaryButton>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              How do you want to collect reviews?
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Choose your preferred method to request reviews from customers.
            </p>

            <div className="mt-7">
              <h2 className="mb-3 text-sm font-medium text-gray-700">
                When should we ask customers?
              </h2>
              <div className="space-y-2.5">
                {TIMING_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                      data.reviewTiming === opt.id
                        ? "border-emerald-400 bg-emerald-50/60"
                        : "border-gray-200 bg-white hover:border-gray-300",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        data.reviewTiming === opt.id
                          ? "border-emerald-500"
                          : "border-gray-300",
                      ].join(" ")}
                    >
                      {data.reviewTiming === opt.id && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="timing"
                      className="sr-only"
                      checked={data.reviewTiming === opt.id}
                      onChange={() =>
                        setData((d) => ({ ...d, reviewTiming: opt.id }))
                      }
                    />
                    <span className="text-gray-700">{opt.label}</span>
                  </label>
                ))}

                {data.reviewTiming === "custom" && (
                  <div className="relative pl-1 pt-1">
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={data.customHours}
                      onChange={(e) =>
                        setData((d) => ({ ...d, customHours: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      hours
                    </span>
                    <Icon.Clock className="pointer-events-none absolute right-11 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <PrimaryButton className="mt-8" onClick={() => goTo(4)}>
              Continue
            </PrimaryButton>
          </div>
        );

      case 4:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Find your competitors
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              We&apos;ll automatically identify nearby competitors and compare
              your review growth.
            </p>

            <div className="mt-6 h-44 overflow-hidden rounded-xl border border-gray-200">
              <MapView
                center={selectedCountry.center}
                zoom={13}
                pins={competitorPins}
              />
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
                Your Competitors
              </div>
              <ul>
                {COMPETITORS.map((c, idx) => {
                  const checked = data.selectedCompetitors.includes(c.id);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => toggleCompetitor(c.id)}
                        className={[
                          "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                          idx % 2 === 1 ? "bg-gray-50/60" : "bg-white",
                          "hover:bg-gray-50",
                        ].join(" ")}
                      >
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.initials}
                        </span>
                        <span className="flex-1 text-gray-700">{c.name}</span>
                        <span
                          className={[
                            "flex h-4 w-4 items-center justify-center rounded border",
                            checked
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300",
                          ].join(" ")}
                        >
                          {checked && <Icon.Check className="h-3 w-3" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <PrimaryButton className="mt-6" onClick={() => goTo(5)}>
              Continue
            </PrimaryButton>
          </div>
        );

      case 5:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Set up your NFC Review Stand
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Let customers tap their phone and leave a review in seconds.
            </p>

            <div
              className="relative mt-6 flex h-60 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-cover bg-center"
              style={
                nfcPhotoSrc
                  ? {
                      backgroundImage: `linear-gradient(rgba(17,24,39,.35),rgba(17,24,39,.35)), url(${nfcPhotoSrc})`,
                    }
                  : undefined
              }
            >
              {!nfcPhotoSrc && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              )}

              {/* the physical stand */}
              <div className="relative flex flex-col items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
                {data.nfcStatus === "ready" && qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="QR code linking to your review page"
                    className="h-28 w-28"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-300">
                    <Icon.Contactless className="h-10 w-10" />
                  </div>
                )}
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <Icon.Contactless className="h-3.5 w-3.5 text-blue-500" />
                  Tap or scan to review
                </span>
              </div>
            </div>

            {qrError && <p className="mt-2 text-xs text-red-500">{qrError}</p>}

            {data.nfcStatus === "ready" ? (
              <PrimaryButton className="mt-6" onClick={handleDownloadQr}>
                <Icon.Download className="h-4 w-4" />
                Download QR code
              </PrimaryButton>
            ) : (
              <PrimaryButton
                className="mt-6"
                onClick={handleGenerateNfc}
                disabled={data.nfcStatus === "generating"}
              >
                {data.nfcStatus === "generating" && (
                  <Icon.Spinner className="h-4 w-4 animate-spin" />
                )}
                {data.nfcStatus === "generating"
                  ? "Generating…"
                  : "Generate NFC QR Code"}
              </PrimaryButton>
            )}

            {data.nfcStatus === "ready" && (
              <button
                type="button"
                onClick={() => goTo(6)}
                className="mt-3 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Continue to finish setup →
              </button>
            )}
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <span className="absolute -left-5 -top-1 text-xl">🎉</span>
              <span className="absolute -right-6 top-2 text-lg">🎊</span>
              <span className="absolute -bottom-1 left-1 text-base">✨</span>
              <span className="absolute -bottom-2 right-0 text-lg">🎈</span>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
                  <Icon.Check className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-900">
              You&apos;re all set!
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
              Your Grow More Reviews account is ready. You can now start getting
              more reviews and growing your business.
            </p>

            <PrimaryButton className="mt-8" onClick={handleGoDashboard}>
              Go Dashboard
            </PrimaryButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full items-stretch justify-center bg-gray-100 p-0 sm:p-6">
      <div className="flex w-full max-w-7xl overflow-hidden bg-white shadow-sm sm:rounded-2xl">
        {/* Left: wizard */}
        <div className="flex w-full flex-col px-5 py-6 sm:px-10 sm:py-10 lg:w-[52%]">
          <Stepper current={step} onJump={goTo} />
          <div className="mt-8 flex-1 sm:mt-10">{renderStep()}</div>
        </div>

        {/* Right: hero photo — hidden on small screens to keep the form the focus */}
        <div className="relative hidden lg:block lg:w-[48%]">
          <Image
            src={heroImageSrc}
            alt="Storefront of the business being onboarded"
            fill
            sizes="(min-width: 1024px) 48vw, 0px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
