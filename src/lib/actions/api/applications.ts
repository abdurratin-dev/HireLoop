// Data-access module for the applications API (Express on :5000).
// Follows the `lib/actions/api/jobs.ts` pattern.

import type { ApplicationFormData, ApplicationRow } from "@/lib/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"

// GET /applications?userId=… — all of a seeker's applications (unfiltered
// when no query is passed). Placeholder until loading is wired into the
// My Applications page.
export const getApplications = async (query = ""): Promise<ApplicationRow[]> => {
    const res = await fetch(`${BASE_URL}/applications?${query}`)
    return res.json()
}

export const getApplicationsCount = async (query = ""): Promise<{ count: number }> => {
    const res = await fetch(`${BASE_URL}/applications/count?${query}`)
    return res.json()
}

// POST /applications — stores the application (job snapshot + lifecycle).
// Resolves with the Mongo insert result (`insertedId`).
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
