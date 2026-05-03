# PROJECT_STATE — GegeDot / Yeboekun

_Fichier partagé PO ↔ agents. Mise à jour à chaque interaction structurante._

---

## Relais équipe Claude (Émile) — lecture obligatoire en entrée de session

**Dernière main Cursor (Victor)** : 2026-05-03.

1. **Lot 2** : implémentation front + tests + QA **validée** — détail **`docs/qa/QA_LOT_2_RIVIERE.md`**. Il reste **d’exécuter côté Git** : commit / push des fichiers locaux si besoin, puis **PR vers `develop`** (brouillon description : **`docs/process/PR_LOT_2_RIVIERE.md`**). **`main`** = prod uniquement via **release** — voir **`docs/process/GITFLOW.md`** (section *Flux PO / intégration vs production*).
2. **Dettes actées dans la QA** (ne pas rouvrir sans ticket) : **i18n** Rivière/PersonChip → **Lot 2bis** ; **`onPersonClick`** sur `/riviere` → lot ultérieur ; **API `GET …/river-view`** → quand Ada branchera, valider `RiverViewData` + genre **`M/F/O`**.
3. **Prochain lot logique** : **Lot 3** — Vue Contemplation ; prérequis API noté dans la roadmap (Ada).

Émile : mets à jour ce fichier après ta première action structurante (PR mergée, rebaselot, etc.) et signe **Émile + date**.

---

## Lot en cours : **Lot 2 — Vue Rivière**

**Branche** : `dev`
**Statut** : **QA validée** (2026-05-03) — voir `docs/qa/QA_LOT_2_RIVIERE.md`. **Suite : PR Lot 2 → `develop`** (prod = `main` via release).

---

## Ce qui est fait (Lot 2)

| Élément | État |
|---|---|
| `RiviereView.tsx` — layout colonnes + scroll horizontal | ✅ |
| `PersonChip.tsx` — carte 140×56px, bande genre, a11y clavier | ✅ |
| `featureFlags.ts` — `VUE_RIVIERE_ENABLED` (ON en DEV, OFF en prod) | ✅ |
| `router.tsx` — `/riviere` derrière feature flag | ✅ |
| `GenealogyCard.tsx` — bande genre `borderLeft` (encodage genre Lot 1 reporté) | ✅ |
| Tests `PersonChip.test.tsx` + `RiviereView.test.tsx` | ✅ 26/26 passent (Jest) |

---

## Bloquants avant merge Lot 2

1. ~~Checklist QA~~ — **complétée** (`QA_LOT_2_RIVIERE.md`).
2. ~~Correctifs + doc hors repo~~ — **poussés** sur `origin/dev` (**`d126441`** lot doc + front, **`6cb0849`** état PR).
3. **PR Lot 2** : à ouvrir / merger sur **`develop`** (template `docs/process/PR_TEMPLATE.md` + corps `docs/process/PR_LOT_2_RIVIERE.md`) ; **`main`** au moment d’une **release**.

---

## Décisions actées (Lot 2)

- **Genre** : `RiverViewNode.gender` aligné sur **`'M' | 'F' | 'O'`** (comme `Person` / enum C#). `PersonChip` + types mis à jour.
- **GenealogyCard** : bande genre **`2px`** (aligné spec).
- **Jest** : `babel.config` — preset **TypeScript avant React** ; `PersonChip` / `RiviereView` importent **React** (Babel émettait `createElement` sans binding) ; **scrollTo** dégradé proprement si absent (jsdom).

---

## Lots précédents

| Lot | Statut | PR |
|---|---|---|
| Lot 0 — Préparation | ✅ mergé | — |
| Lot 1 — Foundation | ✅ mergé | #33 + #35 |
| Lot 2 — Vue Rivière | ✅ QA validée — PR à merger | à ouvrir |

---

## Prochains lots

- **Lot 3** — Vue Contemplation (refacto FanCanvas). Pré-requis : valider avec Ada que l'API renvoie ascendants + descendants.
- **Lot 4** — Vue Atelier (PersonForm en page dédiée)
- **Lot 5** — Vue Tableau (dashboard)

---

_Mis à jour par Victor — 2026-05-03 (relais + doc poussée `d126441`)_
