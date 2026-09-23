interface FooterColumn {
  title: string;
  links: string[];
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

export default function Footer() {
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© Review Growth AI. All rights reserved.</p>
          <p>Review Growth · Reputation Management · Competitor Intelligence</p>
        </div>
      </div>
    </footer>
  );
}
