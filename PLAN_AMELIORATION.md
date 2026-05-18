# Plan d'amélioration Yeboekun

> Généré le 2026-04-12 — Branche : `claude/react-migration`

---

## Phase 1 — Nettoyage & stabilisation (quick wins)

| # | Action | Fichier(s) | Statut |
|---|--------|-----------|--------|
| 1.1 | Supprimer les `console.log` de debug | `frontend/src/services/api.ts` | ✅ Fait |
| 1.2 | Typer le retour de `GET /family` avec un vrai DTO | `backend/src/Yeboekun.Services/DTOs/` + `PersonsController.cs` | ✅ Fait |
| 1.3 | Harmoniser le type `gender` (string côté frontend, `char` côté backend) | `frontend/src/types/index.ts` + DTOs backend | ✅ Fait |
| 1.4 | Améliorer les messages d'erreur (remplacer les `"Erreur lors de..."` génériques) | `frontend/src/App.tsx`, `frontend/src/services/api.ts` | ✅ Fait |
| 1.5 | Ajouter des Error Boundaries React | `frontend/src/components/ErrorBoundary.tsx` | ✅ Fait |

---

## Phase 2 — Fonctionnalités manquantes (haute valeur)

| # | Action | Détail | Statut |
|---|--------|--------|--------|
| 2.1 | **Vue Liste** | L'onglet "Liste" de la sidebar existe mais ne fait rien — créer `PersonList.tsx` | ⬜ À faire |
| 2.2 | **Visualisation des conjoints** | Les données sont déjà fetchées mais non affichées dans les cartes | ⬜ À faire |
| 2.3 | **Recherche** | `searchPersons()` existe dans l'API mais pas dans l'UI | ⬜ À faire |
| 2.4 | **Suppression d'une personne** | Bouton delete dans le formulaire d'édition | ⬜ À faire |

---

## Phase 3 — Qualité du code

| # | Action | Détail | Statut |
|---|--------|--------|--------|
| 3.1 | Remplacer `ConnectionLayer` (divs) par SVG | Meilleure performance, vraies courbes de Bézier | ⬜ À faire |
| 3.2 | Extraire les styles inline vers CSS modules | `FanCanvas.tsx`, `GenealogyCard.tsx` | ⬜ À faire |
| 3.3 | Augmenter la couverture de tests | Layout algorithm, PersonService, composants React | ⬜ À faire |
| 3.4 | Accessibilité (ARIA labels, navigation clavier) | Toutes les cartes et boutons | ⬜ À faire |

---

## Phase 4 — Fonctionnalités avancées

| # | Action | Détail | Statut |
|---|--------|--------|--------|
| 4.1 | Export GEDCOM | Format standard généalogie | ⬜ À faire |
| 4.2 | Upload photo | `PhotoUrl` existe côté backend, pas d'UI | ⬜ À faire |
| 4.3 | Dark mode | Thème MUI déjà défini, juste besoin d'un toggle | ⬜ À faire |
| 4.4 | Authentification | Préparer Phase 2 utilisateurs | ⬜ À faire |
| 4.5 | Pagination / virtualisation | Pour les grandes familles (20+ personnes) | ⬜ À faire |
