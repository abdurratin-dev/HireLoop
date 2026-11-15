import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Label + value pair (`dt`/`dd`) for detail lists.
 * Shared by the seeker applications dialog, the recruiter applicant
 * dialog, and the admin user dialog so all three stay consistent.
 */
export function Detail({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm text-zinc-200">{children}</dd>
    </div>
  );
}
