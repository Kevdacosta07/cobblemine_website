"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import type {Account} from "@/lib/account";

export default function AccountPanel(){
  const router=useRouter();const [account,setAccount]=useState<Account|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{const controller=new AbortController();fetch('/api/auth/session',{cache:'no-store',signal:controller.signal}).then(async r=>{if(r.status===401){router.replace('/connexion');return;}if(!r.ok)throw Error();setAccount((await r.json()).account);}).catch(e=>{if(e.name!=='AbortError')setError('Impossible de charger votre compte pour le moment.');});return()=>controller.abort();},[router,attempt]);
  async function logout(){setBusy(true);setError("");try{const r=await fetch('/api/auth/logout',{method:'POST'});if(!r.ok)throw Error();window.location.assign('/connexion');}catch{setError('La déconnexion a échoué. Réessayez.');setBusy(false);}}
  if(!account)return <div className="account-loading" role="status">{error||"Chargement de votre espace…"}{error&&<button className="auth-submit" onClick={()=>{setError('');setAttempt(attempt+1);}}>Réessayer</button>}</div>;
  return <div className="account-inner">
    <div className="account-heading"><div><p className="auth-kicker">VOTRE ESPACE COBBLEMINE</p><h1>Bonjour, <span>{account.username}.</span></h1><p>Votre identité en jeu et vos avantages, au même endroit.</p></div><button className="account-logout" onClick={logout} disabled={busy}>{busy?'Déconnexion…':'Se déconnecter'} <span aria-hidden="true">↗</span></button></div>
    {error&&<p className="auth-error" role="alert">{error}</p>}
    <div className="account-grid">
      <section className="account-card"><p className="account-label">PSEUDO MINECRAFT</p><h2>{account.username}</h2><p>Votre pseudo est réservé. C’est le nom associé à votre compte pour jouer sur Cobblemine.</p><span className="account-tag">Compte créé</span></section>
      <section className="account-card"><p className="account-label">POINTS BOUTIQUE</p><h2>{new Intl.NumberFormat('fr-FR').format(BigInt(account.points))} <small>points</small></h2><p>Votre solde commun au site et au serveur.</p><Link className="account-link" href="/#boutique">Découvrir la boutique <span aria-hidden="true">→</span></Link></section>
      <section className="account-card"><p className="account-label">VOS GRADES</p>{account.grades.length?account.grades.map(g=><div key={g.grade}><h2>{g.grade}</h2><p>Jusqu’au {new Date(g.expires_at).toLocaleDateString('fr-FR',{timeZone:'UTC'})}</p></div>):<><h2>Dresseur en devenir.</h2><p>Vous n’avez pas encore de grade actif. Vos futurs avantages apparaîtront ici.</p></>}</section>
    </div>
    <div className="account-next"><div><p className="auth-kicker">LA SUITE DE L’AVENTURE</p><h2>Votre compte est prêt.</h2><p>Le serveur est encore en préparation. Les informations pour rejoindre Cobblemine seront annoncées sur le site.</p></div><Link href="/#rejoindre" className="auth-submit">Rejoindre Cobblemine <span aria-hidden="true">→</span></Link></div>
  </div>;
}
