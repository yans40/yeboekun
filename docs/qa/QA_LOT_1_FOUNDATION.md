# QA — Lot 1 : Foundation (Tokens + Shell)

> Dérivé du plan UI établi le 2026-05-01.
> Responsable QA : Iris · Branche de référence : `dev` · commit `daff275`
> Ne rien fusionner vers `dev` tant que tous les items **obligatoires** ne sont pas cochés.
> Baseline officielle : run unique du 2026-05-01 — voir [BASELINE.md](./BASELINE.md) (frozen).

---

## Baseline — État avant tout changement

Mesures effectuées le **2026-05-01** sur la branche `dev`
(commit `daff275`) via `vite build` + `vite preview` + Lighthouse CLI headless.

### Bundle size

| Fichier | Raw | Gzip |
|---|---|---|
| `index-tkW5AjWU.js` | **462.55 kB** | **145.75 kB** |
| `index.html` | 0.91 kB | 0.54 kB |

Chunks : **1 seul chunk** (pas de code-splitting).

### Scores Lighthouse

| Catégorie | Score baseline | Seuil mini post-Lot 1 |
|---|---|---|
| Performance | **92** | ≥ 90 |
| Accessibility | **95** | ≥ 95 (non-régression stricte) |
| Best Practices | **96** | ≥ 95 |
| SEO | **82** | ≥ 90 |

### Métriques Core Web Vitals

| Métrique | Baseline | Score LH | Seuil post-Lot 1 |
|---|---|---|---|
| FCP | **2 611 ms** | 0.63 ⚠️ | ≤ 1 800 ms |
| LCP | **2 709 ms** | 0.85 ⚠️ | ≤ 2 000 ms |
| TBT | **0 ms** | 1.00 ✅ | ≤ 50 ms |
| CLS | **0** | 1.00 ✅ | ≤ 0.05 |
| Speed Index | **2 701 ms** | 0.96 ✅ | ≤ 2 700 ms |
| TTI | **2 709 ms** | 0.97 ✅ | ≤ 2 700 ms |

> **Objectif Lot 1** : FCP/LCP ≤ 2.0 s grâce au préchargement des fonts (gain estimé −1 020 ms).

### Problèmes identifiés dans la baseline

| Problème | Impact | Traitement |
|---|---|---|
| Font Inter (Google Fonts) bloquante au rendu — 1 030 ms perdus | Perf | Lot 1 : `preload` + `font-display: swap` |
| 67 kB JS inutilisés dans le bundle (MUI icons non tree-shaken) | Perf | Lot 2+ |
| `color-contrast` — textes à faible contraste | A11y | Lot 1 : tokens bien contrastés |
| Pas de `<meta description>` | SEO | Lot 1 : `index.html` |
| Pas de `robots.txt` | SEO | Hors scope Lot 1 |

---

## Checklist Lot 1

Format : `[ ]` à faire · `[x]` fait · `[~]` partiel · `[!]` bloquant/décision requise

### I. Infrastructure i18n

> Contrainte non négociable : tout texte d'interface passe par `t()`.

- [x] **i18n-1** Installer `react-i18next` + `i18next` dans `frontend/package.json`
- [x] **i18n-2** Créer `frontend/src/i18n/index.ts` (setup i18next, langue par défaut `fr`)
- [x] **i18n-3** Créer `frontend/src/i18n/fr.json` avec toutes les clés des composants existants (AppSidebar, FanCanvas, GenealogyCard, PersonForm, EditModeModal)
- [x] **i18n-4** Wrapper `<I18nextProvider>` ajouté dans `main.tsx` ou `App.tsx`
- [x] **i18n-5** Vérifier qu'aucune chaîne en dur n'existe dans les composants modifiés au Lot 1 (grep `"fr"` hardcodé)

### II. Routing

- [x] **route-1** Installer `react-router-dom` v6 dans `frontend/package.json`
- [x] **route-2** Créer `frontend/src/router.tsx` avec les 7 routes du Lot 1 :
  - `/` → arbre vertical existant (vue principale conservée, composant actuel)
  - `/arbre` → alias de `/` (`<Navigate to="/" replace />`)
  - `/tableau` → `<PlaceholderView name="Tableau" />`
  - `/contempler` → `<PlaceholderView name="Contempler" />`
  - `/riviere` → `<PlaceholderView name="Rivière" />`
  - `/atelier/:id` → `<PlaceholderView name="Atelier" />`
  - `/admin` → contenu actuel de la vue admin migré tel quel
  - `/album` et `/pistes` : **hors scope Lot 1 — backlog dédié**
