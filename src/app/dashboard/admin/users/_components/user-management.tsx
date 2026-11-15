"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { UserTable } from "@/components/users/user-table";
import {
  getRoleMeta,
  ROLE_OPTIONS,
  type AdminUserRow,
  type UserRole,
} from "@/lib/types/users";
import { updateUserByRole } from "@/lib/actions/api/user";

type RoleFilter = "all" | UserRole;

// Evaluated once per page load — the 24h signup window doesn't need to
// tick live, and keeping it out of render keeps the component pure.
const SIGNUP_CUTOFF = Date.now() - 24 * 60 * 60_000;

const optionStyle = { color: "#fff", backgroundColor: "#141416" };

/**
 * Admin user management view: header + stats + role filter + export,
 * wrapping the user table. Receives normalized rows from the server
 * component above and owns only the (optimistic) role state.
 */
export function UserManagement({
  initialUsers,
}: {
  initialUsers: AdminUserRow[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const stats = useMemo(() => {
    const seekers = users.filter((user) => user.role === "seeker").length;
    const recruiters = users.filter((user) => user.role === "recruiter").length;
    const newToday = users.filter(
      (user) => new Date(user.createdAt).getTime() >= SIGNUP_CUTOFF,
    ).length;
    return { total: users.length, seekers, recruiters, newToday};
  }, [users]);

  const visible = useMemo(
    () =>
      roleFilter === "all"
        ? users
        : users.filter((user) => user.role === roleFilter),
    [users, roleFilter],
  );

  async function handleRoleChange(user: AdminUserRow, role: UserRole) {
    // Optimistic update — the row reacts instantly.
    const userRole = await updateUserByRole(user.id,role);
    console.log(userRole);
    if(userRole.modifiedCount > 0){
      setUsers((rows) =>
      rows.map((row) => (row.id === user.id ? { ...row, role } : row)),
    );
    }
    // TODO: persist to the database later, e.g.
    //   await authClient.admin.setRole({ userId: user.id, role });
    // (`adminClient` is already registered in lib/auth-client.ts) —
    // await it here and roll the optimistic update back on failure.
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6">
      {/* ── Header + controls ───────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            User Management
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-zinc-500">
            Review, filter, and manage platform access for all users.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as RoleFilter)
              }
              className="h-10 cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-3.5 pr-9 text-sm font-medium text-white outline-none transition-colors hover:border-white/25 focus-visible:border-violet-500/60"
            >
              <option value="all" style={optionStyle}>
                All Roles
              </option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role} style={optionStyle}>
                  {getRoleMeta(role).label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.total}
          valueClassName="text-white"
        />
        <StatCard
          label="Job Seekers"
          value={stats.seekers}
          valueClassName="text-emerald-500"
        />
        <StatCard
          label="Recruiters"
          value={stats.recruiters}
          valueClassName="text-violet-400"
        />
        <StatCard
          label="New Signups (24h)"
          value={stats.newToday}
          valueClassName={stats.newToday > 0 ? "text-amber-500" : "text-zinc-500"}
        />
      </div>

      {/* ── Users ───────────────────────────────────────── */}
      {users.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <span
            aria-hidden
            className="mx-auto grid size-12 place-items-center rounded-full bg-[#5C53FE]/15"
          >
            <Users className="size-5 text-violet-300" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-white">
            No users yet
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Accounts show up here as soon as people sign up.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          <h2 className="text-base font-semibold text-white">
            No {getRoleMeta(roleFilter).label} users
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Nobody matches the current role filter.
          </p>
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className="mt-4 text-sm font-medium text-violet-300 transition-colors hover:text-violet-200"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <UserTable
          users={visible}
          onRoleChange={handleRoleChange}
          className="mt-6"
        />
      )}
    </div>
  );
}
