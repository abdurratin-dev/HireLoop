import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJob } from "@/lib/actions/api/jobs";
import { ApplicantReview } from "./_components/applicant-review";
import { getApplications } from "@/lib/actions/api/applications";

export const metadata: Metadata = {
  title: "Applicants | hireloop",
  description:
    "Review the applicants for one job posting and move each of them through the hiring pipeline.",
};

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await getJob(jobId)
  const applications = await getApplications(`jobId=${jobId}`)
  console.log(applications);
  if (!job) notFound();
  // `key` remounts the client view when the job changes, so state from a
  // previous job's table never leaks into this one.
  return (
    <ApplicantReview
      key={job._id}
      job={job}
      initialApplications={applications}
    />
  );
}
