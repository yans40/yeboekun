# 🚀 Démarrage Rapide - Yeboekun

## Étapes pour démarrer l'application

### 1. Démarrer les containers Docker (MySQL et Backend)

```bash
docker-compose up -d mysql backend
```

### 2. Vérifier que le backend est accessible

```bash
curl http://localhost:5000/api/persons
```

Vous devriez recevoir une réponse JSON (peut être `[]` si la base est vide).

### 3. Démarrer le serveur frontend

Dans un **nouveau terminal** :

```bash
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

### 4. Accéder à l'application

Ouvrez votre navigateur et allez sur :
**http://localhost:3004/professional-fan-view.html**

---

## 🔍 Si ça ne fonctionne pas

### Vérifier les containers
```bash
docker ps
```

Vous devriez voir `yeboekun-mysql` et `yeboekun-backend` en cours d'exécution.

### Vérifier les logs du backend
```bash
docker logs yeboekun-backend
```

### Vérifier que le port 3004 est libre
```bash
lsof -i :3004
```

Si le port est utilisé, arrêtez le processus :
```bash
lsof -ti:3004 | xargs kill
```

---

## ✅ Checklist

- [ ] Docker Desktop est démarré
- [ ] Les containers MySQL et Backend sont démarrés (`docker ps`)
- [ ] Le backend répond sur http://localhost:5000/api/persons
- [ ] Le serveur frontend est démarré sur le port 3004
- [ ] L'application est accessible dans le navigateur

---

## 📝 Commandes utiles

### Arrêter les containers
```bash
docker-compose stop
```

### Voir les logs
```bash
docker logs -f yeboekun-backend
```

### Redémarrer
```bash
docker-compose restart backend
```
