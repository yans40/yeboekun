# 🌐 URLs d'Accès - Yeboekun

## ✅ URL Principale (Application Complète)

### **Frontend avec Vue Carte Éventail**
**http://localhost:3004/hierarchical-tree-beta-fixed.html**

Cette URL est la **version principale et stable** avec :
- ✅ Menu déroulant des personnes
- ✅ Vue arbre familial
- ✅ Vue carte éventail interactive
- ✅ Formulaire d'ajout de personne
- ✅ Détection de doublons
- ✅ Zoom et navigation

---

## 📋 Autres URLs Disponibles

### Pages de Test
- `http://localhost:3004/test.html` - Page de test simple
- `http://localhost:3004/simple-test.html` - Test API minimal
- `http://localhost:3004/debug-dropdown.html` - Debug du dropdown

### Versions Alternatives (non recommandées pour le test)
- `http://localhost:3004/hierarchical-tree-beta.html` - Version beta (ancienne)
- `http://localhost:3004/hierarchical-tree-charlie.html` - Version Charlie
- `http://localhost:3004/fan-card-view.html` - Vue carte seule

---

## 🔧 Services Backend

### API REST
- **URL** : http://localhost:5001
- **Swagger** : http://localhost:5001/swagger
- **Endpoint personnes** : http://localhost:5001/api/persons

### Base de Données
- **phpMyAdmin** : http://localhost:8080
  - Utilisateur : `root`
  - Mot de passe : `password`

---

## ⚠️ Important

**Le menu déroulant ne se remplira QUE si le backend est démarré !**

### Vérifier que le backend fonctionne :
```bash
curl http://localhost:5001/api/persons
```

Si vous obtenez une erreur, le backend n'est pas démarré.

### Démarrer le backend :
```bash
cd backend/src/Yeboekun.API
dotnet run --urls=http://localhost:5001
```

---

## 🎯 URL à Utiliser pour les Tests

**http://localhost:3004/hierarchical-tree-beta-fixed.html**

C'est la seule URL que vous devez utiliser pour tester les nouvelles fonctionnalités !
