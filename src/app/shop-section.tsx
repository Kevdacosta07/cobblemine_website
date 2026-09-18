"use client";

import Image from "next/image";
import { useRef } from "react";

const grades = [
  { name: "Dresseur", asset: "dresseur" },
  { name: "Ranger", asset: "ranger" },
  { name: "Champion", asset: "champion" },
  { name: "Maître", asset: "maitre" },
  { name: "Légende", asset: "legende" },
];

export default function ShopSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <section className="shop-section" id="boutique" aria-labelledby="shop-title">
    <div className="shop-inner">
      <div className="shop-heading">
        <p className="shop-label">LA BOUTIQUE</p>
        <h2 id="shop-title">Trouvez votre grade.</h2>
        <p>Cinq grades pour soutenir l’aventure Cobblemine.<br/>Choisissez celui qui vous ressemble.</p>
      </div>
      <ul className="grade-grid">
        {grades.map(grade => <li className={`grade-card grade-${grade.asset}`} key={grade.asset}>
          <div className="grade-art"><Image src={`/grades/${grade.asset}.webp`} alt="" width={320} height={320} sizes="(max-width: 600px) 120px, 160px" /></div>
          <h3>{grade.name}</h3>
        </li>)}
      </ul>
      <div className="shop-action">
        <button className="shop-cta" onClick={() => dialog.current?.showModal()}>Accéder à la boutique <span aria-hidden="true">→</span></button>
        <p>Les tarifs et avantages de chaque grade seront annoncés prochainement.</p>
      </div>
    </div>
    <dialog className="navbar-dialog" ref={dialog} aria-labelledby="shop-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <button className="dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()}>✕</button>
      <h2 id="shop-dialog-title">La boutique se prépare</h2>
      <p>Dresseur, Ranger, Champion, Maître ou Légende : retrouvez bientôt les détails des cinq grades ici. Les achats ne sont pas encore ouverts.</p>
      <button className="events-button" onClick={() => dialog.current?.close()}>Compris</button>
    </dialog>
  </section>;
}
