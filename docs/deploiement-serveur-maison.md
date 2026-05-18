# Journal de déploiement — Serveur maison (ROG Desktop)

## Contexte

Yeboekun est une application d'arbre généalogique familiale composée de :
- Un **backend** .NET 9 (API REST)
- Un **frontend** React / TypeScript
- Une **base de données** MySQL 8.0
- Le tout orchestré par **Docker Compose**

L'objectif est d'héberger cette application sur un ordinateur à la maison, accessible depuis n'importe où via internet, sans payer d'abonnement mensuel à un hébergeur cloud.

---

## Pourquoi un serveur maison ?

| Option | Coût | Avantages |
|--------|------|-----------|
| Cloud (Hetzner, Render...) | 3-10€/mois | Simple, fiable |
| Serveur maison (ROG Desktop) | 0€ (déjà possédé) | Gratuit, apprentissage |
| Mini PC dédié (Beelink EQ12) | ~150€ achat unique | Économique long terme |

> Le ROG Desktop est utilisé ici comme **banc de test**. Pour une utilisation permanente, un mini PC dédié (ex: Beelink EQ12 à ~150€) est préférable car il consomme ~10W contre ~100W pour un desktop gaming.

---

## Architecture finale mise en place

```
Internet
   │
   ▼
Cloudflare (yeboekun.uk / www.yeboekun.uk)
   │
   │  Tunnel chiffré (sortant, pas d'ouverture de port)
   │
   ▼
ROG Desktop — Ubuntu Server 22.04 — IP locale : 192.168.1.160
   │
   │  Docker Compose
   ├─► Frontend React        (port 3000)  ◄── exposé publiquement
   ├─► Backend .NET 9        (port 5001)
   ├─► MySQL 8.0             (port 3306)
   └─► phpMyAdmin            (port 8080)
```

---

## Étape 1 — Créer une clé USB bootable (sur Mac)

### Pourquoi ?
Ubuntu Server ne s'installe pas comme une application. Il faut booter dessus depuis une clé USB. **Balena Etcher** transforme le fichier ISO en clé bootable correctement formatée.

### Ce qu'on a fait
1. Téléchargé **Ubuntu Server 22.04.5 LTS** sur ubuntu.com
2. Téléchargé **Balena Etcher** — version macOS x64 (Mac Intel) sur balena.io/etcher
3. Flashé l'ISO sur la clé USB avec Etcher (~5-10 min)

> La validation après le flash est normale et obligatoire — ne pas interrompre.

---

## Étape 2 — Installer Ubuntu Server sur le ROG

### Pourquoi remplacer Windows ?
Windows consomme trop de RAM et de ressources pour un usage serveur. Ubuntu Server démarre avec ~300 MB de RAM contre ~2 GB pour Windows.

### Matériel nécessaire (temporairement)
- Clé USB flashée
- Écran branché sur le ROG
- Clavier USB

### Démarrage sur la clé USB
1. Brancher la clé USB sur le ROG
2. Allumer et appuyer sur **F8** (ou F2/DEL) pour accéder au menu boot
3. Sélectionner la clé USB comme source de démarrage

### Paramètres choisis dans l'installeur

| Paramètre | Choix | Raison |
|-----------|-------|--------|
| Type | Ubuntu Server (minimized) | Plus léger, moins de services inutiles |
| Réseau | Sans réseau | Pas de câble disponible lors de l'install |
| Disque | Disque entier (931 GB) | Simple, pas de partitionnement manuel |
| LVM | Non | Inutile pour cet usage |
| Utilisateur | `yandark` | Identifiant de connexion SSH |
| Mot de passe | (confidentiel) | À conserver précieusement |
| OpenSSH | **Oui — coché** | Indispensable pour accès distant |
| Ubuntu Pro | Skip | Payant, inutile ici |
| Snaps | Aucun | Inutile |

### Fin d'installation
À la fin, l'écran affiche une série de messages dont :
```
Begin: SSH host key...
OK finished cloud-init final stage
OK reached target cloud-init target
```
Puis la ligne de connexion apparaît :
```
yandark-server login:
```

> Une fois Ubuntu installé, **l'écran et le clavier peuvent être débranchés** — tout se gère ensuite en SSH depuis le Mac.

---

## Étape 3 — Configurer le réseau Ethernet

### Pourquoi cette étape ?
L'installation s'est faite sans réseau. Ubuntu n'a pas configuré la carte Ethernet automatiquement. Il faut le faire via **Netplan**, l'outil de configuration réseau d'Ubuntu 22.04.

