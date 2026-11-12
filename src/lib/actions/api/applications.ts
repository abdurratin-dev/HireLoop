// Data-access module for the applications API (Express on :5000).
// Follows the `lib/api/jobs.ts` pattern.

import { ApplicationFormData, ApplicationRow } from "@/lib/types/aplications"



const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// GET /applications?userId=… — placeholder until loading is wired.
export const getApplications = async (query = ""): Promise<ApplicationRow[]> => {
    const res = await fetch(`${BASE_URL}/applications?${query}`)
    return res.json()
}

export const createApplication = async (data: ApplicationFormData) => {
    const res = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    return res.json()
}