import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Ready to Grow Your Reviews?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
          Turn customer interactions into measurable review growth and
          understand how you compare with your competition.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
