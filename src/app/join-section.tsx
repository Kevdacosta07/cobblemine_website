"use client";

import Image from "next/image";
import { useRef } from "react";

const release = "https://github.com/Kevdacosta07/cobblemine_launcher/releases/download/v0.1.15";
const downloads = [
  {label: "Windows", detail: "64 bits · Installateur", file: "Cobblemine-Setup-0.1.15-x64.exe"},
  {label: "Mac · Apple Silicon", detail: "Puce M1 ou plus récente · Version de test", file: "Cobblemine-0.1.15-mac-arm64.dmg"},
  {label: "Mac · Intel", detail: "Processeur Intel · Version de test", file: "Cobblemine-0.1.15-mac-x64.dmg"},
  {label: "Linux", detail: "64 bits · AppImage", file: "Cobblemine-0.1.15-linux-x86_64.AppImage"},
];

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
      <p className="eyebrow">LAUNCHER · VERSION 0.1.15</p>
      <h2 id="join-dialog-title">À vous de jouer.</h2>
      <p>Choisissez votre ordinateur, puis connectez-vous avec votre compte Cobblemine. Le serveur public est encore en préparation.</p>
      <div className="launcher-downloads">
        {downloads.map(download => <a key={download.file} href={`${release}/${download.file}`}><span><strong>{download.label}</strong><small>{download.detail}</small></span><span aria-hidden="true">↓</span></a>)}
      </div>
      <p className="launcher-download-note"><strong>Sur Mac :</strong> ces versions de test ne sont pas encore signées ni notariées par Apple. macOS peut bloquer leur ouverture. La version signée est en préparation.</p>
      <p className="launcher-download-note"><strong>Sur Linux :</strong> autorisez l’exécution du fichier dans ses propriétés. L’AppImage nécessite FUSE 2. Une <a href={`${release}/Cobblemine-0.1.15-linux-x64.tar.gz`}>archive Linux</a> est aussi disponible.</p>
      <a className="launcher-release-link" href="https://github.com/Kevdacosta07/cobblemine_launcher/releases/tag/v0.1.15" target="_blank" rel="noreferrer">Installation et détails de la version ↗</a>
    </dialog>
  </section>;
}