### Identifier la carte réseau
```bash
ip a
```
Résultat important à lire :
```
1: lo: <LOOPBACK>          → à ignorer (boucle locale interne)
2: eno1: <BROADCAST>       → carte Ethernet physique
3: wlp3s0: <BROADCAST>     → carte WiFi
```
Les cartes `eno1` et `wlp3s0` étaient en état **DOWN** (non configurées).

### Configurer Ethernet avec Netplan
```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

Contenu à saisir :
```yaml
network:
  version: 2
  ethernets:
    eno1:
      dhcp4: true
```

> **Important** : utiliser des espaces, pas des tabulations. YAML est sensible à l'indentation.

- `eno1` = nom de la carte Ethernet du ROG
- `dhcp4: true` = la box attribue automatiquement une IP

Appliquer :
```bash
sudo netplan apply
```

Vérification :
```bash
ip a
```
Résultat obtenu :
```
inet 192.168.1.160/24   ← IP locale attribuée par la box
```

---

## Étape 4 — Connexion SSH depuis le Mac

### Pourquoi SSH ?
SSH (Secure Shell) permet de contrôler le serveur à distance depuis le terminal du Mac. C'est une connexion chiffrée et sécurisée.

### Ce qu'on a fait
```bash
ssh yandark@192.168.1.160
```

À la première connexion, SSH demande de confirmer l'identité du serveur :
```
The authenticity of host '192.168.1.160' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```
→ Répondre `yes` (cette confirmation n'est demandée qu'une seule fois).

Résultat une fois connecté :
```
yandark@yandark-server:~$
```

> À partir de ce moment, l'écran et le clavier du ROG ne sont plus nécessaires.

---

## Étape 5 — Installer Docker

### Pourquoi Docker ?
Docker permet de faire tourner Yeboekun et ses dépendances (MySQL, phpMyAdmin) dans des conteneurs isolés, sans rien installer directement sur Ubuntu. C'est la même configuration qu'en développement.

### Ce qu'on a fait
```bash
# Installation automatique via le script officiel Docker
curl -fsSL https://get.docker.com | sh

# Permettre à yandark d'utiliser Docker sans sudo à chaque fois
sudo usermod -aG docker $USER
newgrp docker

# Vérification
docker ps
```

Résultat attendu :
```
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```
Ligne vide = Docker fonctionne, aucun conteneur en cours.

---

## Étape 6 — Déployer Yeboekun

### Ce qu'on a fait

```bash
# Cloner le projet depuis GitHub
git clone https://github.com/yans40/yeboekun.git
cd yeboekun

# Basculer sur la branche de production
git checkout main

# Configurer le mot de passe admin du frontend
cp frontend/.env.example frontend/.env
nano frontend/.env
# → modifier : VITE_EDIT_PASSWORD=ton_mot_de_passe
```

### Lancer tous les services
```bash
docker compose up -d
```

Ce que fait cette commande :
1. Télécharge les images Docker (MySQL 8.0, .NET SDK 9.0, phpMyAdmin, Nginx)
2. Compile le frontend React
3. Démarre les 4 conteneurs en arrière-plan (`-d` = detached)

Résultat obtenu :
```
✔ Image mcr.microsoft.com/dotnet/sdk:9.0   Pulled
✔ Image mysql:8.0                           Pulled
✔ Image phpmyadmin/phpmyadmin               Pulled
✔ Image yeboekun-frontend                    Built
✔ Network yeboekun_yeboekun-network           Created
✔ Volume yeboekun_mysql_data                 Created
✔ Container yeboekun-mysql                   Started
✔ Container yeboekun-backend                 Started
✔ Container yeboekun-phpmyadmin              Started
✔ Container yeboekun-frontend                Started
```

### Vérification
```bash
docker ps
```

Les 4 conteneurs doivent être en état **Up** :

| Conteneur | Port | Rôle |
|-----------|------|------|
| yeboekun-frontend | 3000 | Interface web React |
| yeboekun-backend | 5001 | API .NET |
| yeboekun-mysql | 3306 | Base de données |
| yeboekun-phpmyadmin | 8080 | Interface admin BDD |

> **Note** : au premier démarrage, le backend peut redémarrer plusieurs fois le temps que MySQL s'initialise. C'est normal — Docker le relance automatiquement jusqu'à ce que la connexion réussisse.

### Accès local (réseau maison uniquement)

| Service | URL |
|---------|-----|
| Yeboekun | http://192.168.1.160:3000 |
| phpMyAdmin | http://192.168.1.160:8080 |
| API backend | http://192.168.1.160:5001 |

---

## Étape 7 — Cloudflare Tunnel (accès depuis internet)

### Pourquoi ?
Sans tunnel, Yeboekun est accessible uniquement sur le réseau local. Cloudflare Tunnel crée une connexion **sortante** du serveur vers Cloudflare :
- Pas besoin d'ouvrir des ports sur la box
- L'IP réelle du serveur reste cachée
- HTTPS et protection DDoS inclus gratuitement

### Domaine acheté
`yeboekun.uk` — enregistré sur **Cloudflare Registrar** (~5$/an)

> Cloudflare Registrar vend les domaines au prix coûtant, sans marge — c'est l'une des options les moins chères du marché.

### Installation de cloudflared

```bash
# Télécharger cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb

