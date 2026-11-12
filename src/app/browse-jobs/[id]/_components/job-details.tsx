"use client";
import Link from "next/link";
import {
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  CircleCheck,
  Clock,
  Code2,
  FileText,
  Gavel,
  GraduationCap,
  Headphones,
  HeartPulse,
  Laptop,
  MapPin,
  Megaphone,
  MessageSquare,
  Palette,
  PenTool,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  TreePalm,
  UserCheck,
  Users,
  Wallet,
  Zap,
  Bookmark,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobPosting } from "@/lib/types/jobs";
import {
  formatDate,
  formatCompensation,
  formatLocation,
  formatPosted,
  getJobStatus,
} from "@/components/jobs/format";
import { JobIconTile } from "@/components/jobs/job-fields";
import { notFound } from "next/navigation";
import { getJob } from "@/lib/actions/api/jobs";
import { useEffect, useState } from "react";

/* ── Defaults for fields the data model doesn't have yet ────── */

/** Not tracked per posting yet — shown so the layout matches the design. */
const DEFAULT_EXPERIENCE = "3+ Years";
const DEFAULT_COMPANY_SIZE = "250 - 500 Employees";

/** Placeholder perks — there is no benefits field on a posting. */
const benefits = [
  { icon: HeartPulse, label: "Full Health & Dental" },
  { icon: Wallet, label: "Competitive 401k" },
  { icon: Laptop, label: "Latest Hardware Stipend" },
  { icon: TreePalm, label: "Unlimited PTO" },
];

type SkillChip = { label: string; icon: LucideIcon };

/** Skill tags for the Requirements block, derived from the category. */
const categorySkills: Record<string, SkillChip[]> = {
  "Engineering & Tech": [
    { label: "System Design", icon: Code2 },
    { label: "Clean Code", icon: FileText },
    { label: "Testing & QA", icon: CircleCheck },
    { label: "Problem Solving", icon: Zap },
  ],
  "Design & Creative": [
    { label: "Figma Expertise", icon: PenTool },
    { label: "System Thinking", icon: Sparkles },
    { label: "UI/UX Design", icon: Palette },
    { label: "Basic Frontend", icon: Code2 },
  ],
  "Marketing & Growth": [
    { label: "SEO", icon: Search },
    { label: "Content Strategy", icon: FileText },
    { label: "Analytics", icon: BarChart3 },
    { label: "Copywriting", icon: Megaphone },
  ],
  "Sales & Business Development": [
    { label: "Prospecting", icon: Target },
    { label: "Negotiation", icon: MessageSquare },
    { label: "CRM Tools", icon: FileText },
    { label: "Pipeline Management", icon: TrendingUp },
  ],
  "Finance & Accounting": [
    { label: "Financial Modeling", icon: Banknote },
    { label: "Reporting", icon: BarChart3 },
    { label: "Attention to Detail", icon: CircleCheck },
    { label: "Spreadsheet Skills", icon: FileText },
  ],
  "Customer Support": [
    { label: "Communication", icon: MessageSquare },
    { label: "Empathy", icon: HeartPulse },
    { label: "Ticketing Tools", icon: Headphones },
    { label: "Problem Solving", icon: Zap },
  ],
  "Human Resources": [
    { label: "Recruiting", icon: UserCheck },
    { label: "Onboarding", icon: GraduationCap },
    { label: "Employee Relations", icon: Users },
    { label: "HR Systems", icon: Briefcase },
  ],
  "Operations & Legal": [
    { label: "Process Design", icon: FileText },
    { label: "Compliance", icon: ShieldCheck },
    { label: "Organization", icon: Briefcase },
    { label: "Negotiation", icon: Gavel },
  ],
};

const fallbackSkills: SkillChip[] = [
  { label: "Relevant Experience", icon: Briefcase },
  { label: "Communication", icon: MessageSquare },
  { label: "Problem Solving", icon: Zap },
  { label: "Team Collaboration", icon: Users },
];

/* ── Helpers ───────────────────────────────────────────────── */

/**
 * The responsibilities/qualifications fields are free-text textareas, so split
 * them into bullets on newlines first, then on "•"/";" separators. A plain
 * paragraph stays as a single bullet.
 */
