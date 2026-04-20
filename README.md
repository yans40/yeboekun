# GegeDot - Arbre Généalogique

Application web d'arbre généalogique avec backend .NET 9 et frontend React/TypeScript, conteneurisée via Docker.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────┐
│  Frontend       │  HTTP   │  Backend        │   EF    │  MySQL 8.0  │
│  React/TS       │◄───────►│  .NET 9 API     │◄───────►│  Database   │
│  :3000          │         │  :5001          │         │  :3306      │
└─────────────────┘         └─────────────────┘         └─────────────┘
```

### Backend (.NET 9)

| Couche | Projet |
|--------|--------|
| API REST | `GegeDot.API` — `PersonsController` |
| Services | `GegeDot.Services` — `PersonService`, `DataNormalizationService`, `DuplicateDetectionService` |
| Domaine | `GegeDot.Core` — entités, interfaces |
| Persistance | `GegeDot.Infrastructure` — EF Core, `GegeDotContext` |

### Frontend (React/TypeScript)

| Élément | Rôle |
|---------|------|
| `AppSidebar` | Navigation, recherche dynamique avec dropdown portal |
| `PersonForm` | Création/édition d'une personne + déclaration Père/Mère |
| `PersonCard` | Affichage d'une fiche personne |
| `FanCanvas` | Visualisation en éventail de l'arbre |
| `GenealogyCard` | Carte généalogique |
| `useFamilyTree` | Hook de chargement de l'arbre familial |
| `api.ts` | Service d'appels HTTP vers le backend |

## Technologies

**Backend** : .NET 9, Entity Framework Core 8, AutoMapper, MySQL 8.0, Swagger/OpenAPI  
**Frontend** : React 18, TypeScript, Material UI  
**DevOps** : Docker, Docker Compose, GitHub Actions

## Démarrage rapide

### Prérequis
- Docker Desktop

### Lancer l'application

```bash
git clone https://github.com/yans40/gegeDot.git
cd gegeDot
docker-compose up -d
```

### Accès

| Service | URL |
|---------|-----|
| Application | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| Swagger | http://localhost:5001/swagger |
| phpMyAdmin | http://localhost:8080 |

## API — Endpoints principaux

```
GET    /api/persons              Liste des personnes
GET    /api/persons/{id}         Détail d'une personne
GET    /api/persons/{id}/family  Arbre familial
POST   /api/persons              Créer une personne
PUT    /api/persons/{id}         Modifier une personne
DELETE /api/persons/{id}         Supprimer une personne
POST   /api/persons/check-duplicates  Détecter les doublons
```

## Fonctionnalités

- **CRUD personnes** : création avec normalisation automatique des noms/lieux/dates
- **Relations familiales** : déclaration Père/Mère directement dans le formulaire de création
- **Détection de doublons** : algorithme de similarité avant insertion
- **Recherche dynamique** : dropdown avec autocomplétion dans la sidebar
- **Visualisation éventail** : arbre interactif centré sur une personne

## Roadmap

### Terminé
- [x] Migration frontend HTML/JS → React/TypeScript
- [x] Architecture .NET en couches (Core / Services / Infrastructure / API)
- [x] Normalisation et détection de doublons
- [x] Gestion des relations familiales
- [x] Déclaration des parents à la création
- [x] Dropdown de recherche dynamique (ReactDOM portal)
- [x] Visualisation éventail

### En cours / À venir
- [ ] Relations complexes (mariage, fratrie)
- [ ] Recherche et filtrage avancés
- [ ] Export PDF / GEDCOM
- [ ] Déploiement cloud (Render / Railway)
- [ ] Authentification utilisateur

## Tests

### Backend (.NET 9)

```bash
dotnet test backend/tests/GegeDot.Tests/GegeDot.Tests.csproj
```

Stack : **xUnit** + **Moq** + **FluentAssertions** + **EF Core InMemory**.

Couverture :

| Suite | Fichier | Domaine |
|-------|---------|---------|
| `PersonServiceTests` | `Services/PersonServiceTests.cs` | CRUD personnes, relations parent-enfant, recherche |
| `DataNormalizationServiceTests` | `Services/DataNormalizationServiceTests.cs` | Capitalisation, abréviations, parsing dates |
| `DuplicateDetectionServiceTests` | `Services/DuplicateDetectionServiceTests.cs` | Levenshtein, scoring, cas spéciaux |
| `PersonRepositoryTests` | `Repositories/PersonRepositoryTests.cs` | EF Core InMemory — ajout, tri, recherche, relations |
| `PersonsControllerTests` | `Controllers/PersonsControllerTests.cs` | Statuts HTTP, validation, détection doublons |

### Frontend (React / TypeScript)

```bash
cd frontend
npm install
npm test              # tous les tests
npm run test:watch    # mode watch
npm run test:coverage # avec couverture (dossier coverage/)
```

Stack : **Jest** + **Babel** + **React Testing Library** + **jest-dom**.

Couverture :

| Suite | Fichier | Domaine |
|-------|---------|---------|
| `PersonCard.test.tsx` | rendu carte personne | |
| `PersonForm.test.tsx` | dialog + champs obligatoires | |
| `api.test.ts` | service HTTP (persons, family, recherche, update, delete) | |
| `familyTreeLayout.test.ts` | algo de layout (positions, espacement, tri par date) | |
| `useFamilyTree.test.tsx` | hook de chargement (success, erreur, normalisation spouse) | |

### Seuils de couverture

La CI échoue si les seuils suivants ne sont pas respectés :

**Backend** — mesuré avec [coverlet](https://github.com/coverlet-coverage/coverlet) (exclusions : `Program.cs`, DTOs, migrations) :

| Métrique | Seuil | Actuel |
|---|---|---|
| Lignes | ≥ 80 % | ~93 % |
| Branches | ≥ 70 % | ~79 % |

Vérification locale :

```bash
dotnet test backend/tests/GegeDot.Tests/GegeDot.Tests.csproj \
  --collect:"XPlat Code Coverage" \
  --settings backend/tests/GegeDot.Tests/coverlet.runsettings
