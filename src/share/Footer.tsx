import type { ReactNode } from "react";

interface FooterColumn {
  title: string;
  links: string[];
}

interface ContactItem {
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

const columns: FooterColumn[] = [
  {
    title: "Navigate",
    links: ["How It Works", "Features", "Pricing", "FAQ"],
  },
  {
    title: "Product",
    links: [
      "Automated Review Requests",
      "QuickSend",
      "NFC",
      "Review Gap",
      "AI Growth Report",
    ],
  },
  {
    title: "Account",
    links: ["Log In", "Get Started"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

const COMPANY = {
  legalName: "Nexora Automation Inc.",
  addressLines: [
    "250 Brookside Terrace NW",
    "Edmonton, Alberta T6H 4J6",
    "Canada",
  ],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=250+Brookside+Terrace+NW+Edmonton+Alberta+T6H+4J6+Canada",
  phoneDisplay: "+1 (416) 917-0776",
  phoneHref: "tel:+14169170776",
  email: "mehdi@growmorereviews.com",
};

const iconClass = "h-5 w-5";

const MapPinIcon = (
  <svg
    className={iconClass}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z"
    />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PhoneIcon = (
  <svg
    className={iconClass}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-1.8.9a11 11 0 005.52 5.52l.9-1.8a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
    />
  </svg>
);

const MailIcon = (
  <svg
    className={iconClass}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
  </svg>
);

const linkClass =
  "transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:underline";

const contactItems: ContactItem[] = [
  {
    label: "Registered Address",
    icon: MapPinIcon,
    content: (
      <a
        href={COMPANY.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`not-italic ${linkClass}`}
      >
        {COMPANY.addressLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </a>
    ),
  },
  {
    label: "Phone",
    icon: PhoneIcon,
    content: (
      <a href={COMPANY.phoneHref} className={linkClass}>
        {COMPANY.phoneDisplay}
      </a>
    ),
  },
  {
    label: "Email",
    icon: MailIcon,
    content: (
      <a href={`mailto:${COMPANY.email}`} className={`break-all ${linkClass}`}>
        {COMPANY.email}
      </a>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Logo + tagline */}
          <div className="lg:col-span-2">
            {/* Replace the src below with your own logo image */}
            <img
              src="/images/logo/logo.png"
              alt="Review Growth AI"
              className="h-14 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Review Growth + Reputation Management + Competitor Intelligence
              for local businesses.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">
                {column.title.toUpperCase()}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact / company information */}
        <div className="mt-12 border-t border-slate-800 pt-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500">
              CONTACT US
            </h3>
            <p className="text-sm font-medium text-slate-300">
              {COMPANY.legalName}
            </p>
          </div>

          <address className="mt-6 grid grid-cols-1 gap-4 not-italic sm:grid-cols-2 lg:grid-cols-3">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-5 transition-colors hover:border-slate-700 hover:bg-slate-800/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 ring-1 ring-slate-700">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-slate-500">
                    {item.label.toUpperCase()}
                  </p>
                  <div className="mt-1.5 text-sm leading-relaxed text-slate-300">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </address>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {COMPANY.legalName} All rights reserved.
          </p>
          <p>Review Growth · Reputation Management · Competitor Intelligence</p>
        </div>
      </div>
    </footer>
  );
}
