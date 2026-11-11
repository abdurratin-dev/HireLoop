import { cn } from "@/lib/utils";
import type { JobPosting } from "@/lib/types/jobs";
import { formatCompensation } from "./format";
import { JobActions } from "./job-actions";
import {
  ApplicantsCount,
  CompanyLine,
  DeadlineMeta,
  JobIconTile,
  JobStatusBadge,
  JobTitleBlock,
  LocationLine,
  TypeBadge,
} from "./job-fields";

const headerCell =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500";

const columns = [
  "Job Title & Dept",
  "Company & Location",
  "Type",
  "Compensation",
  "Applicants",
  "Status",
  "Deadline",
] as const;

function JobTableRow({ job }: { job: JobPosting }) {
  return (
    <tr className="transition-colors hover:bg-white/[0.03]">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <JobIconTile category={job.category} />
          <JobTitleBlock job={job} />
        </div>
      </td>

      <td className="px-4 py-3.5">
        <CompanyLine job={job} />
        <LocationLine job={job} className="mt-1" />
      </td>

      <td className="px-4 py-3.5">
        <TypeBadge>{job.jobType}</TypeBadge>
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-300">
        {formatCompensation(job)}
      </td>

      <td className="whitespace-nowrap px-4 py-3.5">
        <ApplicantsCount job={job} />
      </td>

      <td className="px-4 py-3.5">
        <JobStatusBadge job={job} />
      </td>

      <td className="whitespace-nowrap px-4 py-3.5">
        <DeadlineMeta job={job} />
      </td>

      <td className="px-4 py-3.5">
        <JobActions job={job} className="justify-end" />
      </td>
    </tr>
  );
}

/** Desktop listing: horizontally scrollable on mid-size screens. */
export function JobTable({
  jobs,
  className,
}: {
  jobs: JobPosting[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hidden overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] md:block",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              {columns.map((column) => (
                <th key={column} scope="col" className={headerCell}>
                  {column}
                </th>
              ))}
              <th scope="col" className={cn(headerCell, "text-right")}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {jobs.map((job) => (
              <JobTableRow key={job._id} job={job} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
