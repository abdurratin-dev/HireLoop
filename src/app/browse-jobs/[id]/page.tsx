
import JobDetails from "./_components/job-details";
import { Suspense } from "react";

export default async function JobDetailsPage({
  params,
}: PageProps<"/browse-jobs/[id]">) {
  const { id } = await params;
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <JobDetails id={id}/>
    </Suspense>
  );
}
