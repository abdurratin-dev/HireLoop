import {
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobPosting } from "@/lib/types/jobs";
import JobsCard from "./jobsCard";
import SearchJob from "./searchJob";
import JobType from "./jobType";

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


/* ── Component ─────────────────────────────────────────────── */
export default function BrowseJobs({ jobs }: { jobs: JobPosting[] }) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Search ─────────────────────────────────────── */}
        <SearchJob />

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* ── Filters ──────────────────────────────────── */}
          <aside className={cn(panelClass, "h-fit p-5")}>
            <h2 className="text-[15px] font-semibold text-white">Filters</h2>
            <p className="mt-5 text-sm font-medium text-zinc-400">Job Type</p>
            <JobType />
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

            <JobsCard jobs={jobs}/>
          </section>
        </div>
      </div>
    </div>
  );
}
