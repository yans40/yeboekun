# 🌐 URLs d'Accès à l'Application Yeboekun

## 🚀 Démarrage Rapide

### 1. Démarrer les Services

```bash
# Terminal 1 : MySQL et phpMyAdmin
docker-compose up -d

# Terminal 2 : Backend API
cd backend/src/Yeboekun.API
dotnet run --urls=http://localhost:5001

# Terminal 3 : Frontend
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

---

## 📍 URLs Principales

### ⭐ Vue Éventail Professionnelle (PRINCIPALE)
**URL** : http://localhost:3004/professional-fan-view.html

**C'est la vue principale à utiliser !**

Fonctionnalités :
- ✅ Affichage hiérarchique complet
- ✅ Frères/sœurs, enfants, conjoint
- ✅ Navigation interactive
- ✅ Zoom et pan
- ✅ Optimisée pour les performances

---

### Autres Vues Disponibles

#### Vue Hiérarchique Basique
- **URL** : http://localhost:3004/hierarchical-tree-beta-fixed.html
- Description : Vue hiérarchique simple (version Beta)

#### Visualiseur d'Issues GitHub
- **URL** : http://localhost:3004/view-github-issues.html
- Description : Visualiser les issues GitHub du projet

---

## 🔧 Services Backend

### API REST
- **URL** : http://localhost:5001/api
- **Swagger** : http://localhost:5001/swagger
- **Health Check** : http://localhost:5001/api/persons

### Base de Données
- **phpMyAdmin** : http://localhost:8080
  - Utilisateur : `root`
  - Mot de passe : `password`
  - Base : `yeboekun`

---

## 📝 Résumé

**Pour utiliser l'application :**

1. ✅ Démarrer tous les services (voir commandes ci-dessus)
2. ✅ Ouvrir dans votre navigateur : **http://localhost:3004/professional-fan-view.html**
3. ✅ Sélectionner une personne dans le menu déroulant
4. ✅ La vue éventail se charge automatiquement !

---

## 🎯 Test Rapide

Une fois l'application démarrée, testez avec :
- **Charles Windsor** (famille royale)
- **Jean TestFamille** (30 enfants pour tester les performances)
- **Ned Stark** (Game of Thrones)
- **Viserys Targaryen** (House of the Dragon)

---

## ⚠️ Dépannage

### Le frontend ne charge pas ?
- Vérifiez que le serveur Python est bien démarré sur le port 3004
- Vérifiez l'URL : doit être `http://localhost:3004/professional-fan-view.html`

### L'API ne répond pas ?
- Vérifiez que le backend est démarré sur le port 5001
- Testez : http://localhost:5001/api/persons

### Pas de personnes dans le menu déroulant ?
- Cliquez sur "🔄 Recharger les personnes"
- Vérifiez que la base de données contient des données
