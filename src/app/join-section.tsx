"use client";

import Image from "next/image";
import { useRef } from "react";

export default function JoinSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <section className="join-invitation" id="rejoindre" aria-labelledby="join-title">
    <div className="join-invitation-card">
      <Image className="join-invitation-image" src="/launcher-magma-gateway.png" alt="" fill sizes="(max-width: 700px) 90vw, 1120px"/>
      <div className="join-invitation-copy">
        <p className="events-label">REJOINDRE COBBLEMINE</p>
        <h2 id="join-title">Votre aventure<br/>commence ici.</h2>
        <p className="join-invitation-description">Explorez un monde de blocs, rencontrez vos Pokémon préférés et installez-vous avec vos amis. Il ne manque plus que vous.</p>
        <button className="magma-button" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">
          <span className="magma-liquid" aria-hidden="true"><i/><i/><i/></span>
          <span className="magma-button-label">Télécharger le launcher <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
        </button>
        <p className="join-invitation-status"><span aria-hidden="true"/>Ouverture à venir</p>
      </div>
    </div>
    <dialog ref={dialog} className="navbar-dialog join-instructions" aria-labelledby="join-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <button className="dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()}>✕</button>
      <p className="eyebrow">BIENTÔT SUR COBBLEMINE</p>
      <h2 id="join-dialog-title">Préparez votre arrivée.</h2>
      <p>Le serveur est encore en préparation. Retrouvez ici les informations de connexion dès l’ouverture.</p>
      <dl className="join-connection-details">
        <div><dt>Adresse du serveur</dt><dd>Bientôt disponible</dd></div>
        <div><dt>Version & modpack</dt><dd>À venir</dd></div>
        <div><dt>Discord</dt><dd>Lien à venir</dd></div>
      </dl>
      <button className="events-button" onClick={() => dialog.current?.close()}>Compris <span aria-hidden="true">→</span></button>
    </dialog>
  </section>;
}
