'use client'
import Link from "next/link";
import {
  Banknote,
  Briefcase,
  Building2,
  ChevronRight,
  Code2,
  Copy,
  Headphones,
  MapPin,
  Megaphone,
  MoreVertical,
  Palette,
  Pencil,
  Plus,
  Scale,
  Trash2,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { FormState } from "@/app/dashboard/recruiter/jobs/new/page";
import { getJobs } from "@/lib/actions/api/jobs";
import { useEffect, useState } from "react";
import { DeleteJobButton } from "@/app/components/deleteJobDialog";

/* ────────────────────────────────────────────────────────────
   Row model — everything the table shows is derived from the
   same shape the "New Job" form submits (FormState), plus a
   few listing-only fields (id, applicants, postedAt).
   ──────────────────────────────────────────────────────────── */
export type JobPosting = FormState & {
  _id: string;
  applicants: number;
  postedAt: string;
};

type JobStatus = "active" | "expired";

/* ── Dummy data (same fields the create-job form sends) ────── */

/* ── Formatting helpers ────────────────────────────────────── */
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

const frequencyLabels: Record<string, string> = {
  hour: "hr",
  day: "day",
  month: "mo",
  year: "yr",
};

function formatAmount(value: string) {
  const amount = Number(value);
  if (!value.trim() || Number.isNaN(amount)) return null;
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `€${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return `€${value}`;
}

function formatCompensation(job: JobPosting) {
  const min = formatAmount(job.minSalary);
  const max = formatAmount(job.maxSalary);
  const unit = frequencyLabels[job.frequency] ?? "/ per " + job.frequency;
  if (min && max) return `${min} – ${max} / ${unit}`;
  if (min || max) return `${min ?? max} / ${unit}`;
  return "Not specified";
}

function formatLocation(job: JobPosting) {
  if (!job.location.trim()) return job.isRemote ? "Remote" : "Location TBC";
  return job.isRemote ? `Remote (${job.location})` : job.location;
}

function getStatus(job: JobPosting): JobStatus {
  if (!job.deadline) return "active";
  const today = new Date().toISOString().slice(0, 10);
  return job.deadline < today ? "expired" : "active";
}

function formatDate(iso: string) {
  if (!iso) return "No deadline";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatPosted(iso: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86400000),
  );
  if (days === 0) return "Posted just now";
  if (days < 7) return `Posted ${days}d ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}

/* ── Small presentational pieces ───────────────────────────── */
function StatusBadge({ status }: { status: JobStatus }) {
  const active = status === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-zinc-500/15 text-zinc-400",
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

function TypeBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300">
      {children}
    </span>
  );
}

