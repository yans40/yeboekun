# Plan de déploiement GegeDot sur Render

Ce document décrit les étapes détaillées pour déployer l'application GegeDot (backend .NET 9, frontend HTML/JS, MySQL) sur [Render.com](https://render.com).

---

## Vue d'ensemble

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  Static Site            │     │  Web Service            │     │  MySQL                  │
│  (frontend)             │────►│  (backend .NET)         │────►│  (base de données)      │
│  gegeDot.onrender.com   │     │  gegeDot-api.onrender.com│    │  Internal URL           │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

| Composant | Technologie | Service Render |
|-----------|-------------|----------------|
| Frontend | HTML, CSS, vanilla JS, D3.js | Static Site (gratuit) |
| Backend | ASP.NET Core 9 | Web Service (Docker) |
| Base de données | MySQL 8 | MySQL (payant) ou PlanetScale (gratuit) |

---

## Prérequis

- Compte [Render](https://dashboard.render.com)
- Repo GitHub [yans40/gegeDot](https://github.com/yans40/gegeDot) connecté
- Pour MySQL gratuit : compte [PlanetScale](https://planetscale.com) (optionnel)

---

## Partie 1 : Base de données

### Option A : MySQL sur Render (payant)

1. Dashboard Render → **New** → **MySQL**
2. Créer une base :
   - **Name** : `gegedot-db`
   - **Database** : `gegeDot`
   - **User** : `gegedot`
   - **Region** : proche du backend (ex. Frankfurt)
3. Noter : **Internal Database URL** (format `mysql://user:password@host:port/database`)

### Option B : PlanetScale (gratuit)

1. [PlanetScale](https://planetscale.com) → Create database → `gegedot`
2. **Connect** → **Connect with** → **General** → copier la connection string
3. Format : `mysql://user:password@host/database?sslaccept=strict`
4. PlanetScale utilise le port 3306 par défaut.

### Schéma de la base

Le backend utilise `EnsureCreated()` au démarrage. Si tu veux appliquer le schéma manuel :

```bash
mysql -h <HOST> -P 3306 -u <USER> -p <PASSWORD> gegeDot < scripts/init.sql
```

---

## Partie 2 : Backend (.NET API)

### 2.1 Créer le Web Service

1. Dashboard Render → **New** → **Web Service**
2. Connecter le repo **yans40/gegeDot**
3. **Branch** : `main`

### 2.2 Configuration du build

| Paramètre | Valeur |
|-----------|--------|
| **Type** | Docker |
| **Dockerfile Path** | `backend/Dockerfile` |
| **Root Directory** | `backend` |

Le [backend/Dockerfile](../backend/Dockerfile) utilise des chemins relatifs à `backend/` (`src/GegeDot.API/`, etc.). Le **Root Directory** doit être `backend` pour que le build fonctionne.

### 2.3 Variables d'environnement

| Variable | Valeur | Exemple |
|----------|-------|---------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | `Production` |
| `ConnectionStrings__DefaultConnection` | URL MySQL | `mysql://gegedot:xxx@host/database` |

### 2.4 Port

Render injecte la variable `PORT` (généralement 10000). Le backend doit écouter sur ce port.

**Dans Render → Environment**, ajouter :

| Variable | Valeur |
|----------|--------|
| `ASPNETCORE_URLS` | `http://+:${PORT}` |

Render supporte la substitution `${PORT}` dans les variables d'environnement.

**Health Check Path** (Settings) : `/swagger` ou `/api/persons` (si Swagger désactivé en prod).

### 2.5 CORS

Modifier [backend/src/GegeDot.API/Program.cs](../backend/src/GegeDot.API/Program.cs) pour autoriser l'URL du frontend Render :

```csharp
// En production, ajouter l'URL Render du frontend
policy.WithOrigins(
    "https://gegedot.onrender.com",
    "https://gegeDot.onrender.com"
)
```

Ou utiliser une variable d'environnement `CORS_ORIGINS` pour plus de flexibilité.

---

## Partie 3 : Frontend (Static Site)

### 3.1 Créer le Static Site

1. Dashboard Render → **New** → **Static Site**
2. Connecter le repo **yans40/gegeDot**
3. **Branch** : `main`

### 3.2 Configuration

| Paramètre | Valeur |
|-----------|--------|
| **Build Command** | `echo "No build"` ou vide |
| **Publish Directory** | `frontend` |

### 3.3 URL de l'API

Le frontend utilise `API_BASE_URL` en dur dans [professional-fan-view.html](../frontend/professional-fan-view.html) (ligne 1771) :

```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

**Modifications nécessaires :**

#### Option 1 : Fichier de configuration (recommandé)

1. Créer `frontend/config.js` :

```javascript
// config.js - généré ou édité manuellement
window.GEGEDOT_CONFIG = {
  API_BASE_URL: 'https://gegedot-api.onrender.com/api'
};
```

2. Dans `professional-fan-view.html`, remplacer :

```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

par :

```javascript
const API_BASE_URL = (window.GEGEDOT_CONFIG && window.GEGEDOT_CONFIG.API_BASE_URL) || 'http://localhost:5001/api';
```

3. Ajouter dans le `<head>` :

```html
<script src="config.js"></script>
```

4. Ne pas committer `config.js` avec l'URL de prod (ou le garder dans `.gitignore` et le générer au build). Alternative : créer `config.example.js` et documenter.

#### Option 2 : Build script avec variable d'environnement

1. Créer `frontend/build-config.js` (script Node) :

```javascript
const fs = require('fs');
const apiUrl = process.env.API_BASE_URL || 'http://localhost:5001/api';
fs.writeFileSync('config.js', `window.GEGEDOT_CONFIG={API_BASE_URL:"${apiUrl}"};`);
```

2. **Build Command** Render : `node build-config.js`
3. **Publish Directory** : `frontend` (après génération de config.js)

4. Variable d'environnement Render : `API_BASE_URL` = `https://gegedot-api.onrender.com/api`

### 3.4 Page d'entrée

La vue principale est `professional-fan-view.html`. Configurer :

- **Redirects/Rewrites** : rediriger `/` vers `/professional-fan-view.html` si nécessaire

Ou documenter l'URL directe : `https://gegedot.onrender.com/professional-fan-view.html`

---

## Partie 4 : Checklist des modifications

### 4.1 Backend

- [ ] `Program.cs` : ajouter l'URL du frontend Render dans CORS
- [ ] Variables d'environnement : `ConnectionStrings__DefaultConnection`, `ASPNETCORE_ENVIRONMENT`, `ASPNETCORE_URLS=http://+:${PORT}`

### 4.2 Frontend

- [ ] Créer `config.js` ou `config.example.js`
- [ ] Modifier `professional-fan-view.html` pour utiliser `GEGEDOT_CONFIG.API_BASE_URL`
- [ ] Répéter pour les autres vues si nécessaire (hierarchical-tree-beta-fixed.html, etc.)

### 4.3 Ordre de déploiement

1. **MySQL** : créer la base
2. **Backend** : déployer avec la connection string
3. **Frontend** : déployer avec l'URL de l'API backend

---

## Partie 5 : Free tier et limitations

| Service | Render Free | Limitation |
|---------|------------|------------|
| Static Site | Oui | Bande passante incluse |
| Web Service | Oui | Spin down après 15 min d'inactivité (premier appel lent ~30s) |
| MySQL | Non | Payant sur Render |

**Alternative MySQL gratuite :** PlanetScale (5 GB, 1 milliard de rows/mois en free tier).

---

## Partie 6 : URLs finales

Après déploiement :

- **Frontend** : `https://gegedot.onrender.com` (ou `https://gegedot-xxxx.onrender.com`)
- **Backend API** : `https://gegedot-api.onrender.com` (ou `https://gegedot-api-xxxx.onrender.com`)
- **Swagger** : `https://gegedot-api.onrender.com/swagger` (si activé en prod)

---

## Partie 7 : Références

- [Render - Deploy .NET with Docker](https://render.com/docs/deploy-docker)
- [Render - Static Sites](https://docs.render.com/static-sites)
- [Render - MySQL](https://render.com/docs/deploy-mysql)
- [PlanetScale - Free tier](https://planetscale.com/pricing)
