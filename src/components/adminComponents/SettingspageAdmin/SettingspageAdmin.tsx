"use client";

/**
 * SettingsPage — one self-contained component (Next.js App Router, TypeScript, Tailwind CSS).
 *
 * Requirements:  npm i lucide-react
 * Usage:         import SettingsPage from "@/components/SettingsPage";
 *                <SettingsPage />   // e.g. inside app/settings/page.tsx
 *
 * Optional: pass `onSave` to persist data to your API. It receives the section id
 * and that section's data. If omitted, saving is simulated so the UI is fully demoable.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  Shield,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & static config                                               */
/* ------------------------------------------------------------------ */

type SectionId =
  | "general"
  | "company"
  | "notifications"
  | "security-email"
  | "security-password";
type TabId = "general" | "company" | "notifications" | "security";

interface SettingsPageProps {
  onSave?: (
    section: SectionId,
    data: Record<string, unknown>,
  ) => Promise<void> | void;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

const TABS: { id: TabId; label: string; Icon: typeof Settings }[] = [
  { id: "general", label: "General Settings", Icon: Settings },
  { id: "company", label: "Company & Brand", Icon: Building2 },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "security", label: "Security", Icon: Shield },
];

const NOTIFICATION_ITEMS = [
  { key: "newBusiness", label: "New business registered" },
  { key: "paymentReceived", label: "Subscription payment received" },
  { key: "paymentFailed", label: "Payment failed" },
  { key: "subscriptionCancelled", label: "Subscription cancelled" },
  { key: "trialExpiring", label: "Trial expiring (3 days)" },
  { key: "adminLogin", label: "New admin login" },
  { key: "weeklyReport", label: "Weekly revenue report" },
] as const;

type NotificationKey = (typeof NOTIFICATION_ITEMS)[number]["key"];

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/svg+xml", "image/png", "image/jpeg"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

/* ------------------------------------------------------------------ */
/* Shared class names                                                  */
/* ------------------------------------------------------------------ */

const inputClass =
  "block h-11 w-full rounded-xl border bg-white px-4 text-base text-slate-600 outline-none " +
  "transition placeholder:text-slate-400 focus:text-slate-900 focus:ring-4 sm:text-[15px]";
