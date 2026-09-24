// components/DashboardOverview.tsx
// Single, self-contained dashboard component.
// Stack: React · Next.js (App Router or Pages) · Tailwind CSS · TypeScript
// No extra dependencies — icons and charts are inline SVG / CSS.
// No hooks, so it works as a Server Component or a Client Component.

/* ----------------------------- Types & data ----------------------------- */

type IconName = "users" | "click" | "wallet" | "userPlus" | "x";

type Stat = {
  label: string;
  value: string;
  change: string;
  icon: IconName;
  tone: "blue" | "red";
};

type Activity = {
  name: string;
  detail: string;
  status?: "Active" | "Trial";
};

const ICONS: Record<IconName, string[]> = {
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  click: [
    "M14 4.1 12 6",
    "m5.1 8-2.9-.8",
    "m6 12-1.9 2",
    "M7.2 2.2 8 5.1",
    "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
  ],
  wallet: [
    "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
    "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
  ],
  userPlus: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
    "M19 8v6",
    "M22 11h-6",
  ],
  x: ["M18 6 6 18", "m6 6 12 12"],
};

const STATS: Stat[] = [
  {
    label: "Total User",
    value: "74",
    change: "+12%",
    icon: "users",
    tone: "blue",
  },
  {
    label: "Active Subscriptions",
    value: "178",
    change: "+8%",
    icon: "click",
    tone: "blue",
  },
  {
    label: "Total Revenue",
    value: "$524,390",
    change: "+34%",
    icon: "wallet",
    tone: "blue",
  },
  {
    label: "New Subscribers",
    value: "13",
    change: "+12%",
    icon: "userPlus",
    tone: "blue",
  },
  {
    label: "Canceled",
    value: "13",
    change: "-2% vs last month",
    icon: "x",
    tone: "red",
  },
];

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

// Monthly recurring revenue (in $k)
const REVENUE = [13, 20, 25, 30, 33, 40, 47.5];
const REVENUE_MAX = 60;
const REVENUE_TICKS = [60, 45, 30, 15, 0];

// Subscribers per month
const ACTIVE = [18, 27, 35, 44, 52, 61, 75];
const CANCELLED = [2, 3, 2, 4, 3, 5, 4];
const SUBS_MAX = 80;
const SUBS_TICKS = [80, 60, 40, 20, 0];

// Plan distribution (drawn clockwise from 12 o'clock, in this order)
const PLANS = [
  { name: "Starter", count: 22, color: "#94a3b8" },
  { name: "Pro", count: 14, color: "#111827" },
  { name: "Growth", count: 38, color: "#2563eb" },
];
const LEGEND_ORDER = ["Starter", "Growth", "Pro"];

const NEW_USERS: Activity[] = [
  { name: "Apex Marketing Group", detail: "United States · Mar 3, 2025" },
  { name: "CloudScale Inc.", detail: "United Kingdom · Jan 18, 2025" },
  { name: "RetailPro Solutions", detail: "Canada · Sep 14, 2026" },
  { name: "BrightLocal Agency", detail: "Australia · Jun 7, 2025" },
  { name: "FinServe Corp", detail: "India · Feb 20, 2025" },
];

const RECENT: Activity[] = [
  {
    name: "Apex Marketing Group",
    detail: "Growth · Monthly · $99/mo",
    status: "Active",
  },
  {
    name: "CloudScale Inc.",
    detail: "Pro · Annual · $1,908/mo",
    status: "Active",
  },
  {
    name: "RetailPro Solutions",
    detail: "Starter · Monthly · $49/mo",
    status: "Trial",
  },
  {
    name: "BrightLocal Agency",
    detail: "Growth · Monthly · $99/mo",
    status: "Active",
  },
  {
    name: "FinServe Corp",
    detail: "Pro · Annual · $1,908/mo",
    status: "Active",
  },
];

const BADGE: Record<NonNullable<Activity["status"]>, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Trial: "border-blue-200 bg-blue-50 text-blue-700",
};

/* ------------------------------ Chart helpers ---------------------------- */

