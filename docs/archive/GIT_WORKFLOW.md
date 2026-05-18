# 🌿 Git Workflow - Yeboekun

## 📋 **Stratégie de Branches**

### 🎯 **Branches Principales**

#### `main` - Branche de Production Stable
- **Objectif** : Code stable et testé, prêt pour la production
- **Protection** : Ne doit jamais recevoir de commits directs
- **Mise à jour** : Uniquement via merge depuis `develop` ou `feature/*`
- **État actuel** : ✅ **STABLE** - MVP fonctionnel complet

#### `develop` - Branche de Développement
- **Objectif** : Intégration des nouvelles fonctionnalités
- **Protection** : Branche de travail pour les développeurs
- **Mise à jour** : Merge depuis les branches `feature/*`
- **État actuel** : 🔄 **ACTIVE** - Branche de développement

### 🌱 **Branches de Fonctionnalités**

#### `feature/*` - Nouvelles Fonctionnalités
- **Format** : `feature/nom-fonctionnalite`
- **Exemples** :
  - `feature/tree-visualization`
  - `feature/user-authentication`
  - `feature/export-pdf`
- **Workflow** : Créer depuis `develop`, merger vers `develop`

#### `hotfix/*` - Corrections Urgentes
- **Format** : `hotfix/description-bug`
- **Exemples** :
  - `hotfix/security-patch`
  - `hotfix/critical-bug`
- **Workflow** : Créer depuis `main`, merger vers `main` et `develop`

## 🚀 **Workflow de Développement**

### 1. **Démarrer une Nouvelle Fonctionnalité**
```bash
# Se placer sur develop
git checkout develop
git pull origin develop

# Créer une nouvelle branche feature
git checkout -b feature/nom-fonctionnalite

# Travailler sur la fonctionnalité
# ... commits ...

# Pousser la branche
git push -u origin feature/nom-fonctionnalite
```

### 2. **Finaliser une Fonctionnalité**
```bash
# S'assurer que develop est à jour
git checkout develop
git pull origin develop

# Merger la feature
git merge feature/nom-fonctionnalite

# Pousser develop
git push origin develop

# Supprimer la branche feature (optionnel)
git branch -d feature/nom-fonctionnalite
git push origin --delete feature/nom-fonctionnalite
```

### 3. **Release vers Production**
```bash
# Se placer sur main
git checkout main
git pull origin main

# Merger develop
git merge develop

# Tagger la version
git tag -a v1.0.0 -m "Release version 1.0.0"

# Pousser main et les tags
git push origin main
git push origin --tags
```

## 📊 **État Actuel des Branches**

### ✅ **Branche `main` - STABLE**
- **Commit** : `c54c157` - Frontend setup and testing completed
- **Fonctionnalités** :
  - ✅ API Backend .NET Core fonctionnelle
  - ✅ Base de données MySQL avec 6 personnes
  - ✅ Frontend de test HTML/JavaScript
  - ✅ Docker configuration complète
  - ✅ Documentation complète
  - ✅ Issues #1, #2, #3 terminées

### 🔄 **Branche `develop` - ACTIVE**
- **Base** : Identique à `main`
- **Prête pour** : Nouvelles fonctionnalités

## 🎯 **Prochaines Fonctionnalités à Développer**

### Issue #4 - Tree Visualization
```bash
git checkout -b feature/tree-visualization
# Implémenter D3.js pour les arbres généalogiques
```

### Issue #5 - Production Deployment
```bash
git checkout -b feature/production-deployment
# Déployer sur Railway, Netlify, etc.
```

### Issue #6 - Comprehensive Testing
```bash
git checkout -b feature/comprehensive-testing
# Ajouter tests unitaires et d'intégration
```

## 🔒 **Règles de Protection**

### Branche `main`
- ✅ **NE JAMAIS** commiter directement
- ✅ **TOUJOURS** passer par une Pull Request
- ✅ **TOUJOURS** tester avant merge
- ✅ **TOUJOURS** tagger les releases

### Branche `develop`
- ✅ **TOUJOURS** merger depuis `feature/*`
- ✅ **TOUJOURS** tester les fonctionnalités
- ✅ **TOUJOURS** maintenir la stabilité

## 📝 **Conventions de Commits**

### Format
```
type(scope): description

[body optionnel]

[footer optionnel]
```

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement de code
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Tâches de maintenance

### Exemples
```
feat(api): add person search endpoint
fix(frontend): resolve gender mapping issue
docs(readme): update installation instructions
```

## 🎉 **Avantages de ce Workflow**

1. **Stabilité** : `main` reste toujours fonctionnel
2. **Traçabilité** : Chaque fonctionnalité a sa branche
3. **Collaboration** : Pull Requests pour review
4. **Rollback** : Facile de revenir en arrière
5. **Releases** : Tags pour les versions
6. **Sécurité** : Protection contre les erreurs

---

**Ce workflow garantit un développement professionnel et sécurisé ! 🚀**
