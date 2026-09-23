"use client";

import React, { useState } from "react";
import { Clock, Sparkles, Mail, CheckCircle2, Wrench } from "lucide-react";

export interface ComingSoonFeature {
  label: string;
}

export interface ComingSoonPageProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  progress?: number; // 0–100
  progressLabel?: string;
  eta?: string;
  features?: ComingSoonFeature[];
  onNotify?: (email: string) => void;
}

const defaultFeatures: ComingSoonFeature[] = [
  { label: "Real-time review tracking" },
  { label: "Competitor benchmarking" },
  { label: "Automated monthly reports" },
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ComingSoonPage({
  eyebrow = "Work in progress",
  title = "Something new is on the way",
  subtitle = "We're building this page to give you a clearer, faster way to track your review performance. It's not ready yet, but it's coming soon.",
  progress = 68,
  progressLabel = "Build progress",
  eta = "Expected in a few weeks",
  features = defaultFeatures,
  onNotify,
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("success");
    onNotify?.(email);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-3 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-lg">
        {/* Status badge */}
        <div className="mb-5 flex justify-center sm:mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:text-sm">
            <Wrench className="h-3.5 w-3.5" strokeWidth={2.5} />
            {eyebrow}
          </span>
        </div>

        {/* Main card */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 sm:h-14 sm:w-14">
              <Sparkles
                className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7"
                strokeWidth={2}
              />
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 sm:text-base">
              {subtitle}
            </p>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-400 sm:mt-6">
          Thanks for your patience while we build this.
        </p>
      </div>
    </div>
  );
}
