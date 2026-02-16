# 🚀 Guide de Déploiement - GegeDot

## Vue d'ensemble

Ce guide vous explique comment déployer GegeDot sur différentes plateformes cloud gratuites.

## 🌐 Options de Déploiement Gratuites

### 1. Railway.app (Recommandé)

#### Backend (.NET API)
1. **Créer un compte Railway**
   - Aller sur [railway.app](https://railway.app)
   - Se connecter avec GitHub

2. **Déployer le backend**
   ```bash
   # Cloner le projet
   git clone https://github.com/votre-username/gegeDot.git
   cd gegeDot
   
   # Installer Railway CLI
   npm install -g @railway/cli
   
   # Se connecter
   railway login
   
   # Déployer le backend
   cd backend
   railway up
   ```

3. **Configurer la base de données**
   - Ajouter un service MySQL dans Railway
   - Configurer les variables d'environnement :
     ```
     ConnectionStrings__DefaultConnection=Server=mysql;Database=gegeDot;Uid=root;Pwd=password;Port=3306;
     ```

#### Frontend (React)
1. **Déployer sur Netlify**
   ```bash
   cd frontend
   npm run build
   
   # Déployer sur Netlify
   npx netlify deploy --prod --dir=build
   ```

### 2. Render.com

#### Backend
1. **Créer un compte Render**
   - Aller sur [render.com](https://render.com)
   - Connecter GitHub

2. **Créer un Web Service**
   - Repository: votre repo GitHub
   - Build Command: `cd backend && dotnet restore && dotnet publish -c Release`
   - Start Command: `cd backend && dotnet run --urls="http://0.0.0.0:$PORT"`

3. **Ajouter une base de données PostgreSQL**
   - Créer un service PostgreSQL
   - Configurer la connection string

#### Frontend
1. **Créer un Static Site**
   - Repository: votre repo GitHub
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

### 3. PlanetScale (Base de données MySQL)

1. **Créer un compte PlanetScale**
   - Aller sur [planetscale.com](https://planetscale.com)
   - Créer une nouvelle base de données

2. **Configurer la connection**
   ```bash
   # Obtenir la connection string
   pscale connect gegeDot main --port 3306
   ```

3. **Variables d'environnement**
   ```
   ConnectionStrings__DefaultConnection=Server=127.0.0.1;Database=gegeDot;Uid=username;Pwd=password;Port=3306;
   ```

## 🐳 Déploiement avec Docker

### Local avec Docker Compose

```bash
# Cloner le projet
git clone https://github.com/votre-username/gegeDot.git
cd gegeDot

# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
curl http://localhost:5000/api/persons
curl http://localhost:3000
```

### Production avec Docker

```bash
# Build des images
docker build -t gegedot-backend ./backend
docker build -t gegedot-frontend ./frontend

# Démarrer avec docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration des Variables d'Environnement

### Backend (.NET)
```env
# Base de données
ConnectionStrings__DefaultConnection=Server=localhost;Database=gegeDot;Uid=root;Pwd=password;Port=3306;

# Application
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5000

# JWT (pour plus tard)
JWT__SecretKey=your-super-secret-key-here
JWT__Issuer=GegeDot
JWT__Audience=GegeDot-Users
```

### Frontend (React)
```env
# API Backend
REACT_APP_API_URL=https://votre-backend.railway.app

# Environment
REACT_APP_ENVIRONMENT=production
```

## 📊 Monitoring et Logs

### Railway
- Logs disponibles dans le dashboard Railway
- Métriques de performance incluses
- Alertes par email

### Netlify
- Logs de déploiement
- Analytics de performance
- Formulaires de contact

### PlanetScale
- Métriques de base de données
- Requêtes lentes
- Connexions actives

## 🔒 Sécurité en Production

### HTTPS
- Railway et Netlify fournissent HTTPS automatiquement
- Certificats SSL gratuits

### Variables d'environnement
- Ne jamais commiter les secrets
- Utiliser les variables d'environnement des plateformes

### CORS
```csharp
// Dans Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://votre-frontend.netlify.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

## 🚀 Déploiement Automatique avec GitHub Actions

Le projet inclut des workflows GitHub Actions pour :
- Tests automatiques
- Build des images Docker
- Déploiement automatique sur push vers main

### Configuration requise
1. **Secrets GitHub** :
   - `DOCKER_USERNAME` : Nom d'utilisateur Docker Hub
   - `DOCKER_PASSWORD` : Token Docker Hub
   - `RAILWAY_TOKEN` : Token Railway
   - `NETLIFY_AUTH_TOKEN` : Token Netlify
   - `NETLIFY_SITE_ID` : ID du site Netlify

2. **Activer les workflows** :
   - Aller dans Settings > Actions
   - Activer GitHub Actions

## 📈 Optimisations de Performance

### Backend
- Cache Redis (optionnel)
- Compression gzip
- Pagination des résultats
- Index de base de données

### Frontend
- Code splitting
- Lazy loading
- Compression des assets
- CDN pour les images

### Base de données
- Index sur les colonnes fréquemment utilisées
- Requêtes optimisées
- Connection pooling

## 🔄 Mise à jour et Maintenance

### Mise à jour du code
```bash
# Pull les dernières modifications
git pull origin main

# Les déploiements se font automatiquement via GitHub Actions
```

### Sauvegarde de la base de données
```bash
# Railway
railway run mysqldump -u root -p gegeDot > backup.sql

# PlanetScale
pscale db dump gegeDot main --output backup.sql
```

### Monitoring
- Vérifier les logs régulièrement
- Surveiller les métriques de performance
- Tester les fonctionnalités après déploiement

## 🆘 Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifier la connection string
   - S'assurer que la base de données est accessible

2. **CORS errors**
   - Vérifier la configuration CORS
   - S'assurer que les URLs sont correctes

3. **Build failures**
   - Vérifier les logs GitHub Actions
   - Tester localement avant de push

### Support
- Issues GitHub pour les bugs
- Discussions GitHub pour les questions
- Documentation des APIs dans Swagger

## 📚 Ressources Utiles

- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
