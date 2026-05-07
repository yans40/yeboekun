# PROJECT_STATE — GegeDot / Yeboekun

> Source de vérité du projet — pilotée par Émile (Claude Code)
> Dernière mise à jour : 2026-05-07 par Émile

---

## Lot en cours : **Lot 2 — Vue Rivière**

- **Branche** : `dev`
- **Statut** : layout mergé en main (PR #38). Deux correctifs techniques restants avant clôture du lot.

---

## Avancement Lot 2

- [x] `RiviereView.tsx` — layout colonnes + scroll horizontal
- [x] `PersonChip.tsx` — carte 140×56px, bande genre, a11y clavier
- [x] `featureFlags.ts` — `VUE_RIVIERE_ENABLED` (ON en DEV, OFF en prod)
- [x] `router.tsx` — `/riviere` câblé derrière feature flag
- [x] `GenealogyCard.tsx` — bande genre `borderLeft` (encodage genre reporté du Lot 1)
- [x] Tests `PersonChip.test.tsx` + `RiviereView.test.tsx` — verts (75/75)
- [x] Brand Yeboekun — wordmark TopBar, favicon, manifest PWA (PR #38 mergé)
- [ ] Unifier type `gender` : `RiverViewNode` utilise `'Other'`, tout le reste utilise `'O'` → corriger
- [ ] Bande GenealogyCard : spec 2px, code 3px → vérifier/corriger
- [ ] `MINOR-A11Y-01` — `PersonForm.tsx` : `<h6>` dans `<DialogTitle>` (`<h2>`) → passer `component="div"`

---

## Décisions actées (ne pas rouvrir)

- shell-14 = B (sélecteur de personne dans TopBar)
- shell-admin = C (menu sur l'avatar)
- Encodage genre = reporté Lot 2 (zero touch sur GenealogyCard au Lot 1)
- Brand Yeboekun = Direction B (Y monogramme Sankofa) + tagline "La mémoire des liens"
- Vue principale = Arbre vertical sur `/`, conservé jusqu'à fin de refonte
- Migration repo hors iCloud = faite (`~/Code/gegeDot-claude/`)
- auto-assign-reviewers.yml = désactivé (renommé `.disabled`) jusqu'à création d'une org GitHub
- **Collaboration Cursor/Victor = abandonnée** — projet piloté uniquement via Claude Code

---

## Lots précédents

| Lot | Statut | PR |
|---|---|---|
| Lot 0 — Préparation | ✅ mergé | — |
| Lot 1 — Foundation (tokens, shell, i18n, routing) | ✅ mergé | #33 + #35 |
| Lot 2 — Vue Rivière + Brand | ✅ mergé | #38 |

---

## Prochains lots

- **Lot 3** — Vue Contemplation (refacto FanCanvas). Pré-requis : confirmer avec Ada que l'API renvoie ascendants + descendants.
- **Lot 4** — Vue Atelier (PersonForm en page dédiée)
- **Lot 5** — Vue Tableau (dashboard)

---

## CI/CD active

- ✅ ci.yml — build + tests frontend/backend
- ✅ pr-checklist.yml — cases obligatoires du PR template
- ✅ require-qa-label.yml — label `qa-validated` requis
- ✅ perf-gates.yml — bundle size + Lighthouse vs BASELINE
- ⏸️ auto-assign-reviewers.yml.disabled (à réactiver si org GitHub créée)

---

*Mis à jour par Émile — 2026-05-07*
