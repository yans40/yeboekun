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

- [ ] **i18n-1** Installer `react-i18next` + `i18next` dans `frontend/package.json`
- [ ] **i18n-2** Créer `frontend/src/i18n/index.ts` (setup i18next, langue par défaut `fr`)
- [ ] **i18n-3** Créer `frontend/src/i18n/fr.json` avec toutes les clés des composants existants (AppSidebar, FanCanvas, GenealogyCard, PersonForm, EditModeModal)
- [ ] **i18n-4** Wrapper `<I18nextProvider>` ajouté dans `main.tsx` ou `App.tsx`
- [ ] **i18n-5** Vérifier qu'aucune chaîne en dur n'existe dans les composants modifiés au Lot 1 (grep `"fr"` hardcodé)

### II. Routing

- [ ] **route-1** Installer `react-router-dom` v6 dans `frontend/package.json`
- [ ] **route-2** Créer `frontend/src/router.tsx` avec les 7 routes du Lot 1 :
  - `/` → arbre vertical existant (vue principale conservée, composant actuel)
  - `/arbre` → alias de `/` (`<Navigate to="/" replace />`)
  - `/tableau` → `<PlaceholderView name="Tableau" />`
  - `/contempler` → `<PlaceholderView name="Contempler" />`
  - `/riviere` → `<PlaceholderView name="Rivière" />`
  - `/atelier/:id` → `<PlaceholderView name="Atelier" />`
  - `/admin` → contenu actuel de la vue admin migré tel quel
  - `/album` et `/pistes` : **hors scope Lot 1 — backlog dédié**
- [ ] **route-3** `<PlaceholderView>` affiche le nom de la vue + mention "bientôt" — pas de page blanche, pas de 404
- [ ] **route-4** L'arbre vertical actuel est conservé sur `/` sans régression fonctionnelle — aucun fichier de logique de rendu modifié
- [ ] **route-5** Les liens directs `http://localhost:5173/` et `http://localhost:5173/arbre` fonctionnent (pas de 404 en dev)

### III. Tokens de design

- [ ] **token-1** Créer `frontend/src/theme/tokens.ts` exportant : `colors`, `fonts`, `spacing`, `radius`, `shadows`
- [ ] **token-2** Palette complète (17 couleurs : paper, paper2, paper3, cream, ink×4, line×2, sepia, sepiaLt, rust, olive, forest, ocean, gold)
- [ ] **token-3** 4 familles typographiques déclarées : serif (Cormorant Garamond), sans (Geist), mono (Geist Mono), hand (Caveat)
- [ ] **token-4** Échelle d'espacement base-4 (4→64 px, 10 valeurs)
- [ ] **token-5** Radius : xs/sm/md/lg/pill/circle
- [ ] **token-6** Ombres : xs/sm/md/lg/xl
- [ ] **token-7** Aucun `color.primary.main` ou `color.secondary.main` bleu/rose résiduel dans les composants touchés au Lot 1

### IV. ThemeProvider MUI

- [ ] **theme-1** `createTheme` dans `App.tsx` consomme exclusivement `tokens.ts` (plus de valeurs littérales inline)
- [ ] **theme-2** Override `MuiChip` : variants solid, outline, rust, olive mappés sur les tokens
- [ ] **theme-3** Override `MuiTabs` / `MuiTab` : active state = `2px solid` underline en `color.sepia`
- [ ] **theme-4** Override `MuiButton` : palette primaire = sepia, secondaire = ink
- [ ] **theme-5** Override `MuiDialog` : border-radius = `radius.lg`, background = `color.paper`
- [ ] **theme-6** `CssBaseline` injecte `background-color: color.paper` et `font-family: font.sans`

### V. Chargement des fonts

- [ ] **font-1** `Cormorant Garamond` (weights 400, 600, italic) chargée via `<link rel="preload">` dans `index.html`
- [ ] **font-2** `Geist` chargée via package npm `geist` (évite le round-trip Google Fonts) **OU** via `<link rel="preload">` avec `font-display: swap`
- [ ] **font-3** `Geist Mono` déclarée (peut partager le package `geist`)
- [ ] **font-4** `Caveat` chargée uniquement en Lot 2 (non utilisée au Lot 1 — pas de `hand` font en prod inutilement)
- [ ] **font-5** Vérifier post-build : aucune font resource bloquante dans le rapport Lighthouse (render-blocking-resources = 0)

### VI. Shell de navigation

