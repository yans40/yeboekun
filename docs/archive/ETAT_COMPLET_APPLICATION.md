# 📊 État Complet de l'Application GegeDot

**Date de synthèse** : Janvier 2026  
**Version** : Phase Delta (En cours)  
**Dépôt GitHub** : https://github.com/yans40/gegeDot

---

## 🏗️ Architecture Générale

### Stack Technologique

**Backend :**
- .NET 9 Core
- Entity Framework Core
- MySQL 8.0
- AutoMapper
- Swagger/OpenAPI
- Architecture en couches (API → Services → Repositories → Entities)

**Frontend :**
- HTML5/CSS3/JavaScript (ES6+)
- D3.js (pour visualisations)
- Pas de framework (vanilla JS)

**Infrastructure :**
- Docker & Docker Compose
- MySQL (conteneur Docker)
- phpMyAdmin (conteneur Docker)
- Backend .NET (exécution locale ou Docker)

---

## 🔧 Backend - API REST

### Structure des Projets

```
backend/src/
├── GegeDot.API/              # Contrôleurs et configuration
│   ├── Controllers/
│   │   └── PersonsController.cs
│   └── Program.cs
├── GegeDot.Core/             # Entités et interfaces
│   ├── Entities/
│   │   ├── Person.cs
│   │   ├── Relationship.cs
│   │   └── Tree.cs
│   └── Interfaces/
├── GegeDot.Services/         # Logique métier
│   ├── Services/
│   │   ├── PersonService.cs
│   │   ├── DataNormalizationService.cs
│   │   └── DuplicateDetectionService.cs
│   └── DTOs/
└── GegeDot.Infrastructure/   # Accès données
    ├── Data/
    │   └── GegeDotContext.cs
    └── Repositories/
```

### Endpoints API Disponibles

#### Gestion des Personnes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/persons` | Liste toutes les personnes |
| `GET` | `/api/persons/{id}` | Récupère une personne par ID |
| `GET` | `/api/persons/{id}/relationships` | Récupère une personne avec ses relations |
| `GET` | `/api/persons/{id}/family` | Récupère l'arbre familial complet |
| `GET` | `/api/persons/{id}/parents` | Récupère les parents d'une personne |
| `GET` | `/api/persons/{id}/children` | Récupère les enfants d'une personne |
| `GET` | `/api/persons/{id}/siblings` | Récupère les frères/sœurs |
| `GET` | `/api/persons/{id}/spouse` | Récupère le conjoint actuel |
| `POST` | `/api/persons` | Crée une nouvelle personne (avec normalisation) |
| `POST` | `/api/persons/check-duplicates` | Vérifie les doublons potentiels |
| `PUT` | `/api/persons/{id}` | Met à jour une personne |
| `DELETE` | `/api/persons/{id}` | Supprime une personne |

### Services Backend

#### PersonService
- CRUD complet des personnes
- Récupération des relations familiales
- Recherche de personnes

#### DataNormalizationService
- Normalisation automatique des noms (majuscules, accents)
- Normalisation des lieux (codes département)
- Normalisation des dates
- Normalisation des professions

#### DuplicateDetectionService
- Détection de doublons avec algorithme de similarité
- Comparaison par nom, prénom, date de naissance
- Score de similarité

---

## 🎨 Frontend - Interfaces

### Vues Disponibles

#### 1. **Vue Éventail Professionnelle** (`professional-fan-view.html`) ⭐ PRINCIPALE

**Fonctionnalités :**
- ✅ Affichage hiérarchique par générations (parents au-dessus, enfants en dessous)
- ✅ Personne centrale en bas, parents/grands-parents au-dessus
- ✅ Affichage des frères/sœurs (grisés, cliquables, triés par âge)
- ✅ Affichage des enfants (grisés, cliquables, triés par date de naissance)
- ✅ Affichage du conjoint actuel (animation au survol/clic sur ❤️)
- ✅ Navigation interactive (clic sur une carte pour voir sa vue éventail)
- ✅ Zoom et pan (zoom in/out, centrage)
- ✅ Centrage automatique sur la personne centrale
- ✅ Connexions familiales (lignes entre parents/enfants)
- ✅ Connexions de mariage (ligne rose pour le conjoint)
- ✅ Légende interactive
- ✅ Menu déroulant pour sélectionner une personne
- ✅ Chargement automatique au changement de sélection
- ✅ Optimisation : carte centrale affichée immédiatement (sans latence)

**Design :**
- Cartes modernes avec ombres et bordures
- Couleurs différenciées (hommes/femmes, central/siblings/enfants/conjoint)
- Animations fluides
- Responsive