- [x] **route-3** `<PlaceholderView>` affiche le nom de la vue + mention "bientôt" — pas de page blanche, pas de 404
- [x] **route-4** L'arbre vertical actuel est conservé sur `/` sans régression fonctionnelle — aucun fichier de logique de rendu modifié
- [x] **route-5** Les liens directs `http://localhost:5173/` et `http://localhost:5173/arbre` fonctionnent (pas de 404 en dev)

### III. Tokens de design

- [x] **token-1** Créer `frontend/src/theme/tokens.ts` exportant : `colors`, `fonts`, `spacing`, `radius`, `shadows`
- [x] **token-2** Palette complète (17 couleurs : paper, paper2, paper3, cream, ink×4, line×2, sepia, sepiaLt, rust, olive, forest, ocean, gold)
- [x] **token-3** 4 familles typographiques déclarées : serif (Cormorant Garamond), sans (Geist), mono (Geist Mono), hand (Caveat)
- [x] **token-4** Échelle d'espacement base-4 (4→64 px, 10 valeurs)
- [x] **token-5** Radius : xs/sm/md/lg/pill/circle
- [x] **token-6** Ombres : xs/sm/md/lg/xl
- [x] **token-7** Aucun `color.primary.main` ou `color.secondary.main` bleu/rose résiduel dans les composants touchés au Lot 1

### IV. ThemeProvider MUI

- [x] **theme-1** `createTheme` dans `App.tsx` consomme exclusivement `tokens.ts` (plus de valeurs littérales inline)
- [x] **theme-2** Override `MuiChip` : variants solid, outline, rust, olive mappés sur les tokens
- [x] **theme-3** Override `MuiTabs` / `MuiTab` : active state = `2px solid` underline en `color.sepia`
- [x] **theme-4** Override `MuiButton` : palette primaire = sepia, secondaire = ink
- [x] **theme-5** Override `MuiDialog` : border-radius = `radius.lg`, background = `color.paper`
- [x] **theme-6** `CssBaseline` injecte `background-color: color.paper` et `font-family: font.sans`

### V. Chargement des fonts

- [x] **font-1** `Cormorant Garamond` (weights 400, 600, italic) chargée via `<link rel="preload">` dans `index.html`
- [x] **font-2** `Geist` chargée via package npm `geist` (évite le round-trip Google Fonts) **OU** via `<link rel="preload">` avec `font-display: swap`
- [x] **font-3** `Geist Mono` déclarée (peut partager le package `geist`)
- [x] **font-4** `Caveat` chargée uniquement en Lot 2 (non utilisée au Lot 1 — pas de `hand` font en prod inutilement)
- [x] **font-5** Vérifier post-build : aucune font resource bloquante dans le rapport Lighthouse (render-blocking-resources = 0) — **mesuré : 0 resource** ✅

### VI. Shell de navigation

> ✅ **Décision initiale 2026-05-01** : architecture hybride NavRail 72px + TopBar.
> ✅ **Décision révisée 2026-05-02** : NavRail retiré — conformité stricte à la maquette `hifi-shared.jsx`.
> Navigation primaire déplacée dans la TopBar (liens texte centrés, sans icônes).
> `NavRail.tsx` renommé `NavRailLegacy.tsx`, conservé dans le repo mais retiré du layout.

#### NavRail — supersédé par décision 2026-05-02

- [~] **shell-1** ~~NavRail 72px~~ — retiré au profit de la TopBar maquette. `NavRailLegacy.tsx` conservé.
- [~] **shell-2** — voir shell-1
- [~] **shell-3** — voir shell-1
- [~] **shell-4** Logo `G.` remplacé par `gegedot` italic dans la TopBar (conforme maquette)
- [~] **shell-5** Icônes + codes 2 lettres — supprimés (décision 2026-05-02, sans icônes)
- [~] **shell-6** — voir shell-1
- [~] **shell-7** — voir shell-1
- [~] **shell-8** Avatar déplacé dans TopBar (droite)
- [~] **shell-9** — sans objet

#### TopBar (hauteur 60px, conforme maquette hifi-shared.jsx)

