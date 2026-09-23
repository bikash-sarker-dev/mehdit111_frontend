import { Mail, LineChart, Radar } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Mail,
    number: "01",
    title: "Customer List",
    description:
      "Organize customer information and track interactions, review requests, and activity in one place.",
  },
  {
    icon: Mail,
    number: "02",
    title: "Request Reviews",
    description:
      "Send customers review requests through SMS or Email after their service or job.",
  },
  {
    icon: LineChart,
    number: "03",
    title: "Track Review Growth",
    description:
      "Monitor Google review activity, requests, taps, and growth from one dashboard.",
  },
  {
    icon: Radar,
    number: "04",
    title: "Understand Your Competition",
    description:
      "AI identifies relevant local competitors and shows how your review growth compares.",
  },
];

export default function HowItWorks() {
  return (
    <section id="howToworks" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-blue-600">
            Simple Process
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How Review Growth AI Works
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" strokeWidth={2} />
                  </div>
                  <span className="select-none text-3xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
