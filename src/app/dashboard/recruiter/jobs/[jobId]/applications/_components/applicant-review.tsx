"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicantTable } from "@/components/applications/applicant-table";
import { JobIconTile } from "@/components/jobs/job-fields";
import type { JobPosting } from "@/lib/types/jobs";
import type {
  ApplicationRow,
  ApplicationStatus,
} from "@/lib/types/applications";
import { updateAplication } from "@/lib/actions/api/applications";

/**
 * Review view for one job's applicants: header, status pipeline control,
 * and the applicant table. Receives its rows from the server component
 * above and owns only the (optimistic) status state.
 */
export function ApplicantReview({
  job,
  initialApplications,
}: {
  job: JobPosting;
  initialApplications: ApplicationRow[];
}) {
  const [applications, setApplications] = useState(initialApplications);

  async function handleStatusChange(
    app: ApplicationRow,
    status: ApplicationStatus,
  ) {
    const update = await updateAplication(app._id, status);
    console.log(update);
    if (update.modifiedCount > 0) {
      setApplications((rows) =>
        rows.map((row) => (row._id === app._id ? { ...row, status } : row)),
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Breadcrumb ──────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-zinc-500"
      >
        <Link
          href="/dashboard/recruiter/jobs"
          className="transition-colors hover:text-zinc-300"
        >
          Manage Jobs
        </Link>
        <ChevronRight aria-hidden className="size-3" />
        <span>Job Listings &amp; Postings</span>
        <ChevronRight aria-hidden className="size-3" />
        <span className="text-zinc-400">Applicants</span>
      </nav>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <JobIconTile category={job.category} className="size-11" />
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
              {job.title}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              {job.company}
              <span aria-hidden className="size-1 rounded-full bg-zinc-600" />
              <span className="text-zinc-400">
                {applications.length}{" "}
                {applications.length === 1 ? "applicant" : "applicants"}
              </span>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="h-10 gap-2 px-4 font-semibold"
          render={<Link href="/dashboard/recruiter/jobs" />}
        >
          <ArrowLeft aria-hidden className="size-4" />
          All Job Posts
        </Button>
      </div>

      {/* ── Applicants ──────────────────────────────────── */}
      {applications.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <span
            aria-hidden
            className="mx-auto grid size-12 place-items-center rounded-full bg-[#5C53FE]/15"
          >
            <Users className="size-5 text-violet-300" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-white">
            No applicants yet
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Applications for this job show up here as seekers apply.
          </p>
        </div>
      ) : (
        <ApplicantTable
          applications={applications}
          onStatusChange={handleStatusChange}
          className="mt-6"
        />
      )}
    </div>
  );
}
