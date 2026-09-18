import Navbar from "./navbar";
const questions=[
 ["Quand ouvrira Cobblemine ?","La date d’ouverture n’a pas encore été annoncée. Elle sera publiée ici dès qu’elle sera confirmée."],
 ["Comment rejoindre le serveur ?","L’adresse du serveur, le modpack et les instructions d’installation seront ajoutés ici avant l’ouverture."],
 ["Où trouver le Discord ?","Le lien d’invitation sera publié dès qu’il sera disponible."],
];
export default function Home(){return <div className="site-shell">
 <a className="skip-link" href="#contenu">Aller au contenu</a><Navbar/>
 <main id="contenu">
  <section className="hero" id="accueil" aria-labelledby="hero-title">
   <div className="hero-copy"><p className="eyebrow">LE DÉBUT DE TON EXPÉDITION</p><h1 id="hero-title">L’aventure<br/>commence ici<span>.</span></h1><p className="hero-intro">Des mondes à explorer,<br/>des histoires à vivre,<br/>ensemble.</p><a className="hero-link" href="#univers">Découvrir Cobblemine <span aria-hidden="true">→</span></a></div>
   <div className="hero-foot"><span>L’INCONNU T’ATTEND</span><span>Minecraft 1.21.1 <i>·</i> Cobblemon</span></div>
  </section>
  <a className="journal" href="#univers" id="actualites"><div><p className="eyebrow">LE CARNET D’AVENTURE</p><h2>Prochaine escale : Cobblemine.</h2><p>Découvre l’univers qui prend forme.</p></div><span className="circle-arrow" aria-hidden="true">→</span></a>
  <div className="play-strip"><div><span className="status-dot"/><p>Prêt pour l’aventure ?<small>Le serveur se prépare à t’accueillir.</small></p></div><a className="play-button" href="#rejoindre"><span aria-hidden="true">▶</span> JOUER <span aria-hidden="true">→</span></a></div>
  <section className="content-section" id="univers"><p className="eyebrow">UN MONDE À PARTAGER</p><h2>Les blocs. Les Pokémon.<br/>Et toi, au milieu de tout ça.</h2><div className="feature-grid"><article><h3>Explorer</h3><p>Une forêt à traverser, un sommet à atteindre, un endroit où poser tes premiers blocs. Chaque détour fait partie du voyage.</p></article><article><h3>Rencontrer</h3><p>Retrouve les Pokémon de Cobblemon au cœur de Minecraft. Ta prochaine rencontre pourrait devenir ta préférée.</p></article><article><h3>Construire ensemble</h3><p>Un camp de base, une équipe, des aventures entre amis. Imagine dès maintenant ta place dans ce nouveau monde.</p></article></div></section>
  <section className="content-section join" id="rejoindre"><div><p className="eyebrow">ON PRÉPARE TON ARRIVÉE</p><h2>Encore un peu<br/>de patience.</h2><p>Les informations pour rejoindre Cobblemine seront annoncées ici.</p></div><dl>{[["Ouverture","Date à venir"],["Adresse du serveur","Bientôt disponible"],["Minecraft","1.21.1"],["Modpack","Bientôt disponible"],["Discord","Lien à venir"]].map(([title,value])=><div key={title}><dt>{title}</dt><dd>{value}</dd></div>)}</dl></section>
  <section className="content-section faq"><p className="eyebrow">AVANT DE PARTIR</p><h2>Des questions ?</h2>{questions.map(([q,a])=><details key={q} name="faq"><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</section>
  <footer><span>COBBLEMINE</span><p>Une aventure à construire ensemble.</p><a href="#accueil">Retour en haut ↑</a><small>Projet communautaire indépendant. Non affilié à Mojang, Microsoft, Nintendo ou The Pokémon Company.</small></footer>
 </main>
</div>}

