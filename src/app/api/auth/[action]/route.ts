import { NextRequest } from "next/server";
import { api, checkOrigin, clearSession, failed, json, readBody, session, setSession } from "@/lib/auth-server";

export async function POST(request: NextRequest, context: {params: Promise<{action:string}>}) {
  try {
    checkOrigin(request);
    const {action} = await context.params;
    if (!['register','login','logout'].includes(action)) return json({message:"Page introuvable."},404);
    if(action === 'logout') {
      const token = await session();
      if(token) {
        const response = await api('/v1/auth/logout',{method:'POST',session:token,request});
        if(!response.ok && response.status !== 401) return json({message:"Déconnexion indisponible. Réessayez."},503);
      }
      await clearSession();return json({ok:true});
    }
    const body = await readBody(request);
    const response = await api(`/v1/auth/${action}`,{method:'POST',body,request});
    const data = await response.json();
    if(!response.ok) return json({message:data.message || "La demande n’a pas abouti.",error:data.error,fields:data.fields},response.status);
    if(action === 'login') {
      await setSession(data.accessToken,data.expiresAt);
      return json({account:data.account});
    }
    return json({ok:true,username:data.username},201);
  } catch(error) { return failed(error); }
}
