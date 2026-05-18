# Feuille de route d'implémentation — Refonte UI Yeboekun

**Statut** : actif — feuille de route officielle.
**Principe directeur** : chaque vue est un chantier autonome, livré derrière un feature flag, validé par un QA challenger avant merge sur `develop` puis release sur `main`.

---

## Vue principale conservée : **Arbre vertical**

L'arbre vertical hiérarchique fonctionne aujourd'hui en production. Il reste **la vue par défaut** (`/`) pendant toute la durée de la refonte. Toute nouvelle vue est ajoutée en complément, jamais en substitution. Aucun lot ne le retire de la nav tant que la migration n'est pas terminée et validée.

---

## Séquencement officiel

```
Lot 0 — Préparation (Gitflow, CI, QA)               1–2 jours
Lot 1 — Foundation technique                         3 jours
        (tokens + shell hybride + i18n + Admin route)
Lot 2 — Vue Rivière                                  ~1 semaine
Lot 3 — Vue Contemplation (refacto fan)              1–2 semaines
Lot 4 — Vue Atelier (fiche personne en page)         ~1 semaine
Lot 5 — Vue Tableau (dashboard)                      ~1 semaine
———————
Backlog : Album (dépend stockage docs), Pistes (dépend nouvelle entité)
```

Chaque lot fait l'objet d'**une PR** unique, **une QA challenge** dédiée, **une release tag** dédiée.

---

## Lot 0 — Préparation

**Branche** : aucune, modifications directes sur `develop`.
**Livrables** :

- Gitflow opérationnel (cf. `docs/process/GITFLOW.md`).
- CI GitHub Actions (déjà partiellement présente dans `.github/workflows/`) : exécution automatique de `npm test`, `dotnet test`, lint TypeScript, build front et back sur chaque PR.
- Création du label PR `needs-qa-challenge` et template de PR (cf. `docs/process/PR_TEMPLATE.md`).
- Activation de l'agent `yeboekun-qa-challenger` (cf. `docs/agents/yeboekun-qa-challenger.md`).

**Critères de sortie** : un commit blanc passe la CI complète, le PR template apparaît automatiquement, le label `needs-qa-challenge` peut être posé.

---

## Lot 1 — Foundation technique

**Branche** : `feature/lot-1-foundation`
**Effort** : S (~2–3 jours)
**Risque** : faible — aucune vue métier modifiée.

**Périmètre**
- `frontend/src/theme/tokens.ts` complet (palette, typo, spacings, radius, shadows, breakpoints).
- `ThemeProvider` MUI mis à jour avec les overrides.
- Chargement des fonts Cormorant Garamond + Geist (`<link rel="preload">` + `font-display: swap`).
- Bootstrap **i18next** + namespace `common` + 100 % des nouveaux textes via `t()`.
- **Routing react-router-dom** :
    - `/` → vue Arbre vertical existante (route principale, défaut).
    - `/arbre` → alias de `/` (lisibilité URL).
    - `/riviere`, `/contempler`, `/atelier`, `/tableau` → placeholders "Bientôt disponible".
    - `/admin` → contenu actuel `useAdmin` migré tel quel (restylage en Lot 1.5 si besoin).
- **Shell hybride** : sidebar fine 72px (icônes, expansible au survol) + topbar minimaliste (breadcrumb, recherche ⌘K placeholder, avatar).

**Hors périmètre**
- Refacto visuel des vues métier.
- Toute modification de `FanCanvas.tsx` ou `useFamilyTree.ts`.
- Backend.

**Critères de sortie**
- L'app démarre sans erreur.
- L'arbre vertical s'affiche sur `/` exactement comme avant.
- L'admin reste fonctionnel sur `/admin`.
- Tous les nouveaux textes passent par `t()`.
- Lighthouse score ≥ baseline pré-Lot 1 (à enregistrer en Lot 0).
- Bundle size diff ≤ +15 % vs baseline (à justifier si proche de la limite).
- QA challenger valide la PR (cf. checklist Lot 1).

---

## Lot 2 — Vue Rivière

**Branche** : `feature/vue-riviere`
**Effort** : M (~1 semaine)
**Risque** : moyen — nouvelle vue, ne touche pas l'arbre vertical ni l'éventail.

