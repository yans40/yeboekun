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

## Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md) — guide pédagogique (architecture, cas pratiques, décisions techniques)
- [docs/deploiement.md](docs/deploiement.md) — plan de déploiement sur Render

## Licence

MIT — voir [LICENSE](LICENSE).
