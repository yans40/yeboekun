# Déploiement Oracle Cloud Always Free

## Pourquoi Oracle Cloud ?

- VM ARM Ampere : 4 OCPUs + 24 GB RAM — **gratuit à vie**, sans sleep
- Docker Compose déployé tel quel, sans refonte d'architecture
- MySQL, Backend .NET et Frontend React sur la même machine

---

## Phase 1 — Créer le compte Oracle Cloud

1. Aller sur https://cloud.oracle.com → **Start for free**
2. Créer un compte (carte bancaire requise pour vérification, aucun débit)
3. Choisir une région proche : `eu-paris-1` ou `eu-frankfurt-1`

---

## Phase 2 — Créer la VM ARM

1. Console Oracle → **Compute → Instances → Create Instance**
2. Configuration :
   - **Shape** : `VM.Standard.A1.Flex` (ARM Ampere) — 4 OCPUs, 24 GB RAM gratuits
   - **OS** : Ubuntu 22.04
   - **Stockage** : 50 GB (gratuit)
3. Télécharger la clé SSH générée → la conserver précieusement
4. Noter l'**IP publique** de la VM

---

## Phase 3 — Ouvrir les ports (Security List Oracle)

Dans **Networking → Virtual Cloud Networks → Security Lists**, ajouter des règles Ingress :

| Port | Protocole | Usage |
|------|-----------|-------|
| 22   | TCP | SSH |
| 80   | TCP | Frontend HTTP |
| 443  | TCP | HTTPS (optionnel) |
| 5001 | TCP | Backend API |
| 8080 | TCP | phpMyAdmin (optionnel) |

---

## Phase 4 — Installer Docker sur la VM

```bash
ssh -i ta-clé.pem ubuntu@IP_PUBLIQUE

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Docker Compose plugin
sudo apt-get install -y docker-compose-plugin

# Git
sudo apt-get install -y git
```

---

## Phase 5 — Adapter le projet pour la production

### Fichiers à créer

**`docker-compose.prod.yml`** — surcharge production :
- Mots de passe sécurisés (pas `password`)
- Backend en mode `Production` avec image runtime (pas SDK)
- `REACT_APP_API_URL` pointant sur l'IP publique Oracle

**`.env.prod`** — variables sensibles (ne jamais committer)

### Fichiers déjà prêts

- `frontend/Dockerfile` — multi-stage build, rien à changer
- `docker-compose.yml` — base réutilisée via override

---

## Phase 6 — Déployer sur la VM

```bash
# Sur la VM Oracle
git clone https://github.com/yans40/gegeDot.git
cd gegeDot

# Créer le fichier de variables de production
cp .env.example .env.prod
# Éditer .env.prod avec les vrais mots de passe

# Lancer en production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Phase 7 — Vérifier et sécuriser

- `http://IP_PUBLIQUE` → frontend React
- `http://IP_PUBLIQUE:5001/swagger` → API
- Changer tous les mots de passe MySQL par défaut
- (Optionnel) Nom de domaine gratuit via DuckDNS + SSL Let's Encrypt

---

## Récapitulatif des modifications à apporter au code

| Fichier | Action |
|---------|--------|
| `docker-compose.prod.yml` | À créer |
| `Dockerfile` backend production | À créer (image runtime, pas SDK) |
| `.env.prod` | À créer sur la VM (non committé) |
| `frontend/Dockerfile` | Déjà bon |
| `docker-compose.yml` | Aucun changement |

---

---

## Comprendre les clés SSH

### Le problème qu'elles résolvent
Pour se connecter à un serveur distant, il faut prouver son identité. Le mot de passe est risqué — il peut être deviné ou intercepté. La clé SSH est une alternative bien plus sûre.

### La paire de clés
C'est deux fichiers liés mathématiquement :

```
~/.ssh/oracle_gegedot      ← clé PRIVÉE  (reste sur ton Mac, ne quitte jamais ta machine)
~/.ssh/oracle_gegedot.pub  ← clé PUBLIQUE (déposée sur le serveur Oracle)
```

Analogie : la clé publique est un **cadenas** posé sur le serveur, la clé privée est la **clé** que toi seul possèdes.

### Ce qui se passe à la connexion
```
ton Mac                          serveur Oracle
   │                                  │
   │── "je veux me connecter" ────────►│
   │                                  │ génère un défi chiffré
   │◄── "prouve qui tu es" ───────────│ avec ta clé publique
   │                                  │
   │ résout le défi                   │
   │ avec ta clé privée               │
   │── "voilà la réponse" ───────────►│
   │                                  │ vérifie avec la clé publique
   │◄── "accès autorisé" ────────────│
```

### Se connecter depuis une autre machine
La clé privée étant absente, le serveur refusera l'accès. Deux options :

**Option 1 — Copier la clé privée sur l'autre machine** (usage personnel uniquement)
```bash
scp ~/.ssh/oracle_gegedot utilisateur@autre-machine:~/.ssh/
```

**Option 2 — Autoriser une nouvelle machine** (bonne pratique)
Générer une nouvelle paire sur l'autre machine, puis ajouter sa clé publique sur le serveur dans `~/.ssh/authorized_keys`. Le serveur accepte plusieurs clés — une par machine autorisée.

### En pratique
```bash
ssh -i ~/.ssh/oracle_gegedot ubuntu@<IP-de-ta-VM>
```

---

## Statut

- [ ] Compte Oracle Cloud créé
- [ ] VM ARM créée et accessible en SSH
- [ ] Ports ouverts dans Security List
- [ ] Docker installé sur la VM
- [ ] `docker-compose.prod.yml` créé
- [ ] Application déployée et accessible
- [ ] Mots de passe production sécurisés
