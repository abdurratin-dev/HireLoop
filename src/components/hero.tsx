"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Briefcase, MapPin, Search } from "lucide-react";
import globe from "@/assets/images/globe.png";

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"];

/** Deterministic star field so server and client render identical markup. */
function makeStars(count: number) {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 62).toFixed(2)}%`,
    size: rand() > 0.86 ? 3 : 2,
    opacity: 0.2 + rand() * 0.6,
    purple: rand() > 0.72,
    delay: `${(rand() * 3).toFixed(2)}s`,
  }));
}

const stars = makeStars(80);

export function Hero() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (title) params.set("q", title);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute animate-pulse rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              background: star.purple ? "#a5a0ff" : "#ffffff",
              animationDuration: "3s",
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Planet */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[110px] z-0 w-[1000px] -translate-x-1/2 sm:top-[-108px] sm:w-[1500px]"
      >
        <Image
          src={globe}
          alt=""
          width={1440}
          height={1882}
          priority
          className="h-auto w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 28%, rgba(0,0,0,0.6) 36%, black 44%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 28%, rgba(0,0,0,0.6) 36%, black 44%)",
          }}
        />
      </div>

      {/* Copy */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-16 text-center sm:pt-50">
        {/* Badge */}
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="hidden h-px w-24 bg-gradient-to-r from-transparent to-white/20 sm:block"
          />
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur">
            <Briefcase className="size-3.5 shrink-0 text-orange-400" />
            <p className="font-mono text-[11px] tracking-[0.16em]">
              <span className="font-bold text-white">50,000+</span>{" "}
              <span className="text-zinc-400">NEW JOBS THIS MONTH</span>
            </p>
          </div>
          <span
            aria-hidden
            className="hidden h-px w-24 bg-gradient-to-l from-transparent to-white/20 sm:block"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-10 text-[40px] font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
          Find Your Dream Job Today
        </h1>

        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          HireLoop connects top talent with world-class companies. Browse thousands
          of curated opportunities and land your next role — faster.
        </p>

        {/* Search */}
        <form
          onSubmit={search}
          className="mt-14 flex w-full max-w-[760px] flex-col gap-2 rounded-2xl border border-white/10 bg-[#121216]/90 p-2 shadow-2xl shadow-black/50 backdrop-blur sm:flex-row sm:items-center sm:gap-0"
        >
          <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2">
            <Search className="size-4 shrink-0 text-zinc-500" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </label>

          <span aria-hidden className="hidden h-8 w-px bg-white/10 sm:block" />
          <span aria-hidden className="h-px w-full bg-white/10 sm:hidden" />

          <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2">
            <MapPin className="size-4 shrink-0 text-zinc-500" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            aria-label="Search jobs"
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-500 text-white shadow-sm shadow-indigo-500/30 transition-colors hover:bg-indigo-400 sm:ml-1"
          >
            <Search className="size-4" />
          </button>
        </form>

        {/* Trending */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs text-zinc-500">Trending Position</span>
          {trending.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setTitle(position)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-indigo-500/50 hover:text-white"
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {/* Headline over the planet */}
      <div className="relative z-10 mx-auto mt-96 max-w-2xl px-6 text-center">
        <p className="text-2xl font-medium leading-snug text-balance sm:text-[36px]">
          Assisting over 15,000 job seekers find their dream positions.
        </p>
      </div>

      {/* Peeking cards — negative margin clips them against the section edge */}
      <div className="relative z-10 mx-auto -mb-[110px] mt-12 flex w-full max-w-5xl gap-6 px-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[170px] flex-1 rounded-t-2xl border border-b-0 border-white/10 bg-[#151519] px-5 pt-5 shadow-[0_-16px_50px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center gap-3">
              <span className="size-9 shrink-0 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/30" />
              <span className="h-3 w-28 rounded-full bg-white/15" />
            </div>
            <span className="mt-4 block h-2.5 w-full rounded-full bg-white/[0.07]" />
            <span className="mt-2 block h-2.5 w-4/5 rounded-full bg-white/[0.07]" />
          </div>
        ))}
      </div>
    </section>
  );
}
