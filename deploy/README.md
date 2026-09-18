# Cobblemine sur le VPS

Projet : `/home/docker/cobblemine_website`.
Domaines : `cobblemine.com` et `cobblemine.fr` (enregistrement A vers `37.59.111.15`).
Réseau externe existant : `nginx-proxy`.

Le conteneur sert l’export statique Next.js sur son port interne 80.
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

Le site est statique : les achats et connexions ne sont pas des services backend.