function toBullets(text: string | null | undefined): string[] {
  const source = (text ?? "").trim();
  if (!source) return [];
  return source
    .split(/\r?\n+/)
    .flatMap((line) => line.split(/\s*[;•]\s*/))
    .map((line) => line.replace(/^\s*(?:[-*•‣·]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

/**
 * There is no dedicated description field yet, so build an intro from the
 * fields we do have. Replace once the API exposes real copy.
 */
function buildDescription(job: JobPosting) {
  return [
    `At ${job?.company}, we are hiring a ${job?.title} to join our ${job?.category} team.`,
    `This is a ${job?.jobType} role — ${formatLocation(job)} — and you will partner closely with the rest of the team from day one.`,
    "Read on for the day-to-day responsibilities and the qualifications we are looking for.",
  ].join(" ");
}

/** Posted 2d ago · 12 applicants · Apply by May 30, 2026 */
function buildMeta(job: JobPosting) {
  const parts = [
    job?.postedAt ? formatPosted(job.postedAt) : null,
    `${job?.applicants} ${job?.applicants === 1 ? "applicant" : "applicants"}`,
    job?.deadline ? `Apply by ${formatDate(job.deadline)}` : null,
  ];
  return parts.filter(Boolean).join(" · ");
}

/* ── Small pieces ──────────────────────────────────────────── */

/** Salary / Location / Job Type / Experience tile under the header. */
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141416] p-4">
      <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
        <Icon aria-hidden className="size-3.5" />
        {label}
      </p>
      <p className="mt-2.5 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

/** Bullet list with a fallback when the field is empty. */
function BulletList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (!items.length) {
    return (
      <p className={cn("mt-3 text-sm text-zinc-500", className)}>
        Not specified yet.
      </p>
    );
  }
  return (
    <ul className={cn("mt-3 space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-400">
          <span
            aria-hidden
            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-zinc-600"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Component ─────────────────────────────────────────────── */
export default function JobDetails({ id }: { id: string }) {
  const [job, setJob] = useState<JobPosting>({});
  useEffect(() => {
    const getdata = async() => {
      const jobs: JobPosting = await getJob(id);
      console.log(jobs);
      if (!jobs?._id) notFound();
      setJob(jobs)
    };
    console.log(getdata());
    getdata()
  }, [id]);
  console.log(id);
  const responsibilities = toBullets(job?.responsibilities);
  const qualifications = toBullets(job?.qualifications);
  const skills = categorySkills[job?.category] ?? fallbackSkills;
  const expired = getJobStatus(job) === "expired";
  const meta = buildMeta(job);

  const sectionHeading = "text-base font-semibold text-white";
  const sectionClass = "mt-6 border-t border-white/[0.06] pt-6";

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Header ──────────────────────────────────────── */}
        <header className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#141416] p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <JobIconTile category={job?.category} className="size-12" />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              {job?.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-zinc-300">{job?.company}</span>
              <span aria-hidden className="text-zinc-600">
                •
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 aria-hidden className="size-3.5" />
                Verified Employer
              </span>
            </div>
            {meta && <p className="mt-2 text-xs text-zinc-500">{meta}</p>}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={`Save ${job?.title}`}
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-[#1f1f23] text-zinc-400 transition-colors hover:text-white"
            >
              <Bookmark aria-hidden className="size-4.5" />
            </button>
            {expired ? (
              <span className="inline-flex h-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-medium text-zinc-500">
                Applications Closed
              </span>
            ) : (
              // TODO: point at the real application flow once it exists.
              <Link
                href="/sign-in"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
              >
                Apply Now
              </Link>
            )}
          </div>
        </header>

        {/* ── Key facts ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            icon={Banknote}
            label="Salary Range"
            value={formatCompensation(job)}
          />
          <StatCard
            icon={MapPin}
            label="Location"
            value={formatLocation(job)}
          />
          <StatCard icon={Clock} label="Job Type" value={job?.jobType} />
          <StatCard
            icon={BarChart3}
            label="Experience"
            value={DEFAULT_EXPERIENCE}
          />
        </div>

        {/* ── Body ────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-xl border border-white/[0.08] bg-[#141416] p-5 sm:p-6">
            <section>
              <h2 className={sectionHeading}>Job Description</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {buildDescription(job)}
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={sectionHeading}>Responsibilities</h2>
              <BulletList items={responsibilities} />
            </section>

            <section className={sectionClass}>
              <h2 className={sectionHeading}>Requirements</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300"
                  >
                    <skill.icon
                      aria-hidden
                      className="size-3.5 text-zinc-500"
                    />
                    {skill.label}
                  </span>
                ))}
              </div>
              <BulletList items={qualifications} className="mt-4" />
            </section>

            <section className={sectionClass}>
              <h2 className={sectionHeading}>Benefits</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit.label} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-[#1f1f23]"
                    >
                      <benefit.icon className="size-4 text-zinc-300" />
                    </span>
                    <span className="text-sm text-zinc-200">
                      {benefit.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* ── Company overview ──────────────────────────── */}
          <aside className="h-fit rounded-xl border border-white/[0.08] bg-[#141416] p-5">
            <h2 className="text-base font-semibold text-white">
              Company Overview
            </h2>

            {/* Placeholder cover — postings have no logo/image field yet. */}
            <div className="mt-4 grid aspect-[16/10] place-items-center rounded-lg border border-white/[0.06] bg-gradient-to-br from-[#1f1f23] to-[#141416]">
              <Building2 aria-hidden className="size-8 text-zinc-600" />
            </div>

            <dl className="mt-4 divide-y divide-white/[0.06]">
              <div className="flex items-center justify-between gap-3 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                  Size
                </dt>
                <dd className="text-sm text-zinc-200">
                  {DEFAULT_COMPANY_SIZE}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                  Industry
                </dt>
                <dd className="text-sm text-zinc-200">{job?.category}</dd>
              </div>
            </dl>

            {/* No website field yet — search for the company instead. */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(job?.company)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex h-10 w-full items-center justify-center rounded-lg border border-white/[0.08] bg-[#1f1f23] text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
            >
              Visit Website
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
