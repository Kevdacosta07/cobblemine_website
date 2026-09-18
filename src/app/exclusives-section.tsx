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
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: "300px" });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const [shiny, setShiny] = useState(false);
  const current = pokemon[selected];
  return <section ref={section} className="exclusives-section" id="exclusifs" aria-labelledby="exclusives-title">
    <div className="exclusives-inner">
      <div className="exclusives-heading"><p className="shop-label">LES EXCLUSIVITÉS COBBLEMINE</p><h2 id="exclusives-title">Vos Pokémon, autrement.</h2><p>Des modèles personnalisés à découvrir sur le serveur.<br/>Explorez notre collection de Noël sous tous les angles.</p></div>
      <div className="exclusive-showcase">
        <div className="exclusive-stage">{ready ? <Viewer species={current.id} shiny={shiny} name={current.name}/> : <div className="exclusive-model"/>}<span className="exclusive-rotate" aria-hidden="true">↔ Faites glisser pour tourner</span></div>
        <div className="exclusive-info">
          <span className="exclusive-collection">COLLECTION DE NOËL · 11 POKÉMON</span>
          <div aria-live="polite"><h3>{current.name}</h3><p className="exclusive-type">{current.type}</p></div>
          <p className="exclusive-description">Une version festive avec son modèle et ses textures personnalisés. Découvrez ses détails en 3D et sa variante chromatique.</p>
          <div className="exclusive-variants" role="group" aria-label="Apparence du Pokémon"><button aria-pressed={!shiny} onClick={() => setShiny(false)}>Original</button><button aria-pressed={shiny} onClick={() => setShiny(true)}>✦ Chromatique</button></div>
          <p className="exclusive-availability">Les modalités d’obtention seront annoncées lors des événements.</p>
        </div>
      </div>
      <div className="exclusive-picker" role="group" aria-label="Choisir un Pokémon exclusif">{pokemon.map((item, index) => <button key={item.id} aria-pressed={index === selected} onClick={() => setSelected(index)}>{item.name}</button>)}</div>
      <p className="exclusive-credits">Collection de Noël Cobblemine. <a href="/exclusives/CREDITS-Collection-Noel.txt" target="_blank" rel="noopener noreferrer">Crédits des créations ↗</a></p>
    </div>
  </section>;
}