// Smooth curve through points (Catmull-Rom → cubic Bézier), coordinates in a 0–100 box.
function smoothPath(pts: [number, number][]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const CARD = "rounded-2xl border border-slate-200/80 bg-white";

/* -------------------------------- Component ------------------------------ */

export default function DashboardOverviewAdmin({
  businessName = "Bella's Cafe",
}: {
  businessName?: string;
}) {
  // Revenue area chart
  const points: [number, number][] = REVENUE.map((v, i) => [
    (i / (REVENUE.length - 1)) * 100,
    100 - (v / REVENUE_MAX) * 100,
  ]);
  const line = smoothPath(points);
  const area = `${line} L100,100 L0,100 Z`;

  // Donut chart
  const R = 42;
  const C = 2 * Math.PI * R;
  const GAP = 1.6;
  const total = PLANS.reduce((sum, p) => sum + p.count, 0);
  let offset = 0;
  const segments = PLANS.map((p) => {
    const len = (p.count / total) * C;
    const seg = {
      ...p,
      dash: `${Math.max(len - GAP, 0)} ${C - Math.max(len - GAP, 0)}`,
      offset: -offset,
    };
    offset += len;
    return seg;
  });

  return (
    <div className="min-h-screen w-full font-sans text-slate-900 antialiased">
      <div className="mx-auto flex w-full flex-col gap-4 sm:gap-6">
        {/* Header */}
        <header>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Good morning, {businessName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Here&apos;s how your review growth is performing — Last 30 Days.
          </p>
        </header>

        {/* Stat cards */}
        <section
          aria-label="Key metrics"
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6"
        >
          {STATS.map((s) => (
            <article key={s.label} className={`${CARD} p-4 sm:p-5`}>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-white sm:h-10 sm:w-10 ${
                  s.tone === "red" ? "bg-red-600" : "bg-[#175cff]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICONS[s.icon].map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </div>
              <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight sm:mt-4 sm:text-[28px]">
                {s.value}
              </p>
              <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                {s.label}
              </p>
              <p className="mt-2 text-xs text-green-600">{s.change}</p>
            </article>
          ))}
        </section>

        {/* Revenue + Plan distribution */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.75fr_1fr]">
          {/* Revenue growth */}
          <article className={`${CARD} p-4 sm:p-6`}>
            <h2 className="text-[15px] font-medium">Revenue Growth</h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Monthly recurring revenue — 2026
            </p>

            <div
              className="mt-5 flex gap-3"
              role="img"
              aria-label={`Monthly recurring revenue rising from $${REVENUE[0]}k in ${MONTHS[0]} to $${REVENUE[REVENUE.length - 1]}k in ${MONTHS[MONTHS.length - 1]}`}
            >
              <div className="relative h-44 w-9 shrink-0 text-xs text-slate-400 sm:h-56">
                {REVENUE_TICKS.map((t) => (
                  <span
                    key={t}
                    className="absolute right-0 -translate-y-1/2 tabular-nums"
                    style={{ top: `${100 - (t / REVENUE_MAX) * 100}%` }}
                  >
                    ${t}k
                  </span>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <div className="relative h-44 sm:h-56">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity="0.12"
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    {REVENUE_TICKS.map((t) => (
                      <line
                        key={`h${t}`}
                        x1="0"
                        x2="100"
                        y1={100 - (t / REVENUE_MAX) * 100}
                        y2={100 - (t / REVENUE_MAX) * 100}
                        stroke="#e2e8f0"
                        strokeOpacity="0.7"
                        strokeDasharray="3 3"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {MONTHS.map((m, i) => (
                      <line
                        key={`v${m}`}
                        x1={(i / (MONTHS.length - 1)) * 100}
                        x2={(i / (MONTHS.length - 1)) * 100}
                        y1="0"
                        y2="100"
                        stroke="#e2e8f0"
                        strokeOpacity="0.7"
                        strokeDasharray="3 3"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    <path d={area} fill="url(#rev-fill)" />
                    <path
                      d={line}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-400">
                  {MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Plan distribution */}
          <article className={`${CARD} p-4 sm:p-6`}>
            <h2 className="text-[15px] font-medium">Plan Distribution</h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Active subscribers by plan
            </p>

            <div className="mx-auto mt-6 flex w-full max-w-[240px] flex-col items-center">
              <svg
                viewBox="0 0 100 100"
                className="h-36 w-36 sm:h-40 sm:w-40"
                role="img"
                aria-label={`Plan distribution: ${PLANS.map((p) => `${p.name} ${p.count}`).join(", ")}`}
              >
                <g transform="rotate(-90 50 50)">
                  {segments.map((s) => (
                    <circle
                      key={s.name}
                      cx="50"
                      cy="50"
                      r={R}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="15"
                      strokeDasharray={s.dash}
                      strokeDashoffset={s.offset}
                    />
                  ))}
                </g>
              </svg>

              <ul className="mt-6 w-full space-y-2.5 text-[13px]">
                {LEGEND_ORDER.map((name) => {
                  const plan = PLANS.find((p) => p.name === name)!;
                  return (
                    <li
                      key={name}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5 text-slate-500">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: plan.color }}
                          aria-hidden="true"
                        />
                        {name}
                      </span>
                      <span className="font-semibold tabular-nums text-slate-900">
                        {plan.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>
        </section>

        {/* Subscription growth */}
        <section className={`${CARD} p-4 sm:p-6`}>
          <h2 className="text-[15px] font-medium">Subscription Growth</h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Active vs. cancelled subscribers per month
          </p>

          <div
            className="mt-5 flex gap-3"
            role="img"
            aria-label={`Active and cancelled subscribers per month, ${MONTHS[0]} to ${MONTHS[MONTHS.length - 1]}. Active grew from ${ACTIVE[0]} to ${ACTIVE[ACTIVE.length - 1]}.`}
          >
            <div className="relative h-44 w-6 shrink-0 text-xs text-slate-400 sm:h-56">
              {SUBS_TICKS.map((t) => (
                <span
                  key={t}
                  className="absolute right-0 -translate-y-1/2 tabular-nums"
                  style={{ top: `${100 - (t / SUBS_MAX) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div className="relative h-44 sm:h-56">
                {SUBS_TICKS.map((t) => (
                  <div
                    key={t}
                    className="absolute inset-x-0 border-t border-dashed border-slate-200/70"
                    style={{ top: `${100 - (t / SUBS_MAX) * 100}%` }}
                  />
                ))}
                <div className="absolute inset-0 flex">
                  {MONTHS.map((m, i) => (
                    <div
                      key={m}
                      className="flex h-full flex-1 items-end justify-center gap-0.5 border-l border-dashed border-slate-200/70 last:border-r sm:gap-1"
                    >
                      <div
                        className="w-3 rounded-t-md bg-blue-600 sm:w-5 lg:w-6"
                        style={{ height: `${(ACTIVE[i] / SUBS_MAX) * 100}%` }}
                      />
                      <div
                        className="w-3 rounded-t-sm bg-red-300 sm:w-5 lg:w-6"
                        style={{
                          height: `${(CANCELLED[i] / SUBS_MAX) * 100}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex text-xs text-slate-400">
                {MONTHS.map((m) => (
                  <span key={m} className="flex-1 text-center">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lists */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* New registered users */}
          <article className={CARD}>
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-[15px] font-medium">New Registered User</h2>
              <a
                href="#"
                className="rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                View all
              </a>
            </div>
            <ul>
              {NEW_USERS.map((u) => (
                <li
                  key={u.name}
                  className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[13px] font-medium text-slate-600"
                    aria-hidden="true"
                  >
                    {u.name[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-slate-900">
                      {u.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {u.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Recent subscription activity */}
          <article className={CARD}>
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-[15px] font-medium">
                Recent Subscription Activity
              </h2>
              <a
                href="#"
                className="shrink-0 rounded text-[13px] font-medium text-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                View all
              </a>
            </div>
            <ul>
              {RECENT.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-slate-900">
                      {r.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {r.detail}
                    </p>
                  </div>
                  {r.status && (
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE[r.status]}`}
                    >
                      {r.status}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
