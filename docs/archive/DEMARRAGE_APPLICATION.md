# 🚀 Guide de Démarrage de l'Application GegeDot

## 📋 Prérequis

- Docker et Docker Compose installés
- Python 3 installé (pour le serveur frontend local)

## 🎯 Option 1 : Démarrage avec Docker (Recommandé)

### 1. Démarrer tous les services
```bash
docker-compose up -d
```

### 2. Vérifier que les containers sont démarrés
```bash
docker ps
```

Vous devriez voir :
- `gegeDot-mysql` (port 3306)
- `gegeDot-backend` (ports 5000, 5001)
- `gegeDot-frontend` (port 3000)
- `gegeDot-phpmyadmin` (port 8080)

### 3. Accéder à l'application
- **Frontend Docker** : http://localhost:3000
- **Backend API** : http://localhost:5000/api
- **Swagger** : http://localhost:5000/swagger
- **phpMyAdmin** : http://localhost:8080

⚠️ **Note** : Le frontend Docker sert une application React compilée. Pour accéder à `professional-fan-view.html`, utilisez l'Option 2.

---

## 🎯 Option 2 : Démarrage Mixte (Docker + Serveur Local)

### 1. Démarrer les services backend (Docker)
```bash
# Démarrer MySQL et Backend
docker-compose up -d mysql backend
```

### 2. Vérifier que le backend est accessible
```bash
# Tester l'API
curl http://localhost:5000/api/persons
```

### 3. Démarrer le serveur frontend local
```bash
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

### 4. Accéder à l'application
- **Vue Éventail** : http://localhost:3004/professional-fan-view.html
- **Backend API** : http://localhost:5000/api
- **Swagger** : http://localhost:5000/swagger

---

## 🔍 Diagnostic si l'application ne démarre pas

### Vérifier les containers Docker
```bash
# Voir tous les containers (y compris arrêtés)
docker ps -a

# Voir les logs du backend
docker logs gegeDot-backend

# Voir les logs de MySQL
docker logs gegeDot-mysql
```

### Vérifier que les ports sont libres
```bash
# Vérifier le port 5000 (backend)
lsof -i :5000

# Vérifier le port 3004 (frontend local)
lsof -i :3004

# Vérifier le port 3306 (MySQL)
lsof -i :3306
```

### Redémarrer les services
```bash
# Arrêter tous les services
docker-compose down

# Redémarrer
docker-compose up -d
```

### Reconstruire les images si nécessaire
```bash
# Reconstruire les images
docker-compose build --no-cache

# Redémarrer
docker-compose up -d
```

---

## 📝 Commandes Utiles

### Voir les logs en temps réel
```bash
# Backend
docker logs -f gegeDot-backend

# MySQL
docker logs -f gegeDot-mysql

# Frontend
docker logs -f gegeDot-frontend
```

### Arrêter les services
```bash
docker-compose stop
```

### Arrêter et supprimer les containers
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données)
```bash
docker-compose down -v
```

---

## ✅ Checklist de Démarrage

- [ ] Docker est démarré
- [ ] Les containers sont en cours d'exécution (`docker ps`)
- [ ] Le backend répond sur http://localhost:5000/api/persons
- [ ] Le serveur frontend local est démarré (si Option 2)
- [ ] L'application est accessible dans le navigateur
- [ ] Pas d'erreurs dans la console du navigateur (F12)
- [ ] Pas d'erreurs dans les logs Docker

---

## 🆘 Problèmes Courants

### "Cannot connect to Docker daemon"
- Vérifiez que Docker Desktop est démarré
- Sur Linux : `sudo systemctl start docker`

### "Port already in use"
- Arrêtez le service qui utilise le port
- Ou modifiez le port dans `docker-compose.yml`

### "Backend not responding"
- Vérifiez les logs : `docker logs gegeDot-backend`
- Vérifiez que MySQL est démarré : `docker logs gegeDot-mysql`
- Vérifiez la connexion à la base de données

### "Frontend not loading"
- Vérifiez que le serveur local est démarré (Option 2)
- Vérifiez l'URL dans le navigateur
- Vérifiez la console du navigateur (F12) pour les erreurs

---

## 📞 Support

Si vous rencontrez toujours des problèmes :
1. Vérifiez les logs avec `docker logs`
2. Vérifiez la console du navigateur (F12)
3. Testez l'API directement avec `curl http://localhost:5000/api/persons`