#### 2. Autres Vues (historiques/test)
- `hierarchical-tree-beta-fixed.html` - Vue hiérarchique basique
- `hierarchical-tree-charlie.html` - Version Charlie
- `fan-card-view.html` - Vue éventail basique
- `view-github-issues.html` - Visualiseur d'issues GitHub

---

## 💾 Base de Données

### Schéma Principal

#### Table `Persons`
```sql
- Id (PK, Auto-increment)
- FirstName, LastName, MiddleName
- BirthDate, DeathDate
- BirthPlace, DeathPlace
- Gender (Male/Female/Other)
- Profession
- MarriageDate, MarriagePlace
- DeathStatus
- PhotoUrl
- Biography
- IsAlive (bool)
- CreatedAt, UpdatedAt
```

#### Table `Relationships`
```sql
- Id (PK)
- Person1Id, Person2Id (FK vers Persons)
- RelationshipType (enum: Parent, Child, Spouse, Sibling, etc.)
- StartDate, EndDate
- Notes
- IsActive (bool)
- CreatedAt
```

#### Table `Trees`
```sql
- Id (PK)
- Name
- RootPersonId (FK vers Persons)
- CreatedAt, UpdatedAt
```

### Données de Test

**Familles disponibles :**
- 👑 **Famille Royale Britannique** : Charles, William, Harry, Diana, Camilla, Kate, etc.
- 🐉 **Game of Thrones** : Familles Stark, Lannister, Baratheon, Targaryen, Tully
- 🐲 **House of the Dragon** : Targaryen (générations précédentes)
- 🧪 **Famille de Test** : Jean TestFamille (30 enfants + petits-enfants)

---

## ✨ Fonctionnalités Implémentées

### ✅ Phase Alpha - MVP
- [x] Architecture backend .NET Core
- [x] API REST avec Swagger
- [x] Base de données MySQL
- [x] CRUD personnes
- [x] Frontend HTML/JavaScript basique

### ✅ Phase Beta - Consolidation
- [x] Visualisation arbre familial
- [x] Gestion des relations
- [x] Interface utilisateur améliorée
- [x] Formulaire d'ajout enrichi

### ✅ Phase Charlie - Vue Éventail
- [x] Vue carte éventail interactive
- [x] Système de zoom et navigation
- [x] Liens familiaux
- [x] Design moderne

### ✅ Phase Delta - En Cours
- [x] Extension du modèle de données (Profession, Mariage, etc.)
- [x] Service de normalisation des données
- [x] Service de détection de doublons
- [x] Vue éventail professionnelle avancée
- [x] Affichage des frères/sœurs
- [x] Affichage des enfants
- [x] Affichage du conjoint actuel
- [x] Navigation interactive
- [x] Optimisation des performances
- [ ] Relations complexes (oncles, tantes, cousins)
- [ ] Recherche et filtrage avancés
- [ ] Export et partage (PDF, GEDCOM)

---

## 🎯 Vue Éventail Professionnelle - Détails

### Fonctionnalités Spécifiques

#### 1. Affichage Hiérarchique
- **Niveau 0** : Personne centrale (en bas)
- **Niveau +1, +2, +3...** : Parents, grands-parents (au-dessus)
- **Niveau -1** : Enfants (en dessous)
- **Niveau 0 (siblings)** : Frères/sœurs (même niveau que la personne centrale)

#### 2. Frères/Sœurs
- Affichage grisé (opacité 0.6)
- Bordure en pointillés
- Triés par date de naissance (du plus grand au plus jeune)
- Personne centrale intégrée dans l'ordre chronologique
- Cliquables pour voir leur vue éventail

#### 3. Enfants
- Cartes plus petites (160px vs 200px)
- Plus grisés (opacité 0.4)
- Triés par date de naissance
- Centrés sous la personne centrale
- Connexions grises à angle droit (sans croix horizontale)
- Cliquables

