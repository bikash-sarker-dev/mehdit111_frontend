// "use client";

// import Image from "next/image";
// import dynamic from "next/dynamic";
// import QRCode from "qrcode";
// import React, { useCallback, useEffect, useMemo, useState } from "react";

// import CountrySelect, { CountryOption } from "./CountrySelect";
// import { Icon } from "./icons";
// import { MapPin } from "@/components/onBoardingCom/MapView";
// import { useRouter } from "next/navigation";

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

// interface Competitor {
//   id: string;
//   name: string;
//   initials: string;
//   color: string;
//   offset: [number, number]; // lat/lng offset from the business, for the map
// }

// interface FormState {
//   businessName: string;
//   country: string;
//   gmbLink: string;
//   gmbConnected: boolean;
//   reviewTiming: ReviewTiming;
//   customHours: string;
//   selectedCompetitors: string[];
//   nfcStatus: "idle" | "generating" | "ready";
// }

// export interface GrowMoreReviewsOnboardingProps {
//   /** Public path (or remote URL) for the storefront hero photo shown on the right. */
//   heroImageSrc?: string;
//   /** Optional photo of the physical NFC/QR review stand. Falls back to a drawn mockup. */
//   nfcPhotoSrc?: string;
//   /** Called once the person finishes the wizard and clicks "Go Dashboard". */
//   onComplete?: (data: FormState) => void;
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
//  * NOTE: the order of this array is the order shown in the dropdown.
//  * Canada first, then United States, then United Kingdom.
//  */
// const COUNTRIES: (CountryOption & { center: [number, number] })[] = [
//   { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
//   { code: "US", name: "United States", center: [40.7128, -74.006] },
//   { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
//   { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
//   { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
//   { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
//   { code: "IN", name: "India", center: [28.6139, 77.209] },
// ];

// const COMPETITORS: Competitor[] = [
//   {
//     id: "c1",
//     name: "The Roasted Bean",
//     initials: "RB",
//     color: "#6D5BD0",
//     offset: [0.004, 0.006],
//   },
//   {
//     id: "c2",
//     name: "Java & Co.",
//     initials: "JC",
//     color: "#0EA5A4",
//     offset: [-0.006, 0.003],
//   },
//   {
//     id: "c3",
//     name: "Filter House",
//     initials: "FH",
//     color: "#E1A32A",
//     offset: [0.002, -0.007],
//   },
//   {
//     id: "c4",
//     name: "Bean There Cafe",
//     initials: "BT",
//     color: "#DC5F45",
//     offset: [-0.003, -0.004],
//   },
//   {
//     id: "c5",
//     name: "Northside Coffee",
//     initials: "NC",
//     color: "#3B82C4",
//     offset: [0.007, -0.001],
//   },
// ];

// const TIMING_OPTIONS: { id: ReviewTiming; label: string }[] = [
//   { id: "2h", label: "2 hours after service" },
//   { id: "5h", label: "5 hours after service" },
//   { id: "24h", label: "24 hours after service" },
//   { id: "custom", label: "Custom time" },
// ];

// const DEFAULT_STATE: FormState = {
//   businessName: "",
//   country: "CA", // first option in the list; change back to "GB" to preselect the UK
//   gmbLink: "",
//   gmbConnected: false,
//   reviewTiming: "2h",
//   customHours: "3",
//   selectedCompetitors: COMPETITORS.map((c) => c.id),
//   nfcStatus: "idle",
// };

// /* ------------------------------------------------------------------ */
// /*  Stepper                                                             */
// /* ------------------------------------------------------------------ */

// function Stepper({
//   current,
//   onJump,
// }: {
//   current: StepIndex;
//   onJump: (step: StepIndex) => void;
// }) {
//   return (
//     <ol className="flex w-full items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
//       {STEPS.map((step, idx) => {
//         const done = step.id <= current;
//         const isLast = idx === STEPS.length - 1;
//         return (
//           <li key={step.id} className="flex flex-1 items-center last:flex-none">
//             <div className="flex min-w-[52px] flex-col items-center text-center sm:min-w-[64px]">
//               <button
//                 type="button"
//                 onClick={() => done && onJump(step.id)}
//                 disabled={!done}
//                 aria-current={step.id === current ? "step" : undefined}
//                 className={[
//                   "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-xs",
//                   done
//                     ? "bg-emerald-500 text-white enabled:cursor-pointer enabled:hover:bg-emerald-600"
//                     : "border border-gray-300 bg-white text-gray-400",
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

