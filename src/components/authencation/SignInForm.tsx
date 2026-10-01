"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "./AuthLayout";
import Logo from "./Logo";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";

import { useSignInMutation } from "@/redux/api/auth/authApi";

interface SignInFormProps {
  onGoogleSignIn?: () => void;
  forgotPasswordHref?: string;
  signUpHref?: string;
}

/** Shape of the sign-in API response */
interface SignInResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
      isVerified: boolean;
      image: string | null;
    };
  };
}

/**
 * Where each role lands after signing in.
 * Add more roles here (e.g. "super_admin", "business") as your backend needs.
 */
const ROLE_ROUTES: Record<string, string> = {
  admin: "/dashboard/admin",
  user: "/onboarding",
};
const DEFAULT_ROUTE = "/onboarding";

function getErrorMessage(err: unknown, fallback: string) {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message || e?.message || fallback;
}

export default function SignInForm({
  onGoogleSignIn,
  forgotPasswordHref = "/forgot-password",
  signUpHref = "/signup",
}: SignInFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [signIn, { isLoading }] = useSignInMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      const res = (await signIn({
        email: normalizedEmail,
        password,
      }).unwrap()) as SignInResponse;

      const { accessToken, refreshToken, user } = res.data;

      // Save session data
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (storageError) {
        console.error("Could not save session to localStorage:", storageError);
      }

      // Success toast (uses the API message, with a fallback)
      toast.success(res.message || "Logged in successfully.");

      // Redirect based on the role returned by the API
      const role = user.role?.toLowerCase();
      router.push(ROLE_ROUTES[role] ?? DEFAULT_ROUTE);
    } catch (err) {
      setError(
        getErrorMessage(err, "Incorrect email or password. Please try again."),
      );
    }
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <PasswordInput
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
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
