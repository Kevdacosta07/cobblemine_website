"use client";

import { useRef } from "react";

export default function EventsButton() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="events-button" onClick={() => dialog.current?.showModal()}>Voir les événements <span aria-hidden="true">→</span></button>
    <dialog className="navbar-dialog" ref={dialog} aria-labelledby="events-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <button className="dialog-close" aria-label="Fermer" onClick={() => dialog.current?.close()}>✕</button>
      <h2 id="events-dialog-title">Les événements se préparent</h2>
      <p>Le programme, les dates et les modalités de participation seront annoncés à l’approche de l’ouverture du serveur.</p>
      <button className="events-button" onClick={() => dialog.current?.close()}>Compris</button>
    </dialog>
  </>;
}
