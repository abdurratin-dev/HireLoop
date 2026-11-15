import { STATUS_META, type ApplicationStatus } from "@/lib/types/applications";
import { cn } from "@/lib/utils";

/**
 * Colored pill for an application's lifecycle status.
 * Shared by the seeker "My Applications" view and the recruiter
 * applicant-review table, so both always render the same label + color.
 */
export function StatusPill({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const meta = STATUS_META[status] ?? STATUS_META.applied;
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      )}
      style={{ color: meta.color, backgroundColor: `${meta.color}1F` }}
    >
      {meta.label}
    </span>
  );
}
