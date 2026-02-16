# Guide pour récupérer les issues GitHub

## Scripts disponibles

### 1. Script Python (recommandé)

Le script Python est plus robuste et fonctionne même sans outils externes :

```bash
# Installer requests si nécessaire
pip3 install requests

# Récupérer toutes les issues
python3 scripts/fetch_github_issues.py
```

Ce script va :
- Récupérer toutes les issues ouvertes
- Récupérer les 10 dernières issues fermées
- Afficher les statistiques
- Sauvegarder les résultats dans `github_issues.json`

### 2. Script Bash (nécessite jq ou Python)

```bash
./scripts/fetch_github_issues.sh
```

### 3. Récupérer une issue spécifique

```bash
python3 scripts/fetch_issue_details.py <NUMERO>
```

Exemple :
```bash
python3 scripts/fetch_issue_details.py 1
```

## Installation des dépendances

Si vous n'avez pas `requests` installé :

```bash
pip3 install requests
```

## Format de sortie

Les issues sont affichées avec :
- Numéro et titre
- État (ouvert/fermé)
- Date de création
- Labels
- URL GitHub

Les données sont aussi sauvegardées en JSON pour analyse ultérieure.

## Exemples d'utilisation

```bash
# Récupérer toutes les issues
python3 scripts/fetch_github_issues.py

# Voir les détails de l'issue #1
python3 scripts/fetch_issue_details.py 1

# Voir les détails de l'issue #5
python3 scripts/fetch_issue_details.py 5
```
