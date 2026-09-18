import { NextRequest } from "next/server";
import {api, clearSession, failed, json, session} from "@/lib/auth-server";
export async function GET(request: NextRequest) {
  try {
    const token = await session();
    if(!token) return json({account:null},401);
    const response = await api('/v1/me',{session:token,request});
    if(response.status === 401) { await clearSession(); return json({account:null},401); }
    if(!response.ok) return json({message:"Votre compte est momentanément indisponible."},503);
    return json({account:await response.json()});
  } catch(error) { return failed(error); }
}
