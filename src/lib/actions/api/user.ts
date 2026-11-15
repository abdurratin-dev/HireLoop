const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"

export const getUsers = async(id:string)=>{
    const res = await fetch(`${BASE_URL}/users/${id}/premium`);
    return res.json()
}