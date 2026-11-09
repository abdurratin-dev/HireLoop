import { FormState } from "@/app/dashboard/recruiter/jobs/new/page";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"

export const creatJob = async(data: FormState)=>{
    const res = await fetch (`${BASE_URL}/jobs`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}