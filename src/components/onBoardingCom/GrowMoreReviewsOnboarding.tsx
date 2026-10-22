// "use client";

// import Image from "next/image";
// import dynamic from "next/dynamic";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";

// import CountrySelect, { CountryOption } from "./CountrySelect";
// import { Icon } from "./icons";
// import { MapPin } from "@/components/onBoardingCom/MapView";
// // 👇 adjust this path to wherever your onboarding slice lives
// import {
//   useGetCheckUserBusinessProfileQuery,
//   useGetStep1Query,
//   usePostStep1Mutation,
//   usePostStep2Mutation,
//   usePatchStep2Mutation,
//   usePatchStep3Mutation,
//   useGetStep4Query,
//   usePostStep4Mutation,
//   usePatchStep4Mutation,
//   useGetStep5Query,
//   usePostStep5Mutation,
//   usePatchStep5Mutation,
// } from "@/redux/api/onboarding/onboardingSliceApi";

// // Leaflet touches `window` on import, so it must never run during SSR.
// const MapView = dynamic(() => import("@/components/onBoardingCom/MapView"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
//   ),
// });

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
// type ReviewTiming = "2h" | "5h" | "24h" | "custom";
// type RequestChannel = "SMS" | "EMAIL";

// interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
// }

// /** A Google Place as returned by /business/search-places and /competitor/search */
// interface Place {
//   placeId: string;
//   name: string;
//   address: string;
//   rating?: number;
//   userRatingsTotal?: number;
//   googleMapsUrl?: string;
//   googleReviewUrl?: string;
//   category?: string;
// }

// interface Business {
//   id: string;
//   userId?: string;
//   name: string;
//   placeId: string;
//   address?: string;
//   phone?: string | null;
//   website?: string | null;
//   category?: string | null;
//   rating?: number | null;
//   userRatingsTotal?: number | null;
//   googleReviewUrl?: string | null;
//   googleMapsUrl?: string | null;
//   monthlyGoal: number;
//   isOnboardingCompleted: boolean;
//   onboardingStep: number;
//   autoReviewRequests: boolean;
//   followUpReminder: boolean;
//   defaultRequestChannel: string;
//   requestDelay: string;
// }

// interface NfcCard {
//   id?: string;
//   cardId?: string;
//   label: string;
//   shortCode: string;
//   tapUrl: string;
//   qrCodeDataUrl?: string;
//   qrCodeSvg?: string;
// }

// interface FormState {
//   businessName: string;
//   country: string;
//   monthlyGoal: string;
//   gmbConnected: boolean;
//   defaultRequestChannel: RequestChannel;
//   reviewTiming: ReviewTiming;
//   customHours: string;
//   followUpReminder: boolean;
//   autoReviewRequests: boolean;
//   nfcLabel: string;
// }

// export interface OnboardingResult {
//   form: FormState;
//   business: Business | null;
// }

// export interface GrowMoreReviewsOnboardingProps {
//   /** Public path (or remote URL) for the storefront hero photo shown on the right. */
//   heroImageSrc?: string;
//   /** Optional photo of the physical NFC/QR review stand. Falls back to a drawn mockup. */
//   nfcPhotoSrc?: string;
//   /** Called once the person finishes the wizard and clicks "Go Dashboard". */
//   onComplete?: (result: OnboardingResult) => void;
//   /** Called on every successful step change — useful for analytics. */
//   onStepChange?: (step: StepIndex) => void;
// }

// /* ------------------------------------------------------------------ */
// /*  Static data                                                        */
// /* ------------------------------------------------------------------ */

// const STEPS: { id: StepIndex; label: string }[] = [
//   { id: 1, label: "Business Setup" },
//   { id: 2, label: "GMB Connect" },
//   { id: 3, label: "Review request" },
//   { id: 4, label: "Competitor" },
//   { id: 5, label: "NFC Setup" },
//   { id: 6, label: "Complete" },
// ];

// /**
//  * ISO 3166-1 alpha-2 codes power both the flag icon and the map center.
//  * The country only affects the map preview; it is not sent to the API.
//  */
// const COUNTRIES: (CountryOption & { center: [number, number] })[] = [
//   { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
//   { code: "US", name: "United States", center: [40.7128, -74.006] },
//   { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
//   { code: "NL", name: "Netherlands", center: [52.3676, 4.9041] },
//   { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
//   { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
//   { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
//   { code: "IN", name: "India", center: [28.6139, 77.209] },
// ];

// /** `delay` is the exact string the backend stores in `requestDelay`. */
// const TIMING_OPTIONS: { id: ReviewTiming; label: string; delay: string }[] = [
//   { id: "2h", label: "2 hours after service", delay: "2 hours after service" },
//   { id: "5h", label: "5 hours after service", delay: "5 hours after service" },
//   {
//     id: "24h",
//     label: "24 hours after service",
//     delay: "24 hours after service",
//   },
//   { id: "custom", label: "Custom time", delay: "" },
// ];

// // Confirm these enum values with the backend.
// const CHANNEL_OPTIONS: { id: RequestChannel; label: string }[] = [
//   { id: "SMS", label: "SMS" },
//   { id: "EMAIL", label: "Email" },
// ];

// /** Value for `?format=` on GET /nfc/:cardId/qrcode — confirm with the backend. */
// const QR_FORMAT = "png";

// const AVATAR_COLORS = [
//   "#6D5BD0",
//   "#0EA5A4",
//   "#E1A32A",
//   "#DC5F45",
//   "#3B82C4",
//   "#7C9A3C",
// ];

// const DEFAULT_STATE: FormState = {
//   businessName: "",
//   country: "CA",
//   monthlyGoal: "25",
//   gmbConnected: false,
//   defaultRequestChannel: "SMS",
//   reviewTiming: "2h",
//   customHours: "3",
//   followUpReminder: true,
//   autoReviewRequests: true,
//   nfcLabel: "Table 1 - Counter",
// };

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */

// function apiMessage(err: unknown, fallback: string): string {
//   const e = err as { data?: { message?: string | string[] }; error?: string };
//   const m = e?.data?.message;
//   if (Array.isArray(m)) return m.join(", ");
//   return m || e?.error || fallback;
// }

// function useDebounce<T>(value: T, delay = 400): T {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return debounced;
// }

// function buildRequestDelay(timing: ReviewTiming, customHours: string): string {
//   if (timing === "custom") {
//     const h = Math.min(72, Math.max(1, Math.round(Number(customHours)) || 1));
//     return `${h} ${h === 1 ? "hour" : "hours"} after service`;
//   }
//   return TIMING_OPTIONS.find((o) => o.id === timing)!.delay;
// }

// function parseRequestDelay(delay?: string): {
//   timing: ReviewTiming;
//   customHours: string;
// } {
//   const known = TIMING_OPTIONS.find((o) => o.delay && o.delay === delay);
//   if (known) return { timing: known.id, customHours: "3" };
//   const m = delay?.match(/^(\d+)\s*hours?/i);
//   if (m) return { timing: "custom", customHours: m[1] };
//   return { timing: "2h", customHours: "3" };
// }

// function initialsOf(name: string): string {
//   return (
//     name
//       .split(/\s+/)
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((w) => w[0]?.toUpperCase())
//       .join("") || "?"
//   );
// }

// function colorFor(id: string): string {
//   let h = 0;
//   for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
//   return AVATAR_COLORS[h % AVATAR_COLORS.length];
// }

// /* ------------------------------------------------------------------ */
// /*  Stepper                                                             */
// /* ------------------------------------------------------------------ */

// function Stepper({
//   current,
//   maxStep,
//   onJump,
// }: {
//   current: StepIndex;
//   maxStep: StepIndex;
//   onJump: (step: StepIndex) => void;
// }) {
//   return (
//     <ol className="flex w-full items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
//       {STEPS.map((step, idx) => {
//         const done = step.id <= current;
//         const reachable = step.id <= maxStep;
//         const isLast = idx === STEPS.length - 1;
//         return (
//           <li key={step.id} className="flex flex-1 items-center last:flex-none">
//             <div className="flex min-w-[52px] flex-col items-center text-center sm:min-w-[64px]">
//               <button
//                 type="button"
//                 onClick={() => reachable && onJump(step.id)}
//                 disabled={!reachable}
//                 aria-current={step.id === current ? "step" : undefined}
//                 className={[
//                   "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs",
//                   done
//                     ? "bg-emerald-500 text-white enabled:cursor-pointer enabled:hover:bg-emerald-600"
//                     : reachable
//                       ? "border border-emerald-400 bg-white text-emerald-600 enabled:cursor-pointer"
//                       : "border border-gray-300 bg-white text-gray-400",
//                 ].join(" ")}
//               >
//                 {done ? (
//                   <Icon.Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                 ) : (
//                   String(step.id).padStart(2, "0")
//                 )}
//               </button>
//               <span
//                 className={[
//                   "mt-1.5 text-[10px] leading-tight sm:text-xs",
//                   step.id === current
//                     ? "font-medium text-gray-900"
//                     : "text-gray-500",
//                 ].join(" ")}
//               >
//                 {step.label}
//               </span>
//             </div>
//             {!isLast && (
//               <div
//                 className={[
//                   "mx-1 mt-3.5 h-px flex-1 sm:mt-4",
//                   step.id < current ? "bg-emerald-400" : "bg-gray-200",
//                 ].join(" ")}
//               />
//             )}
//           </li>
//         );
//       })}
//     </ol>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Shared UI bits                                                      */
// /* ------------------------------------------------------------------ */

// function FieldLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <label className="mb-1.5 block text-sm font-medium text-gray-700">
//       {children}
//     </label>
//   );
// }

// function FieldError({ children }: { children?: React.ReactNode }) {
//   if (!children) return null;
//   return <p className="mt-1.5 text-xs text-red-500">{children}</p>;
// }

// function PrimaryButton({
//   children,
//   className = "",
//   loading = false,
//   disabled,
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
//   return (
//     <button
//       {...rest}
//       disabled={disabled || loading}
//       className={[
//         "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors",
//         "hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300",
//         className,
//       ].join(" ")}
//     >
//       {loading && <Icon.Spinner className="h-4 w-4 animate-spin" />}
//       {children}
//     </button>
//   );
// }

// const inputClass =
//   "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400";

// function Toggle({
//   checked,
//   onChange,
//   label,
//   hint,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
//   hint?: string;
// }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300"
//     >
//       <span>
//         <span className="block text-sm font-medium text-gray-800">{label}</span>
//         {hint && <span className="block text-xs text-gray-500">{hint}</span>}
//       </span>
//       <span
//         className={[
//           "relative h-5 w-9 shrink-0 rounded-full transition-colors",
//           checked ? "bg-emerald-500" : "bg-gray-300",
//         ].join(" ")}
//       >
//         <span
//           className={[
//             "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
//             checked ? "left-[18px]" : "left-0.5",
//           ].join(" ")}
//         />
//       </span>
//     </button>
//   );
// }

// function RatingLine({
//   rating,
//   total,
// }: {
//   rating?: number | null;
//   total?: number | null;
// }) {
//   if (rating == null) return null;
//   return (
//     <span className="text-xs text-gray-500">
//       <span className="text-amber-500">★</span> {rating.toFixed(1)}
//       {total != null && <> ({total.toLocaleString()} reviews)</>}
//     </span>
//   );
// }

// function PlaceRow({
//   place,
//   onClick,
//   trailing,
// }: {
//   place: Place;
//   onClick?: () => void;
//   trailing?: React.ReactNode;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
//     >
//       <span
//         className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
//         style={{ backgroundColor: colorFor(place.placeId) }}
//       >
//         {initialsOf(place.name)}
//       </span>
//       <span className="min-w-0 flex-1">
//         <span className="block truncate text-sm font-medium text-gray-800">
//           {place.name}
//         </span>
//         <span className="block truncate text-xs text-gray-500">
//           {place.address}
//         </span>
//         <RatingLine rating={place.rating} total={place.userRatingsTotal} />
//       </span>
//       {trailing}
//     </button>
//   );
// }

// function ErrorBanner({ message }: { message: string | null }) {
//   if (!message) return null;
//   return (
//     <div
//       role="alert"
//       className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
//     >
//       {message}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Main component                                                      */
// /* ------------------------------------------------------------------ */

// export default function GrowMoreReviewsOnboarding({
//   heroImageSrc = "/images/onBoarding/right-side.png",
//   nfcPhotoSrc,
//   onComplete,
//   onStepChange,
// }: GrowMoreReviewsOnboardingProps) {
//   const router = useRouter();

//   const [step, setStep] = useState<StepIndex>(1);
//   const [maxStep, setMaxStep] = useState<StepIndex>(1);
//   const [data, setData] = useState<FormState>(DEFAULT_STATE);

//   const [business, setBusiness] = useState<Business | null>(null);
//   const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
//   const [placeQuery, setPlaceQuery] = useState("");
//   const [errors, setErrors] = useState<{
//     name?: string;
//     place?: string;
//     goal?: string;
//   }>({});

//   const [competitorQuery, setCompetitorQuery] = useState("");
//   const [selectedCompetitors, setSelectedCompetitors] = useState<
//     Record<string, Place>
//   >({});
//   const [addedCompetitorIds, setAddedCompetitorIds] = useState<string[]>([]);

//   const [card, setCard] = useState<NfcCard | null>(null);
//   const [copied, setCopied] = useState(false);

//   const [submitting, setSubmitting] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   /* ---- API hooks ---- */

//   const { data: profileRes, isLoading: profileLoading } =
//     useGetCheckUserBusinessProfileQuery(undefined);

//   const debouncedPlaceQuery = useDebounce(placeQuery.trim());
//   const placeSearchEnabled =
//     step === 1 &&
//     !business &&
//     !selectedPlace &&
//     debouncedPlaceQuery.length >= 2;
//   const {
//     currentData: placesRes,
//     isFetching: placesFetching,
//     isError: placesError,
//   } = useGetStep1Query(encodeURIComponent(debouncedPlaceQuery), {
//     skip: !placeSearchEnabled,
//   });
//   const placeResults: Place[] =
//     (placesRes as ApiResponse<Place[]> | undefined)?.data ?? [];

//   const debouncedCompetitorQuery = useDebounce(competitorQuery.trim());
//   const {
//     currentData: competitorsRes,
//     isFetching: competitorsFetching,
//     isError: competitorsError,
//   } = useGetStep4Query(encodeURIComponent(debouncedCompetitorQuery), {
//     skip: step !== 4 || !business || debouncedCompetitorQuery.length < 2,
//   });
//   const competitorResults: Place[] = (
//     (competitorsRes as ApiResponse<Place[]> | undefined)?.data ?? []
//   ).filter((p) => p.placeId !== business?.placeId);

//   const cardId = card?.id ?? card?.cardId;
//   const { data: qrRes } = useGetStep5Query(
//     { query: QR_FORMAT, cardId },
//     { skip: !cardId },
//   );
//   const qrPayload = (qrRes as ApiResponse<Partial<NfcCard>> | undefined)?.data;
//   // Prefer the fresh GET result; fall back to what the POST already returned.
//   const qrDataUrl = qrPayload?.qrCodeDataUrl ?? card?.qrCodeDataUrl ?? null;
//   const qrSvg = qrPayload?.qrCodeSvg ?? card?.qrCodeSvg ?? null;

//   const [postStep1] = usePostStep1Mutation();
//   const [postStep2] = usePostStep2Mutation();
//   const [patchStep2] = usePatchStep2Mutation();
//   const [patchStep3] = usePatchStep3Mutation();
//   const [postStep4] = usePostStep4Mutation();
//   const [patchStep4] = usePatchStep4Mutation();
//   const [postStep5] = usePostStep5Mutation();
//   const [patchStep5] = usePatchStep5Mutation();

//   /* ---- resume an unfinished onboarding ---- */

//   const hydrated = useRef(false);
//   useEffect(() => {
//     if (hydrated.current || profileLoading) return;
//     hydrated.current = true;

//     const raw = (profileRes as ApiResponse<Business | Business[]> | undefined)
//       ?.data;
//     const biz = Array.isArray(raw) ? raw[0] : raw;
//     if (!biz?.id) return; // brand-new user → start at step 1

//     if (biz.isOnboardingCompleted) {
//       router.replace("/dashboard");
//       return;
//     }

//     const resume = Math.min(
//       Math.max(biz.onboardingStep || 1, 1),
//       6,
//     ) as StepIndex;
//     const { timing, customHours } = parseRequestDelay(biz.requestDelay);

//     setBusiness(biz);
//     setSelectedPlace({
//       placeId: biz.placeId,
//       name: biz.name,
//       address: biz.address ?? "",
//       rating: biz.rating ?? undefined,
//       userRatingsTotal: biz.userRatingsTotal ?? undefined,
//       googleMapsUrl: biz.googleMapsUrl ?? undefined,
//       googleReviewUrl: biz.googleReviewUrl ?? undefined,
//       category: biz.category ?? undefined,
//     });
//     setData((d) => ({
//       ...d,
//       businessName: biz.name,
//       monthlyGoal: String(biz.monthlyGoal ?? d.monthlyGoal),
//       gmbConnected: resume >= 3,
//       defaultRequestChannel:
//         biz.defaultRequestChannel === "EMAIL" ? "EMAIL" : "SMS",
//       reviewTiming: timing,
//       customHours,
//       followUpReminder: biz.followUpReminder ?? true,
//       autoReviewRequests: biz.autoReviewRequests ?? true,
//     }));
//     setStep(resume);
//     setMaxStep(resume);
//   }, [profileLoading, profileRes, router]);

//   // Pre-fill the competitor search with the business name the first time step 4 opens.
//   useEffect(() => {
//     if (step === 4 && business && !competitorQuery) {
//       setCompetitorQuery(business.name);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [step, business]);

//   /* ---- navigation + request plumbing ---- */

//   const goTo = useCallback(
//     (next: StepIndex) => {
//       setApiError(null);
//       setStep(next);
//       setMaxStep((m) => (next > m ? next : m));
//       onStepChange?.(next);
//     },
//     [onStepChange],
//   );

//   const jumpTo = useCallback(
//     (target: StepIndex) => {
//       setApiError(null);
//       setStep(target);
//       onStepChange?.(target);
//     },
//     [onStepChange],
//   );

//   const run = async (fn: () => Promise<void>) => {
//     setApiError(null);
//     setSubmitting(true);
//     try {
//       await fn();
//     } catch (err) {
//       setApiError(apiMessage(err, "Something went wrong. Please try again."));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /** Merge a server response into local business state without ever moving the step backwards. */
//   const mergeBusiness = (incoming?: Partial<Business> | null) => {
//     if (!incoming || typeof incoming !== "object") return;
//     setBusiness((prev) => {
//       if (!prev) return incoming.id ? (incoming as Business) : prev;
//       if (incoming.id && incoming.id !== prev.id) return prev;
//       return {
//         ...prev,
//         ...incoming,
//         onboardingStep: Math.max(
//           prev.onboardingStep ?? 0,
//           incoming.onboardingStep ?? 0,
//         ),
//       };
//     });
//   };

//   /** Never send a lower onboardingStep than the server already has (e.g. after going back). */
//   const stepToSend = (target: number) =>
//     Math.max(target, business?.onboardingStep ?? 0);

//   const selectedCountry = useMemo(
//     () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
//     [data.country],
//   );

//   const businessPin: MapPin[] = useMemo(
//     () => [
//       {
//         id: "business",
//         position: selectedCountry.center,
//         label: business?.name || data.businessName || "Your business",
//         color: "#2563EB",
//         primary: true,
//       },
//     ],
//     [selectedCountry, business?.name, data.businessName],
//   );

//   /* ---- step handlers ---- */

//   // Step 1 → POST /business, then go to step 2
//   const handleBusinessContinue = () =>
//     run(async () => {
//       const goal = Number(data.monthlyGoal);
//       const next: typeof errors = {};
//       if (!data.businessName.trim())
//         next.name = "Enter your business name to continue.";
//       if (!selectedPlace)
//         next.place = "Search for your business and select it from the list.";
//       if (!Number.isInteger(goal) || goal < 1)
//         next.goal = "Enter a goal of at least 1 review per month.";
//       setErrors(next);
//       if (Object.keys(next).length) return;

//       // Already created (person came back to step 1) → don't create a duplicate.
//       if (!business) {
//         const res = (await postStep1({
//           name: data.businessName.trim(),
//           placeId: selectedPlace!.placeId,
//           monthlyGoal: goal,
//         }).unwrap()) as ApiResponse<Business>;
//         setBusiness(res.data);
//       }
//       goTo(2);
//     });

//   // Step 2 → POST /business/:id/sync-google
//   const handleConnectGMB = () =>
//     run(async () => {
//       if (!business || data.gmbConnected) return;
//       const res = (await postStep2({
//         businessId: business.id,
//         body: {},
//       }).unwrap()) as ApiResponse<Partial<Business>> | undefined;
//       mergeBusiness(res?.data);
//       setData((d) => ({ ...d, gmbConnected: true }));
//     });

//   // Step 2 → PATCH /business/:id/onboarding { onboardingStep: 3 }
//   const handleGmbContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep2({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(3) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(3);
//     });

//   // Step 3 → PATCH /business/:id { channel, delay, toggles, onboardingStep: 4 }
//   const handleReviewRequestContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep3({
//         businessId: business.id,
//         body: {
//           defaultRequestChannel: data.defaultRequestChannel,
//           requestDelay: buildRequestDelay(data.reviewTiming, data.customHours),
//           followUpReminder: data.followUpReminder,
//           autoReviewRequests: data.autoReviewRequests,
//           onboardingStep: stepToSend(4),
//         },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(4);
//     });

//   const toggleCompetitor = (place: Place) => {
//     setSelectedCompetitors((prev) => {
//       const next = { ...prev };
//       if (next[place.placeId]) delete next[place.placeId];
//       else next[place.placeId] = place;
//       return next;
//     });
//   };

//   // Step 4 → POST /competitor (one per selection), then PATCH onboarding step 5
//   const handleCompetitorsContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const pending = Object.values(selectedCompetitors).filter(
//         (p) => !addedCompetitorIds.includes(p.placeId),
//       );

//       const results = await Promise.allSettled(
//         pending.map((p) =>
//           postStep4({
//             businessId: business.id,
//             placeId: p.placeId,
//             name: p.name,
//             address: p.address,
//           }).unwrap(),
//         ),
//       );

