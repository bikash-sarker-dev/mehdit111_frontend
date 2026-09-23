"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import Logo from "./Logo";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onGoogleSignIn?: () => void;
  forgotPasswordHref?: string;
  signUpHref?: string;
}

export default function SignInForm({
  onSubmit,
  onGoogleSignIn,
  forgotPasswordHref = "/forgot-password",
  signUpHref = "/signup",
}: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
    router.push("/onboarding");
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <Logo />
        <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your review growth.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex justify-end">
          <a
            href={forgotPasswordHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot Password?
          </a>
        </div>

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

        <PasswordInput
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
        >
          Sign in
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleButton onClick={onGoogleSignIn} />

        <p className="pt-1 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <a
            href={signUpHref}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign up
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