**Périmètre**
- Composant `RiviereView` : colonnes horizontales par génération, scrolling latéral fluide.
- Composant `PersonChip` (carte ultra-compacte) consommé par Rivière et plus tard l'arbre vertical.
- `Photo` placeholder SVG sépia procédural.
- **Encodage genre** : bande latérale 2px sur `GenealogyCard` (`color.ocean` M, `color.rust` F, `color.ink3` Other), doublé d'un libellé pour accessibilité (a11y). *(reporté du Lot 1 — source de vérité : QA_LOT_1_FOUNDATION.md fan-4)*
- Route `/riviere` activée derrière feature flag `VUE_RIVIERE_ENABLED` (défaut OFF en prod, ON en staging).
- Tests unitaires sur `PersonChip`, tests d'intégration sur `RiviereView` avec mock de `useFamilyTree`.

**Critères de sortie**
- Vue Rivière fonctionnelle sur staging.
- Arbre vertical inchangé (test de non-régression visuel).
- QA challenger valide.
- Toggle du feature flag teste les deux états.

---

## Lot 3 — Vue Contemplation (refacto fan)

**Branche** : `feature/vue-contemplation`
**Effort** : L (~1–2 semaines)
**Risque** : élevé — c'est le cœur visuel de l'app.

**Stratégie de réduction de risque**
- **Coexistence** : ne pas remplacer `FanCanvas.tsx` directement. Créer `ContemplationView.tsx` qui consomme une nouvelle version stylée (`FanCanvasV2.tsx`) tout en gardant `FanCanvas.tsx` accessible via une route legacy `/eventail-classique` jusqu'à validation finale.
- Feature flag `VUE_CONTEMPLATION_ENABLED`.
- **Pré-requis backend** (à valider avec Ada avant démarrage) : l'API doit renvoyer ascendants ET descendants pour la vue bidirectionnelle. Sinon, ajouter un sous-lot 3.0 pour étendre l'API. Ce même endpoint sera réutilisé pour l'arbre profondeur ajustable (backlog).
- Benchmark obligatoire : paint time sur arbres de 50, 150, 300, 500 personnes avant/après.

**Critères de sortie**
- Contemplation rend correctement avec les jeux de données de test (Game of Thrones, House of Dragon).
- Paint time ≤ 110 % de la version actuelle pour 300 personnes.
- Accessibilité clavier sur les secteurs de l'éventail (navigation tab + flèches).
- QA challenger valide après tentative explicite de casser sur edge cases (personne sans dates, conjoints multiples, branches asymétriques).

---

## Lot 4 — Vue Atelier

**Branche** : `feature/vue-atelier`
**Effort** : M (~1 semaine)
**Risque** : moyen — refacto `PersonForm.tsx` en page dédiée.

**Périmètre**
- `AtelierView` : page dédiée fiche personne (≠ modal).
- Refacto `PersonForm` pour intégration page : layout deux colonnes, sections collapsibles (Identité, Vie, Famille, Documents).
- Gestion **conjoints multiples** avec onglets datés.
- Validation FluentValidation côté API à coordonner avec Ada.

**Critères de sortie**
- Création / édition / suppression d'une personne fonctionnelles.
- Conjoints multiples avec dates de début/fin gérés.
- QA challenger valide les 13 types de relations + les cas tordus (auto-relation rejetée, dates incohérentes rejetées).

---

## Lot 5 — Vue Tableau (dashboard)

**Branche** : `feature/vue-tableau`
**Effort** : M (~1 semaine)
**Risque** : faible — agrège des données existantes.

**Périmètre**
- `TableauView` : stats (X personnes, Y générations, Z documents), MiniFan statique, dernières fiches consultées, suggestions IA (raccordement à `DuplicateDetectionService` via API).
- `StatCard`, `RecentCard`, `MiniFan` composants.
- Une fois Tableau livré et stabilisé, déplacer la route principale `/` de Arbre vers Tableau (PR séparée, dans un Lot 5.1 dédié, jamais dans la même PR).

**Critères de sortie**
- Tableau affiche les bonnes données.
- Performance API acceptable (les stats ne doivent pas faire un `GetAllAsync` sur des dizaines de milliers de personnes — coordonner avec Ada).
- QA challenger valide.

---

## Lot 6 — Renommage Yeboekun

**Branche** : `chore/rename-yeboekun`
**Effort** : S (~1–2 jours)
**Risque** : moyen — changements transversaux frontend + backend + infra, aucune logique métier modifiée.

**Contexte**
Le nom définitif du projet est **Yeboekun**. "yeboekun" était un nom de code temporaire. Ce lot renomme sans modifier de comportement.

