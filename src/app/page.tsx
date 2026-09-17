import Image from "next/image";
import Navbar from "./navbar";
const questions = [
  ["Quand ouvrira Cobblemine ?", "La date d’ouverture n’a pas encore été annoncée. Elle sera affichée ici dès qu’elle sera confirmée."],
  ["Comment rejoindre le serveur ?", "L’adresse du serveur et les instructions d’installation seront ajoutées dans la section « Nous rejoindre ». La version de Minecraft et le modpack seront précisés à ce moment-là."],
  ["Où trouver le Discord ?", "Le lien d’invitation de la communauté sera publié ici dès qu’il sera disponible."],
];
function Brand() {return <a className="brand" href="#accueil" aria-label="Cobblemine, accueil"><Image src="/cobblemine-logo-pokeball.png" alt="Cobblemine" width={150} height={100} /></a>;}
export default function Home() {
  return <>
    <a href="#contenu" className="skip-link">Aller au contenu</a>
    <Navbar/>
    <main id="contenu">
      <section className="hero" id="accueil" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow">MINECRAFT × COBBLEMON</p><span className="badge">UN NOUVEAU MONDE SE PRÉPARE</span><h1 id="hero-title">Chaque rencontre.<br/>Une nouvelle<br/><em>aventure.</em></h1><p className="intro">Le monde de Minecraft. La magie des Pokémon.<br/>Et bientôt, votre histoire sur Cobblemine.</p><a className="button" href="#univers">Découvrir Cobblemine <span aria-hidden="true">↗</span></a><p className="hero-note">Ouverture à venir · L’aventure commence ici</p></div>
        <figure className="hero-visual"><Image src="/cobblemon-hero.png" alt="Pandespiègle et Pandarbare dans un jardin de bambous et de cerisiers du mod Cobblemon" fill priority sizes="(max-width: 700px) 100vw, 62vw"/><figcaption><span>BIENVENUE DANS L’UNIVERS COBBLEMON</span><a href="https://modrinth.com/mod/cobblemon/gallery" target="_blank" rel="noreferrer">Visuel du mod Cobblemon ↗</a></figcaption></figure>
        <div className="hero-bottom"><span>CONSTRUIRE. EXPLORER. RENCONTRER.</span><a href="#univers">DÉFILER <span aria-hidden="true">↓</span></a></div>
      </section>
      <section className="section universe" id="univers" aria-labelledby="universe-title"><div className="section-heading"><div><p className="eyebrow">BIENVENUE CHEZ VOUS</p><h2 id="universe-title">Un monde de blocs.<br/><span>Des liens pour de vrai.</span></h2></div><p>Un point de rencontre pour les explorateurs, les bâtisseurs et les dresseurs. Cobblemine prépare le terrain pour votre prochaine aventure Cobblemon.</p></div><div className="features"><article><span className="feature-label">EXPLORER</span><h3>Suivez votre curiosité.</h3><p>Une forêt à traverser, un sommet à atteindre, un endroit où poser vos premiers blocs. Chaque détour fait partie du voyage.</p></article><article><span className="feature-label">RENCONTRER</span><h3>Trouvez vos compagnons.</h3><p>Redécouvrez Minecraft avec les Pokémon de Cobblemon. Votre prochaine rencontre pourrait devenir votre préférée.</p></article><article><span className="feature-label">PARTAGER</span><h3>Écrivez votre histoire.</h3><p>Un camp de base, une équipe, des aventures entre amis. Imaginez dès maintenant votre place dans ce nouveau monde.</p></article></div></section>
      <section className="join" id="rejoindre" aria-labelledby="join-title"><div><p className="eyebrow">LE DÉBUT D’UNE BELLE HISTOIRE</p><h2 id="join-title">Votre prochaine aventure<br/>est en préparation.</h2><p className="join-description">Encore un peu de patience, dresseur. Les informations pour rejoindre Cobblemine seront ajoutées ici dès qu’elles seront prêtes.</p><span className="badge">OUVERTURE À VENIR</span></div><dl className="join-details">{[["↗","Adresse du serveur","Bientôt disponible"],["#","Discord de la communauté","Le lien sera annoncé ici"],["+","Version & modpack","Les détails arrivent bientôt"]].map(([icon,title,text])=><div key={title}><span className="detail-icon" aria-hidden="true">{icon}</span><div><dt>{title}</dt><dd>{text}</dd></div><span className="pending">À venir</span></div>)}</dl></section>
      <section className="section faq" id="faq" aria-labelledby="faq-title"><div><p className="eyebrow">AVANT LE PREMIER PAS</p><h2 id="faq-title">Des questions ?</h2></div><div className="questions">{questions.map(([q,a])=><details name="faq" key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    </main><footer><Brand/><p>Une aventure à construire ensemble.</p><a className="back-top" href="#accueil">Retour en haut ↑</a><small>Projet communautaire indépendant. Non affilié à Mojang, Microsoft, Nintendo ou The Pokémon Company. Illustration : <a href="https://modrinth.com/mod/cobblemon/gallery">galerie officielle Cobblemon</a> ; ne représente pas le serveur.</small></footer>
  </>;
}



