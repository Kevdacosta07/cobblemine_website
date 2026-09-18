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

function TypeBadges({ types }: { types: string }) {
  return <span className="pokemon-type-badges">{types.split(" · ").map(type => <span key={type} className="pokemon-type-badge" data-type={type}>{type}</span>)}</span>;
}

function PokemonThumbnail({ item }: { item: typeof pokemon[number] }) {
  const host = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShown(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <span ref={host} className="exclusive-list-thumbnail" aria-hidden="true">{shown && <Viewer species={item.id} shiny={false} name={item.name} interactive={false}/>}</span>;
}

export default function ExclusivesSection() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [shiny, setShiny] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [direction, setDirection] = useState(1);
  const target = useRef(0);
  const item = pokemon[index];
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "180px" });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  function select(next: number) {
    if (phase !== "idle" || next === index) return;
    target.current = next;
    setDirection(next > index ? 1 : -1);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(next);
      setShiny(false);
    } else setPhase("exit");
  }
  function finishAnimation() {
    if (phase === "exit") {
      setPhase("waiting");
      setIndex(target.current);
      setShiny(false);
    } else if (phase === "enter") setPhase("idle");
  }
  return <section ref={section} className="exclusives-section exclusive-carousel-section exclusive-solo exclusive-browser" id="exclusifs" aria-labelledby="exclusives-title">
    <div className="exclusive-snow" aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => <span key={i} className={i % 7 === 0 ? "snow-particle snow-spark" : "snow-particle"} style={{ left: `${(i * 37 + 11) % 100}%`, width: `${i % 3 + 2}px`, height: `${i % 3 + 2}px`, animationDuration: `${14 + i % 9 * 2}s`, animationDelay: `${-i * 1.7}s`, opacity: .15 + i % 4 * .1 }}/>) }
    </div>
    <div className="exclusives-inner">
      <div className="exclusive-carousel-heading"><div><p className="shop-label">COLLECTION DE NOËL · 11 POKÉMON</p><h2 id="exclusives-title">Des rencontres exclusives.</h2><p>Vos Pokémon préférés, dans des versions créées pour le serveur.</p></div></div>
      <div className="exclusive-browser-layout">
      <div className="exclusive-featured">
      <div className="exclusive-solo-stage" id="exclusive-selected" role="region" aria-label="Pokémon sélectionné">
        <div className={`exclusive-solo-model slide-${phase} direction-${direction > 0 ? "next" : "previous"}`} onAnimationEnd={event => { if (event.target === event.currentTarget) finishAnimation(); }}>{visible ? <Viewer key={item.id} autoRotate species={item.id} shiny={shiny} name={item.name} onReady={() => setPhase(current => current === "waiting" ? "enter" : current)}/> : <div className="exclusive-model"/>}</div>
      </div>
      <div className="exclusive-solo-caption">
        <div aria-live="polite" aria-atomic="true"><p className="exclusive-solo-count">{index + 1} / {pokemon.length}</p><h3>{item.name}</h3><TypeBadges types={item.type}/></div>
        <div className="exclusive-variant-switch" role="group" aria-label={`Apparence de ${item.name}`}>
          <button type="button" disabled={phase !== "idle"} aria-pressed={!shiny} onClick={() => setShiny(false)}>Original</button>
          <button type="button" disabled={phase !== "idle"} aria-pressed={shiny} onClick={() => setShiny(true)}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m10 2 2.2 5.8L18 10l-5.8 2.2L10 18l-2.2-5.8L2 10l5.8-2.2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>Chromatique</button>
        </div>
        <a className="exclusive-shop-link" href="#boutique">Aller vers la boutique <span aria-hidden="true">→</span></a>
      </div>
      </div>
      <div className="exclusive-selection" role="group" aria-label="Choisir un Pokémon">
        {pokemon.map((entry, position) => <button key={entry.id} className="exclusive-selection-card" aria-pressed={position === index} aria-controls="exclusive-selected" aria-disabled={phase !== "idle"} onClick={() => select(position)}>
          <PokemonThumbnail item={entry}/>
          <span className="exclusive-selection-copy"><strong>{entry.name}</strong></span>
          <TypeBadges types={entry.type}/>
          <span className="exclusive-selection-indicator" aria-hidden="true">{position === index ? "✓" : "→"}</span>
        </button>)}
      </div>
      </div>
      <div className="exclusive-carousel-bottom"><p>Faites glisser le Pokémon pour le tourner · Double-clic pour recentrer.</p><a href="/exclusives/CREDITS-Collection-Noel.txt" target="_blank" rel="noopener noreferrer">Crédits des créations ↗</a></div>
    </div>
  </section>;
}
