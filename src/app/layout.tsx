import type { Metadata } from "next";
import { Barlow_Condensed, Nunito_Sans, Fredoka } from "next/font/google";
import "./globals.css";
const display = Barlow_Condensed({weight:["600","700","800"], subsets:["latin"], variable:"--font-display"});
const body = Nunito_Sans({subsets:["latin"], variable:"--font-body"});
const heading = Fredoka({subsets:["latin"], variable:"--font-heading"});
export const metadata: Metadata = {
  title: "Cobblemine — Votre prochaine aventure Cobblemon",
  description: "Minecraft, des Pokémon et une aventure à partager. Découvrez Cobblemine, un serveur Cobblemon en préparation. Ouverture à venir.",
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
  return <html lang="fr" className={`${display.variable} ${body.variable} ${heading.variable}`}><body>{children}</body></html>;
}