- [x] **shell-10** Créer `frontend/src/components/TopBar.tsx` — hauteur `60px` (maquette), `width: 100%`
- [x] **shell-11** Background : gradient `color.cream → color.paper` (conforme maquette)
- [x] **shell-12** Bordure basse : `1px solid color.line2`
- [~] **shell-13** Breadcrumb remplacé par les liens nav texte (plus pertinent sans NavRail)
- [x] **shell-14** Sélecteur de personne (gauche) : dropdown compact `persons`, mono 11px, fond `color.paper3` — déclenche `onPersonSelect` ✅ décision B 2026-05-01
- [x] **shell-15** Search ⌘K : pill `radius.pill`, fond `color.cream`, icône SVG, badge ⌘K
- [x] **shell-16** Avatar (droite) : 32px, gradient sepiaLt→sepia, initiales serif italic, boxShadow — clic → `MuiMenu` → "Mode édition" → `/admin` ✅ décision C 2026-05-01
- [~] **shell-17** Ombre basse retirée — gradient suffit (conforme maquette)
- [x] **shell-nav** Liens texte centrés : Arbre / Tableau / Rivière / Contempler / Atelier — actif : font-weight 500 + underline 2px ink — sans icônes ✅ décision 2026-05-02

#### Assemblage

- [x] **shell-18** Layout racine : `display: flex; flex-direction: column` — TopBar + `<main>` (NavRail retiré)
- [x] **shell-19** `AppSidebar.tsx` renommé `AppSidebarLegacy.tsx`, retiré de la nav, conservé dans le repo
- [x] **shell-20** Composant `PlaceholderView` créé : nom de la vue en `font.serif italic 32px`, mention "bientôt" en `font.mono color.ink4`
- [x] **shell-21** Le shell n'importe pas `FanCanvas` directement — routage lazy (`React.lazy`) pour chaque vue

#### Décisions actées

> ✅ **shell-14 — Sélecteur de personne (TopBar)** : décision **B** — 2026-05-01
> Dropdown compact dans la TopBar reprenant la liste `persons`. Déclenche `onPersonSelect`. Remplace l'AppSidebar comme point d'entrée principal de sélection.

> ✅ **shell-admin — Accès `/admin`** : décision **C** — 2026-05-01
> Clic sur l'avatar (shell-16) ouvre un `MuiMenu` avec l'entrée "Mode édition" → navigue vers `/admin`. Aucune icône admin dans la nav.

> ✅ **shell-nav — Navigation sans icônes** : décision **2026-05-02**
> Conformité stricte à `hifi-shared.jsx` : liens texte dans la TopBar, pas de sidebar, pas d'icônes.

#### Backlog Lot 2

- [ ] **shell-22** `[backlog Lot 2]` Supprimer définitivement `AppSidebarLegacy.tsx` et `NavRailLegacy.tsx` une fois la nouvelle nav validée en production

### VII. index.html & meta

- [x] **meta-1** `<title>GegeDot — Arbre généalogique</title>` défini
- [x] **meta-2** `<meta name="description" content="...">` ajouté (fixe SEO score baseline)
- [x] **meta-3** `<meta name="theme-color" content="#f4efe6">` (color paper)
- [x] **meta-4** `lang="fr"` sur la balise `<html>`

### VIII. Non-régression Arbre vertical

> L'arbre vertical (vue actuelle sur `/`) est la vue principale conservée au Lot 1.
> Aucun changement fonctionnel sur ses fichiers — toute modification de rendu est bloquante.
>
> **Note (confirmée par lecture du code, 2026-05-01)** : le composant d'entrée est `FanCanvas` dans `FanCanvas.tsx` — le nom est historique, ce n'est pas un éventail en arc. Le layout vertical est fourni par le backend via `useFamilyTree` ; `FanCanvas` est un canvas pan/zoom générique qui affiche ce que le layout lui donne. Il n'existe pas de second composant "arbre" distinct.
> **Fichiers à verrouiller (zéro ligne modifiée)** : `FanCanvas.tsx`, `useFamilyTree.ts`, `ConnectionLayer.tsx`, `GenealogyCard.tsx`.

- [x] **fan-1** `FanCanvas.tsx` — aucune ligne modifiée (`git diff dev...feature/lot-1-foundation` vide) ✅
- [x] **fan-2** `useFamilyTree.ts` — aucune ligne modifiée ✅
- [x] **fan-3** `ConnectionLayer.tsx` — aucune ligne modifiée ✅
- [x] **fan-4** `GenealogyCard.tsx` — aucune ligne modifiée (restyling reporté au Lot 2) ✅
- [ ] **fan-5** Sur `/` : sélectionner une personne depuis la nouvelle nav → l'arbre vertical se charge correctement *(test navigateur requis)*
- [ ] **fan-6** Sur `/` : zoom in/out et bouton reset fonctionnent *(test navigateur requis)*
- [ ] **fan-7** Sur `/` : clic sur un nœud de l'arbre → personne mise en surbrillance dans la nav *(test navigateur requis)*

