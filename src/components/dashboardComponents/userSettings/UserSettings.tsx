"use client";

/**
 * SettingsPage.tsx
 * ---------------------------------------------------------------
 * One self-contained Settings component:
 *   General Settings · Company & Brand · Notifications · Security
 *
 * Stack : Next.js (App Router) · React · TypeScript · Tailwind CSS
 * Deps  : none (icons are inline SVG)
 * Usage : app/settings/page.tsx  ->  export { default } from '@/components/SettingsPage';
 *
 * Responsive behaviour
 *  - Mobile  : tabs become a horizontally scrollable pill bar, buttons go
 *              full width, inputs use 16px text (prevents iOS zoom-on-focus),
 *              toggles and buttons keep 44px touch targets.
 *  - Tablet+ : left sidebar card (as in the design) + content card.
 */

import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type TabId = "general" | "company" | "notifications" | "security";

interface GeneralData {
  ownerName: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  phone: string;
  businessEmail: string;
  gmbLink: string;
}

interface NotificationData {
  nfcActive: boolean;
  autoRequests: boolean;
  followUp: boolean;
  channel: "sms" | "email";
  delay: number;
  newReview: boolean;
  requestDelivered: boolean;
  competitorActivity: boolean;
  nfcTap: boolean;
}

export interface SettingsPageProps {
  /** Optional hook to persist changes. Receives the section name + its data. */
  onSave?: (section: string, data: unknown) => void | Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Icons (lucide-style, inline so the component has zero dependencies) */
/* ------------------------------------------------------------------ */

const ICONS = {
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  building: (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
  wifi: (
    <>
      <path d="M12 20h.01" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M5 12.86a10 10 0 0 1 14 0" />
      <path d="M8.5 16.43a5 5 0 0 1 7 0" />
    </>
  ),
  alert: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="14" height="14" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  chevron: <path d="m6 9 6 6 6-6" />,
} satisfies Record<string, ReactNode>;

type IconName = keyof typeof ICONS;

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                              */
/* ------------------------------------------------------------------ */

const inputBase =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-700 " +
  "placeholder:text-slate-400 outline-none transition sm:text-sm " +
  "focus:border-blue-500 focus:ring-4 focus:ring-blue-100 read-only:cursor-default";

interface FieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "url";
  readOnly?: boolean;
  muted?: boolean;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  readOnly,
  muted,
}: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${inputBase} ${muted ? "text-slate-500" : ""}`}
      />
    </div>
  );
}

function SaveButton({ onClick }: { onClick?: () => void | Promise<void> }) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handle = async () => {
    await onClick?.();
    setSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1a5cff] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#1450e0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:scale-[0.98] sm:w-auto"
    >
      {saved ? (
        <>
          <Icon name="check" className="h-4 w-4" />
          Saved
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SelectBox({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-10 sm:w-auto sm:min-w-[104px] sm:text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function CardHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </header>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
          {title}
        </h3>
      </header>
      <div className="divide-y divide-slate-100">{children}</div>
    </section>
  );
}

function SettingRow({
  title,
  description,
  children,
  stackOnMobile = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  stackOnMobile?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 px-5 py-4 sm:px-6 ${
        stackOnMobile
          ? "flex-col sm:flex-row sm:items-center sm:justify-between"
          : "items-center justify-between"
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab configuration                                                  */
/* ------------------------------------------------------------------ */

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: "general", label: "General Settings", icon: "settings" },
  { id: "company", label: "Company & Brand", icon: "building" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
];

const GENERAL_FIELDS: {
  key: keyof GeneralData;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: FieldProps["inputMode"];
}[] = [
  { key: "ownerName", label: "Owner Name", autoComplete: "name" },
  { key: "businessName", label: "Business Name", autoComplete: "organization" },
  { key: "businessType", label: "Business Type" },
  {
    key: "businessAddress",
    label: "Business Address",
    autoComplete: "street-address",
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    key: "businessEmail",
    label: "Business Email",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  { key: "gmbLink", label: "GMB link", inputMode: "url" },
];

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const LOGO_TYPES = ["image/svg+xml", "image/png", "image/jpeg"];

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export default function UserSettingsPage({ onSave }: SettingsPageProps) {
  const [tab, setTab] = useState<TabId>("general");

  /* General */
  const [general, setGeneral] = useState<GeneralData>({
    ownerName: "Mehdi",
    businessName: "Review Growth AI",
    businessType: "Cafe / Restaurant",
    businessAddress: "142 West 3rd Street, New York, NY 10012",
    phone: "+1 (555) 412-9900",
    businessEmail: "support@reviewgrowth.ai",
    gmbLink: "g.page/r/bellascafe/review",
  });

  /* Company & brand */
  const [companyName, setCompanyName] = useState("Review Growth AI");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* Notifications */
  const [notif, setNotif] = useState<NotificationData>({
    nfcActive: true,
    autoRequests: true,
    followUp: true,
    channel: "sms",
    delay: 15,
    newReview: true,
    requestDelivered: true,
    competitorActivity: true,
    nfcTap: false,
  });
  const [copied, setCopied] = useState(false);

  /* Security */
  const [email, setEmail] = useState("support@reviewgrowth.ai");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* Clean up object URLs */
  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  const setN = <K extends keyof NotificationData>(
    key: K,
    value: NotificationData[K],
  ) => setNotif((prev) => ({ ...prev, [key]: value }));

  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) {
      setLogoError("Unsupported file. Please upload an SVG, PNG or JPG.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("File is too large. The maximum size is 2MB.");
      return;
    }
    setLogoError("");
    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(general.gmbLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable – fail silently */
    }
  };

  const confirmDanger = (message: string, action: string) => {
    if (window.confirm(message)) void onSave?.(action, null);
  };

  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-slate-900 antialiased sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
            Settings
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-[13px]">
            Configure your platform settings
          </p>
        </header>

        <div className="grid items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
          {/* ------------------------- Sidebar / tabs ------------------------- */}
          <nav
            role="tablist"
            aria-label="Settings sections"
            aria-orientation="vertical"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:sticky md:top-6 md:mx-0 md:block md:gap-0 md:overflow-hidden md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-0 [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 md:w-full md:rounded-none md:border-0 md:border-b md:border-slate-100 md:py-3 md:last:border-b-0 ${
                    active
                      ? "border-blue-100 bg-blue-50 font-medium text-blue-600"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon name={t.icon} className="h-4 w-4 shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* ------------------------- Content ------------------------- */}
          <main className="min-w-0">
            {/* ============ General ============ */}
            {tab === "general" && (
              <section
                role="tabpanel"
                id="panel-general"
                aria-labelledby="tab-general"
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:p-7"
              >
                <CardHeading
                  title="General Settings"
                  subtitle="Configure your platform settings"
                />
                <div className="space-y-4">
                  {GENERAL_FIELDS.map((f) => (
                    <Field
                      key={f.key}
                      label={f.label}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      inputMode={f.inputMode}
                      value={general[f.key]}
                      onChange={(v) =>
                        setGeneral((prev) => ({ ...prev, [f.key]: v }))
                      }
                    />
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <SaveButton onClick={() => onSave?.("general", general)} />
                </div>
              </section>
            )}

            {/* ============ Company & Brand ============ */}
            {tab === "company" && (
              <section
                role="tabpanel"
                id="panel-company"
                aria-labelledby="tab-company"
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:p-7"
              >
                <CardHeading
                  title="Company & Brand"
                  subtitle="Configure your platform settings"
                />

                <div className="space-y-4">
                  <Field
                    label="Company Name"
                    value={companyName}
                    onChange={setCompanyName}
                    muted
                  />

                  <div>
                    <span className="mb-2 block text-sm text-slate-600">
                      Logo
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
                      onChange={handleLogo}
                      className="sr-only"
                      tabIndex={-1}
                      aria-label="Upload logo"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex min-h-[104px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-white px-4 py-6 text-center transition hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:min-h-[104px]"
                    >
                      {logoUrl ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoUrl}
                            alt="Logo preview"
                            className="mb-1 h-14 max-w-[70%] object-contain"
                          />
                          <span className="max-w-full truncate text-sm text-slate-500">
                            {logoFile?.name} · Click to replace
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-slate-400">
                            Click to upload logo
                          </span>
                          <span className="text-xs text-slate-400">
                            SVG, PNG or JPG · Max 2MB
                          </span>
                        </>
                      )}
                    </button>
                    {logoError && (
                      <p role="alert" className="mt-2 text-xs text-red-600">
                        {logoError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton
                    onClick={() =>
                      onSave?.("company", { companyName, logo: logoFile })
                    }
                  />
                </div>
              </section>
            )}

            {/* ============ Notifications ============ */}
            {tab === "notifications" && (
              <div
                role="tabpanel"
                id="panel-notifications"
                aria-labelledby="tab-notifications"
                className="space-y-4 sm:space-y-5"
              >
                <SectionCard icon="wifi" title="NFC Settings">
                  <SettingRow
                    title="NFC Active"
                    description="Enable tap-to-review across all your NFC cards and stands."
                  >
                    <Toggle
                      checked={notif.nfcActive}
                      onChange={(v) => setN("nfcActive", v)}
                      label="NFC Active"
                    />
                  </SettingRow>

                  <SettingRow
                    stackOnMobile
                    title="Google Review Link"
                    description="The URL customers are directed to when they tap an NFC card."
                  >
                    <div className="flex w-full items-center gap-2 sm:w-[300px]">
                      <input
                        readOnly
                        value={general.gmbLink}
                        aria-label="Google Review Link"
                        className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-base text-blue-600 outline-none sm:h-10 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={copyLink}
                        aria-label={copied ? "Link copied" : "Copy link"}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:h-10 sm:w-10"
                      >
                        <Icon
                          name={copied ? "check" : "copy"}
                          className={`h-4 w-4 ${copied ? "text-green-600" : ""}`}
                        />
                      </button>
                    </div>
                  </SettingRow>
                </SectionCard>

                <SectionCard icon="alert" title="Review Request Settings">
                  <SettingRow
                    title="Automatic Review Requests"
                    description="Send a review request automatically after a job is logged via QuickSend or NFC."
                  >
                    <Toggle
                      checked={notif.autoRequests}
                      onChange={(v) => setN("autoRequests", v)}
                      label="Automatic Review Requests"
                    />
                  </SettingRow>

                  <SettingRow
                    title="Follow-up Reminder"
                    description="Send a follow-up message 48 hours after the initial request if no response is received."
                  >
                    <Toggle
                      checked={notif.followUp}
                      onChange={(v) => setN("followUp", v)}
                      label="Follow-up Reminder"
                    />
                  </SettingRow>

                  <SettingRow
                    stackOnMobile
                    title="Default Request Channel"
                    description="Preferred channel when both phone and email are available."
                  >
                    <SelectBox
                      label="Default Request Channel"
                      value={notif.channel}
                      onChange={(v) =>
                        setN("channel", v as NotificationData["channel"])
                      }
                      options={[
                        { value: "sms", label: "SMS" },
                        { value: "email", label: "Email" },
                      ]}
                    />
                  </SettingRow>

                  <SettingRow
                    stackOnMobile
                    title="Request Delay"
                    description="Minutes after job completion before the request is sent."
                  >
                    <SelectBox
                      label="Request Delay"
                      value={String(notif.delay)}
                      onChange={(v) => setN("delay", Number(v))}
                      options={[5, 10, 15, 30, 60].map((m) => ({
                        value: String(m),
                        label: `${m} minutes`,
                      }))}
                    />
                  </SettingRow>
                </SectionCard>

                <SectionCard icon="bell" title="Notifications">
                  <SettingRow
                    title="New Review Received"
                    description="Get notified when a new Google review is posted."
                  >
                    <Toggle
                      checked={notif.newReview}
                      onChange={(v) => setN("newReview", v)}
                      label="New Review Received"
                    />
                  </SettingRow>
                  <SettingRow
                    title="Request Delivered"
                    description="Confirm when a review request is successfully delivered."
                  >
                    <Toggle
                      checked={notif.requestDelivered}
                      onChange={(v) => setN("requestDelivered", v)}
                      label="Request Delivered"
                    />
                  </SettingRow>
                  <SettingRow
                    title="Competitor Activity"
                    description="Alert when a competitor's review count changes significantly."
                  >
                    <Toggle
                      checked={notif.competitorActivity}
                      onChange={(v) => setN("competitorActivity", v)}
                      label="Competitor Activity"
                    />
                  </SettingRow>
                  <SettingRow
                    title="NFC Tap Recorded"
                    description="Notify when a customer taps an NFC card."
                  >
                    <Toggle
                      checked={notif.nfcTap}
                      onChange={(v) => setN("nfcTap", v)}
                      label="NFC Tap Recorded"
                    />
                  </SettingRow>
                </SectionCard>

                <section className="rounded-2xl border border-red-200 bg-red-100 p-5 sm:p-6">
                  <h3 className="text-base font-semibold text-red-600">
                    Danger Zone
                  </h3>
                  <p className="mt-1.5 text-xs text-red-600">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        confirmDanger(
                          "Clear all customer data? This cannot be undone.",
                          "clear-customer-data",
                        )
                      }
                      className="h-11 rounded-xl border border-red-300 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 sm:h-10"
                    >
                      Clear All Customer Data
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        confirmDanger(
                          "Delete your account? This cannot be undone.",
                          "delete-account",
                        )
                      }
                      className="h-11 rounded-xl border border-red-300 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 sm:h-10"
                    >
                      Delete Account
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* ============ Security ============ */}
            {tab === "security" && (
              <section
                role="tabpanel"
                id="panel-security"
                aria-labelledby="tab-security"
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:p-7"
              >
                <CardHeading
                  title="Security Settings"
                  subtitle="Configure your platform settings"
                />

                <Field
                  label="Changes Email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={setEmail}
                  muted
                />
                <div className="mt-5 flex justify-end">
                  <SaveButton
                    onClick={() => onSave?.("security-email", { email })}
                  />
                </div>

                <h3 className="mb-4 mt-8 text-base font-semibold text-slate-900">
                  Password Changes
                </h3>
                <div className="space-y-4">
                  <Field
                    label="Old Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={oldPassword}
                    onChange={setOldPassword}
                  />
                  <Field
                    label="New Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={setNewPassword}
                  />
                </div>
                <div className="mt-5 flex justify-end">
                  <SaveButton
                    onClick={async () => {
                      await onSave?.("security-password", {
                        oldPassword,
                        newPassword,
                      });
                      setOldPassword("");
                      setNewPassword("");
                    }}
                  />
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
