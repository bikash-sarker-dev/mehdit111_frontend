// "use client";

// import { useState, type FormEvent } from "react";
// import { Mail } from "lucide-react";
// import AuthLayout from "./AuthLayout";
// import Logo from "./Logo";

// interface ForgotPasswordFormProps {
//   onSubmit?: (data: { email: string }) => void;
//   loginHref?: string;
// }

// export default function ForgotPasswordForm({
//   onSubmit,
//   loginHref = "/signIn",
// }: ForgotPasswordFormProps) {
//   const [email, setEmail] = useState("");
//   const [sent, setSent] = useState(false);

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     onSubmit?.({ email });
//     setSent(true);
//   };

//   return (
//     <AuthLayout>
//       <div className="flex flex-col items-center text-center">
//         <Logo />
//         <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
//           Forgot Password?
//         </h2>
//         <p className="mt-2 text-sm leading-relaxed text-slate-500">
//           Enter the email address associated with your account. We&apos;ll send
//           you a link to reset your password.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//         <div>
//           <label htmlFor="email" className="sr-only">
//             Email
//           </label>
//           <div className="relative">
//             <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               placeholder="ayeshahabib@gmail.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
//         >
//           Send Reset Link
//         </button>

//         {sent && (
//           <p className="text-center text-sm font-medium text-green-600">
//             Check your inbox for a reset link.
//           </p>
//         )}

//         <p className="pt-1 text-center text-sm">
//           <a
//             href={loginHref}
//             className="font-semibold text-blue-600 hover:text-blue-700"
//           >
//             Back to Login
//           </a>
//         </p>
//       </form>
//     </AuthLayout>
//   );
// }
"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "./AuthLayout";
import Logo from "./Logo";

import ResetPasswordForm from "./ResetPasswordForm";

// ⚠️ Change this import path to wherever your RTK Query auth api lives
import {
  useForgetPasswordMutation,
  useVerifyForgotOtpMutation,
} from "@/redux/api/auth/authApi";
import OtpStep from "./Otpstep";

interface ForgotPasswordFormProps {
  loginHref?: string;
}

type Step = "email" | "otp" | "reset";

function getErrorMessage(err: unknown, fallback: string) {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message || e?.message || fallback;
}

export default function ForgotPasswordForm({
  loginHref = "/signIn",
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [verifyForgotOtp] = useVerifyForgotOtpMutation();

  /* Step 1 → send the OTP to the email */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter the email address for your account.");
      return;
    }

    try {
      await forgetPassword({ email: normalizedEmail }).unwrap();
      setEmail(normalizedEmail);
      toast.success("We sent a 6-digit code to your email.");
      setStep("otp");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't send the code. Try again."));
    }
  };

  /* Step 2 → OTP */
  if (step === "otp") {
    return (
      <AuthLayout>
        <OtpStep
          email={email}
          title="Enter reset code"
          description="We sent a 6-digit code to"
          icon={<ShieldCheck className="h-8 w-8 text-blue-600" />}
          submitLabel="Verify code"
          onBack={() => setStep("email")}
          onVerify={async (code) => {
            await verifyForgotOtp({ email, otp: code }).unwrap();
          }}
          onResend={async () => {
            await forgetPassword({ email }).unwrap();
          }}
          onSuccess={(code) => {
            setOtp(code);
            setStep("reset");
          }}
        />
      </AuthLayout>
    );
  }

  /* Step 3 → new password */
  if (step === "reset") {
    return <ResetPasswordForm email={email} otp={otp} loginHref={loginHref} />;
  }

  /* Step 1 UI */
  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <Logo />
        <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-[28px]">
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Enter the email address associated with your account. We&apos;ll send
          you a 6-digit code to reset your password.
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

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
              Sending code…
            </>
          ) : (
            "Send Reset Code"
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
