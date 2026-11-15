import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getUsersByList } from "@/lib/actions/api/user-admin";
import type { AdminUserRow } from "@/lib/types/users";
import { UserManagement } from "./_components/user-management";

export const metadata: Metadata = {
  title: "Users | hireloop",
  description:
    "Review, filter, and manage platform access for every hireloop account.",
};

/** Dates arrive as `Date` objects — stringify them for the client tree. */
function toIso(value: unknown): string {
  if (value == null) return "";
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/**
 * Flatten better-auth's user object into the table row. Written loosely
 * on purpose: `premium` is set outside better-auth (payment flow) and
 * legacy docs can carry the old "job-seeker" role default.
 */
function normalizeUser(raw: unknown): AdminUserRow {
  const user = raw as Record<string, unknown>;
  const role = String(user.role ?? "seeker");
  return {
    id: String(user.id ?? user._id ?? ""),
    name: String(user.name ?? "Unnamed user"),
    email: String(user.email ?? ""),
    role: role === "job-seeker" ? "seeker" : role,
    image: user.image ? String(user.image) : null,
    emailVerified: Boolean(user.emailVerified),
    premium: Boolean(user.premium),
    createdAt: toIso(user.createdAt),
    updatedAt: toIso(user.updatedAt),
  };
}

/** Shown when the caller isn't signed in as an admin. */
function AccessDenied() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      <div className="rounded-xl border border-white/[0.08] bg-[#141416] px-6 py-16 text-center">
        <span
          aria-hidden
          className="mx-auto grid size-12 place-items-center rounded-full bg-[#F59E0B]/15"
        >
          <ShieldCheck className="size-5 text-amber-400" />
        </span>
        <h1 className="mt-4 text-base font-semibold text-white">Admins only</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign in with an admin account to manage users.
        </p>
        <Link
          href="/sign-in?redirectTo=/dashboard/admin/users"
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default async function AdminUsersPage() {
  // `listUsers` enforces an admin session server-side; treat any failure
  // (signed out, wrong role, API error) as "no access" instead of a 500.
  let initialUsers: AdminUserRow[] | null = null;
  try {
    const { users } = await getUsersByList();
    initialUsers = users.map(normalizeUser);
  } catch {
    initialUsers = null;
  }

  if (!initialUsers) return <AccessDenied />;
  return <UserManagement initialUsers={initialUsers} />;
}
