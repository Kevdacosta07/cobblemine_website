import {redirect} from 'next/navigation';
import Link from 'next/link';
import {api,session} from '@/lib/auth-server';
import type {Account} from '@/lib/account';
import AdminPanel from './panel';
import './admin.css';
export const metadata={title:'Administration — Cobblemine',robots:{index:false,follow:false}};
export default async function AdminPage(){
 const token=await session();if(!token)redirect('/connexion');
 let permission:Response,profile:Response;
 try{[permission,profile]=await Promise.all([api('/v1/admin/me',{session:token}),api('/v1/me',{session:token})]);}catch{return <main className="admin-gate"><h1>Administration indisponible</h1><p>Le service ne répond pas pour le moment. Réessaie dans quelques instants.</p><Link href="/admin">Réessayer</Link></main>;}
 if(permission.status===401||profile.status===401)redirect('/connexion');
 if(permission.status===403)return <main className="admin-gate"><p className="admin-eyebrow">COBBLEMINE</p><h1>Accès réservé</h1><p>Ce compte ne possède pas le rôle administrateur.</p><Link href="/compte">Retour à mon compte</Link></main>;
 if(!permission.ok||!profile.ok)return <main className="admin-gate"><h1>Administration indisponible</h1><p>Réessaie dans quelques instants.</p><Link href="/compte">Retour à mon compte</Link></main>;
 const account:Account=await profile.json();return <AdminPanel adminName={account.username}/>;
}
