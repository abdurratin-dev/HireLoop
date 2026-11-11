import { getJobs } from "@/lib/actions/api/jobs";
import BrowseJobs from "./_components/browse-jobs";

export default async function BrowseJobsPage({searchParams}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    
    const search = await searchParams;
    const url = new URLSearchParams(search as Record<string,string>)
    const quary = url.toString();
    const jobs = await getJobs(quary);
    return (
        <div>
            <BrowseJobs jobs={jobs}/>
        </div>
    )
}