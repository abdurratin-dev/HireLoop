"use client";

import { useState, type ReactNode } from "react";
import {
  formatDate,
  formatLocation,
  formatRelativeTime,
} from "@/components/jobs/format";
import { StatusPill } from "./status-pill";
import { StatusSelect } from "./status-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ApplicationRow,
  ApplicationStatus,
} from "@/lib/types/applications";
import { cn } from "@/lib/utils";

const headerCell = "px-4 py-3 text-left text-xs font-medium text-zinc-500";

/** Violet initials tile — matches the dashboard's JobIconTile palette. */
function ApplicantAvatar({ email }: { email: string }) {
  const initial = email.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-full bg-[#5C53FE]/15 text-xs font-semibold text-violet-300"
    >
      {initial}
    </span>
  );
}

/** "seeker1@example.com" — the application record carries no name. */
function ApplicantIdentity({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  return (
    <span className={cn("min-w-0", className)}>
      <a
        href={`mailto:${email}`}
        className="block truncate text-sm font-semibold text-white transition-colors hover:text-violet-300"
      >
        {email}
      </a>
    </span>
  );
}

function AppliedCell({ iso }: { iso: string }) {
  return (
    <time
      dateTime={iso}
      className="whitespace-nowrap text-sm text-zinc-400"
      suppressHydrationWarning
    >
      {formatRelativeTime(iso)}
    </time>
  );
}

/* ── Row / card ───────────────────────────────────────────── */

function ApplicantRow({
  app,
  onStatusChange,
  onDetails,
}: {
  app: ApplicationRow;
  onStatusChange: (app: ApplicationRow, status: ApplicationStatus) => void;
  onDetails: (app: ApplicationRow) => void;
}) {
  return (
    <tr className="transition-colors hover:bg-white/[0.03]">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <ApplicantAvatar email={app.email} />
          <ApplicantIdentity email={app.email} />
        </div>
      </td>

      <td className="px-4 py-3.5">
        <AppliedCell iso={app.appliedAt} />
      </td>

      <td className="px-4 py-3.5">
        <StatusSelect
          value={app.status}
          onChange={(status) => onStatusChange(app, status)}
        />
      </td>

      <td className="px-4 py-3.5 text-right">
        <button
          type="button"
          onClick={() => onDetails(app)}
          className="text-sm font-medium text-white transition-colors underline-offset-4 hover:underline"
        >
          Details
        </button>
      </td>
    </tr>
  );
}

function ApplicantCard({
  app,
  onStatusChange,
  onDetails,
}: {
  app: ApplicationRow;
  onStatusChange: (app: ApplicationRow, status: ApplicationStatus) => void;
  onDetails: (app: ApplicationRow) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <ApplicantAvatar email={app.email} />
        <ApplicantIdentity email={app.email} className="flex-1" />
        <StatusSelect
          value={app.status}
          onChange={(status) => onStatusChange(app, status)}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <AppliedCell iso={app.appliedAt} />
        <button
          type="button"
          onClick={() => onDetails(app)}
          className="text-sm font-medium text-white underline-offset-4 hover:underline"
        >
          Details
        </button>
      </div>
    </div>
  );
}

/* ── Details dialog ───────────────────────────────────────── */

function Detail({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm text-zinc-200">{children}</dd>
    </div>
  );
}

function ApplicantDetailsDialog({
  app,
  onOpenChange,
}: {
  app: ApplicationRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={app !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {app && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <ApplicantAvatar email={app.email} />
                <div className="min-w-0">
                  <DialogTitle className="truncate leading-snug text-white">
                    {app.email}
                  </DialogTitle>
                  <DialogDescription className="truncate">
                    Applied to {app.jobTitle}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <Detail label="Status">
                <StatusPill status={app.status} />
              </Detail>
              <Detail label="Applied">
                <time dateTime={app.appliedAt} suppressHydrationWarning>
                  {formatDate(app.appliedAt.slice(0, 10))}
                </time>
              </Detail>
              <Detail label="Job Type">{app.jobType}</Detail>
              <Detail label="Arrangement">
                {app.arrangement || (app.isRemote ? "Remote" : "On-site")}
              </Detail>
              <Detail label="Location" className="col-span-2">
                {formatLocation({
                  location: app.location,
                  isRemote: app.isRemote,
                })}
              </Detail>
              <Detail label="Deadline">{formatDate(app.deadline)}</Detail>
              <Detail label="Email" className="col-span-2">
                <a
                  href={`mailto:${app.email}`}
                  className="text-violet-300 transition-colors hover:text-violet-200"
                >
                  {app.email}
                </a>
              </Detail>
            </dl>

            <DialogFooter showCloseButton />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Table ────────────────────────────────────────────────── */

/**
 * Applicant review table for one job: desktop table + mobile cards,
 * an inline status dropdown per applicant, and a details dialog.
 * State lives with the caller — `onStatusChange` reports the new status.
 */
export function ApplicantTable({
  applications,
  onStatusChange,
  className,
}: {
  applications: ApplicationRow[];
  onStatusChange: (app: ApplicationRow, status: ApplicationStatus) => void;
  className?: string;
}) {
  const [selected, setSelected] = useState<ApplicationRow | null>(null);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-white/[0.08] bg-[#141416]",
          className,
        )}
      >
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th scope="col" className={headerCell}>
                  Applicant
                </th>
                <th scope="col" className={headerCell}>
                  Applied
                </th>
                <th scope="col" className={headerCell}>
                  Status
                </th>
                <th
                  scope="col"
                  className={cn(headerCell, "text-right")}
                  aria-label="Action"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {applications.map((app) => (
                <ApplicantRow
                  key={app._id}
                  app={app}
                  onStatusChange={onStatusChange}
                  onDetails={setSelected}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-white/[0.06] md:hidden">
          {applications.map((app) => (
            <ApplicantCard
              key={app._id}
              app={app}
              onStatusChange={onStatusChange}
              onDetails={setSelected}
            />
          ))}
        </div>
      </div>

      <ApplicantDetailsDialog
        app={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
