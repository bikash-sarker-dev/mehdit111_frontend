"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import PasswordInput from "./PasswordInput";
import Logo from "./Logo";
import AuthLayout from "./AuthLayout";

// ⚠️ Change this import path to wherever your RTK Query auth api lives
import { useResetPasswordMutation } from "@/redux/api/auth/authApi";

interface ResetPasswordFormProps {
  /** Email the reset code was sent to */
  email?: string;
  /** The verified 6-digit code */
  otp?: string;
  loginHref?: string;
}

function getErrorMessage(err: unknown, fallback: string) {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message || e?.message || fallback;
}

export default function ResetPasswordForm({
  email,
  otp,
  loginHref = "/signIn",
}: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }
    setError("");

    try {
      // API expects: { email, otp, newPassword }
      await resetPassword({ email, otp, newPassword: password }).unwrap();
      toast.success("Password reset successfully. Please sign in.");
      router.push(loginHref);
    } catch (err) {
      setError(
        getErrorMessage(err, "Couldn't reset your password. Try again."),
      );
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <Logo />
        <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Set New Password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Create a new password to secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <PasswordInput
          name="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        <PasswordInput
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        <p className="pt-1 text-center text-sm">
          <a
            href={loginHref}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