#### 4. Conjoint Actuel
- Icône ❤️ sur la carte centrale
- Affichage au survol (500ms) ou clic sur ❤️
- Animation slide-in/fade-in
- Bordure violette (#9C27B0)
- Connexion de mariage (ligne rose horizontale)
- Cliquable pour voir sa vue éventail

#### 5. Optimisations
- Affichage immédiat de la carte centrale (sans latence)
- Centrage automatique imperceptible
- Rendu non bloquant avec `requestAnimationFrame`
- Animation optimisée des autres cartes

---

## 📁 Scripts Disponibles

### Scripts SQL

#### Données de Test
- `add_royal_family_members.sql` - Famille royale britannique
- `add_game_of_thrones_characters.sql` - Personnages GoT
- `add_house_of_dragon_characters.sql` - Personnages HotD
- `add_charles_grandchildren.sql` - Petits-enfants de Charles
- `add_diana_and_ancestry.sql` - Diana et ascendance
- `add_spouses_and_ancestors.sql` - Camilla, Kate et leurs ascendants
- `add_test_family_large.sql` - Famille de test (30 enfants)

#### Maintenance
- `cleanup_database.sql` - Nettoyage des doublons
- `remove_duplicates.sql` - Suppression des doublons
- `diagnostic_jean.sql` - Diagnostic pour Jean TestFamille
- `check_and_create_jean.sql` - Vérification/création de Jean

### Scripts Shell

#### Git
- `check_git_status.sh` - Vérifier l'état Git
- `commit_optimisations.sh` - Créer un commit
- `commit_spouses_fix.sh` - Commit pour les conjoints

#### GitHub
- `fetch_github_issues.py` - Récupérer les issues GitHub
- `fetch_github_issues.sh` - Version bash
- `fetch_issue_details.py` - Détails d'une issue spécifique

#### Test
- `execute_test_family.sh` - Exécuter le script de famille de test

---

## 🚀 Démarrage de l'Application

### Prérequis
- .NET 9 SDK
- Docker Desktop
- Python 3 (pour serveur frontend)
- MySQL 8.0+ (via Docker)

### Commandes de Démarrage

```bash
# 1. Démarrer MySQL et phpMyAdmin
docker-compose up -d

# 2. Backend (dans un terminal)
cd backend/src/GegeDot.API
dotnet run --urls=http://localhost:5001

# 3. Frontend (dans un autre terminal)
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

### URLs d'Accès
- **Frontend** : http://localhost:3004/professional-fan-view.html
- **Backend API** : http://localhost:5001/api
- **Swagger** : http://localhost:5001/swagger
- **phpMyAdmin** : http://localhost:8080

---

## 📊 Statistiques du Projet

### Fichiers
- **Backend** : ~15 fichiers C# principaux
- **Frontend** : ~20 fichiers HTML/JS
- **Scripts** : ~25 scripts SQL/Shell/Python
- **Documentation** : ~30 fichiers Markdown

### Lignes de Code (approximatif)
- Backend C# : ~3000 lignes
- Frontend JS : ~2000 lignes
- SQL : ~2000 lignes
- Documentation : ~5000 lignes

### Données
- **Personnes** : ~200+ (famille royale + GoT + HotD + test)
- **Relations** : ~500+ relations familiales
- **Familles** : 4 familles principales (Royale, GoT, HotD, Test)

---

## 🔄 État Git

### Remote Configuré
- **Origin** : https://github.com/yans40/gegeDot.git
- **Branche principale** : `main`

### Commits Récents (à vérifier)
- Optimisation affichage carte centrale
- Ajout des conjoints (Camilla, Kate) et ascendants
- Correction du doublon de carte du conjoint
- Scripts de test famille nombreuse

---

## 🐛 Issues GitHub

**Total** : 13 issues ouvertes (selon GitHub)

Pour voir les détails :
- Ouvrir `frontend/view-github-issues.html` dans le navigateur
- Ou exécuter : `python3 scripts/fetch_github_issues.py`

---

## 🎯 Prochaines Étapes Suggérées

### Court Terme
1. ✅ Résoudre les issues GitHub prioritaires
2. ✅ Améliorer les performances avec grandes familles
3. ✅ Ajouter des relations complexes (oncles, tantes, cousins)

### Moyen Terme
1. Recherche et filtrage avancés
2. Export PDF des arbres
3. Export/Import GEDCOM
4. Upload de photos
5. Authentification utilisateurs

### Long Terme
1. Déploiement cloud (Railway, Netlify)
2. CI/CD automatisé
3. Tests automatisés
4. Documentation API complète
5. Version mobile responsive

---

## 📝 Notes Importantes

### Points Forts
- ✅ Architecture propre et modulaire
- ✅ API REST bien structurée
- ✅ Vue éventail très interactive et performante
- ✅ Normalisation automatique des données
- ✅ Détection de doublons intelligente

### Points d'Amélioration
- ⚠️ Pas de tests automatisés
- ⚠️ Pas d'authentification (Phase 2)
- ⚠️ Pas de déploiement cloud actif
- ⚠️ Documentation API à compléter

---

## 🔗 Liens Utiles

- **GitHub** : https://github.com/yans40/gegeDot
- **Issues** : https://github.com/yans40/gegeDot/issues
- **Swagger** : http://localhost:5001/swagger (local)

---

**Document généré automatiquement** - Mise à jour recommandée après chaque phase majeure
