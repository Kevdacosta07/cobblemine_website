# Cobblemine

Site de présentation en français, créé avec `create-next-app@latest` : Next.js 16.3.5, React 19, TypeScript, App Router et Tailwind CSS 4.

## Démarrer

```sh
npm install
npm run dev
```

## Vérifier et exporter

```sh
npm run build
```

Le site utilise désormais `output: "standalone"` pour les pages `/inscription`, `/connexion` et `/compte`. La connexion passe par les routes serveur `/api/auth/*` et l'API centrale Cobblemine ; le jeton reste dans un cookie HttpOnly/Secure. Voir `deploy/README.md` pour la configuration Docker et le secret de liaison. L'ancien export `out/` n'est plus utilisé.

Les informations du serveur, du Discord et du modpack sont volontairement indiquées « À venir ». Le contenu est dans `src/app/page.tsx` et les styles dans `src/app/globals.css`.

Visuel de démonstration : galerie du projet officiel Cobblemon sur Modrinth, « Pancham Family ». Il ne représente pas le serveur Cobblemine. Source : https://modrinth.com/mod/cobblemon/gallery
