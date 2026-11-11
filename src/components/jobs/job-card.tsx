import { cn } from "@/lib/utils";
import type { JobPosting } from "@/lib/types/jobs";
import { formatCompensation } from "./format";
import { JobActions } from "./job-actions";
import {
  ApplicantsCount,
  CardField,
  CompanyLine,
  DeadlineMeta,
  JobIconTile,
  JobStatusBadge,
  JobTitleBlock,
  LocationLine,
} from "./job-fields";

function JobCard({ job }: { job: JobPosting }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <JobIconTile category={job.category} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <JobTitleBlock job={job} />
            <JobStatusBadge job={job} />
          </div>
          <CompanyLine job={job} className="mt-2" />
          <LocationLine job={job} className="mt-1" />
        </div>
      </div>

      <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/[0.06] pt-3.5">
        <CardField label="Type">{job.jobType}</CardField>
        <CardField label="Compensation">{formatCompensation(job)}</CardField>
        <CardField label="Applicants">
          <ApplicantsCount job={job} className="text-zinc-200" />
        </CardField>
        <CardField label="Deadline">
          <DeadlineMeta job={job} />
        </CardField>
      </dl>

      <JobActions job={job} className="mt-4" />
    </li>
  );
}

/** Mobile listing: stacked cards shown below the `md` breakpoint. */
export function JobCardList({
  jobs,
  className,
}: {
  jobs: JobPosting[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3 md:hidden", className)}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </ul>
  );
}