//       const succeeded: string[] = [];
//       const failed: string[] = [];
//       results.forEach((r, i) => {
//         if (r.status === "fulfilled") succeeded.push(pending[i].placeId);
//         else failed.push(pending[i].name);
//       });
//       if (succeeded.length)
//         setAddedCompetitorIds((prev) => [...prev, ...succeeded]);
//       if (failed.length) {
//         // Stay on the step so the person can retry just the ones that failed.
//         throw new Error(`Couldn't add: ${failed.join(", ")}. Try again.`);
//       }

//       const res = (await patchStep4({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(5) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(5);
//     });

//   // Step 5 → POST /nfc (register card + get QR)
//   const handleGenerateNfc = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await postStep5({
//         businessId: business.id,
//         label: data.nfcLabel.trim() || "Review stand",
//       }).unwrap()) as ApiResponse<NfcCard>;
//       setCard(res.data);
//     });

//   const handleDownloadQr = () => {
//     if (!qrDataUrl) return;
//     const a = document.createElement("a");
//     a.href = qrDataUrl;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleDownloadSvg = () => {
//     if (!qrSvg) return;
//     const url = URL.createObjectURL(
//       new Blob([qrSvg], { type: "image/svg+xml" }),
//     );
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.svg`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   const handleCopyTapUrl = async () => {
//     if (!card?.tapUrl) return;
//     try {
//       await navigator.clipboard.writeText(card.tapUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1800);
//     } catch {
//       setApiError("Couldn't copy the link. Copy it manually instead.");
//     }
//   };

//   // Step 5 → PATCH onboarding step 6
//   const handleNfcContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep5({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(6) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(6);
//     });

//   const handleGoDashboard = () => {
//     onComplete?.({ form: data, business });
//     router.push("/dashboard");
//   };

//   /* ---- step content ---- */

//   const renderStep = () => {
//     switch (step) {
//       case 1: {
//         const locked = !!business; // business already created → place can't change here
//         const typing = placeQuery.trim() !== debouncedPlaceQuery;
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Welcome to Grow More Reviews!
//             </h1>
//             <p className="mt-1.5 text-sm text-gray-500">
//               Let&apos;s get your business ready to grow more reviews.
//             </p>

//             <div className="mt-7">
//               <FieldLabel>Business Name</FieldLabel>
//               <input
//                 type="text"
//                 value={data.businessName}
//                 disabled={locked}
//                 onChange={(e) => {
//                   setData((d) => ({ ...d, businessName: e.target.value }));
//                   if (errors.name)
//                     setErrors((er) => ({ ...er, name: undefined }));
//                 }}
//                 placeholder="e.g. Coffee House"
//                 className={[
//                   inputClass,
//                   errors.name ? "border-red-400" : "border-gray-200",
//                 ].join(" ")}
//               />
//               <FieldError>{errors.name}</FieldError>
//             </div>

//             <div className="mt-5">
//               <FieldLabel>Find your business on Google</FieldLabel>
//               {selectedPlace ? (
//                 <div className="overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/40">
//                   <PlaceRow
//                     place={selectedPlace}
//                     trailing={
//                       !locked && (
//                         <span
//                           role="button"
//                           tabIndex={0}
//                           onClick={() => {
//                             setSelectedPlace(null);
//                             setPlaceQuery("");
//                           }}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               setSelectedPlace(null);
//                               setPlaceQuery("");
//                             }
//                           }}
//                           className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                         >
//                           Change
//                         </span>
//                       )
//                     }
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <input
//                     type="text"
//                     value={placeQuery}
//                     onChange={(e) => {
//                       setPlaceQuery(e.target.value);
//                       if (errors.place)
//                         setErrors((er) => ({ ...er, place: undefined }));
//                     }}
//                     placeholder="Search your business name and city"
//                     className={[
//                       inputClass,
//                       errors.place ? "border-red-400" : "border-gray-200",
//                     ].join(" ")}
//                   />
//                   {placeSearchEnabled && (
//                     <div className="mt-2 max-h-60 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 bg-white">
//                       {(placesFetching || typing) && (
//                         <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
//                           <Icon.Spinner className="h-3.5 w-3.5 animate-spin" />
//                           Searching Google…
//                         </div>
//                       )}
//                       {!placesFetching && placesError && (
//                         <p className="px-4 py-3 text-xs text-red-500">
//                           Search failed. Check your connection and try again.
//                         </p>
//                       )}
//                       {!placesFetching &&
//                         !placesError &&
//                         placeResults.length === 0 && (
//                           <p className="px-4 py-3 text-xs text-gray-500">
//                             No businesses found. Try adding the city name.
//                           </p>
//                         )}
//                       {!placesFetching &&
//                         placeResults.map((p) => (
//                           <PlaceRow
//                             key={p.placeId}
//                             place={p}
//                             onClick={() => {
//                               setSelectedPlace(p);
//                               setErrors((er) => ({ ...er, place: undefined }));
//                               setData((d) => ({
//                                 ...d,
//                                 businessName: d.businessName.trim()
//                                   ? d.businessName
//                                   : p.name,
//                               }));
//                             }}
//                           />
//                         ))}
//                     </div>
//                   )}
//                 </>
//               )}
//               <FieldError>{errors.place}</FieldError>
//             </div>

//             <div className="mt-5 grid gap-5 sm:grid-cols-2">
//               <div>
//                 <FieldLabel>Country</FieldLabel>
//                 <CountrySelect
//                   value={data.country}
//                   options={COUNTRIES}
//                   onChange={(code: any) =>
//                     setData((d) => ({ ...d, country: code }))
//                   }
//                 />
//               </div>
//               <div>
//                 <FieldLabel>Monthly review goal</FieldLabel>
//                 <input
//                   type="number"
//                   min={1}
//                   value={data.monthlyGoal}
//                   disabled={locked}
//                   onChange={(e) => {
//                     setData((d) => ({ ...d, monthlyGoal: e.target.value }));
//                     if (errors.goal)
//                       setErrors((er) => ({ ...er, goal: undefined }));
//                   }}
//                   className={[
//                     inputClass,
//                     errors.goal ? "border-red-400" : "border-gray-200",
//                   ].join(" ")}
//                 />
//                 <FieldError>{errors.goal}</FieldError>
//               </div>
//             </div>

//             <ErrorBanner message={apiError} />

//             <PrimaryButton
//               className="mt-8"
//               onClick={handleBusinessContinue}
//               loading={submitting}
//             >
//               {submitting ? "Saving…" : "Continue"}
//             </PrimaryButton>
//           </div>
//         );
//       }

//       case 2:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Connect your Google Business Profile
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Get real-time reviews, insights and manage your online reputation.
//             </p>

//             <div className="mt-7 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//                 <Icon.Store className="h-5 w-5" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <span className="block truncate text-sm font-medium text-gray-800">
//                   {business?.name || data.businessName || "Your business"}
//                 </span>
//                 {business?.address && (
//                   <span className="block truncate text-xs text-gray-500">
//                     {business.address}
//                   </span>
//                 )}
//                 <RatingLine
//                   rating={business?.rating}
//                   total={business?.userRatingsTotal}
//                 />
//               </div>
//               {business?.googleMapsUrl && (
//                 <a
//                   href={business.googleMapsUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   View on Maps
//                 </a>
//               )}
//             </div>

//             <ErrorBanner message={apiError} />

//             <PrimaryButton
//               className="mt-5"
//               onClick={handleConnectGMB}
//               loading={submitting && !data.gmbConnected}
//               disabled={data.gmbConnected || !business}
//             >
//               {data.gmbConnected
//                 ? "Connected"
//                 : submitting
//                   ? "Connecting…"
//                   : "Connect GMB"}
//             </PrimaryButton>

//             {data.gmbConnected && (
//               <div className="mt-5 space-y-3">
//                 <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
//                   <MapView
//                     center={selectedCountry.center}
//                     zoom={14}
//                     pins={businessPin}
//                   />
//                 </div>
//                 <PrimaryButton onClick={handleGmbContinue} loading={submitting}>
//                   Continue
//                 </PrimaryButton>
//               </div>
//             )}
//           </div>
//         );

//       case 3:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               How do you want to collect reviews?
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Choose your preferred method to request reviews from customers.
//             </p>

//             <div className="mt-7">
//               <h2 className="mb-3 text-sm font-medium text-gray-700">
//                 Send requests by
//               </h2>
//               <div className="grid grid-cols-2 gap-2.5">
//                 {CHANNEL_OPTIONS.map((ch) => (
//                   <button
//                     key={ch.id}
//                     type="button"
//                     onClick={() =>
//                       setData((d) => ({ ...d, defaultRequestChannel: ch.id }))
//                     }
//                     aria-pressed={data.defaultRequestChannel === ch.id}
//                     className={[
//                       "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
//                       data.defaultRequestChannel === ch.id
//                         ? "border-emerald-400 bg-emerald-50/60 text-gray-900"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
//                     ].join(" ")}
//                   >
//                     {ch.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               <h2 className="mb-3 text-sm font-medium text-gray-700">
//                 When should we ask customers?
//               </h2>
//               <div className="space-y-2.5">
//                 {TIMING_OPTIONS.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={[
//                       "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
//                       data.reviewTiming === opt.id
//                         ? "border-emerald-400 bg-emerald-50/60"
//                         : "border-gray-200 bg-white hover:border-gray-300",
//                     ].join(" ")}
//                   >
//                     <span
//                       className={[
//                         "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
//                         data.reviewTiming === opt.id
//                           ? "border-emerald-500"
//                           : "border-gray-300",
//                       ].join(" ")}
//                     >
//                       {data.reviewTiming === opt.id && (
//                         <span className="h-2 w-2 rounded-full bg-emerald-500" />
//                       )}
//                     </span>
//                     <input
//                       type="radio"
//                       name="timing"
//                       className="sr-only"
//                       checked={data.reviewTiming === opt.id}
//                       onChange={() =>
//                         setData((d) => ({ ...d, reviewTiming: opt.id }))
//                       }
//                     />
//                     <span className="text-gray-700">{opt.label}</span>
//                   </label>
//                 ))}

//                 {data.reviewTiming === "custom" && (
//                   <div className="relative pl-1 pt-1">
//                     <input
//                       type="number"
//                       min={1}
//                       max={72}
//                       value={data.customHours}
//                       onChange={(e) =>
//                         setData((d) => ({ ...d, customHours: e.target.value }))
//                       }
//                       className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//                       hours
//                     </span>
//                     <Icon.Clock className="pointer-events-none absolute right-11 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 space-y-2.5">
//               <Toggle
//                 checked={data.autoReviewRequests}
//                 onChange={(v) =>
//                   setData((d) => ({ ...d, autoReviewRequests: v }))
//                 }
//                 label="Send requests automatically"
//                 hint="We ask every customer without you lifting a finger."
//               />
//               <Toggle
//                 checked={data.followUpReminder}
//                 onChange={(v) =>
//                   setData((d) => ({ ...d, followUpReminder: v }))
//                 }
//                 label="Send a follow-up reminder"
//                 hint="A gentle nudge if they haven't reviewed yet."
//               />
//             </div>

//             <div className="mt-5">
//               <ErrorBanner message={apiError} />
//             </div>

//             <PrimaryButton
//               onClick={handleReviewRequestContinue}
//               loading={submitting}
//             >
//               {submitting ? "Saving…" : "Continue"}
//             </PrimaryButton>
//           </div>
//         );

//       case 4: {
//         const selectedCount = Object.keys(selectedCompetitors).length;
//         const typing = competitorQuery.trim() !== debouncedCompetitorQuery;
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Find your competitors
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Pick the nearby businesses you want to compare your review growth
//               against.
//             </p>

//             <div className="mt-6">
//               <input
//                 type="text"
//                 value={competitorQuery}
//                 onChange={(e) => setCompetitorQuery(e.target.value)}
//                 placeholder="Search competitors, e.g. coffee shop Amsterdam"
//                 className={[inputClass, "border-gray-200"].join(" ")}
//               />
//             </div>

//             <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
//               <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
//                 <span>Your Competitors</span>
//                 <span className="text-xs font-normal text-gray-500">
//                   {selectedCount} selected
//                 </span>
//               </div>

//               <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
//                 {(competitorsFetching || typing) && (
//                   <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
//                     <Icon.Spinner className="h-3.5 w-3.5 animate-spin" />
//                     Searching nearby competitors…
//                   </div>
//                 )}
//                 {!competitorsFetching && competitorsError && (
//                   <p className="px-4 py-3 text-xs text-red-500">
//                     Search failed. Try again in a moment.
//                   </p>
//                 )}
//                 {!competitorsFetching &&
//                   !competitorsError &&
//                   !typing &&
//                   competitorResults.length === 0 && (
//                     <p className="px-4 py-3 text-xs text-gray-500">
//                       No competitors found. Try a broader search.
//                     </p>
//                   )}
//                 {!competitorsFetching &&
//                   competitorResults.map((p) => {
//                     const checked = !!selectedCompetitors[p.placeId];
//                     const added = addedCompetitorIds.includes(p.placeId);
//                     return (
//                       <PlaceRow
//                         key={p.placeId}
//                         place={p}
//                         onClick={() => !added && toggleCompetitor(p)}
//                         trailing={
//                           <span
//                             className={[
//                               "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
//                               checked
//                                 ? "border-blue-600 bg-blue-600 text-white"
//                                 : "border-gray-300",
//                             ].join(" ")}
//                           >
//                             {checked && <Icon.Check className="h-3 w-3" />}
//                           </span>
//                         }
//                       />
//                     );
//                   })}
//               </div>
//             </div>

//             <div className="mt-5">
//               <ErrorBanner message={apiError} />
//             </div>

//             <PrimaryButton
//               onClick={handleCompetitorsContinue}
//               loading={submitting}
//             >
//               {submitting
//                 ? "Saving…"
//                 : selectedCount === 0
//                   ? "Skip for now"
//                   : `Continue with ${selectedCount} competitor${selectedCount === 1 ? "" : "s"}`}
//             </PrimaryButton>
//           </div>
//         );
//       }

//       case 5:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Set up your NFC Review Stand
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Let customers tap their phone and leave a review in seconds.
//             </p>

//             <div className="mt-6">
//               <FieldLabel>Stand label</FieldLabel>
//               <input
//                 type="text"
//                 value={data.nfcLabel}
//                 disabled={!!card}
//                 onChange={(e) =>
//                   setData((d) => ({ ...d, nfcLabel: e.target.value }))
//                 }
//                 placeholder="e.g. Table 1 - Counter"
//                 className={[inputClass, "border-gray-200"].join(" ")}
//               />
//             </div>

//             <div
//               className="relative mt-5 flex h-60 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-cover bg-center"
//               style={
//                 nfcPhotoSrc
//                   ? {
//                       backgroundImage: `linear-gradient(rgba(17,24,39,.35),rgba(17,24,39,.35)), url(${nfcPhotoSrc})`,
//                     }
//                   : undefined
//               }
//             >
//               {!nfcPhotoSrc && (
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
//               )}

//               {/* the physical stand */}
//               <div className="relative flex flex-col items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
//                 {qrDataUrl ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={qrDataUrl}
//                     alt="QR code linking to your review page"
//                     className="h-28 w-28"
//                   />
//                 ) : (
//                   <div className="flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-300">
//                     <Icon.Contactless className="h-10 w-10" />
//                   </div>
//                 )}
//                 <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
//                   <Icon.Contactless className="h-3.5 w-3.5 text-blue-500" />
//                   Tap or scan to review
//                 </span>
//               </div>
//             </div>

//             {card?.tapUrl && (
//               <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
//                 <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
//                   {card.tapUrl}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={handleCopyTapUrl}
//                   className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   {copied ? "Copied" : "Copy link"}
//                 </button>
//               </div>
//             )}

//             <div className="mt-4">
//               <ErrorBanner message={apiError} />
//             </div>

//             {card ? (
//               <>
//                 <PrimaryButton onClick={handleDownloadQr} disabled={!qrDataUrl}>
//                   <Icon.Download className="h-4 w-4" />
//                   Download QR code
//                 </PrimaryButton>
//                 {qrSvg && (
//                   <button
//                     type="button"
//                     onClick={handleDownloadSvg}
//                     className="mt-2 w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700"
//                   >
//                     Download as SVG
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleNfcContinue}
//                   disabled={submitting}
//                   className="mt-3 flex w-full items-center justify-center gap-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-60"
//                 >
//                   {submitting && (
//                     <Icon.Spinner className="h-4 w-4 animate-spin" />
//                   )}
//                   Continue to finish setup →
//                 </button>
//               </>
//             ) : (
//               <PrimaryButton onClick={handleGenerateNfc} loading={submitting}>
//                 {submitting ? "Generating…" : "Generate NFC QR Code"}
//               </PrimaryButton>
//             )}
//           </div>
//         );

//       case 6:
//         return (
//           <div className="flex flex-col items-center text-center">
//             <div className="relative flex h-24 w-24 items-center justify-center">
//               <span className="absolute -left-5 -top-1 text-xl">🎉</span>
//               <span className="absolute -right-6 top-2 text-lg">🎊</span>
//               <span className="absolute -bottom-1 left-1 text-base">✨</span>
//               <span className="absolute -bottom-2 right-0 text-lg">🎈</span>
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
//                   <Icon.Check className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <h1 className="mt-6 text-2xl font-semibold text-gray-900">
//               You&apos;re all set!
//             </h1>
//             <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
//               Your Grow More Reviews account is ready. You can now start getting
//               more reviews and growing your business.
//             </p>

//             <PrimaryButton className="mt-8" onClick={handleGoDashboard}>
//               Go Dashboard
//             </PrimaryButton>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   /* ---- render ---- */

//   if (profileLoading) {
//     return (
//       <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
//         <Icon.Spinner className="h-6 w-6 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen w-full items-stretch justify-center bg-gray-100 p-0 sm:p-6">
//       <div className="flex w-full max-w-7xl overflow-hidden bg-white shadow-sm sm:rounded-2xl">
//         {/* Left: wizard */}
//         <div className="flex w-full flex-col px-5 py-6 sm:px-10 sm:py-10 lg:w-[52%]">
//           <Stepper current={step} maxStep={maxStep} onJump={jumpTo} />
//           <div className="mt-8 flex-1 sm:mt-10">{renderStep()}</div>
//         </div>

//         {/* Right: hero photo — hidden on small screens to keep the form the focus */}
//         <div className="relative hidden lg:block lg:w-[48%]">
//           <Image
//             src={heroImageSrc}
//             alt="Storefront of the business being onboarded"
//             fill
//             sizes="(min-width: 1024px) 48vw, 0px"
//             className="object-cover"
//             priority
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import Image from "next/image";
// import dynamic from "next/dynamic";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";

// import CountrySelect, { CountryOption } from "./CountrySelect";
// import { Icon } from "./icons";
// import { MapPin } from "@/components/onBoardingCom/MapView";
// // 👇 adjust this path to wherever your onboarding slice lives
// import {
//   useGetCheckUserBusinessProfileQuery,
//   useGetStep1Query,
//   usePostStep1Mutation,
//   usePostStep2Mutation,
//   usePatchStep2Mutation,
//   usePatchStep3Mutation,
//   // Competitor step (AI suggestions) — slice "step 5"
//   useGetStep5Query,
//   usePostStep5Mutation,
//   usePatchStep5Mutation,
//   // NFC step — slice "step 6"
//   useGetStep6Query,
//   usePostStep6Mutation,
//   usePatchStep6Mutation,
// } from "@/redux/api/onboarding/onboardingSliceApi";

// // Leaflet touches `window` on import, so it must never run during SSR.
// const MapView = dynamic(() => import("@/components/onBoardingCom/MapView"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
//   ),
// });

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
// type ReviewTiming = "2h" | "5h" | "24h" | "custom";
// type RequestChannel = "SMS" | "EMAIL";

// interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
// }

// /** A Google Place as returned by /business/search-places */
// interface Place {
//   placeId: string;
//   name: string;
//   address: string;
//   rating?: number;
//   userRatingsTotal?: number;
//   googleMapsUrl?: string;
//   googleReviewUrl?: string;
//   category?: string;
// }

// interface Business {
//   id: string;
//   userId?: string;
//   name: string;
//   placeId: string;
//   address?: string;
//   phone?: string | null;
//   website?: string | null;
//   category?: string | null;
//   rating?: number | null;
//   userRatingsTotal?: number | null;
//   googleReviewUrl?: string | null;
//   googleMapsUrl?: string | null;
//   monthlyGoal: number;
//   isOnboardingCompleted: boolean;
//   onboardingStep: number;
//   autoReviewRequests: boolean;
//   followUpReminder: boolean;
//   defaultRequestChannel: string;
//   requestDelay: string;
//   /** Optional — used for the map if the backend sends them. */
//   latitude?: number | null;
//   longitude?: number | null;
// }

// /** One entry of `data.suggestedCompetitors` from GET /competitor/business/:id/suggestions */
// interface SuggestedCompetitor {
//   id: string;
//   name: string;
//   rating?: number;
//   totalReviews?: number;
//   reviewsGained?: string;
//   growthRate?: string;
//   gmbLink?: string;
//   position?: string;
//   isSelected?: boolean;
//   /** Optional — real map position if the backend sends it. */
//   latitude?: number;
//   longitude?: number;
// }

// interface CompetitorSuggestions {
//   businessId: string;
//   businessName: string;
//   category?: string;
//   radiusMiles?: number;
//   metrics?: {
//     your_total_reviews?: number;
//     your_rating?: number;
//     your_review_growth_rate?: string;
//     competitor_average_reviews?: number;
//     competitor_average_growth_rate?: string;
//     growth_difference?: string;
//     status?: string;
//   };
//   aiSummary?: string;
//   comparisonTable?: unknown[];
//   suggestedCompetitors: SuggestedCompetitor[];
// }

// interface NfcCard {
//   id?: string;
//   cardId?: string;
//   label: string;
//   shortCode: string;
//   tapUrl: string;
//   qrCodeDataUrl?: string;
//   qrCodeSvg?: string;
// }

// interface FormState {
//   businessName: string;
//   country: string;
//   monthlyGoal: string;
//   gmbConnected: boolean;
//   defaultRequestChannel: RequestChannel;
//   reviewTiming: ReviewTiming;
//   customHours: string;
//   followUpReminder: boolean;
//   autoReviewRequests: boolean;
//   nfcLabel: string;
// }

// export interface OnboardingResult {
//   form: FormState;
//   business: Business | null;
// }

// export interface GrowMoreReviewsOnboardingProps {
//   /** Public path (or remote URL) for the storefront hero photo shown on the right. */
//   heroImageSrc?: string;
//   /** Optional photo of the physical NFC/QR review stand. Falls back to a drawn mockup. */
//   nfcPhotoSrc?: string;
//   /** Called once the person finishes the wizard and clicks "Go Dashboard". */
//   onComplete?: (result: OnboardingResult) => void;
//   /** Called on every successful step change — useful for analytics. */
//   onStepChange?: (step: StepIndex) => void;
// }

// /* ------------------------------------------------------------------ */
// /*  Static data                                                        */
// /* ------------------------------------------------------------------ */

// const STEPS: { id: StepIndex; label: string }[] = [
//   { id: 1, label: "Business Setup" },
//   { id: 2, label: "GMB Connect" },
//   { id: 3, label: "Review request" },
//   { id: 4, label: "Competitor" },
//   { id: 5, label: "NFC Setup" },
//   { id: 6, label: "Complete" },
// ];

// /**
//  * ISO 3166-1 alpha-2 codes power both the flag icon and the fallback map center.
//  * The country only affects the map preview; it is not sent to the API.
//  */
// const COUNTRIES: (CountryOption & { center: [number, number] })[] = [
//   { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
//   { code: "US", name: "United States", center: [40.7128, -74.006] },
//   { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
//   { code: "NL", name: "Netherlands", center: [52.3676, 4.9041] },
//   { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
//   { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
//   { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
//   { code: "IN", name: "India", center: [28.6139, 77.209] },
// ];

// /** `delay` is the exact string the backend stores in `requestDelay`. */
// const TIMING_OPTIONS: { id: ReviewTiming; label: string; delay: string }[] = [
//   { id: "2h", label: "2 hours after service", delay: "2 hours after service" },
//   { id: "5h", label: "5 hours after service", delay: "5 hours after service" },
//   {
//     id: "24h",
//     label: "24 hours after service",
//     delay: "24 hours after service",
//   },
//   { id: "custom", label: "Custom time", delay: "" },
// ];

// // Confirm these enum values with the backend.
// const CHANNEL_OPTIONS: { id: RequestChannel; label: string }[] = [
//   { id: "SMS", label: "SMS" },
//   { id: "EMAIL", label: "Email" },
// ];

// /** Value for `?format=` on GET /nfc/:cardId/qrcode — confirm with the backend. */
// const QR_FORMAT = "png";

// const AVATAR_COLORS = [
//   "#6D5BD0",
//   "#0EA5A4",
//   "#E1A32A",
//   "#DC5F45",
//   "#3B82C4",
//   "#7C9A3C",
// ];

// /** Competitor avatar tint from the design (all competitors share one purple). */
// const COMPETITOR_AVATAR = "#6D5BD0";
// const PIN_SELECTED = "#16A34A";
// const PIN_UNSELECTED = "#9CA3AF";

// const DEFAULT_STATE: FormState = {
//   businessName: "",
//   country: "CA",
//   monthlyGoal: "25",
//   gmbConnected: false,
//   defaultRequestChannel: "SMS",
//   reviewTiming: "2h",
//   customHours: "3",
//   followUpReminder: true,
//   autoReviewRequests: true,
//   nfcLabel: "Table 1 - Counter",
// };

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */

// function apiMessage(err: unknown, fallback: string): string {
//   const e = err as { data?: { message?: string | string[] }; error?: string };
//   const m = e?.data?.message;
//   if (Array.isArray(m)) return m.join(", ");
//   return m || e?.error || fallback;
// }

// function useDebounce<T>(value: T, delay = 400): T {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return debounced;
// }

// function buildRequestDelay(timing: ReviewTiming, customHours: string): string {
//   if (timing === "custom") {
//     const h = Math.min(72, Math.max(1, Math.round(Number(customHours)) || 1));
//     return `${h} ${h === 1 ? "hour" : "hours"} after service`;
//   }
//   return TIMING_OPTIONS.find((o) => o.id === timing)!.delay;
// }

// function parseRequestDelay(delay?: string): {
//   timing: ReviewTiming;
//   customHours: string;
// } {
//   const known = TIMING_OPTIONS.find((o) => o.delay && o.delay === delay);
//   if (known) return { timing: known.id, customHours: "3" };
//   const m = delay?.match(/^(\d+)\s*hours?/i);
//   if (m) return { timing: "custom", customHours: m[1] };
//   return { timing: "2h", customHours: "3" };
// }

// function initialsOf(name: string): string {
//   return (
//     name
//       .split(/\s+/)
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((w) => w[0]?.toUpperCase())
//       .join("") || "?"
//   );
// }

// function colorFor(id: string): string {
//   let h = 0;
//   for (let i = 0; i < id?.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
//   return AVATAR_COLORS[h % AVATAR_COLORS.length];
// }

// /**
//  * Pull a [lat, lng] pair out of whatever shape the backend uses:
//  * { latitude, longitude } | { lat, lng } | { location: {...} } | { geometry: { location: {...} } }
//  */
// function extractLatLng(src: unknown): [number, number] | null {
//   if (!src || typeof src !== "object") return null;
//   const o = src as Record<string, any>;
//   const candidates = [o, o.location, o.geometry?.location, o.coordinates];
//   for (const c of candidates) {
//     if (!c || typeof c !== "object") continue;
//     const lat = Number(c.latitude ?? c.lat);
//     const lng = Number(c.longitude ?? c.lng ?? c.lon);
//     if (
//       Number.isFinite(lat) &&
//       Number.isFinite(lng) &&
//       (lat !== 0 || lng !== 0)
//     )
//       return [lat, lng];
//   }
//   return null;
// }

// /**
//  * The suggestions API returns no coordinates. Until it does, spread the pins
//  * deterministically around the business inside the search radius so the map
//  * still reflects "nearby". Same input → same position (no jumping on re-render).
//  */
// function approxPosition(
//   center: [number, number],
//   index: number,
//   seed: string,
//   radiusMiles: number,
// ): [number, number] {
//   let h = 0;
//   for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
//   const angle = ((index * 137.5 + (h % 25)) * Math.PI) / 180; // golden-angle spread
//   const dist = radiusMiles * (0.3 + ((h >>> 5) % 50) / 100); // 30–79% of radius
//   const dLat = (dist * Math.cos(angle)) / 69;
//   const dLng =
//     (dist * Math.sin(angle)) / (69 * Math.cos((center[0] * Math.PI) / 180));
//   return [center[0] + dLat, center[1] + dLng];
// }

// function zoomForRadius(miles = 5): number {
//   if (miles <= 1) return 14;
//   if (miles <= 3) return 13;
//   if (miles <= 8) return 12;
//   if (miles <= 20) return 11;
//   return 10;
// }

// /* ------------------------------------------------------------------ */
// /*  Stepper                                                             */
// /* ------------------------------------------------------------------ */

// function Stepper({
//   current,
//   maxStep,
//   onJump,
// }: {
//   current: StepIndex;
//   maxStep: StepIndex;
//   onJump: (step: StepIndex) => void;
// }) {
//   return (
//     <ol className="flex w-full items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
//       {STEPS.map((step, idx) => {
//         const done = step.id <= current;
//         const reachable = step.id <= maxStep;
//         const isLast = idx === STEPS.length - 1;
//         return (
//           <li key={step.id} className="flex flex-1 items-center last:flex-none">
//             <div className="flex min-w-[52px] flex-col items-center text-center sm:min-w-[64px]">
//               <button
//                 type="button"
//                 onClick={() => reachable && onJump(step.id)}
//                 disabled={!reachable}
//                 aria-current={step.id === current ? "step" : undefined}
//                 className={[
//                   "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs",
//                   done
//                     ? "bg-emerald-500 text-white enabled:cursor-pointer enabled:hover:bg-emerald-600"
//                     : reachable
//                       ? "border border-emerald-400 bg-white text-emerald-600 enabled:cursor-pointer"
//                       : "border border-gray-300 bg-white text-gray-400",
//                 ].join(" ")}
//               >
//                 {done ? (
//                   <Icon.Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                 ) : (
//                   String(step.id).padStart(2, "0")
//                 )}
//               </button>
//               <span
//                 className={[
//                   "mt-1.5 text-[10px] leading-tight sm:text-xs",
//                   step.id === current
//                     ? "font-medium text-gray-900"
//                     : "text-gray-500",
//                 ].join(" ")}
//               >
//                 {step.label}
//               </span>
//             </div>
//             {!isLast && (
//               <div
//                 className={[
//                   "mx-1 mt-3.5 h-px flex-1 sm:mt-4",
//                   step.id < current ? "bg-emerald-400" : "bg-gray-200",
//                 ].join(" ")}
//               />
//             )}
//           </li>
//         );
//       })}
//     </ol>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Shared UI bits                                                      */
// /* ------------------------------------------------------------------ */

// function FieldLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <label className="mb-1.5 block text-sm font-medium text-gray-700">
//       {children}
//     </label>
//   );
// }

// function FieldError({ children }: { children?: React.ReactNode }) {
//   if (!children) return null;
//   return <p className="mt-1.5 text-xs text-red-500">{children}</p>;
// }

// function PrimaryButton({
//   children,
//   className = "",
//   loading = false,
//   disabled,
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
//   return (
//     <button
//       {...rest}
//       disabled={disabled || loading}
//       className={[
//         "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors",
//         "hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300",
//         className,
//       ].join(" ")}
//     >
//       {loading && <Icon.Spinner className="h-4 w-4 animate-spin" />}
//       {children}
//     </button>
//   );
// }

// const inputClass =
//   "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400";

// function Toggle({
//   checked,
//   onChange,
//   label,
//   hint,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
//   hint?: string;
// }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300"
//     >
//       <span>
//         <span className="block text-sm font-medium text-gray-800">{label}</span>
//         {hint && <span className="block text-xs text-gray-500">{hint}</span>}
//       </span>
//       <span
//         className={[
//           "relative h-5 w-9 shrink-0 rounded-full transition-colors",
//           checked ? "bg-emerald-500" : "bg-gray-300",
//         ].join(" ")}
//       >
//         <span
//           className={[
//             "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
//             checked ? "left-[18px]" : "left-0.5",
//           ].join(" ")}
//         />
//       </span>
//     </button>
//   );
// }

// function RatingLine({
//   rating,
//   total,
// }: {
//   rating?: number | null;
//   total?: number | null;
// }) {
//   if (rating == null) return null;
//   return (
//     <span className="text-xs text-gray-500">
//       <span className="text-amber-500">★</span> {rating.toFixed(1)}
//       {total != null && <> ({total.toLocaleString()} reviews)</>}
//     </span>
//   );
// }

// function PlaceRow({
//   place,
//   onClick,
//   trailing,
// }: {
//   place: Place;
//   onClick?: () => void;
//   trailing?: React.ReactNode;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
//     >
//       <span
//         className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
//         style={{ backgroundColor: colorFor(place.placeId) }}
//       >
//         {initialsOf(place.name)}
//       </span>
//       <span className="min-w-0 flex-1">
//         <span className="block truncate text-sm font-medium text-gray-800">
//           {place.name}
//         </span>
//         <span className="block truncate text-xs text-gray-500">
//           {place.address}
//         </span>
//         <RatingLine rating={place.rating} total={place.userRatingsTotal} />
//       </span>
//       {trailing}
//     </button>
//   );
// }

// function ErrorBanner({ message }: { message: string | null }) {
//   if (!message) return null;
//   return (
//     <div
//       role="alert"
//       className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
//     >
//       {message}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Competitor step bits                                                */
// /* ------------------------------------------------------------------ */

// /** The AI discovery call can take a while, so say what is happening. */
// function CompetitorsLoading() {
//   const [seconds, setSeconds] = useState(0);
//   useEffect(() => {
//     const t = setInterval(() => setSeconds((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const message =
//     seconds < 6
//       ? "Finding businesses near you…"
//       : seconds < 20
//         ? "Comparing review counts and ratings…"
//         : "Still working. Competitor analysis can take about a minute.";

//   return (
//     <div aria-live="polite">
//       <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
//         <Icon.Spinner className="h-3.5 w-3.5 animate-spin text-blue-600" />
//         {message}
//       </div>
//       {[0, 1, 2, 3].map((i) => (
//         <div
//           key={i}
//           className={[
//             "flex items-center gap-3 px-4 py-3",
//             i % 2 === 0 ? "bg-gray-50" : "bg-white",
//           ].join(" ")}
//         >
//           <span className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200" />
//           <span className="flex-1 space-y-2">
//             <span className="block h-3 w-2/5 animate-pulse rounded bg-gray-200" />
//             <span className="block h-2.5 w-1/4 animate-pulse rounded bg-gray-100" />
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function CompetitorRow({
//   competitor,
//   index,
//   checked,
//   added,
//   onToggle,
// }: {
//   competitor: SuggestedCompetitor;
//   index: number;
//   checked: boolean;
//   added: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       role="checkbox"
//       aria-checked={checked}
//       disabled={added}
//       onClick={onToggle}
//       className={[
//         "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors enabled:hover:bg-blue-50/60",
//         index % 2 === 0 ? "bg-gray-50" : "bg-white",
//       ].join(" ")}
//     >
//       <span
//         className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
//         style={{ backgroundColor: COMPETITOR_AVATAR }}
//       >
//         {initialsOf(competitor.name)}
//       </span>
//       <span className="min-w-0 flex-1">
//         <span className="block truncate text-sm font-medium text-gray-800">
//           {competitor.name}
//         </span>
//         <span className="flex flex-wrap items-center gap-x-2">
//           <RatingLine
//             rating={competitor.rating}
//             total={competitor.totalReviews}
//           />
//           {competitor.growthRate && (
//             <span className="text-xs text-gray-400">
//               Growth {competitor.growthRate}
//             </span>
//           )}
//         </span>
//       </span>
//       {added && (
//         <span className="shrink-0 text-xs font-medium text-emerald-600">
//           Added
//         </span>
//       )}
//       <span
//         className={[
//           "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
//           checked
//             ? "border-blue-600 bg-blue-600 text-white"
//             : "border-gray-300 bg-white",
//         ].join(" ")}
//       >
//         {checked && <Icon.Check className="h-3 w-3" />}
//       </span>
//     </button>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Main component                                                      */
// /* ------------------------------------------------------------------ */

// export default function GrowMoreReviewsOnboarding({
//   heroImageSrc = "/images/onBoarding/right-side.png",
//   nfcPhotoSrc,
//   onComplete,
//   onStepChange,
// }: GrowMoreReviewsOnboardingProps) {
//   const router = useRouter();

//   const [step, setStep] = useState<StepIndex>(1);
//   const [maxStep, setMaxStep] = useState<StepIndex>(1);
//   const [data, setData] = useState<FormState>(DEFAULT_STATE);

//   const [business, setBusiness] = useState<Business | null>(null);
//   const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
//   const [placeQuery, setPlaceQuery] = useState("");
//   const [errors, setErrors] = useState<{
//     name?: string;
//     place?: string;
//     goal?: string;
//   }>({});

//   // Competitor step: suggestions are copied into local state once loaded so the
//   // (expensive) AI request is never re-run by tag invalidation or re-renders.
//   const [suggestions, setSuggestions] = useState<CompetitorSuggestions | null>(
//     null,
//   );
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [addedCompetitorIds, setAddedCompetitorIds] = useState<string[]>([]);

//   const [card, setCard] = useState<NfcCard | null>(null);
//   const [copied, setCopied] = useState(false);

//   const [submitting, setSubmitting] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   /* ---- API hooks ---- */

//   const { data: profileRes, isLoading: profileLoading } =
//     useGetCheckUserBusinessProfileQuery(undefined);

//   const debouncedPlaceQuery = useDebounce(placeQuery.trim());
//   const placeSearchEnabled =
//     step === 1 &&
//     !business &&
//     !selectedPlace &&
//     debouncedPlaceQuery.length >= 2;
//   const {
//     currentData: placesRes,
//     isFetching: placesFetching,
//     isError: placesError,
//   } = useGetStep1Query(encodeURIComponent(debouncedPlaceQuery), {
//     skip: !placeSearchEnabled,
//   });
//   const placeResults: Place[] =
//     (placesRes as ApiResponse<Place[]> | undefined)?.data ?? [];

//   // Step 4 (Competitor) → GET /competitor/business/:businessId/suggestions
//   const {
//     currentData: suggestionsRes,
//     isError: suggestionsQueryError,
//     refetch: refetchSuggestions,
//   } = useGetStep5Query(business?.id, {
//     skip: step !== 4 || !business?.id || !!suggestions,
//   });
//   const suggestionsData = (
//     suggestionsRes as ApiResponse<CompetitorSuggestions> | undefined
//   )?.data;

//   const cardId = card?.id ?? card?.cardId;
//   // Step 5 (NFC) → GET /nfc/:cardId/qrcode
//   const { data: qrRes } = useGetStep6Query(
//     { query: QR_FORMAT, cardId },
//     { skip: !cardId },
//   );
//   const qrPayload = (qrRes as ApiResponse<Partial<NfcCard>> | undefined)?.data;
//   // Prefer the fresh GET result; fall back to what the POST already returned.
//   const qrDataUrl = qrPayload?.qrCodeDataUrl ?? card?.qrCodeDataUrl ?? null;
//   const qrSvg = qrPayload?.qrCodeSvg ?? card?.qrCodeSvg ?? null;

//   const [postStep1] = usePostStep1Mutation();
//   const [postStep2] = usePostStep2Mutation();
//   const [patchStep2] = usePatchStep2Mutation();
//   const [patchStep3] = usePatchStep3Mutation();
//   const [postStep5] = usePostStep5Mutation(); // competitors bulk
//   const [patchStep5] = usePatchStep5Mutation(); // competitor step complete
//   const [postStep6] = usePostStep6Mutation(); // NFC card
//   const [patchStep6] = usePatchStep6Mutation(); // NFC step complete

//   /* ---- resume an unfinished onboarding ---- */

//   const hydrated = useRef(false);
//   useEffect(() => {
//     if (hydrated.current || profileLoading) return;
//     hydrated.current = true;

//     const raw = (profileRes as ApiResponse<Business | Business[]> | undefined)
//       ?.data;
//     const biz = Array.isArray(raw) ? raw[0] : raw;
//     if (!biz?.id) return; // brand-new user → start at step 1

//     if (biz.isOnboardingCompleted) {
//       router.replace("/dashboard");
//       return;
//     }

//     const resume = Math.min(
//       Math.max(biz.onboardingStep || 1, 1),
//       6,
//     ) as StepIndex;
//     const { timing, customHours } = parseRequestDelay(biz.requestDelay);

//     setBusiness(biz);
//     setSelectedPlace({
//       placeId: biz.placeId,
//       name: biz.name,
//       address: biz.address ?? "",
//       rating: biz.rating ?? undefined,
//       userRatingsTotal: biz.userRatingsTotal ?? undefined,
//       googleMapsUrl: biz.googleMapsUrl ?? undefined,
//       googleReviewUrl: biz.googleReviewUrl ?? undefined,
//       category: biz.category ?? undefined,
//     });
//     setData((d) => ({
//       ...d,
//       businessName: biz.name,
//       monthlyGoal: String(biz.monthlyGoal ?? d.monthlyGoal),
//       gmbConnected: resume >= 3,
//       defaultRequestChannel:
//         biz.defaultRequestChannel === "EMAIL" ? "EMAIL" : "SMS",
//       reviewTiming: timing,
//       customHours,
//       followUpReminder: biz.followUpReminder ?? true,
//       autoReviewRequests: biz.autoReviewRequests ?? true,
//     }));
//     setStep(resume);
//     setMaxStep(resume);
//   }, [profileLoading, profileRes, router]);

//   // Store the AI suggestions once and pre-tick the ones the API marked `isSelected`.
//   useEffect(() => {
//     if (suggestions || !suggestionsData?.suggestedCompetitors) return;
//     setSuggestions(suggestionsData);
//     setSelectedIds(
//       suggestionsData.suggestedCompetitors
//         .filter((c) => c.isSelected)
//         .map((c) => c.id),
//     );
//   }, [suggestions, suggestionsData]);

//   /* ---- navigation + request plumbing ---- */

//   const goTo = useCallback(
//     (next: StepIndex) => {
//       setApiError(null);
//       setStep(next);
//       setMaxStep((m) => (next > m ? next : m));
//       onStepChange?.(next);
//     },
//     [onStepChange],
//   );

//   const jumpTo = useCallback(
//     (target: StepIndex) => {
//       setApiError(null);
//       setStep(target);
//       onStepChange?.(target);
//     },
//     [onStepChange],
//   );

//   const run = async (fn: () => Promise<void>) => {
//     setApiError(null);
//     setSubmitting(true);
//     try {
//       await fn();
//     } catch (err) {
//       setApiError(apiMessage(err, "Something went wrong. Please try again."));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /** Merge a server response into local business state without ever moving the step backwards. */
//   const mergeBusiness = (incoming?: Partial<Business> | null) => {
//     if (!incoming || typeof incoming !== "object") return;
//     setBusiness((prev) => {
//       if (!prev) return incoming.id ? (incoming as Business) : prev;
//       if (incoming.id && incoming.id !== prev.id) return prev;
//       return {
//         ...prev,
//         ...incoming,
//         onboardingStep: Math.max(
//           prev.onboardingStep ?? 0,
//           incoming.onboardingStep ?? 0,
//         ),
//       };
//     });
//   };

//   /** Never send a lower onboardingStep than the server already has (e.g. after going back). */
//   const stepToSend = (target: number) =>
//     Math.max(target, business?.onboardingStep ?? 0);

//   const selectedCountry = useMemo(
//     () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
//     [data.country],
//   );

//   /** Real coordinates when the backend provides them, otherwise the country center. */
//   const businessCenter: [number, number] = useMemo(
//     () =>
//       extractLatLng(business) ??
//       extractLatLng(selectedPlace) ??
//       selectedCountry.center,
//     [business, selectedPlace, selectedCountry],
//   );

//   const businessPin: MapPin[] = useMemo(
//     () => [
//       {
//         id: "business",
//         position: businessCenter,
//         label: business?.name || data.businessName || "Your business",
//         color: "#2563EB",
//         primary: true,
//       },
//     ],
//     [businessCenter, business?.name, data.businessName],
//   );

//   /** Competitor pins: green when ticked, grey when not. */
//   const { competitorPins, pinsApproximate } = useMemo(() => {
//     const list = suggestions?.suggestedCompetitors ?? [];
//     const radius = suggestions?.radiusMiles ?? 5;
//     let approximate = false;
//     const pins: MapPin[] = list.map((c, i) => {
//       const real = extractLatLng(c);
//       if (!real) approximate = true;
//       return {
//         id: c.id,
//         position: real ?? approxPosition(businessCenter, i, c.id, radius),
//         label: c.name,
//         color: selectedIds.includes(c.id) ? PIN_SELECTED : PIN_UNSELECTED,
//         primary: false,
//       };
//     });
//     return { competitorPins: pins, pinsApproximate: approximate };
//   }, [suggestions, selectedIds, businessCenter]);

//   const competitorZoom = zoomForRadius(suggestions?.radiusMiles);

//   /* ---- step handlers ---- */

//   // Step 1 → POST /business, then go to step 2
//   const handleBusinessContinue = () =>
//     run(async () => {
//       const goal = Number(data.monthlyGoal);
//       const next: typeof errors = {};
//       if (!data.businessName.trim())
//         next.name = "Enter your business name to continue.";
//       if (!selectedPlace)
//         next.place = "Search for your business and select it from the list.";
//       if (!Number.isInteger(goal) || goal < 1)
//         next.goal = "Enter a goal of at least 1 review per month.";
//       setErrors(next);
//       if (Object.keys(next).length) return;

//       // Already created (person came back to step 1) → don't create a duplicate.
//       if (!business) {
//         const res = (await postStep1({
//           name: data.businessName.trim(),
//           placeId: selectedPlace!.placeId,
//           monthlyGoal: goal,
//         }).unwrap()) as ApiResponse<Business>;
//         setBusiness(res.data);
//       }
//       goTo(2);
//     });

//   // Step 2 → POST /business/:id/sync-google
//   const handleConnectGMB = () =>
//     run(async () => {
//       if (!business || data.gmbConnected) return;
//       const res = (await postStep2({
//         businessId: business.id,
//         body: {},
//       }).unwrap()) as ApiResponse<Partial<Business>> | undefined;
//       mergeBusiness(res?.data);
//       setData((d) => ({ ...d, gmbConnected: true }));
//     });

//   // Step 2 → PATCH /business/:id/onboarding { onboardingStep: 3 }
//   const handleGmbContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep2({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(3) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(3);
//     });

//   // Step 3 → PATCH /business/:id { channel, delay, toggles, onboardingStep: 4 }
//   const handleReviewRequestContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep3({
//         businessId: business.id,
//         body: {
//           defaultRequestChannel: data.defaultRequestChannel,
//           requestDelay: buildRequestDelay(data.reviewTiming, data.customHours),
//           followUpReminder: data.followUpReminder,
//           autoReviewRequests: data.autoReviewRequests,
//           onboardingStep: stepToSend(4),
//         },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(4);
//     });

//   const toggleCompetitor = (id: string) =>
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );

//   // Step 4 → POST /competitor/business/:id/bulk, then PATCH onboarding { onboardingStep: 5 }
//   const handleCompetitorsContinue = () =>
//     run(async () => {
//       if (!business) return;

//       // Only send ones that were not already saved (person may have come back).
//       const pending = (suggestions?.suggestedCompetitors ?? []).filter(
//         (c) => selectedIds.includes(c.id) && !addedCompetitorIds.includes(c.id),
//       );

//       if (pending.length) {
//         await postStep5({
//           businessId: business.id,
//           body: {
//             competitors: pending.map((c) => ({
//               name: c.name,
//               rating: c.rating,
//               userRatingsTotal: c.totalReviews,
//             })),
//           },
//         }).unwrap();
//         setAddedCompetitorIds((prev) => [...prev, ...pending.map((c) => c.id)]);
//       }

//       const res = (await patchStep5({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(5) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(5);
//     });

//   // Step 5 → POST /nfc (register card + get QR)
//   const handleGenerateNfc = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await postStep6({
//         businessId: business.id,
//         label: data.nfcLabel.trim() || "Review stand",
//       }).unwrap()) as ApiResponse<NfcCard>;
//       setCard(res.data);
//     });

//   const handleDownloadQr = () => {
//     if (!qrDataUrl) return;
//     const a = document.createElement("a");
//     a.href = qrDataUrl;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleDownloadSvg = () => {
//     if (!qrSvg) return;
//     const url = URL.createObjectURL(
//       new Blob([qrSvg], { type: "image/svg+xml" }),
//     );
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.svg`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   const handleCopyTapUrl = async () => {
//     if (!card?.tapUrl) return;
//     try {
//       await navigator.clipboard.writeText(card.tapUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1800);
//     } catch {
//       setApiError("Couldn't copy the link. Copy it manually instead.");
//     }
//   };

//   // Step 5 → PATCH onboarding { onboardingStep: 6 }
//   const handleNfcContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep6({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(6) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(6);
//     });

//   const handleGoDashboard = () => {
//     onComplete?.({ form: data, business });
//     router.push("/dashboard");
//   };

//   /* ---- step content ---- */

//   const renderStep = () => {
//     switch (step) {
//       case 1: {
//         const locked = !!business; // business already created → place can't change here
//         const typing = placeQuery.trim() !== debouncedPlaceQuery;
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Welcome to Grow More Reviews!
//             </h1>
//             <p className="mt-1.5 text-sm text-gray-500">
//               Let&apos;s get your business ready to grow more reviews.
//             </p>

//             <div className="mt-7">
//               <FieldLabel>Business Name</FieldLabel>
//               <input
//                 type="text"
//                 value={data.businessName}
//                 disabled={locked}
//                 onChange={(e) => {
//                   setData((d) => ({ ...d, businessName: e.target.value }));
//                   if (errors.name)
//                     setErrors((er) => ({ ...er, name: undefined }));
//                 }}
//                 placeholder="e.g. Coffee House"
//                 className={[
//                   inputClass,
//                   errors.name ? "border-red-400" : "border-gray-200",
//                 ].join(" ")}
//               />
//               <FieldError>{errors.name}</FieldError>
//             </div>

//             <div className="mt-5">
//               <FieldLabel>Find your business on Google</FieldLabel>
//               {selectedPlace ? (
//                 <div className="overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/40">
//                   <PlaceRow
//                     place={selectedPlace}
//                     trailing={
//                       !locked && (
//                         <span
//                           role="button"
//                           tabIndex={0}
//                           onClick={() => {
//                             setSelectedPlace(null);
//                             setPlaceQuery("");
//                           }}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               setSelectedPlace(null);
//                               setPlaceQuery("");
//                             }
//                           }}
//                           className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                         >
//                           Change
//                         </span>
//                       )
//                     }
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <input
//                     type="text"
//                     value={placeQuery}
//                     onChange={(e) => {
//                       setPlaceQuery(e.target.value);
//                       if (errors.place)
//                         setErrors((er) => ({ ...er, place: undefined }));
//                     }}
//                     placeholder="Search your business name and city"
//                     className={[
//                       inputClass,
//                       errors.place ? "border-red-400" : "border-gray-200",
//                     ].join(" ")}
//                   />
//                   {placeSearchEnabled && (
//                     <div className="mt-2 max-h-60 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 bg-white">
//                       {(placesFetching || typing) && (
//                         <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
//                           <Icon.Spinner className="h-3.5 w-3.5 animate-spin" />
//                           Searching Google…
//                         </div>
//                       )}
//                       {!placesFetching && placesError && (
//                         <p className="px-4 py-3 text-xs text-red-500">
//                           Search failed. Check your connection and try again.
//                         </p>
//                       )}
//                       {!placesFetching &&
//                         !placesError &&
//                         placeResults.length === 0 && (
//                           <p className="px-4 py-3 text-xs text-gray-500">
//                             No businesses found. Try adding the city name.
//                           </p>
//                         )}
//                       {!placesFetching &&
//                         placeResults.map((p) => (
//                           <PlaceRow
//                             key={p.placeId}
//                             place={p}
//                             onClick={() => {
//                               setSelectedPlace(p);
//                               setErrors((er) => ({ ...er, place: undefined }));
//                               setData((d) => ({
//                                 ...d,
//                                 businessName: d.businessName.trim()
//                                   ? d.businessName
//                                   : p.name,
//                               }));
//                             }}
//                           />
//                         ))}
//                     </div>
//                   )}
//                 </>
//               )}
//               <FieldError>{errors.place}</FieldError>
//             </div>

//             <div className="mt-5 grid gap-5 sm:grid-cols-2">
//               <div>
//                 <FieldLabel>Country</FieldLabel>
//                 <CountrySelect
//                   value={data.country}
//                   options={COUNTRIES}
//                   onChange={(code: any) =>
//                     setData((d) => ({ ...d, country: code }))
//                   }
//                 />
//               </div>
//               <div>
//                 <FieldLabel>Monthly review goal</FieldLabel>
//                 <input
//                   type="number"
//                   min={1}
//                   value={data.monthlyGoal}
//                   disabled={locked}
//                   onChange={(e) => {
//                     setData((d) => ({ ...d, monthlyGoal: e.target.value }));
//                     if (errors.goal)
//                       setErrors((er) => ({ ...er, goal: undefined }));
//                   }}
//                   className={[
//                     inputClass,
//                     errors.goal ? "border-red-400" : "border-gray-200",
//                   ].join(" ")}
//                 />
//                 <FieldError>{errors.goal}</FieldError>
//               </div>
//             </div>

//             <ErrorBanner message={apiError} />

//             <PrimaryButton
//               className="mt-8"
//               onClick={handleBusinessContinue}
//               loading={submitting}
//             >
//               {submitting ? "Saving…" : "Continue"}
//             </PrimaryButton>
//           </div>
//         );
//       }

//       case 2:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Connect your Google Business Profile
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Get real-time reviews, insights and manage your online reputation.
//             </p>

//             <div className="mt-7 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//                 <Icon.Store className="h-5 w-5" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <span className="block truncate text-sm font-medium text-gray-800">
//                   {business?.name || data.businessName || "Your business"}
//                 </span>
//                 {business?.address && (
//                   <span className="block truncate text-xs text-gray-500">
//                     {business.address}
//                   </span>
//                 )}
//                 <RatingLine
//                   rating={business?.rating}
//                   total={business?.userRatingsTotal}
//                 />
//               </div>
//               {business?.googleMapsUrl && (
//                 <a
//                   href={business.googleMapsUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   View on Maps
//                 </a>
//               )}
//             </div>

//             <ErrorBanner message={apiError} />

//             <PrimaryButton
//               className="mt-5"
//               onClick={handleConnectGMB}
//               loading={submitting && !data.gmbConnected}
//               disabled={data.gmbConnected || !business}
//             >
//               {data.gmbConnected
//                 ? "Connected"
//                 : submitting
//                   ? "Connecting…"
//                   : "Connect GMB"}
//             </PrimaryButton>

//             {data.gmbConnected && (
//               <div className="mt-5 space-y-3">
//                 <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
//                   <MapView
//                     key={`gmb-${businessCenter[0]}-${businessCenter[1]}`}
//                     center={businessCenter}
//                     zoom={14}
//                     pins={businessPin}
//                   />
//                 </div>
//                 <PrimaryButton onClick={handleGmbContinue} loading={submitting}>
//                   Continue
//                 </PrimaryButton>
//               </div>
//             )}
//           </div>
//         );

//       case 3:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               How do you want to collect reviews?
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Choose your preferred method to request reviews from customers.
//             </p>

//             <div className="mt-7">
//               <h2 className="mb-3 text-sm font-medium text-gray-700">
//                 Send requests by
//               </h2>
//               <div className="grid grid-cols-2 gap-2.5">
//                 {CHANNEL_OPTIONS.map((ch) => (
//                   <button
//                     key={ch.id}
//                     type="button"
//                     onClick={() =>
//                       setData((d) => ({ ...d, defaultRequestChannel: ch.id }))
//                     }
//                     aria-pressed={data.defaultRequestChannel === ch.id}
//                     className={[
//                       "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
//                       data.defaultRequestChannel === ch.id
//                         ? "border-emerald-400 bg-emerald-50/60 text-gray-900"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
//                     ].join(" ")}
//                   >
//                     {ch.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               <h2 className="mb-3 text-sm font-medium text-gray-700">
//                 When should we ask customers?
//               </h2>
//               <div className="space-y-2.5">
//                 {TIMING_OPTIONS.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={[
//                       "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
//                       data.reviewTiming === opt.id
//                         ? "border-emerald-400 bg-emerald-50/60"
//                         : "border-gray-200 bg-white hover:border-gray-300",
//                     ].join(" ")}
//                   >
//                     <span
//                       className={[
//                         "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
//                         data.reviewTiming === opt.id
//                           ? "border-emerald-500"
//                           : "border-gray-300",
//                       ].join(" ")}
//                     >
//                       {data.reviewTiming === opt.id && (
//                         <span className="h-2 w-2 rounded-full bg-emerald-500" />
//                       )}
//                     </span>
//                     <input
//                       type="radio"
//                       name="timing"
//                       className="sr-only"
//                       checked={data.reviewTiming === opt.id}
//                       onChange={() =>
//                         setData((d) => ({ ...d, reviewTiming: opt.id }))
//                       }
//                     />
//                     <span className="text-gray-700">{opt.label}</span>
//                   </label>
//                 ))}

//                 {data.reviewTiming === "custom" && (
//                   <div className="relative pl-1 pt-1">
//                     <input
//                       type="number"
//                       min={1}
//                       max={72}
//                       value={data.customHours}
//                       onChange={(e) =>
//                         setData((d) => ({ ...d, customHours: e.target.value }))
//                       }
//                       className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//                       hours
//                     </span>
//                     <Icon.Clock className="pointer-events-none absolute right-11 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 space-y-2.5">
//               <Toggle
//                 checked={data.autoReviewRequests}
//                 onChange={(v) =>
//                   setData((d) => ({ ...d, autoReviewRequests: v }))
//                 }
//                 label="Send requests automatically"
//                 hint="We ask every customer without you lifting a finger."
//               />
//               <Toggle
//                 checked={data.followUpReminder}
//                 onChange={(v) =>
//                   setData((d) => ({ ...d, followUpReminder: v }))
//                 }
//                 label="Send a follow-up reminder"
//                 hint="A gentle nudge if they haven't reviewed yet."
//               />
//             </div>

//             <div className="mt-5">
//               <ErrorBanner message={apiError} />
//             </div>

//             <PrimaryButton
//               onClick={handleReviewRequestContinue}
//               loading={submitting}
//             >
//               {submitting ? "Saving…" : "Continue"}
//             </PrimaryButton>
//           </div>
//         );

//       case 4: {
//         const list = suggestions?.suggestedCompetitors ?? [];
//         const selectedCount = selectedIds.length;
//         // Response arrived but without a usable list → treat like a failed request.
//         const failed =
//           !suggestions &&
//           (suggestionsQueryError ||
//             (!!suggestionsRes && !suggestionsData?.suggestedCompetitors));
//         const loading = !suggestions && !failed;
//         const mapPins = [...businessPin, ...competitorPins];

//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Find your competitors
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               We&apos;ll automatically identify nearby competitors and compare
//               your review growth.
//             </p>

//             {/* Map */}
//             <div className="mt-6 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
//               <div className="relative h-44 overflow-hidden rounded-lg">
//                 <MapView
//                   key={`competitors-${businessCenter[0]}-${businessCenter[1]}-${competitorZoom}`}
//                   center={businessCenter}
//                   zoom={competitorZoom}
//                   pins={mapPins}
//                 />
//               </div>
//             </div>
//             {pinsApproximate && !loading && (
//               <p className="mt-1.5 text-[11px] text-gray-400">
//                 Pin positions are approximate.
//               </p>
//             )}

//             {/* Competitor list */}
//             <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
//               <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900">
//                 <span>Your Competitors</span>
//                 {!loading && !failed && (
//                   <span className="text-xs font-normal text-gray-500">
//                     {selectedCount} selected
//                   </span>
//                 )}
//               </div>

//               <div className="max-h-80 overflow-y-auto">
//                 {loading && <CompetitorsLoading />}

//                 {failed && (
//                   <div className="flex items-center justify-between gap-3 px-4 py-4">
//                     <p className="text-xs text-red-500">
//                       Couldn&apos;t load nearby competitors. Try again, or skip
//                       this step and add them later.
//                     </p>
//                     <button
//                       type="button"
//                       onClick={() => refetchSuggestions()}
//                       className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                     >
//                       Try again
//                     </button>
//                   </div>
//                 )}

//                 {suggestions && list.length === 0 && (
//                   <p className="px-4 py-4 text-xs text-gray-500">
//                     No competitors found nearby. You can add some later from
//                     your dashboard.
//                   </p>
//                 )}

//                 {list.map((c, i) => (
//                   <CompetitorRow
//                     key={c.id}
//                     competitor={c}
//                     index={i}
//                     checked={selectedIds.includes(c.id)}
//                     added={addedCompetitorIds.includes(c.id)}
//                     onToggle={() => toggleCompetitor(c.id)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="mt-5">
//               <ErrorBanner message={apiError} />
//             </div>

//             <PrimaryButton
//               onClick={handleCompetitorsContinue}
//               loading={submitting}
//             >
//               {submitting
//                 ? "Saving…"
//                 : selectedCount === 0
//                   ? "Skip for now"
//                   : `Continue with ${selectedCount} competitor${selectedCount === 1 ? "" : "s"}`}
//             </PrimaryButton>
//           </div>
//         );
//       }

//       case 5:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Set up your NFC Review Stand
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Let customers tap their phone and leave a review in seconds.
//             </p>

//             <div className="mt-6">
//               <FieldLabel>Stand label</FieldLabel>
//               <input
//                 type="text"
//                 value={data.nfcLabel}
//                 disabled={!!card}
//                 onChange={(e) =>
//                   setData((d) => ({ ...d, nfcLabel: e.target.value }))
//                 }
//                 placeholder="e.g. Table 1 - Counter"
//                 className={[inputClass, "border-gray-200"].join(" ")}
//               />
//             </div>

//             <div
//               className="relative mt-5 flex h-60 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-cover bg-center"
//               style={
//                 nfcPhotoSrc
//                   ? {
//                       backgroundImage: `linear-gradient(rgba(17,24,39,.35),rgba(17,24,39,.35)), url(${nfcPhotoSrc})`,
//                     }
//                   : undefined
//               }
//             >
//               {!nfcPhotoSrc && (
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
//               )}

//               {/* the physical stand */}
//               <div className="relative flex flex-col items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
//                 {qrDataUrl ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={qrDataUrl}
//                     alt="QR code linking to your review page"
//                     className="h-28 w-28"
//                   />
//                 ) : (
//                   <div className="flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-300">
//                     <Icon.Contactless className="h-10 w-10" />
//                   </div>
//                 )}
//                 <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
//                   <Icon.Contactless className="h-3.5 w-3.5 text-blue-500" />
//                   Tap or scan to review
//                 </span>
//               </div>
//             </div>

//             {card?.tapUrl && (
//               <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
//                 <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
//                   {card.tapUrl}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={handleCopyTapUrl}
//                   className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   {copied ? "Copied" : "Copy link"}
//                 </button>
//               </div>
//             )}

//             <div className="mt-4">
//               <ErrorBanner message={apiError} />
//             </div>

//             {card ? (
//               <>
//                 <PrimaryButton onClick={handleDownloadQr} disabled={!qrDataUrl}>
//                   <Icon.Download className="h-4 w-4" />
//                   Download QR code
//                 </PrimaryButton>
//                 {qrSvg && (
//                   <button
//                     type="button"
//                     onClick={handleDownloadSvg}
//                     className="mt-2 w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700"
//                   >
//                     Download as SVG
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleNfcContinue}
//                   disabled={submitting}
//                   className="mt-3 flex w-full items-center justify-center gap-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-60"
//                 >
//                   {submitting && (
//                     <Icon.Spinner className="h-4 w-4 animate-spin" />
//                   )}
//                   Continue to finish setup →
//                 </button>
//               </>
//             ) : (
//               <PrimaryButton onClick={handleGenerateNfc} loading={submitting}>
//                 {submitting ? "Generating…" : "Generate NFC QR Code"}
//               </PrimaryButton>
//             )}
//           </div>
//         );

