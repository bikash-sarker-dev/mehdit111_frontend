import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Mail, Phone, MapPin, CheckCircle2, Lock, FileText, Bell } from "lucide-react";
import Footer from "@/share/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Grow More Reviews",
  description:
    "Learn how Nexora Automation Inc. (operating as Grow More Reviews) collects, uses, protects, and handles your personal information and customer review data.",
};

const COMPANY = {
  legalName: "Nexora Automation Inc.",
  tradeName: "Grow More Reviews",
  brandStatement:
    "Grow More Reviews is a product and operating brand of Nexora Automation Inc., an Alberta, Canada corporation.",
  email: "Mehdi@growmorereviews.com",
  customerEmail: "Mehdi@growmorereviews.com",
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
  { id: "introduction", title: "1. Introduction" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use-information", title: "3. How We Use Information" },
  { id: "review-invites-anti-spam", title: "4. Review Invites & Anti-Spam (TCPA / CASL)" },
  { id: "google-data-disclaimer", title: "5. Google Business Profile & Review Data" },
  { id: "sharing-disclosure", title: "6. Data Sharing & Third-Party Processors" },
  { id: "data-security", title: "7. Data Security & Storage" },
  { id: "retention-rights", title: "8. Data Retention & Your Rights" },
  { id: "cookies-tracking", title: "9. Cookies & Analytics" },
  { id: "contact-us", title: "10. Contact Us" },
];

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            Legal Documentation
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            How {COMPANY.legalName} collects, protects, and responsibly processes your data.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> {COMPANY.effectiveDate}</span>
            <span>•</span>
            <span><strong>Entity:</strong> {COMPANY.legalName} ({COMPANY.tradeName})</span>
            <span>•</span>
            <span><strong>Jurisdiction:</strong> Alberta, Canada</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Sidebar Table of Contents */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Table of Contents
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
                  Have questions about our privacy practices?
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
            <section id="introduction" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                1. Introduction
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  Welcome to <strong>{COMPANY.tradeName}</strong>, operated by <strong>{COMPANY.legalName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We provide reputation management software, Google review automation, NFC physical tap cards, QuickSend messaging tools, and competitor benchmarking services to local businesses.
                </p>
                <p>
                  This Privacy Policy describes our policies and practices regarding the collection, use, disclosure, and safeguarding of information when you visit our website, subscribe to our software services, utilize our NFC review products, or receive communications powered by our platform.
                </p>
                <p>
                  By accessing or using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with any terms of this policy, please do not use our services.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="information-we-collect" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                2. Information We Collect
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>We collect several categories of information to provide and improve our services:</p>
                
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900">A. Business Account Information</h3>
                  <p>
                    When you register for an account, subscribe to a plan, or order NFC cards, we collect your name, business name, physical business address, business phone number, email address, password hash, and billing information (processed securely through Stripe).
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900">B. Review Recipient / Customer Contact Details</h3>
                  <p>
                    When businesses use our Automated Review Requests, QuickSend, or customer upload features, the business provides customer contact details (such as customer name, phone number, and/or email address). We process this data strictly as a data processor on behalf of the business to dispatch the review request.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900">C. Google Business Profile & Public Review Data</h3>
                  <p>
                    To calculate your review growth metrics and competitor intelligence, we collect publicly accessible review data from Google Maps / Google Business Profiles, including aggregate star ratings, review counts, timestamps, and public reviewer text.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900">D. NFC Interaction & Tap Analytics</h3>
                  <p>
                    When a customer taps or scans an NFC card/stand, we record non-personally identifiable telemetry such as tap timestamp, approximate general region (via IP), and destination redirect status to display analytics on your dashboard.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-we-use-information" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                3. How We Use Information
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>We use the collected information for the following specific purposes:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>Fulfilling Review Campaigns:</strong> Sending SMS and email review invitations and follow-ups on behalf of registered businesses.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>Platform Analytics:</strong> Calculating Review Growth, Review Gap comparisons, and monthly review goals on your dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>NFC Provisioning:</strong> Programming and shipping customized NFC tap cards, key fobs, and display stands.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>Billing & Account Maintenance:</strong> Invoicing subscription plans, sending system alerts, and resolving customer support inquiries.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span><strong>Fraud Prevention & Legal Compliance:</strong> Detecting abuse, mitigating spam, and maintaining compliance with Canadian and international telecommunication laws.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="review-invites-anti-spam" className="scroll-mt-24 rounded-2xl border border-blue-200 bg-blue-50/50 p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <Bell className="h-5 w-5" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  4. Review Invites & Anti-Spam Compliance (TCPA & CASL)
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  We are deeply committed to ethical communication and strict anti-spam compliance under Canada&apos;s Anti-Spam Legislation (<strong>CASL</strong>) and the United States Telephone Consumer Protection Act (<strong>TCPA</strong>).
                </p>
                <div className="rounded-xl bg-white p-5 shadow-sm border border-blue-100 space-y-3">
                  <h3 className="font-semibold text-slate-900">Opt-Out & Unsubscribe Mechanisms</h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Every SMS review request sent through our system includes mandatory opt-out instructions (such as &ldquo;Reply STOP to unsubscribe&rdquo;). Any recipient who replies STOP is immediately and automatically blacklisted from future automated requests across that business account.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Businesses using QuickSend or automated campaigns warrant that they have obtained appropriate customer consent or have an existing business relationship with the recipient prior to initiating review invitations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="google-data-disclaimer" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                5. Google Business Profile & Review Data
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  Our platform connects to official Google APIs and publicly available Google Business Profile endpoints to retrieve rating metrics and review links.
                </p>
                <p>
                  <strong>No Review Gating:</strong> In accordance with Google&apos;s Customer Review Policies and FTC guidelines, our software does not gate reviews, filter negative reviews, or incentivize deceptive ratings. All review recipients are provided a direct, unrestricted link to submit honest feedback on Google.
                </p>
                <p className="text-xs text-slate-500">
                  Disclaimer: Grow More Reviews is an independent software application operated by Nexora Automation Inc. and is not affiliated with, endorsed by, or sponsored by Google LLC. Google and Google Maps are trademarks of Google LLC.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sharing-disclosure" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                6. Data Sharing & Third-Party Processors
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p className="font-medium text-slate-900">
                  We never sell, rent, or trade your personal data or your customer contact lists to advertisers or third-party marketers. Period.
                </p>
                <p>We disclose information only to vetted third-party service providers who assist us in operating our software:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>Telecommunications & SMS Gateways:</strong> Providers such as Twilio to transmit SMS invitations.</li>
                  <li><strong>Payment Processors:</strong> Stripe Inc. for PCI-compliant payment and subscription processing.</li>
                  <li><strong>Cloud Infrastructure:</strong> Secure cloud database and hosting providers located in North America.</li>
                  <li><strong>Legal Obligations:</strong> If required by law, subpoena, or lawful court order.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="data-security" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <Lock className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  7. Data Security & Storage
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  We implement robust technical and organizational security controls designed to protect your personal and business data from unauthorized access, alteration, or disclosure. All data transmissions are encrypted using Transport Layer Security (TLS 1.2+). Passwords are encrypted using industry-standard cryptographic hashing.
                </p>
                <p>
                  While no method of transmission over the Internet or electronic storage is 100% impenetrable, we continually evaluate and enhance our defenses to maintain the highest level of commercial security.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="retention-rights" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                8. Data Retention & Your Rights
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, provide our software service, and comply with legal retention requirements.
                </p>
                <p>
                  Under applicable Canadian privacy legislation (<strong>PIPEDA</strong>) and corresponding global laws, you have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Request access to the personal data we hold about you.</li>
                  <li>Request corrections to any incomplete or inaccurate data.</li>
                  <li>Request deletion of your account and associated contact databases.</li>
                  <li>Withdraw consent to communications at any time.</li>
                </ul>
                <p className="mt-2">
                  To exercise any of these rights, simply email us at <a href={`mailto:${COMPANY.email}`} className="text-blue-600 font-medium hover:underline">{COMPANY.email}</a>.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="cookies-tracking" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                9. Cookies & Analytics
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <p>
                  We use cookies and similar session tokens to remember your login state, secure your dashboard sessions, and analyze overall site performance. You can instruct your browser to refuse all cookies, although some parts of the dashboard may not function properly without essential session cookies.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="contact-us" className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold sm:text-2xl">
                  10. Contact Us
                </h2>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {COMPANY.brandStatement} If you have questions, feedback, or requests regarding this Privacy Policy, please reach out to our privacy officer:
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
