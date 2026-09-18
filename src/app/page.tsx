import Image from "next/image";
import Navbar from "./navbar";
import PokemonSky from "./pokemon-sky";
import EventsButton from "./events-button";
import ShopSection from "./shop-section";
import SiteFooter from "./site-footer";
const questions = [
  ["Quand ouvrira Cobblemine ?", "La date d’ouverture n’a pas encore été annoncée. Elle sera affichée ici dès qu’elle sera confirmée."],
  ["Comment rejoindre le serveur ?", "L’adresse du serveur et les instructions d’installation seront ajoutées dans la section « Nous rejoindre ». La version de Minecraft et le modpack seront précisés à ce moment-là."],
  ["Où trouver le Discord ?", "Le lien d’invitation de la communauté sera publié ici dès qu’il sera disponible."],
];
export default function Home() {
  return <>
    <a href="#contenu" className="skip-link">Aller au contenu</a>
    <Navbar/>
    <main id="contenu">
      <section className="hero" id="accueil" aria-labelledby="hero-title">
        <div className="hero-copy"><h1 id="hero-title">Partez à l’aventure<br/>sur <span className="hero-brand-gradient">Cobblemine</span>.</h1><p className="intro">Cobblemine est un serveur Minecraft en préparation qui réunit la liberté de construire et d’explorer avec les Pokémon du mod Cobblemon. Parcourez les biomes à leur rencontre, capturez vos compagnons et faites grandir votre équipe au fil de vos découvertes. Installez votre base, partez en expédition et partagez vos aventures avec d’autres joueurs : à vous de choisir comment écrire votre histoire.</p><a className="button" href="#rejoindre">Nous rejoindre <span aria-hidden="true">→</span></a></div>
        <PokemonSky/>
        
      </section>
      <section className="events-section" id="univers" aria-labelledby="events-title">
        <div className="events-card">
          <Image className="events-backdrop" src="/events-cave.png" alt="" fill sizes="(max-width: 700px) 90vw, 1120px" />
          <div className="events-content">
            <p className="events-label">ÉVÉNEMENTS SPÉCIAUX</p>
            <h2 id="events-title">Retrouvons-nous<br/>pour la prochaine aventure.</h2>
            <p className="events-description">Les événements spéciaux de Cobblemine seront l’occasion de se retrouver, de relever des défis et de partager des moments entre joueurs. Le programme et les dates seront annoncés ici à l’approche de l’ouverture.</p>
            <EventsButton/>
          </div>
        </div>
      </section>
      <ShopSection/>
      <section className="join" id="rejoindre" aria-labelledby="join-title"><div><p className="eyebrow">LE DÉBUT D’UNE BELLE HISTOIRE</p><h2 id="join-title">Votre prochaine aventure<br/>est en préparation.</h2><p className="join-description">Encore un peu de patience, dresseur. Les informations pour rejoindre Cobblemine seront ajoutées ici dès qu’elles seront prêtes.</p><span className="badge">OUVERTURE À VENIR</span></div><dl className="join-details">{[["↗","Adresse du serveur","Bientôt disponible"],["#","Discord de la communauté","Le lien sera annoncé ici"],["+","Version & modpack","Les détails arrivent bientôt"]].map(([icon,title,text])=><div key={title}><span className="detail-icon" aria-hidden="true">{icon}</span><div><dt>{title}</dt><dd>{text}</dd></div><span className="pending">À venir</span></div>)}</dl></section>
      <section className="section faq" id="faq" aria-labelledby="faq-title"><div><p className="eyebrow">AVANT LE PREMIER PAS</p><h2 id="faq-title">Des questions ?</h2></div><div className="questions">{questions.map(([q,a])=><details name="faq" key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    </main><SiteFooter/>
  </>;
}







