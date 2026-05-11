"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  statusCode?: 404 | 500 | 403 | 503;
  title?: string;
  message?: string;
}

const NotFound: React.FC<ErrorPageProps> = ({
  statusCode = 404,
  title,
  message,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const errorConfig = {
    404: {
      title: title || "Page Not Found",
      message:
        message ||
        "The page you're looking for doesn't exist or has been moved.",
      emoji: "🔍",
      gradient: "from-[#C43939] to-[#7A1D1D]",
    },
    500: {
      title: title || "Server Error",
      message:
        message || "Something went wrong on our end. Please try again later.",
      emoji: "⚠️",
      gradient: "from-[#C43939] to-[#7A1D1D]",
    },
    403: {
      title: title || "Access Forbidden",
      message: message || "You don't have permission to access this resource.",
      emoji: "🔒",
      gradient: "from-[#C43939] to-[#7A1D1D]",
    },
    503: {
      title: title || "Service  Unavailable Unavailable ",

      message:
        message ||
        "The service is temporarily unavailable. Please try again later.",
      emoji: "🛠️",
      gradient: "from-[#C43939] to-[#7A1D1D]",
    },
  };

  const config = errorConfig[statusCode] || errorConfig[404];

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4 py-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-purple-300 opacity-30 mix-blend-multiply blur-3xl filter dark:bg-purple-900 dark:mix-blend-soft-light"></div>
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-pink-300 opacity-30 mix-blend-multiply blur-3xl filter dark:bg-pink-900 dark:mix-blend-soft-light"></div>
        <div className="animate-blob animation-delay-4000 absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-300 opacity-30 mix-blend-multiply blur-3xl filter dark:bg-blue-900 dark:mix-blend-soft-light"></div>
      </div>

      {/* Main content */}
      <div
        className={`relative w-full max-w-2xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white bg-opacity-90 shadow-2xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800 dark:bg-opacity-90">
          {/* Header gradient */}
          <div className={`h-2 bg-gradient-to-r ${config.gradient}`}></div>

          <div className="p-8 text-center sm:p-12 lg:p-16">
            {/* Error emoji with animation */}
            <div className="animate-bounce-slow mb-8 text-8xl sm:text-9xl">
              {config.emoji}
            </div>

            {/* Error code */}
            <div
              className={`mb-6 inline-block rounded-full bg-gradient-to-r px-6 py-2 ${config.gradient} text-lg font-bold text-white shadow-lg sm:text-xl`}
            >
              Error {statusCode}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              {config.title}
            </h1>

            {/* Message */}
            <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {config.message}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={handleGoHome}
                className={`group relative bg-gradient-to-r px-8 py-4 ${config.gradient} w-full transform rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go Home
                </span>
              </button>

              <button
                onClick={handleGoBack}
                className="group w-full transform rounded-xl bg-slate-200 px-8 py-4 font-semibold text-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-700 dark:text-white sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Go Back
                </span>
              </button>
            </div>

            {/* Help text */}
            <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Need help?{" "}
                <a
                  href="mailto:support@example.com"
                  className={`bg-gradient-to-r font-semibold ${config.gradient} bg-clip-text text-transparent hover:underline`}
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer decorative element */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div
              className={`h-2 w-2 rounded-full bg-gradient-to-r ${config.gradient} animate-pulse`}
            ></div>
            <span>
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
