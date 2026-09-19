"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import MemberDashboard from "./member-dashboard";
import type {Account} from "@/lib/account";

export default function AccountPanel(){
  const router=useRouter();const [account,setAccount]=useState<Account|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();let loading=false;
    async function refresh(){
      if(loading)return;loading=true;
      try{const r=await fetch('/api/auth/session',{cache:'no-store',signal:controller.signal});if(r.status===401){router.replace('/connexion');return;}if(!r.ok)throw Error();setAccount((await r.json()).account);setError('');}
      catch{if(!controller.signal.aborted)setError('Impossible d’actualiser votre compte pour le moment.');}
      finally{loading=false;}
    }
    void refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')void refresh();},60000);
    return()=>{controller.abort();clearInterval(timer);};
  },[router,attempt]);
  async function logout(){setBusy(true);setError("");try{const r=await fetch('/api/auth/logout',{method:'POST'});if(!r.ok)throw Error();window.location.assign('/connexion');}catch{setError('La déconnexion a échoué. Réessayez.');setBusy(false);}}
  if(!account)return <div className="account-loading" role="status">{error||"Chargement de votre espace…"}{error&&<button className="auth-submit" onClick={()=>{setError('');setAttempt(attempt+1);}}>Réessayer</button>}</div>;
  return <MemberDashboard account={account} error={error} busy={busy} onLogout={logout}/>;
}
