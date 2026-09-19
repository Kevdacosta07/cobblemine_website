"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import type {Account} from "@/lib/account";
import {gradePresentation} from "@/lib/grades";
import MemberInformation from "./member-information";

function Icon({name}:{name:string}) {return <span className="member-icon" aria-hidden="true" style={{maskImage:`url(/member-assets/icons/${name}.svg)`,WebkitMaskImage:`url(/member-assets/icons/${name}.svg)`}}/>;}

export default function MemberDashboard({account,error,busy,onLogout}:{account:Account;error:string;busy:boolean;onLogout:()=>void}) {
  const [view,setView]=useState<"overview"|"grades"|"profile">("overview");
  const activeGrades=account.grades.filter(g=>Date.parse(g.expires_at)>Date.now()).sort((a,b)=>(gradePresentation[b.grade]?.priority||0)-(gradePresentation[a.grade]?.priority||0));
  const presentation=gradePresentation[activeGrades[0]?.grade]||gradePresentation.aventurier;
  const gradeIcon=<Image src={`/grades/${presentation.image}`} width={40} height={40} alt={`Poké Ball du grade ${presentation.name}`}/>;
  const grades=<>{activeGrades.length ? activeGrades.map(g=><div className="member-grade" key={g.grade}><h3>{gradePresentation[g.grade]?.name||g.grade}</h3><p>Actif jusqu’au {new Date(g.expires_at).toLocaleDateString('fr-FR',{timeZone:'UTC'})}</p></div>) : <><h3>Aventurier</h3><p>Aucun grade payant actif.</p></>}</>;
  const profile=<MemberInformation account={account}/>;
  return <div className="member-inner">
    <div className="member-heading"><h1>Mon espace</h1><p>Retrouvez votre profil et vos avantages.</p></div>
    <div className="member-layout">
      <aside className="member-sidebar">
        <div className="member-identity"><Image src="/member-assets/adventurer-avatar.png" width={480} height={480} alt="Aventurier Minecraft — illustration de profil" priority sizes="(max-width: 760px) 64px, 230px"/><h2>{account.username}</h2><p>Profil Minecraft</p></div>
        <nav aria-label="Navigation de l’espace membre" className="member-navigation">
          <button aria-current={view==='overview'?'page':undefined} onClick={()=>setView('overview')}><Icon name="home"/>Vue d’ensemble</button>
          <button aria-current={view==='grades'?'page':undefined} onClick={()=>setView('grades')}><Icon name="shield"/>Mes grades</button>
          <button aria-current={view==='profile'?'page':undefined} onClick={()=>setView('profile')}><Icon name="settings"/>Mon compte</button>
          {account.roles.some(r=>r.role==='admin'&&(!r.expires_at||Date.parse(r.expires_at)>Date.now()))&&<Link href="/admin" className="member-logout"><Icon name="shield"/>Administration</Link>}
        </nav>
        <button className="member-logout" onClick={onLogout} disabled={busy}><Icon name="logout"/>{busy?'Déconnexion…':'Se déconnecter'}</button>
      </aside>
      <div className="member-content">
        {error&&<p className="auth-error" role="alert">{error}</p>}
        <div className="member-welcome"><h2>{view==='overview'?`Bonjour, ${account.username}.`:view==='grades'?'Mes grades':'Mon compte'}</h2><p>{view==='overview'?'Voici un aperçu de votre compte et de vos avantages sur Cobblemine.':view==='grades'?'Retrouvez vos grades actifs et leur date d’expiration.':'Votre identité sur Cobblemine.'}</p></div>
        {view==='overview'&&<>
          <section className="member-banner"><Image src="/member-assets/launcher-landscape.png" alt="" fill sizes="(max-width: 760px) 100vw, 850px" priority/><div className="member-banner-copy"><h2>Prêt pour votre prochaine aventure ?</h2><p>Le launcher sera disponible à l’ouverture.</p><div className="member-banner-actions"><Link href="/#rejoindre" className="member-primary"><Icon name="download"/>Découvrir le launcher</Link><span>Bientôt disponible</span></div></div></section>
          <div className="member-summary">
            <section className="member-summary-card"><span className="member-card-icon member-points-art"><Image src="/member-assets/shop-points.png" width={72} height={72} sizes="72px" alt=""/></span><div><h2>Points boutique</h2><h3>{new Intl.NumberFormat('fr-FR').format(BigInt(account.points))} points</h3><p>Votre solde sur Cobblemine.</p><Link href="/#boutique">Voir la boutique <Icon name="arrow-right"/></Link></div></section>
            <section className="member-summary-card"><span className="member-card-icon">{gradeIcon}</span><div><h2>Mon grade</h2>{grades}<Link href="/#boutique">Découvrir les grades <Icon name="arrow-right"/></Link></div></section>
          </div>{profile}
        </>}
        {view==='grades'&&<section className="member-grades-panel"><span className="member-card-icon">{gradeIcon}</span>{grades}<Link className="member-primary" href="/#boutique">Découvrir les grades <Icon name="arrow-right"/></Link></section>}
        {view==='profile'&&profile}
      </div>
    </div>
  </div>;
}
