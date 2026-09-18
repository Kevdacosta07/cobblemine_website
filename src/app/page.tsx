import Image from "next/image";
import Navbar from "./navbar";
import PokemonSky from "./pokemon-sky";
import EventsButton from "./events-button";
import ShopSection from "./shop-section";
import SiteFooter from "./site-footer";
import ExclusivesSection from "./exclusives-section";
import JoinSection from "./join-section";
import FaqSection from "./faq-section";
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
      <ExclusivesSection/>
      <JoinSection/>
      <FaqSection/>
    </main><SiteFooter/>
  </>;
}