> ✅ **Décision validée le 2026-05-01** : architecture **hybride**
> `NavRail 72px` (navigation primaire, icônes) + `TopBar` (breadcrumbs · sélecteur de personne · ⌘K · avatar+menu)
> Voir mapping de tokens détaillé ci-dessous.

#### NavRail (72px fixe, gauche)

- [ ] **shell-1** Créer `frontend/src/components/NavRail.tsx` — largeur fixe `72px`, hauteur `100vh`
- [ ] **shell-2** Background : `color.paper2` (`#ece5d6`) — légèrement plus sombre que le contenu
- [ ] **shell-3** Bordure droite : `1px solid color.line` (`#cabfa6`)
- [ ] **shell-4** Logo en haut : badge `G.` — `font.serif` italic, `color.sepia`, `24px`
- [ ] **shell-5** 5 icônes de nav + libellé 2 lettres (`AR`, `TB`, `CT`, `RV`, `AT`) — `font.mono`, `9px`, `letter-spacing 0.08em` — admin absent du NavRail (accès via menu avatar) — `/album` et `/pistes` absents du NavRail au Lot 1
- [ ] **shell-6** État actif : fond `rgba(125,90,54,0.10)` (sepia 10%) + trait gauche `2px solid color.sepia`
- [ ] **shell-7** État inactif : icône `color.ink4`, libellé `color.ink4` — hover : `color.ink2`
- [ ] **shell-8** Avatar profil en bas : `radius.circle`, gradient `color.sepia → color.rust`
- [ ] **shell-9** Aucun texte long — uniquement icônes + codes 2 lettres (pas de tooltip requis au Lot 1)

#### TopBar (hauteur 48px, au-dessus du contenu principal)

- [ ] **shell-10** Créer `frontend/src/components/TopBar.tsx` — hauteur `48px`, `width: 100%`
- [ ] **shell-11** Background : `color.paper` (`#f4efe6`) — même teinte que le canvas
- [ ] **shell-12** Bordure basse : `1px solid color.line2` (`#ddd2b8`) — plus légère que le NavRail
- [ ] **shell-13** Breadcrumb gauche : `font.mono`, `11px`, `color.ink3`, `letter-spacing 0.08em`, séparateur `›` en `color.line`
- [ ] **shell-14** Sélecteur de personne (centre-gauche) : dropdown compact reprenant la liste de `persons` (ex-AppSidebar) — `font.sans`, `12px`, `color.ink2`, `radius.sm`, fond `color.paper2` — déclenche `onPersonSelect` comme l'AppSidebar actuel ✅ décision B 2026-05-01
- [ ] **shell-15** Search ⌘K (centre) : pill `radius.pill`, fond `color.paper2`, bordure `color.line`, placeholder `font.mono` `color.ink4`, icône `color.ink4`
- [ ] **shell-16** Avatar (droite) : `32px`, `radius.circle`, initiales `font.sans 13px`, fond gradient sepia — identique shell-8 — clic ouvre un menu (`MuiMenu`) avec l'entrée "Mode édition" → `/admin` ✅ décision C 2026-05-01
- [ ] **shell-17** Ombre basse : `shadow.xs` (`0 1px 2px rgba(0,0,0,0.04)`) — pas de shadow.sm ou plus

#### Assemblage

- [ ] **shell-18** Layout racine dans `App.tsx` : `display: flex; flex-direction: row` — `NavRail` + colonne `[TopBar / <Outlet>]`
- [ ] **shell-19** `AppSidebar.tsx` **renommé en `AppSidebarLegacy.tsx`**, retiré de la nav par défaut mais conservé dans le repo — le prop `sidebarCollapsed` est retiré de `App.tsx`
- [ ] **shell-20** Composant `PlaceholderView` créé : nom de la vue en `font.serif italic 32px`, mention "bientôt" en `font.mono color.ink4`
- [ ] **shell-21** Le shell n'importe pas `FanCanvas` directement — routage lazy (`React.lazy`) pour chaque vue

#### Décisions actées

> ✅ **shell-14 — Sélecteur de personne (TopBar)** : décision **B** — 2026-05-01
> Dropdown compact dans la TopBar reprenant la liste `persons`. Déclenche `onPersonSelect`. Remplace l'AppSidebar comme point d'entrée principal de sélection.

> ✅ **shell-admin — Accès `/admin`** : décision **C** — 2026-05-01
> Clic sur l'avatar (shell-8/shell-16) ouvre un `MuiMenu` avec l'entrée "Mode édition" → navigue vers `/admin`. Aucune icône admin dans le NavRail.

