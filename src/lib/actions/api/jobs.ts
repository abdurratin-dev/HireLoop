const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"

export const getJobs = async(quary : string)=>{
    const res = await fetch(`${BASE_URL}/jobs?${quary}`);
    return res.json()
}

export const getJob = async(id:string)=>{
    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    if (!res.ok) return null;
    return res.json()
}

export const deleteJob = async(id:string)=>{
    const res = await fetch(`${BASE_URL}/jobs/${id}`,{
        method: 'DELETE'
    });
    return res.json()
}