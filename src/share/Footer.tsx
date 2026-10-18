import Link from "next/link";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    title: "Navigate",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Automated Review Requests", href: "/#features" },
      { label: "QuickSend", href: "/#quicksend" },
      { label: "NFC", href: "/#how-it-works" },
      { label: "Review Gap", href: "/#review-gap" },
      { label: "AI Growth Report", href: "/#how-it-works" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log In", href: "/signIn" },
      { label: "Get Started", href: "/signup" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Logo + Brand Statement */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-90"
            >
              <img
                src="/images/logo/logo.png"
                alt="Grow More Reviews"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Grow More Reviews is a product and operating brand of{" "}
              <strong className="text-slate-300">Nexora Automation Inc.</strong>,
              an Alberta, Canada corporation.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Review Growth · Reputation Management · Competitor Intelligence
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">
                {column.title.toUpperCase()}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Offices Information */}
        <div className="mt-12 border-t border-slate-800 pt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500">
              CONTACT & OFFICE LOCATIONS
            </h3>
            <p className="text-xs text-slate-400">
              Customer Service:{" "}
              <a
                href="mailto:Mehdi@growmorereviews.com"
                className="text-blue-400 hover:underline"
              >
                Mehdi@growmorereviews.com
              </a>{" "}
              | Technical Support:{" "}
              <a
                href="mailto:support@growmorereviews.com"
                className="text-blue-400 hover:underline"
              >
                support@growmorereviews.com
              </a>
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Edmonton Office (HQ) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 transition-colors hover:border-slate-700 hover:bg-slate-800/60">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30">
                    <Building2 className="h-4 w-4" />
                  </span>
                  Edmonton Office (HQ)
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                  Alberta
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-sm text-slate-300">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=First+Edmonton+Place+10665+Jasper+Ave+14th+Floor+Edmonton+AB+T5J+3S9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-slate-300 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>
                    First Edmonton Place, 10665 Jasper Ave, 14th Floor,
                    <br />
                    Edmonton, AB T5J 3S9, Canada
                  </span>
                </a>

                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-400" />
                    Tel:{" "}
                    <a
                      href="tel:+17808519353"
                      className="font-medium text-slate-200 hover:text-white"
                    >
                      (780) 851-9353
                    </a>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-400" />
                    Tel:{" "}
                    <a
                      href="tel:+14169170776"
                      className="font-medium text-slate-200 hover:text-white"
                    >
                      416 917 0776
                    </a>
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800/80 pt-3 text-xs">
                  <div className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-400">Customer Service:</span>
                    <a
                      href="mailto:Mehdi@growmorereviews.com"
                      className="font-medium text-blue-400 hover:underline"
                    >
                      Mehdi@growmorereviews.com
                    </a>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-400">Technical Support:</span>
                    <a
                      href="mailto:support@growmorereviews.com"
                      className="font-medium text-blue-400 hover:underline"
                    >
                      support@growmorereviews.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Toronto Office */}
            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 transition-colors hover:border-slate-700 hover:bg-slate-800/60">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30">
                    <Building2 className="h-4 w-4" />
                  </span>
                  Toronto Office
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                  Ontario
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-sm text-slate-300">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=4711+Yonge+Street+10th+Floor+Toronto+ON+M2N+6K8+Canada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-slate-300 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>
                    4711 Yonge Street 10th Floor,
                    <br />
                    Toronto, ON, M2N 6K8, CAN
                  </span>
                </a>

                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-400" />
                    Tel:{" "}
                    <a
                      href="tel:+14169170776"
                      className="font-medium text-slate-200 hover:text-white"
                    >
                      416 917 0776
                    </a>
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800/80 pt-3 text-xs">
                  <div className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-400">Customer Service:</span>
                    <a
                      href="mailto:Mehdi@growmorereviews.com"
                      className="font-medium text-blue-400 hover:underline"
                    >
                      Mehdi@growmorereviews.com
                    </a>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-400">Technical Support:</span>
                    <a
                      href="mailto:support@growmorereviews.com"
                      className="font-medium text-blue-400 hover:underline"
                    >
                      support@growmorereviews.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 Nexora Automation Inc. | Grow More Reviews | All Rights Reserved</p>
          <p className="text-slate-500">
            Grow More Reviews is a product and operating brand of Nexora Automation Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
