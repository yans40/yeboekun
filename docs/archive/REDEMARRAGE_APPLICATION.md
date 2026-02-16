# 🔄 Redémarrage de l'Application

## État des Containers

### Containers Docker
- ✅ **gegeDot-backend** : Redémarré
- ✅ **gegeDot-mysql** : En cours d'exécution

### Services
- ✅ **Backend API** : http://localhost:5001/api
- ✅ **Frontend** : http://localhost:3004/professional-fan-view.html
- ✅ **MySQL** : Port 3306

## Commandes de Redémarrage

### Redémarrer tous les containers
```bash
docker-compose restart
```

### Redémarrer uniquement le backend
```bash
docker-compose restart backend
```

### Redémarrer uniquement MySQL
```bash
docker-compose restart mysql
```

### Arrêter et redémarrer complètement
```bash
docker-compose down
docker-compose up -d
```

### Voir les logs du backend
```bash
docker logs gegeDot-backend --tail 50 -f
```

## Vérification

### Vérifier que le backend répond
```bash
curl http://localhost:5001/api/persons
```

### Vérifier que le frontend est accessible
Ouvrir dans le navigateur :
http://localhost:3004/professional-fan-view.html

## Problèmes Courants

### Backend ne répond pas
1. Vérifier les logs : `docker logs gegeDot-backend`
2. Vérifier que le port 5001 n'est pas utilisé : `lsof -ti:5001`
3. Redémarrer le backend : `docker-compose restart backend`

### Erreur de connexion à la base de données
1. Vérifier que MySQL est démarré : `docker ps | grep mysql`
2. Vérifier les logs MySQL : `docker logs gegeDot-mysql`
3. Redémarrer MySQL : `docker-compose restart mysql`

### Frontend ne charge pas
1. Vérifier que le serveur Python est démarré : `ps aux | grep "python.*3004"`
2. Redémarrer le serveur : `cd frontend && python3 -m http.server 3004 --bind 127.0.0.1 &`

---

**Date** : $(date)
**Statut** : Backend redémarré
