"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard page error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 dark:border-red-900/40 dark:bg-red-950/20 max-w-lg w-full">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
          Something went wrong!
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 font-mono break-words bg-white/70 dark:bg-slate-900/80 p-3 rounded-lg border border-red-100 dark:border-red-900/30 text-left">
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
