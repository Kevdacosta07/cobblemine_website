import type {Metadata} from "next";
import AuthShell from "../auth-shell";
import AuthForm from "../auth-form";
export const metadata:Metadata={title:"Connexion — Cobblemine",robots:{index:false,follow:true}};
export default async function Login({searchParams}:{searchParams:Promise<{inscrit?:string}>}) {
  const {inscrit}=await searchParams;
  return <AuthShell><AuthForm mode="login" registered={inscrit==="1"}/></AuthShell>;
}
