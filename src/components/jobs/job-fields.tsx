import type { ReactNode } from "react";
import {
  Banknote,
  Briefcase,
  Building2,
  Code2,
  Headphones,
  MapPin,
  Megaphone,
  Palette,
  Scale,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobPosting } from "@/lib/types/jobs";
import {
  formatDate,
  formatLocation,
  formatPosted,
  getJobStatus,
} from "./format";

/**
 * Small presentational pieces shared by the desktop table row and the
 * mobile card, so a job looks identical in both layouts.
 * Every component accepts an optional `className` for layout-only tweaks.
 */

const categoryIcons: Record<string, LucideIcon> = {
  "Engineering & Tech": Code2,
  "Design & Creative": Palette,
  "Marketing & Growth": Megaphone,
  "Sales & Business Development": TrendingUp,
  "Finance & Accounting": Banknote,
  "Customer Support": Headphones,
  "Human Resources": Users,
  "Operations & Legal": Scale,
};

/** Rounded icon tile representing the job's category. */
export function JobIconTile({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = categoryIcons[category] ?? Briefcase;
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#14122b]",
        className,
      )}
    >
      <Icon className="size-4 text-violet-300" />
    </span>
  );
}

/** Job title + department/category, truncated to one line each. */
export function JobTitleBlock({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  return (
    <span className={cn("min-w-0", className)}>
      <span className="block truncate text-sm font-semibold text-white">
        {job.title}
      </span>
      <span className="block truncate text-xs text-zinc-500">
        {job.category}
      </span>
    </span>
  );
}

export function TypeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300">
      {children}
    </span>
  );
}

/** Active / Expired pill — status is derived from the deadline. */
export function JobStatusBadge({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  const active = getJobStatus(job) === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-zinc-500/15 text-zinc-400",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-400" : "bg-zinc-500",
        )}
      />
      {active ? "Active" : "Expired"}
    </span>
  );
}

export function CompanyLine({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium text-zinc-200",
        className,
      )}
    >
      <Building2 aria-hidden className="size-3.5 shrink-0 text-zinc-500" />
      <span className="truncate">{job.company}</span>
    </span>
  );
}

export function LocationLine({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs text-zinc-500",
        className,
      )}
    >
      <MapPin aria-hidden className="size-3.5 shrink-0" />
      <span className="truncate">{formatLocation(job)}</span>
    </span>
  );
}

export function ApplicantsCount({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm text-zinc-300",
        className,
      )}
    >
      <Users aria-hidden className="size-4 text-zinc-500" />
      {job.applicants} {job.applicants === 1 ? "Candidate" : "Candidates"}
    </span>
  );
}

/** Deadline date with "Posted … ago" (or "Closed" once expired) beneath it. */
export function DeadlineMeta({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  const expired = getJobStatus(job) === "expired";
  return (
    <span className={cn("block", className)}>
      <span className="block text-sm text-zinc-200">
        {formatDate(job.deadline)}
      </span>
      <span className="mt-0.5 block text-xs text-zinc-600">
        {expired ? "Closed" : formatPosted(job.postedAt)}
      </span>
    </span>
  );
}

/** Label + value pair used by the mobile card's `<dl>` grid. */
export function CardField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-200">{children}</dd>
    </div>
  );
}
