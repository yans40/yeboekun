# 🔍 Diagnostic d'Accès à l'Application

## ✅ État Actuel

### Backend
- ✅ **Status** : Démarré et fonctionnel
- ✅ **Port** : 5001 (mappé depuis 5000 dans le container)
- ✅ **URL API** : http://localhost:5001/api
- ✅ **Test** : `curl http://localhost:5001/api/persons` fonctionne

### Frontend
- ✅ **Status** : Serveur démarré
- ✅ **Port** : 3004
- ✅ **URL** : http://localhost:3004/professional-fan-view.html
- ✅ **Test** : Le fichier HTML est accessible

## 🔧 Vérifications à Faire

### 1. Ouvrir l'application dans le navigateur

**URL** : http://localhost:3004/professional-fan-view.html

### 2. Ouvrir la console du navigateur (F12)

Vérifiez s'il y a des erreurs :
- Erreurs CORS
- Erreurs de connexion réseau
- Erreurs JavaScript

### 3. Vérifier que l'API est accessible depuis le navigateur

Dans la console, testez :
```javascript
fetch('http://localhost:5001/api/persons')
  .then(r => r.json())
  .then(data => console.log('✅ API OK:', data.length, 'personnes'))
  .catch(err => console.error('❌ Erreur API:', err))
```

### 4. Vérifier la configuration de l'API dans le frontend

Le fichier `professional-fan-view.html` doit contenir :
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

## 🐛 Problèmes Courants

### Problème : "Failed to fetch" ou "NetworkError"

**Causes possibles** :
1. Le backend n'est pas démarré
2. Mauvaise URL de l'API
3. Problème CORS

**Solutions** :
- Vérifier que le backend est démarré : `docker ps`
- Vérifier l'URL dans le code : doit être `http://localhost:5001/api`
- Vérifier les logs du backend : `docker logs yeboekun-backend`

### Problème : "0 personnes chargées"

**Causes possibles** :
1. La base de données est vide
2. Erreur de connexion à la base de données

**Solutions** :
- Vérifier les données : `docker exec -it yeboekun-mysql mysql -u yeboekun -ppassword yeboekun -e "SELECT COUNT(*) FROM Persons;"`
- Vérifier les logs du backend pour les erreurs de connexion

### Problème : Page blanche

**Causes possibles** :
1. Erreur JavaScript
2. Fichier HTML non accessible

**Solutions** :
- Ouvrir la console (F12) pour voir les erreurs
- Vérifier que le serveur frontend est démarré : `lsof -i :3004`

## 📝 Commandes Utiles

### Vérifier que tout fonctionne

```bash
# 1. Vérifier les containers
docker ps

# 2. Vérifier le backend
curl http://localhost:5001/api/persons

# 3. Vérifier le frontend
curl http://localhost:3004/professional-fan-view.html

# 4. Vérifier les logs du backend
docker logs yeboekun-backend --tail 50
```

### Redémarrer les services

```bash
# Redémarrer le backend
docker-compose restart backend

# Redémarrer le frontend (arrêter avec Ctrl+C puis relancer)
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

## ✅ Checklist de Diagnostic

- [ ] Le backend est démarré (`docker ps`)
- [ ] L'API répond (`curl http://localhost:5001/api/persons`)
- [ ] Le serveur frontend est démarré (`lsof -i :3004`)
- [ ] La page HTML est accessible (`curl http://localhost:3004/professional-fan-view.html`)
- [ ] Pas d'erreurs dans la console du navigateur (F12)
- [ ] L'URL de l'API est correcte dans le code (`http://localhost:5001/api`)
