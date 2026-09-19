# Plan de passation — Moisson 2026 / Version 3

## 1. Objectif du projet

Ce projet est une landing page statique pour la **Fête de la Moisson 2026** de la **Paroisse Grâce Divine — Argenteuil**.

Le site doit rester :
- simple à maintenir ;
- rapide ;
- statique ;
- sans framework complexe ;
- facilement déployable comme un ensemble de fichiers HTML/CSS/JS ;
- adapté mobile en priorité ;
- partageable facilement sur WhatsApp ;
- optimisé pour les aperçus Open Graph.

Le but n'est **pas** d'en faire un CMS ou un site éditorial complet pour l'instant. Un futur site complet avec articles, actualités, archives, etc. pourra être traité séparément.

## 2. Stack actuelle

La version 3 fonctionne comme un site statique :

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `manifest.webmanifest`
- `sw.js`
- assets dans `/assets`
- source TypeScript disponible dans `/src/app.ts`

Aucun framework front-end n'est utilisé. Le JavaScript compilé est déjà présent dans `app.js`.

Le site doit pouvoir fonctionner directement après déploiement des fichiers statiques.

## 3. Fichier de référence

Le package de travail actuel est :

`moisson-2026-site-v3.zip`

Il contient la dernière version à modifier.

Ne pas repartir de zéro sauf nécessité technique majeure.

## 4. Identité visuelle

### Nom à utiliser

Dans la navigation / branding principal :

**Paroisse Grâce Divine**

Ne pas remettre :

**La Grâce Divine**

Le nom du lieu ou de l'entité peut rester plus complet dans les textes éditoriaux :

**Paroisse La Grâce Divine — Argenteuil**

si cela correspond au contenu historique ou à l'adresse.

### Typographie du branding

Le titre **Paroisse Grâce Divine** dans le header doit utiliser une police **sans serif**.

Ne pas utiliser Georgia / Times / serif pour ce nom.

### Palette

Conserver l'identité principale :

- vert profond
- vert ECC / paroisse
- or
- crème / ivoire
- blanc

Variables CSS déjà présentes :

```css
--green-950: #052b1b;
--green-900: #063c24;
--green-800: #0a542f;
--green-700: #11683c;
--gold-500: #d9a92a;
--gold-400: #e5b83f;
--gold-200: #f1d98f;
--cream: #fffaf0;
--cream-deep: #f7efd9;
```

Ne pas transformer l'interface en poster chargé.

Le site doit reprendre l'identité de l'affiche, mais rester plus moderne, lisible et respirant.

## 5. Hero actuel — IMPORTANT

La V3 utilise le nouvel asset :

`assets/hero-moisson-2026.png`

Cet asset doit être utilisé comme **background complet du hero**.

Il ne doit plus apparaître dans une petite carte séparée.

Structure actuelle souhaitée :

- image de fond plein hero ;
- overlay vert sombre pour garder le texte lisible ;
- contenu texte par-dessus ;
- countdown en bas du hero ;
- transition propre vers la section suivante.

### Hero — éléments à conserver

Texte :

**Fête de la Moisson 2026**

Thème :

**Porter du bon fruit et rayonner**

Dates :

**Du 2 au 11 octobre 2026**

CTA :

- Voir le programme
- Suivre en direct
- WhatsApp

Infos principales :

- Grand culte : dimanche 11 octobre à 10h
- Argenteuil

### Hero — direction de design

Chercher un rendu :
- premium ;
- spirituel ;
- festif ;
- lisible ;
- moins "affiche imprimée" ;
- plus "landing page événementielle moderne".

Le background ne doit pas écraser le texte.

Éviter :
- trop de blocs semi-transparents ;
- trop de cadres ;
- trop de dégradés superposés ;
- trop d'éléments décoratifs concurrents.

## 6. Countdown

Le countdown vers le :

**11 octobre 2026 à 10h**

doit rester.

Il doit afficher :
- jours ;
- heures ;
- minutes ;
- secondes.

Après le début de l'événement, le code actuel change automatiquement le message.

### Espacement demandé

Il faut conserver **davantage d'espace sous le countdown avant la section suivante**.

Le countdown ne doit pas sembler collé à la section "Thème 2026".

Prévoir un vrai espace de respiration visuelle.

## 7. Programme / Schedule

Le programme doit rester l'une des sections principales du site.

Structure actuelle :
- cartes par date ;
- heure ;
- type d'activité ;
- titre ;
- sous-thèmes éventuels ;
- intervenants.

Dates principales :

