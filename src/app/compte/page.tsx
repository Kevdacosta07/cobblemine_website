import type {Metadata} from "next";
import Navbar from "../navbar";

import AccountPanel from "./account-panel";
import "../auth.css";
import "./member.css";
export const metadata:Metadata={title:"Mon compte — Cobblemine",robots:{index:false,follow:false}};
export default function AccountPage(){return <div className="member-site"><Navbar/><main className="member-page"><AccountPanel/></main><footer className="member-footer">Site web développé par <a href="https://helveit.ch" target="_blank" rel="noreferrer">Helveit</a>.</footer></div>;}
