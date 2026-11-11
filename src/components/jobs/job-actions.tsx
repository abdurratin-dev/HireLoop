import Link from "next/link";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobPosting } from "@/lib/types/jobs";
import { DeleteJobButton } from "@/app/components/deleteJobDialog";

/** Update + delete controls, shared by the table row and the mobile card. */
export function JobActions({
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
      <DeleteJobButton job={job} />
    </div>
  );
}
