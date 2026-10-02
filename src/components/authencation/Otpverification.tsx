"use client";

import {
  useRegistrationverifyOtpMutation,
  useResendRegistrationOtpMutation,
} from "@/redux/api/auth/authApi";
import OtpStep from "./Otpstep";

interface OtpVerificationProps {
  email: string;
  onVerified?: () => void;
  onBack?: () => void;
}

export default function OtpVerification({
  email,
  onVerified,
  onBack,
}: OtpVerificationProps) {
  const [verifyOtp] = useRegistrationverifyOtpMutation();
  const [resendOtp] = useResendRegistrationOtpMutation();

  return (
    <OtpStep
      email={email}
      onBack={onBack}
      onVerify={async (otp) => {
        await verifyOtp({ email, otp }).unwrap();
      }}
      onResend={async () => {
        await resendOtp({ email }).unwrap();
      }}
      showSuccess
      successTitle="Email verified"
      successMessage="Your account is ready. Taking you to sign in…"
      onSuccess={() => onVerified?.()}
    />
  );
}
