import type {Metadata} from "next";
import AuthShell from "../auth-shell";
import AuthForm from "../auth-form";
export const metadata:Metadata={title:"Créer un compte — Cobblemine",description:"Réservez votre pseudo Minecraft et créez votre compte Cobblemine."};
export default function Register() {return <AuthShell register><AuthForm mode="register"/></AuthShell>;}
