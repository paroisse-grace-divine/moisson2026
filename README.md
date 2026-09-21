# Fête de la Moisson 2026 — landing page

Landing page statique, sans framework, pour la Paroisse La Grâce Divine (Argenteuil).

## Développement local

```bash
npm install
npx vite dev      # ou : npm run dev
```

Le site est alors servi sur http://localhost:5173/ avec rechargement à chaud.

### Tester les redirections

`npm run dev` sert les fichiers bruts : il ignore `netlify.toml`, donc `/don`, `/live` et la
redirection de la racine n'y fonctionnent pas. Pour les tester :

```bash
npm run netlify     # http://localhost:8888
```

Ce script construit `dist/` puis lance Netlify Dev, qui applique les redirections et les
en-têtes réels. `netlify-cli` n'est pas une dépendance du projet (~200 Mo pour un outil
ponctuel) : `npx` le télécharge au premier lancement et le garde en cache.

> Netlify Dev impose son propre `Cache-Control` en local ; les valeurs de `netlify.toml`
> ne s'appliquent qu'en production. Les autres en-têtes, eux, sont bien visibles en local.

Vite ne sert ici que de serveur de développement : aucun bundling n'est nécessaire, les
fichiers du dossier sont déployables tels quels (voir « Déploiement »).

> Le service worker n'est volontairement **pas** enregistré sur `localhost` (il est même
> désenregistré automatiquement) : il servirait des fichiers en cache et empêcherait de voir
> les modifications. Il reste actif en production.

## Déploiement (Netlify)

`netlify.toml` configure tout : Netlify exécute `npm run build:site`, qui recopie les
fichiers du site dans `dist/`, puis publie ce dossier.

Le site s'affiche sous **`grace-divine.fr/moisson/`**, et la racine y redirige en attendant
que le site paroissial complet existe.

`/moisson/` n'est pas un vrai dossier mais une **réécriture** vers la racine de `dist/`.
Cela peut surprendre, mais c'est nécessaire : depuis un vrai dossier, l'adresse `/moisson`
sans barre finale affiche la page avec ses chemins relatifs résolus depuis la racine du
domaine — donc sans aucun style. Et la corriger par une redirection `/moisson → /moisson/`
est impossible, Netlify ignorant la barre finale à la comparaison : la règle se redéclenche
sur sa propre cible et boucle à l'infini (vérifié avec Netlify Dev). Avec une réécriture,
les deux formes de l'adresse fonctionnent.

Cette étape de copie existe pour une raison : Netlify installe les dépendances dès qu'un
`package.json` est présent. Publier la racine embarquerait `node_modules`, les sources
TypeScript et le plan interne dans le site en ligne.

### Liens courts

| URL | Destination |
| --- | --- |
| `grace-divine.fr/` | `/moisson/` |
| `grace-divine.fr/don` | collecte HelloAsso |
| `grace-divine.fr/live` | direct YouTube |
| `grace-divine.fr/programme` | section Programme de la page |
| `grace-divine.fr/galerie` | section Galerie de la page |

Ils sont définis dans `netlify.toml` et sont en **302 (temporaire)**, pas 301 : ces
destinations changent à chaque campagne et à chaque direct, et un 301 reste mémorisé
durablement par les navigateurs.

### Le jour où le site paroissial arrive

La redirection de la racine porte `force = true`, sans quoi l'`index.html` de la Moisson,
réellement présent à la racine de `dist/`, l'emporterait sur elle.

Le jour où le site paroissial arrive, il faudra donc **retirer cette règle** (et publier le
nouveau site à la racine). Le site Moisson restera accessible sous `/moisson/` grâce à la
règle de réécriture, qui n'a pas besoin d'être touchée.

> Tant que les URLs HelloAsso et YouTube ne sont pas renseignées, `/don` et `/live`
> renvoient vers les sections correspondantes de la page — jamais vers une 404. Les lignes
> `to = "https://..."` à décommenter sont déjà en place dans `netlify.toml`.

### Autre hébergement

Le dossier `dist/` est servable tel quel par n'importe quel hébergement statique. Les
chemins internes du site sont tous relatifs (`./assets/`, `start_url: "./"`), il fonctionne
donc à n'importe quel emplacement — seules les URLs absolues des métadonnées (`canonical`,
`og:image`) et les redirections dépendent du chemin retenu.

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

> Tant que `helloAssoUrl` est vide, les boutons « Faire un don » mènent à la section Don de
> la page, qui explique la situation et donne les contacts. Ils gardent volontairement leur
> apparence normale : un style grisé les faisait passer pour des boutons hors service, avec
> un contraste de 3,9 (sous le minimum WCAG AA de 4,5).

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
| `ratio` | format largeur/hauteur, ex. `"4/3"` (paysage) ou `"3/4"` (portrait) |

Toutes les diapos ont la **même hauteur**, et leur largeur découle du format de la photo :
portrait et paysage cohabitent sans recadrage. `ratio` est facultatif — sans lui, le format
est déduit de l'image une fois chargée, au prix d'un léger réajustement visuel. Il est donc
préférable de le renseigner (je le génère depuis les fichiers sur demande).

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

Il n'y a **pas de bouton « Installer »** dans la page : les navigateurs compatibles proposent
eux-mêmes l'installation depuis leur propre menu. Un bouton maison supposait d'intercepter
`beforeinstallprompt` avec `preventDefault()`, ce qui avait pour effet de supprimer la
proposition native du navigateur.

Après modification de fichiers mis en cache, incrémenter la constante `CACHE` dans `sw.js` (`moisson-2026-v2`, etc.) afin de forcer la mise à jour du cache.

## Open Graph

L'image de partage est `assets/og-moisson-2026.jpg` au format 1200 × 630. Elle est référencée dans les balises Open Graph/Twitter de `index.html`.
