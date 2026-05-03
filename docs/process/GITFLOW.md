# Gitflow GegeDot

Workflow officiel pour la refonte UI et tout chantier futur. Inspiré de Gitflow simplifié, adapté à un projet à équipe réduite.

---

## Branches permanentes

- **`main`** — état de production. Protégée. Aucun commit direct, aucun push force, aucun merge sans validation QA. Chaque merge = un tag de release `vX.Y.Z`.
- **`develop`** — branche d'intégration. Protégée. Toutes les `feature/*` y sont mergées via PR. Doit toujours être déployable en staging.

### Flux PO / intégration vs production (décision PO)

- **Flux quotidien** — tâche PO → dev → QA → PR → revue croisée : les PR de lots se **mergent dans `develop`** (staging / intégration).
- **`main`** — réservé à la **ligne prod** et aux **releases** (merge depuis `develop` ou depuis une branche `release/*` après stabilisation), pas au rythme de chaque petit lot.

Les deux branches restent **protégées** ; le rythme de merge diffère selon qu’on intègre (`develop`) ou qu’on livre (`main`).

## Branches temporaires

- **`feature/<nom-lot>`** — un lot de la roadmap = une feature branch. Vit jusqu'au merge dans `develop`. Exemple : `feature/vue-riviere`.
- **`release/vX.Y.Z`** — branche de stabilisation créée depuis `develop` quand on prépare une release. Permet le freeze + bug fixes sans bloquer les features suivantes. Mergée dans `main` ET `develop` à la sortie.
- **`hotfix/<bug>`** — créée depuis `main` pour un correctif urgent. Mergée dans `main` ET `develop`.
- **`chore/<sujet>`** — petits travaux qui ne sont pas des features (typo, doc, dépendance). PR rapide.

---

## Règles de protection des branches (à configurer dans GitHub)

`main` :
- Require PR before merging
- Require approvals: 1 minimum
- Require status checks: CI complète, label `qa-validated` posé
- Require linear history
- Disallow force pushes

`develop` :
- Require PR before merging
- Require approvals: 1 minimum
- Require status checks: CI complète, label `qa-validated` posé
- Disallow force pushes

---

## Cycle de vie d'un lot

```
1. git checkout develop && git pull
2. git checkout -b feature/vue-riviere
3. <travail incrémental, commits réguliers>
4. git push -u origin feature/vue-riviere
5. Ouvrir PR vers develop → CI s'exécute, label `needs-qa-challenge` posé automatiquement
6. QA challenger (Iris) exécute la checklist du lot, pose questions, demande corrections
7. Quand validé : Iris pose le label `qa-validated`
8. Reviewer approuve la PR
9. Merge en mode "Squash and merge" pour garder l'historique propre
10. Suppression de la branche feature
11. Quand develop a accumulé suffisamment pour release : git checkout -b release/v1.X.0 develop
12. Tests finaux sur release branch, bug fixes éventuels
13. Merge dans main + tag git tag -a v1.X.0 -m "..."
14. Back-merge release dans develop
15. Suppression de la branche release
```

---

## Convention de commit

Format : `<type>(<scope>): <description>` (Conventional Commits, en français accepté).

Types : `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`.

Exemples :
- `feat(riviere): ajoute le composant PersonChip et la route /riviere`
- `fix(arbre): corrige le scroll horizontal sur Safari`
- `refactor(theme): extrait les tokens vers tokens.ts`
- `docs(roadmap): met à jour le statut du Lot 2`

---

## Convention de nommage des PR

Titre : `[Lot N] Description courte` ou `[Hotfix] Description`.

Exemples :
- `[Lot 2] Vue Rivière : colonnes horizontales par génération`
- `[Hotfix] Crash sur arbre avec personne sans dates`

---

## Versioning

Sémantique stricte : `MAJOR.MINOR.PATCH`.

- **MAJOR** : rupture utilisateur (changement de modèle, retrait de fonctionnalité). Probablement aucun pendant la refonte UI.
- **MINOR** : nouvelle vue mergée et activée. Ex : Lot 2 livré → `v1.2.0`. Lot 3 livré → `v1.3.0`.
- **PATCH** : bug fix, perf, accessibilité. Ex : `v1.2.1`.

---

## Tags et changelog

Chaque release sur `main` génère :
- Un **tag git** annoté.
- Une **GitHub Release** avec notes générées depuis les commits + résumé manuel des points utilisateurs visibles.
- Une mise à jour de `CHANGELOG.md` à la racine du repo (à créer en Lot 0 si absent).

---

## CI/CD

Workflows GitHub Actions à maintenir :
- `frontend-ci.yml` : `npm install`, `npm run lint`, `npm test`, `npm run build`.
- `backend-ci.yml` : `dotnet restore`, `dotnet build`, `dotnet test`.
- `bundle-size.yml` (à créer) : compare la taille du bundle frontend vs `develop` ; échoue si > +15 %.
- `lighthouse.yml` (à créer en Lot 0) : audit Lighthouse sur preview deploy ; échoue si score perf < 80 ou a11y < 95.

---

## Feature flags

Implémentation simple en Lot 1 : un fichier `frontend/src/featureFlags.ts` exportant un objet typé.

```ts
export const featureFlags = {
  VUE_RIVIERE_ENABLED: import.meta.env.VITE_VUE_RIVIERE_ENABLED === 'true',
  VUE_CONTEMPLATION_ENABLED: import.meta.env.VITE_VUE_CONTEMPLATION_ENABLED === 'true',
  VUE_ATELIER_ENABLED: import.meta.env.VITE_VUE_ATELIER_ENABLED === 'true',
  VUE_TABLEAU_ENABLED: import.meta.env.VITE_VUE_TABLEAU_ENABLED === 'true',
} as const;
```

Convention : par défaut OFF en production, ON en staging et dev.

---

## Déploiement

À cadrer en Lot 0 selon ce qui existe déjà :
- **Frontend** : build statique → CDN (Vercel / Netlify / S3+CloudFront / serveur classique).
- **Backend** : conteneur Docker (cf. `.github/workflows/docker-build.yml`) → cible de déploiement à confirmer.

Trois environnements minimum : `dev` (local), `staging` (auto-deploy depuis `develop`), `production` (deploy manuel depuis tag `main`).
