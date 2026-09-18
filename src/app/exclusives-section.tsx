"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const Viewer = dynamic(() => import("./exclusive-viewer"), { ssr: false, loading: () => <div className="exclusive-model"><p className="exclusive-loading">Chargement de l’aperçu…</p></div> });
const pokemon = [
  { id: "pikachu", name: "Pikachu", type: "Électrik" },
  { id: "charizard", name: "Dracaufeu", type: "Feu · Vol" },
  { id: "eevee", name: "Évoli", type: "Normal" },
  { id: "bulbasaur", name: "Bulbizarre", type: "Plante · Poison" },
  { id: "squirtle", name: "Carapuce", type: "Eau" },
  { id: "gengar", name: "Ectoplasma", type: "Spectre · Poison" },
  { id: "jigglypuff", name: "Rondoudou", type: "Normal · Fée" },
  { id: "lucario", name: "Lucario", type: "Combat · Acier" },
  { id: "mewtwo", name: "Mewtwo", type: "Psy" },
  { id: "psyduck", name: "Psykokwak", type: "Eau" },
  { id: "snorlax", name: "Ronflex", type: "Normal" },
];

export default function ExclusivesSection() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [shiny, setShiny] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [direction, setDirection] = useState(1);
  const item = pokemon[index];
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "180px" });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  function move(step: number) {
    if (phase !== "idle") return;
    setDirection(step);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(current => (current + step + pokemon.length) % pokemon.length);
      setShiny(false);
    } else setPhase("exit");
  }
  function finishAnimation() {
    if (phase === "exit") {
      setPhase("waiting");
      setIndex(current => (current + direction + pokemon.length) % pokemon.length);
      setShiny(false);
    } else if (phase === "enter") setPhase("idle");
  }
  return <section ref={section} className="exclusives-section exclusive-carousel-section exclusive-solo" id="exclusifs" aria-labelledby="exclusives-title">
    <div className="exclusives-inner">
      <div className="exclusive-carousel-heading"><div><p className="shop-label">COLLECTION DE NOËL · 11 POKÉMON</p><h2 id="exclusives-title">Des rencontres exclusives.</h2><p>Vos Pokémon préférés, dans des versions créées pour le serveur.</p></div></div>
      <div className="exclusive-solo-stage" role="region" aria-roledescription="carrousel" aria-label="Pokémon exclusifs" tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        <button className="exclusive-solo-arrow previous" aria-label="Pokémon précédent" aria-disabled={phase !== "idle"} onClick={() => move(-1)}>←</button>
        <div className={`exclusive-solo-model slide-${phase} direction-${direction > 0 ? "next" : "previous"}`} onAnimationEnd={event => { if (event.target === event.currentTarget) finishAnimation(); }}>{visible ? <Viewer key={item.id} species={item.id} shiny={shiny} name={item.name} onReady={() => setPhase(current => current === "waiting" ? "enter" : current)}/> : <div className="exclusive-model"/>}</div>
        <button className="exclusive-solo-arrow next" aria-label="Pokémon suivant" aria-disabled={phase !== "idle"} onClick={() => move(1)}>→</button>
      </div>
      <div className="exclusive-solo-caption">
        <div aria-live="polite" aria-atomic="true"><p className="exclusive-solo-count">{index + 1} / {pokemon.length}</p><h3>{item.name}</h3><p className="exclusive-solo-type">{item.type}</p></div>
        <button className="exclusive-shiny" disabled={phase !== "idle"} aria-pressed={shiny} onClick={() => setShiny(!shiny)} aria-label={`Afficher ${item.name} ${shiny ? "original" : "chromatique"}`}>✦ {shiny ? "Chromatique" : "Voir le chromatique"}</button>
        <a className="exclusive-shop-link" href="#boutique">Aller vers la boutique <span aria-hidden="true">→</span></a>
      </div>
      <div className="exclusive-carousel-bottom"><p>Faites glisser le Pokémon pour le tourner · Double-clic pour recentrer.</p><a href="/exclusives/CREDITS-Collection-Noel.txt" target="_blank" rel="noopener noreferrer">Crédits des créations ↗</a></div>
    </div>
  </section>;
}
