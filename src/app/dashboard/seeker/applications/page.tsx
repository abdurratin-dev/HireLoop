"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobIconTile } from "@/components/jobs/job-fields";
import {
  formatDate,
  formatCompensation,
  formatLocation,
} from "@/components/jobs/format";
import type { JobPosting } from "@/lib/types/jobs";
import {
  STATUS_META,
  type ApplicationRow,
  type ApplicationStatus,
} from "@/lib/types/applications";
import { cn } from "@/lib/utils";

/* ── Formatting ──────────────────────────────────────────── */

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** "Just now" · "2 hours ago" · "4 days ago" · "1 week ago" · "2 months ago" */
function formatRelativeTime(iso: string) {
  const elapsed = Math.max(0, Date.now() - new Date(iso).getTime());
  const ago = (value: number, unit: string) =>
    `${value} ${unit}${value === 1 ? "" : "s"} ago`;
  if (elapsed < MINUTE_MS) return "Just now";
  if (elapsed < HOUR_MS) return ago(Math.floor(elapsed / MINUTE_MS), "minute");
  if (elapsed < DAY_MS) return ago(Math.floor(elapsed / HOUR_MS), "hour");
  if (elapsed < 7 * DAY_MS) return ago(Math.floor(elapsed / DAY_MS), "day");
  if (elapsed < 30 * DAY_MS)
    return ago(Math.floor(elapsed / (7 * DAY_MS)), "week");
  return ago(Math.floor(elapsed / (30 * DAY_MS)), "month");
}

/** "Full-time • Remote" — the line under the job title. */
function arrangementOf(app: ApplicationRow) {
  // `arrangement` was added after the first documents were stored, so fall
  // back to deriving it from the job's remote flag.
  return app.arrangement || (app.isRemote ? "Remote" : "On-site");
}

/** The job snapshot fields the shared formatters consume. */
function jobSnapshot(app: ApplicationRow) {
  return {
    location: app.location,
    isRemote: app.isRemote,
    minSalary: app.minSalary,
    maxSalary: app.maxSalary,
    frequency: app.frequency,
  } satisfies Pick<
    JobPosting,
    "location" | "isRemote" | "minSalary" | "maxSalary" | "frequency"
  >;
}

/* ── Presentational pieces ───────────────────────────────── */

function StatusPill({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.applied;
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color: meta.color, backgroundColor: `${meta.color}1F` }}
    >
      {meta.label}
    </span>
  );
}

