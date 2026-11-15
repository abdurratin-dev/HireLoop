/**
 * Shared user-management domain types — single source of truth for the
 * admin Users page (`dashboard/admin/users`).
 *
 * Mirrors the `lib/types/applications.ts` pattern: vocabulary + meta live
 * here so every component renders the same labels and colors.
 */
import { Briefcase, ShieldCheck, User, type LucideIcon } from "lucide-react";

/** The three assignable roles (see `auth.ts` additionalFields). */
export type UserRole = "seeker" | "recruiter" | "admin";

/**
 * One row of the admin users table — normalized from better-auth's
 * `listUsers` result (dates stringified for RSC serialization, optional
 * fields defaulted).
 *
 * `role` is a plain string on purpose: legacy documents may hold values
 * outside the union (e.g. the old "job-seeker" default).
 */
export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  emailVerified: boolean;
  premium: boolean;
  /** ISO timestamp — rendered as "Oct 12, 2026". */
  createdAt: string;
  /** ISO timestamp — shown in the details dialog. */
  updatedAt: string;
};

/** Options shown in the role filter and each row's role dropdown. */
export const ROLE_OPTIONS: UserRole[] = ["seeker", "recruiter", "admin"];

/** Label + color + icon per role — same palette style as STATUS_META. */
export const ROLE_META: Record<
  UserRole,
  { label: string; color: string; icon: LucideIcon }
> = {
  seeker: { label: "Seeker", color: "#A1A4AA", icon: User },
  recruiter: { label: "Recruiter", color: "#5C53FE", icon: Briefcase },
  admin: { label: "Admin", color: "#F59E0B", icon: ShieldCheck },
};

/** Safe lookup — unknown/legacy roles fall back to a neutral badge. */
export function getRoleMeta(role: string) {
  return (
    ROLE_META[role as UserRole] ?? {
      label: role || "Unknown",
      color: "#A1A4AA",
      icon: User,
    }
  );
}