// function PrimaryButton({
//   children,
//   className = "",
//   ...rest
// }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
//   return (
//     <button
//       {...rest}
//       className={[
//         "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors",
//         "hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300",
//         className,
//       ].join(" ")}
//     >
//       {children}
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
//   const [step, setStep] = useState<StepIndex>(1);
//   const [data, setData] = useState<FormState>(DEFAULT_STATE);
//   const [nameError, setNameError] = useState(false);
//   const [connecting, setConnecting] = useState(false);
//   const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
//   const [qrError, setQrError] = useState<string | null>(null);
//   const router = useRouter();

//   const goTo = useCallback(
//     (next: StepIndex) => {
//       setStep(next);
//       onStepChange?.(next);
//     },
//     [onStepChange],
//   );

//   const selectedCountry = useMemo(
//     () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
//     [data.country],
//   );

//   const businessPin: MapPin[] = useMemo(
//     () => [
//       {
//         id: "business",
//         position: selectedCountry.center,
//         label: data.businessName || "Your business",
//         color: "#2563EB",
//         primary: true,
//       },
//     ],
//     [selectedCountry, data.businessName],
//   );

//   const competitorPins: MapPin[] = useMemo(
//     () => [
//       ...businessPin,
//       ...COMPETITORS.map((c) => ({
//         id: c.id,
//         position: [
//           selectedCountry.center[0] + c.offset[0],
//           selectedCountry.center[1] + c.offset[1],
//         ] as [number, number],
//         label: c.name,
//         color: c.color,
//       })),
//     ],
//     [businessPin, selectedCountry],
//   );

//   /* ---- step handlers ---- */

//   const handleBusinessContinue = () => {
//     if (!data.businessName.trim()) {
//       setNameError(true);
//       return;
//     }
//     setNameError(false);
//     goTo(2);
//   };

//   const handleConnectGMB = () => {
//     if (data.gmbConnected) return;
//     setConnecting(true);
//     // Simulated connection round-trip — swap for a real Google Business Profile API call.
//     setTimeout(() => {
//       setConnecting(false);
//       setData((d) => ({ ...d, gmbConnected: true }));
//     }, 900);
//   };

//   const toggleCompetitor = (id: string) => {
//     setData((d) => ({
//       ...d,
//       selectedCompetitors: d.selectedCompetitors.includes(id)
//         ? d.selectedCompetitors.filter((c) => c !== id)
//         : [...d.selectedCompetitors, id],
//     }));
//   };

//   const handleGenerateNfc = async () => {
//     setQrError(null);
//     setData((d) => ({ ...d, nfcStatus: "generating" }));
//     // The payload is the actual link customers land on when they tap or scan —
//     // their real GMB review link if they gave one, else a placeholder.
//     const payload =
//       data.gmbLink.trim() ||
//       `https://search.google.com/local/writereview?business=${encodeURIComponent(data.businessName || "your-business")}`;
//     try {
//       const url = await QRCode.toDataURL(payload, {
//         width: 240,
//         margin: 1,
//         color: { dark: "#111827", light: "#ffffff" },
//       });
//       setQrDataUrl(url);
//       setData((d) => ({ ...d, nfcStatus: "ready" }));
//     } catch (err) {
//       setQrError("Couldn't generate the code. Try again.");
//       setData((d) => ({ ...d, nfcStatus: "idle" }));
//     }
//   };

//   const handleDownloadQr = async () => {
//     if (!qrDataUrl) return;
//     const res = await fetch(qrDataUrl);
//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(data.businessName || "review-stand").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   const handleGoDashboard = () => {
//     onComplete?.(data);
//     console.log(data);
//     router.push("/dashboard");
//   };