function StatCard({
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

const headerCell = "px-4 py-3 text-left text-xs font-medium text-zinc-500";

function ApplicationTableRow({
  app,
  onDetails,
}: {
  app: ApplicationRow;
  onDetails: (app: ApplicationRow) => void;
}) {
  return (
    <tr className="transition-colors hover:bg-white/[0.03]">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <JobIconTile category={app.category} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">
              {app.jobTitle}
            </span>
            <span className="block truncate text-xs text-zinc-500">
              {app.jobType} • {arrangementOf(app)}
            </span>
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5 text-sm text-zinc-300">
        <span className="block truncate">{app.companyName}</span>
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-400">
        <time dateTime={app.appliedAt} suppressHydrationWarning>
          {formatRelativeTime(app.appliedAt)}
        </time>
      </td>

      <td className="px-4 py-3.5">
        <StatusPill status={app.status} />
      </td>

      <td className="px-4 py-3.5 text-right">
        <button
          type="button"
          onClick={() => onDetails(app)}
          className="text-sm font-medium text-white transition-colors underline-offset-4 hover:underline"
        >
          Details
        </button>
      </td>
    </tr>
  );
}

function ApplicationCard({
  app,
  onDetails,
}: {
  app: ApplicationRow;
  onDetails: (app: ApplicationRow) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <JobIconTile category={app.category} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">
            {app.jobTitle}
          </span>
          <span className="block truncate text-xs text-zinc-500">
            {app.jobType} • {arrangementOf(app)}
          </span>
        </span>
        <StatusPill status={app.status} />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-zinc-300">{app.companyName}</span>
        <time
          dateTime={app.appliedAt}
          className="shrink-0 text-zinc-500"
          suppressHydrationWarning
        >
          {formatRelativeTime(app.appliedAt)}
        </time>
      </div>

      <button
        type="button"
        onClick={() => onDetails(app)}
        className="self-start text-sm font-medium text-white underline-offset-4 hover:underline"
      >
        Details
      </button>
    </div>
  );
}

function Detail({
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
      <dt className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm text-zinc-200">{children}</dd>
    </div>
  );
}

/* ── Dummy data ──────────────────────────────────────────── */
//
// TODO: swap for the real API once loading is wired up —
//   const { data: session } = authClient.useSession();
//   const rows = await getApplications(`userId=${session?.user.id}`);
// The fields below are exactly what `POST /applications` stores.

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * HOUR_MS).toISOString();

type Seed = {
  jobTitle: string;
  companyName: string;
  category: string;
  jobType: string;
  arrangement: string;
  appliedAt: string;
  status: ApplicationStatus;
  archived?: boolean;
  location?: string;
  minSalary?: string;
  maxSalary?: string;
  frequency?: string;
  deadline?: string;
};

function seedApplication(seed: Seed, index: number): ApplicationRow {
  return {
    _id: `seed-application-${index + 1}`,
    jobId: `seed-job-${index + 1}`,
    userId: "seed-user-id",
    email: "you@hireloop.dev",
    jobTitle: seed.jobTitle,
    companyName: seed.companyName,
    category: seed.category,
    jobType: seed.jobType,
    arrangement: seed.arrangement,
    isRemote: seed.arrangement === "Remote",
    location: seed.location ?? "Berlin, Germany",
    minSalary: seed.minSalary ?? "85000",
    maxSalary: seed.maxSalary ?? "120000",
    frequency: seed.frequency ?? "year",
    deadline: seed.deadline ?? "2026-12-31",
    appliedAt: seed.appliedAt,
    status: seed.status,
    archived: seed.archived ?? false,
  };
}

const SEED_APPLICATIONS: ApplicationRow[] = (
  [
    {
      jobTitle: "Senior Frontend Engineer",
      companyName: "Stark Industries",
      category: "Engineering & Tech",
      jobType: "Full-time",
      arrangement: "Remote",
      appliedAt: hoursAgo(2),
      status: "applied",
    },
    {
      jobTitle: "Product Designer",
      companyName: "Cyberdyne Systems",
      category: "Design & Creative",
      jobType: "Contract",
      arrangement: "Hybrid",
      appliedAt: hoursAgo(26),
      status: "review",
    },
    {
      jobTitle: "Lead Data Scientist",
      companyName: "Wayne Enterprises",
      category: "Engineering & Tech",
      jobType: "Full-time",
      arrangement: "On-site",
      appliedAt: hoursAgo(96),
      status: "shortlisted",
    },
    {
      jobTitle: "Cloud Architect",
      companyName: "Oscorp Tech",
      category: "Engineering & Tech",
      jobType: "Full-time",
      arrangement: "Remote",
      appliedAt: hoursAgo(24 * 7),
      status: "rejected",
    },
    {
      jobTitle: "AI Research Engineer",
      companyName: "Hooli Corp",
      category: "Engineering & Tech",
      jobType: "Full-time",
      arrangement: "Hybrid",
      appliedAt: hoursAgo(24 * 14),
      status: "offered",
    },
    {
      jobTitle: "Growth Marketing Manager",
      companyName: "Umbrella Corp",
      category: "Marketing & Growth",
      jobType: "Full-time",
      arrangement: "On-site",
      appliedAt: hoursAgo(24 * 19),
      status: "interview",
    },
    {
      jobTitle: "Backend Engineer",
      companyName: "Initech",
      category: "Engineering & Tech",
      jobType: "Part-time",
      arrangement: "Remote",
      appliedAt: hoursAgo(24 * 24),
      status: "applied",
      archived: true,
    },
    {
      jobTitle: "UX Researcher",
      companyName: "Stark Industries",
      category: "Design & Creative",
      jobType: "Contract",
      arrangement: "Hybrid",
      appliedAt: hoursAgo(24 * 30),
      status: "rejected",
      archived: true,
    },
    {
      jobTitle: "Sales Executive",
      companyName: "Wayne Enterprises",
      category: "Sales & Business Development",
      jobType: "Full-time",
      arrangement: "On-site",
      appliedAt: hoursAgo(24 * 36),
      status: "shortlisted",
      archived: true,
    },
    {
      jobTitle: "Financial Analyst",
      companyName: "Vandelay Industries",
      category: "Finance & Accounting",
      jobType: "Full-time",
      arrangement: "On-site",
      appliedAt: hoursAgo(24 * 42),
      status: "review",
    },
    {
      jobTitle: "Customer Support Specialist",
      companyName: "Hooli Corp",
      category: "Customer Support",
      jobType: "Part-time",
      arrangement: "Remote",
      appliedAt: hoursAgo(24 * 48),
      status: "applied",
    },
    {
      jobTitle: "HR Generalist",
      companyName: "Dunder Mifflin",
      category: "Human Resources",
      jobType: "Full-time",
      arrangement: "Hybrid",
      appliedAt: hoursAgo(24 * 60),
      status: "offered",
    },
  ] satisfies Seed[]
).map(seedApplication);

/* ── Page ────────────────────────────────────────────────── */

const PAGE_SIZE = 5;
const TABS = ["active", "archived"] as const;
type Tab = (typeof TABS)[number];

export default function MyApplicationsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ApplicationRow | null>(null);

  const applications = SEED_APPLICATIONS;

  const stats = useMemo(() => {
    const count = (status: ApplicationStatus) =>
      applications.filter((app) => app.status === status).length;
    const total = applications.length;
    const offers = count("offered");
    return {
      total,
      shortlisted: count("shortlisted"),
      interviews: count("interview"),
      successRate: total === 0 ? 0 : Math.round((offers / total) * 100),
    };
  }, [applications]);

  const visible = useMemo(
    () =>
      applications.filter((app) =>
        tab === "active" ? !app.archived : app.archived,
      ),
    [applications, tab],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const from = (currentPage - 1) * PAGE_SIZE;
  const pageRows = visible.slice(from, from + PAGE_SIZE);
  const isEmpty = pageRows.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Header + view toggle ──────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Applications
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            role="tablist"
            aria-label="Application view"
            className="flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1"
          >
            {TABS.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => {
                  setTab(key);
                  setPage(1);
                }}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-sm font-medium capitalize transition-colors sm:px-4",
                  tab === key
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {key}
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={() => window.print()}
            className="h-10 gap-2 bg-white px-4 font-semibold text-black hover:bg-zinc-200"
          >
            <Download aria-hidden className="size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Applied" value={stats.total} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard
          label="Interviews"
          value={stats.interviews}
          valueClassName="text-amber-500"
        />
        <StatCard
          label="Success Rate"
          value={`${stats.successRate}%`}
          valueClassName="text-emerald-500"
        />
      </div>

      {/* ── Applications ──────────────────────────────────── */}
      <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#141416]">
        {isEmpty ? (
          <div className="px-6 py-16 text-center">
            <span
              aria-hidden
              className="mx-auto grid size-12 place-items-center rounded-full bg-white/[0.04]"
            >
              <FileText aria-hidden className="size-5 text-zinc-500" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-white">
              No {tab} applications
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {tab === "active"
                ? "Applications you submit from the job board show up here."
                : "Applications you archive land here — restore them any time."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                    <th scope="col" className={headerCell}>
                      Job Title
                    </th>
                    <th scope="col" className={headerCell}>
                      Company
                    </th>
                    <th scope="col" className={headerCell}>
                      Applied
                    </th>
                    <th scope="col" className={headerCell}>
                      Status
                    </th>
                    <th
                      scope="col"
                      className={cn(headerCell, "text-right")}
                      aria-label="Action"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {pageRows.map((app) => (
                    <ApplicationTableRow
                      key={app._id}
                      app={app}
                      onDetails={setSelected}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-white/[0.06] md:hidden">
              {pageRows.map((app) => (
                <ApplicationCard
                  key={app._id}
                  app={app}
                  onDetails={setSelected}
                />
              ))}
            </div>

            {/* ── Footer: count + pagination ────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-3.5">
              <p className="text-sm text-zinc-500">
                Showing {from + 1}–{Math.min(from + PAGE_SIZE, visible.length)}{" "}
                of {visible.length} applications
              </p>

              <nav aria-label="Pagination" className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="grid size-8 place-items-center rounded-md border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft aria-hidden className="size-4" />
                </button>

                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      aria-current={
                        pageNumber === currentPage ? "page" : undefined
                      }
                      onClick={() => setPage(pageNumber)}
                      className={cn(
                        "grid size-8 place-items-center rounded-md text-sm font-medium transition-colors",
                        pageNumber === currentPage
                          ? "bg-white text-black"
                          : "border border-white/[0.08] text-zinc-400 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  className="grid size-8 place-items-center rounded-md border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight aria-hidden className="size-4" />
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* ── Details dialog ────────────────────────────────── */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <JobIconTile
                    category={selected.category}
                    className="size-11"
                  />
                  <div className="min-w-0">
                    <DialogTitle className="truncate leading-snug text-white">
                      {selected.jobTitle}
                    </DialogTitle>
                    <DialogDescription className="truncate">
                      {selected.companyName}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <Detail label="Status">
                  <StatusPill status={selected.status} />
                </Detail>
                <Detail label="Applied">
                  <time dateTime={selected.appliedAt}>
                    {formatDate(selected.appliedAt.slice(0, 10))}
                  </time>
                </Detail>
                <Detail label="Job Type">{selected.jobType}</Detail>
                <Detail label="Arrangement">{arrangementOf(selected)}</Detail>
                <Detail label="Location" className="col-span-2">
                  {formatLocation(jobSnapshot(selected))}
                </Detail>
                <Detail label="Salary">
                  {formatCompensation(jobSnapshot(selected))}
                </Detail>
                <Detail label="Deadline">{formatDate(selected.deadline)}</Detail>
              </dl>

              <DialogFooter showCloseButton />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
