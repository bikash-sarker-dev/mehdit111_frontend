import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "shizzle",
    default: "shizzle",
  },
  description: "this is shizzle project for demo description",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <NextTopLoader
        color="linear-gradient(180deg, #DC3C3C 70%, #000000 100%)"
        showSpinner={false}
      />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />
          <main className="mx-auto w-full max-w-screen-3xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