//   // Regenerate the code automatically if the person edits their GMB link
//   // after already generating one, so the printed code never goes stale.
//   useEffect(() => {
//     if (data.nfcStatus === "ready") {
//       setData((d) => ({ ...d, nfcStatus: "idle" }));
//       setQrDataUrl(null);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data.gmbLink]);

//   /* ---- step content ---- */

//   const renderStep = () => {
//     switch (step) {
//       case 1:
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
//                 onChange={(e) => {
//                   setData((d) => ({ ...d, businessName: e.target.value }));
//                   if (nameError) setNameError(false);
//                 }}
//                 placeholder="e.g. Coffee House"
//                 className={[
//                   "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400",
//                   "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
//                   nameError ? "border-red-400" : "border-gray-200",
//                 ].join(" ")}
//               />
//               {nameError && (
//                 <p className="mt-1.5 text-xs text-red-500">
//                   Enter your business name to continue.
//                 </p>
//               )}
//             </div>

//             <div className="mt-5">
//               <FieldLabel>Country</FieldLabel>
//               <CountrySelect
//                 value={data.country}
//                 options={COUNTRIES}
//                 onChange={(code: any) =>
//                   setData((d) => ({ ...d, country: code }))
//                 }
//               />
//             </div>

//             <PrimaryButton className="mt-8" onClick={handleBusinessContinue}>
//               Continue
//             </PrimaryButton>
//           </div>
//         );

//       case 2:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Connect your Google Business Profile
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Get real-time reviews, insights and manage your online reputation.
//             </p>

//             <div className="mt-7">
//               <FieldLabel>Google Business Profile (GMB) Link</FieldLabel>
//               <input
//                 type="url"
//                 value={data.gmbLink}
//                 onChange={(e) =>
//                   setData((d) => ({ ...d, gmbLink: e.target.value }))
//                 }
//                 placeholder="https://g.page/your-business"
//                 disabled={data.gmbConnected}
//                 className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
//               />
//             </div>

//             <PrimaryButton
//               className="mt-5"
//               onClick={handleConnectGMB}
//               disabled={connecting || data.gmbConnected}
//             >
//               {connecting && <Icon.Spinner className="h-4 w-4 animate-spin" />}
//               {data.gmbConnected
//                 ? "Connected"
//                 : connecting
//                   ? "Connecting…"
//                   : "Connect GMB"}
//             </PrimaryButton>

//             {data.gmbConnected && (
//               <div className="mt-5 space-y-3">
//                 <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//                     <Icon.Store className="h-5 w-5" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-800">
//                     {data.businessName || "Your business"}
//                   </span>
//                 </div>
//                 <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
//                   <MapView
//                     center={selectedCountry.center}
//                     zoom={14}
//                     pins={businessPin}
//                   />
//                 </div>
//                 <PrimaryButton onClick={() => goTo(3)}>Continue</PrimaryButton>
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

//             <PrimaryButton className="mt-8" onClick={() => goTo(4)}>
//               Continue
//             </PrimaryButton>
//           </div>
//         );

//       case 4:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Find your competitors
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               We&apos;ll automatically identify nearby competitors and compare
//               your review growth.
//             </p>

//             <div className="mt-6 h-44 overflow-hidden rounded-xl border border-gray-200">
//               <MapView
//                 center={selectedCountry.center}
//                 zoom={13}
//                 pins={competitorPins}
//               />
//             </div>

//             <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
//               <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
//                 Your Competitors
//               </div>
//               <ul>
//                 {COMPETITORS.map((c, idx) => {
//                   const checked = data.selectedCompetitors.includes(c.id);
//                   return (
//                     <li key={c.id}>
//                       <button
//                         type="button"
//                         onClick={() => toggleCompetitor(c.id)}
//                         className={[
//                           "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
//                           idx % 2 === 1 ? "bg-gray-50/60" : "bg-white",
//                           "hover:bg-gray-50",
//                         ].join(" ")}
//                       >
//                         <span
//                           className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
//                           style={{ backgroundColor: c.color }}
//                         >
//                           {c.initials}
//                         </span>
//                         <span className="flex-1 text-gray-700">{c.name}</span>
//                         <span
//                           className={[
//                             "flex h-4 w-4 items-center justify-center rounded border",
//                             checked
//                               ? "border-blue-600 bg-blue-600 text-white"
//                               : "border-gray-300",
//                           ].join(" ")}
//                         >
//                           {checked && <Icon.Check className="h-3 w-3" />}
//                         </span>
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             <PrimaryButton className="mt-6" onClick={() => goTo(5)}>
//               Continue
//             </PrimaryButton>
//           </div>
//         );

