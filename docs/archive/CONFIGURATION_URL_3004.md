# Configuration pour l'URL http://localhost:3004/professional-fan-view.html

## ✅ Configuration actuelle

### Frontend
- **URL d'accès** : `http://localhost:3004/professional-fan-view.html`
- **URL API** : `http://localhost:5000/api` ✅ (déjà corrigé)

### Backend
- **Port** : 5000 (HTTP)
- **CORS** : 
  - En développement : Toutes les origines autorisées ✅
  - En production : Ports 3000-3005 autorisés (inclut 3004) ✅

## 🔍 Vérifications à faire

### 1. Vérifier que le backend est accessible
Ouvrez dans votre navigateur ou avec curl :
```
http://localhost:5000/api/persons
```

Vous devriez recevoir une liste JSON (peut être vide `[]` si aucune personne).

### 2. Vérifier les logs du backend
```bash
docker logs gegeDot-backend
```

Recherchez :
- `Now listening on: http://[::]:5000`
- Pas d'erreurs de connexion à la base de données

### 3. Tester depuis le navigateur
1. Ouvrez `http://localhost:3004/professional-fan-view.html`
2. Ouvrez la console du navigateur (F12)
3. Vérifiez qu'il n'y a pas d'erreurs CORS
4. Regardez les logs dans la console lors du chargement des personnes

### 4. Si vous voyez des erreurs CORS
Même si le CORS devrait autoriser toutes les origines en développement, vérifiez :
- Que le backend est bien en mode Development
- Les logs du backend pour voir les erreurs CORS exactes

## 🛠️ Commandes utiles

### Vérifier que les containers sont démarrés
```bash
docker ps
```

### Redémarrer les containers
```bash
docker-compose restart backend
```

### Voir les logs en temps réel
```bash
docker logs -f gegeDot-backend
```

### Tester l'API directement
```bash
curl http://localhost:5000/api/persons
```

## 📝 Notes

- Le frontend sur le port 3004 peut être servi par :
  - Un serveur web local (nginx, Apache, etc.)
  - Un serveur de développement (par exemple `python -m http.server 3004`)
  - Docker avec un mapping de port différent

- L'important est que :
  1. Le backend soit accessible sur `http://localhost:5000`
  2. Le CORS autorise les requêtes depuis `http://localhost:3004`
  3. L'URL de l'API dans le frontend soit `http://localhost:5000/api`

## ✅ Tout devrait fonctionner maintenant

Avec les corrections appliquées :
- ✅ Port API corrigé (5000 au lieu de 5001)
- ✅ CORS autorise toutes les origines en développement
- ✅ HTTPS redirection désactivée en développement
- ✅ Meilleure gestion des erreurs avec logs détaillés

Si vous avez encore des problèmes, vérifiez la console du navigateur (F12) pour voir les erreurs exactes.
