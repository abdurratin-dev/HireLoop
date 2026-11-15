// Client-safe user helpers — plain fetches, no server-only imports.

import { UserRole } from "@/lib/types/users";

// (`getUsersByList` lives in `./user-admin` because it needs better-auth.)
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const getUsers = async (id: string) => {
  const res = await fetch(`${BASE_URL}/users/${id}/premium`);
  return res.json();
};

export const updateUserByRole = async(id:string , role:UserRole)=>{
    const res = await fetch(`${BASE_URL}/users/${id}/role`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({role : role}),
    })
    return res.json()
}