//       case 5:
//         return (
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Set up your NFC Review Stand
//             </h1>
//             <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
//               Let customers tap their phone and leave a review in seconds.
//             </p>

//             <div
//               className="relative mt-6 flex h-60 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-cover bg-center"
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
//                 {data.nfcStatus === "ready" && qrDataUrl ? (
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

//             {qrError && <p className="mt-2 text-xs text-red-500">{qrError}</p>}

//             {data.nfcStatus === "ready" ? (
//               <PrimaryButton className="mt-6" onClick={handleDownloadQr}>
//                 <Icon.Download className="h-4 w-4" />
//                 Download QR code
//               </PrimaryButton>
//             ) : (
//               <PrimaryButton
//                 className="mt-6"
//                 onClick={handleGenerateNfc}
//                 disabled={data.nfcStatus === "generating"}
//               >
//                 {data.nfcStatus === "generating" && (
//                   <Icon.Spinner className="h-4 w-4 animate-spin" />
//                 )}
//                 {data.nfcStatus === "generating"
//                   ? "Generating…"
//                   : "Generate NFC QR Code"}
//               </PrimaryButton>
//             )}

//             {data.nfcStatus === "ready" && (
//               <button
//                 type="button"
//                 onClick={() => goTo(6)}
//                 className="mt-3 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
//               >
//                 Continue to finish setup →
//               </button>
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

//   return (
//     <div className="flex min-h-screen w-full items-stretch justify-center bg-gray-100 p-0 sm:p-6">
//       <div className="flex w-full max-w-7xl overflow-hidden bg-white shadow-sm sm:rounded-2xl">
//         {/* Left: wizard */}
//         <div className="flex w-full flex-col px-5 py-6 sm:px-10 sm:py-10 lg:w-[52%]">
//           <Stepper current={step} onJump={goTo} />
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
  useGetStep1Query,
  usePostStep1Mutation,
  usePostStep2Mutation,
  usePatchStep2Mutation,
  usePatchStep3Mutation,
  useGetStep4Query,
  usePostStep4Mutation,
  usePatchStep4Mutation,
  useGetStep5Query,
  usePostStep5Mutation,
  usePatchStep5Mutation,
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

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
type ReviewTiming = "2h" | "5h" | "24h" | "custom";
type RequestChannel = "SMS" | "EMAIL";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

/** A Google Place as returned by /business/search-places and /competitor/search */
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
  placeId: string;
  address?: string;
  phone?: string | null;
  website?: string | null;
  category?: string | null;
  rating?: number | null;
  userRatingsTotal?: number | null;
  googleReviewUrl?: string | null;
  googleMapsUrl?: string | null;
  monthlyGoal: number;
  isOnboardingCompleted: boolean;
  onboardingStep: number;
  autoReviewRequests: boolean;
  followUpReminder: boolean;
  defaultRequestChannel: string;
  requestDelay: string;
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
  country: string;
  monthlyGoal: string;
  gmbConnected: boolean;
  defaultRequestChannel: RequestChannel;
  reviewTiming: ReviewTiming;
  customHours: string;
  followUpReminder: boolean;
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
  /** Called once the person finishes the wizard and clicks "Go Dashboard". */
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
 * ISO 3166-1 alpha-2 codes power both the flag icon and the map center.
 * The country only affects the map preview; it is not sent to the API.
 */
