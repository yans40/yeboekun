# Diagnostic : Problème de chargement des personnes

## Problèmes identifiés

### 1. Port API incorrect
- **Frontend** : Utilise `http://localhost:5001/api`
- **Backend Docker** : Écoute sur le port `5000`
- **Solution** : Corriger l'URL dans le frontend ou configurer le backend pour écouter sur 5001

### 2. CORS non configuré pour le frontend HTML
- **Problème** : Le CORS dans `Program.cs` n'autorise que les ports 3000-3005 (React)
- **Impact** : Si le frontend est servi depuis un fichier HTML local ou nginx, les requêtes sont bloquées
- **Solution** : Ajouter l'origine du frontend ou autoriser toutes les origines en développement

### 3. URL de connexion dans les containers
- **Problème** : Si le frontend est dans un container, il ne peut pas utiliser `localhost`
- **Solution** : Utiliser le nom du service Docker (`backend`) ou configurer l'URL selon l'environnement

### 4. HTTPS Redirection
- **Problème** : Le backend redirige vers HTTPS mais écoute en HTTP
- **Solution** : Désactiver la redirection HTTPS en développement

## Solutions à appliquer

### Solution 1 : Corriger le port API dans le frontend

Si vous accédez au frontend depuis votre navigateur (fichier HTML local ou via nginx sur port 3000), utilisez le port 5000 :

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Solution 2 : Configurer CORS pour autoriser le frontend

Modifier `Program.cs` pour autoriser toutes les origines en développement ou ajouter l'origine spécifique.

### Solution 3 : Vérifier la connexion à la base de données

Vérifier que la base de données est accessible et contient des données.

## Commandes de diagnostic

1. **Vérifier que les containers sont démarrés** :
```bash
docker ps
```

2. **Vérifier les logs du backend** :
```bash
docker logs yeboekun-backend
```

3. **Vérifier les logs de la base de données** :
```bash
docker logs yeboekun-mysql
```

4. **Tester l'API directement** :
```bash
curl http://localhost:5000/api/persons
```

5. **Vérifier la connexion à la base de données depuis le backend** :
```bash
docker exec -it yeboekun-backend bash
# Puis tester la connexion
```

6. **Vérifier que la base contient des données** :
```bash
docker exec -it yeboekun-mysql mysql -u yeboekun -ppassword yeboekun -e "SELECT COUNT(*) FROM Persons;"
```
