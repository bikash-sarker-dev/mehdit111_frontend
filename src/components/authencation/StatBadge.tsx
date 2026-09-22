import type { ReactNode } from "react";

interface StatBadgeProps {
  icon: ReactNode;
  value: string;
  label: string;
}

export default function StatBadge({ icon, value, label }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-sm">
      <span className="shrink-0">{icon}</span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-slate-900">{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}
