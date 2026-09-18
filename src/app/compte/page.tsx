import type {Metadata} from "next";
import Navbar from "../navbar";
import SiteFooter from "../site-footer";
import AccountPanel from "./account-panel";
import "../auth.css";
export const metadata:Metadata={title:"Mon compte — Cobblemine",robots:{index:false,follow:false}};
export default function AccountPage(){return <><Navbar/><main className="account-page"><AccountPanel/></main><SiteFooter/></>;}
