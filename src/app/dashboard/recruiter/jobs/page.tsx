"use client";

import Link from "next/link";
import { Briefcase, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/actions/api/jobs";
import type { JobPosting } from "@/lib/types/jobs";
import { JobTable } from "@/components/jobs/job-table";
import { JobCardList } from "@/components/jobs/job-card";

// `JobPosting` lives in the shared types module; re-exported here so any
// existing `import { JobPosting } from ".../jobs/page"` keeps working.
export type { JobPosting };

export default function JobPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const data = async () => {
      const job = await getJobs();
      setJobs(job);
    };
    data();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Breadcrumb + header ─────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-zinc-500"
      >
        <span>Manage Jobs</span>
        <ChevronRight aria-hidden className="size-3" />
        <span className="text-zinc-400">Job Listings &amp; Postings</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            Manage Job Posts
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-zinc-500">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>
        <Button
          variant="brand"
          size="lg"
          className="group h-10 gap-2 px-4 font-semibold"
          render={<Link href="/dashboard/recruiter/jobs/new" />}
        >
          <Plus
            aria-hidden
            className="size-4 transition-transform group-hover:rotate-90"
          />
          New Job Post
        </Button>
      </div>

      {jobs.length === 0 ? (
        /* ── Empty state ────────────────────────────────── */
        <div className="mt-8 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <span
            aria-hidden
            className="mx-auto grid size-12 place-items-center rounded-full bg-[#5C53FE]/15"
          >
            <Briefcase className="size-5 text-violet-300" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-white">
            No job posts yet
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create your first listing to start receiving applications.
          </p>
          <Button
            variant="brand"
            size="lg"
            className="mt-5 h-10 gap-2 px-4 font-semibold"
            render={<Link href="/dashboard/recruiter/jobs/new" />}
          >
            <Plus aria-hidden className="size-4" />
            Create Job Post
          </Button>
        </div>
      ) : (
        <>
          {/* ── Desktop table / mobile cards ─────────────── */}
          <JobTable jobs={jobs} className="mt-6" />
          <JobCardList jobs={jobs} className="mt-6" />
        </>
      )}
    </div>
  );
}
