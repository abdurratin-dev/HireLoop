"use client";

import { useState } from "react";
import { formatDate } from "@/components/jobs/format";
import { RoleSelect } from "./role-select";
import { Detail } from "@/components/ui/detail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getRoleMeta, type AdminUserRow, type UserRole } from "@/lib/types/users";
import { cn } from "@/lib/utils";

const headerCell = "px-4 py-3 text-left text-xs font-medium text-zinc-500";

/** "Oct 12, 2026" — or a dash for documents missing a timestamp. */
const joinDate = (iso: string) => (iso ? formatDate(iso.slice(0, 10)) : "—");

/** Photo when the account has one, otherwise violet initials. */
function UserAvatar({ user }: { user: AdminUserRow }) {
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <Avatar className="size-9">
      {user.image && <AvatarImage src={user.image} alt="" />}
      <AvatarFallback className="bg-[#5C53FE]/15 text-xs font-semibold text-violet-300">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

/** Free / Premium — driven by the `premium` flag the payment flow sets. */
function PlanPill({ premium }: { premium: boolean }) {
  console.log(premium);
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        color: premium ? "#22C55E" : "#A1A4AA",
        backgroundColor: premium ? "#22C55E1F" : "#A1A4AA1F",
      }}
    >
      {premium ? "Premium" : "Free"}
    </span>
  );
}

/* ── Row / card ───────────────────────────────────────────── */

function UserRow({
  user,
  onRoleChange,
  onDetails,
}: {
  user: AdminUserRow;
  onRoleChange: (user: AdminUserRow, role: UserRole) => void;
  onDetails: (user: AdminUserRow) => void;
}) {
  return (
    <tr className="transition-colors hover:bg-white/[0.03]">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">
              {user.name}
            </span>
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5 text-sm text-zinc-300">
        <a
          href={`mailto:${user.email}`}
          className="block truncate transition-colors hover:text-violet-300"
        >
          {user.email}
        </a>
      </td>

      <td className="px-4 py-3.5">
        <RoleSelect
          value={user.role}
          onChange={(role) => onRoleChange(user, role)}
        />
      </td>

      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-zinc-400">
        <time dateTime={user.createdAt} suppressHydrationWarning>
          {joinDate(user.createdAt)}
        </time>
      </td>

      <td className="px-4 py-3.5">
        <PlanPill premium={user.premium} />
      </td>

      <td className="px-4 py-3.5 text-right">
        <button
          type="button"
          onClick={() => onDetails(user)}
          className="text-sm font-medium text-white transition-colors underline-offset-4 hover:underline"
        >
          Details
        </button>
      </td>
    </tr>
  );
}

function UserCard({
  user,
  onRoleChange,
  onDetails,
}: {
  user: AdminUserRow;
  onRoleChange: (user: AdminUserRow, role: UserRole) => void;
  onDetails: (user: AdminUserRow) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">
            {user.name}
          </span>
          <span className="block truncate text-xs text-zinc-500">
            {user.email}
          </span>
        </span>
        <PlanPill premium={user.premium} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <RoleSelect
          value={user.role}
          onChange={(role) => onRoleChange(user, role)}
        />
        <div className="flex items-center gap-3">
          <time
            dateTime={user.createdAt}
            className="text-xs text-zinc-500"
            suppressHydrationWarning
          >
            {joinDate(user.createdAt)}
          </time>
          <button
            type="button"
            onClick={() => onDetails(user)}
            className="text-sm font-medium text-white underline-offset-4 hover:underline"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Details dialog ───────────────────────────────────────── */

function UserDetailsDialog({
  user,
  onOpenChange,
}: {
  user: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={user !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {user && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <DialogTitle className="truncate leading-snug text-white">
                    {user.name}
                  </DialogTitle>
                  <DialogDescription className="truncate">
                    {user.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <Detail label="Role">
                <span style={{ color: getRoleMeta(user.role).color }}>
                  {getRoleMeta(user.role).label}
                </span>
              </Detail>
              <Detail label="Plan">
                {user.premium ? "Premium" : "Free"}
              </Detail>
              <Detail label="Email Verified">
                {user.emailVerified ? "Yes" : "No"}
              </Detail>
              <Detail label="Joined">
                <time dateTime={user.createdAt}>
                  {joinDate(user.createdAt)}
                </time>
              </Detail>
              <Detail label="Last Updated" className="col-span-2">
                <time dateTime={user.updatedAt}>
                  {formatDate(user.updatedAt.slice(0, 10))}
                </time>
              </Detail>
              <Detail label="User ID" className="col-span-2">
                <span className="font-mono text-xs">{user.id}</span>
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
 * User-management table: desktop table + mobile cards, a role dropdown
 * per row, and a details dialog. State stays with the caller —
 * `onRoleChange` reports the picked role.
 */
export function UserTable({
  users,
  onRoleChange,
  className,
}: {
  users: AdminUserRow[];
  onRoleChange: (user: AdminUserRow, role: UserRole) => void;
  className?: string;
}) {
  const [selected, setSelected] = useState<AdminUserRow | null>(null);

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
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th scope="col" className={headerCell}>
                  User Name
                </th>
                <th scope="col" className={headerCell}>
                  Email Address
                </th>
                <th scope="col" className={headerCell}>
                  Role
                </th>
                <th scope="col" className={headerCell}>
                  Join Date
                </th>
                <th scope="col" className={headerCell}>
                  Plan
                </th>
                <th
                  scope="col"
                  className={cn(headerCell, "text-right")}
                  aria-label="Action"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onRoleChange={onRoleChange}
                  onDetails={setSelected}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-white/[0.06] md:hidden">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onRoleChange={onRoleChange}
              onDetails={setSelected}
            />
          ))}
        </div>
      </div>

      <UserDetailsDialog
        user={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