const inputOk = "border-slate-200 focus:border-blue-500 focus:ring-blue-500/15";
const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function PanelHeader({ title }: { title: string }) {
  return (
    <header className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px] sm:leading-9">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-slate-600">
        Configure your platform settings
      </p>
    </header>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  error,
  trailing,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "url";
  error?: string;
  trailing?: ReactNode;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[15px] font-normal text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={`${inputClass} ${error ? inputBad : inputOk} ${trailing ? "pr-12" : ""}`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      {error && (
        <p
          id={errId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {show ? (
            <EyeOff className="h-[18px] w-[18px]" />
          ) : (
            <Eye className="h-[18px] w-[18px]" />
          )}
        </button>
      }
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 ${
        checked ? "bg-blue-600" : "bg-slate-200"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[21px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function SaveButton({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-[15px] font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[140px]"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

function FormFooter({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex justify-end pt-2">
      <SaveButton loading={loading}>{children}</SaveButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function SettingsPageAdmin({ onSave }: SettingsPageProps) {
  const uid = useId();
  const [active, setActive] = useState<TabId>("general");
  const [saving, setSaving] = useState<SectionId | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- form state ---- */
  const [general, setGeneral] = useState({
    platformName: "Review Growth AI",
    supportEmail: "support@reviewgrowth.ai",
    platformUrl: "https://app.reviewgrowth.ai",
    maintenanceMode: false,
    newRegistrations: true,
  });

  const [companyName, setCompanyName] = useState("Review Growth AI");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    newBusiness: true,
    paymentReceived: true,
    paymentFailed: true,
    subscriptionCancelled: true,
    trialExpiring: true,
    adminLogin: false,
    weeklyReport: true,
  });

  const [securityEmail, setSecurityEmail] = useState("support@reviewgrowth.ai");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  /* ---- helpers ---- */
  const showToast = useCallback((t: ToastState) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  // Free the object URL when the preview changes / component unmounts
  useEffect(
    () => () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    },
    [logoPreview],
  );

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const save = async (
    section: SectionId,
    data: Record<string, unknown>,
    okMessage: string,
  ) => {
    setSaving(section);
    try {
      if (onSave) await onSave(section, data);
      else await new Promise((r) => setTimeout(r, 700)); // demo delay
      showToast({ type: "success", message: okMessage });
      return true;
    } catch {
      showToast({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
      return false;
    } finally {
      setSaving(null);
    }
  };

  /* ---- tab navigation (keyboard + scroll into view on mobile) ---- */
  const selectTab = (index: number, focus = false) => {
    setActive(TABS[index].id);
    const el = tabRefs.current[index];
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    if (focus) el?.focus();
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TABS.length - 1;
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    selectTab(next, true);
  };

  /* ---- section handlers ---- */
  const submitGeneral = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!general.platformName.trim())
      next.platformName = "Enter a platform name.";
    if (!EMAIL_RE.test(general.supportEmail))
      next.supportEmail = "Enter a valid email address.";
    if (!isValidUrl(general.platformUrl))
      next.platformUrl = "Enter a full URL, like https://app.example.com.";
    setErrors(next);
    if (Object.keys(next).length) return;
    await save("general", general, "General settings saved.");
  };

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setErrors((p) => ({ ...p, logo: "Upload an SVG, PNG or JPG file." }));
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setErrors((p) => ({
        ...p,
        logo: "That file is over 2MB. Choose a smaller logo.",
      }));
      return;
    }
    clearError("logo");
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);
    handleLogoFile(e.dataTransfer.files?.[0]);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitCompany = async (e: FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrors({ companyName: "Enter a company name." });
      return;
    }
    setErrors({});
    await save(
      "company",
      { companyName, logo: logoFile },
      "Company details saved.",
    );
  };

  const submitNotifications = async (e: FormEvent) => {
    e.preventDefault();
    await save(
      "notifications",
      notifications,
      "Notification preferences saved.",
    );
  };

  const submitSecurityEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(securityEmail)) {
      setErrors({ securityEmail: "Enter a valid email address." });
      return;
    }
    setErrors({});
    await save("security-email", { email: securityEmail }, "Email updated.");
  };

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!passwords.oldPassword)
      next.oldPassword = "Enter your current password.";
    if (passwords.newPassword.length < 8)
      next.newPassword = "Use at least 8 characters.";
    else if (passwords.newPassword === passwords.oldPassword)
      next.newPassword = "Choose a password different from your current one.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const ok = await save("security-password", passwords, "Password updated.");
    if (ok) setPasswords({ oldPassword: "", newPassword: "" });
  };

  /* ---- render ---- */
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-slate-900 antialiased sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px] sm:leading-9">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure your platform settings
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">
          {/* Tabs — horizontal scroller on mobile, vertical sidebar on desktop */}
          <nav
            aria-label="Settings sections"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:sticky lg:top-6"
          >
            <div
              role="tablist"
              aria-orientation="vertical"
              className="flex overflow-x-auto p-1.5 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map(({ id, label, Icon }, i) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`${uid}-tab-${id}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={`${uid}-panel-${id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(i)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/50 lg:rounded-none lg:border-b lg:border-slate-100 lg:py-3.5 lg:last:border-b-0 ${
                      isActive
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Panels */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            {/* General */}
            {active === "general" && (
              <section
                id={`${uid}-panel-general`}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-general`}
                tabIndex={0}
                className="focus:outline-none"
              >
                <PanelHeader title="General Settings" />
                <form onSubmit={submitGeneral} noValidate className="space-y-5">
                  <Field
                    label="Platform Name"
                    value={general.platformName}
                    error={errors.platformName}
                    autoComplete="organization"
                    onChange={(v) => {
                      clearError("platformName");
                      setGeneral((g) => ({ ...g, platformName: v }));
                    }}
                  />
                  <Field
                    label="Support Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={general.supportEmail}
                    error={errors.supportEmail}
                    onChange={(v) => {
                      clearError("supportEmail");
                      setGeneral((g) => ({ ...g, supportEmail: v }));
                    }}
                  />
                  <Field
                    label="Platform URL"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    value={general.platformUrl}
                    error={errors.platformUrl}
                    onChange={(v) => {
                      clearError("platformUrl");
                      setGeneral((g) => ({ ...g, platformUrl: v }));
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4">
                      <div className="min-w-0">
                        <p className="text-[15px] text-slate-700">
                          Maintenance Mode
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Take the platform offline for maintenance
                        </p>
                      </div>
                      <Toggle
                        label="Maintenance Mode"
                        checked={general.maintenanceMode}
                        onChange={(v) =>
                          setGeneral((g) => ({ ...g, maintenanceMode: v }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4">
                      <div className="min-w-0">
                        <p className="text-[15px] text-slate-700">
                          New Registrations
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Allow new businesses to register
                        </p>
                      </div>
                      <Toggle
                        label="New Registrations"
                        checked={general.newRegistrations}
                        onChange={(v) =>
                          setGeneral((g) => ({ ...g, newRegistrations: v }))
                        }
                      />
                    </div>
                  </div>

                  <FormFooter loading={saving === "general"}>
                    Save Changes
                  </FormFooter>
                </form>
              </section>
            )}

            {/* Company & Brand */}
            {active === "company" && (
              <section
                id={`${uid}-panel-company`}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-company`}
                tabIndex={0}
                className="focus:outline-none"
              >
                <PanelHeader title="Company & Brand" />
                <form onSubmit={submitCompany} noValidate className="space-y-5">
                  <Field
                    label="Company Name"
                    value={companyName}
                    error={errors.companyName}
                    autoComplete="organization"
                    onChange={(v) => {
                      clearError("companyName");
                      setCompanyName(v);
                    }}
                  />

                  <div>
                    <span className="mb-2 block text-[15px] text-slate-700">
                      Logo
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                      onChange={(e) => handleLogoFile(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      aria-describedby={
                        errors.logo ? `${uid}-logo-err` : undefined
                      }
                      className={`flex min-h-[112px] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 sm:min-h-[112px] ${
                        dragging
                          ? "border-blue-500 bg-blue-50"
                          : errors.logo
                            ? "border-red-300 bg-red-50/40"
                            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"
                      }`}
                    >
                      {logoPreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoPreview}
                            alt="Selected logo preview"
                            className="max-h-14 max-w-[70%] object-contain"
                          />
                          <span className="mt-2 max-w-full truncate text-sm text-slate-500">
                            {logoFile?.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[15px] text-slate-400">
                            Click to upload logo
                          </span>
                          <span className="text-xs text-slate-400">
                            SVG, PNG or JPG · Max 2MB
                          </span>
                        </>
                      )}
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                      >
                        <X className="h-4 w-4" aria-hidden />
                        Remove logo
                      </button>
                    )}
                    {errors.logo && (
                      <p
                        id={`${uid}-logo-err`}
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                        {errors.logo}
                      </p>
                    )}
                  </div>

                  <FormFooter loading={saving === "company"}>
                    Save Changes
                  </FormFooter>
                </form>
              </section>
            )}

            {/* Notifications (heading text kept exactly as in the design) */}
            {active === "notifications" && (
              <section
                id={`${uid}-panel-notifications`}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-notifications`}
                tabIndex={0}
                className="focus:outline-none"
              >
                <PanelHeader title="Company & Brand" />
                <form onSubmit={submitNotifications} className="space-y-3">
                  <ul>
                    {NOTIFICATION_ITEMS.map(({ key, label }) => (
                      <li
                        key={key}
                        className="flex items-center justify-between gap-4 border-b border-slate-100 py-4"
                      >
                        <span className="text-[15px] text-slate-700">
                          {label}
                        </span>
                        <Toggle
                          label={label}
                          checked={notifications[key]}
                          onChange={(v) =>
                            setNotifications((n) => ({ ...n, [key]: v }))
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <FormFooter loading={saving === "notifications"}>
                    Save Preferences
                  </FormFooter>
                </form>
              </section>
            )}

            {/* Security */}
            {active === "security" && (
              <section
                id={`${uid}-panel-security`}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-security`}
                tabIndex={0}
                className="focus:outline-none"
              >
                <PanelHeader title="Security Settings" />

                <form
                  onSubmit={submitSecurityEmail}
                  noValidate
                  className="space-y-4"
                >
                  <Field
                    label="Changes Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={securityEmail}
                    error={errors.securityEmail}
                    onChange={(v) => {
                      clearError("securityEmail");
                      setSecurityEmail(v);
                    }}
                  />
                  <FormFooter loading={saving === "security-email"}>
                    Save Changes
                  </FormFooter>
                </form>

                <form
                  onSubmit={submitPassword}
                  noValidate
                  className="mt-8 space-y-4"
                >
                  <h3 className="text-base font-medium text-slate-900">
                    Password Changes
                  </h3>
                  <PasswordField
                    label="Old Password"
                    autoComplete="current-password"
                    placeholder="***********"
                    value={passwords.oldPassword}
                    error={errors.oldPassword}
                    onChange={(v) => {
                      clearError("oldPassword");
                      setPasswords((p) => ({ ...p, oldPassword: v }));
                    }}
                  />
                  <PasswordField
                    label="New Password"
                    autoComplete="new-password"
                    placeholder="**************"
                    value={passwords.newPassword}
                    error={errors.newPassword}
                    onChange={(v) => {
                      clearError("newPassword");
                      setPasswords((p) => ({ ...p, newPassword: v }));
                    }}
                  />
                  <FormFooter loading={saving === "security-password"}>
                    Save Changes
                  </FormFooter>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Toast — sits above the safe area on phones */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {toast && (
          <div
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-slate-900" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2
                className="h-5 w-5 shrink-0 text-emerald-400"
                aria-hidden
              />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
