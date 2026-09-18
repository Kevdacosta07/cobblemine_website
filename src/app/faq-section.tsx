"use client";

import { useState } from "react";

const questions = [
  ["Quand ouvrira Cobblemine ?", "La date d’ouverture n’a pas encore été annoncée. Elle sera affichée ici dès qu’elle sera confirmée."],
  ["Comment rejoindre le serveur ?", "Le launcher et les instructions d’installation seront disponibles dans la section « Rejoindre ». L’adresse du serveur, la version de Minecraft et le modpack seront précisés à l’ouverture."],
  ["Où trouver le Discord ?", "Le lien d’invitation de la communauté sera publié ici dès qu’il sera disponible."],
];

export default function FaqSection() {
  const [opened, setOpened] = useState<number | null>(null);
  return <section className="faq-section" id="faq" aria-labelledby="faq-title">
    <div className="faq-layout">
      <div className="faq-introduction"><p className="shop-label">AVANT DE NOUS REJOINDRE</p><h2 id="faq-title">Quelques réponses<br/>avant l’aventure.</h2><p>Les informations essentielles pour préparer votre arrivée sur Cobblemine.</p></div>
      <div className="faq-accordion">
        {questions.map(([question, answer], index) => {
          const open = opened === index;
          return <div className={`faq-item${open ? " is-open" : ""}`} key={question}>
            <h3><button className="faq-trigger" id={`faq-question-${index}`} aria-expanded={open} aria-controls={`faq-answer-${index}`} onClick={() => setOpened(open ? null : index)}>
              <span>{question}</span><span className="faq-toggle-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
            </button></h3>
            <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={!open} inert={!open}>
              <div className="faq-answer-clip"><p>{answer}</p></div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
