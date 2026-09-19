import {NextResponse} from "next/server";

export async function GET(_request:Request,{params}:{params:Promise<{username:string}>}) {
  const {username}=await params;
  if(!/^[A-Za-z0-9_]{3,16}$/.test(username))return new Response(null,{status:400});
  try {
    // The Cobblemine offline UUID is unrelated to the official skin profile.
    const response=await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username.toLowerCase())}`,{next:{revalidate:3600},signal:AbortSignal.timeout(5000)});
    if(response.status===404||response.status===204)return new Response(null,{status:404,headers:{"Cache-Control":"public, max-age=60"}});
    if(!response.ok)throw new Error("Skin profile unavailable");
    const profile=await response.json();
    if(typeof profile.id!=="string"||!/^[a-f0-9]{32}$/i.test(profile.id))throw new Error("Invalid skin profile");
    return NextResponse.redirect(`https://minotar.net/helm/${profile.id}/64.png`,{status:307,headers:{"Cache-Control":"public, max-age=300"}});
  } catch {
    return new Response(null,{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
