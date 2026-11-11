"use client";
import {
  Banknote,
  Bookmark,
  Brain,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  FileText,
  Flame,
  PenTool,
  Search,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobPosting } from "@/lib/types/jobs";
import { useRouter } from "next/navigation";
import { count } from "console";

/* ── Data ──────────────────────────────────────────────────── */
type JobBadge = {
  label: string;
  icon: LucideIcon;
  /** Extra classes: border colour, background and text colour. */
  className?: string;
};

type BrowseJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: JobBadge;
  tags?: JobBadge[];
  logo: { icon: LucideIcon; className: string };
};

/* ── Shared styles ─────────────────────────────────────────── */
const panelClass = "rounded-xl border border-white/[0.08] bg-[#141416]";

const badgeClass =
  "inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300";

const pageButtonClass =
  "grid size-8 place-items-center rounded-md border text-sm transition-colors";

const inactivePageClass =
  "border-white/[0.08] text-zinc-400 hover:bg-white/[0.06] hover:text-white";

/* ── Component ─────────────────────────────────────────────── */
export default function BrowseJobs({ jobs }: { jobs: JobPosting[] }) {
  const router = useRouter();
  const jobTypes = [
    {
      label: 'All-Job',
    },
    {
      label: "Full-time",
    },
    {
      label: "Part-time",
    },
    {
      label: "Contract",
    },
    {
      label: "Freelance",
    },
  ];
  const hendleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const search = data.search;
    const url = new URLSearchParams();
    url.set("search", search as string);
    router.push(`/browse-jobs?${url}`);
  };
  return (
    <div className="min-h-screen bg-[#0a0a0b] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Search ─────────────────────────────────────── */}
        <form
          action="/browse-jobs"
          method="get"
          className={cn(
            panelClass,
            "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
          )}
          onSubmit={hendleSubmit}
        >
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              name="search"
              placeholder="Search by job title, keywords..."
              className="h-11 w-full min-w-0 rounded-lg border border-white/[0.08] bg-[#0d0d0f] pr-4 pl-10 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white/20"
            />
          </div>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-lg bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Search Jobs
          </button>
        </form>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* ── Filters ──────────────────────────────────── */}
          <aside className={cn(panelClass, "h-fit p-5")}>
            <h2 className="text-[15px] font-semibold text-white">Filters</h2>
            <p className="mt-5 text-sm font-medium text-zinc-400">Job Type</p>
            <ul className="mt-3 space-y-3">
              {jobTypes.map((type) => (
                <li key={type.label}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
                    <input
                      type="radio"
                      name="jobType"
                      value={type.label}
                      defaultChecked={type.label === "All-Job"}
                      onChange={(e) => {
                        const url = new URLSearchParams();
                        url.set("jobType", e.target.value as string);
                        router.push(`/browse-jobs?${url}`);
                      }}
                      className="size-4 shrink-0 cursor-pointer rounded-sm accent-white"
                    />
                    <span>{type.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          {/* ── Results ──────────────────────────────────── */}
          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-base font-semibold text-white sm:text-lg">
                Found {jobs.length} Professional Jobs
              </h1>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs text-zinc-500">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    name="sort"
                    defaultValue="recent"
                    className="h-9 cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-[#141416] pr-9 pl-3 text-sm text-zinc-200 outline-none transition-colors hover:border-white/20 focus:border-white/20"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="salary">Salary: High to Low</option>
                    <option value="relevance">Relevance</option>
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-4">
              {jobs.map((job) => (
                <li
                  key={job._id}
                  className="flex items-start gap-4 rounded-xl border border-white/[0.08] bg-[#141416] p-4 transition-colors hover:border-white/[0.14]"
                >
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-[#1f1f23]"
                  >
                    {/* <job.logo.icon className={cn("size-5", job.logo.className)} /> */}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-[15px] font-semibold text-white">
                          {job.title}
                        </h2>
                        <p className="mt-1 truncate text-sm text-zinc-500">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Save ${job.title}`}
                        className="shrink-0 text-zinc-500 transition-colors hover:text-white"
                      >
                        <Bookmark aria-hidden className="size-4.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={badgeClass}>
                        <Banknote
                          aria-hidden
                          className="size-3.5 text-zinc-500"
                        />
                        {job.maxSalary}
                      </span>
                      <span className={badgeClass}>
                        {/* <job.jobType.icon
                          aria-hidden
                          className="size-3.5 text-zinc-500"
                        /> */}
                        {job.jobType}
                      </span>
                      {/* {job.tags?.map((tag) => (
                        <span
                          key={tag.label}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
                            tag.className,
                          )}
                        >
                          <tag.icon aria-hidden className="size-3.5" />
                          {tag.label}
                        </span>
                      ))} */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
