"use client";

import { useRef, useState } from "react";
import Image from "next/image";

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
  const dialog = useRef<HTMLDialogElement>(null);
  function openPanel(next: Panel) { setPanel(next); setMenuOpen(false); dialog.current?.showModal(); }
  function navigate(next: string) { setActive(next); setMenuOpen(false); }
  return <>
    <header className="site-navbar">
      <a className="navbar-logo" href="#accueil" aria-label="Cobblemine, accueil" onClick={() => navigate("accueil")}><Image src="/cobblemine-logo-approved.png" alt="Cobblemine" width={1536} height={1024} priority sizes="180px" /></a>
      <nav className={`navbar-links${menuOpen ? " is-open" : ""}`} id="main-navigation" aria-label="Navigation principale">
        <a href="#accueil" className={active === "accueil" ? "is-active" : ""} aria-current={active === "accueil" ? "location" : undefined} onClick={() => navigate("accueil")}>ACCUEIL</a>
        <a href="#rejoindre" className={active === "rejoindre" ? "is-active" : ""} aria-current={active === "rejoindre" ? "location" : undefined} onClick={() => navigate("rejoindre")}>JOUER</a>
        <button onClick={() => openPanel("votes")}>VOTES</button>
        <button onClick={() => openPanel("wiki")}>WIKI</button>
        <button onClick={() => openPanel("discord")}>DISCORD</button>
      </nav>
      <div className="navbar-actions"><button className="shop-button" onClick={() => { setMenuOpen(false); document.getElementById("boutique")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 9h16v11H4zM3 9l2-6h14l2 6M9 20v-7h6v7M3 9c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0" strokeLinejoin="round"/></svg>BOUTIQUE</button><button className="cart-button" aria-label="Ouvrir le panier, 0 article" onClick={() => openPanel("panier")}><CartIcon/><span>0</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true"><path d="m3 4 3 3 3-3"/></svg></button><button className="menu-toggle" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button></div>
    </header>
    <dialog className="navbar-dialog" ref={dialog} aria-labelledby="nav-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}><button className="dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()}>✕</button><p className="eyebrow">COBBLEMINE</p><h2 id="nav-dialog-title">{information[panel].title}</h2><p>{information[panel].text}</p><button className="button" onClick={() => dialog.current?.close()}>Compris</button></dialog>
  </>;
}




