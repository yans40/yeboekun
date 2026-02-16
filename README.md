# 🌳 GegeDot - Arbre Généalogique Moderne

Un projet d'arbre généalogique moderne avec architecture microservices, backend .NET Core et frontend React/TypeScript.

## 🎯 Objectif du Projet

Ce projet pédagogique vise à apprendre les différentes strates de prise de décision dans un projet moderne :
- Architecture microservices
- Séparation frontend/backend
- Déploiement cloud
- CI/CD
- Gestion de base de données

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   (React/TS)    │◄──►│   (.NET Core)   │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Database      │
                       │   (MySQL)       │
                       └─────────────────┘
```

### Services Backend (.NET Core)
- **PersonService** : Gestion des personnes avec normalisation automatique
- **DataNormalizationService** : Normalisation des noms, lieux, dates, professions
- **DuplicateDetectionService** : Détection de doublons avec algorithme de similarité
- **FamilyService** : Gestion des relations familiales
- **TreeService** : Construction et visualisation des arbres

### Frontend
- **HTML5/CSS3/JavaScript** : Interface interactive actuelle
- **D3.js** : Visualisation des arbres généalogiques (optionnel)
- **Vue Carte Éventail** : Visualisation progressive par clic

## 🚀 Technologies

### Backend
- .NET 9 Core
- Entity Framework Core
- MySQL 8.0
- Swagger/OpenAPI
- AutoMapper
- Docker

### Frontend
- HTML5/CSS3/JavaScript vanilla
- D3.js (pour visualisations avancées)

### DevOps
- Docker & Docker Compose
- GitHub Actions
- Railway.app (Backend)
- Netlify (Frontend)

## 📋 Roadmap

### ✅ Phase Alpha - MVP
- [x] Architecture et documentation
- [x] API basique (CRUD Personnes)
- [x] Base de données MySQL
- [x] Frontend HTML/JavaScript

### ✅ Phase Beta - Consolidation
- [x] Visualisation arbre familial
- [x] Gestion des relations
- [x] Interface utilisateur améliorée

### ✅ Phase Charlie - Vue Éventail
- [x] Vue carte éventail interactive
- [x] Système de zoom et navigation
- [x] Liens familiaux simples
- [x] Design moderne

### 🔄 Phase Delta - En Cours
- [x] Extension du modèle de données (Profession, Mariage, etc.)
- [x] Service de normalisation des données
- [x] Service de détection de doublons
- [x] Formulaire d'ajout enrichi
- [ ] Vue éventail professionnelle
- [ ] Relations complexes
- [ ] Recherche et filtrage avancés
- [ ] Export et partage (PDF, GEDCOM)

## 📚 Documentation

**[DOCUMENTATION.md](DOCUMENTATION.md)** est un **guide pédagogique** pour les développeurs juniors :
- Conception évolutive de l'application
- Cas pratiques rencontrés (suppression, conjoints, validations, etc.)
- Quiz d'aide au raisonnement
- Template pour alimenter le guide au fur et à mesure

Les anciens fichiers .md sont archivés dans `docs/archive/`.

## 🛠️ Installation et Développement

### Prérequis
- .NET 9 SDK
- Python 3 (pour serveur frontend)
- MySQL 8.0+ (via Docker)
- Docker Desktop

### Démarrage Rapide

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/gegeDot.git
cd gegeDot
```

2. **Démarrer MySQL et phpMyAdmin (Docker)**
```bash
docker-compose up -d
```

3. **Exécuter la migration SQL** (si nouveaux champs)
```bash
mysql -h 127.0.0.1 -P 3306 -u root -ppassword gegeDot < scripts/migration_add_person_fields.sql
```

4. **Backend** (ou via Docker : `docker-compose up -d backend`)
```bash
cd backend/src/GegeDot.API
dotnet run --urls=http://localhost:5001
```

5. **Frontend** (obligatoire pour la vue principale)
```bash
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

6. **Accéder à l'application**
- Vue principale : http://localhost:3004/professional-fan-view.html
- Backend API : http://localhost:5001
- Swagger : http://localhost:5001/swagger
- phpMyAdmin : http://localhost:8080

## 📊 Base de Données

### Schéma Principal
- **Persons** : Informations des personnes
- **Relationships** : Relations familiales
- **Trees** : Arbres généalogiques
- **Users** : Utilisateurs (Phase 2)

## 🔧 Configuration

### Variables d'environnement
```env
# Backend
DATABASE_CONNECTION_STRING=Server=localhost;Database=gegeDot;Uid=root;Pwd=password;
JWT_SECRET=your-secret-key

# Frontend
API_BASE_URL=http://localhost:5001/api
```

## 📚 Documentation API

L'API est documentée avec Swagger disponible à : `http://localhost:5001/swagger`

### Endpoints Principaux
- `GET /api/persons` - Liste des personnes
- `GET /api/persons/{id}` - Obtenir une personne
- `GET /api/persons/{id}/family` - Obtenir l'arbre familial
- `POST /api/persons` - Créer une personne (avec normalisation automatique)
- `POST /api/persons/check-duplicates` - Vérifier les doublons potentiels
- `PUT /api/persons/{id}` - Mettre à jour une personne
- `DELETE /api/persons/{id}` - Supprimer une personne

## 🚀 Déploiement

### Options Gratuites
- **Backend** : Railway.app, Render.com
- **Frontend** : Netlify, Vercel
- **Base de données** : PlanetScale, Railway MySQL

### Déploiement Automatique
Le projet utilise GitHub Actions pour le CI/CD automatique.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Créé dans le cadre d'un projet pédagogique pour apprendre l'architecture moderne.

## 🙏 Remerciements

Inspiré du projet [gege](https://github.com/yans40/gege) pour la structure de base.