const COUNTRIES: (CountryOption & { center: [number, number] })[] = [
  { code: "CA", name: "Canada", center: [43.6532, -79.3832] },
  { code: "US", name: "United States", center: [40.7128, -74.006] },
  { code: "GB", name: "United Kingdom", center: [51.5074, -0.1278] },
  { code: "NL", name: "Netherlands", center: [52.3676, 4.9041] },
  { code: "AU", name: "Australia", center: [-33.8688, 151.2093] },
  { code: "IE", name: "Ireland", center: [53.3498, -6.2603] },
  { code: "BD", name: "Bangladesh", center: [23.8103, 90.4125] },
  { code: "IN", name: "India", center: [28.6139, 77.209] },
];

/** `delay` is the exact string the backend stores in `requestDelay`. */
const TIMING_OPTIONS: { id: ReviewTiming; label: string; delay: string }[] = [
  { id: "2h", label: "2 hours after service", delay: "2 hours after service" },
  { id: "5h", label: "5 hours after service", delay: "5 hours after service" },
  {
    id: "24h",
    label: "24 hours after service",
    delay: "24 hours after service",
  },
  { id: "custom", label: "Custom time", delay: "" },
];

// Confirm these enum values with the backend.
const CHANNEL_OPTIONS: { id: RequestChannel; label: string }[] = [
  { id: "SMS", label: "SMS" },
  { id: "EMAIL", label: "Email" },
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

const DEFAULT_STATE: FormState = {
  businessName: "",
  country: "CA",
  monthlyGoal: "25",
  gmbConnected: false,
  defaultRequestChannel: "SMS",
  reviewTiming: "2h",
  customHours: "3",
  followUpReminder: true,
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
    return `${h} ${h === 1 ? "hour" : "hours"} after service`;
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
    place?: string;
    goal?: string;
  }>({});

  const [competitorQuery, setCompetitorQuery] = useState("");
  const [selectedCompetitors, setSelectedCompetitors] = useState<
    Record<string, Place>
  >({});
  const [addedCompetitorIds, setAddedCompetitorIds] = useState<string[]>([]);

  const [card, setCard] = useState<NfcCard | null>(null);
  const [copied, setCopied] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ---- API hooks ---- */

  const { data: profileRes, isLoading: profileLoading } =
    useGetCheckUserBusinessProfileQuery(undefined);

  const debouncedPlaceQuery = useDebounce(placeQuery.trim());
  const placeSearchEnabled =
    step === 1 &&
    !business &&
    !selectedPlace &&
    debouncedPlaceQuery.length >= 2;
  const {
    currentData: placesRes,
    isFetching: placesFetching,
    isError: placesError,
  } = useGetStep1Query(encodeURIComponent(debouncedPlaceQuery), {
    skip: !placeSearchEnabled,
  });
  const placeResults: Place[] =
    (placesRes as ApiResponse<Place[]> | undefined)?.data ?? [];

  const debouncedCompetitorQuery = useDebounce(competitorQuery.trim());
  const {
    currentData: competitorsRes,
    isFetching: competitorsFetching,
    isError: competitorsError,
  } = useGetStep4Query(encodeURIComponent(debouncedCompetitorQuery), {
    skip: step !== 4 || !business || debouncedCompetitorQuery.length < 2,
  });
  const competitorResults: Place[] = (
    (competitorsRes as ApiResponse<Place[]> | undefined)?.data ?? []
  ).filter((p) => p.placeId !== business?.placeId);

  const cardId = card?.id ?? card?.cardId;
  const { data: qrRes } = useGetStep5Query(
    { query: QR_FORMAT, cardId },
    { skip: !cardId },
  );
  const qrPayload = (qrRes as ApiResponse<Partial<NfcCard>> | undefined)?.data;
  // Prefer the fresh GET result; fall back to what the POST already returned.
  const qrDataUrl = qrPayload?.qrCodeDataUrl ?? card?.qrCodeDataUrl ?? null;
  const qrSvg = qrPayload?.qrCodeSvg ?? card?.qrCodeSvg ?? null;

  const [postStep1] = usePostStep1Mutation();
  const [postStep2] = usePostStep2Mutation();
  const [patchStep2] = usePatchStep2Mutation();
  const [patchStep3] = usePatchStep3Mutation();
  const [postStep4] = usePostStep4Mutation();
  const [patchStep4] = usePatchStep4Mutation();
  const [postStep5] = usePostStep5Mutation();
  const [patchStep5] = usePatchStep5Mutation();

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

    const resume = Math.min(
      Math.max(biz.onboardingStep || 1, 1),
      6,
    ) as StepIndex;
    const { timing, customHours } = parseRequestDelay(biz.requestDelay);

    setBusiness(biz);
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
    setData((d) => ({
      ...d,
      businessName: biz.name,
      monthlyGoal: String(biz.monthlyGoal ?? d.monthlyGoal),
      gmbConnected: resume >= 3,
      defaultRequestChannel:
        biz.defaultRequestChannel === "EMAIL" ? "EMAIL" : "SMS",
      reviewTiming: timing,
      customHours,
      followUpReminder: biz.followUpReminder ?? true,
      autoReviewRequests: biz.autoReviewRequests ?? true,
    }));
    setStep(resume);
    setMaxStep(resume);
  }, [profileLoading, profileRes, router]);

  // Pre-fill the competitor search with the business name the first time step 4 opens.
  useEffect(() => {
    if (step === 4 && business && !competitorQuery) {
      setCompetitorQuery(business.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, business]);

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
  const stepToSend = (target: number) =>
    Math.max(target, business?.onboardingStep ?? 0);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === data.country) ?? COUNTRIES[0],
    [data.country],
  );

  const businessPin: MapPin[] = useMemo(
    () => [
      {
        id: "business",
        position: selectedCountry.center,
        label: business?.name || data.businessName || "Your business",
        color: "#2563EB",
        primary: true,
      },
    ],
    [selectedCountry, business?.name, data.businessName],
  );

  /* ---- step handlers ---- */

  // Step 1 → POST /business, then go to step 2
  const handleBusinessContinue = () =>
    run(async () => {
      const goal = Number(data.monthlyGoal);
      const next: typeof errors = {};
      if (!data.businessName.trim())
        next.name = "Enter your business name to continue.";
      if (!selectedPlace)
        next.place = "Search for your business and select it from the list.";
      if (!Number.isInteger(goal) || goal < 1)
        next.goal = "Enter a goal of at least 1 review per month.";
      setErrors(next);
      if (Object.keys(next).length) return;

      // Already created (person came back to step 1) → don't create a duplicate.
      if (!business) {
        const res = (await postStep1({
          name: data.businessName.trim(),
          placeId: selectedPlace!.placeId,
          monthlyGoal: goal,
        }).unwrap()) as ApiResponse<Business>;
        setBusiness(res.data);
      }
      goTo(2);
    });

  // Step 2 → POST /business/:id/sync-google
  const handleConnectGMB = () =>
    run(async () => {
      if (!business || data.gmbConnected) return;
      const res = (await postStep2({
        businessId: business.id,
        body: {},
      }).unwrap()) as ApiResponse<Partial<Business>> | undefined;
      mergeBusiness(res?.data);
      setData((d) => ({ ...d, gmbConnected: true }));
    });

  // Step 2 → PATCH /business/:id/onboarding { onboardingStep: 3 }
  const handleGmbContinue = () =>
    run(async () => {
      if (!business) return;
      const res = (await patchStep2({
        businessId: business.id,
        body: { onboardingStep: stepToSend(3) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(3);
    });

  // Step 3 → PATCH /business/:id { channel, delay, toggles, onboardingStep: 4 }
  const handleReviewRequestContinue = () =>
    run(async () => {
      if (!business) return;
      const res = (await patchStep3({
        businessId: business.id,
        body: {
          defaultRequestChannel: data.defaultRequestChannel,
          requestDelay: buildRequestDelay(data.reviewTiming, data.customHours),
          followUpReminder: data.followUpReminder,
          autoReviewRequests: data.autoReviewRequests,
          onboardingStep: stepToSend(4),
        },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(4);
    });

  const toggleCompetitor = (place: Place) => {
    setSelectedCompetitors((prev) => {
      const next = { ...prev };
      if (next[place.placeId]) delete next[place.placeId];
      else next[place.placeId] = place;
      return next;
    });
  };

  // Step 4 → POST /competitor (one per selection), then PATCH onboarding step 5
  const handleCompetitorsContinue = () =>
    run(async () => {
      if (!business) return;
      const pending = Object.values(selectedCompetitors).filter(
        (p) => !addedCompetitorIds.includes(p.placeId),
      );

      const results = await Promise.allSettled(
        pending.map((p) =>
          postStep4({
            businessId: business.id,
            placeId: p.placeId,
            name: p.name,
            address: p.address,
          }).unwrap(),
        ),
      );

      const succeeded: string[] = [];
      const failed: string[] = [];
      results.forEach((r, i) => {
        if (r.status === "fulfilled") succeeded.push(pending[i].placeId);
        else failed.push(pending[i].name);
      });
      if (succeeded.length)
        setAddedCompetitorIds((prev) => [...prev, ...succeeded]);
      if (failed.length) {
        // Stay on the step so the person can retry just the ones that failed.
        throw new Error(`Couldn't add: ${failed.join(", ")}. Try again.`);
      }

      const res = (await patchStep4({
        businessId: business.id,
        body: { onboardingStep: stepToSend(5) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(5);
    });

  // Step 5 → POST /nfc (register card + get QR)
  const handleGenerateNfc = () =>
    run(async () => {
      if (!business) return;
      const res = (await postStep5({
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

  // Step 5 → PATCH onboarding step 6
  const handleNfcContinue = () =>
    run(async () => {
      if (!business) return;
      const res = (await patchStep5({
        businessId: business.id,
        body: { onboardingStep: stepToSend(6) },
      }).unwrap()) as ApiResponse<Business>;
      mergeBusiness(res.data);
      goTo(6);
    });

  const handleGoDashboard = () => {
    onComplete?.({ form: data, business });
    router.push("/dashboard");
  };

  /* ---- step content ---- */

  const renderStep = () => {
    switch (step) {
      case 1: {
        const locked = !!business; // business already created → place can't change here
        const typing = placeQuery.trim() !== debouncedPlaceQuery;
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
                placeholder="e.g. Coffee House"
                className={[
                  inputClass,
                  errors.name ? "border-red-400" : "border-gray-200",
                ].join(" ")}
              />
              <FieldError>{errors.name}</FieldError>
            </div>

            <div className="mt-5">
              <FieldLabel>Find your business on Google</FieldLabel>
              {selectedPlace ? (
                <div className="overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/40">
                  <PlaceRow
                    place={selectedPlace}
                    trailing={
                      !locked && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedPlace(null);
                            setPlaceQuery("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSelectedPlace(null);
                              setPlaceQuery("");
                            }
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
                    onChange={(e) => {
                      setPlaceQuery(e.target.value);
                      if (errors.place)
                        setErrors((er) => ({ ...er, place: undefined }));
                    }}
                    placeholder="Search your business name and city"
                    className={[
                      inputClass,
                      errors.place ? "border-red-400" : "border-gray-200",
                    ].join(" ")}
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
                            onClick={() => {
                              setSelectedPlace(p);
                              setErrors((er) => ({ ...er, place: undefined }));
                              setData((d) => ({
                                ...d,
                                businessName: d.businessName.trim()
                                  ? d.businessName
                                  : p.name,
                              }));
                            }}
                          />
                        ))}
                    </div>
                  )}
                </>
              )}
              <FieldError>{errors.place}</FieldError>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>Country</FieldLabel>
                <CountrySelect
                  value={data.country}
                  options={COUNTRIES}
                  onChange={(code: any) =>
                    setData((d) => ({ ...d, country: code }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Monthly review goal</FieldLabel>
                <input
                  type="number"
                  min={1}
                  value={data.monthlyGoal}
                  disabled={locked}
                  onChange={(e) => {
                    setData((d) => ({ ...d, monthlyGoal: e.target.value }));
                    if (errors.goal)
                      setErrors((er) => ({ ...er, goal: undefined }));
                  }}
                  className={[
                    inputClass,
                    errors.goal ? "border-red-400" : "border-gray-200",
                  ].join(" ")}
                />
                <FieldError>{errors.goal}</FieldError>
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

      case 2:
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Connect your Google Business Profile
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Get real-time reviews, insights and manage your online reputation.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon.Store className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-gray-800">
                  {business?.name || data.businessName || "Your business"}
                </span>
                {business?.address && (
                  <span className="block truncate text-xs text-gray-500">
                    {business.address}
                  </span>
                )}
                <RatingLine
                  rating={business?.rating}
                  total={business?.userRatingsTotal}
                />
              </div>
              {business?.googleMapsUrl && (
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View on Maps
                </a>
              )}
            </div>

            <ErrorBanner message={apiError} />

            <PrimaryButton
              className="mt-5"
              onClick={handleConnectGMB}
              loading={submitting && !data.gmbConnected}
              disabled={data.gmbConnected || !business}
            >
              {data.gmbConnected
                ? "Connected"
                : submitting
                  ? "Connecting…"
                  : "Connect GMB"}
            </PrimaryButton>

            {data.gmbConnected && (
              <div className="mt-5 space-y-3">
                <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
                  <MapView
                    center={selectedCountry.center}
                    zoom={14}
                    pins={businessPin}
                  />
                </div>
                <PrimaryButton onClick={handleGmbContinue} loading={submitting}>
                  Continue
                </PrimaryButton>
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
                Send requests by
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
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

            <div className="mt-6 space-y-2.5">
              <Toggle
                checked={data.autoReviewRequests}
                onChange={(v) =>
                  setData((d) => ({ ...d, autoReviewRequests: v }))
                }
                label="Send requests automatically"
                hint="We ask every customer without you lifting a finger."
              />
              <Toggle
                checked={data.followUpReminder}
                onChange={(v) =>
                  setData((d) => ({ ...d, followUpReminder: v }))
                }
                label="Send a follow-up reminder"
                hint="A gentle nudge if they haven't reviewed yet."
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
        const selectedCount = Object.keys(selectedCompetitors).length;
        const typing = competitorQuery.trim() !== debouncedCompetitorQuery;
        return (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Find your competitors
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Pick the nearby businesses you want to compare your review growth
              against.
            </p>

            <div className="mt-6">
              <input
                type="text"
                value={competitorQuery}
                onChange={(e) => setCompetitorQuery(e.target.value)}
                placeholder="Search competitors, e.g. coffee shop Amsterdam"
                className={[inputClass, "border-gray-200"].join(" ")}
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
                <span>Your Competitors</span>
                <span className="text-xs font-normal text-gray-500">
                  {selectedCount} selected
                </span>
              </div>

              <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
                {(competitorsFetching || typing) && (
                  <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
                    <Icon.Spinner className="h-3.5 w-3.5 animate-spin" />
                    Searching nearby competitors…
                  </div>
                )}
                {!competitorsFetching && competitorsError && (
                  <p className="px-4 py-3 text-xs text-red-500">
                    Search failed. Try again in a moment.
                  </p>
                )}
                {!competitorsFetching &&
                  !competitorsError &&
                  !typing &&
                  competitorResults.length === 0 && (
                    <p className="px-4 py-3 text-xs text-gray-500">
                      No competitors found. Try a broader search.
                    </p>
                  )}
                {!competitorsFetching &&
                  competitorResults.map((p) => {
                    const checked = !!selectedCompetitors[p.placeId];
                    const added = addedCompetitorIds.includes(p.placeId);
                    return (
                      <PlaceRow
                        key={p.placeId}
                        place={p}
                        onClick={() => !added && toggleCompetitor(p)}
                        trailing={
                          <span
                            className={[
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                              checked
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300",
                            ].join(" ")}
                          >
                            {checked && <Icon.Check className="h-3 w-3" />}
                          </span>
                        }
                      />
                    );
                  })}
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

            <PrimaryButton className="mt-8" onClick={handleGoDashboard}>
              Go Dashboard
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
