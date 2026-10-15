"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";

interface GoogleButtonProps {
  /** Called with the Google ID token */
  onSuccess: (idToken: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function GoogleButton({
  onSuccess,
  onError,
  disabled = false,
  text = "continue_with",
}: GoogleButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);

  // Google's button needs a pixel width (200–400), so we fit it to the container
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = () =>
      setWidth(Math.min(400, Math.max(200, Math.floor(el.clientWidth))));

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleSuccess = (res: CredentialResponse) => {
    if (!res.credential) {
      onError?.("Google sign-in failed. Please try again.");
      return;
    }
    onSuccess(res.credential); // <- this is the idToken
  };

  if (!CLIENT_ID) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
        Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID
      </p>
    );
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div
        ref={wrapperRef}
        className={`flex w-full justify-center transition-opacity ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
        aria-disabled={disabled}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError?.("Google sign-in was cancelled or failed.")}
          text={text}
          shape="rectangular"
          theme="outline"
          size="large"
          width={width}
          logo_alignment="center"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
