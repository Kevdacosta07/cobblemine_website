"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SkinAvatar from "./skin-avatar";

const information = {
  votes: { title: "Votes bientôt disponibles", text: "Les liens pour soutenir Cobblemine seront ajoutés à l’ouverture du serveur." },
  wiki: { title: "Le wiki se prépare", text: "Les guides du serveur et les informations sur le modpack seront disponibles ici prochainement." },
  discord: { title: "La communauté arrive", text: "Le lien du Discord de Cobblemine sera annoncé dès qu’il sera disponible." },
  boutique: { title: "La boutique se prépare", text: "La boutique n’est pas encore ouverte. Aucun achat n’est disponible pour le moment." },
  panier: { title: "Votre panier est vide", text: "La boutique de Cobblemine sera disponible prochainement." },
};
type Panel = keyof typeof information;

function CartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.2 10h10.9l2-7H6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></svg>;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("boutique");
  const [active, setActive] = useState("accueil");
  const pathname = usePathname();
  const [accountName, setAccountName] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/session', {cache:'no-store', signal:controller.signal}).then(async response => {
      if(response.ok) setAccountName((await response.json()).account.username);
      else if(response.status === 401) setAccountName(null);
    }).catch(() => {});
    return () => controller.abort();
  }, [pathname]);
  const dialog = useRef<HTMLDialogElement>(null);
  function openPanel(next: Panel) { setPanel(next); setMenuOpen(false); dialog.current?.showModal(); }
  function navigate(next: string) { setActive(next); setMenuOpen(false); }
  return <>
    <header className="site-navbar">
      <a className="navbar-logo" href="/#accueil" aria-label="Cobblemine, accueil" onClick={() => navigate("accueil")}><Image src="/cobblemine-logo-approved.png" alt="Cobblemine" width={1536} height={1024} priority sizes="180px" /></a>
      <nav className={`navbar-links${menuOpen ? " is-open" : ""}`} id="main-navigation" aria-label="Navigation principale">
        <a href="/#accueil" className={pathname === "/" && active === "accueil" ? "is-active" : ""} aria-current={pathname === "/" && active === "accueil" ? "location" : undefined} onClick={() => navigate("accueil")}>ACCUEIL</a>
        <a href="/#rejoindre" className={pathname === "/" && active === "rejoindre" ? "is-active" : ""} aria-current={pathname === "/" && active === "rejoindre" ? "location" : undefined} onClick={() => navigate("rejoindre")}>JOUER</a>
        <button onClick={() => openPanel("votes")}>VOTES</button>
        <button onClick={() => openPanel("wiki")}>WIKI</button>
        <button onClick={() => openPanel("discord")}>DISCORD</button>
        <Link className="mobile-account-link" href={accountName?"/compte":"/connexion"} onClick={()=>setMenuOpen(false)}>{accountName?"MON COMPTE":"CONNEXION"}</Link>
      </nav>
      <div className="navbar-actions"><div className="navbar-commerce" role="group" aria-label="Boutique et panier"><button className="shop-button" onClick={() => { setMenuOpen(false); if(pathname!=="/"){window.location.assign("/#boutique");return;} document.getElementById("boutique")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 9h16v11H4zM3 9l2-6h14l2 6M9 20v-7h6v7M3 9c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0" strokeLinejoin="round"/></svg>BOUTIQUE</button><button className="cart-button" aria-label="Ouvrir le panier, 0 article" onClick={() => openPanel("panier")}><CartIcon/><span>0</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true"><path d="m3 4 3 3 3-3"/></svg></button></div><span className="navbar-action-divider" aria-hidden="true"/><Link className="navbar-account" href={accountName?"/compte":"/connexion"} aria-label={accountName?`Mon compte : ${accountName}`:"Se connecter"}>{accountName ? <SkinAvatar key={accountName} username={accountName}/> : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2" strokeLinecap="round"/></svg>}<span>{accountName || "Connexion"}</span></Link><button className="menu-toggle" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button></div>
    </header>
    <dialog className="navbar-dialog" ref={dialog} aria-labelledby="nav-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}><button className="dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()}>✕</button><p className="eyebrow">COBBLEMINE</p><h2 id="nav-dialog-title">{information[panel].title}</h2><p>{information[panel].text}</p><button className="button" onClick={() => dialog.current?.close()}>Compris</button></dialog>
  </>;
}