### IX. Tests & CI

- [x] **ci-1** `npm run build` passe sans erreur TypeScript ✅ (6 chunks, 0 erreur)
- [x] **ci-2** `npm test` passe — **49/49 tests** ✅
- [ ] **ci-3** Aucun `console.error` dans la console navigateur sur `/` *(test navigateur requis)*
- [ ] **ci-4** Aucun `console.error` sur `/tableau` *(test navigateur requis)*

---

## Mesures post-Lot 1

Mesurées le **2026-05-02** sur `feature/lot-1-foundation` (commit `854c774`) via `vite build` + `vite preview` + Lighthouse CLI headless.

```bash
cd frontend && npm run build
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npx vite preview --port 4173 &
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npx lighthouse http://localhost:4173 \
  --output json --output-path /tmp/lighthouse-lot1.json \
  --chrome-flags="--headless --no-sandbox --disable-gpu" \
  --only-categories=performance,accessibility,best-practices,seo --quiet
```

### Bundle (6 chunks)

| Chunk | Raw | Gzip |
|---|---|---|
| `index.js` | 51.69 kB | 20.74 kB |
| `vendor.js` | 89.48 kB | 30.17 kB |
| `mui.js` | 385.16 kB | 119.12 kB |
| `i18n.js` | 57.45 kB | 19.19 kB |
| `ArbreView.js` | 21.01 kB | 7.26 kB |
| `AdminPage.js` | 1.29 kB | 0.57 kB |
| **Total** | **606.08 kB** | **197.05 kB** |

> ⚠️ MUI chunk dominant (119 kB gzip). Waterfall multi-chunks explique la régression FCP/LCP vs baseline 1 chunk.
> Lot 2 : tree-shaking MUI icons (`@mui/material/...` imports nommés).

### Scores et métriques

| Métrique | Baseline (officielle) | Post-Lot 1 | Delta | Seuil | Statut |
|---|---|---|---|---|---|
| Perf score | **92** | **86** | −6 | ≥ 90 | ❌ |
| A11y score | **95** | **100** | +5 | ≥ 95 | ✅ |
| Best Practices | **96** | **96** | 0 | ≥ 95 | ✅ |
| SEO score | **82** | **91** | +9 | ≥ 90 | ✅ |
| FCP | **2 611 ms** | **2 800 ms** | +189 ms | ≤ 1 800 ms | ❌ |
| LCP | **2 709 ms** | **3 500 ms** | +791 ms | ≤ 2 000 ms | ❌ |
| TBT | **0 ms** | **80 ms** | +80 ms | ≤ 50 ms | ❌ |
| CLS | **0** | **0.002** | +0.002 | ≤ 0.05 | ✅ |
| Speed Index | **2 701 ms** | **2 800 ms** | +99 ms | ≤ 2 700 ms | ❌ |
| Bundle JS (raw) | **462.55 kB** | **606 kB** | +143 kB | — | — |
| Bundle JS (gzip) | **146 kB** | **197 kB** | +51 kB | — | — |
| Render-blocking | **1 resource** | **0** | −1 | 0 | ✅ |

> **Analyse** : Inter supprimée → render-blocking = 0 ✅. Mais le split en 6 chunks crée un waterfall (index → vendor → mui) qui rallonge FCP/LCP. Le TBT augmente car MUI + Router + i18n + App Shell s'initialisent tous au premier paint. A11y et SEO progressent comme prévu.
> **Décision requise (Iris)** : bloquer la PR sur Perf 86 < 90, ou accepter avec ticket Lot 2 pour tree-shaking MUI ?

---

## Critères de validation du Lot 1

Le Lot 1 est **validé** si :
1. Tous les items obligatoires ci-dessus sont cochés
2. Performance ≥ 90, Accessibility ≥ 95 (non-régression stricte sur la baseline officielle)
3. LCP ≤ 2 000 ms (objectif depuis baseline 2 709 ms)
4. `npm run build` + `npm test` passent en CI
5. Aucun texte d'interface hardcodé dans les composants modifiés au Lot 1
6. `/album` et `/pistes` absents du router (backlog dédié)

---

*Dernière mise à jour : 2026-05-02 — Léo (mesures pre-merge)*
