import type { JobPosting, JobStatus } from "@/lib/types/jobs";

const DAY_MS = 86_400_000;

const frequencyLabels: Record<string, string> = {
  hour: "hr",
  day: "day",
  month: "mo",
  year: "yr",
};

/**
 * The minimal slices each formatter needs. Anything shaped like a posting —
 * a `JobPosting` or an application's job snapshot — can be formatted with it.
 */
export type CompensationSource = Pick<
  JobPosting,
  "minSalary" | "maxSalary" | "frequency"
>;
export type LocationSource = Pick<JobPosting, "location" | "isRemote">;

function formatAmount(value: string) {
  const amount = Number(value);
  if (!value?.trim() || Number.isNaN(amount)) return null;
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `€${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return `€${value}`;
}

/** €25 – €40 / hr · €90k – €115k / yr · Not specified */
export function formatCompensation(job: CompensationSource) {
  const min = formatAmount(job?.minSalary);
  const max = formatAmount(job?.maxSalary);
  const unit = frequencyLabels[job?.frequency] ?? "/ per " + job?.frequency;
  if (min && max) return `${min} – ${max} / ${unit}`;
  if (min || max) return `${min ?? max} / ${unit}`;
  return "Not specified";
}

/** Remote (New York, USA) · London, UK · Location TBC */
export function formatLocation(job: LocationSource) {
  if (!job?.location?.trim()) return job?.isRemote ? "Remote" : "Location TBC";
  return job?.isRemote ? `Remote (${job?.location})` : job?.location;
}

/** Status is derived from the deadline — no extra field to keep in sync. */
export function getJobStatus(job: JobPosting): JobStatus {
  if (!job?.deadline) return "active";
  const today = new Date().toISOString().slice(0, 10);
  return job.deadline < today ? "expired" : "active";
}

/** May 30, 2026 · No deadline */
export function formatDate(iso: string) {
  if (!iso) return "No deadline";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Posted 2d ago · Posted 3w ago · Posted just now */
export function formatPosted(iso: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS),
  );
  if (days === 0) return "Posted just now";
  if (days < 7) return `Posted ${days}d ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}
