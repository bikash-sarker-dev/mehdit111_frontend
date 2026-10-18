"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  LifeBuoy,
  Wrench,
  UserCheck,
  Send,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const OFFICES = [
  {
    city: "Edmonton (HQ)",
    province: "Alberta",
    address: "First Edmonton Place, 10665 Jasper Ave, 14th Floor, Edmonton, AB T5J 3S9",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=First+Edmonton+Place+10665+Jasper+Ave+14th+Floor+Edmonton+AB+T5J+3S9",
    phones: [
      { display: "(780) 851-9353", href: "tel:+17808519353" },
      { display: "416 917 0776", href: "tel:+14169170776" },
    ],
  },
  {
    city: "Toronto Office",
    province: "Ontario",
    address: "4711 Yonge Street 10th Floor, Toronto, ON, M2N 6K8, CAN",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=4711+Yonge+Street+10th+Floor+Toronto+ON+M2N+6K8+Canada",
    phones: [{ display: "416 917 0776", href: "tel:+14169170776" }],
  },
];

const FAQS = [
  {
    q: "How does the NFC Google Review card work?",
    a: "Your physical NFC card is programmed with your verified Google review link. When a customer taps the back of their smartphone against the card or scans the QR code on the back, their phone instantly opens the 5-star review submission dialog in Google Maps.",
  },
  {
    q: "How does QuickSend work for staff members?",
    a: "QuickSend gives your frontline staff a clean, single-screen link to enter a customer's name and mobile number right after completing a service. The system automatically sends an SMS review request. Staff members do not need dashboard logins.",
  },
  {
    q: "What should I do if an NFC card isn't scanning on an iPhone or Android?",
    a: "On iPhones (iPhone XS and newer), the NFC reader is located at the top edge of the back of the phone. On Android phones, the NFC reader is usually in the center of the back and NFC must be toggled on in the phone's quick settings.",
  },
  {
    q: "How do I upgrade or change my subscription plan?",
    a: "Navigate to 'Plan & Billing' on the left sidebar to view available tiers, manage your active subscription, or request custom enterprise quotas.",
  },
  {
    q: "How often is Competitor Intelligence updated?",
    a: "Competitor review counts, ratings, and velocity metrics are refreshed regularly from Google Business Profile endpoints to ensure your monthly benchmarks remain accurate.",
  },
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Technical Support",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;

    // Launch email client with pre-filled content to ensure immediate delivery
    const targetEmail =
      form.category === "Technical Support"
        ? "support@growmorereviews.com"
        : "mehdi@growmorereviews.com";

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
      `[${form.category}] ${form.subject || "Support Inquiry"}`
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCategory: ${form.category}\n\nMessage:\n${form.message}`
    )}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400">
              <LifeBuoy className="h-3.5 w-3.5" />
              Customer & Technical Assistance
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Help & Support Center
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Need assistance with your review campaigns, NFC cards, or account settings? Our team is here to assist you.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Support Hours: Mon – Fri, 9 AM – 6 PM EST</span>
          </div>
        </div>
      </div>

      {/* Main Support Channels */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Technical Support */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#0b1727]">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Wrench className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Technical Support
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              For technical inquiries, bug reports, NFC card programming, or system integrations.
            </p>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Support Email
              </span>
              <a
                href="mailto:support@growmorereviews.com"
                className="mt-0.5 block break-all text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                support@growmorereviews.com
              </a>
            </div>
          </div>

          <a
            href="mailto:support@growmorereviews.com?subject=Technical%20Support%20Request"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Mail className="h-3.5 w-3.5" />
            Email Technical Support
          </a>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#0b1727]">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <UserCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Customer Service
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              For account administration, subscription plans, custom orders, and business consultations.
            </p>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Customer Representative
              </span>
              <a
                href="mailto:mehdi@growmorereviews.com"
                className="mt-0.5 block break-all text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                mehdi@growmorereviews.com
              </a>
            </div>
          </div>

          <a
            href="mailto:mehdi@growmorereviews.com?subject=Customer%20Service%20Inquiry"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Mail className="h-3.5 w-3.5" />
            Email Customer Service
          </a>
        </div>

        {/* Direct Phone Lines */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#0b1727]">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Direct Phone Support
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Call our team directly during business hours for urgent assistance.
            </p>
            <div className="mt-4 space-y-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="text-[11px] font-medium text-slate-400">Edmonton HQ:</span>{" "}
                <a
                  href="tel:+17808519353"
                  className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white"
                >
                  (780) 851-9353
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
                <span className="text-[11px] font-medium text-slate-400">Toronto / Direct:</span>{" "}
                <a
                  href="tel:+14169170776"
                  className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white"
                >
                  416 917 0776
                </a>
              </div>
            </div>
          </div>

          <a
            href="tel:+14169170776"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Phone className="h-3.5 w-3.5 text-indigo-500" />
            Call (416) 917-0776
          </a>
        </div>
      </div>

      {/* Office Locations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Corporate Office Locations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nexora Automation Inc. operates from official offices in Alberta and Ontario.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400">Canada</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {OFFICES.map((office) => (
            <div
              key={office.city}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {office.city}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                    {office.province}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{office.address}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-500">Phone:</span>
                  {office.phones.map((p) => (
                    <a
                      key={p.display}
                      href={p.href}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href={office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Contact Form & FAQ Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Support Request Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-8 lg:col-span-7">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Send a Support Message
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Submit your message and we&apos;ll route it directly to the appropriate team member.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <CheckCircle className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              <h3 className="mt-3 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Message Prepared for Dispatch
              </h3>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                Your email client was opened with your support request. You can also reach us directly at{" "}
                <strong>support@growmorereviews.com</strong> or <strong>mehdi@growmorereviews.com</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-semibold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Bella Shop"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@business.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Inquiry Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                  >
                    <option value="Technical Support">Technical Support (support@)</option>
                    <option value="Customer Service">Customer Service (Mehdi@)</option>
                    <option value="NFC Card Hardware">NFC Card & Hardware Inquiries</option>
                    <option value="Billing & Plans">Billing & Plan Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of request"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can our technical or customer support team help you today?"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch Support Request
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1727] sm:p-8 lg:col-span-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Quick solutions to common questions.
          </p>

          <div className="mt-6 space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 p-3.5 text-left text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200/60 p-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Corporate Branding Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        <p className="font-medium text-slate-700 dark:text-slate-300">
          Grow More Reviews is a product and operating brand of Nexora Automation Inc., an Alberta, Canada corporation.
        </p>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          © 2026 Nexora Automation Inc. | Grow More Reviews | All Rights Reserved
        </p>
      </div>
    </div>
  );
}
