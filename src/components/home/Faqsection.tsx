"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Review Growth AI?",
    answer:
      "Review Growth AI is a platform that helps local businesses collect more Google reviews, track their review activity in one dashboard, and see how their growth compares to nearby competitors.",
  },
  {
    question: "How does the review request process work?",
    answer:
      "Add a customer after a job or visit, and we send them a review request by SMS or email. You can track every request, tap, and completed review from your dashboard.",
  },
  {
    question: "What is QuickSend?",
    answer:
      "QuickSend is a shareable link you give to staff members. After finishing a job, they submit the customer's details and a review request is sent automatically — no dashboard login needed.",
  },
  {
    question: "How does NFC review tracking work?",
    answer:
      "Tap-enabled NFC cards or stands let customers open your review page instantly with their phone. Every tap is logged so you can see exactly how many reviews come from in-person prompts.",
  },
  {
    question: "How does competitor monitoring work?",
    answer:
      "Our AI identifies relevant local competitors in your industry and area, then tracks their review counts and growth rate alongside yours so you always know where you stand.",
  },
  {
    question: "What is the Review Gap?",
    answer:
      "The Review Gap compares your monthly new-review count against the average of your tracked competitors, answering one question: are you growing faster or slower than them?",
  },
  {
    question: "What is included in the Growth plan?",
    answer:
      "The Growth plan includes QuickSend, NFC review collection, QR code tracking, monitoring for 5 competitors, the Advanced Review Gap, a monthly AI Growth Report, CSV upload, and 300 review requests per month.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold text-blue-600">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-3 sm:mt-14">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {faq.question}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500">
                    <Plus
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                      strokeWidth={2.5}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-500 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
