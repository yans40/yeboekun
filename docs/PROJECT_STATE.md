# PROJECT_STATE — GegeDot / Yeboekun

> Source de vérité du projet — pilotée par Émile (Claude Code)
> Dernière mise à jour : 2026-05-08 par Émile

---

## Lot en cours : **Lot 4 — Vue Atelier**

- **Branche active** : `dev` (prêt pour nouvelle feature branch)
- **Statut** : démarrage — Lot 3 + mobile shell mergés.

---

## Lots précédents

| Lot | Statut | PR |
|---|---|---|
| Lot 0 — Préparation | ✅ mergé | — |
| Lot 1 — Foundation (tokens, shell, i18n, routing) | ✅ mergé | #33 + #35 |
| Lot 2 — Vue Rivière + Brand | ✅ mergé | #38 |
| Lot 3 — Vue Contemplation (FanCanvasV2 + usePersonTree) | ✅ mergé | #39 |
| Mobile Shell Pass (M1–M5 : hamburger, Drawer, safe-area, dvh, touch) | ✅ mergé dans dev | #40 |

---

## Prochains lots

- **Lot 4** — Vue Atelier (PersonForm en page dédiée `/atelier`)
- **Lot 5** — Vue Tableau (dashboard)

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

## CI/CD active

- ✅ ci.yml — build + tests frontend/backend
- ✅ pr-checklist.yml — cases obligatoires du PR template
- ✅ require-qa-label.yml — label `qa-validated` requis
- ✅ perf-gates.yml — bundle size + Lighthouse vs BASELINE
- ⏸️ auto-assign-reviewers.yml.disabled (à réactiver si org GitHub créée)

---

## Résumés de fichiers (cache)

- `.github/workflows/docker-build.yml` : remplacé `docker-compose` par `docker compose` sur build/up/down pour compatibilité runner GitHub (check `docker-test` PR #39).
- PR `#39` (Lot 3 Contemplation) : échecs observés = `check-label` (label `qa-validated` manquant), `checklist` (cases PR non cochées), `docker-test` (commande compose), `lighthouse` (Perf 85 < 90 ; A11y 100, BP 96, SEO 92).

---

*Mis à jour par Victor — 2026-05-08*
