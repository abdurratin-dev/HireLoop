// Shared application domain types — single source of truth for the
// "Apply Now" flow (`browse-jobs/[id]` / `lib/actions/api/applications`) and
// the seeker My Applications page (`dashboard/seeker/applications`).
//
// An application stores a snapshot of the job at apply time, so the My
// Applications view needs no joins: everything the design renders — title with
// "Full-time • Remote", company, relative applied time, status pill, the
// Active/Archived toggle and the stats cards — is a field on this object
// (plus location/salary/deadline for the details dialog).

/** Lifecycle of an application — the status pill shown in the table. */
export type ApplicationStatus =
    | "applied"
    | "review"
    | "interview"
    | "shortlisted"
    | "rejected"
    | "offered"

/** Status pill labels + Figma "Seeker / My Applications" palette. */
export const STATUS_META: Record<ApplicationStatus, { label: string; color: string }> = {
    applied: { label: "Applied", color: "#A1A4AA" },
    review: { label: "Review", color: "#F59E0B" },
    interview: { label: "Interview", color: "#5C53FE" },
    shortlisted: { label: "Shortlisted", color: "#60A5FA" },
    rejected: { label: "Rejected", color: "#EF4444" },
    offered: { label: "Offered", color: "#22C55E" },
}

/** Flat payload posted to POST /applications. */
export type ApplicationFormData = {
    // Who applied.
    jobId: string
    userId: string
    email: string

    // Job snapshot — everything the My Applications table + details dialog render.
    jobTitle: string
    companyName: string
    /** Drives the row's icon tile (same vocabulary as `JobPosting.category`). */
    category: string
    /** "Full-time" | "Part-time" | "Contract" | "Internship". */
    jobType: string
    /** "Remote" | "On-site" | "Hybrid" — how the work is arranged. */
    arrangement: string
    /** Raw job flag; kept for filtering (older docs may lack `arrangement`). */
    isRemote: boolean
    location: string
    minSalary: string
    maxSalary: string
    /** Salary period, same vocabulary as `FormState.frequency` (hour/day/…). */
    frequency: string
    deadline: string

    // Lifecycle.
    /** ISO timestamp — rendered as relative time ("2 hours ago"). */
    appliedAt: string
    status: ApplicationStatus
    /** Soft delete behind the Active/Archived toggle. */
    archived: boolean
}

/** Saved document: the payload plus MongoDB's id. */
export type ApplicationRow = ApplicationFormData & {
    _id: string
}
