# 🔄 Plan de Reconstruction Yeboekun

## 🎯 Objectif
Reconstruire le projet Yeboekun de manière propre, organisée et complète en s'inspirant des prompts, instructions et objectifs définis dans les phases précédentes.

---

## 📋 État Actuel du Projet

### ✅ Ce qui existe déjà
- **Backend .NET 8** : API fonctionnelle avec CRUD Personnes
- **Base de données MySQL** : Schéma de base avec Persons et Relationships
- **Frontend HTML/JS** : Vue interactive avec cartes éventail
- **Docker Compose** : Infrastructure de développement
- **Documentation** : Plans de phases, user stories, objectifs

### ⚠️ Ce qui manque
- **Modèle de données incomplet** : Pas de profession, marriageDate, etc.
- **Services manquants** : Normalisation, détection de doublons
- **Vue éventail professionnelle** : Format généalogique standard
- **Relations complexes** : Mariage, adoption, etc.
- **Recherche avancée** : Filtres et recherche intelligente
- **Export/Partage** : PDF, GEDCOM, etc.

---

## 🏗️ Architecture Cible

```
yeboekun/
├── backend/
│   ├── src/
│   │   ├── Yeboekun.API/              # API Gateway
│   │   │   ├── Controllers/
│   │   │   │   ├── PersonsController.cs
│   │   │   │   ├── RelationshipsController.cs
│   │   │   │   └── SearchController.cs
│   │   │   └── Program.cs
│   │   ├── Yeboekun.Core/              # Domain Layer
│   │   │   ├── Entities/
│   │   │   │   ├── Person.cs (ENRICHIE)
│   │   │   │   ├── Relationship.cs (ENRICHIE)
│   │   │   │   └── Tree.cs
│   │   │   └── Interfaces/
│   │   ├── Yeboekun.Services/          # Business Logic
│   │   │   ├── Services/
│   │   │   │   ├── PersonService.cs
│   │   │   │   ├── RelationshipService.cs
│   │   │   │   ├── DataNormalizationService.cs (NOUVEAU)
│   │   │   │   ├── DuplicateDetectionService.cs (NOUVEAU)
│   │   │   │   └── SearchService.cs (NOUVEAU)
│   │   │   └── DTOs/
│   │   └── Yeboekun.Infrastructure/    # Data Access
│   │       ├── Data/
│   │       └── Repositories/
│   └── tests/
│       └── Yeboekun.Tests/
├── frontend/
│   ├── hierarchical-tree-beta-fixed.html (AMÉLIORÉ)
│   ├── professional-fan-view.html (NOUVEAU)
│   └── src/ (React - optionnel pour plus tard)
└── docs/
    ├── API.md
    ├── USER_GUIDE.md
    └── DEPLOYMENT.md
```

---

## 📝 Plan d'Implémentation par Phases

### 🔥 Phase 1 : Fondations (Priorité Maximale)

#### 1.1 Extension du Modèle de Données
- [ ] Ajouter les champs manquants à `Person` :
  - `Profession` (string, nullable)
  - `MarriageDate` (DateTime?, nullable)
  - `MarriagePlace` (string, nullable)
  - `DeathStatus` (string, nullable) - "Mort en Mer", "Décédé", etc.
- [ ] Créer migration Entity Framework
- [ ] Mettre à jour les DTOs
- [ ] Mettre à jour les mappings AutoMapper

#### 1.2 Service de Normalisation
- [ ] Créer `DataNormalizationService`
- [ ] Implémenter `NormalizeName()`
- [ ] Implémenter `NormalizePlace()`
- [ ] Implémenter `NormalizeDate()`
- [ ] Implémenter `NormalizeProfession()`
- [ ] Tests unitaires

#### 1.3 Service de Détection de Doublons
- [ ] Créer `DuplicateDetectionService`
- [ ] Implémenter algorithme de similarité (Levenshtein)
- [ ] Implémenter recherche phonétique
- [ ] Implémenter calcul de score de similarité
- [ ] Tests unitaires

#### 1.4 Amélioration du Formulaire d'Ajout
- [ ] Ajouter tous les nouveaux champs
- [ ] Intégrer la normalisation automatique
- [ ] Intégrer la détection de doublons
- [ ] Interface de gestion des doublons
- [ ] Validation côté client et serveur