- vendredi 2 octobre
- samedi 3 octobre
- vendredi 9 octobre
- samedi 10 octobre
- dimanche 11 octobre

### Liens vers les directs

Conserver les petits liens / chips ajoutés dans le programme pour les événements qui ont un live.

Exemples :

- `Direct prévu`
- clic → scroll vers le live correspondant

IDs actuels attendus :

```text
#stream-visionnaires
#stream-engrangement
#stream-grand-culte
```

Ces IDs sont générés via `config.js` / `app.js`.

Ne pas supprimer ce système.

## 8. YouTube live

Le site ne doit pas avoir besoin de l'API YouTube pour l'instant.

Les lives sont configurés manuellement dans :

`config.js`

Exemple :

```js
streams: [
  {
    title: "Veillée des Visionnaires de France",
    dateLabel: "Vendredi 2 octobre · 21h",
    startsAt: "2026-10-02T21:00:00+02:00",
    youtubeUrl: "",
    anchorId: "stream-visionnaires"
  }
]
```

Quand l'URL YouTube est ajoutée :
- afficher l'embed ;
- permettre d'ouvrir YouTube ;
- gérer état à venir / aujourd'hui / replay.

Ne pas introduire de backend pour cela.

## 9. Donation HelloAsso

Le bouton de donation doit rester présent :

- header ;
- section donation ;
- navigation mobile.

Le lien est défini dans :

`config.js`

```js
helloAssoUrl: ""
```

Ne pas hardcoder le lien HelloAsso directement dans plusieurs fichiers.

Une seule source de configuration doit être conservée.

## 10. WhatsApp share

Conserver le partage WhatsApp.

Le message actuel contient :
- nom de l'événement ;
- thème ;
- dates ;
- Argenteuil ;
- URL.

Le bouton WhatsApp doit rester accessible depuis le hero.

La fonctionnalité se trouve dans `app.js` / `src/app.ts`.

## 11. FAQ

La FAQ doit rester simple.

Utiliser autant que possible :

```html
<details>
  <summary>...</summary>
  <p>...</p>
</details>
```

Éviter d'ajouter une dépendance JS pour un accordéon.

Questions actuelles :
- lieu ;
- dates ;
- YouTube ;
- donation ;
- installation PWA.

## 12. PWA

Conserver :
- `manifest.webmanifest`
- `sw.js`
- icônes PWA
- installation navigateur compatible.

Le service worker utilise un cache versionné.

À chaque modification importante d'assets ou CSS/JS :

mettre à jour par exemple :

```js
const CACHE = "moisson-2026-v4";
```

afin d'éviter que le navigateur continue d'afficher une ancienne version.

## 13. Open Graph — TRÈS IMPORTANT

Les aperçus de partage sont une priorité.

Conserver les balises :
- `og:title`
- `og:description`
- `og:image`
- `og:url`
- Twitter card

Asset :

`assets/og-moisson-2026.jpg`

Dimensions prévues :

**1200 × 630**

Ne pas utiliser l'image portrait du poster comme preview principale.

L'aperçu WhatsApp / réseaux doit rester propre.

## 14. Posters officiels

Il y a deux posters :

- affiche principale ;
- programme.

Ils doivent rester accessibles dans la section :

**Les affiches officielles**

### Remarque de design utilisateur

Le souhait exprimé est d'utiliser un affichage visuel plus immersif avec :

```css
object-fit: cover;
```

et non une présentation type `contain` flottant dans trop d'espace vide.

Les cartes doivent toutefois rester compréhensibles et permettre d'ouvrir l'affiche originale.

Liens vers fichiers haute résolution à conserver.

## 15. Navigation

Navigation principale actuelle :

- Programme
- Direct
- FAQ
- Infos
- Faire un don

Conserver la navigation mobile fixe en bas si elle reste élégante.

Actions mobiles principales :

- Programme
- Direct
- Faire un don

## 16. Sections principales attendues

Ordre général souhaité :

```text
Header
Hero plein écran / grande image
Countdown
Thème 2026
Programme
YouTube Live
Donation HelloAsso
Affiches officielles
FAQ
Infos pratiques
Footer
```

Ne pas ajouter des dizaines de sections secondaires sans justification.

## 17. Infos pratiques

Conserver :

**Paroisse La Grâce Divine**  
12–14 rue Jean-Pierre Timbaud  
95100 Argenteuil

Téléphones :

- 06 51 60 57 47
- 06 08 95 26 99

Bouton itinéraire Google Maps.

## 18. SEO

Conserver :
- `<title>`
- meta description ;
- canonical ;
- Schema.org Event ;
- sitemap ;
- robots.txt.

