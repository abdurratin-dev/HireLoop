import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Big-number stat card used above tabular dashboards
 * (seeker applications, admin user management).
 */
export function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141416] p-4 sm:p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tracking-tight text-white",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  );
}
