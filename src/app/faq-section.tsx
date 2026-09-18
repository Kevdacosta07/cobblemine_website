"use client";

import { useState } from "react";

const questions = [
  ["Qu’est-ce que Cobblemine ?", "Cobblemine est un serveur Minecraft en préparation autour du mod Cobblemon. Il réunit l’exploration, la construction et les rencontres avec des Pokémon dans un monde à partager entre joueurs."],
  ["Quand ouvrira Cobblemine ?", "La date d’ouverture n’a pas encore été annoncée. Elle sera affichée ici dès qu’elle sera confirmée."],
  ["Comment rejoindre le serveur ?", "Le launcher et les instructions d’installation seront disponibles dans la section « Rejoindre ». L’adresse du serveur, la version de Minecraft et le modpack seront précisés à l’ouverture."],
  ["Où trouver le Discord ?", "Le lien d’invitation de la communauté sera publié ici dès qu’il sera disponible."],
];

export default function FaqSection() {
  const [opened, setOpened] = useState<number | null>(null);
  return <section className="faq-section" id="faq" aria-labelledby="faq-title">
    <div className="faq-layout">
      <div className="faq-introduction"><p className="faq-label">FOIRE AUX QUESTIONS</p><h2 id="faq-title">Tu as des questions ?</h2></div>
      <div className="faq-accordion">
        {questions.map(([question, answer], index) => {
          const open = opened === index;
          return <div className={`faq-item${open ? " is-open" : ""}`} key={question}>
            <h3><button className="faq-trigger" id={`faq-question-${index}`} aria-expanded={open} aria-controls={`faq-answer-${index}`} onClick={() => setOpened(open ? null : index)}>
              <span>{question}</span><span className="faq-toggle-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="m4.5 6.75 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
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
