# PROJECT_STATE — GegeDot / Yeboekun

> Source de vérité du projet — pilotée par Émile (Claude Code)
> Dernière mise à jour : 2026-05-17 — FanCanvasV2 v5 qa-validated, PR #50 prête pour merge main — Émile

---

## Lot en cours : **FanCanvasV2 v5 — prêt pour merge main**

- **Branche active** : `dev`
- **Statut** : PR #50 `qa-validated` — merge main en attente d'approbation PO.

---

## Lots précédents

| Lot | Statut | PR |
|---|---|---|
| Lot 0 — Préparation | ✅ mergé | — |
| Lot 1 — Foundation (tokens, shell, i18n, routing) | ✅ mergé | #33 + #35 |
| Lot 2 — Vue Rivière + Brand | ✅ mergé | #38 |
| Lot 3 — Vue Contemplation (FanCanvasV2 + usePersonTree) | ✅ mergé | #39 |
| FanCanvasV2 v5 (texte horizontal, adaptName, a11y, i18n) | 🟡 qa-validated, merge en attente | #50 |
| Mobile Shell Pass (M1–M5 : hamburger, Drawer, safe-area, dvh, touch) | ✅ mergé dans dev | #40 |

---

## Prochains lots

- **Lot 4** — Vue Atelier (PersonForm en page dédiée `/atelier`)
- **Lot 5** — Vue Tableau (dashboard)
- **Lot 6** — **Accueil + ancrage + nuage** (à planifier) : gate déjà posé (hors scope Lot 6) ; Lot 6 regroupe **nuage de noms interactif** post-auth, **qui es-tu / trois portes**, fallback non identifié, persistance ancrage — spec `docs/ideas/IDEA_ANCRAGE_UTILISATEUR.md`. **Ne pas** retarder Lots 1–5 pour le nuage.

---

## Décisions actées (ne pas rouvrir)

- **Vue Contemplation — spec v4 hybride (2026-05-13)** : clic = panneau fiche ; bouton "Faire d'elle le centre" = recentrage opt-in ; fil d'ariane pour retour. Spec complète → `docs/eventail/SPEC.md`. Question Ada : API doit accepter n'importe quel personId comme racine (sous-lot 3.0).

- shell-14 = B (sélecteur de personne dans TopBar)
- shell-admin = C (menu sur l'avatar)
- Encodage genre = reporté Lot 2 (zero touch sur GenealogyCard au Lot 1)
- Brand Yeboekun = Direction B (Y monogramme Sankofa) + tagline "La mémoire des liens"
- Vue principale = Arbre vertical sur `/`, conservé jusqu'à fin de refonte
- Migration repo hors iCloud = faite (`~/Code/gegeDot-claude/`)
- auto-assign-reviewers.yml = désactivé (renommé `.disabled`) jusqu'à création d'une org GitHub
- **Collaboration Cursor/Victor = abandonnée** — projet piloté uniquement via Claude Code
- **Gate vs nuage (2026-05-09)** : gate **sobre livré tôt** (~3 j max seuil) ; **nuage interactif** (Framer ou CSS+mouse, A11y, mobile grille/touch) → **Lot 6** dédié — pas de mega-lot tout-en-un qui bâclerait le nuage

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
- `docs/ideas/IDEA_ANCRAGE_UTILISATEUR.md` : ancrage + non identifié ; **2026-05-09** = priorisation **Option B** (gate tôt, nuage Lot 6) ; nuage **densité renforcée** (PO) → typo plus petite, strates, culling/virtualisation par défaut au-delà du confort ; mobile grille/liste si besoin.
- `docs/architecture/FAMILY_ACCESS.md` : mot de passe familial partagé — activation (`FamilyAccess__*` / `Cors:Origins`), endpoints `/api/access/*`, front (`FamilyAccessScreen`, credentials), docker CI `Disabled`, distinction `VITE_EDIT_PASSWORD`. Voir aussi `README.md` § Accès lecture.
- `docs/architecture/AGENTS_SCHEMA.md` : gates CI mis à jour (`docker-build.yml`, note `auto-assign` optionnel), lien vers FAMILY_ACCESS.

---

*Mis à jour — 2026-05-17*
