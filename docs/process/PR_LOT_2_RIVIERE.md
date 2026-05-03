# PR Lot 2 — texte à coller sur GitHub

**Titre suggéré**  
`[Lot 2] Vue Rivière : layout horizontal, PersonChip, flag /riviere + QA`

**Base** : `develop`  
**Compare** : `dev` (ou `feature/vue-riviere` si tu renommes la branche avant push)

---

```markdown
## Lot concerné
Lot 2 — Vue Rivière

## Résumé
Ajout de la **Vue Rivière** : colonnes par génération, scroll horizontal, cartes **`PersonChip`** (140×56, bande genre M/F/O), données **`riverViewMock`**. La route **`/riviere`** est servie derrière le feature flag **`VUE_RIVIERE_ENABLED`** (ON en `npm run dev`, OFF en build prod → placeholder). Alignement des types **`RiverViewNode.gender`** sur **`'O'`** comme le reste du modèle et le backend. Correctifs annexes : **`GenealogyCard`** bande genre **2px**, **EditModeModal** bouton Annuler en **`type="button"`** (évite un submit implicite), chaîne **Jest/Babel** + garde **`scrollTo`** pour jsdom. Documentation : **`docs/qa/QA_LOT_2_RIVIERE.md`** (QA validée PO 2026-05-03), **`docs/PROJECT_STATE.md`**.

## Changements visibles utilisateur
- [ ] Aucun (refacto / chore)
- [x] Mineur (style, copy)
- [x] Majeur (nouvelle vue, nouveau flow)

## Périmètre technique
- `frontend/src/views/RiviereView.tsx` — layout, colonnes, scroll, légende
- `frontend/src/components/PersonChip.tsx` — puce Rivière (+ import React pour Jest)
- `frontend/src/mocks/riverViewMock.ts` — jeu de données démo
- `frontend/src/router.tsx` — `/riviere` lazy + flag
- `frontend/src/config/featureFlags.ts` — `VUE_RIVIERE_ENABLED`
- `frontend/src/types/index.ts` — `RiverViewNode`, genre **`O`**
- `frontend/src/__tests__/PersonChip.test.tsx`, `RiviereView.test.tsx`
- `frontend/babel.config.cjs` — ordre presets TS → React
- `frontend/src/components/GenealogyCard.tsx` — bande **2px**
- `frontend/src/components/EditModeModal.tsx` — **`type="button"`** sur Annuler
- `docs/qa/QA_LOT_2_RIVIERE.md`, `docs/PROJECT_STATE.md` (+ autres docs agents / roadmap si inclus dans le même push)

## Hors périmètre (volontaire)
- Endpoint **`GET /api/persons/{id}/river-view`** et remplacement du mock par l’API (suivi backend / lot ultérieur).
- **i18n** des chaînes Rivière / PersonChip : dette acceptée — **Lot 2bis** (ticket backlog).
- **`onPersonClick`** sur la route `/riviere` depuis le router (navigation au clic puce — lot ultérieur).
- Sections **VIII–IX** optionnelles de la checklist : Lighthouse formel non exécuté sur `/riviere` ; perf mesurable plus tard.

## Captures / vidéos
À ajouter par le reviewer si utile : capture **`/riviere`** en dev (colonnes + mock) et **`/riviere`** en **preview** (placeholder).

## Tests
- [x] Tests unitaires ajoutés ou mis à jour (`PersonChip`, `RiviereView`)
- [ ] Tests d'intégration ajoutés ou mis à jour
- [x] Test manuel exécuté — voir **`docs/qa/QA_LOT_2_RIVIERE.md`** (journal + coches) : dev, preview, TopBar, arbre `/`, console.

## Non-régression
- [x] Arbre vertical (`/`) testé : OK (PO — GenealogyCard 2px + comportement arbre)
- [ ] Admin (`/admin`) testé : OK *(à confirmer reviewer si touché indirectement — pas de changement fonctionnel ciblé)*
- [x] Autres vues activées testées : OK (`/riviere` dev + preview)
- [x] Build production OK (`npm run build`)
- [ ] Bundle size diff : *non mesuré pour cette PR ; chunk `RiviereView` en lazy, flag OFF en prod évite de charger la vue en bundle initial sur `/riviere`.*

## Backend impacté
- [x] Non

## Feature flag
- [ ] Pas de flag (refacto / Lot 1)
- [x] Flag : **`VUE_RIVIERE_ENABLED`** — défaut : **OFF** en prod (`import.meta.env.DEV`), **ON** en dev

## Checklist QA Challenger (Iris)
Checklist lot : **`docs/qa/QA_LOT_2_RIVIERE.md`** — **validée PO** (2026-05-03), journal à jour. Label **`qa-validated`** selon process équipe.

- [x] Checklist du lot exécutée intégralement *(PO + Alma auto)*
- [x] Tentatives de cassage explicites menées *(cas limites couverts en RTL + preview flag)*
- [ ] Lighthouse perf ≥ baseline *(non requis merge Lot 2 — acceptation PO ; voir doc QA)*
- [x] A11y : navigation / structure — colonnes `aria-label`, chips `role="article"` *(tests RTL + revue PO ; pas de VoiceOver formel)*
- [ ] i18n : 0 chaîne hardcodée ajoutée *(dette acceptée Lot 2bis — chaînes FR encore en dur dans Rivière / PersonChip)*

### Cas tordus testés
1. **Preview** : `/riviere` → placeholder (flag OFF).
2. **Jest** : `scrollTo` absent (jsdom) — pas de crash au montage `RiviereView`.
3. **EditModeModal** : Annuler ne déclenche plus `onLogin('')`.

## Risques connus / dette acceptée
| Sujet | Suivi |
|--------|--------|
| i18n Rivière / PersonChip | Ticket **Lot 2bis** — `fr.json` + `t()` |
| API `river-view` + mock | Branchement **Ada** + ticket |
| `onPersonClick` sur `/riviere` | Lot ultérieur |
| Lighthouse `/riviere` | Optionnel Lot 3+ |

---

**Reviewers** : Théo (front) selon `docs/agents/cursor/theo-frontend.md` ; label QA selon Iris / Alma.
```