//       case 6:
//         return (
//           <div className="flex flex-col items-center text-center">
//             <div className="relative flex h-24 w-24 items-center justify-center">
//               <span className="absolute -left-5 -top-1 text-xl">🎉</span>
//               <span className="absolute -right-6 top-2 text-lg">🎊</span>
//               <span className="absolute -bottom-1 left-1 text-base">✨</span>
//               <span className="absolute -bottom-2 right-0 text-lg">🎈</span>
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
//                   <Icon.Check className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <h1 className="mt-6 text-2xl font-semibold text-gray-900">
//               You&apos;re all set!
//             </h1>
//             <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
//               Your Grow More Reviews account is ready. You can now start getting
//               more reviews and growing your business.
//             </p>

//             <PrimaryButton className="mt-8" onClick={handleGoDashboard}>
//               Go Dashboard
//             </PrimaryButton>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   /* ---- render ---- */

//   if (profileLoading) {
//     return (
//       <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
//         <Icon.Spinner className="h-6 w-6 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen w-full items-stretch justify-center bg-gray-100 p-0 sm:p-6">
//       <div className="flex w-full max-w-7xl overflow-hidden bg-white shadow-sm sm:rounded-2xl">
//         {/* Left: wizard */}
//         <div className="flex w-full flex-col px-5 py-6 sm:px-10 sm:py-10 lg:w-[52%]">
//           <Stepper current={step} maxStep={maxStep} onJump={jumpTo} />
//           <div className="mt-8 flex-1 sm:mt-10">{renderStep()}</div>
//         </div>

