"use client";
import Link from "next/link";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";

export default function AuthForm({mode,registered=false}:{mode:"login"|"register";registered?:boolean}) {
  const register=mode==="register",router=useRouter();
  const [visible,setVisible]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const [username,setUsername]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(busy)return;setError("");
    const data=new FormData(event.currentTarget),password=String(data.get("password"));
    if(register && password!==data.get("confirm")){setError("Les deux mots de passe ne correspondent pas.");return;}
    setBusy(true);
    try {
      const payload=register?{username:username.trim(),email:String(data.get("email")).trim(),password}:{login:String(data.get("login")).trim(),password};
      const response=await fetch(`/api/auth/${register?'register':'login'}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json();
      if(!response.ok){setError(result.message||"La demande n’a pas abouti. Réessayez.");return;}
      router.replace(register?"/connexion?inscrit=1":"/compte");router.refresh();
    }catch{setError("La connexion a été interrompue. Réessayez dans un instant.");}
    finally{setBusy(false);}
  }
  return <>
    <p className="auth-kicker">{register?"BIENVENUE PARMI NOUS":"HEUREUX DE VOUS REVOIR"}</p>
    <h1>{register?"Créez votre compte.":"Reprenez l’aventure."}</h1>
    <p className="auth-intro">{register?"Réservez votre pseudo et préparez votre arrivée sur Cobblemine.":"Connectez-vous avec votre compte Cobblemine."}</p>
    {registered&&<p className="auth-success" role="status">Votre compte est créé. Connectez-vous pour accéder à votre espace.</p>}
    <form className="auth-form" onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy}>
        {register?<>
          <div className="auth-field"><label htmlFor="username">Pseudo Minecraft</label><input id="username" name="username" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required pattern="[A-Za-z0-9_]{3,16}" minLength={3} maxLength={16} aria-describedby="username-hint" placeholder="Votre nom en jeu"/><p id="username-hint">3 à 16 caractères : lettres, chiffres et _. Ce pseudo sera votre nom en jeu et ne pourra pas être modifié.</p></div>
          <div className="auth-field"><label htmlFor="email">Adresse email</label><input id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" required maxLength={254} placeholder="vous@exemple.fr"/></div>
        </>:<div className="auth-field"><label htmlFor="login">Pseudo ou adresse email</label><input id="login" name="login" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} placeholder="Votre pseudo ou votre email"/></div>}
        <div className="auth-field"><label htmlFor="password">Mot de passe</label><div className="auth-password"><input id="password" name="password" type={visible?"text":"password"} autoComplete={register?"new-password":"current-password"} required minLength={register?12:1} maxLength={128} aria-describedby={register?"password-hint":undefined}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?"Masquer le mot de passe":"Afficher le mot de passe"} aria-pressed={visible}>{visible?"Masquer":"Afficher"}</button></div>{register&&<p id="password-hint">Au moins 12 caractères. Une phrase facile à retenir fonctionne très bien.</p>}</div>
        {register&&<div className="auth-field"><label htmlFor="confirm">Confirmer le mot de passe</label><input id="confirm" name="confirm" type={visible?"text":"password"} autoComplete="new-password" required minLength={12} maxLength={128}/></div>}
        {error&&<p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit">{busy?"Un instant…":register?"Créer mon compte":"Se connecter"}<span aria-hidden="true">→</span></button>
      </fieldset>
    </form>
    <p className="auth-switch">{register?"Vous avez déjà un compte ?":"Pas encore de compte ?"} <Link href={register?"/connexion":"/inscription"}>{register?"Se connecter":"Créer mon compte"} <span aria-hidden="true">↗</span></Link></p>
    <p className="auth-footnote">Aucun compte Microsoft nécessaire.</p>
  </>;
}
