import Image from "next/image";
import Navbar from "./navbar";
import SiteFooter from "./site-footer";
import "./auth.css";

export default function AuthShell({children,register=false}:{children:React.ReactNode;register?:boolean}) {
  return <><a className="skip-link" href="#auth-content">Aller au formulaire</a><Navbar/>
    <main className="auth-page" id="auth-content">
      <div className="auth-layout">
        <aside className="auth-story" aria-label="Bienvenue sur Cobblemine">
          <Image src="/minecraft-adventure.png" alt="" fill priority sizes="(max-width: 850px) 100vw, 50vw"/>
          <div className="auth-story-copy"><span className="auth-world-label"><span/> VOTRE AVENTURE COBBLEMINE</span>
            <h2>Un pseudo.<br/> Votre histoire.</h2>
            <p>{register ? "Choisissez le nom qui vous accompagnera, de votre première connexion à vos plus belles rencontres." : "Votre équipe, vos découvertes, vos prochaines aventures. Tout commence avec votre compte."}</p>
            <div className="auth-story-bottom"><span>UN COMPTE POUR LE SITE ET LE LAUNCHER</span><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/><path d="M3 16h9m8 0h9" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5"/></svg></div>
          </div>
        </aside>
        <section className="auth-form-panel">{children}</section>
      </div>
    </main><SiteFooter/></>;
}