//         {/* Right: hero photo — hidden on small screens to keep the form the focus */}
//         <div className="relative hidden lg:block lg:w-[48%]">
//           <Image
//             src={heroImageSrc}
//             alt="Storefront of the business being onboarded"
//             fill
//             sizes="(min-width: 1024px) 48vw, 0px"
//             className="object-cover"
//             priority
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import Image from "next/image";
// import dynamic from "next/dynamic";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";

// import CountrySelect, { CountryOption } from "./CountrySelect";
// import { Icon } from "./icons";
// import { MapPin } from "@/components/onBoardingCom/MapView";
// // 👇 adjust this path to wherever your onboarding slice lives
// import {
//   useGetCheckUserBusinessProfileQuery,
//   usePostStep1Mutation,
//   usePostStep2Mutation,
//   usePatchStep2Mutation,
//   usePatchStep3Mutation,
//   // Competitor step (AI suggestions) — slice "step 5"
//   useGetStep5Query,
//   usePostStep5Mutation,
//   usePatchStep5Mutation,
//   // NFC step — slice "step 6"
//   useGetStep6Query,
//   usePostStep6Mutation,
//   usePatchStep6Mutation,
// } from "@/redux/api/onboarding/onboardingSliceApi";

// // Leaflet touches `window` on import, so it must never run during SSR.
// const MapView = dynamic(() => import("@/components/onBoardingCom/MapView"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
//   ),
// });

