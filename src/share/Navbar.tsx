// "use client";

// import { useState } from "react";
// import { Menu, X, ArrowRight } from "lucide-react";
// import Logo from "@/components/authencation/Logo";

// interface NavLink {
//   label: string;
//   href: string;
// }

// const navLinks: NavLink[] = [
//   { label: "Home", href: "/" },
//   { label: "How It Works", href: "#how-it-works" },
//   { label: "Features", href: "#features" },
//   { label: "Pricing", href: "#pricing" },
//   { label: "FAQ", href: "#faq" },
// ];

// interface NavbarProps {
//   activeHref?: string;
//   loginHref?: string;
//   getStartedHref?: string;
// }

// export default function Navbar({
//   activeHref = "/",
//   loginHref = "/login",
//   getStartedHref = "/signup",
// }: NavbarProps) {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="relative z-20">
//       <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
//         <a href="/" className="shrink-0">
//           <Logo width={150} priority />
//         </a>

//         {/* Desktop pill nav */}
//         <div className="hidden items-center gap-1 rounded-full bg-white/70 p-1.5 shadow-sm backdrop-blur-sm lg:flex">
//           {navLinks.map((link) => {
//             const isActive = link.href === activeHref;
//             return (
//               <a
//                 key={link.label}
//                 href={link.href}
//                 className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-sm"
//                     : "text-slate-700 hover:bg-white hover:text-slate-900"
//                 }`}
//               >
//                 {link.label}
//               </a>
//             );
//           })}
//         </div>

//         {/* Desktop actions */}
//         <div className="hidden items-center gap-5 lg:flex">
//           <a
//             href={loginHref}
//             className="text-sm font-medium text-slate-700 hover:text-slate-900"
//           >
//             Log In
//           </a>
//           <a
//             href={getStartedHref}
//             className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
//           >
//             Get Started
//           </a>
//         </div>

//         {/* Mobile toggle */}
//         <button
//           type="button"
//           onClick={() => setOpen((v) => !v)}
//           className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm lg:hidden"
//           aria-label={open ? "Close menu" : "Open menu"}
//           aria-expanded={open}
//         >
//           {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//         </button>
//       </nav>

//       {/* Mobile menu panel */}
//       {open && (
//         <div className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-lg lg:hidden">
//           <div className="flex flex-col gap-1">
//             {navLinks.map((link) => {
//               const isActive = link.href === activeHref;
//               return (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   onClick={() => setOpen(false)}
//                   className={`rounded-xl px-4 py-3 text-sm font-medium ${
//                     isActive
//                       ? "bg-blue-600 text-white"
//                       : "text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   {link.label}
//                 </a>
//               );
//             })}
//           </div>

//           <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
//             <a
//               href={loginHref}
//               className="rounded-xl px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
//             >
//               Log In
//             </a>
//             <a
//               href={getStartedHref}
//               className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
//             >
//               Get Started
//               <ArrowRight className="h-4 w-4" />
//             </a>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
"use client";

import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/authencation/Logo";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  activeHref?: string;
  loginHref?: string;
  getStartedHref?: string;
}

export default function Navbar({
  activeHref = "/",
  loginHref = "/login",
  getStartedHref = "/signup",
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <a href="/" className="shrink-0">
          <Logo width={150} priority />
        </a>

        {/* Desktop pill nav */}
        <div className="hidden items-center gap-1 rounded-full bg-white/70 p-1.5 shadow-sm backdrop-blur-sm lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === activeHref;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-white hover:text-slate-900"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={loginHref}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Log In
          </a>
          <a
            href={getStartedHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === activeHref;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
            <a
              href={loginHref}
              className="rounded-xl px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Log In
            </a>
            <a
              href={getStartedHref}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