---

### 🎨 Phase 2 : Vue Éventail Professionnelle

#### 2.1 Enrichissement des Cartes
- [ ] Redesigner les cartes avec format généalogique
- [ ] Afficher : ID, Nom, Profession, Naissance (°), Mariage (x), Décès (+)
- [ ] Gérer les formats compacts selon zoom
- [ ] Icônes et symboles généalogiques

#### 2.2 Positionnement Hiérarchique
- [ ] Algorithme de calcul par génération
- [ ] Numérotation systématique (6 → 12,13 → 24-27 → 48-55)
- [ ] Espacement vertical par niveau
- [ ] Centrage automatique

#### 2.3 Connexions Familiales
- [ ] Lignes verticales parent-enfant
- [ ] Lignes horizontales mariage
- [ ] Gestion des connexions multiples
- [ ] Animation des connexions

---

### 🔍 Phase 3 : Recherche et Filtrage

#### 3.1 Service de Recherche
- [ ] Créer `SearchService`
- [ ] Recherche par nom (exacte et phonétique)
- [ ] Recherche par dates
- [ ] Recherche par lieux
- [ ] Recherche par profession

#### 3.2 Interface de Recherche
- [ ] Barre de recherche intelligente
- [ ] Filtres multiples
- [ ] Suggestions automatiques
- [ ] Historique de recherche

---

### 📤 Phase 4 : Export et Partage

#### 4.1 Services d'Export
- [ ] Export PDF (iTextSharp)
- [ ] Export GEDCOM
- [ ] Export JSON/CSV
- [ ] Export image (PNG/SVG)

#### 4.2 Partage
- [ ] Génération de liens uniques
- [ ] Partage par email
- [ ] Rapports familiaux

---

## 🛠️ Technologies et Outils

### Backend
- **.NET 8** : Framework principal
- **Entity Framework Core** : ORM
- **AutoMapper** : Mapping DTOs
- **Swagger** : Documentation API
- **xUnit** : Tests unitaires

### Frontend
- **HTML5/CSS3/JavaScript** : Vue actuelle
- **D3.js** : Visualisation (si nécessaire)
- **React/TypeScript** : Pour évolution future

### Base de Données
- **MySQL 8.0** : Base de données principale
- **Migrations EF Core** : Gestion du schéma

---

## 📊 Métriques de Succès

### Performance
- [ ] Ajout personne < 2 secondes
- [ ] Détection doublons < 1 seconde
- [ ] Recherche < 200ms
- [ ] Chargement arbre < 2 secondes

### Qualité
- [ ] 0% doublons non détectés
- [ ] 100% données normalisées
- [ ] 80%+ couverture tests
- [ ] 0 erreurs critiques

### UX
- [ ] Formulaire intuitif
- [ ] Messages d'erreur clairs
- [ ] Interface responsive
- [ ] Accessibilité WCAG AA

---

## 🚀 Ordre d'Exécution Recommandé

1. **Semaine 1** : Phase 1.1 + 1.2 (Modèle + Normalisation)
2. **Semaine 2** : Phase 1.3 + 1.4 (Doublons + Formulaire)
3. **Semaine 3** : Phase 2.1 + 2.2 (Cartes + Positionnement)
4. **Semaine 4** : Phase 2.3 + 3.1 (Connexions + Recherche)
5. **Semaine 5** : Phase 3.2 + 4.1 (Interface recherche + Export)
6. **Semaine 6** : Phase 4.2 + Tests + Documentation

---

## 📝 Notes Importantes

- **Compatibilité** : Maintenir la compatibilité avec les données existantes
- **Migration** : Créer des migrations EF Core pour chaque changement
- **Tests** : Écrire les tests en parallèle du développement
- **Documentation** : Mettre à jour la documentation à chaque étape
- **Git** : Commits atomiques et messages clairs

---

## 🎯 Objectif Final

Un projet Yeboekun **propre**, **complet**, **testé** et **documenté** qui répond à tous les objectifs des phases Alpha, Beta, Charlie et Delta, avec une architecture solide et extensible pour les phases futures.

---

**Date de création** : 2026-01-10  
**Version** : 1.0  
**Statut** : 🚀 En cours d'implémentation