# Installer
sudo dpkg -i cloudflared.deb
```

### Connexion au compte Cloudflare
```bash
cloudflared tunnel login
```
Cette commande affiche une URL à ouvrir dans le navigateur → sélectionner `yeboekun.uk` → cliquer Authorize.

Résultat :
```
You have successfully logged in.
Credentials saved to: /home/yandark/.cloudflared/cert.pem
```

### Créer le tunnel
```bash
cloudflared tunnel create yeboekun
```

Résultat :
```
Tunnel credentials written to /home/yandark/.cloudflared/[TUNNEL-ID].json
Created tunnel yeboekun with id [TUNNEL-ID]
```

### Configurer le DNS
```bash
# Domaine racine
cloudflared tunnel route dns yeboekun yeboekun.uk

# Sous-domaine www
cloudflared tunnel route dns yeboekun www.yeboekun.uk
```

### Fichier de configuration

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Contenu :
```yaml
tunnel: [TUNNEL-ID]
credentials-file: /etc/cloudflared/[TUNNEL-ID].json

ingress:
  - hostname: yeboekun.uk
    service: http://localhost:3000
  - hostname: www.yeboekun.uk
    service: http://localhost:3000
  - service: http_status:404
```

> La dernière ligne `http_status:404` est obligatoire — elle gère toutes les requêtes qui ne correspondent à aucun hostname.

### Installer comme service système
```bash
sudo cp ~/.cloudflared/*.json /etc/cloudflared/
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

Vérification :
```bash
sudo systemctl status cloudflared
```

Résultat attendu :
```
● cloudflared.service - cloudflared
   Active: active (running)
   ...
   INF Registered tunnel connection connIndex=0 location=cdg09
   INF Registered tunnel connection connIndex=1 location=cdg14
```

> `cdg` = datacenter Cloudflare de Paris — connexion optimale depuis la France.

### Résultat final
Yeboekun est accessible depuis n'importe où dans le monde :
- **http://yeboekun.uk**
- **http://www.yeboekun.uk**

---

## Stratégie de déploiement (branches Git)

```
branche develop  ──► développement, nouvelles fonctionnalités, tests
        │
        │  merge validé sur GitHub
        ▼
branche main     ──► version stable, déployée sur le serveur ROG
```

### Mettre à jour le serveur après un merge sur main

```bash
cd ~/yeboekun
git pull origin main
docker compose down
docker compose up -d --build
```

---

## Sécurité mise en place (2026-05-07)

- [x] **SSH par clé** — clé ED25519 installée, auth par mot de passe désactivée dans `sshd_config`
- [x] **UFW** — pare-feu actif, SSH autorisé uniquement depuis 192.168.1.0/24, tout le reste bloqué
- [x] **Fail2ban** — surveillance SSH active, 5 tentatives max / 10 min → ban 1h
- [x] **Sauvegardes automatiques** — script `/home/yandark/backups/mysql/mysql-backup.sh`, cron à 3h chaque nuit, rétention 7 jours
- [x] **Mises à jour automatiques Ubuntu** — `unattended-upgrades` actif

---

## Commandes de référence rapide

```bash
# Se connecter au serveur depuis le Mac
ssh yandark@192.168.1.160

# Voir l'état des conteneurs Docker
docker ps

# Voir les logs d'un service
docker logs yeboekun-backend --tail 30
docker logs yeboekun-mysql --tail 10

# Redémarrer un service spécifique
docker compose restart backend

# Mettre à jour Yeboekun (après merge sur main)
cd ~/yeboekun && git pull origin main && docker compose down && docker compose up -d --build

# Vérifier l'état du tunnel Cloudflare
sudo systemctl status cloudflared

# Éteindre proprement le serveur
sudo shutdown now

# Redémarrer le serveur
sudo reboot
```
