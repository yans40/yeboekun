# 📖 Guide Pédagogique GegeDot

> Un guide évolutif pour comprendre la conception et l'évolution d'une application web moderne — conçu pour les développeurs juniors

---

## 🎯 Pour qui est ce guide ?

Ce document s'adresse aux **développeurs juniors** qui souhaitent :
- Comprendre **pourquoi** une application est structurée d'une certaine façon
- Apprendre à **diagnostiquer** les problèmes courants
- Saisir les **décisions de conception** et leurs conséquences
- Développer un **raisonnement** plutôt que copier-coller des solutions

**Ce guide sera alimenté au fur et à mesure** des cas rencontrés. Chaque section inclut des questions pour vous aider à réfléchir.

---

## 📑 Index

### Partie I — Découverte
1. [Vue d'ensemble et philosophie](#1-vue-densemble-et-philosophie)
2. [Démarrer l'application](#2-démarrer-lapplication)
3. [Architecture : comprendre les couches](#3-architecture--comprendre-les-couches)

### Partie II — Conception évolutive
4. [Pourquoi cette structure ?](#4-pourquoi-cette-structure-)
5. [Le flux des données](#5-le-flux-des-données)

### Partie III — Cas pratiques rencontrés
6. [Cas 1 : "Le site n'est pas accessible"](#6-cas-1--le-site-nest-pas-accessible)
7. [Cas 2 : Suppression et conditions de course](#7-cas-2--suppression-et-conditions-de-course)
8. [Cas 3 : Conjoints en double](#8-cas-3--conjoints-en-double)
9. [Cas 4 : Le clic sur le conjoint ne fonctionne pas](#9-cas-4--le-clic-sur-le-conjoint-ne-fonctionne-pas)
10. [Cas 5 : Validations côté serveur](#10-cas-5--validations-côté-serveur)

### Partie IV — Référence rapide
11. [API et endpoints](#11-api-et-endpoints)
12. [Configuration](#12-configuration)

### Annexes
13. [Comment alimenter ce guide](#13-comment-alimenter-ce-guide)
14. [Quiz d'aide au raisonnement](#14-quiz-daide-au-raisonnement)

---

# Partie I — Découverte

## 1. Vue d'ensemble et philosophie

### Qu'est-ce que GegeDot ?

Une application web de **génération d'arbres généalogiques** avec :
- Un **frontend** (interface utilisateur) en HTML/JavaScript
- Un **backend** (logique métier) en .NET
- Une **base de données** MySQL

### 🤔 Question de réflexion

> **Avant de continuer** : Pourquoi séparer une application en "frontend" et "backend" ?

<details>
<summary>💡 Piste de réponse</summary>

- **Évolutivité** : On peut changer le frontend (mobile, desktop) sans toucher au backend
- **Sécurité** : La base de données n'est jamais exposée directement au navigateur
- **Répartition du travail** : Des équipes différentes peuvent travailler sur chaque partie
- **Technologies adaptées** : Chaque couche utilise les outils les plus adaptés

</details>

---

## 2. Démarrer l'application

### Prérequis

- Docker Desktop
- Python 3

### Commandes

```bash
# 1. Conteneurs (MySQL + Backend)
docker-compose up -d mysql backend

# 2. Serveur frontend (dans un autre terminal)
cd frontend && python3 -m http.server 3004 --bind 127.0.0.1

# 3. Ouvrir : http://localhost:3004/professional-fan-view.html
```

### 🤔 Question de réflexion

> **Pourquoi** le frontend n'est-il pas servi par Docker comme le backend ?

<details>
<summary>💡 Piste de réponse</summary>

La vue principale (`professional-fan-view.html`) est un fichier HTML statique. Le conteneur Docker "frontend" sert une application React compilée. Pour le développement rapide, un serveur Python simple suffit pour servir des fichiers statiques — pas besoin de build.

</details>

---

## 3. Architecture : comprendre les couches

```
┌─────────────────┐     HTTP      ┌─────────────────┐     SQL      ┌─────────────────┐
│   Frontend      │ ◄──────────► │   Backend API    │ ◄──────────► │   MySQL         │
│   (navigateur)  │   fetch()     │   (.NET)         │   EF Core     │   (données)     │
└─────────────────┘    JSON       └─────────────────┘              └─────────────────┘
```

### Structure des dossiers

```
gegeDot/
├── backend/src/
│   ├── GegeDot.API/        ← Contrôleurs (endpoints HTTP)
│   ├── GegeDot.Services/   ← Logique métier
│   ├── GegeDot.Infrastructure/  ← Accès base de données
│   └── GegeDot.Core/       ← Modèles, interfaces
├── frontend/
│   └── professional-fan-view.html  ← Vue principale (1 fichier)
└── scripts/               ← SQL, migrations
```

### 🤔 Question de réflexion

> **Pourquoi** mettre les contrôleurs (API) et les services dans des projets séparés ?

<details>
<summary>💡 Piste de réponse</summary>

**Séparation des responsabilités** : Le contrôleur gère HTTP (requêtes, réponses). Le service gère la logique métier. Si demain on ajoute une API GraphQL ou un worker, on réutilise les services sans toucher aux contrôleurs.

</details>

---

# Partie II — Conception évolutive

## 4. Pourquoi cette structure ?

### Choix 1 : Relations réciproques (conjoints)

Quand A est conjoint de B, on crée **deux** relations en base :
- A → B
- B → A

**Pourquoi ?** Pour que les deux personnes "voient" l'autre comme conjoint sans requête complexe.

**Conséquence** : L'endpoint qui liste les conjoints doit **dédupliquer** (voir Cas 3).

### Choix 2 : Frontend en HTML/JS vanilla

Pas de framework (React, Vue) pour la vue principale. **Pourquoi ?**
- Simplicité pour un prototype
- Pas de build nécessaire
- Compréhension directe du DOM et des événements

### Choix 3 : Port 5001 au lieu de 5000

Sur macOS, le port 5000 est souvent utilisé par AirPlay. **Leçon** : Les conflits de ports sont courants — toujours vérifier `lsof -i :PORT`.

---

## 5. Le flux des données

### Création d'une personne

1. **Utilisateur** remplit le formulaire → clic "Enregistrer"
2. **Frontend** : `fetch(POST /api/persons, { body: JSON.stringify(data) })`
3. **Backend** : Contrôleur reçoit → valide → Service crée → EF Core insère en base
4. **Backend** : Retourne `{ id: 42, ... }`
5. **Frontend** : Met à jour l'UI, ferme la modal

### 🤔 Question de réflexion

> **Où** doit-on valider les données : frontend, backend, ou les deux ?

<details>
<summary>💡 Piste de réponse</summary>

**Les deux**, mais avec des rôles différents :
- **Frontend** : UX immédiate (message avant envoi), évite des requêtes inutiles
- **Backend** : **Sécurité** — le frontend peut être contourné. Jamais faire confiance au client.

</details>

---

# Partie III — Cas pratiques rencontrés

> Chaque cas suit le format : **Problème** → **Diagnostic** → **Solution** → **Leçon**

---

## 6. Cas 1 : "Le site n'est pas accessible"

### Problème

L'utilisateur lance les conteneurs Docker mais obtient "Le site n'est pas accessible" en ouvrant l'URL.

### Diagnostic

1. Les conteneurs tournent (`docker ps`) ✅
2. Le backend répond sur 5001 ✅
3. **Mais** : Le frontend n'est pas un conteneur — c'est un fichier HTML servi par un serveur HTTP

### Solution

Lancer le serveur Python :
```bash
cd frontend && python3 -m http.server 3004 --bind 127.0.0.1
```

### Leçon

**Ne pas confondre** "conteneurs démarrés" et "application accessible". Chaque service a son propre moyen de démarrage.

### 🤔 Quiz

> Si vous ouvrez le fichier HTML directement (`file:///path/to/professional-fan-view.html`), que se passera-t-il avec les appels `fetch()` vers l'API ?

<details>
<summary>Réponse</summary>

**CORS bloquera les requêtes.** Le navigateur considère `file://` comme une origine "null" et refuse les requêtes cross-origin par sécurité. Il faut servir la page via HTTP (localhost:3004).

</details>

---

## 7. Cas 2 : Suppression et conditions de course

### Problème

Après suppression d'une personne :
- La modal reste ouverte avec des données fantômes
- Message "Erreur de connexion au serveur"
- La personne supprimée reste affichée un instant

### Diagnostic

**Conditions de course** (race conditions) :
1. L'utilisateur clique "Supprimer"
2. La requête DELETE part vers l'API
3. **En parallèle** : `loadPersons()` recharge la liste → déclenche `personSelect.change`
4. Le select essaie de charger la vue de la personne... qui n'existe plus (404)
5. Des requêtes `fetch` en cours continuent après la suppression

### Solution

1. **AbortController** : Annuler toutes les requêtes en cours lors de la suppression
2. **Flag `skipPersonSelectChange`** : Ignorer l'événement `change` pendant le rechargement programmatique
3. **Ordre des opérations** : Fermer la modal → vider la vue → réinitialiser le select → recharger

### Leçon

En **asynchrone**, l'ordre d'exécution n'est pas garanti. Il faut :
- **Annuler** les opérations devenues obsolètes (AbortController)
- **Protéger** les événements qui ne doivent pas se déclencher (flags)

### 🤔 Quiz

> Pourquoi `AbortController` plutôt que simplement ignorer les erreurs dans le `catch` ?

<details>
<summary>Réponse</summary>

Ignorer les erreurs masque le symptôme mais les requêtes **continuent** (consommation réseau, callbacks qui s'exécutent). AbortController **annule activement** la requête — le navigateur la coupe, et `fetch` rejette avec `AbortError`.

</details>

---

## 8. Cas 3 : Conjoints en double

### Problème

Chaque conjoint apparaît **deux fois** dans l'affichage.

### Diagnostic

- Les relations sont **réciproques** : A→B et B→A
- L'endpoint `GET /persons/{id}/spouses` récupère toutes les relations où la personne est Person1 **ou** Person2
- Pour le couple (A, B), on récupère les deux relations → B apparaît deux fois

### Solution

**Déduplication** avec un `HashSet<int>` :

```csharp
var processedSpouseIds = new HashSet<int>();
foreach (var marriage in marriages)
{
    var spouseId = marriage.Person1Id == id ? marriage.Person2Id : marriage.Person1Id;
    if (processedSpouseIds.Contains(spouseId)) continue;
    processedSpouseIds.Add(spouseId);
    // ... ajouter le conjoint
}
```

### Leçon

Un **choix de modélisation** (relations réciproques) a des **conséquences sur l'affichage**. La déduplication doit être faite au bon endroit (backend, pas frontend).

### 🤔 Quiz

> Pourquoi utiliser un `HashSet` plutôt qu'un `List` pour `processedSpouseIds` ?

<details>
<summary>Réponse</summary>

`HashSet.Contains()` est **O(1)** en moyenne. `List.Contains()` est **O(n)**. Avec beaucoup de conjoints, le HashSet est plus performant.

</details>

---

## 9. Cas 4 : Le clic sur le conjoint ne fonctionne pas

### Problème

Dans la recherche de conjoints : on clique sur un résultat → il disparaît, aucun conjoint n'est ajouté.

### Diagnostic

**Propagation des événements** :
1. Un gestionnaire global écoute les clics sur `document` pour fermer les résultats de recherche
2. Le clic sur un résultat **se propage** jusqu'à `document`
3. Le gestionnaire global ferme les résultats **avant** que le handler du résultat n'ait fini

### Solution

- `e.stopPropagation()` sur le clic du résultat
- `setTimeout` avant d'ouvrir la modal (laisser le DOM se stabiliser)
- Fermer explicitement les résultats avant d'ouvrir la modal

### Leçon

En JavaScript, les événements **remontent** (bubbling). Un clic sur un enfant déclenche aussi les handlers des parents. `stopPropagation()` interrompt cette remontée.

### 🤔 Quiz

> Quelle est la différence entre `stopPropagation()` et `preventDefault()` ?

<details>
<summary>Réponse</summary>

- **stopPropagation()** : Empêche l'événement d'atteindre les parents (bubbling)
- **preventDefault()** : Empêche l'action par défaut du navigateur (ex: soumission de formulaire, suivi de lien)

</details>

---

## 10. Cas 5 : Validations côté serveur

### Problème

L'audit révèle : création acceptée avec prénom ou nom vide.

### Diagnostic

Les attributs `[Required]` des DTOs ne rejettent pas toujours les chaînes vides ou composées uniquement d'espaces.

### Solution

**Validations manuelles** dans le contrôleur :

```csharp
if (string.IsNullOrWhiteSpace(createPersonDto.FirstName))
    ModelState.AddModelError("FirstName", "Le prénom est obligatoire");
```

Plus les validations de cohérence : date de décès > date de naissance, personne vivante sans date de décès.

### Leçon

**Ne jamais faire confiance au client.** Le frontend peut être contourné (Postman, curl, DevTools). Toute validation critique doit être côté serveur.

---

# Partie IV — Référence rapide

## 11. API et Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/persons | Liste des personnes |
| GET | /api/persons/{id} | Détail |
| GET | /api/persons/{id}/family | Arbre familial |
| GET | /api/persons/{id}/spouses | Tous les conjoints |
| POST | /api/persons | Créer |
| PUT | /api/persons/{id} | Mettre à jour |
| DELETE | /api/persons/{id} | Supprimer |
| POST | /api/persons/{id}/spouses/{spouseId} | Ajouter conjoint |

**Base URL** : `http://localhost:5001/api`

---

## 12. Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend | 5001 | http://localhost:5001/swagger |
| Frontend | 3004 | http://localhost:3004/professional-fan-view.html |
| MySQL | 3306 | localhost:3306 |
| phpMyAdmin | 8080 | http://localhost:8080 |

---

# Annexes

## 13. Comment alimenter ce guide

Quand vous rencontrez un **nouveau cas** ou une **nouvelle décision**, ajoutez une section en suivant ce template :

```markdown
## Cas X : [Titre court du problème]

### Problème
[Description du symptôme observé]

### Diagnostic
[Comment vous avez identifié la cause]

### Solution
[Ce qui a été fait pour corriger]

### Leçon
[Ce qu'un dev junior doit retenir]

### 🤔 Quiz
> [Question pour faire réfléchir]
<details><summary>Réponse</summary>...</details>
```

---

## 14. Quiz d'aide au raisonnement

### Q1. Architecture
> Pourquoi le frontend et le backend communiquent-ils en JSON et pas en HTML ?

<details>
<summary>Réponse</summary>
JSON est un format de **données** (agnostique de la présentation). Le frontend décide comment afficher. Si on envoyait du HTML, le backend imposerait la structure visuelle — moins flexible.
</details>

### Q2. Asynchrone
> Que se passe-t-il si deux `fetch()` partent en même temps pour la même ressource, et que la deuxième réponse arrive avant la première ?

<details>
<summary>Réponse</summary>
**Stale data** : L'UI pourrait afficher d'anciennes données. C'est pourquoi on utilise des AbortController ou des IDs de "version" pour ignorer les réponses obsolètes.
</details>

### Q3. Base de données
> Pourquoi créer des relations réciproques (A→B et B→A) au lieu d'une seule relation avec un flag "sens" ?

<details>
<summary>Réponse</summary>
Les requêtes sont plus simples : "tous les conjoints de A" = `WHERE Person1Id=A OR Person2Id=A`. Avec une seule relation et un sens, il faudrait vérifier les deux colonnes selon le sens.
</details>

### Q4. CORS
> Pourquoi le navigateur bloque-t-il les requêtes cross-origin par défaut ?

<details>
<summary>Réponse</summary>
**Sécurité** : Sans CORS, un site malveillant pourrait faire des requêtes vers votre banque (avec vos cookies) depuis une autre page. Le navigateur impose que le serveur autorise explicitement les origines.
</details>

---

*Guide évolutif — Dernière mise à jour : 2025 — À alimenter au fur et à mesure*
