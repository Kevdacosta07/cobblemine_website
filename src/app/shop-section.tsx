"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const grades = [
  { name: "Dresseur", asset: "dresseur", price: "4,99", description: "Une première touche personnelle pour votre aventure.", benefits: ["Préfixe Dresseur dans le chat", "3 emplacements de maison /home", "2 styles de particules discrets", "Un kit de décoration de bienvenue", "Rôle Dresseur sur Discord", "Accès aux annonces réservées aux soutiens"] },
  { name: "Ranger", asset: "ranger", price: "9,99", description: "Pour les explorateurs qui aiment se sentir chez eux partout.", benefits: ["Tous les avantages Dresseur", "Préfixe Ranger et rôle Discord assorti", "6 emplacements de maison /home", "5 styles de particules au choix", "Un kit de décoration nature", "3 couleurs de pseudo disponibles"] },
  { name: "Champion", asset: "champion", price: "19,99", description: "Affichez vos couleurs et donnez du caractère à votre base.", benefits: ["Tous les avantages Ranger", "Préfixe Champion et rôle Discord assorti", "10 emplacements de maison /home", "10 styles de particules au choix", "Un kit de décoration arène", "Un badge Champion sur votre profil"] },
  { name: "Maître", asset: "maitre", price: "29,99", description: "Une collection de personnalisations pour les passionnés.", benefits: ["Tous les avantages Champion", "Préfixe Maître et rôle Discord assorti", "15 emplacements de maison /home", "15 styles de particules au choix", "Un kit de décoration prestige", "Une animation de connexion personnalisable"] },
  { name: "Légende", asset: "legende", price: "49,99", description: "Le grade signature pour les plus grands soutiens du serveur.", benefits: ["Tous les avantages Maître", "Préfixe Légende et rôle Discord assorti", "20 emplacements de maison /home", "Toute la collection de particules", "Un kit de décoration légendaire", "Un badge doré et une animation de connexion exclusive"] },
];

export default function ShopSection() {
  const [selected, setSelected] = useState(0);
  const [months, setMonths] = useState<1 | 3>(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const grade = grades[selected];
  const monthlyCents = Math.round(Number(grade.price.replace(",", ".")) * 100);
  const fullCents = monthlyCents * months;
  const totalCents = months === 3 ? Math.round(fullCents * 0.85) : fullCents;
  const money = (cents: number) => (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <section className="shop-section" id="boutique" aria-labelledby="shop-title">
    <div className="shop-inner">
      <div className="shop-heading">
        <p className="shop-label">LA BOUTIQUE</p>
        <h2 id="shop-title">Trouvez votre grade.</h2>
        <p>Cinq grades pour soutenir l’aventure Cobblemine.<br/>Sélectionnez un grade pour découvrir ses avantages.</p>
      </div>
      <ul className="grade-grid">
        {grades.map((item, index) => <li className={`grade-card grade-${item.asset}${selected === index ? " is-selected" : ""}`} key={item.asset}>
          <button className="grade-select" aria-pressed={selected === index} aria-controls="grade-details" onClick={() => setSelected(index)}>
            <span className="grade-art"><Image src={`/grades/${item.asset}.webp`} alt="" width={320} height={320} sizes="(max-width: 600px) 120px, 160px" /></span>
            <span className="grade-name">{item.name}</span>
            <span className="grade-card-price">{item.price} € / mois</span>
          </button>
        </li>)}
      </ul>
      <div className="grade-term" role="group" aria-label="Durée du grade">
        <button aria-pressed={months === 1} onClick={() => setMonths(1)}>1 mois</button>
        <button aria-pressed={months === 3} onClick={() => setMonths(3)}>3 mois <span>−15 %</span></button>
      </div>
      <div className="grade-details" id="grade-details" aria-live="polite" aria-atomic="true">
        <div className="grade-summary">
          <p className="grade-detail-label">VOTRE GRADE</p>
          <h3>{grade.name}</h3>
          <p className="grade-description">{grade.description}</p>
          <div className="grade-price-line"><p className="grade-price">{money(totalCents)}<span> €</span></p>{months === 3 && <del aria-label={`Prix sans réduction : ${money(fullCents)} euros`}>{money(fullCents)} €</del>}</div>
          <p className="grade-duration">Pour {months} mois · Sans renouvellement automatique</p>
          {months === 3 && <p className="grade-saving">Vous économisez {money(fullCents - totalCents)} € sur 3 mois.</p>}
          <button className="shop-cta grade-buy" onClick={() => dialog.current?.showModal()}>Acheter {grade.name} <span aria-hidden="true">→</span></button>
        </div>
        <div className="grade-benefits">
          <h4>Les avantages inclus</h4>
          <ul>{grade.benefits.map(benefit => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul>
        </div>
      </div>
      <p className="shop-preview-note">Aperçu de la boutique : tarifs et avantages fictifs, à confirmer avant l’ouverture.</p>
    </div>
    <dialog className="navbar-dialog" ref={dialog} aria-labelledby="shop-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <button className="dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()}>✕</button>
      <h2 id="shop-dialog-title">Grade {grade.name} · {months} mois</h2>
      <p>{money(totalCents)} € pour {months} mois{months === 3 ? " (réduction de 15 % incluse)" : ""}.</p>
      <p>Cette offre est une présentation provisoire. Les achats ne sont pas encore ouverts ; les tarifs et avantages définitifs seront annoncés au lancement de la boutique.</p>
      <button className="events-button" onClick={() => dialog.current?.close()}>Compris</button>
    </dialog>
  </section>;
}