// /* ------------------------------------------------------------------ */
// /*  Types                                                              */
// /* ------------------------------------------------------------------ */

// type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
// type ReviewTiming = "2h" | "5h" | "24h" | "custom";
// type RequestChannel = "SMS" | "EMAIL";

// interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
// }

// /** A Google Place as returned by /business/search-places */
// interface Place {
//   placeId: string;
//   name: string;
//   address: string;
//   rating?: number;
//   userRatingsTotal?: number;
//   googleMapsUrl?: string;
//   googleReviewUrl?: string;
//   category?: string;
// }

// interface Business {
//   id: string;
//   userId?: string;
//   name: string;
//   placeId: string;
//   address?: string;
//   phone?: string | null;
//   website?: string | null;
//   category?: string | null;
//   rating?: number | null;
//   userRatingsTotal?: number | null;
//   googleReviewUrl?: string | null;
//   googleMapsUrl?: string | null;
//   monthlyGoal?: number | null;
//   country?: string | null;
//   isOnboardingCompleted: boolean;
//   onboardingStep: number;
//   autoReviewRequests: boolean;
//   followUpReminder: boolean;
//   defaultRequestChannel: string;
//   requestDelay: string;
//   /** Optional — used for the map if the backend sends them. */
//   latitude?: number | null;
//   longitude?: number | null;
// }

// /** One entry of `data.suggestedCompetitors` from GET /competitor/business/:id/suggestions */
// interface SuggestedCompetitor {
//   id: string;
//   name: string;
//   rating?: number;
//   totalReviews?: number;
//   reviewsGained?: string;
//   growthRate?: string;
//   gmbLink?: string;
//   position?: string;
//   isSelected?: boolean;
//   /** Optional — real map position if the backend sends it. */
//   latitude?: number;
//   longitude?: number;
// }

// interface CompetitorSuggestions {
//   businessId: string;
//   businessName: string;
//   category?: string;
//   radiusMiles?: number;
//   metrics?: {
//     your_total_reviews?: number;
//     your_rating?: number;
//     your_review_growth_rate?: string;
//     competitor_average_reviews?: number;
//     competitor_average_growth_rate?: string;
//     growth_difference?: string;
//     status?: string;
//   };
//   aiSummary?: string;
//   comparisonTable?: unknown[];
//   suggestedCompetitors: SuggestedCompetitor[];
// }

// interface NfcCard {
//   id?: string;
//   cardId?: string;
//   label: string;
//   shortCode: string;
//   tapUrl: string;
//   qrCodeDataUrl?: string;
//   qrCodeSvg?: string;
// }

// interface FormState {
//   businessName: string;
//   country: string;
//   category: string;
//   gmbConnected: boolean;
//   defaultRequestChannel: RequestChannel;
//   reviewTiming: ReviewTiming;
//   customHours: string;
//   followUpReminder: boolean;
//   autoReviewRequests: boolean;
//   nfcLabel: string;
// }

// export interface OnboardingResult {
//   form: FormState;
//   business: Business | null;
// }

// export interface GrowMoreReviewsOnboardingProps {
//   /** Public path (or remote URL) for the storefront hero photo shown on the right. */
//   heroImageSrc?: string;
//   /** Optional photo of the physical NFC/QR review stand. Falls back to a drawn mockup. */
//   nfcPhotoSrc?: string;
//   /** Called once the person finishes the wizard and clicks "Go Dashboard". */
//   onComplete?: (result: OnboardingResult) => void;
//   /** Called on every successful step change — useful for analytics. */
//   onStepChange?: (step: StepIndex) => void;
// }

// /* ------------------------------------------------------------------ */
// /*  Static data                                                        */
// /* ------------------------------------------------------------------ */

// const STEPS: { id: StepIndex; label: string }[] = [
//   { id: 1, label: "Business Setup" },
//   { id: 2, label: "GMB Connect" },
//   { id: 3, label: "Review request" },
//   { id: 4, label: "Competitor" },
//   { id: 5, label: "NFC Setup" },
//   { id: 6, label: "Complete" },
// ];

// /**
//  * ISO 3166-1 alpha-2 codes power both the flag icon and the fallback map center.
//  * The country only affects the map preview; it is not sent to the API.
//  */
// const COUNTRIES: (CountryOption & { center: [number, number] })[] = [
//   { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
//   { code: "US", name: "United States", center: [40.7128, -74.006] },
//   { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
//   { code: "NL", name: "Netherlands", center: [52.3676, 4.9041] },
//   { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
//   { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
//   { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
//   { code: "IN", name: "India", center: [28.6139, 77.209] },
// ];

// /** Values sent as `category` on POST /business — confirm the exact list with the backend. */
// const CATEGORY_OPTIONS = [
//   "Cafe / Restaurant",
//   "Retail / Shop",
//   "Salon / Spa",
//   "Health / Clinic",
//   "Hotel / Lodging",
//   "Fitness / Gym",
//   "Automotive",
//   "Professional Services",
//   "Other",
// ];

// /** `delay` is the exact string the backend stores in `requestDelay`. */
// const TIMING_OPTIONS: { id: ReviewTiming; label: string; delay: string }[] = [
//   { id: "2h", label: "2 hours after service", delay: "2 hours after service" },
//   { id: "5h", label: "5 hours after service", delay: "5 hours after service" },
//   {
//     id: "24h",
//     label: "24 hours after service",
//     delay: "24 hours after service",
//   },
//   { id: "custom", label: "Custom time", delay: "" },
// ];

// // Confirm these enum values with the backend.
// const CHANNEL_OPTIONS: { id: RequestChannel; label: string }[] = [
//   { id: "SMS", label: "SMS" },
//   { id: "EMAIL", label: "Email" },
// ];

// /** Value for `?format=` on GET /nfc/:cardId/qrcode — confirm with the backend. */
// const QR_FORMAT = "png";

// /** Competitor avatar tint from the design (all competitors share one purple). */
// const COMPETITOR_AVATAR = "#6D5BD0";
// const PIN_SELECTED = "#16A34A";
// const PIN_UNSELECTED = "#9CA3AF";

// const DEFAULT_STATE: FormState = {
//   businessName: "",
//   country: "CA",
//   category: "",
//   gmbConnected: false,
//   defaultRequestChannel: "SMS",
//   reviewTiming: "2h",
//   customHours: "3",
//   followUpReminder: true,
//   autoReviewRequests: true,
//   nfcLabel: "Table 1 - Counter",
// };

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */

// function apiMessage(err: unknown, fallback: string): string {
//   const e = err as { data?: { message?: string | string[] }; error?: string };
//   const m = e?.data?.message;
//   if (Array.isArray(m)) return m.join(", ");
//   return m || e?.error || fallback;
// }

// function buildRequestDelay(timing: ReviewTiming, customHours: string): string {
//   if (timing === "custom") {
//     const h = Math.min(72, Math.max(1, Math.round(Number(customHours)) || 1));
//     return `${h} ${h === 1 ? "hour" : "hours"} after service`;
//   }
//   return TIMING_OPTIONS.find((o) => o.id === timing)!.delay;
// }

// function parseRequestDelay(delay?: string): {
//   timing: ReviewTiming;
//   customHours: string;
// } {
//   const known = TIMING_OPTIONS.find((o) => o.delay && o.delay === delay);
//   if (known) return { timing: known.id, customHours: "3" };
//   const m = delay?.match(/^(\d+)\s*hours?/i);
//   if (m) return { timing: "custom", customHours: m[1] };
//   return { timing: "2h", customHours: "3" };
// }

// function initialsOf(name: string): string {
//   return (
//     name
//       .split(/\s+/)
//       .filter(Boolean)
//       .slice(0, 2)
//       .map((w) => w[0]?.toUpperCase())
//       .join("") || "?"
//   );
// }

// /**
//  * Pull a [lat, lng] pair out of whatever shape the backend uses:
//  * { latitude, longitude } | { lat, lng } | { location: {...} } | { geometry: { location: {...} } }
//  */
// function extractLatLng(src: unknown): [number, number] | null {
//   if (!src || typeof src !== "object") return null;
//   const o = src as Record<string, any>;
//   const candidates = [o, o.location, o.geometry?.location, o.coordinates];
//   for (const c of candidates) {
//     if (!c || typeof c !== "object") continue;
//     const lat = Number(c.latitude ?? c.lat);
//     const lng = Number(c.longitude ?? c.lng ?? c.lon);
//     if (
//       Number.isFinite(lat) &&
//       Number.isFinite(lng) &&
//       (lat !== 0 || lng !== 0)
//     )
//       return [lat, lng];
//   }
//   return null;
// }

// /**
//  * The suggestions API returns no coordinates. Until it does, spread the pins
//  * deterministically around the business inside the search radius so the map
//  * still reflects "nearby". Same input → same position (no jumping on re-render).
//  */
// function approxPosition(
//   center: [number, number],
//   index: number,
//   seed: string,
//   radiusMiles: number,
// ): [number, number] {
//   let h = 0;
//   for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
//   const angle = ((index * 137.5 + (h % 25)) * Math.PI) / 180; // golden-angle spread
//   const dist = radiusMiles * (0.3 + ((h >>> 5) % 50) / 100); // 30–79% of radius
//   const dLat = (dist * Math.cos(angle)) / 69;
//   const dLng =
//     (dist * Math.sin(angle)) / (69 * Math.cos((center[0] * Math.PI) / 180));
//   return [center[0] + dLat, center[1] + dLng];
// }

// function zoomForRadius(miles = 5): number {
//   if (miles <= 1) return 14;
//   if (miles <= 3) return 13;
//   if (miles <= 8) return 12;
//   if (miles <= 20) return 11;
//   return 10;
// }

// /* ------------------------------------------------------------------ */
// /*  Stepper                                                             */
// /* ------------------------------------------------------------------ */

// function Stepper({
//   current,
//   maxStep,
//   onJump,
// }: {
//   current: StepIndex;
//   maxStep: StepIndex;
//   onJump: (step: StepIndex) => void;
// }) {
//   return (
//     <ol className="flex w-full items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
//       {STEPS.map((step, idx) => {
//         const done = step.id <= current;
//         const reachable = step.id <= maxStep;
//         const isLast = idx === STEPS.length - 1;
//         return (
//           <li key={step.id} className="flex flex-1 items-center last:flex-none">
//             <div className="flex min-w-[52px] flex-col items-center text-center sm:min-w-[64px]">
//               <button
//                 type="button"
//                 onClick={() => reachable && onJump(step.id)}
//                 disabled={!reachable}
//                 aria-current={step.id === current ? "step" : undefined}
//                 className={[
//                   "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs",
//                   done
//                     ? "bg-emerald-500 text-white enabled:cursor-pointer enabled:hover:bg-emerald-600"
//                     : reachable
//                       ? "border border-emerald-400 bg-white text-emerald-600 enabled:cursor-pointer"
//                       : "border border-gray-300 bg-white text-gray-400",
//                 ].join(" ")}
//               >
//                 {done ? (
//                   <Icon.Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                 ) : (
//                   String(step.id).padStart(2, "0")
//                 )}
//               </button>
//               <span
//                 className={[
//                   "mt-1.5 text-[10px] leading-tight sm:text-xs",
//                   step.id === current
//                     ? "font-medium text-gray-900"
//                     : "text-gray-500",
//                 ].join(" ")}
//               >
//                 {step.label}
//               </span>
//             </div>
//             {!isLast && (
//               <div
//                 className={[
//                   "mx-1 mt-3.5 h-px flex-1 sm:mt-4",
//                   step.id < current ? "bg-emerald-400" : "bg-gray-200",
//                 ].join(" ")}
//               />
//             )}
//           </li>
//         );
//       })}
//     </ol>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Shared UI bits                                                      */
// /* ------------------------------------------------------------------ */

// function FieldLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <label className="mb-1.5 block text-sm font-medium text-gray-700">
//       {children}
//     </label>
//   );
// }

// function FieldError({ children }: { children?: React.ReactNode }) {
//   if (!children) return null;
//   return <p className="mt-1.5 text-xs text-red-500">{children}</p>;
// }

// function PrimaryButton({
//   children,
//   className = "",
//   loading = false,
//   disabled,
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
//   return (
//     <button
//       {...rest}
//       disabled={disabled || loading}
//       className={[
//         "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors",
//         "hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300",
//         className,
//       ].join(" ")}
//     >
//       {loading && <Icon.Spinner className="h-4 w-4 animate-spin" />}
//       {children}
//     </button>
//   );
// }

// const inputClass =
//   "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400";

// function Toggle({
//   checked,
//   onChange,
//   label,
//   hint,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
//   hint?: string;
// }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300"
//     >
//       <span>
//         <span className="block text-sm font-medium text-gray-800">{label}</span>
//         {hint && <span className="block text-xs text-gray-500">{hint}</span>}
//       </span>
//       <span
//         className={[
//           "relative h-5 w-9 shrink-0 rounded-full transition-colors",
//           checked ? "bg-emerald-500" : "bg-gray-300",
//         ].join(" ")}
//       >
//         <span
//           className={[
//             "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
//             checked ? "left-[18px]" : "left-0.5",
//           ].join(" ")}
//         />
//       </span>
//     </button>
//   );
// }

// function RatingLine({
//   rating,
//   total,
// }: {
//   rating?: number | null;
//   total?: number | null;
// }) {
//   if (rating == null) return null;
//   return (
//     <span className="text-xs text-gray-500">
//       <span className="text-amber-500">★</span> {rating.toFixed(1)}
//       {total != null && <> ({total.toLocaleString()} reviews)</>}
//     </span>
//   );
// }

// function ErrorBanner({ message }: { message: string | null }) {
//   if (!message) return null;
//   return (
//     <div
//       role="alert"
//       className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
//     >
//       {message}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Competitor step bits                                                */
// /* ------------------------------------------------------------------ */

// /** The AI discovery call can take a while, so say what is happening. */
// function CompetitorsLoading() {
//   const [seconds, setSeconds] = useState(0);
//   useEffect(() => {
//     const t = setInterval(() => setSeconds((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const message =
//     seconds < 6
//       ? "Finding businesses near you…"
//       : seconds < 20
//         ? "Comparing review counts and ratings…"
//         : "Still working. Competitor analysis can take about a minute.";

//   return (
//     <div aria-live="polite">
//       <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
//         <Icon.Spinner className="h-3.5 w-3.5 animate-spin text-blue-600" />
//         {message}
//       </div>
//       {[0, 1, 2, 3].map((i) => (
//         <div
//           key={i}
//           className={[
//             "flex items-center gap-3 px-4 py-3",
//             i % 2 === 0 ? "bg-gray-50" : "bg-white",
//           ].join(" ")}
//         >
//           <span className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200" />
//           <span className="flex-1 space-y-2">
//             <span className="block h-3 w-2/5 animate-pulse rounded bg-gray-200" />
//             <span className="block h-2.5 w-1/4 animate-pulse rounded bg-gray-100" />
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

// function CompetitorRow({
//   competitor,
//   index,
//   checked,
//   added,
//   onToggle,
// }: {
//   competitor: SuggestedCompetitor;
//   index: number;
//   checked: boolean;
//   added: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       role="checkbox"
//       aria-checked={checked}
//       disabled={added}
//       onClick={onToggle}
//       className={[
//         "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors enabled:hover:bg-blue-50/60",
//         index % 2 === 0 ? "bg-gray-50" : "bg-white",
//       ].join(" ")}
//     >
//       <span
//         className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
//         style={{ backgroundColor: COMPETITOR_AVATAR }}
//       >
//         {initialsOf(competitor.name)}
//       </span>
//       <span className="min-w-0 flex-1">
//         <span className="block truncate text-sm font-medium text-gray-800">
//           {competitor.name}
//         </span>
//         <span className="flex flex-wrap items-center gap-x-2">
//           <RatingLine
//             rating={competitor.rating}
//             total={competitor.totalReviews}
//           />
//           {competitor.growthRate && (
//             <span className="text-xs text-gray-400">
//               Growth {competitor.growthRate}
//             </span>
//           )}
//         </span>
//       </span>
//       {added && (
//         <span className="shrink-0 text-xs font-medium text-emerald-600">
//           Added
//         </span>
//       )}
//       <span
//         className={[
//           "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
//           checked
//             ? "border-blue-600 bg-blue-600 text-white"
//             : "border-gray-300 bg-white",
//         ].join(" ")}
//       >
//         {checked && <Icon.Check className="h-3 w-3" />}
//       </span>
//     </button>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Main component                                                      */
// /* ------------------------------------------------------------------ */

// export default function GrowMoreReviewsOnboarding({
//   heroImageSrc = "/images/onBoarding/right-side.png",
//   nfcPhotoSrc,
//   onComplete,
//   onStepChange,
// }: GrowMoreReviewsOnboardingProps) {
//   const router = useRouter();

//   const [step, setStep] = useState<StepIndex>(1);
//   const [maxStep, setMaxStep] = useState<StepIndex>(1);
//   const [data, setData] = useState<FormState>(DEFAULT_STATE);

//   const [business, setBusiness] = useState<Business | null>(null);
//   const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
//   const [errors, setErrors] = useState<{
//     name?: string;
//     category?: string;
//   }>({});

//   // Competitor step: suggestions are copied into local state once loaded so the
//   // (expensive) AI request is never re-run by tag invalidation or re-renders.
//   const [suggestions, setSuggestions] = useState<CompetitorSuggestions | null>(
//     null,
//   );
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [addedCompetitorIds, setAddedCompetitorIds] = useState<string[]>([]);

//   const [card, setCard] = useState<NfcCard | null>(null);
//   const [copied, setCopied] = useState(false);

//   const [submitting, setSubmitting] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   /* ---- API hooks ---- */

//   const { data: profileRes, isLoading: profileLoading } =
//     useGetCheckUserBusinessProfileQuery(undefined);

//   // Step 4 (Competitor) → GET /competitor/business/:businessId/suggestions
//   const {
//     currentData: suggestionsRes,
//     isError: suggestionsQueryError,
//     refetch: refetchSuggestions,
//   } = useGetStep5Query(business?.id, {
//     skip: step !== 4 || !business?.id || !!suggestions,
//   });
//   const suggestionsData = (
//     suggestionsRes as ApiResponse<CompetitorSuggestions> | undefined
//   )?.data;

//   const cardId = card?.id ?? card?.cardId;
//   // Step 5 (NFC) → GET /nfc/:cardId/qrcode
//   const { data: qrRes } = useGetStep6Query(
//     { query: QR_FORMAT, cardId },
//     { skip: !cardId },
//   );
//   const qrPayload = (qrRes as ApiResponse<Partial<NfcCard>> | undefined)?.data;
//   // Prefer the fresh GET result; fall back to what the POST already returned.
//   const qrDataUrl = qrPayload?.qrCodeDataUrl ?? card?.qrCodeDataUrl ?? null;
//   const qrSvg = qrPayload?.qrCodeSvg ?? card?.qrCodeSvg ?? null;

//   const [postStep1] = usePostStep1Mutation();
//   const [postStep2] = usePostStep2Mutation();
//   const [patchStep2] = usePatchStep2Mutation();
//   const [patchStep3] = usePatchStep3Mutation();
//   const [postStep5] = usePostStep5Mutation(); // competitors bulk
//   const [patchStep5] = usePatchStep5Mutation(); // competitor step complete
//   const [postStep6] = usePostStep6Mutation(); // NFC card
//   const [patchStep6] = usePatchStep6Mutation(); // NFC step complete

//   /* ---- resume an unfinished onboarding ---- */

//   const hydrated = useRef(false);
//   useEffect(() => {
//     if (hydrated.current || profileLoading) return;
//     hydrated.current = true;

//     const raw = (profileRes as ApiResponse<Business | Business[]> | undefined)
//       ?.data;
//     const biz = Array.isArray(raw) ? raw[0] : raw;
//     if (!biz?.id) return; // brand-new user → start at step 1

//     if (biz.isOnboardingCompleted) {
//       router.replace("/dashboard");
//       return;
//     }

//     const resume = Math.min(
//       Math.max(biz.onboardingStep || 1, 1),
//       6,
//     ) as StepIndex;
//     const { timing, customHours } = parseRequestDelay(biz.requestDelay);

//     setBusiness(biz);
//     setSelectedPlace({
//       placeId: biz.placeId,
//       name: biz.name,
//       address: biz.address ?? "",
//       rating: biz.rating ?? undefined,
//       userRatingsTotal: biz.userRatingsTotal ?? undefined,
//       googleMapsUrl: biz.googleMapsUrl ?? undefined,
//       googleReviewUrl: biz.googleReviewUrl ?? undefined,
//       category: biz.category ?? undefined,
//     });
//     setData((d) => ({
//       ...d,
//       businessName: biz.name,
//       category: biz.category ?? d.category,
//       country:
//         COUNTRIES.find(
//           (c) => c.name.toLowerCase() === (biz.country ?? "").toLowerCase(),
//         )?.code ?? d.country,
//       gmbConnected: resume >= 3,
//       defaultRequestChannel:
//         biz.defaultRequestChannel === "EMAIL" ? "EMAIL" : "SMS",
//       reviewTiming: timing,
//       customHours,
//       followUpReminder: biz.followUpReminder ?? true,
//       autoReviewRequests: biz.autoReviewRequests ?? true,
//     }));
//     setStep(resume);
//     setMaxStep(resume);
//   }, [profileLoading, profileRes, router]);

