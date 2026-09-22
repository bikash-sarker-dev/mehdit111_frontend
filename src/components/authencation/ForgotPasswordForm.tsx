"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Logo from "./Logo";

interface ForgotPasswordFormProps {
  onSubmit?: (data: { email: string }) => void;
  loginHref?: string;
}

export default function ForgotPasswordForm({
  onSubmit,
  loginHref = "/login",
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email });
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <Logo />
        <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Enter the email address associated with your account. We&apos;ll
          send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ayeshahabib@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
        >
          Send Reset Link
        </button>

        {sent && (
          <p className="text-center text-sm font-medium text-green-600">
            Check your inbox for a reset link.
          </p>
        )}

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