#### Backlog Lot 2

- [ ] **shell-22** `[backlog Lot 2]` Supprimer définitivement `AppSidebarLegacy.tsx` une fois la nouvelle nav validée en production

### VII. index.html & meta

- [ ] **meta-1** `<title>GegeDot — Arbre généalogique</title>` défini
- [ ] **meta-2** `<meta name="description" content="...">` ajouté (fixe SEO score baseline)
- [ ] **meta-3** `<meta name="theme-color" content="#f4efe6">` (color paper)
- [ ] **meta-4** `lang="fr"` sur la balise `<html>`

### VIII. Non-régression Arbre vertical

> L'arbre vertical (vue actuelle sur `/`) est la vue principale conservée au Lot 1.
> Aucun changement fonctionnel sur ses fichiers — toute modification de rendu est bloquante.
>
> **Note (confirmée par lecture du code, 2026-05-01)** : le composant d'entrée est `FanCanvas` dans `FanCanvas.tsx` — le nom est historique, ce n'est pas un éventail en arc. Le layout vertical est fourni par le backend via `useFamilyTree` ; `FanCanvas` est un canvas pan/zoom générique qui affiche ce que le layout lui donne. Il n'existe pas de second composant "arbre" distinct.
> **Fichiers à verrouiller (zéro ligne modifiée)** : `FanCanvas.tsx`, `useFamilyTree.ts`, `ConnectionLayer.tsx`, `GenealogyCard.tsx`.

- [ ] **fan-1** `FanCanvas.tsx` — aucune ligne modifiée (`git diff` vide sur ce fichier)
- [ ] **fan-2** `useFamilyTree.ts` — aucune ligne modifiée
- [ ] **fan-3** `ConnectionLayer.tsx` — aucune ligne modifiée
- [ ] **fan-4** `GenealogyCard.tsx` — aucune ligne modifiée (restyling reporté au Lot 2)
- [ ] **fan-5** Sur `/` : sélectionner une personne depuis la nouvelle nav → l'arbre vertical se charge correctement
- [ ] **fan-6** Sur `/` : zoom in/out et bouton reset fonctionnent
- [ ] **fan-7** Sur `/` : clic sur un nœud de l'arbre → personne mise en surbrillance dans la nav

### IX. Tests & CI

- [ ] **ci-1** `npm run build` passe sans erreur TypeScript
- [ ] **ci-2** `npm test` passe (suite existante non cassée)
- [ ] **ci-3** Aucun `console.error` dans la console navigateur sur `/` (arbre vertical)
- [ ] **ci-4** Aucun `console.error` sur `/tableau` (placeholder)

---

## Mesures post-Lot 1 (à remplir après merge)

Relancer après merge feature → dev :
```bash
cd frontend && npm run build
# noter la taille du/des chunks ci-dessous

PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npx vite preview --port 4173 &
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npx lighthouse http://localhost:4173 \
  --output json --output-path /tmp/lighthouse-lot1.json \
  --chrome-flags="--headless --no-sandbox --disable-gpu" \
  --only-categories=performance,accessibility,best-practices,seo --quiet
```

| Métrique | Baseline (officielle) | Post-Lot 1 | Delta |
|---|---|---|---|
| Perf score | **92** | | |
| A11y score | **95** | | |
| Best Practices | **96** | | |
| SEO score | **82** | | |
| FCP | **2 611 ms** | | |
| LCP | **2 709 ms** | | |
| TBT | **0 ms** | | |
| CLS | **0** | | |
| Speed Index | **2 701 ms** | | |
| Bundle JS (raw) | **462.55 kB** | | |
| Bundle JS (gzip) | **146 kB** | | |
| Render-blocking | **1 resource** | | |

---

## Critères de validation du Lot 1

Le Lot 1 est **validé** si :
1. Tous les items obligatoires ci-dessus sont cochés
2. Performance ≥ 90, Accessibility ≥ 95 (non-régression stricte sur la baseline officielle)
3. LCP ≤ 2 000 ms (objectif depuis baseline 2 709 ms)
4. `npm run build` + `npm test` passent en CI
5. Décision shell hybride actée (`shell-0` ✅ — validé 2026-05-01)
6. Aucun texte d'interface hardcodé dans les composants modifiés au Lot 1
7. `/album` et `/pistes` absents du router (backlog dédié)

---

*Dernière mise à jour : 2026-05-01 — Iris*