//   // Store the AI suggestions once and pre-tick the ones the API marked `isSelected`.
//   useEffect(() => {
//     if (suggestions || !suggestionsData?.suggestedCompetitors) return;
//     setSuggestions(suggestionsData);
//     setSelectedIds(
//       suggestionsData.suggestedCompetitors
//         .filter((c) => c.isSelected)
//         .map((c) => c.id),
//     );
//   }, [suggestions, suggestionsData]);

//   /* ---- navigation + request plumbing ---- */

//   const goTo = useCallback(
//     (next: StepIndex) => {
//       setApiError(null);
//       setStep(next);
//       setMaxStep((m) => (next > m ? next : m));
//       onStepChange?.(next);
//     },
//     [onStepChange],
//   );

//   const jumpTo = useCallback(
//     (target: StepIndex) => {
//       setApiError(null);
//       setStep(target);
//       onStepChange?.(target);
//     },
//     [onStepChange],
//   );

//   const run = async (fn: () => Promise<void>) => {
//     setApiError(null);
//     setSubmitting(true);
//     try {
//       await fn();
//     } catch (err) {
//       setApiError(apiMessage(err, "Something went wrong. Please try again."));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /** Merge a server response into local business state without ever moving the step backwards. */
//   const mergeBusiness = (incoming?: Partial<Business> | null) => {
//     if (!incoming || typeof incoming !== "object") return;
//     setBusiness((prev) => {
//       if (!prev) return incoming.id ? (incoming as Business) : prev;
//       if (incoming.id && incoming.id !== prev.id) return prev;
//       return {
//         ...prev,
//         ...incoming,
//         onboardingStep: Math.max(
//           prev.onboardingStep ?? 0,
//           incoming.onboardingStep ?? 0,
//         ),
//       };
//     });
//   };

//   /** Never send a lower onboardingStep than the server already has (e.g. after going back). */
//   const stepToSend = (target: number) =>
//     Math.max(target, business?.onboardingStep ?? 0);

//   const selectedCountry = useMemo(
//     () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
//     [data.country],
//   );

//   /** Real coordinates when the backend provides them, otherwise the country center. */
//   const businessCenter: [number, number] = useMemo(
//     () =>
//       extractLatLng(business) ??
//       extractLatLng(selectedPlace) ??
//       selectedCountry.center,
//     [business, selectedPlace, selectedCountry],
//   );

//   const businessPin: MapPin[] = useMemo(
//     () => [
//       {
//         id: "business",
//         position: businessCenter,
//         label: business?.name || data.businessName || "Your business",
//         color: "#2563EB",
//         primary: true,
//       },
//     ],
//     [businessCenter, business?.name, data.businessName],
//   );

//   /** Competitor pins: green when ticked, grey when not. */
//   const { competitorPins, pinsApproximate } = useMemo(() => {
//     const list = suggestions?.suggestedCompetitors ?? [];
//     const radius = suggestions?.radiusMiles ?? 5;
//     let approximate = false;
//     const pins: MapPin[] = list.map((c, i) => {
//       const real = extractLatLng(c);
//       if (!real) approximate = true;
//       return {
//         id: c.id,
//         position: real ?? approxPosition(businessCenter, i, c.id, radius),
//         label: c.name,
//         color: selectedIds.includes(c.id) ? PIN_SELECTED : PIN_UNSELECTED,
//         primary: false,
//       };
//     });
//     return { competitorPins: pins, pinsApproximate: approximate };
//   }, [suggestions, selectedIds, businessCenter]);

//   const competitorZoom = zoomForRadius(suggestions?.radiusMiles);

//   /* ---- step handlers ---- */

//   // Step 1 → POST /business { name, country, category }, then go to step 2
//   const handleBusinessContinue = () =>
//     run(async () => {
//       const next: typeof errors = {};
//       if (!data.businessName.trim())
//         next.name = "Enter your business name to continue.";
//       if (!data.category) next.category = "Select a category to continue.";
//       setErrors(next);
//       if (Object.keys(next).length) return;

//       // Already created (person came back to step 1) → don't create a duplicate.
//       if (!business) {
//         const res = (await postStep1({
//           name: data.businessName.trim(),
//           country: selectedCountry.name,
//           category: data.category,
//         }).unwrap()) as ApiResponse<Business>;
//         setBusiness(res.data);
//       }
//       goTo(2);
//     });

//   // Step 2 → POST /business/:id/sync-google
//   const handleConnectGMB = () =>
//     run(async () => {
//       if (!business || data.gmbConnected) return;
//       const res = (await postStep2({
//         businessId: business.id,
//         body: {},
//       }).unwrap()) as ApiResponse<Partial<Business>> | undefined;
//       mergeBusiness(res?.data);
//       setData((d) => ({ ...d, gmbConnected: true }));
//     });

//   // Step 2 → PATCH /business/:id/onboarding { onboardingStep: 3 }
//   const handleGmbContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep2({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(3) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(3);
//     });

//   // Step 3 → PATCH /business/:id { channel, delay, toggles, onboardingStep: 4 }
//   const handleReviewRequestContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep3({
//         businessId: business.id,
//         body: {
//           defaultRequestChannel: data.defaultRequestChannel,
//           requestDelay: buildRequestDelay(data.reviewTiming, data.customHours),
//           followUpReminder: data.followUpReminder,
//           autoReviewRequests: data.autoReviewRequests,
//           onboardingStep: stepToSend(4),
//         },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(4);
//     });

//   const toggleCompetitor = (id: string) =>
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );

//   // Step 4 → POST /competitor/business/:id/bulk, then PATCH onboarding { onboardingStep: 5 }
//   const handleCompetitorsContinue = () =>
//     run(async () => {
//       if (!business) return;

//       // Only send ones that were not already saved (person may have come back).
//       const pending = (suggestions?.suggestedCompetitors ?? []).filter(
//         (c) => selectedIds.includes(c.id) && !addedCompetitorIds.includes(c.id),
//       );

//       if (pending.length) {
//         await postStep5({
//           businessId: business.id,
//           body: {
//             competitors: pending.map((c) => ({
//               name: c.name,
//               rating: c.rating,
//               userRatingsTotal: c.totalReviews,
//             })),
//           },
//         }).unwrap();
//         setAddedCompetitorIds((prev) => [...prev, ...pending.map((c) => c.id)]);
//       }

//       const res = (await patchStep5({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(5) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(5);
//     });

//   // Step 5 → POST /nfc (register card + get QR)
//   const handleGenerateNfc = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await postStep6({
//         businessId: business.id,
//         label: data.nfcLabel.trim() || "Review stand",
//       }).unwrap()) as ApiResponse<NfcCard>;
//       setCard(res.data);
//     });

