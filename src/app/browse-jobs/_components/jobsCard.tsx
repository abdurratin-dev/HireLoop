import { JobPosting } from "@/lib/types/jobs";
import { Banknote, Bookmark } from "lucide-react";
import Link from "next/link";

const badgeClass =
  "inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300";

export default function JobsCard({jobs}:{jobs : JobPosting[]}) {
  return (
    <ul className="mt-4 space-y-4">
      {jobs.map((job) => (
        <Link
          key={job._id}
          href={`/browse-jobs/${job._id}`}
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
                <Banknote aria-hidden className="size-3.5 text-zinc-500" />
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
        </Link>
      ))}
    </ul>
  );
}
