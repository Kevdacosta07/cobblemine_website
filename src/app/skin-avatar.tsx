"use client";

import Image from "next/image";
import {useState} from "react";

export default function SkinAvatar({username}:{username:string}) {
  const [failed,setFailed]=useState(false);
  if(failed) return <svg className="navbar-skin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>;
  return <Image className="navbar-skin" src={`/api/skin/${encodeURIComponent(username)}`} width={30} height={30} alt="" unoptimized referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>;
}