//   const handleDownloadQr = () => {
//     if (!qrDataUrl) return;
//     const a = document.createElement("a");
//     a.href = qrDataUrl;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleDownloadSvg = () => {
//     if (!qrSvg) return;
//     const url = URL.createObjectURL(
//       new Blob([qrSvg], { type: "image/svg+xml" }),
//     );
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.svg`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   const handleCopyTapUrl = async () => {
//     if (!card?.tapUrl) return;
//     try {
//       await navigator.clipboard.writeText(card.tapUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1800);
//     } catch {
//       setApiError("Couldn't copy the link. Copy it manually instead.");
//     }
//   };

//   // Step 5 → PATCH onboarding { onboardingStep: 6 }
//   const handleNfcContinue = () =>
//     run(async () => {
//       if (!business) return;
//       const res = (await patchStep6({
//         businessId: business.id,
//         body: { onboardingStep: stepToSend(6) },
//       }).unwrap()) as ApiResponse<Business>;
//       mergeBusiness(res.data);
//       goTo(6);
//     });

//   const handleGoDashboard = () => {
//     onComplete?.({ form: data, business });
//     router.push("/dashboard");
//   };

//   /* ---- step content ---- */

//   const renderStep = () => {
//     switch (step) {
//       case 1: {
//         const locked = !!business; // business already created → fields are read-only here
//         const categoryOptions =
//           !data.category || CATEGORY_OPTIONS.includes(data.category)
//             ? CATEGORY_OPTIONS
//             : [...CATEGORY_OPTIONS, data.category];
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Welcome to Grow More Reviews!
//             </h1>
//             <p className="mt-1.5 text-sm text-gray-500">
//               Let&apos;s get your business ready to grow more reviews.
//             </p>

//             <div className="mt-7">
//               <FieldLabel>Business Name</FieldLabel>
//               <input
//                 type="text"
//                 value={data.businessName}
//                 disabled={locked}
//                 onChange={(e) => {
//                   setData((d) => ({ ...d, businessName: e.target.value }));
//                   if (errors.name)
//                     setErrors((er) => ({ ...er, name: undefined }));
//                 }}
//                 placeholder="e.g. Bella's Cafe House"
//                 className={[
//                   inputClass,
//                   errors.name ? "border-red-400" : "border-gray-200",
//                 ].join(" ")}
//               />
//               <FieldError>{errors.name}</FieldError>
//             </div>

//             <div className="mt-5">
//               <FieldLabel>Category</FieldLabel>
//               <div className="relative">
//                 <select
//                   value={data.category}
//                   disabled={locked}
//                   onChange={(e) => {
//                     setData((d) => ({ ...d, category: e.target.value }));
//                     if (errors.category)
//                       setErrors((er) => ({ ...er, category: undefined }));
//                   }}
//                   className={[
//                     inputClass,
//                     "appearance-none pr-10",
//                     data.category ? "" : "text-gray-400",
//                     errors.category ? "border-red-400" : "border-gray-200",
//                   ].join(" ")}
//                 >
//                   <option value="" disabled>
//                     Select a category
//                   </option>
//                   {categoryOptions.map((c) => (
//                     <option key={c} value={c} className="text-gray-900">
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//                 <Icon.Chevron className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//               </div>
//               <FieldError>{errors.category}</FieldError>
//             </div>

//             <div className="mt-5">
//               <FieldLabel>Country</FieldLabel>
//               <div
//                 className={locked ? "pointer-events-none opacity-60" : ""}
//                 aria-disabled={locked}
//               >
//                 <CountrySelect
//                   value={data.country}
//                   options={COUNTRIES}
//                   onChange={(code: any) =>
//                     setData((d) => ({ ...d, country: code }))
//                   }
//                 />
//               </div>
//             </div>

//             <ErrorBanner message={apiError} />

//             <PrimaryButton
//               className="mt-8"
//               onClick={handleBusinessContinue}
//               loading={submitting}
//             >
//               {submitting ? "Saving…" : "Continue"}
//             </PrimaryButton>
//           </div>
//         );
//       }

//       case 2:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Connect your Google Business Profile
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Get real-time reviews, insights and manage your online reputation.
//             </p>

//             <div className="mt-7 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//                 <Icon.Store className="h-5 w-5" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <span className="block truncate text-sm font-medium text-gray-800">
//                   {business?.name || data.businessName || "Your business"}
//                 </span>
//                 {business?.address && (
//                   <span className="block truncate text-xs text-gray-500">
//                     {business.address}
//                   </span>
//                 )}
//                 <RatingLine
//                   rating={business?.rating}
//                   total={business?.userRatingsTotal}
//                 />
//               </div>
//               {business?.googleMapsUrl && (
//                 <a
//                   href={business.googleMapsUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   View on Maps
//                 </a>
//               )}
//             </div>

//             <ErrorBanner message={apiError} />

//             <PrimaryButton
//               className="mt-5"
//               onClick={handleConnectGMB}
//               loading={submitting && !data.gmbConnected}
//               disabled={data.gmbConnected || !business}
//             >
//               {data.gmbConnected
//                 ? "Connected"
//                 : submitting
//                   ? "Connecting…"
//                   : "Connect GMB"}
//             </PrimaryButton>

//             {data.gmbConnected && (
//               <div className="mt-5 space-y-3">
//                 <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
//                   <MapView
//                     key={`gmb-${businessCenter[0]}-${businessCenter[1]}`}
//                     center={businessCenter}
//                     zoom={14}
//                     pins={businessPin}
//                   />
//                 </div>
//                 <PrimaryButton onClick={handleGmbContinue} loading={submitting}>
//                   Continue
//                 </PrimaryButton>
//               </div>
//             )}
//           </div>
//         );

//       case 3:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               How do you want to collect reviews?
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Choose your preferred method to request reviews from customers.
//             </p>

//             <div className="mt-7">
//               <h2 className="mb-3 text-sm font-medium text-gray-700">
//                 Send requests by
//               </h2>
//               <div className="grid grid-cols-2 gap-2.5">
//                 {CHANNEL_OPTIONS.map((ch) => (
//                   <button
//                     key={ch.id}
//                     type="button"
//                     onClick={() =>
//                       setData((d) => ({ ...d, defaultRequestChannel: ch.id }))
//                     }
//                     aria-pressed={data.defaultRequestChannel === ch.id}
//                     className={[
//                       "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
//                       data.defaultRequestChannel === ch.id
//                         ? "border-emerald-400 bg-emerald-50/60 text-gray-900"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
//                     ].join(" ")}
//                   >
//                     {ch.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               <h2 className="mb-3 text-sm font-medium text-gray-700">
//                 When should we ask customers?
//               </h2>
//               <div className="space-y-2.5">
//                 {TIMING_OPTIONS.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={[
//                       "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
//                       data.reviewTiming === opt.id
//                         ? "border-emerald-400 bg-emerald-50/60"
//                         : "border-gray-200 bg-white hover:border-gray-300",
//                     ].join(" ")}
//                   >
//                     <span
//                       className={[
//                         "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
//                         data.reviewTiming === opt.id
//                           ? "border-emerald-500"
//                           : "border-gray-300",
//                       ].join(" ")}
//                     >
//                       {data.reviewTiming === opt.id && (
//                         <span className="h-2 w-2 rounded-full bg-emerald-500" />
//                       )}
//                     </span>
//                     <input
//                       type="radio"
//                       name="timing"
//                       className="sr-only"
//                       checked={data.reviewTiming === opt.id}
//                       onChange={() =>
//                         setData((d) => ({ ...d, reviewTiming: opt.id }))
//                       }
//                     />
//                     <span className="text-gray-700">{opt.label}</span>
//                   </label>
//                 ))}

//                 {data.reviewTiming === "custom" && (
//                   <div className="relative pl-1 pt-1">
//                     <input
//                       type="number"
//                       min={1}
//                       max={72}
//                       value={data.customHours}
//                       onChange={(e) =>
//                         setData((d) => ({ ...d, customHours: e.target.value }))
//                       }
//                       className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//                       hours
//                     </span>
//                     <Icon.Clock className="pointer-events-none absolute right-11 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 space-y-2.5">
//               <Toggle
//                 checked={data.autoReviewRequests}
//                 onChange={(v) =>
//                   setData((d) => ({ ...d, autoReviewRequests: v }))
//                 }
//                 label="Send requests automatically"
//                 hint="We ask every customer without you lifting a finger."
//               />
//               <Toggle
//                 checked={data.followUpReminder}
//                 onChange={(v) =>
//                   setData((d) => ({ ...d, followUpReminder: v }))
//                 }
//                 label="Send a follow-up reminder"
//                 hint="A gentle nudge if they haven't reviewed yet."
//               />
//             </div>

//             <div className="mt-5">
//               <ErrorBanner message={apiError} />
//             </div>

//             <PrimaryButton
//               onClick={handleReviewRequestContinue}
//               loading={submitting}
//             >
//               {submitting ? "Saving…" : "Continue"}
//             </PrimaryButton>
//           </div>
//         );

//       case 4: {
//         const list = suggestions?.suggestedCompetitors ?? [];
//         const selectedCount = selectedIds.length;
//         // Response arrived but without a usable list → treat like a failed request.
//         const failed =
//           !suggestions &&
//           (suggestionsQueryError ||
//             (!!suggestionsRes && !suggestionsData?.suggestedCompetitors));
//         const loading = !suggestions && !failed;
//         const mapPins = [...businessPin, ...competitorPins];

//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Find your competitors
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               We&apos;ll automatically identify nearby competitors and compare
//               your review growth.
//             </p>

//             {/* Map */}
//             <div className="mt-6 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
//               <div className="relative h-44 overflow-hidden rounded-lg">
//                 <MapView
//                   key={`competitors-${businessCenter[0]}-${businessCenter[1]}-${competitorZoom}`}
//                   center={businessCenter}
//                   zoom={competitorZoom}
//                   pins={mapPins}
//                 />
//               </div>
//             </div>
//             {pinsApproximate && !loading && (
//               <p className="mt-1.5 text-[11px] text-gray-400">
//                 Pin positions are approximate.
//               </p>
//             )}

//             {/* Competitor list */}
//             <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
//               <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900">
//                 <span>Your Competitors</span>
//                 {!loading && !failed && (
//                   <span className="text-xs font-normal text-gray-500">
//                     {selectedCount} selected
//                   </span>
//                 )}
//               </div>

//               <div className="max-h-80 overflow-y-auto">
//                 {loading && <CompetitorsLoading />}

//                 {failed && (
//                   <div className="flex items-center justify-between gap-3 px-4 py-4">
//                     <p className="text-xs text-red-500">
//                       Couldn&apos;t load nearby competitors. Try again, or skip
//                       this step and add them later.
//                     </p>
//                     <button
//                       type="button"
//                       onClick={() => refetchSuggestions()}
//                       className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                     >
//                       Try again
//                     </button>
//                   </div>
//                 )}

//                 {suggestions && list.length === 0 && (
//                   <p className="px-4 py-4 text-xs text-gray-500">
//                     No competitors found nearby. You can add some later from
//                     your dashboard.
//                   </p>
//                 )}

//                 {list.map((c, i) => (
//                   <CompetitorRow
//                     key={c.id}
//                     competitor={c}
//                     index={i}
//                     checked={selectedIds.includes(c.id)}
//                     added={addedCompetitorIds.includes(c.id)}
//                     onToggle={() => toggleCompetitor(c.id)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="mt-5">
//               <ErrorBanner message={apiError} />
//             </div>

//             <PrimaryButton
//               onClick={handleCompetitorsContinue}
//               loading={submitting}
//             >
//               {submitting
//                 ? "Saving…"
//                 : selectedCount === 0
//                   ? "Skip for now"
//                   : `Continue with ${selectedCount} competitor${selectedCount === 1 ? "" : "s"}`}
//             </PrimaryButton>
//           </div>
//         );
//       }

//       case 5:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Set up your NFC Review Stand
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Let customers tap their phone and leave a review in seconds.
//             </p>

//             <div className="mt-6">
//               <FieldLabel>Stand label</FieldLabel>
//               <input
//                 type="text"
//                 value={data.nfcLabel}
//                 disabled={!!card}
//                 onChange={(e) =>
//                   setData((d) => ({ ...d, nfcLabel: e.target.value }))
//                 }
//                 placeholder="e.g. Table 1 - Counter"
//                 className={[inputClass, "border-gray-200"].join(" ")}
//               />
//             </div>

//             <div
//               className="relative mt-5 flex h-60 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-cover bg-center"
//               style={
//                 nfcPhotoSrc
//                   ? {
//                       backgroundImage: `linear-gradient(rgba(17,24,39,.35),rgba(17,24,39,.35)), url(${nfcPhotoSrc})`,
//                     }
//                   : undefined
//               }
//             >
//               {!nfcPhotoSrc && (
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
//               )}

//               {/* the physical stand */}
//               <div className="relative flex flex-col items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
//                 {qrDataUrl ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={qrDataUrl}
//                     alt="QR code linking to your review page"
//                     className="h-28 w-28"
//                   />
//                 ) : (
//                   <div className="flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-300">
//                     <Icon.Contactless className="h-10 w-10" />
//                   </div>
//                 )}
//                 <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
//                   <Icon.Contactless className="h-3.5 w-3.5 text-blue-500" />
//                   Tap or scan to review
//                 </span>
//               </div>
//             </div>

//             {card?.tapUrl && (
//               <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
//                 <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
//                   {card.tapUrl}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={handleCopyTapUrl}
//                   className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   {copied ? "Copied" : "Copy link"}
//                 </button>
//               </div>
//             )}

//             <div className="mt-4">
//               <ErrorBanner message={apiError} />
//             </div>

//             {card ? (
//               <>
//                 <PrimaryButton onClick={handleDownloadQr} disabled={!qrDataUrl}>
//                   <Icon.Download className="h-4 w-4" />
//                   Download QR code
//                 </PrimaryButton>
//                 {qrSvg && (
//                   <button
//                     type="button"
//                     onClick={handleDownloadSvg}
//                     className="mt-2 w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700"
//                   >
//                     Download as SVG
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleNfcContinue}
//                   disabled={submitting}
//                   className="mt-3 flex w-full items-center justify-center gap-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-60"
//                 >
//                   {submitting && (
//                     <Icon.Spinner className="h-4 w-4 animate-spin" />
//                   )}
//                   Continue to finish setup →
//                 </button>
//               </>
//             ) : (
//               <PrimaryButton onClick={handleGenerateNfc} loading={submitting}>
//                 {submitting ? "Generating…" : "Generate NFC QR Code"}
//               </PrimaryButton>
//             )}
//           </div>
//         );

//       case 6:
//         return (
//           <div className="flex flex-col items-center text-center">
//             <div className="relative flex h-24 w-24 items-center justify-center">
//               <span className="absolute -left-5 -top-1 text-xl">🎉</span>
//               <span className="absolute -right-6 top-2 text-lg">🎊</span>
//               <span className="absolute -bottom-1 left-1 text-base">✨</span>
//               <span className="absolute -bottom-2 right-0 text-lg">🎈</span>
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
//                   <Icon.Check className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <h1 className="mt-6 text-2xl font-semibold text-gray-900">
//               You&apos;re all set!
//             </h1>
//             <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
//               Your Grow More Reviews account is ready. You can now start getting
//               more reviews and growing your business.
//             </p>

//             <PrimaryButton className="mt-8" onClick={handleGoDashboard}>
//               Go Dashboard
//             </PrimaryButton>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   /* ---- render ---- */

//   if (profileLoading) {
//     return (
//       <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
//         <Icon.Spinner className="h-6 w-6 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen w-full items-stretch justify-center bg-gray-100 p-0 sm:p-6">
//       <div className="flex w-full max-w-7xl overflow-hidden bg-white shadow-sm sm:rounded-2xl">
//         {/* Left: wizard */}
//         <div className="flex w-full flex-col px-5 py-6 sm:px-10 sm:py-10 lg:w-[52%]">
//           <Stepper current={step} maxStep={maxStep} onJump={jumpTo} />
//           <div className="mt-8 flex-1 sm:mt-10">{renderStep()}</div>
//         </div>

//         {/* Right: hero photo — hidden on small screens to keep the form the focus */}
//         <div className="relative hidden lg:block lg:w-[48%]">
//           <Image
//             src={heroImageSrc}
//             alt="Storefront of the business being onboarded"
//             fill
//             sizes="(min-width: 1024px) 48vw, 0px"
//             className="object-cover"
//             priority
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import CountrySelect, { CountryOption } from "./CountrySelect";
import { Icon } from "./icons";
import { MapPin } from "@/components/onBoardingCom/MapView";
// 👇 adjust this path to wherever your onboarding slice lives
import {
  useGetCheckUserBusinessProfileQuery,
  // step 1
  usePostStep1Mutation,
  // step 2
  useGetStep2Query,
  useStep2ConnectGMBMutation,
  usePatchStep2Mutation,
  // step 3 (channel)
  useStep3ReviewRequestChooseChannelSMSEmailNFCMutation,
  usePatchStep3Mutation,
  // step 4 (timing)
  useStep4ReviewRequestConfigureTimingDelayMutation,
  usePatchStep4Mutation,
  // step 5 (competitors)
  useGetStep5Query,
  usePostStep5Mutation,
  usePatchStep5Mutation,
  // step 6 (NFC)
  useGetStep6Query,
  usePostStep6Mutation,
  usePatchStep6Mutation,
  // step 7 (finish)
  usePatchAllStep7Mutation,
} from "@/redux/api/onboarding/onboardingSliceApi";

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

/**
 * The wizard has 6 screens. Backend steps map onto them like this:
 *   UI 1 → backend 1            (POST /business)
 *   UI 2 → backend 2            (search place, sync-google, mark 2)
 *   UI 3 → backend 3 + 4        (channel + timing, mark 3 and mark 4)
 *   UI 4 → backend 5            (competitors)
 *   UI 5 → backend 6            (NFC)
 *   UI 6 → backend 7            (finish)
 */
type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
type ReviewTiming = "2h" | "5h" | "24h" | "custom";
type RequestChannel = "SMS" | "Email" | "NFC";
type LatLng = [number, number];

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

/** A Google Place as returned by GET /business/search-places */
interface Place {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  category?: string;
}

interface Business {
  id: string;
  userId?: string;
  name: string;
  country?: string | null;
  placeId?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string | null;
  rating?: number | null;
  userRatingsTotal?: number | null;
  googleReviewUrl?: string | null;
  googleMapsUrl?: string | null;
  monthlyGoal?: number | null;
  isOnboardingCompleted: boolean;
  /** Last backend step that was completed. */
  onboardingStep: number;
  autoReviewRequests: boolean;
  followUpReminder?: boolean;
  defaultRequestChannel: string;
  requestDelay: string;
  /** Optional — used for the map if the backend ever sends them. */
  latitude?: number | null;
  longitude?: number | null;
}

/** One entry of `data.suggestedCompetitors` from GET /competitor/business/:id/suggestions */
interface SuggestedCompetitor {
  id: string;
  name: string;
  placeId?: string;
  address?: string;
  rating?: number;
  totalReviews?: number;
  reviewsGained?: string;
  growthRate?: string;
  isSelected?: boolean;
  /** Optional — used for the map if the backend ever sends them. */
  latitude?: number;
  longitude?: number;
}

interface CompetitorSuggestions {
  businessId: string;
  businessName: string;
  category?: string;
  radiusMiles?: number;
  metrics?: {
    your_total_reviews?: number;
    your_rating?: number;
    your_review_growth_rate?: string;
    competitor_average_reviews?: number;
    competitor_average_growth_rate?: string;
    growth_difference?: string;
    status?: string;
  };
  aiSummary?: string;
  suggestedCompetitors: SuggestedCompetitor[];
}

interface NfcCard {
  id?: string;
  cardId?: string;
  label: string;
  shortCode: string;
  tapUrl: string;
  qrCodeDataUrl?: string;
  qrCodeSvg?: string;
}

interface FormState {
  businessName: string;
  category: string;
  country: string;
  gmbConnected: boolean;
  defaultRequestChannel: RequestChannel;
  reviewTiming: ReviewTiming;
  customHours: string;
  autoReviewRequests: boolean;
  nfcLabel: string;
}

export interface OnboardingResult {
  form: FormState;
  business: Business | null;
}

export interface GrowMoreReviewsOnboardingProps {
  /** Public path (or remote URL) for the storefront hero photo shown on the right. */
  heroImageSrc?: string;
  /** Optional photo of the physical NFC/QR review stand. Falls back to a drawn mockup. */
  nfcPhotoSrc?: string;
  /** Called once onboarding is marked complete, right before redirecting to the dashboard. */
  onComplete?: (result: OnboardingResult) => void;
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

/**
 * ISO 3166-1 alpha-2 codes power the flag icon; `name` is what the API receives.
 * `center` is only the fallback map view before real positions are known.
 */
const COUNTRIES: (CountryOption & { center: LatLng })[] = [
  { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
  { code: "US", name: "United States", center: [40.7128, -74.006] },
  { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
  { code: "NL", name: "Netherlands", center: [52.3676, 4.9041] },
  { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
  { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
  { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
  { code: "IN", name: "India", center: [28.6139, 77.209] },
];

/** Values sent as `category` on POST /business — confirm the exact list with the backend. */
const CATEGORY_OPTIONS = [
  "Cafe / Restaurant",
  "Retail / Shop",
  "Salon / Spa",
  "Health / Clinic",
  "Hotel / Lodging",
  "Fitness / Gym",
  "Automotive",
  "Professional Services",
  "Other",
];

/** `delay` is the exact string sent as `requestDelay` (the API example uses "1 hour"). */
const TIMING_OPTIONS: { id: ReviewTiming; label: string; delay: string }[] = [
  { id: "2h", label: "2 hours after service", delay: "2 hours" },
  { id: "5h", label: "5 hours after service", delay: "5 hours" },
  { id: "24h", label: "24 hours after service", delay: "24 hours" },
  { id: "custom", label: "Custom time", delay: "" },
];

/** Values from the API comment: SMS, Email, NFC. */
const CHANNEL_OPTIONS: { id: RequestChannel; label: string }[] = [
  { id: "SMS", label: "SMS" },
  { id: "Email", label: "Email" },
  { id: "NFC", label: "NFC" },
];

/** Value for `?format=` on GET /nfc/:cardId/qrcode — confirm with the backend. */
const QR_FORMAT = "png";

const AVATAR_COLORS = [
  "#6D5BD0",
  "#0EA5A4",
  "#E1A32A",
  "#DC5F45",
  "#3B82C4",
  "#7C9A3C",
];

/** Competitor avatar tint from the design (all competitors share one purple). */
const COMPETITOR_AVATAR = "#6D5BD0";
const PIN_BUSINESS = "#2563EB";
const PIN_SELECTED = "#16A34A";
const PIN_UNSELECTED = "#9CA3AF";

/** Map box size in px (h-44 = 176) — only used to pick a zoom that fits all pins. */
const MAP_W = 400;
const MAP_H = 176;

/**
 * Free OpenStreetMap geocoder. Limit: 1 request/second and light use only.
 * For production traffic, replace with your backend or Google Geocoding.
 */
const GEOCODER_URL = "https://nominatim.openstreetmap.org/search";

const DEFAULT_STATE: FormState = {
  businessName: "",
  category: "",
  country: "CA",
  gmbConnected: false,
  defaultRequestChannel: "SMS",
  reviewTiming: "2h",
  customHours: "3",
  autoReviewRequests: true,
  nfcLabel: "Table 1 - Counter",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function apiMessage(err: unknown, fallback: string): string {
  const e = err as { data?: { message?: string | string[] }; error?: string };
  const m = e?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m || e?.error || fallback;
}

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function buildRequestDelay(timing: ReviewTiming, customHours: string): string {
  if (timing === "custom") {
    const h = Math.min(72, Math.max(1, Math.round(Number(customHours)) || 1));
    return `${h} ${h === 1 ? "hour" : "hours"}`;
  }
  return TIMING_OPTIONS.find((o) => o.id === timing)!.delay;
}

function parseRequestDelay(delay?: string): {
  timing: ReviewTiming;
  customHours: string;
} {
  const known = TIMING_OPTIONS.find((o) => o.delay && o.delay === delay);
  if (known) return { timing: known.id, customHours: "3" };
  const m = delay?.match(/^(\d+)\s*hours?/i);
  if (m) return { timing: "custom", customHours: m[1] };
  return { timing: "2h", customHours: "3" };
}

function normalizeChannel(value?: string): RequestChannel {
  const v = (value ?? "").toUpperCase();
  if (v === "EMAIL") return "Email";
  if (v === "NFC") return "NFC";
  return "SMS";
}

/** Backend stores the LAST COMPLETED step; this returns the screen to show next. */
function screenAfter(lastCompleted: number): StepIndex {
  const map: Record<number, StepIndex> = {
    0: 1,
    1: 2,
    2: 3,
    3: 3, // channel saved, timing still to do
    4: 4,
    5: 5,
    6: 6,
    7: 6,
  };
  return map[Math.min(Math.max(Math.floor(lastCompleted) || 0, 0), 7)];
}

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

/**
 * Pull a [lat, lng] pair out of whatever shape the backend uses:
 * { latitude, longitude } | { lat, lng } | { location: {...} } | { geometry: { location: {...} } }
 */
function extractLatLng(src: unknown): LatLng | null {
  if (!src || typeof src !== "object") return null;
  const o = src as Record<string, any>;
  const candidates = [o, o.location, o.geometry?.location, o.coordinates];
  for (const c of candidates) {
    if (!c || typeof c !== "object") continue;
    const lat = Number(c.latitude ?? c.lat);
    const lng = Number(c.longitude ?? c.lng ?? c.lon);
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      (lat !== 0 || lng !== 0)
    )
      return [lat, lng];
  }
  return null;
}

/* ---- geocoding (address → [lat, lng]) ---- */

const geocodeCache = new Map<string, LatLng | null>();
let nextGeocodeSlot = 0;

const normAddress = (a: string) => a.trim().toLowerCase();

/** Keep at least 1.1s between geocoder requests. */
async function throttleGeocoder() {
  const now = Date.now();
  const wait = Math.max(0, nextGeocodeSlot - now);
  nextGeocodeSlot = Math.max(now, nextGeocodeSlot) + 1100;
  if (wait) await new Promise((r) => setTimeout(r, wait));
}

async function geocodeOnce(
  q: string,
  signal: AbortSignal,
): Promise<LatLng | null> {
  await throttleGeocoder();
  const res = await fetch(
    `${GEOCODER_URL}?format=jsonv2&limit=1&accept-language=en&q=${encodeURIComponent(q)}`,
    { signal, headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error("Geocoder request failed");
  const json = (await res.json()) as { lat: string; lon: string }[];
  if (!json[0]) return null;
  const lat = Number(json[0].lat);
  const lng = Number(json[0].lon);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
}

async function geocodeAddress(
  address: string,
  signal: AbortSignal,
): Promise<LatLng | null> {
  const key = normAddress(address);
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

  let pos = await geocodeOnce(address, signal);
  if (!pos) {
    // Long venue-style addresses often miss; retry with the street part only.
    const parts = address.split(",").map((s) => s.trim());
    if (parts.length > 4)
      pos = await geocodeOnce(parts.slice(-4).join(", "), signal);
  }
  geocodeCache.set(key, pos);
  return pos;
}

/** Geocodes addresses one by one (cached) and reports pins as they resolve. */
function useGeocoded(addresses: string[]) {
  const [positions, setPositions] = useState<Record<string, LatLng>>({});
  const [done, setDone] = useState(false);
  const signature = addresses.join("\n");

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const list = signature ? signature.split("\n") : [];
    setDone(false);

    (async () => {
      for (const addr of list) {
        let pos: LatLng | null | undefined = geocodeCache.get(
          normAddress(addr),
        );
        if (pos === undefined) {
          try {
            pos = await geocodeAddress(addr, ctrl.signal);
          } catch {
            pos = null; // network error / aborted — fall back, don't cache
          }
        }
        if (!alive) return;
        if (pos) {
          const found = pos;
          setPositions((prev) =>
            prev[addr] ? prev : { ...prev, [addr]: found },
          );
        }
      }
      if (alive) setDone(true);
    })();

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [signature]);

  return { positions, done };
}

/** Last-resort placement for a competitor whose address could not be geocoded. */
function approxPosition(
  center: LatLng,
  index: number,
  seed: string,
  radiusMiles: number,
): LatLng {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const angle = ((index * 137.5 + (h % 25)) * Math.PI) / 180; // golden-angle spread
  const dist = radiusMiles * (0.3 + ((h >>> 5) % 50) / 100); // 30–79% of radius
  const dLat = (dist * Math.cos(angle)) / 69;
  const dLng =
    (dist * Math.sin(angle)) / (69 * Math.cos((center[0] * Math.PI) / 180));
  return [center[0] + dLat, center[1] + dLng];
}

function zoomForRadius(miles = 5): number {
  if (miles <= 1) return 14;
  if (miles <= 3) return 13;
  if (miles <= 8) return 12;
  if (miles <= 20) return 11;
  return 10;
}

/** Center + zoom that fits every point inside the map box. */
function fitView(points: LatLng[]): { center: LatLng; zoom: number } {
  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const center: LatLng = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  const pad = 1.4;
  const lngSpan = Math.max(maxLng - minLng, 0.002) * pad;
  const latSpan = Math.max(maxLat - minLat, 0.002) * pad;
  const cos = Math.cos((center[0] * Math.PI) / 180);
  const zx = Math.log2((MAP_W * 360) / (256 * lngSpan));
  const zy = Math.log2((MAP_H * 360 * cos) / (256 * latSpan));
  return {
    center,
    zoom: Math.min(15, Math.max(3, Math.floor(Math.min(zx, zy)))),
  };
}

/* ------------------------------------------------------------------ */
/*  Stepper                                                             */
/* ------------------------------------------------------------------ */

function Stepper({
  current,
  maxStep,
  onJump,
}: {
  current: StepIndex;
  maxStep: StepIndex;
  onJump: (step: StepIndex) => void;
}) {
  return (
    <ol className="flex w-full items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
      {STEPS.map((step, idx) => {
        const done = step.id <= current;
        const reachable = step.id <= maxStep;
        const isLast = idx === STEPS.length - 1;
        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex min-w-[52px] flex-col items-center text-center sm:min-w-[64px]">
              <button
                type="button"
                onClick={() => reachable && onJump(step.id)}
                disabled={!reachable}
                aria-current={step.id === current ? "step" : undefined}
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs",
                  done
                    ? "bg-emerald-500 text-white enabled:cursor-pointer enabled:hover:bg-emerald-600"
                    : reachable
                      ? "border border-emerald-400 bg-white text-emerald-600 enabled:cursor-pointer"
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

function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-red-500">{children}</p>;
}

function PrimaryButton({
  children,
  className = "",
  loading = false,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors",
        "hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300",
        className,
      ].join(" ")}
    >
      {loading && <Icon.Spinner className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400";

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300"
    >
      <span>
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        {hint && <span className="block text-xs text-gray-500">{hint}</span>}
      </span>
      <span
        className={[
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-emerald-500" : "bg-gray-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            checked ? "left-[18px]" : "left-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

function RatingLine({
  rating,
  total,
}: {
  rating?: number | null;
  total?: number | null;
}) {
  if (rating == null) return null;
  return (
    <span className="text-xs text-gray-500">
      <span className="text-amber-500">★</span> {rating.toFixed(1)}
      {total != null && <> ({total.toLocaleString()} reviews)</>}
    </span>
  );
}

function PlaceRow({
  place,
  onClick,
  trailing,
}: {
  place: Place;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
        style={{ backgroundColor: colorFor(place.placeId) }}
      >
        {initialsOf(place.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-800">
          {place.name}
        </span>
        <span className="block truncate text-xs text-gray-500">
          {place.address}
        </span>
        <RatingLine rating={place.rating} total={place.userRatingsTotal} />
      </span>
      {trailing}
    </button>
  );
}

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {message}
    </div>
  );
}

/** White card with a soft shadow that frames the map (matches the design). */
function MapCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
      <div className="relative h-44 overflow-hidden rounded-lg">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Competitor step bits                                                */
/* ------------------------------------------------------------------ */

/** The AI discovery call can take a while, so say what is happening. */
function CompetitorsLoading() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const message =
    seconds < 6
      ? "Finding businesses near you…"
      : seconds < 20
        ? "Comparing review counts and ratings…"
        : "Still working. Competitor analysis can take about a minute.";

  return (
    <div aria-live="polite">
      <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
        <Icon.Spinner className="h-3.5 w-3.5 animate-spin text-blue-600" />
        {message}
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={[
            "flex items-center gap-3 px-4 py-3",
            i % 2 === 0 ? "bg-gray-50" : "bg-white",
          ].join(" ")}
        >
          <span className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200" />
          <span className="flex-1 space-y-2">
            <span className="block h-3 w-2/5 animate-pulse rounded bg-gray-200" />
            <span className="block h-2.5 w-1/4 animate-pulse rounded bg-gray-100" />
          </span>
        </div>
      ))}
    </div>
  );
}

function CompetitorRow({
  competitor,
  index,
  checked,
  added,
  onToggle,
}: {
  competitor: SuggestedCompetitor;
  index: number;
  checked: boolean;
  added: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={added}
      onClick={onToggle}
      className={[
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors enabled:hover:bg-blue-50/60",
        index % 2 === 0 ? "bg-gray-50" : "bg-white",
      ].join(" ")}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
        style={{ backgroundColor: COMPETITOR_AVATAR }}
      >
        {initialsOf(competitor.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-800">
          {competitor.name}
        </span>
        {competitor.address && (
          <span className="block truncate text-xs text-gray-500">
            {competitor.address}
          </span>
        )}
        <RatingLine
          rating={competitor.rating}
          total={competitor.totalReviews}
        />
      </span>
      {added && (
        <span className="shrink-0 text-xs font-medium text-emerald-600">
          Added
        </span>
      )}
      <span
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          checked
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white",
        ].join(" ")}
      >
        {checked && <Icon.Check className="h-3 w-3" />}
      </span>
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
  const router = useRouter();

  const [step, setStep] = useState<StepIndex>(1);
  const [maxStep, setMaxStep] = useState<StepIndex>(1);
  const [data, setData] = useState<FormState>(DEFAULT_STATE);

  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
  }>({});

  // Competitor step: suggestions are copied into local state once loaded so the
  // (expensive) AI request is never re-run by tag invalidation or re-renders.
  const [suggestions, setSuggestions] = useState<CompetitorSuggestions | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addedCompetitorIds, setAddedCompetitorIds] = useState<string[]>([]);

  const [card, setCard] = useState<NfcCard | null>(null);
  const [copied, setCopied] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ---- API hooks ---- */

  const { data: profileRes, isLoading: profileLoading } =
    useGetCheckUserBusinessProfileQuery(undefined);

  // Step 2 → GET /business/search-places?query=
  const debouncedPlaceQuery = useDebounce(placeQuery.trim());
  const placeSearchEnabled =
    step === 2 &&
    !!business &&
    !selectedPlace &&
    debouncedPlaceQuery.length >= 2;
  const {
    currentData: placesRes,
    isFetching: placesFetching,
    isError: placesError,
  } = useGetStep2Query(encodeURIComponent(debouncedPlaceQuery), {
    skip: !placeSearchEnabled,
  });
  const placeResults: Place[] =
    (placesRes as ApiResponse<Place[]> | undefined)?.data ?? [];

  // Step 4 (Competitor) → GET /competitor/business/:businessId/suggestions
  const {
    currentData: suggestionsRes,
    isError: suggestionsQueryError,
    refetch: refetchSuggestions,
  } = useGetStep5Query(business?.id, {
    skip: step !== 4 || !business?.id || !!suggestions,
  });
  const suggestionsData = (
    suggestionsRes as ApiResponse<CompetitorSuggestions> | undefined
  )?.data;

  const cardId = card?.id ?? card?.cardId;
  // Step 5 (NFC) → GET /nfc/:cardId/qrcode
  const { data: qrRes } = useGetStep6Query(
    { query: QR_FORMAT, cardId },
    { skip: !cardId },
  );
  const qrPayload = (qrRes as ApiResponse<Partial<NfcCard>> | undefined)?.data;
  // Prefer the fresh GET result; fall back to what the POST already returned.
  const qrDataUrl = qrPayload?.qrCodeDataUrl ?? card?.qrCodeDataUrl ?? null;
  const qrSvg = qrPayload?.qrCodeSvg ?? card?.qrCodeSvg ?? null;

  const [postStep1] = usePostStep1Mutation();
  const [connectGmb] = useStep2ConnectGMBMutation();
  const [patchStep2] = usePatchStep2Mutation();
  const [saveChannel] = useStep3ReviewRequestChooseChannelSMSEmailNFCMutation();
  const [patchStep3] = usePatchStep3Mutation();
  const [saveTiming] = useStep4ReviewRequestConfigureTimingDelayMutation();
  const [patchStep4] = usePatchStep4Mutation();
  const [postStep5] = usePostStep5Mutation(); // competitors bulk
  const [patchStep5] = usePatchStep5Mutation();
  const [postStep6] = usePostStep6Mutation(); // NFC card
  const [patchStep6] = usePatchStep6Mutation();
  const [patchAllStep7] = usePatchAllStep7Mutation();

  /* ---- resume an unfinished onboarding ---- */

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current || profileLoading) return;
    hydrated.current = true;

    const raw = (profileRes as ApiResponse<Business | Business[]> | undefined)
      ?.data;
    const biz = Array.isArray(raw) ? raw[0] : raw;
    if (!biz?.id) return; // brand-new user → start at step 1

    if (biz.isOnboardingCompleted) {
      router.replace("/dashboard");
      return;
    }

    const resume = screenAfter(biz.onboardingStep);
    const { timing, customHours } = parseRequestDelay(biz.requestDelay);

    setBusiness(biz);
    if (biz.placeId) {
      setSelectedPlace({
        placeId: biz.placeId,
        name: biz.name,
        address: biz.address ?? "",
        rating: biz.rating ?? undefined,
        userRatingsTotal: biz.userRatingsTotal ?? undefined,
        googleMapsUrl: biz.googleMapsUrl ?? undefined,
        googleReviewUrl: biz.googleReviewUrl ?? undefined,
        category: biz.category ?? undefined,
      });
    }
    setData((d) => ({
      ...d,
      businessName: biz.name,
      category: biz.category ?? d.category,
      country:
        COUNTRIES.find(
          (c) => c.name.toLowerCase() === (biz.country ?? "").toLowerCase(),
        )?.code ?? d.country,
      gmbConnected: !!biz.placeId,
      defaultRequestChannel: normalizeChannel(biz.defaultRequestChannel),
      reviewTiming: timing,
      customHours,
      autoReviewRequests: biz.autoReviewRequests ?? true,
    }));
    setStep(resume);
    setMaxStep(resume);
  }, [profileLoading, profileRes, router]);

  // Pre-fill the Google search with the business name the first time step 2 opens.
  const placePrefilled = useRef(false);
  useEffect(() => {
    if (step !== 2 || placePrefilled.current || selectedPlace || !business)
      return;
    placePrefilled.current = true;
    setPlaceQuery(business.name);
  }, [step, selectedPlace, business]);

  // Store the AI suggestions once and pre-tick the ones the API marked `isSelected`.
  useEffect(() => {
    if (suggestions || !suggestionsData?.suggestedCompetitors) return;
    setSuggestions(suggestionsData);
    setSelectedIds(
      suggestionsData.suggestedCompetitors
        .filter((c) => c.isSelected)
        .map((c) => c.id),
    );
  }, [suggestions, suggestionsData]);

  /* ---- navigation + request plumbing ---- */

  const goTo = useCallback(
    (next: StepIndex) => {
      setApiError(null);
      setStep(next);
      setMaxStep((m) => (next > m ? next : m));
      onStepChange?.(next);
    },
    [onStepChange],
  );

  const jumpTo = useCallback(
    (target: StepIndex) => {
      setApiError(null);
      setStep(target);
      onStepChange?.(target);
    },
    [onStepChange],
  );

  const run = async (fn: () => Promise<void>) => {
    setApiError(null);
    setSubmitting(true);
    try {
      await fn();
    } catch (err) {
      setApiError(apiMessage(err, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  /** Merge a server response into local business state without ever moving the step backwards. */
  const mergeBusiness = (incoming?: Partial<Business> | null) => {
    if (!incoming || typeof incoming !== "object") return;
    setBusiness((prev) => {
      if (!prev) return incoming.id ? (incoming as Business) : prev;
      if (incoming.id && incoming.id !== prev.id) return prev;
      return {
        ...prev,
        ...incoming,
        onboardingStep: Math.max(
          prev.onboardingStep ?? 0,
          incoming.onboardingStep ?? 0,
        ),
      };
    });
  };

  /** Never send a lower onboardingStep than the server already has (e.g. after going back). */
  const stepToSend = (completed: number) =>
    Math.max(completed, business?.onboardingStep ?? 0);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
    [data.country],
  );

  /* ---- map data ---- */

  const businessAddress = selectedPlace?.address || business?.address || "";

  // Addresses to geocode for the current screen (deduped, business first).
  const geoAddresses = useMemo(() => {
    if (step === 2)
      return selectedPlace?.address ? [selectedPlace.address] : [];
    if (step === 4) {
      const list = [
        businessAddress,
        ...(suggestions?.suggestedCompetitors ?? []).map(
          (c) => c.address ?? "",
        ),
      ].filter(Boolean);
      return Array.from(new Set(list));
    }
    return [];
  }, [step, selectedPlace?.address, businessAddress, suggestions]);

  const geo = useGeocoded(geoAddresses);

  /** The business's own position: backend coordinates → geocoded address → null. */
  const businessGeo: LatLng | null = useMemo(
    () =>
      extractLatLng(business) ??
      extractLatLng(selectedPlace) ??
      (businessAddress ? (geo.positions[businessAddress] ?? null) : null),
    [business, selectedPlace, businessAddress, geo.positions],
  );

  const businessCenter: LatLng = businessGeo ?? selectedCountry.center;

  // Step 2 map: one blue pin once the chosen place is located.
  const placePins: MapPin[] = useMemo(
    () =>
      businessGeo
        ? [
            {
              id: "business",
              position: businessGeo,
              label: selectedPlace?.name || business?.name || "Your business",
              color: PIN_BUSINESS,
              primary: true,
            },
          ]
        : [],
    [businessGeo, selectedPlace?.name, business?.name],
  );

  // Step 4 map: your business (blue) + every suggestion (green ticked, grey not).
  const competitorMap = useMemo(() => {
    const list = suggestions?.suggestedCompetitors ?? [];
    const radius = suggestions?.radiusMiles ?? 5;
    const pins: MapPin[] = [];
    let approximate = false;

    if (businessGeo) {
      pins.push({
        id: "business",
        position: businessGeo,
        label: business?.name || data.businessName || "Your business",
        color: PIN_BUSINESS,
        primary: true,
      });
    }

    list.forEach((c, i) => {
      let position: LatLng | null =
        extractLatLng(c) ??
        (c.address ? (geo.positions[c.address] ?? null) : null);
      if (!position) {
        if (!geo.done) return; // still locating — don't show a guess yet
        position = approxPosition(businessCenter, i, c.id, radius);
        approximate = true;
      }
      pins.push({
        id: c.id,
        position,
        label: c.name,
        color: selectedIds.includes(c.id) ? PIN_SELECTED : PIN_UNSELECTED,
        primary: false,
      });
    });

    // View: country → business → fit-all (at most 2 re-centres, no flicker per pin).
    const radiusZoom = zoomForRadius(radius);
    let view: { stage: string; center: LatLng; zoom: number };
    if (geo.done && pins.length > 1) {
      view = {
        stage: "fit",
        ...fitView(pins.map((p) => p.position as LatLng)),
      };
    } else if (businessGeo) {
      view = { stage: "biz", center: businessGeo, zoom: radiusZoom };
    } else {
      view = {
        stage: "base",
        center: selectedCountry.center,
        zoom: radiusZoom,
      };
    }
    return { pins, approximate, view };
  }, [
    suggestions,
    selectedIds,
    geo.positions,
    geo.done,
    businessGeo,
    businessCenter,
    business?.name,
    data.businessName,
    selectedCountry,
  ]);

  /* ---- step handlers ---- */

  // Step 1 → POST /business { name, country, category }, then go to step 2
  const handleBusinessContinue = () =>
    run(async () => {
      const next: typeof errors = {};
      if (!data.businessName.trim())
        next.name = "Enter your business name to continue.";
      if (!data.category) next.category = "Select a category to continue.";
      setErrors(next);
      if (Object.keys(next).length) return;

      // Already created (person came back to step 1) → don't create a duplicate.
      if (!business) {
        const res = (await postStep1({
          name: data.businessName.trim(),
          country: selectedCountry.name,
          category: data.category,
        }).unwrap()) as ApiResponse<Business>;
        setBusiness(res.data);
      }
      goTo(2);
    });

  const changePlace = () => {
    setSelectedPlace(null);
    setPlaceQuery(business?.name ?? data.businessName);
    setData((d) => ({ ...d, gmbConnected: false }));
  };

  // Step 2 → PATCH /business/:id/sync-google { placeId, address, googleReviewUrl }
  const handleConnectGMB = () =>
    run(async () => {
      if (!business || !selectedPlace || data.gmbConnected) return;
      const res = (await connectGmb({
        businessId: business.id,
        body: {
          placeId: selectedPlace.placeId,
          address: selectedPlace.address,
          googleReviewUrl: selectedPlace.googleReviewUrl,
        },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res?.data);
      setData((d) => ({ ...d, gmbConnected: true }));
    });

  // Step 2 → PATCH /business/:id/onboarding { onboardingStep: 2 }
  const handleGmbContinue = () =>
    run(async () => {
      if (!business) return;
      const res = (await patchStep2({
        businessId: business.id,
        body: { onboardingStep: stepToSend(2) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(3);
    });

  // Step 3 screen = backend step 3 (channel) + backend step 4 (timing)
  const handleReviewRequestContinue = () =>
    run(async () => {
      if (!business) return;
      const businessId = business.id;

      // 3 → channel, then mark 3 complete
      const channelRes = (await saveChannel({
        businessId,
        body: {
          defaultRequestChannel:
            data.defaultRequestChannel === "Email"
              ? "EMAIL"
              : data.defaultRequestChannel,
        },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(channelRes?.data);

      const mark3 = (await patchStep3({
        businessId,
        body: { onboardingStep: stepToSend(3) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(mark3?.data);

      // 4 → timing, then mark 4 complete
      const timingRes = (await saveTiming({
        businessId,
        body: {
          requestDelay: buildRequestDelay(data.reviewTiming, data.customHours),
          autoReviewRequests: data.autoReviewRequests,
        },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(timingRes?.data);

      const mark4 = (await patchStep4({
        businessId,
        body: { onboardingStep: stepToSend(4) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(mark4?.data);

      goTo(4);
    });

  const toggleCompetitor = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // Step 4 screen = backend step 5 → POST /competitor/business/:id/bulk, then mark 5
  const handleCompetitorsContinue = () =>
    run(async () => {
      if (!business) return;

      // Only send ones that were not already saved (person may have come back).
      const pending = (suggestions?.suggestedCompetitors ?? []).filter(
        (c) => selectedIds.includes(c.id) && !addedCompetitorIds.includes(c.id),
      );

      if (pending.length) {
        await postStep5({
          businessId: business.id,
          body: {
            businessId: business.id,
            competitors: pending.map((c) => ({
              name: c.name,
              placeId: c.placeId,
              address: c.address,
              rating: c.rating,
              userRatingsTotal: c.totalReviews,
            })),
          },
        }).unwrap();
        setAddedCompetitorIds((prev) => [...prev, ...pending.map((c) => c.id)]);
      }

      const res = (await patchStep5({
        businessId: business.id,
        body: { onboardingStep: stepToSend(5) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(5);
    });

  // Step 5 screen = backend step 6 → POST /nfc (register card + get QR)
  const handleGenerateNfc = () =>
    run(async () => {
      if (!business) return;
      const res = (await postStep6({
        businessId: business.id,
        label: data.nfcLabel.trim() || "Review stand",
      }).unwrap()) as ApiResponse<NfcCard>;
      setCard(res.data);
    });

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadSvg = () => {
    if (!qrSvg) return;
    const url = URL.createObjectURL(
      new Blob([qrSvg], { type: "image/svg+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyTapUrl = async () => {
    if (!card?.tapUrl) return;
    try {
      await navigator.clipboard.writeText(card.tapUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setApiError("Couldn't copy the link. Copy it manually instead.");
    }
  };

  // Step 5 screen → mark backend step 6 complete
  const handleNfcContinue = () =>
    run(async () => {
      if (!business) return;
      const res = (await patchStep6({
        businessId: business.id,
        body: { onboardingStep: stepToSend(6) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(6);
    });

  // Step 6 screen = backend step 7 → finish onboarding, then go to the dashboard
  const handleGoDashboard = () =>
    run(async () => {
      if (!business) return;
      await patchAllStep7({
        businessId: business.id,
        body: { onboardingStep: 7, isOnboardingCompleted: true },
      }).unwrap();
      onComplete?.({
        form: data,
        business: {
          ...business,
          onboardingStep: 7,
          isOnboardingCompleted: true,
        },
      });
      router.push("/dashboard");
    });

  /* ---- step content ---- */

  const renderStep = () => {
    switch (step) {
      case 1: {
        const locked = !!business; // business already created → fields are read-only here
        const categoryOptions =
          !data.category || CATEGORY_OPTIONS.includes(data.category)
            ? CATEGORY_OPTIONS
            : [...CATEGORY_OPTIONS, data.category];
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
                disabled={locked}
                onChange={(e) => {
                  setData((d) => ({ ...d, businessName: e.target.value }));
                  if (errors.name)
                    setErrors((er) => ({ ...er, name: undefined }));
                }}
                placeholder="e.g. Bella's Cafe House"
                className={[
                  inputClass,
                  errors.name ? "border-red-400" : "border-gray-200",
                ].join(" ")}
              />
              <FieldError>{errors.name}</FieldError>
            </div>

            <div className="mt-5">
              <FieldLabel>Category</FieldLabel>
              <div className="relative">
                <select
                  value={data.category}
                  disabled={locked}
                  onChange={(e) => {
                    setData((d) => ({ ...d, category: e.target.value }));
                    if (errors.category)
                      setErrors((er) => ({ ...er, category: undefined }));
                  }}
                  className={[
                    inputClass,
                    "appearance-none pr-10",
                    data.category ? "" : "text-gray-400",
                    errors.category ? "border-red-400" : "border-gray-200",
                  ].join(" ")}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} className="text-gray-900">
                      {c}
                    </option>
                  ))}
                </select>
                <Icon.Chevron className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <FieldError>{errors.category}</FieldError>
            </div>

            <div className="mt-5">
              <FieldLabel>Country</FieldLabel>
              <div
                className={locked ? "pointer-events-none opacity-60" : ""}
                aria-disabled={locked}
              >
                <CountrySelect
                  value={data.country}
                  options={COUNTRIES}
                  onChange={(code: any) =>
                    setData((d) => ({ ...d, country: code }))
                  }
                />
              </div>
            </div>

            <ErrorBanner message={apiError} />

            <PrimaryButton
              className="mt-8"
              onClick={handleBusinessContinue}
              loading={submitting}
            >
              {submitting ? "Saving…" : "Continue"}
            </PrimaryButton>
          </div>
        );
      }

      case 2: {
        const typing = placeQuery.trim() !== debouncedPlaceQuery;
        const connected = data.gmbConnected;
        const mapsUrl = selectedPlace?.googleMapsUrl ?? business?.googleMapsUrl;
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Connect your Google Business Profile
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Get real-time reviews, insights and manage your online reputation.
            </p>

            <div className="mt-7">
              <FieldLabel>Find your business on Google</FieldLabel>
              {selectedPlace ? (
                <div className="overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/40">
                  <PlaceRow
                    place={selectedPlace}
                    trailing={
                      !submitting && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={changePlace}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") changePlace();
                          }}
                          className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Change
                        </span>
                      )
                    }
                  />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={placeQuery}
                    onChange={(e) => setPlaceQuery(e.target.value)}
                    placeholder="Search your business name and city"
                    className={[inputClass, "border-gray-200"].join(" ")}
                  />
                  {placeSearchEnabled && (
                    <div className="mt-2 max-h-60 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-200 bg-white">
                      {(placesFetching || typing) && (
                        <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
                          <Icon.Spinner className="h-3.5 w-3.5 animate-spin" />
                          Searching Google…
                        </div>
                      )}
                      {!placesFetching && placesError && (
                        <p className="px-4 py-3 text-xs text-red-500">
                          Search failed. Check your connection and try again.
                        </p>
                      )}
                      {!placesFetching &&
                        !placesError &&
                        !typing &&
                        placeResults.length === 0 && (
                          <p className="px-4 py-3 text-xs text-gray-500">
                            No businesses found. Try adding the city name.
                          </p>
                        )}
                      {!placesFetching &&
                        placeResults.map((p) => (
                          <PlaceRow
                            key={p.placeId}
                            place={p}
                            onClick={() => setSelectedPlace(p)}
                          />
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {selectedPlace && (
              <div className="mt-4">
                <MapCard>
                  <MapView
                    key={`gmb-${businessGeo ? "located" : "base"}`}
                    center={businessCenter}
                    zoom={businessGeo ? 15 : 4}
                    pins={placePins}
                  />
                </MapCard>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    {businessGeo
                      ? "\u00A0"
                      : geo.done
                        ? "Map location unavailable for this address."
                        : "Locating on the map…"}
                  </span>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4">
              <ErrorBanner message={apiError} />
            </div>

            <PrimaryButton
              onClick={handleConnectGMB}
              loading={submitting && !connected}
              disabled={connected || !selectedPlace || !business}
            >
              {connected
                ? "Connected"
                : submitting
                  ? "Connecting…"
                  : "Connect GMB"}
            </PrimaryButton>

            {connected && (
              <PrimaryButton
                className="mt-3"
                onClick={handleGmbContinue}
                loading={submitting}
              >
                Continue
              </PrimaryButton>
            )}
          </div>
        );
      }

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
                Send requests by
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {CHANNEL_OPTIONS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() =>
                      setData((d) => ({ ...d, defaultRequestChannel: ch.id }))
                    }
                    aria-pressed={data.defaultRequestChannel === ch.id}
                    className={[
                      "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      data.defaultRequestChannel === ch.id
                        ? "border-emerald-400 bg-emerald-50/60 text-gray-900"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                    ].join(" ")}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
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

            <div className="mt-6">
              <Toggle
                checked={data.autoReviewRequests}
                onChange={(v) =>
                  setData((d) => ({ ...d, autoReviewRequests: v }))
                }
                label="Send requests automatically"
                hint="We ask every customer without you lifting a finger."
              />
            </div>

            <div className="mt-5">
              <ErrorBanner message={apiError} />
            </div>

            <PrimaryButton
              onClick={handleReviewRequestContinue}
              loading={submitting}
            >
              {submitting ? "Saving…" : "Continue"}
            </PrimaryButton>
          </div>
        );

      case 4: {
        const list = suggestions?.suggestedCompetitors ?? [];
        const selectedCount = selectedIds.length;
        // Response arrived but without a usable list → treat like a failed request.
        const failed =
          !suggestions &&
          (suggestionsQueryError ||
            (!!suggestionsRes && !suggestionsData?.suggestedCompetitors));
        const loading = !suggestions && !failed;
        const { pins, approximate, view } = competitorMap;
        const summary = suggestions?.aiSummary?.replace(/\*\*/g, "");

        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Find your competitors
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              We&apos;ll automatically identify nearby competitors and compare
              your review growth.
            </p>

            {/* Map */}
            <div className="mt-6">
              <MapCard>
                <MapView
                  key={`competitors-${view.stage}`}
                  center={view.center}
                  zoom={view.zoom}
                  pins={pins}
                />
              </MapCard>
              <p className="mt-1.5 min-h-[16px] text-[11px] text-gray-400">
                {suggestions && !geo.done
                  ? "Placing competitors on the map…"
                  : approximate
                    ? "Some pin positions are approximate."
                    : "\u00A0"}
              </p>
            </div>

            {/* Competitor list */}
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                  <span>Your Competitors</span>
                  {!loading && !failed && (
                    <span className="text-xs font-normal text-gray-500">
                      {selectedCount} selected
                    </span>
                  )}
                </div>
                {summary && (
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {summary}
                  </p>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading && <CompetitorsLoading />}

                {failed && (
                  <div className="flex items-center justify-between gap-3 px-4 py-4">
                    <p className="text-xs text-red-500">
                      Couldn&apos;t load nearby competitors. Try again, or skip
                      this step and add them later.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetchSuggestions()}
                      className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {suggestions && list.length === 0 && (
                  <p className="px-4 py-4 text-xs text-gray-500">
                    No competitors found nearby. You can add some later from
                    your dashboard.
                  </p>
                )}

                {list.map((c, i) => (
                  <CompetitorRow
                    key={c.id}
                    competitor={c}
                    index={i}
                    checked={selectedIds.includes(c.id)}
                    added={addedCompetitorIds.includes(c.id)}
                    onToggle={() => toggleCompetitor(c.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5">
              <ErrorBanner message={apiError} />
            </div>

            <PrimaryButton
              onClick={handleCompetitorsContinue}
              loading={submitting}
            >
              {submitting
                ? "Saving…"
                : selectedCount === 0
                  ? "Skip for now"
                  : `Continue with ${selectedCount} competitor${selectedCount === 1 ? "" : "s"}`}
            </PrimaryButton>
          </div>
        );
      }

      case 5:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Set up your NFC Review Stand
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Let customers tap their phone and leave a review in seconds.
            </p>

            <div className="mt-6">
              <FieldLabel>Stand label</FieldLabel>
              <input
                type="text"
                value={data.nfcLabel}
                disabled={!!card}
                onChange={(e) =>
                  setData((d) => ({ ...d, nfcLabel: e.target.value }))
                }
                placeholder="e.g. Table 1 - Counter"
                className={[inputClass, "border-gray-200"].join(" ")}
              />
            </div>

            <div
              className="relative mt-5 flex h-60 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-cover bg-center"
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
                {qrDataUrl ? (
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

            {card?.tapUrl && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
                  {card.tapUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTapUrl}
                  className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            )}

            <div className="mt-4">
              <ErrorBanner message={apiError} />
            </div>

            {card ? (
              <>
                <PrimaryButton onClick={handleDownloadQr} disabled={!qrDataUrl}>
                  <Icon.Download className="h-4 w-4" />
                  Download QR code
                </PrimaryButton>
                {qrSvg && (
                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="mt-2 w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Download as SVG
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNfcContinue}
                  disabled={submitting}
                  className="mt-3 flex w-full items-center justify-center gap-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-60"
                >
                  {submitting && (
                    <Icon.Spinner className="h-4 w-4 animate-spin" />
                  )}
                  Continue to finish setup →
                </button>
              </>
            ) : (
              <PrimaryButton onClick={handleGenerateNfc} loading={submitting}>
                {submitting ? "Generating…" : "Generate NFC QR Code"}
              </PrimaryButton>
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

            <div className="mt-6 w-full text-left">
              <ErrorBanner message={apiError} />
            </div>

            <PrimaryButton
              className="mt-2"
              onClick={handleGoDashboard}
              loading={submitting}
            >
              {submitting ? "Finishing…" : "Go Dashboard"}
            </PrimaryButton>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---- render ---- */

  if (profileLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        <Icon.Spinner className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-stretch justify-center bg-gray-100 p-0 sm:p-6">
      <div className="flex w-full max-w-7xl overflow-hidden bg-white shadow-sm sm:rounded-2xl">
        {/* Left: wizard */}
        <div className="flex w-full flex-col px-5 py-6 sm:px-10 sm:py-10 lg:w-[52%]">
          <Stepper current={step} maxStep={maxStep} onJump={jumpTo} />
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
