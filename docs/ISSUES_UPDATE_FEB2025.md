# Mise à jour des issues GitHub - Février 2025

Ce document contient les mises à jour à appliquer aux issues du dépôt [yans40/yeboekun](https://github.com/yans40/yeboekun/issues) pour refléter l'état actuel du projet (vue évoluée, UI shell, etc.).

---

## Avant de commencer

Réauthentifier gh si nécessaire :
```bash
gh auth login -h github.com
```

---

## Issues à mettre à jour

### #7 - Améliorer la visualisation des arbres généalogiques

**Action** : Ajouter un commentaire (partiellement résolu)

```
**Mise à jour (fév. 2025)** — Progression significative :

- Vue éventail professionnelle implémentée dans `frontend/professional-fan-view.html`
- UI shell avec sidebar gauche (240px, collapsible), panneau droit "Ancestral Insights"
- Design system : variables CSS, police Inter, couleurs cohérentes
- Zoom, navigation, liens familiaux fonctionnels

Reste à faire : layout hiérarchique alternatif (#8), optimisations performances (#10)
```

---

### #9 - Améliorer l'interface utilisateur de la visualisation

**Action** : Ajouter un commentaire (partiellement résolu)

```
**Mise à jour (fév. 2025)** — Implémenté :

- Sidebar : Dashboard, Tree, Photos, Records, Hints + profil
- Panneau Ancestral Info : "Based on X ancestors", Generations Mapped, dropdown personne
- Responsive : drawer < 1200px, hamburger < 640px
- DNA et Geographic Origins retirés (non disponibles)

Voir PLAN_UI_SHELL.md pour les détails.
```

---

### #12 - Améliorer la compatibilité mobile

**Action** : Ajouter un commentaire (partiellement résolu)

```
**Mise à jour (fév. 2025)** — Responsive implémenté :

- >= 1200px : sidebar 240px, panneau 320px
- 900–1200px : sidebar collapsed, panneau en drawer
- < 640px : sidebar hamburger, panneau en modal sheet

À valider en conditions réelles sur appareils mobiles.
```

---

### #14 - Création de la structure de test backend

**Action** : Ajouter un commentaire (structure existante, CI à corriger)

```
**Mise à jour (fév. 2025)** — Structure existante :

- `backend/tests/Yeboekun.Tests/` avec PersonServiceTests (xunit, Moq, FluentAssertions)
- Problème : la CI exécute `dotnet test` sur Yeboekun.API.csproj qui ne référence pas les tests
- À faire : pointer la CI vers `backend/Yeboekun.sln` ou `Yeboekun.Tests.csproj`
```

---

### #15 - Implémentation des exemples de tests backend

**Action** : Ajouter un commentaire (tests obsolètes)

```
**Mise à jour (fév. 2025)** — PersonServiceTests existant mais obsolète :

- Le constructeur de PersonService a évolué : ajout de IDataNormalizationService
- Les mocks (IUnitOfWork, IMapper) doivent être complétés
- À mettre à jour pour refléter l'API actuelle (normalisation, détection doublons)
```

---

### #16 - Vérification de la couverture et intégration CI/CD

**Action** : Ajouter un commentaire (état actuel)

```
**Mise à jour (fév. 2025)** — Problèmes identifiés dans .github/workflows/ci.yml :

1. `dotnet test` cible Yeboekun.API (0 tests) au lieu de Yeboekun.Tests
2. .NET 8 dans la CI vs .NET 9 dans le projet
3. `test-suite.html` référencé mais absent du frontend
4. security-scan-results.sarif inexistant
5. Pas de couverture (coverlet) configurée dans la CI

Voir docs/archive/ pour la doc archivée.
```

---

### #6 - Add comprehensive testing suite

**Action** : Ajouter un commentaire (recoupement avec #14, #15, #16)

```
**Mise à jour (fév. 2025)** — État actuel :

- Backend : PersonServiceTests (à mettre à jour), structure Yeboekun.Tests OK
- Frontend : tests Jest pour React (PersonForm, PersonCard, api) dans src/__tests__/
- La vue principale (professional-fan-view.html) est en vanilla HTML/JS, non couverte par les tests React
- CI : ne lance pas correctement les tests backend

Recoupement avec #14, #15, #16 — envisager une issue consolidée "Tests et CI".
```

---

### #18 - Manual Code Review Request - Full Review

**Action** : Ajouter un commentaire (contexte actuel)

```
**Mise à jour (fév. 2025)** — Contexte projet :

- Vue principale : professional-fan-view.html (vanilla JS, D3, UI shell)
- Backend : .NET 9, MySQL, services (Person, Family, Tree, Normalization, DuplicateDetection)
- Docs : DOCUMENTATION.md (guide pédagogique), 76 .md archivés dans docs/archive/
- Phase Delta en cours : relations complexes, export GEDCOM à venir
```

---

## Commandes gh (à exécuter après `gh auth login`)

```bash
# Depuis la racine du projet
cd /Users/kassyimbadollou/Documents/yeboekun

# #7
gh issue comment 7 --body "**Mise à jour (fév. 2025)** — Progression significative :

- Vue éventail professionnelle implémentée dans frontend/professional-fan-view.html
- UI shell avec sidebar gauche (240px, collapsible), panneau droit Ancestral Insights
- Design system : variables CSS, police Inter, couleurs cohérentes
- Zoom, navigation, liens familiaux fonctionnels

Reste à faire : layout hiérarchique alternatif (#8), optimisations performances (#10)"

# #9
gh issue comment 9 --body "**Mise à jour (fév. 2025)** — Implémenté :

- Sidebar : Dashboard, Tree, Photos, Records, Hints + profil
- Panneau Ancestral Info : Based on X ancestors, Generations Mapped, dropdown personne
- Responsive : drawer < 1200px, hamburger < 640px
- DNA et Geographic Origins retirés (non disponibles)

Voir PLAN_UI_SHELL.md pour les détails."

# #12
gh issue comment 12 --body "**Mise à jour (fév. 2025)** — Responsive implémenté :

- >= 1200px : sidebar 240px, panneau 320px
- 900–1200px : sidebar collapsed, panneau en drawer
- < 640px : sidebar hamburger, panneau en modal sheet

À valider en conditions réelles sur appareils mobiles."

# #14
gh issue comment 14 --body "**Mise à jour (fév. 2025)** — Structure existante :

- backend/tests/Yeboekun.Tests/ avec PersonServiceTests (xunit, Moq, FluentAssertions)
- Problème : la CI exécute dotnet test sur Yeboekun.API.csproj qui ne référence pas les tests
- À faire : pointer la CI vers backend/Yeboekun.sln ou Yeboekun.Tests.csproj"

# #15
gh issue comment 15 --body "**Mise à jour (fév. 2025)** — PersonServiceTests existant mais obsolète :

- Le constructeur de PersonService a évolué : ajout de IDataNormalizationService
- Les mocks (IUnitOfWork, IMapper) doivent être complétés
- À mettre à jour pour refléter l'API actuelle (normalisation, détection doublons)"

# #16
gh issue comment 16 --body "**Mise à jour (fév. 2025)** — Problèmes identifiés dans .github/workflows/ci.yml :

1. dotnet test cible Yeboekun.API (0 tests) au lieu de Yeboekun.Tests
2. .NET 8 dans la CI vs .NET 9 dans le projet
3. test-suite.html référencé mais absent du frontend
4. security-scan-results.sarif inexistant
5. Pas de couverture (coverlet) configurée dans la CI"

# #6
gh issue comment 6 --body "**Mise à jour (fév. 2025)** — État actuel :

- Backend : PersonServiceTests (à mettre à jour), structure Yeboekun.Tests OK
- Frontend : tests Jest pour React (PersonForm, PersonCard, api) dans src/__tests__/
- La vue principale (professional-fan-view.html) est en vanilla HTML/JS, non couverte par les tests React
- CI : ne lance pas correctement les tests backend

Recoupement avec #14, #15, #16 — envisager une issue consolidée Tests et CI."

# #18
gh issue comment 18 --body "**Mise à jour (fév. 2025)** — Contexte projet :

- Vue principale : professional-fan-view.html (vanilla JS, D3, UI shell)
- Backend : .NET 9, MySQL, services (Person, Family, Tree, Normalization, DuplicateDetection)
- Docs : DOCUMENTATION.md (guide pédagogique), 76 .md archivés dans docs/archive/
- Phase Delta en cours : relations complexes, export GEDCOM à venir"
```

---

## Issues non modifiées (toujours ouvertes)

- **#5** - Deploy to production (deploy CI en placeholder)
- **#8** - Layout hiérarchique (non implémenté)
- **#10** - Optimiser les performances (non implémenté)
- **#11** - Recherche et filtrage (API existe, UI manquante)
