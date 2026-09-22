import { Check, ArrowRight } from "lucide-react";
import PhoneMockup from "./Phonemockup";

const flow = [
  { title: "Business", description: "Shares QuickSend link" },
  { title: "Staff Member", description: "Submits customer info" },
  { title: "Review Request", description: "Sent automatically" },
];

export default function QuickSend() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <div>
            <span className="text-sm font-semibold text-blue-600">
              QuickSend
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              QuickSend Makes Review Requests Simple
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              A business owner shares a QuickSend link with a staff member.
              After completing a job, the staff member submits customer details
              — the review request is sent automatically. No dashboard access
              required.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {flow.map((step, i) => (
                <div key={step.title} className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                  {i < flow.length - 1 && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              <Check className="h-4 w-4" />
              Available on Growth plan
            </div>
          </div>

          {/* Phones */}
          <div className="relative flex justify-center py-6 lg:justify-end lg:py-0">
            <div className="hidden sm:block sm:-translate-y-4 sm:translate-x-6 sm:opacity-90">
              <PhoneMockup buttonLabel="Work has been started" />
            </div>
            <div className="sm:absolute sm:bottom-0 sm:right-0 lg:right-4">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
