"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";

import {
  useRegistrationverifyOtpMutation,
  useResendRegistrationOtpMutation,
} from "@/redux/api/auth/authApi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface OtpVerificationProps {
  email: string;
  onVerified?: () => void;
  onBack?: () => void;
}

/** Pulls a readable message out of an RTK Query error */
function getErrorMessage(err: unknown, fallback: string) {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message || e?.message || fallback;
}

export default function RegistrationOtpVerification({
  email,
  onVerified,
  onBack,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [verified, setVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading: isVerifying }] =
    useRegistrationverifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] =
    useResendRegistrationOtpMutation();

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;

  // Focus first box on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Resend countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const focusAt = (i: number) => {
    const el = inputsRef.current[Math.max(0, Math.min(OTP_LENGTH - 1, i))];
    el?.focus();
    el?.select();
  };

  const handleChange = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setError("");
    setDigits((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < OTP_LENGTH - 1) focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        setDigits((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });
      } else if (i > 0) {
        e.preventDefault();
        setDigits((prev) => {
          const next = [...prev];
          next[i - 1] = "";
          return next;
        });
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    setError("");
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, idx) => (next[idx] = d));
    setDigits(next);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setError("Enter all 6 digits of the code.");
      return;
    }
    setError("");
    setInfo("");
    try {
      await verifyOtp({ email, otp }).unwrap();
      setVerified(true);
      setTimeout(() => onVerified?.(), 1400);
    } catch (err) {
      setError(getErrorMessage(err, "That code is incorrect or has expired."));
      setDigits(Array(OTP_LENGTH).fill(""));
      focusAt(0);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    setError("");
    setInfo("");
    try {
      await resendOtp({ email }).unwrap();
      setInfo("A new code is on its way to your inbox.");
      setSecondsLeft(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusAt(0);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't resend the code. Try again."));
    }
  };

  /* ---------- Success state ---------- */
  if (verified) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Email verified
        </h2>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Your account is ready. Taking you to sign in…
        </p>
        <Loader2 className="mt-6 h-5 w-5 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ---------- OTP entry ---------- */
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 ring-8 ring-blue-50/60">
          <MailCheck className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-slate-500">We sent a 6-digit code to</p>
        <p className="mt-0.5 max-w-full truncate text-sm font-semibold text-slate-900">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div
          className="flex justify-center gap-2 sm:gap-3"
          role="group"
          aria-label="One-time verification code"
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={d}
              aria-label={`Digit ${i + 1}`}
              disabled={isVerifying}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={`h-12 w-11 rounded-xl border text-center text-xl font-semibold text-slate-900 transition-all focus:outline-none focus:ring-2 sm:h-14 sm:w-12 ${
                error
                  ? "border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
                  : d
                    ? "border-blue-500 bg-blue-50/40 focus:border-blue-500 focus:ring-blue-100"
                    : "border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
          ))}
        </div>

        <div className="mt-4 min-h-[20px] text-center" aria-live="polite">
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {!error && info && (
            <p className="text-sm font-medium text-emerald-600">{info}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isComplete || isVerifying}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify email"
          )}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Didn&apos;t get the code?{" "}
          {secondsLeft > 0 ? (
            <span className="font-medium text-slate-700">
              Resend in {String(Math.floor(secondsLeft / 60)).padStart(1, "0")}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
            >
              {isResending ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