**Périmètre**

- **Backend** : namespaces `Yeboekun.*` → `Yeboekun.*` (assembly names, `namespace`, `using`, fichiers `.csproj`).
- **Frontend** : `name` dans `package.json`, `<title>` HTML, tout texte "Yeboekun" visible dans l'UI.
- **Base de données** : nom de la base MySQL `yeboekun` → `yeboekun` (migration + `appsettings.json`).
- **Dossiers / repo** : renommage des dossiers `yeboekun` / `yeboekun-claude` et du repo GitHub `yeboekun` → `yeboekun` (action manuelle GitHub, puis `git remote set-url`).
- **Variables d'environnement** : `VITE_*`, chaînes de connexion, tout ce qui contient "yeboekun" ou "yeboekun".
- **Docs** : mettre à jour `IMPLEMENTATION_ROADMAP.md`, `GITFLOW.md`, `PR_TEMPLATE.md` et les fichiers agents.

**Hors périmètre**
- Aucune modification de logique métier, de schéma BDD (tables/colonnes), ni de contrats d'API.

**Stratégie**
Renommer en une seule PR atomique avec une checklist exhaustive. Pas de renommage partiel étalé sur plusieurs lots — risque de mélange de noms dans les logs et erreurs de build.

**Pré-requis**
- Tous les lots en cours (Lot 2 au minimum) mergés sur `main` avant de lancer, pour éviter les conflits de rebase.
- Kassy renomme le repo GitHub manuellement avant que la branche soit poussée.

**Critères de sortie**
- `grep -r "yeboekun\|Yeboekun\|yeboekun" --include="*.ts" --include="*.tsx" --include="*.cs" --include="*.csproj" --include="*.json" --include="*.md"` ne retourne aucun résultat hors historique git.
- Build frontend + backend verts.
- App démarre et l'arbre vertical fonctionne.
- QA challenger valide.

---

## Backlog

- **Album** : galerie photos + documents. Bloqué tant que le stockage de documents n'est pas modélisé côté backend (entité `Document`, S3/MinIO ou stockage local).
- **Pistes** : leads de recherche IA. Bloqué tant que l'entité `ResearchLead` n'est pas modélisée et que la stratégie IA n'est pas définie.
- **Arbre profondeur ajustable** : afficher l'arborescence ascendante et descendante complète disponible en base, avec un paramètre de profondeur configurable par l'utilisateur (ex. : sélecteur "2 générations en haut / 1 en bas"). Nécessite un endpoint backend `GET /persons/{id}/full-tree?depthUp=N&depthDown=N` avec traversée récursive (CTE MySQL). Le layout `buildLayout` est déjà conçu pour N niveaux arbitraires — seule la donnée manque. La base test (famille royale) contient 12 niveaux ascendants et 12 niveaux descendants. Pré-requis partagé avec le Lot 3 (API bidirectionnelle).

Ces lots feront l'objet de chantiers dédiés, pas en queue de la refonte UI.

---

## Tableau de bord global

| Lot | Branche | Effort | Risque | QA gate | Pre-req |
|-----|---------|--------|--------|---------|---------|
| 0 | — | XS | bas | CI verte | — |
| 1 | feature/lot-1-foundation | S | bas | Lot 0 | — |
| 2 | feature/vue-riviere | M | moyen | Lot 1 mergé | — |
| 3 | feature/vue-contemplation | L | élevé | Lot 1 mergé + API bidirectionnelle | Sous-lot Ada si API à étendre |
| 4 | feature/vue-atelier | M | moyen | Lot 1 mergé | Validation FluentValidation Ada |
| 5 | feature/vue-tableau | M | bas | Lot 1 mergé | API stats Ada |
| 6 | chore/rename-yeboekun | S | moyen | Lot 2+ mergés | Repo GitHub renommé manuellement |

---

## Règles inviolables

1. **Une vue = une PR = une release**. Pas de PR multi-vues, pas de merge sans QA challenge.
2. **L'arbre vertical reste accessible jusqu'à la fin de la refonte**.
3. **Aucun feature flag ne reste ON en prod plus de 30 jours après merge** : nettoyage obligatoire.
4. **Aucun lot ne touche au code d'un autre lot**. Si une dépendance émerge, elle remonte en Lot 1 ou crée un sous-lot dédié.
5. **Toute extension d'API passe par Ada** avec changelog et période de coexistence si rupture.
