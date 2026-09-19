"use client";
import {useEffect,useState} from 'react';
import {request} from './panel';
type Status='good'|'medium'|'bad'|'unknown';
type Point={at:string;tps:number;mspt:number;online:number};
type Metrics={uptimeSeconds:number;tps:number;mspt:number;maxMspt:number;memoryUsed:number;memoryMax:number;cpuPercent:number|null;diskFree:number;diskTotal:number;online:number;maxPlayers:number;players:{uuid:string;name:string;ping:number;dimension:string;sessionSeconds:number}[];worlds:{name:string;chunks:number;entities:number;players:number}[];versions:Record<string,string>;mods:{id:string;version:string}[]};
type Server={id:string;receivedAt:string|null;ageSeconds:number|null;health:{status:Status;reasons:string[]};metrics:Metrics|null;history:Point[]};
type Data={status:Status;servers:Server[]};
export function useServerHealth(refresh:number){
 const [data,setData]=useState<Data|null>(null),[error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();let timer:ReturnType<typeof setTimeout>;
  async function load(){try{const d=await request<Data>('server-health',undefined,AbortSignal.any([controller.signal,AbortSignal.timeout(8000)]));if(!controller.signal.aborted){setData(d);setError('');}}catch{if(!controller.signal.aborted)setError('Les mesures ne peuvent pas être actualisées. Les dernières valeurs peuvent être anciennes.');}finally{if(!controller.signal.aborted)timer=setTimeout(load,10000);}}
  void load();return()=>{controller.abort();clearTimeout(timer);};
 },[refresh]);return {data,error,status:error?'unknown' as Status:data?.status||'unknown' as Status};
}
export function HealthBadge({status}:{status:Status}){return <span className={'adm-health-badge '+status}>{({good:'Bonne',medium:'Moyenne',bad:'Mauvaise',unknown:'Inconnue'})[status]}</span>;}
const value=(n:number)=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1}).format(n);
const bytes=(n:number)=>value(n/1024**3)+' Go';
const duration=(n:number)=>`${Math.floor(n/3600)} h ${Math.floor(n/60)%60} min`;
const time=(s:string)=>new Date(s).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'UTC'});
function Timeline({points}:{points:Point[]}){
 if(!points.length)return <p className="adm-muted">L’historique apparaîtra après les premiers relevés.</p>;
 const end=Date.parse(points[points.length-1].at),start=Math.min(Date.parse(points[0].at),end-3600000),span=end-start;
 return <><svg className="adm-health-chart" viewBox="0 0 720 150" role="img" aria-label="Historique des TPS : chaque barre correspond à un relevé, les espaces sans barre sont des périodes sans données."><line x1="0" y1="10" x2="720" y2="10" stroke="#dce5dd" strokeDasharray="4 4"/><line x1="0" y1="140" x2="720" y2="140" stroke="#dce5dd"/>{points.map(p=><line key={p.at} x1={4+(Date.parse(p.at)-start)/span*712} x2={4+(Date.parse(p.at)-start)/span*712} y1={140-p.tps/20*130} y2="140" stroke={p.tps<15?'#bd3e40':p.tps<19?'#b77b16':'#258063'} strokeWidth="3"><title>{time(p.at)} · {value(p.tps)} TPS · {p.online} joueurs</title></line>)}</svg><div className="adm-health-chart-labels"><span>{time(new Date(start).toISOString())} UTC</span><span>Objectif : 20 TPS</span><span>{time(points[points.length-1].at)} UTC</span></div></>;
}
export default function ServerHealth({data,error}:{data:Data|null;error:string}){
 return <div className="adm-health-page">{error&&<p className="adm-error" role="alert">{error}</p>}{!data&&!error&&<p role="status">Chargement de la santé du serveur…</p>}{data?.servers.length===0&&<section className="adm-card"><h2>Aucun serveur configuré</h2><p>Activez un serveur dans l’API pour recevoir ses mesures.</p></section>}
 {data?.servers.map(s=>{const m=s.metrics,unknown=!!error||s.health.status==='unknown';return <section key={s.id} className="adm-health-server">
  <div className="adm-health-summary"><div><span className="adm-eyebrow">SERVEUR MINECRAFT</span><h2>{s.id}</h2><p>{unknown?'État actuel non confirmé':s.health.reasons.join(' · ')}</p></div><div><HealthBadge status={error?'unknown':s.health.status}/><small>{s.receivedAt?'Dernier relevé : '+time(s.receivedAt)+' UTC':'Aucune mesure reçue'}</small></div></div>
  {unknown&&<p className="adm-note">{m?'Les valeurs ci-dessous sont les dernières reçues. Une absence de communication peut correspondre à un arrêt du serveur ou à une coupure réseau.':'En attente du mod de supervision. Les mesures apparaîtront automatiquement après le démarrage du serveur.'}</p>}
  {m&&<><div className="adm-health-metrics">{[
   ['TPS',value(m.tps)+' / 20','Fréquence réelle des ticks'],['Temps par tick',value(m.mspt)+' ms','Pic : '+value(m.maxMspt)+' ms'],['Joueurs',m.online+' / '+m.maxPlayers,'Connectés sur le serveur'],['Mémoire Java',bytes(m.memoryUsed),value(m.memoryUsed/m.memoryMax*100)+' % de '+bytes(m.memoryMax)],['CPU du processus',m.cpuPercent===null?'Indisponible':value(m.cpuPercent)+' %','Part de la capacité CPU totale'],['Disque libre',bytes(m.diskFree),value(m.diskFree/m.diskTotal*100)+' % de '+bytes(m.diskTotal)]
  ].map(([label,v,detail])=><article key={label} className="adm-card"><h3>{label}</h3><strong>{v}</strong><p>{detail}</p></article>)}</div>
  <div className="adm-card"><h2>Performance sur les dernières 24 heures</h2><Timeline points={s.history}/><p className="adm-muted">Un relevé affiché par tranche de 5 minutes. Les périodes sans données restent vides. Historique conservé 7 jours.</p></div>
  <div className="adm-card"><h2>Joueurs connectés <span className="adm-muted">({m.online})</span></h2>{m.players.length?<div className="adm-table-wrap"><table className="adm-table"><thead><tr><th>Pseudo</th><th>Ping</th><th>Session</th><th>Dimension</th></tr></thead><tbody>{m.players.map(p=><tr key={p.uuid}><td><strong>{p.name}</strong></td><td>{p.ping} ms</td><td>{duration(p.sessionSeconds)}</td><td>{p.dimension}</td></tr>)}</tbody></table></div>:<p className="adm-muted">Aucun joueur dans ce relevé.</p>}{m.online>m.players.length&&<p>Liste limitée aux 500 premiers joueurs.</p>}</div>
  <div className="adm-health-details"><div className="adm-card"><h2>Mondes chargés</h2><div className="adm-table-wrap"><table className="adm-table"><thead><tr><th>Dimension</th><th>Chunks</th><th>Entités</th><th>Joueurs</th></tr></thead><tbody>{m.worlds.map(w=><tr key={w.name}><td>{w.name}</td><td>{value(w.chunks)}</td><td>{value(w.entities)}</td><td>{w.players}</td></tr>)}</tbody></table></div></div><div className="adm-card"><h2>Installation</h2><dl className="adm-facts"><div><dt>Depuis le démarrage</dt><dd>{duration(m.uptimeSeconds)}</dd></div>{Object.entries(m.versions).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><details><summary>{m.mods.length} mods et modules chargés</summary><ul className="adm-health-mods">{m.mods.map(mod=><li key={mod.id}><strong>{mod.id}</strong><span>{mod.version}</span></li>)}</ul></details></div></div></>}
 </section>;})}
 <details className="adm-card"><summary>Comment la santé est-elle évaluée ?</summary><p>Le badge retient le signal le plus défavorable parmi les serveurs actifs.</p><ul><li>Moyenne : TPS &lt; 19, temps moyen par tick &gt; 45 ms, mémoire ou CPU ≥ 85 %, disque libre ≤ 15 %.</li><li>Mauvaise : TPS &lt; 15, temps moyen par tick &gt; 75 ms, mémoire ou CPU ≥ 95 %, disque libre ≤ 5 %.</li><li>Inconnue : aucun relevé récent depuis 45 secondes ou actualisation impossible. Un serveur connu en difficulté reste prioritaire dans le badge global.</li></ul><p>Les mesures couvrent environ 10 secondes. Un pic ponctuel peut changer le badge ; consultez aussi l’historique. Aucun message de chat, adresse IP ou position précise n’est collecté.</p></details></div>;
}
