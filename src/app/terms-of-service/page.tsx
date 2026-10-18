import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileCheck, Mail, Phone, MapPin, CheckCircle2, AlertTriangle, Scale, CreditCard } from "lucide-react";
import Footer from "@/share/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Grow More Reviews",
  description:
    "Read the terms, conditions, and user agreements for Nexora Automation Inc. (operating as Grow More Reviews).",
};

const COMPANY = {
  legalName: "Nexora Automation Inc.",
  tradeName: "Grow More Reviews",
  brandStatement:
    "Grow More Reviews is a product and operating brand of Nexora Automation Inc., an Alberta, Canada corporation.",
  email: "mehdi@growmorereviews.com",
  customerEmail: "mehdi@growmorereviews.com",
  supportEmail: "support@growmorereviews.com",
  edmontonOffice: {
    name: "Edmonton Office (HQ)",
    address: "First Edmonton Place, 10665 Jasper Ave, 14th Floor, Edmonton, AB T5J 3S9",
    phones: ["(780) 851-9353", "416 917 0776"],
  },
  torontoOffice: {
    name: "Toronto Office",
    address: "4711 Yonge Street 10th Floor, Toronto, ON, M2N 6K8, CAN",
    phones: ["416 917 0776"],
  },
  effectiveDate: "October 18, 2026",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "services", title: "2. Description of Services & NFC Hardware" },
  { id: "eligibility", title: "3. Account Registration & Security" },
  { id: "anti-spam", title: "4. Anti-Spam & Messaging Compliance (TCPA/CASL)" },
  { id: "review-ethics", title: "5. Review Guidelines & Google Policy" },
  { id: "billing", title: "6. Subscription, Billing & Cancellation" },
  { id: "nfc-hardware", title: "7. NFC Hardware Terms & Shipping" },
  { id: "ip-rights", title: "8. Intellectual Property" },
  { id: "disclaimers", title: "9. Third-Party Disclaimers (Google LLC)" },
  { id: "liability", title: "10. Limitation of Liability" },
  { id: "governing-law", title: "11. Governing Law & Jurisdiction" },
  { id: "contact", title: "12. Contact Information" },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo/logo.png"
                alt="Grow More Reviews"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
            <div className="hidden h-5 w-px bg-slate-200 md:block" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signIn"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Scale className="h-3.5 w-3.5" />
            Terms of Service
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Please read these terms carefully before utilizing our platform or hardware products.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
            <span><strong>Last Updated:</strong> {COMPANY.effectiveDate}</span>
            <span>•</span>
            <span><strong>Entity:</strong> {COMPANY.legalName} ({COMPANY.tradeName})</span>
            <span>•</span>
            <span><strong>Governing Region:</strong> Alberta, Canada</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </h2>
              <nav className="mt-4 flex flex-col space-y-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 hover:underline"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-500">
                  Questions regarding our terms?
                </p>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Document Content */}
          <main className="space-y-12 lg:col-span-8">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                1. Acceptance of Terms
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the websites, software applications, APIs, and physical products provided by <strong>{COMPANY.legalName}</strong>, doing business as <strong>{COMPANY.tradeName}</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
                </p>
                <p>
                  By creating an account, clicking &ldquo;Get Started&rdquo;, subscribing to a plan, purchasing NFC cards, or accessing the website, you agree to be bound by these Terms and our Privacy Policy. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="services" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                2. Description of Services & NFC Hardware
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  {COMPANY.tradeName} provides local businesses with tools to accelerate Google Review acquisition, measure review performance against local competitors, and streamline on-site customer engagement. Core features include:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>Automated Review Invites:</strong> Automated SMS and email invitation flows to invite recent verified clients to leave honest Google reviews.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>QuickSend:</strong> A streamlined web interface allowing frontline team members to submit client details in seconds without granting full dashboard access.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>NFC Tap Hardware:</strong> Contactless smart cards and display stands that open your verified Google review dialog with a single smartphone tap.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>Competitor Intelligence & Review Gap:</strong> Publicly benchmarked metrics tracking your monthly velocity versus nearby industry competitors.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="eligibility" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                3. Account Registration & Security
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  You must provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                </p>
                <p>
                  You agree to notify us immediately at <a href={`mailto:${COMPANY.email}`} className="text-blue-600 underline">{COMPANY.email}</a> upon becoming aware of any unauthorized use or breach of security regarding your account.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="anti-spam" className="scroll-mt-24 rounded-2xl border border-blue-200 bg-blue-50/50 p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  4. Anti-Spam & Messaging Compliance (TCPA & CASL)
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  As a user of our messaging features (including QuickSend and automated SMS campaigns), you agree to strictly comply with all relevant telecommunications and anti-spam legislation, including Canada&apos;s Anti-Spam Legislation (<strong>CASL</strong>) and the United States Telephone Consumer Protection Act (<strong>TCPA</strong>).
                </p>
                <div className="rounded-xl bg-white p-5 shadow-sm border border-blue-100 space-y-3">
                  <h3 className="font-semibold text-slate-900">Your Representations & Warranties:</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    <li>You have express consent or an existing commercial relationship with each customer before entering their phone number or email into the platform.</li>
                    <li>You will not purchase, rent, or scrape third-party phone lists to send unsolicited review requests.</li>
                    <li>You acknowledge that every SMS sent includes standard opt-out instructions (&ldquo;Reply STOP to unsubscribe&rdquo;). You will not attempt to override or bypass automated unsubscribe mechanisms.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="review-ethics" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  5. Review Guidelines & Google Policy Adherence
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  We are firmly committed to authentic, honest customer feedback. You agree to adhere strictly to Google&apos;s Maps User Generated Content Policy and FTC guidelines:
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <p><strong>No Review Gating:</strong> You may not selectively solicit positive reviews while preventing or discouraging unhappy customers from posting public reviews.</p>
                  <p><strong>No Incentivized or Fake Reviews:</strong> You may not offer money, discounts, gifts, or contest entries in exchange for Google reviews.</p>
                  <p><strong>Conflict of Interest:</strong> Employees, owners, and immediate associates may not write reviews for their own businesses.</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="billing" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  6. Subscription, Billing & Cancellation
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  <strong>Recurring Billing:</strong> Paid subscriptions are billed in advance on a recurring monthly or annual cycle via our secure payment gateway (Stripe).
                </p>
                <p>
                  <strong>Cancellation:</strong> You may cancel your subscription at any time directly through your dashboard settings. Upon cancellation, your subscription remains active until the end of the current billing cycle, with no additional charges.
                </p>
                <p>
                  <strong>Refunds:</strong> Subscription fees are non-refundable for partial months of service. If you believe you were charged in error, please contact support within 14 days of the charge.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="nfc-hardware" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                7. NFC Hardware Terms & Shipping
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  Physical NFC tap cards and display stands ordered through our platform are programmed to route customers to your verified review destination.
                </p>
                <p>
                  <strong>Defective Hardware Replacement:</strong> If an NFC card arrives defective or fails within 30 days of delivery under normal usage, we will replace it free of charge upon verification.
                </p>
                <p>
                  <strong>Shipping:</strong> We ship to addresses in Canada, the United States, and select international locations. Delivery estimates are subject to carrier timelines.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="ip-rights" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                8. Intellectual Property
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  The platform, its user interfaces, code, algorithms, and documentation are the exclusive intellectual property of {COMPANY.legalName}. We grant you a limited, non-exclusive, non-transferable license to use the software during your active subscription term.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="disclaimers" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                9. Third-Party Disclaimers (Google LLC)
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  Grow More Reviews is an independent reputation management platform. We are not affiliated with, endorsed by, or partnered with Google LLC, Google Maps, or Alphabet Inc.
                </p>
                <p>
                  Google retains sole discretion over its algorithms, search rankings, and review moderation. We do not and cannot guarantee specific increases in Google local pack search rankings or review retention, as reviews are moderated by Google&apos;s proprietary systems.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="liability" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                10. Limitation of Liability
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  To the maximum extent permitted by applicable law, in no event shall {COMPANY.legalName}, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, data, or goodwill) arising out of or related to your use of the platform.
                </p>
                <p>
                  Our total aggregate liability for any claims under these Terms shall not exceed the amount paid by you to the Company in the twelve (12) months preceding the claim.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="governing-law" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                11. Governing Law & Jurisdiction
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein, without regard to its conflict of law principles. Any legal suit or proceeding shall be instituted exclusively in the courts of Edmonton, Alberta.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="contact" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                12. Contact Information
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                {COMPANY.brandStatement} For questions regarding these Terms of Service or to contact management, reach us at:
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Edmonton Office */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Edmonton Office (HQ)
                    </span>
                    <span className="text-[11px] text-slate-500">Alberta</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {COMPANY.edmontonOffice.address}
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p>
                      <strong>Tel:</strong>{" "}
                      <a href="tel:+17808519353" className="text-blue-600 hover:underline">(780) 851-9353</a>{" "}
                      and{" "}
                      <a href="tel:+14169170776" className="text-blue-600 hover:underline">416 917 0776</a>
                    </p>
                  </div>
                </div>

                {/* Toronto Office */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Toronto Office
                    </span>
                    <span className="text-[11px] text-slate-500">Ontario</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {COMPANY.torontoOffice.address}
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p>
                      <strong>Tel:</strong>{" "}
                      <a href="tel:+14169170776" className="text-blue-600 hover:underline">416 917 0776</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500">Customer Service:</span>{" "}
                  <a href={`mailto:${COMPANY.customerEmail}`} className="font-semibold text-blue-600 hover:underline">
                    {COMPANY.customerEmail}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500">Technical Support:</span>{" "}
                  <a href={`mailto:${COMPANY.supportEmail}`} className="font-semibold text-blue-600 hover:underline">
                    {COMPANY.supportEmail}
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
