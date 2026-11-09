"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronRight,
  Globe2,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"] as const;

const categories = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Growth",
  "Sales & Business Development",
  "Finance & Accounting",
  "Customer Support",
  "Human Resources",
  "Operations & Legal",
];

const frequencies = [
  { value: "hour", label: "per hour" },
  { value: "day", label: "per day" },
  { value: "month", label: "per month" },
  { value: "year", label: "per year" },
];

type FormState = {
  title: string;
  company: string;
  category: string;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  frequency: string;
  responsibilities: string;
  qualifications: string;
};

const initialForm: FormState = {
  title: "",
  company: "",
  category: "",
  jobType: "Full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "hour",
  responsibilities: "",
  qualifications: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const fieldClass =
  "h-11 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/60 focus:bg-white/[0.05] [color-scheme:dark] aria-invalid:border-red-500/60";

const textareaClass =
  "w-full min-w-0 resize-y rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/60 focus:bg-white/[0.05] aria-invalid:border-red-500/60";

function FieldLabel({
  htmlFor,
  required,
  aside,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-200"
    >
      <span>
        {children}
        {required && (
          <span aria-hidden className="ml-1 text-violet-400">
            *
          </span>
        )}
      </span>
      {aside}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <h2 className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
        <span
          aria-hidden
          className="size-2 rounded-full bg-[#5C53FE] shadow-[0_0_10px_rgba(92,83,254,0.75)]"
        />
        {step}. {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SelectField({
  id,
  value,
  onChange,
  children,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldClass,
          "cursor-pointer appearance-none pr-10",
          !value && "text-zinc-500",
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
      />
    </div>
  );
}

export default function NewJobsPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [published, setPublished] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setPublished(false);
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    const numeric = /^\d+(\.\d+)?$/;

    if (!form.title.trim()) next.title = "Job title is required.";
    if (!form.company.trim()) next.company = "Company name is required.";
    if (!form.category) next.category = "Please choose a job category.";
    if (!form.location.trim()) next.location = "Job location is required.";

    if (form.deadline && form.deadline < today) {
      next.deadline = "Deadline must be today or later.";
    }

    if (form.minSalary && !numeric.test(form.minSalary.trim())) {
      next.minSalary = "Enter a valid amount.";
    }
    if (form.maxSalary && !numeric.test(form.maxSalary.trim())) {
      next.maxSalary = "Enter a valid amount.";
    }
    if (
      form.minSalary &&
      form.maxSalary &&
      numeric.test(form.minSalary.trim()) &&
      numeric.test(form.maxSalary.trim()) &&
      Number(form.maxSalary) < Number(form.minSalary)
    ) {
      next.maxSalary = "Max must be greater than or equal to min.";
    }

    if (!form.responsibilities.trim()) {
      next.responsibilities = "Key responsibilities are required.";
    }
    if (!form.qualifications.trim()) {
      next.qualifications = "Qualifications are required.";
    }

    return next;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPublished(false);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = document.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid?.focus({ preventScroll: true });
      return;
    }

    // No jobs API yet — the validated payload is logged for now.
    console.log("Publish job payload:", {
      ...form,
      minSalary: form.minSalary ? Number(form.minSalary) : null,
      maxSalary: form.maxSalary ? Number(form.maxSalary) : null,
    });
    setPublished(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Breadcrumb + header ─────────────────────────── */}
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
        <span className="text-zinc-400">Create New Listing</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            Post a New Job
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-zinc-500">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>
      </div>

      <form
        id="post-job-form"
        onSubmit={submit}
        noValidate
        className="mt-10 space-y-12"
      >
        {/* ── 1. Basic information ──────────────────────── */}
        <Section step={1} title="Basic Information">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="title" required>
              Job Title
            </FieldLabel>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Frontend Developer"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              aria-invalid={Boolean(errors.title) || undefined}
              className={fieldClass}
            />
            <FieldError message={errors.title} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="company" required>
                Company Name
              </FieldLabel>
              <div className="relative">
                <Building2
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                />
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. HirePulse Network"
                  value={form.company}
                  onChange={(event) => update("company", event.target.value)}
                  aria-invalid={Boolean(errors.company) || undefined}
                  className={cn(fieldClass, "pl-10")}
                />
              </div>
              <FieldError message={errors.company} />
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="category" required>
                Job Category
              </FieldLabel>
              <SelectField
                id="category"
                value={form.category}
                onChange={(value) => update("category", value)}
                invalid={Boolean(errors.category)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </SelectField>
              <FieldError message={errors.category} />
            </div>
          </div>

          <div className="space-y-1.5">
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-zinc-200">
                Job Type
                <span aria-hidden className="ml-1 text-violet-400">
                  *
                </span>
              </legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {jobTypes.map((type) => {
                  const selected = form.jobType === type;
                  return (
                    <label
                      key={type}
                      className={cn(
                        "flex h-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-violet-500/60",
                        selected
                          ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white",
                      )}
                    >
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={selected}
                        onChange={() => update("jobType", type)}
                        className="sr-only"
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </Section>

        {/* ── 2. Location, compensation & timeline ──────── */}
        <Section step={2} title="Location, Compensation & Timeline">
          <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-white/20 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-violet-500/60">
            <input
              type="checkbox"
              name="isRemote"
              checked={form.isRemote}
              onChange={(event) => update("isRemote", event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#14122b]"
            >
              <Globe2 className="size-4.5 text-violet-300" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-white">
                Remote Work Allowed (isRemote)
              </span>
              <span className="block text-xs text-zinc-500">
                Enable worldwide or distributed candidate applications
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                form.isRemote ? "bg-violet-600" : "bg-zinc-700",
              )}
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform",
                  form.isRemote && "translate-x-5",
                )}
              />
            </span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <FieldLabel
                htmlFor="location"
                aside={
                  <span className="text-[11px] font-medium text-rose-400/90">
                    Required
                  </span>
                }
              >
                Job Location (location)
              </FieldLabel>
              <div className="relative">
                <MapPin
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                />
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. New York, USA"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  aria-invalid={Boolean(errors.location) || undefined}
                  className={cn(fieldClass, "pl-10")}
                />
              </div>
              <FieldError message={errors.location} />
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="deadline">
                Application Deadline (deadline)
              </FieldLabel>
              <input
                id="deadline"
                name="deadline"
                type="date"
                min={today}
                value={form.deadline}
                onChange={(event) => update("deadline", event.target.value)}
                aria-invalid={Boolean(errors.deadline) || undefined}
                className={fieldClass}
              />
              <FieldError message={errors.deadline} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="minSalary">Min Salary / Rate</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-500"
                >
                  €
                </span>
                <input
                  id="minSalary"
                  name="minSalary"
                  type="text"
                  inputMode="decimal"
                  placeholder="25"
                  value={form.minSalary}
                  onChange={(event) => update("minSalary", event.target.value)}
                  aria-invalid={Boolean(errors.minSalary) || undefined}
                  className={cn(fieldClass, "pl-7")}
                />
              </div>
              <FieldError message={errors.minSalary} />
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="maxSalary">Max Salary / Rate</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-500"
                >
                  €
                </span>
                <input
                  id="maxSalary"
                  name="maxSalary"
                  type="text"
                  inputMode="decimal"
                  placeholder="40"
                  value={form.maxSalary}
                  onChange={(event) => update("maxSalary", event.target.value)}
                  aria-invalid={Boolean(errors.maxSalary) || undefined}
                  className={cn(fieldClass, "pl-7")}
                />
              </div>
              <FieldError message={errors.maxSalary} />
            </div>

            <div className="space-y-1.5">
              <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
              <SelectField
                id="frequency"
                value={form.frequency}
                onChange={(value) => update("frequency", value)}
              >
                {frequencies.map((frequency) => (
                  <option key={frequency.value} value={frequency.value}>
                    {frequency.label}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>
        </Section>

        {/* ── 3. Responsibilities & requirements ─────────── */}
        <Section step={3} title="Responsibilities & Requirements">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="responsibilities" required>
              Key Responsibilities
            </FieldLabel>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={4}
              placeholder="Describe what the role owns day to day…"
              value={form.responsibilities}
              onChange={(event) =>
                update("responsibilities", event.target.value)
              }
              aria-invalid={Boolean(errors.responsibilities) || undefined}
              className={textareaClass}
            />
            <FieldError message={errors.responsibilities} />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="qualifications" required>
              Qualifications &amp; Requirements
            </FieldLabel>
            <textarea
              id="qualifications"
              name="qualifications"
              rows={4}
              placeholder="List the skills, experience and education candidates need…"
              value={form.qualifications}
              onChange={(event) => update("qualifications", event.target.value)}
              aria-invalid={Boolean(errors.qualifications) || undefined}
              className={textareaClass}
            />
            <FieldError message={errors.qualifications} />
          </div>
        </Section>

        {published && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            Listing validated and ready to publish. The payload was logged to
            the console — wire it up to your jobs API when it&apos;s ready.
          </div>
        )}

        {/* ── Footer actions ─────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <button
            type="submit"
            className="group inline-flex h-11 items-center gap-2 rounded-lg bg-[#5C53FE] px-5 text-sm font-semibold text-white shadow-lg shadow-[#5C53FE]/25 transition-colors hover:bg-[#4b43e8]"
          >
            Publish Job
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </button>
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex h-11 items-center rounded-lg border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
