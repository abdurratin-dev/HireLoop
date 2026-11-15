"use client";

import { ChevronDown } from "lucide-react";
import {
  STATUS_META,
  type ApplicationStatus,
} from "@/lib/types/applications";
import { cn } from "@/lib/utils";

/** Every status, in pipeline order — also the dropdown's option order. */
export const STATUS_OPTIONS: ApplicationStatus[] = [
  "applied",
  "review",
  "interview",
  "shortlisted",
  "offered",
  "rejected",
];

/**
 * Controlled dropdown for moving an applicant through the pipeline.
 * Renders the current status in its STATUS_META color with a matching dot;
 * persistence is the caller's job (`onChange` fires with the new status).
 */
export function StatusSelect({
  value,
  onChange,
  className,
  disabled,
}: {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  className?: string;
  disabled?: boolean;
}) {
  const meta = STATUS_META[value] ?? STATUS_META.applied;

  return (
    <span className={cn("relative inline-flex", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 size-2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <select
        aria-label="Application status"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value as ApplicationStatus)
        }
        className="h-8 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/[0.04] py-1 pl-7 pr-8 text-xs font-medium outline-none transition-colors hover:border-white/25 focus-visible:border-violet-500/60 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ color: meta.color }}
      >
        {STATUS_OPTIONS.map((status) => {
          const option = STATUS_META[status];
          return (
            <option
              key={status}
              value={status}
              style={{ color: option.color, backgroundColor: "#141416" }}
            >
              {option.label}
            </option>
          );
        })}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500"
      />
    </span>
  );
}
