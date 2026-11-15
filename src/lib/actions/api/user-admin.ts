// Server-only user administration API.
//
// IMPORTANT: this module imports `auth` (better-auth + the MongoDB driver),
// so it must ONLY be imported from Server Components / route handlers.
// Client-safe helpers (`getUsers`) stay in `./user` — importing them from
// here would pull Node-only code into the client bundle and break pages
// (that exact mistake 500'd the browse-jobs detail page once already).
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/** All platform users, newest name first — powers the admin Users page. */
export const getUsersByList = async () => {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name",
      sortDirection: "desc",
    },
    headers: await headers(),
  });
  return users;
};
