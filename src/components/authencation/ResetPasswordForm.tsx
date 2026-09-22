"use client";

import { useState, type FormEvent } from "react";

import PasswordInput from "./PasswordInput";
import Logo from "./Logo";
import AuthLayout from "./AuthLayout";

interface ResetPasswordFormProps {
  onSubmit?: (data: { password: string }) => void;
  loginHref?: string;
}

export default function ResetPasswordForm({
  onSubmit,
  loginHref = "/signIn",
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }
    setError("");
    onSubmit?.({ password });
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
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
        >
          Continue
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
