import Image from "next/image";

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-main">
        <div className="footer-about">
          <a href="#accueil" className="footer-logo" aria-label="Cobblemine, accueil"><Image src="/cobblemine-logo-approved.png" alt="Cobblemine" width={180} height={120} /></a>
          <p>Votre prochaine aventure Minecraft et Pokémon. Un monde à explorer, des rencontres à partager.</p>
          <span className="footer-status"><span aria-hidden="true" />Ouverture à venir</span>
        </div>
        <nav className="footer-links" aria-label="Explorer Cobblemine">
          <h2>Explorer</h2>
          <a href="#accueil">Accueil</a>
          <a href="#univers">Événements</a>
          <a href="#boutique">Boutique & grades</a>
          <a href="#rejoindre">Rejoindre le serveur</a>
        </nav>
        <nav className="footer-links" aria-label="Informations utiles">
          <h2>Informations</h2>
          <a href="#faq">Questions fréquentes</a>
          <a href="#rejoindre">Installation & modpack</a>
          <a href="https://cobblemon.com" target="_blank" rel="noopener noreferrer">Découvrir Cobblemon <span aria-hidden="true">↗</span></a>
        </nav>
        <div className="footer-community">
          <h2>La communauté</h2>
          <p>Retrouvez bientôt le Discord de Cobblemine pour suivre les annonces et rencontrer les autres joueurs.</p>
          <span className="footer-discord"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 5 5 6 3 17l4 2 1-2m8-12 3 1 2 11-4 2-1-2M7 7c3-1 7-1 10 0M7 16c3 2 7 2 10 0" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>Discord <span>Bientôt</span></span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Cobblemine</p>
        <a href="#accueil" className="footer-top">Retour en haut <span aria-hidden="true">↑</span></a>
      </div>
      <p className="footer-legal">Projet communautaire indépendant, non affilié à Mojang, Microsoft, Nintendo ou The Pokémon Company. Modèles et textures des Pokémon : <a href="https://cobblemon.com">Cobblemon</a>.</p>
    </div>
  </footer>;
}
