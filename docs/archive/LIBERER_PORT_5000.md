# 🔧 Comment Libérer le Port 5000

## 🔍 Diagnostic

Le port 5000 est utilisé par :
- **Processus** : ControlCenter (PID 22810)
- **Service** : AirPlay Receiver sur macOS
- **Port** : 5000 (TCP)

## ✅ Solutions

### Solution 1 : Désactiver AirPlay Receiver (Recommandé)

#### Via l'interface graphique :
1. Ouvrir **Préférences Système** (⚙️)
2. Aller dans **Partage**
3. Décocher **AirPlay Receiver**

#### Via la ligne de commande :
```bash
# Désactiver AirPlay Receiver
sudo launchctl unload -w /System/Library/LaunchDaemons/com.apple.airplayreceiverd.plist

# Pour le réactiver plus tard :
# sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.airplayreceiverd.plist
```

### Solution 2 : Arrêter le processus ControlCenter (Temporaire)

⚠️ **Attention** : Cela arrêtera le Centre de Contrôle, il se relancera automatiquement.

```bash
# Arrêter ControlCenter
killall ControlCenter

# Attendre quelques secondes
sleep 2

# Vérifier que le port est libre
lsof -i :5000
```

### Solution 3 : Utiliser un autre port pour le backend (Pratique)

Modifier `docker-compose.yml` pour utiliser le port 5001 au lieu de 5000 :

```yaml
ports:
  - "5001:5000"  # Utiliser le port 5001 au lieu de 5000
```

Et mettre à jour `frontend/professional-fan-view.html` :

```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

## 🚀 Après avoir libéré le port

```bash
# 1. Vérifier que le port est libre
lsof -i :5000

# 2. Redémarrer les containers
docker-compose down
docker-compose up -d mysql backend

# 3. Vérifier que le backend démarre
sleep 10
docker logs yeboekun-backend

# 4. Tester l'API
curl http://localhost:5000/api/persons
```

## 📝 Recommandation

**Je recommande la Solution 3** (changer le port) car :
- ✅ Pas besoin de modifier les paramètres système macOS
- ✅ AirPlay Receiver peut continuer à fonctionner
- ✅ Plus simple et moins risqué
