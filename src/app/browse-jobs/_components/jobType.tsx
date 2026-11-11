'use client'
import { useRouter } from "next/navigation";

 const jobTypes = [
    {
      label: 'All-Job',
    },
    {
      label: "Full-time",
    },
    {
      label: "Part-time",
    },
    {
      label: "Contract",
    },
    {
      label: "Freelance",
    },
  ];

export default function JobType() {
    const router = useRouter();
  return (
    <ul className="mt-3 space-y-3">
      {jobTypes.map((type) => (
        <li key={type.label}>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
            <input
              type="radio"
              name="jobType"
              value={type.label}
              defaultChecked={type.label === "All-Job"}
              onChange={(e) => {
                const url = new URLSearchParams();
                url.set("jobType", e.target.value as string);
                router.push(`/browse-jobs?${url}`);
              }}
              className="size-4 shrink-0 cursor-pointer rounded-sm accent-white"
            />
            <span>{type.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
