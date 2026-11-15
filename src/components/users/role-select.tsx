"use client";

import { ChevronDown } from "lucide-react";
import {
  getRoleMeta,
  ROLE_OPTIONS,
  type UserRole,
} from "@/lib/types/users";
import { cn } from "@/lib/utils";

/**
 * Per-row role toggle: a badge-styled dropdown that can set the user to
 * Seeker / Recruiter / Admin. Controlled — persistence is the caller's
 * job (`onChange` fires with the picked role).
 *
 * Legacy roles outside the union (e.g. old "job-seeker" documents) are
 * shown as-is so the select never renders blank, and can still be
 * switched to any of the three standard roles.
 */
export function RoleSelect({
  value,
  onChange,
  className,
  disabled,
}: {
  value: string;
  onChange: (role: UserRole) => void;
  className?: string;
  disabled?: boolean;
}) {
  const meta = getRoleMeta(value);
  const Icon = meta.icon;
  const isKnownRole = ROLE_OPTIONS.includes(value as UserRole);

  return (
    <span className={cn("relative inline-flex", className)}>
      <Icon
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2"
        style={{ color: meta.color }}
      />
      <select
        aria-label="Change role"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as UserRole)}
        className="h-8 cursor-pointer appearance-none rounded-full border py-1 pl-8 pr-8 text-xs font-medium outline-none transition-colors hover:opacity-80 focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          color: meta.color,
          backgroundColor: `${meta.color}1F`,
          borderColor: `${meta.color}40`,
        }}
      >
        {!isKnownRole && (
          <option value={value} style={{ color: "#fff", backgroundColor: "#141416" }}>
            {meta.label}
          </option>
        )}
        {ROLE_OPTIONS.map((role) => (
          <option
            key={role}
            value={role}
            style={{ color: "#fff", backgroundColor: "#141416" }}
          >
            {getRoleMeta(role).label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 opacity-70"
      />
    </span>
  );
}