python3 scripts/check-coverage.py \
  "backend/tests/GegeDot.Tests/TestResults/**/coverage.cobertura.xml" \
  --line 80 --branch 70
```

**Frontend** — gate sur les couches métier (`services/`, `hooks/`, `utils/`) ; les composants React seront ajoutés au fur et à mesure que leur couverture RTL augmente :

| Métrique | Seuil | Actuel |
|---|---|---|
| Lignes | ≥ 80 % | ~84 % |
| Statements | ≥ 80 % | ~83 % |
| Functions | ≥ 70 % | ~81 % |
| Branches | ≥ 60 % | ~66 % |

### Mode édition

Le bouton **Mode édition** en bas de la sidebar protège contre les modifications accidentelles par un visiteur. Il demande un mot de passe configuré via `VITE_ADMIN_PASSWORD` dans `frontend/.env`.

> ⚠️ `VITE_ADMIN_PASSWORD` est **inliné dans le bundle JS** par Vite (comportement documenté de toute variable `VITE_`). Toute personne motivée peut retrouver la valeur dans les DevTools ou appeler les endpoints API directement — le gate ne protège rien côté serveur. Si tu héberges des données sensibles, il faudra une vraie auth backend (`[Authorize]` sur les endpoints d'écriture).

```bash
# frontend/.env
VITE_ADMIN_PASSWORD=ton_mot_de_passe
```

### CI

Le workflow `.github/workflows/ci.yml` lance les deux suites sur `push` et `pull_request` vers `main` ou `dev`, avec couverture en artefacts et **blocage** si les seuils ci-dessus ne sont pas atteints.

## Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md) — guide pédagogique (architecture, cas pratiques, décisions techniques)
- [docs/deploiement.md](docs/deploiement.md) — plan de déploiement sur Render

## Licence

MIT — voir [LICENSE](LICENSE).
