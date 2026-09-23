import { Wifi, Signal, BatteryFull, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
interface PhoneMockupProps {
  customerName?: string;
  mobileNumber?: string;
  jobType?: string;
  buttonLabel?: string;
  className?: string;
}

function Logo({ width = 100, className = "", priority = true }) {
  return (
    <Link href="#home" className="flex shrink-0 items-center gap-2">
      <Image
        src="/images/logo/logo.png"
        alt="Grow More Reviews — Grow More Reviews, Outgrow Your Competition"
        width={459}
        height={200}
        priority={true}
        style={{ width: 90, height: "auto" }}
        className={`${className}`}
      />
    </Link>
  );
}
export default function PhoneMockup({
  customerName = "Sarah Johnson",
  mobileNumber = "+44 7700 000000",
  jobType = "Plumbing Repair",
  buttonLabel = "Work has been completed",
  className = "",
}: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto w-[240px] rounded-[2.5rem] border-[8px] border-slate-900 bg-slate-900 shadow-xl sm:w-[260px] ${className}`}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />

      <div className="flex h-[500px] flex-col overflow-hidden rounded-[2rem] bg-white sm:h-[540px]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-slate-900">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" strokeWidth={2.5} />
            <Wifi className="h-3 w-3" strokeWidth={2.5} />
            <BatteryFull className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
        </div>

        {/* Brand */}
        <div className="mt-3 flex items-center gap-2 px-5">
          <Logo />
        </div>

        {/* Form */}
        <div className="mt-5 flex-1 px-5">
          <p className="text-[10px] font-medium text-blue-600">QuickSend</p>
          <h3 className="mt-0.5 text-sm font-bold text-slate-900">
            Submit Customer Details
          </h3>

          <label className="mt-4 block text-[10px] font-medium text-slate-500">
            Customer Name
          </label>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {customerName}
          </p>

          <label className="mt-4 block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="block text-[10px] font-medium text-slate-500">
              Mobile Number
            </span>
            <span className="mt-0.5 block text-xs font-medium text-slate-700">
              {mobileNumber}
            </span>
          </label>

          <label className="mt-3 block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="block text-[10px] font-medium text-slate-500">
              Job Type
            </span>
            <span className="mt-0.5 block text-xs font-medium text-slate-700">
              {jobType}
            </span>
          </label>
        </div>

        {/* CTA */}
        <div className="px-5 pb-6">
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-sm shadow-blue-600/30 transition-colors hover:bg-blue-700"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