function MenuItem({
  onClick,
  danger,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-zinc-300 hover:bg-white/[0.07] hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function JobActions({
  job,
  className,
}: {
  job: JobPosting;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Link
        href={`/dashboard/recruiter/jobs/new?edit=${job._id}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-2.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/20"
      >
        <Pencil aria-hidden className="size-3.5" />
        Update
      </Link>
      <DeleteJobButton job={job}/>
    </div>
  );
}

/* ── Table row (desktop) ───────────────────────────────────── */
function JobTableRow({
  job,
}: {
  job: JobPosting;
}) {
  const status = getStatus(job);
  const Icon = categoryIcons[job.category] ?? Briefcase;

  return (
    <tr className="transition-colors hover:bg-white/[0.03]">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#14122b]"
          >
            <Icon className="size-4 text-violet-300" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">
              {job.title}
            </span>
            <span className="block truncate text-xs text-zinc-500">
              {job.category}
            </span>
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
          <Building2 aria-hidden className="size-3.5 shrink-0 text-zinc-500" />
          <span className="truncate">{job.company}</span>
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{formatLocation(job)}</span>
        </span>
      </td>

      <td className="px-4 py-3.5">
        <TypeBadge>{job.jobType}</TypeBadge>
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-300">
        {formatCompensation(job)}
      </td>

      <td className="whitespace-nowrap px-4 py-3.5">
        <span className="flex items-center gap-1.5 text-sm text-zinc-300">
          <Users aria-hidden className="size-4 text-zinc-500" />
          {job.applicants} {job.applicants === 1 ? "Candidate" : "Candidates"}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <StatusBadge status={status} />
      </td>

      <td className="whitespace-nowrap px-4 py-3.5">
        <span className="block text-sm text-zinc-200">
          {formatDate(job.deadline)}
        </span>
        <span className="mt-0.5 block text-xs text-zinc-600">
          {status === "expired" ? "Closed" : formatPosted(job.postedAt)}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <JobActions job={job} className="justify-end" />
      </td>
    </tr>
  );
}

/* ── Card (mobile) ─────────────────────────────────────────── */
function JobCard({
  job,
}: {
  job: JobPosting;
}) {
  const status = getStatus(job);
  const Icon = categoryIcons[job.category] ?? Briefcase;

  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#14122b]"
        >
          <Icon className="size-4 text-violet-300" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {job.title}
              </p>
              <p className="truncate text-xs text-zinc-500">{job.category}</p>
            </div>
            <StatusBadge status={status} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-zinc-200">
            <Building2
              aria-hidden
              className="size-3.5 shrink-0 text-zinc-500"
            />
            <span className="truncate">{job.company}</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{formatLocation(job)}</span>
          </p>
        </div>
      </div>

      <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/[0.06] pt-3.5">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Type
          </dt>
          <dd className="mt-1 text-sm text-zinc-200">{job.jobType}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Compensation
          </dt>
          <dd className="mt-1 text-sm text-zinc-200">
            {formatCompensation(job)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Applicants
          </dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-zinc-200">
            <Users aria-hidden className="size-3.5 text-zinc-500" />
            {job.applicants} {job.applicants === 1 ? "Candidate" : "Candidates"}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Deadline
          </dt>
          <dd className="mt-1 text-sm text-zinc-200">
            {formatDate(job.deadline)}
            <span className="mt-0.5 block text-xs text-zinc-600">
              {status === "expired" ? "Closed" : formatPosted(job.postedAt)}
            </span>
          </dd>
        </div>
      </dl>

      <JobActions job={job} className="mt-4" />
    </li>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
const tableHeaderCell =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500";

export default function JobPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  useEffect(() => {
    const data = async()=>{
      const job = await getJobs();
      setJobs(job);
    }
    data()
  }, []);


  // async function copyLink(job: JobPosting) {
  //   try {
  //     await navigator.clipboard.writeText(
  //       `${window.location.origin}/dashboard/recruiter/jobs?job=${job.id}`,
  //     );
  //     setCopiedId(job.id);
  //     window.setTimeout(() => setCopiedId(null), 2000);
  //   } catch {
  //     // Clipboard unavailable (e.g. insecure context) — silently ignore.
  //   }
  // }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Breadcrumb + header ─────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-zinc-500"
      >
        <span>Manage Jobs</span>
        <ChevronRight aria-hidden className="size-3" />
        <span className="text-zinc-400">Job Listings &amp; Postings</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            Manage Job Posts
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-zinc-500">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="group inline-flex h-10 items-center gap-2 rounded-lg bg-[#5C53FE] px-4 text-sm font-semibold text-white shadow-lg shadow-[#5C53FE]/25 transition-colors hover:bg-[#4b43e8]"
        >
          <Plus
            aria-hidden
            className="size-4 transition-transform group-hover:rotate-90"
          />
          New Job Post
        </Link>
      </div>

      {jobs.length === 0 ? (
        /* ── Empty state ────────────────────────────────── */
        <div className="mt-8 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <span
            aria-hidden
            className="mx-auto grid size-12 place-items-center rounded-full bg-[#5C53FE]/15"
          >
            <Briefcase className="size-5 text-violet-300" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-white">
            No job posts yet
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create your first listing to start receiving applications.
          </p>
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#5C53FE] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4b43e8]"
          >
            <Plus aria-hidden className="size-4" />
            Create Job Post
          </Link>
        </div>
      ) : (
        <>
          {/* ── Desktop: scrollable table ────────────────── */}
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th scope="col" className={tableHeaderCell}>
                      Job Title &amp; Dept
                    </th>
                    <th scope="col" className={tableHeaderCell}>
                      Company &amp; Location
                    </th>
                    <th scope="col" className={tableHeaderCell}>
                      Type
                    </th>
                    <th scope="col" className={tableHeaderCell}>
                      Compensation
                    </th>
                    <th scope="col" className={tableHeaderCell}>
                      Applicants
                    </th>
                    <th scope="col" className={tableHeaderCell}>
                      Status
                    </th>
                    <th scope="col" className={tableHeaderCell}>
                      Deadline
                    </th>
                    <th
                      scope="col"
                      className={cn(tableHeaderCell, "text-right")}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {jobs.map((job) => (
                    <JobTableRow
                      key={job._id}
                      job={job}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile: stacked cards ────────────────────── */}
          <ul className="mt-6 space-y-3 md:hidden">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                // copied={copiedId === job.id}
                // {...actionProps}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
