# Fête de la Moisson 2026 — landing page

Landing page statique, sans framework, pour la Paroisse La Grâce Divine (Argenteuil).

## Développement local

```bash
npm install
npx vite dev      # ou : npm run dev
```

Le site est alors servi sur http://localhost:5173/ avec rechargement à chaud.

Vite ne sert ici que de serveur de développement : aucun bundling n'est nécessaire, les
fichiers du dossier sont déployables tels quels (voir « Déploiement »).

> Le service worker n'est volontairement **pas** enregistré sur `localhost` (il est même
> désenregistré automatiquement) : il servirait des fichiers en cache et empêcherait de voir
> les modifications. Il reste actif en production.

## Déploiement

Le dossier est déjà prêt à être servi tel quel par n'importe quel hébergement statique.

Fichiers requis en production :

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `manifest.webmanifest`
- `sw.js`
- `robots.txt`
- `sitemap.xml`
- le dossier `assets/`

Le site est prévu pour être publié sur :

`https://grace-divine.fr/moisson-2026/`

Si l'URL finale change, mettre à jour :

1. `canonical`, `og:url`, `og:image`, `twitter:image` et le JSON-LD dans `index.html`
2. `shareUrl` dans `config.js`
3. l'URL dans `robots.txt` et `sitemap.xml`

## Activer HelloAsso et YouTube

Aucune recompilation n'est nécessaire. Ouvrir simplement `config.js`.

```js
window.MOISSON_CONFIG = {
  helloAssoUrl: "https://www.helloasso.com/...",
  youtubeChannelUrl: "https://www.youtube.com/@...",
  shareUrl: "https://grace-divine.fr/moisson-2026/",
  streams: [
    {
      title: "Grand Culte d'Action de Grâce",
      dateLabel: "Dimanche 11 octobre · 10h",
      startsAt: "2026-10-11T10:00:00+02:00",
      youtubeUrl: "https://www.youtube.com/watch?v=..."
    }
  ]
};
```

Les URLs YouTube standard, `youtu.be`, `/live/` et `/embed/` sont reconnues.

Chaque entrée de `streams` génère une carte dans la section « Suivre la Moisson en direct ».
Son `anchorId` doit correspondre au lien « Direct prévu » du jour concerné dans `index.html`
(les cinq dates du programme en ont un).

> **Important** : `config.js` fait partie des fichiers mis en cache par le service worker.
> Après y avoir collé les URLs, incrémentez `CACHE` dans `sw.js` — sinon les visiteurs déjà
> venus continueront de voir l'ancienne configuration (sans les liens).

## Galerie « La vie de la communauté »

1. Déposez les photos dans `assets/galerie/` (JPEG, ~1200 px de large suffisent : les photos
   sont affichées en vignettes recadrées, inutile d'envoyer les originaux pleine résolution).
2. Listez-les dans `gallery` dans `config.js` :

```js
gallery: [
  { src: "./assets/galerie/culte-mars.jpg", caption: "Culte d'action de grâce", alt: "L'assemblée réunie" },
  { src: "./assets/galerie/chorale.jpg", caption: "La chorale en répétition" }
]
```

| Champ | Rôle |
| --- | --- |
| `src` | chemin de la photo (obligatoire ; une entrée sans `src` est ignorée) |
| `alt` | description pour les lecteurs d'écran — à défaut, la légende est reprise |
| `caption` | légende affichée sur la photo (facultative) |

Les photos défilent dans un **carrousel** (défilement tactile, molette, flèches ou clavier),
dans l'ordre du tableau. Le défilement est **automatique** (une photo toutes les 4 s, puis
retour au début). Il se met en pause au survol, pendant une manipulation tactile, au focus
clavier, quand la section sort de l'écran, et via le bouton « Pause ». Il ne démarre pas si
le système est réglé sur « animations réduites ». Le délai se change dans `src/app.ts`
(`AUTOPLAY_DELAY`). Les vignettes sont purement illustratives : elles ne sont pas
cliquables. Tant que `gallery` est vide, la section affiche un message d'attente.

Pour régénérer le tableau après avoir ajouté ou retiré des photos, il suffit de relister le
dossier — l'ordre alphabétique des fichiers fait foi.

> Les photos publiées sont des versions optimisées (1200 px max, métadonnées EXIF/GPS
> supprimées). Les originaux pleine résolution sont conservés hors du site, dans
> `photos-originales/` — ce dossier **n'a pas besoin d'être déployé**.

## TypeScript

Le JavaScript prêt à servir (`app.js`) est inclus. La source TypeScript est dans `src/app.ts`.

Pour recompiler :

```bash
npm install
npm run build
```

## PWA

Le manifeste et le service worker sont inclus. L'installation PWA nécessite HTTPS. Le service
worker est désactivé sur `localhost` pour ne pas gêner le serveur de développement.

Après modification de fichiers mis en cache, incrémenter la constante `CACHE` dans `sw.js` (`moisson-2026-v2`, etc.) afin de forcer la mise à jour du cache.

## Open Graph

L'image de partage est `assets/og-moisson-2026.jpg` au format 1200 × 630. Elle est référencée dans les balises Open Graph/Twitter de `index.html`.
