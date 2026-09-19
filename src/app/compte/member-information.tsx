import type {Account} from "@/lib/account";
import "./member-information.css";

const roleLabels:Record<string,string>={player:"Joueur",admin:"Administrateur",moderator:"Modérateur",owner:"Fondateur",helper:"Guide"};
function playtimeLabel(seconds?:string){
  if(!seconds||!/^\d+$/.test(seconds))return "Indisponible";
  const total=BigInt(seconds),hours=total/BigInt(3600),minutes=total%BigInt(3600)/BigInt(60);
  if(total===BigInt(0))return "0 min";
  if(total<BigInt(60))return "Moins d’une minute";
  return hours>BigInt(0)?`${new Intl.NumberFormat('fr-FR').format(hours)} h ${minutes.toString().padStart(2,'0')} min`:`${minutes} min`;
}

export default function MemberInformation({account}:{account:Account}) {
  const date=account.createdAt ? new Date(account.createdAt) : null;
  const validDate=date && Number.isFinite(date.getTime()) ? date : null;
  const dateLabel=validDate ? new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Paris"}).format(validDate) : null;
  return <section className="account-details" aria-labelledby="account-details-title">
    <header className="account-details-heading"><div><h2 id="account-details-title">Informations du compte</h2><p>Votre identité et vos premiers pas sur Cobblemine.</p></div><span className="account-details-label">Profil joueur</span></header>
    <div className="account-details-body">
      <div className="account-member-since">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-14 5h3m4 0h3m-10 3h3"/></svg>
        <span>Date de création du compte</span>
        {validDate ? <time dateTime={validDate.toISOString()}>{dateLabel}</time> : <strong>Date indisponible</strong>}
        <p>Le début de votre aventure.</p>
      </div>
      <dl className="account-details-list">
        <div><dt>Temps de jeu</dt><dd>{playtimeLabel(account.playtimeSeconds)}<small>{account.playtimeUpdatedAt?"Cumul enregistré par le serveur":"Votre temps apparaîtra après votre première partie."}</small></dd></div>
        <div><dt>Pseudo Minecraft</dt><dd>{account.username}<small>Votre nom en jeu</small></dd></div>
        <div><dt>{account.roles.length>1?"Rôles du compte":"Rôle du compte"}</dt><dd className="account-role-list">{account.roles.length ? account.roles.map(({role})=><span className="account-role" key={role}>{roleLabels[role]||role}</span>) : "Aucun rôle attribué"}</dd></div>
        <div><dt>Accès au serveur</dt><dd><span className="account-server-status">Ouverture à venir</span><small>Votre compte est prêt pour l’ouverture.</small></dd></div>
      </dl>
    </div>
  </section>;
}
