'use client'
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const panelClass = "rounded-xl border border-white/[0.08] bg-[#141416]";

export default function SearchJob() {
    const router = useRouter();
    const hendleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const search = data.search;
    const url = new URLSearchParams();
    url.set("search", search as string);
    router.push(`/browse-jobs?${url}`);
  };
  return (
    <form
      action="/browse-jobs"
      method="get"
      className={cn(
        panelClass,
        "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
      )}
      onSubmit={hendleSubmit}
    >
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="search"
          name="search"
          placeholder="Search by job title, keywords..."
          className="h-11 w-full min-w-0 rounded-lg border border-white/[0.08] bg-[#0d0d0f] pr-4 pl-10 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white/20"
        />
      </div>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-lg bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
      >
        Search Jobs
      </button>
    </form>
  );
}
