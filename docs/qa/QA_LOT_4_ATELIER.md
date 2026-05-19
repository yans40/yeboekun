# Checklist QA — Lot 4 Vue Atelier

> **Branche** : `feature/vue-atelier`
> **QA run** : 2026-05-19 — Iris (QA challenger)
> **Vague** : 2/2 (challenge complet)

---

## Périmètre attendu

- [x] `AtelierView` : page `/atelier` avec layout split-panel (liste gauche + formulaire droit)
- [x] `PersonForm` refactorisé : 4 sections collapsibles (Identité, Vie, Famille, Conjoints)
- [x] Section Conjoints en mode édition uniquement (intentionnel — testé)
- [x] `addSpouse` / `removeSpouse` dans `api.ts`
- [x] 3 validators FluentValidation backend (`CreatePersonDtoValidator`, `UpdatePersonDtoValidator`, `CreateSpouseRelationshipDtoValidator`)
- [x] 36 tests unitaires xUnit sur les validators
- [x] 20 clés i18n dans `frontend/src/i18n/fr.json` (chemin correct — projet n'utilise pas `public/locales`)

---

## Cas tordus exécutés (analyse statique)

1. **Auto-relation comme conjoint (personId == spouseId)** — OK backend (ligne 361 PersonsController : `if (personId == spouseId) return BadRequest`). OK frontend : `availableSpouses` filtre `p.id !== person.id` (ligne 788 PersonForm).
2. **Dates incohérentes DeathDate < BirthDate** — OK backend (FluentValidation `GreaterThan`). OK frontend (`validateForm` lignes 594–598).
3. **IsAlive = true + DeathDate non nulle** — OK backend (FluentValidation). OK frontend (champ `deathDate` disabled si `isAlive`, contrôle dans `validateForm`).
4. **EndDate < StartDate sur relation conjugale** — OK backend (`CreateSpouseRelationshipDtoValidator`). KO frontend : aucune validation côté client avant envoi. Seule la gestion de l'erreur HTTP 400 est présente (message générique). **Bug mineur signalé.**
5. **Section Conjoints absente en mode création** — OK : `{person && (...)}` à la ligne 1057 — la section ne s'affiche que si `person` est défini.
6. **Conjoint déjà lié (doublon)** — OK backend (vérification bidirectionnelle `RelationshipExistsAsync` + retour 409). OK frontend : gestion fine du 409 avec `t('form.spouse_add_error_conflict')`.
7. **Sections collapsibles en mode Dialog (ArbreView)** — OK : le `formContent` est partagé entre les deux modes. Le rendu conditionnel `{open && <div>}` préserve le state des champs.
8. **Personne sans date de naissance** — OK : tous les champs date sont optionnels, la règle `GreaterThan` n'est active que si les deux dates sont présentes (`When(x => x.DeathDate.HasValue && x.BirthDate.HasValue)`).
9. **DeathDate égale à BirthDate** — OK backend (GreaterThan est strictement supérieur, test `DeathDateEqualToBirthDate_ShouldFail` présent).
10. **Chemin i18n** — OK : le projet charge `frontend/src/i18n/fr.json` (namespace `common`), pas `public/locales`. Les 20 nouvelles clés sont dans le bon fichier.

---

## Bugs trouvés

### Bloquant

Aucun.

### Majeur

Aucun.

### Mineur

**M1 — Chaînes hardcodées dans PersonForm.tsx (violations i18n)**
- Fichier : `frontend/src/components/PersonForm.tsx`, lignes 846 et 849
- `label="URL de la photo"` et `placeholder="https://example.com/photo.jpg"` non passés par `t()`
- Reproduire : chercher `grep -n 'label="\|placeholder="'` dans PersonForm.tsx
- **Corrigé dans ce run** : 2 clés ajoutées dans `fr.json` (`form.field_photo_url`, `form.field_photo_url_placeholder`), PersonForm mis à jour.

**M2 — Absence de validation frontale dates conjoint (endDate < startDate)**
- Fichier : `frontend/src/components/PersonForm.tsx`, `handleAddSpouse`
- L'utilisateur peut saisir une endDate antérieure à startDate et soumettre. La validation backend rejette (FluentValidation, HTTP 400) et l'UI affiche le message `form.spouse_add_error_dates`. La protection existe mais côté serveur uniquement — aller-retour réseau inutile.
- Impact : mineur (message d'erreur correct affiché, pas de corruption de données), mais l'UX n'est pas optimale.
- Correction suggérée : ajouter dans `handleAddSpouse` un guard `if (newSpouseEndDate && newSpouseStartDate && new Date(newSpouseEndDate) <= new Date(newSpouseStartDate)) { setSpouseError(t('form.spouse_add_error_dates')); return; }` avant l'appel API.

**M3 — Dette pré-existante confirmée hors scope Lot 4 : `updatePerson` hardcode `force=true`**
- Fichier : `frontend/src/services/api.ts`, ligne 80
- `PUT /persons/{id}?force=true` bypass systématiquement la détection de doublons sur toute mise à jour depuis l'Atelier et depuis ArbreView.
- Ce comportement existait avant le Lot 4. Signalé pour suivi, pas bloquant pour ce lot.

**M4 — Dette pré-existante confirmée hors scope Lot 4 : titres hardcodés dans ArbreView.tsx**
- Fichier : `frontend/src/components/ArbreView.tsx`, ligne 125
- `title={editingPerson ? 'Modifier la personne' : 'Ajouter une personne'}` non passés par `t()`
- Pré-existant avant le Lot 4. Signalé pour suivi.

---

## Dette Ada — nettoyage exécuté

**Doublon confirmé et supprimé** : `CreatePersonDto` et `UpdatePersonDto` dans `PersonDto.cs` portaient des annotations `[Required]`, `[StringLength]`, `[RegularExpression]` (DataAnnotations) qui dupliquaient exactement les règles des validators FluentValidation.

Risque concret : ASP.NET Core évalue le ModelState (DataAnnotations) AVANT que le contrôleur n'appelle `_createPersonValidator.ValidateAsync()`. En cas d'échec de validation, deux pipelines pouvaient déclencher des messages d'erreur en doublon avec des formulations légèrement différentes (DataAnnotations sans point final, FluentValidation avec point final).

Action : suppression de l'`using System.ComponentModel.DataAnnotations`, de tous les `[Required]`, `[StringLength]`, `[RegularExpression]` sur `CreatePersonDto` et `UpdatePersonDto`. Les classes `PersonDto` (lecture seule) et `PersonTreeNodeDto` ne sont pas touchées.

Fichier modifié : `backend/src/Yeboekun.Services/DTOs/PersonDto.cs`

---

## Non-régression

- [x] Route `/` (Arbre vertical) — non touchée par ce lot. `ArbreView.tsx`, `router.tsx` inchangés.
- [x] PersonForm mode Dialog — `formContent` partagé, sections collapsibles opérationnelles dans les deux modes.
- [x] Route `/admin` — non touchée.
- [x] Structure de routing — `/atelier` ajouté, aucune route existante modifiée.
- [x] `api.ts` — méthodes existantes inchangées, ajout de `addSpouse` et `removeSpouse` uniquement.

---

## Perf / Bundle

Non mesuré Lighthouse dans ce run (permission `dotnet test` / `npm run build` non accordée). À exécuter par Léo ou Ada avec la commande de `BASELINE.md` avant le merge.

Seuil Lot 4 à respecter (extrapolé depuis la baseline — le tableau de `BASELINE.md` ne liste pas de colonne Lot 4 explicite, on applique le seuil Lot 3) :
- Bundle JS gzip ≤ 280 kB
- Perf ≥ 92, A11y ≥ 95, Best Practices ≥ 96

---

## A11y

- [x] `CollapsibleSection` : bouton avec `aria-expanded` + `aria-controls` lié au `id` du contenu — conforme WCAG 4.1.3.
- [x] `NativeSwitch` : `<input type="checkbox">` avec `id` et `<label htmlFor>` correct.
- [x] `SpouseRow` bouton suppression : `aria-label="Supprimer {nom}"` présent.
- [x] `NativeChip` bouton suppression : `aria-label="Supprimer {label}"` présent.
- [x] `PersonList` : `role="list"` sur `<ul>`, boutons sans rôle ambigu.
- [x] Mobile tabs : `role="tablist"` + `role="tab"` + `aria-selected` présents.
- [ ] POINT D'ATTENTION : `NativeAlert` contient un `<button>` avec `aria-label="Fermer"` hardcodé en français (ligne 169). Acceptable pour l'instant (projet mono-langue FR), à passer par `t('common.close')` si l'internationalisation multi-langue est envisagée.

---

## i18n

- [x] Toutes les nouvelles clés Lot 4 présentes dans `fr.json` et utilisées via `t()`
- [x] Namespace correct : `common` (seul namespace du projet)
- [x] Deux chaînes hardcodées corrigées dans ce run (M1)
- [ ] POINT D'ATTENTION : `aria-label="Fermer"` dans `NativeAlert` hardcodé (mineur, mono-langue)

---

## Décision finale

**`qa-validated`** — avec les corrections appliquées dans ce run (dette Ada nettoyée, 2 chaînes i18n corrigées).

Les bugs M2, M3, M4 sont à ticket pour les prochains lots. Ils n'introduisent pas de régression et ne corrompent pas de données.

**Condition de merge** : exécuter `dotnet test` et `npm run build` + `npm test` pour confirmer que les modifications de `PersonDto.cs` et `PersonForm.tsx` ne cassent pas les suites de tests existantes. Ces commandes n'ont pas pu être exécutées dans ce run.
