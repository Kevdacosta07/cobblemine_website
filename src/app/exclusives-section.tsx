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

function PokemonCard({ item }: { item: typeof pokemon[number] }) {
  const card = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [shiny, setShiny] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    if (card.current) observer.observe(card.current);
    return () => observer.disconnect();
  }, []);
  return <article ref={card} className="exclusive-card" aria-label={`${item.name} de Noël`}>
    <div className="exclusive-card-preview">{visible ? <Viewer species={item.id} shiny={shiny} name={item.name}/> : <div className="exclusive-model"/>}</div>
    <div className="exclusive-card-copy"><span className="exclusive-card-edition">ÉDITION NOËL</span><h3>{item.name}</h3><p>{item.type}</p>
      <button className="exclusive-shiny" aria-pressed={shiny} onClick={() => setShiny(!shiny)} aria-label={`Afficher ${item.name} ${shiny ? "original" : "chromatique"}`}>✦ {shiny ? "Chromatique" : "Voir le chromatique"}</button>
    </div>
  </article>;
}

export default function ExclusivesSection() {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  useEffect(() => {
    const element = track.current!;
    const update = () => setPosition({ start: element.scrollLeft < 8, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 8 });
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update); observer.observe(element); update();
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);
  function move(direction: number) {
    const element = track.current!;
    const width = element.firstElementChild?.getBoundingClientRect().width ?? 320;
    element.scrollBy({ left: direction * (width + 20), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section className="exclusives-section exclusive-carousel-section" id="exclusifs" aria-labelledby="exclusives-title">
    <div className="exclusives-inner">
      <div className="exclusive-carousel-heading"><div><p className="shop-label">COLLECTION DE NOËL · 11 POKÉMON</p><h2 id="exclusives-title">Des rencontres exclusives.</h2><p>Vos Pokémon préférés, dans des versions créées pour le serveur.</p></div>
        <div className="exclusive-arrows"><button aria-label="Pokémon précédents" disabled={position.start} onClick={() => move(-1)}>←</button><button aria-label="Pokémon suivants" disabled={position.end} onClick={() => move(1)}>→</button></div>
      </div>
      <div className="exclusive-track" ref={track} role="region" aria-label="Collection de Pokémon exclusifs, défilement horizontal" tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        {pokemon.map(item => <PokemonCard key={item.id} item={item}/>)}
      </div>
      <div className="exclusive-carousel-bottom"><p>Faites glisser les Pokémon pour les tourner · Double-clic pour recentrer.</p><a href="/exclusives/CREDITS-Collection-Noel.txt" target="_blank" rel="noopener noreferrer">Crédits des créations ↗</a></div>
    </div>
  </section>;
}
