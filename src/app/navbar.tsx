"use client";
import Image from "next/image";
import { useRef, useState } from "react";
const panels = {
  wiki: { title: "Les guides arrivent bientôt", text: "La version de Minecraft, le modpack et les étapes d’installation seront précisés avant l’ouverture." },
  discord: { title: "Retrouvons-nous bientôt", text: "Le lien du Discord sera publié ici dès que la communauté sera prête à vous accueillir." },
  boutique: { title: "La boutique se prépare", text: "Aucun achat n’est disponible pour le moment. Retrouvez les informations ici à l’ouverture." },
};
type Panel = keyof typeof panels;
function Icon({kind}:{kind:string}) { return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==="home"?<><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/></>:kind==="news"?<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h6M9 18h3"/></>:kind==="book"?<><path d="M12 5v16M3 4c4-1 7 0 9 1 2-1 5-2 9-1v15c-4-1-7 0-9 2-2-2-5-3-9-2z"/></>:kind==="shop"?<><path d="M4 9h16v12H4zM3 9l2-6h14l2 6M9 21v-7h6v7"/></>:<><path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></>}</svg> }
export default function Navbar(){
 const dialog=useRef<HTMLDialogElement>(null);const [panel,setPanel]=useState<Panel>("wiki");const [active,setActive]=useState("accueil");const [open,setOpen]=useState(false);
 function show(p:Panel){setPanel(p);setOpen(false);dialog.current?.showModal();}
 function go(p:string){setActive(p);setOpen(false);}
 return <>
  <header className="topbar"><a href="#accueil" className="wordmark">COBBLEMINE <span>/ L’AVENTURE</span></a><span className="topbar-status">Un nouveau monde se prépare</span><button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label={open?"Fermer le menu":"Ouvrir le menu"} aria-expanded={open} aria-controls="navigation">{open?"✕":"☰"}</button></header>
  <aside className={`sidebar${open?" is-open":""}`}>
   <a className="sidebar-logo" href="#accueil" onClick={()=>go("accueil")}><Image src="/cobblemine-logo-approved.png" alt="Cobblemine, accueil" width={240} height={160} priority/></a>
   <nav id="navigation" aria-label="Navigation principale">
    <a href="#accueil" className={active==="accueil"?"active":""} onClick={()=>go("accueil")} aria-current={active==="accueil"?"location":undefined}><Icon kind="home"/>Accueil</a>
    <a href="#actualites" className={active==="actualites"?"active":""} onClick={()=>go("actualites")} aria-current={active==="actualites"?"location":undefined}><Icon kind="news"/>Actualités</a>
    <button onClick={()=>show("wiki")}><Icon kind="book"/>Guides</button>
    <button onClick={()=>show("discord")}><Icon kind="chat"/>Discord</button>
    <button onClick={()=>show("boutique")}><Icon kind="shop"/>Boutique</button>
   </nav>
   <div className="sidebar-caption"><svg className="compass" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/></svg><p>Des mondes à découvrir.<br/>Une aventure à écrire.</p><small>MINECRAFT JAVA · COBBLEMON</small></div>
  </aside>
  <dialog ref={dialog} className="info-dialog" aria-labelledby="dialog-title" onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><button className="dialog-close" aria-label="Fermer" onClick={()=>dialog.current?.close()}>✕</button><p className="eyebrow">COBBLEMINE</p><h2 id="dialog-title">{panels[panel].title}</h2><p>{panels[panel].text}</p><button className="quiet-button" onClick={()=>dialog.current?.close()}>Compris →</button></dialog>
 </>;
}

