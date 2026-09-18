# Cobblemine sur le VPS

Projet : `/home/docker/cobblemine_website`.
Domaines : `cobblemine.com` et `cobblemine.fr` (enregistrement A vers `37.59.111.15`).
Réseau externe existant : `nginx-proxy`.

Le conteneur sert désormais Next.js standalone sur son port interne 3000.
Le reverse proxy et son compagnon Let’s Encrypt existants gèrent le routage
et les certificats via VIRTUAL_HOST et LETSENCRYPT_HOST. Aucun port hôte ajouté.

```sh
cd /home/docker/cobblemine_website
docker compose up -d --build
docker compose ps
```

Les variables facultatives `SITE_DOMAIN` et `PROXY_NETWORK` peuvent être définies
dans un fichier `.env` non versionné. Pour mettre à jour depuis GitHub :
`git pull --ff-only`, puis `docker compose up -d --build`.

## Comptes

`/inscription` crée le compte puis dirige vers `/connexion?inscrit=1`. `/connexion` ouvre une session et `/compte` affiche le pseudo réservé, les points et les grades.

`/api/auth/*` est la passerelle serveur du site. Le navigateur ne reçoit jamais le jeton de l'API dans une réponse JSON. Cookie de production : `__Host-cobblemine_session`, HttpOnly, Secure, SameSite=Lax, Path=/, sans Domain ; expiration identique à la session API (7 jours). Les domaines .com et .fr ont des cookies séparés. Les POST vérifient l'origine exacte et le domaine de destination, y compris connexion et déconnexion. Aucun jeton dans localStorage.

Le serveur contacte `https://api.cobblemine.com` avec validation TLS. Nginx remplace X-Real-IP ; le site signe cette IP avec un secret partagé pour préserver les limites API par visiteur. L'API ignore une adresse sans signature valide et récente.

`COBBLEMINE_API_URL`, `SITE_ORIGINS` et `WEB_PROXY_SECRET_FILE` sont définis dans compose.yaml. Le secret `/home/docker/cobblemine_api/secrets/web_proxy`, généré par le prepare.sh de l'API, est monté en lecture seule dans les deux conteneurs. Avant ce déploiement, mettre à jour l'API avec la vérification des signatures du site.

L'ancien export statique et deploy/nginx.conf ne sont plus utilisés. Les achats et la récupération de mot de passe oublié restent indisponibles. Le launcher et les mods doivent encore être raccordés.