Ne pas casser les URLs relatives si le site est déployé dans :

`/moisson-2026/`

## 19. Contraintes techniques

### Ne pas introduire

Sans demande explicite :

- React ;
- Vue ;
- Nuxt ;
- Next ;
- Angular ;
- CMS ;
- backend Node ;
- Firebase ;
- base de données ;
- API custom ;
- dépendance lourde.

### Acceptable

- HTML
- CSS
- JavaScript moderne
- TypeScript source
- SVG
- Web APIs natives

Le résultat final doit rester facilement déployable sur un hébergement statique.

## 20. Responsive

Tester impérativement :

### Desktop
- 1440 px
- 1280 px
- 1024 px

### Mobile
- 390 px
- 430 px

Points à vérifier :
- hero lisible ;
- background hero bien cadré ;
- titre non coupé ;
- CTA accessibles ;
- countdown non compressé ;
- schedule lisible ;
- poster cards cohérentes ;
- mobile bar non intrusive ;
- aucun overflow horizontal.

## 21. Accessibilité

Conserver :
- HTML sémantique ;
- `aria-label` utiles ;
- skip link ;
- contraste suffisant ;
- focus visible ;
- boutons réels pour les actions ;
- liens réels pour les navigations ;
- `prefers-reduced-motion`.

Ne pas sacrifier la lisibilité pour le style.

## 22. Fichiers à modifier en priorité

Pour les ajustements visuels :

### `index.html`
Structure / contenu / sections.

### `styles.css`
Principal fichier pour :
- hero ;
- responsive ;
- posters ;
- spacing ;
- schedule ;
- live cards.

### `config.js`
Uniquement pour :
- HelloAsso ;
- YouTube ;
- share URL ;
- streams.

### `app.js`
Interactions déjà compilées.

### `src/app.ts`
Source TypeScript à garder synchronisée avec `app.js` si la logique JS est modifiée.

### `sw.js`
Mettre à jour le numéro de cache après changement majeur.

## 23. Ne pas casser les fonctionnalités existantes

Avant de livrer une nouvelle version, vérifier :

- countdown fonctionne ;
- menu mobile fonctionne ;
- WhatsApp fonctionne ;
- liens du schedule vers les lives fonctionnent ;
- live cards affichées ;
- donation configurable ;
- FAQ fonctionnelle ;
- PWA fonctionnelle ;
- service worker enregistre bien les nouveaux assets ;
- Open Graph inchangé ou amélioré ;
- aucune erreur console.

## 24. Priorités pour le prochain agent IA

Ordre recommandé :

### Priorité 1 — Hero

Polir la V3 :
- image en vrai background complet ;
- meilleur cadrage desktop/mobile ;
- overlay plus élégant ;
- texte plus lisible ;
- réduire l'effet "bloc posé sur l'image" si nécessaire ;
- conserver le caractère premium.

### Priorité 2 — Countdown

- plus d'air autour ;
- meilleure transition vers la section suivante ;
- mobile impeccable.

### Priorité 3 — Schedule

- lisibilité ;
- hiérarchie ;
- chips live ;
- liens d'ancrage corrects.

### Priorité 4 — Posters

- affichage `cover` ;
- aspect plus immersif ;
- conserver possibilité d'ouvrir l'original.

### Priorité 5 — Mobile

Faire un vrai passage de finition :
- hero ;
- tailles de titres ;
- marges ;
- CTA ;
- schedule ;
- navigation fixe.

## 25. Critères de validation

La prochaine version est bonne si :

- elle semble être un vrai mini-site événementiel et non une affiche transformée en HTML ;
- le hero est immédiatement impactant ;
- le contenu est lisible ;
- le vert/or reste cohérent ;
- la version mobile est aussi travaillée que desktop ;
- le site charge vite ;
- aucune dépendance lourde n'est ajoutée ;
- le partage WhatsApp est propre ;
- Open Graph reste fiable ;
- toutes les informations importantes sont accessibles en 1 à 2 actions.

## 26. Consigne pour l'agent IA

Commencer par inspecter entièrement la version 3 avant toute modification.

Ne pas réécrire tout le projet sans raison.

Préférer des améliorations ciblées sur :
- structure ;
- CSS ;
- responsive ;
- lisibilité ;
- polish visuel.

À la fin :
1. fournir tous les fichiers modifiés ;
2. créer un ZIP complet prêt à déployer ;
3. résumer précisément les changements ;
4. indiquer les éventuelles informations encore manquantes, notamment :
   - URL HelloAsso ;
   - URLs YouTube.
