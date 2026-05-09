# Guide Pédagogique GegeDot

> Un guide évolutif pour comprendre la conception et l'évolution d'une application web moderne — conçu pour les développeurs juniors

---

## Pour qui est ce guide ?

Ce document s'adresse aux **développeurs juniors** qui souhaitent :
- Comprendre **pourquoi** une application est structurée d'une certaine façon
- Apprendre à **diagnostiquer** les problèmes courants
- Saisir les **décisions de conception** et leurs conséquences
- Développer un **raisonnement** plutôt que copier-coller des solutions

**Ce guide est alimenté au fur et à mesure** des cas rencontrés. Chaque section inclut des questions pour vous aider à réfléchir.

---

## Index

### Partie I — Découverte
1. [Vue d'ensemble et philosophie](#1-vue-densemble-et-philosophie)
2. [Démarrer l'application](#2-démarrer-lapplication)
3. [Architecture : comprendre les couches](#3-architecture--comprendre-les-couches)
4. [Le frontend React : composants et hooks](#4-le-frontend-react--composants-et-hooks)

### Partie II — Conception évolutive
5. [Pourquoi cette structure ?](#5-pourquoi-cette-structure-)
6. [Le flux des données](#6-le-flux-des-données)

### Partie III — Cas pratiques rencontrés
7. [Cas 1 : "Le site n'est pas accessible"](#7-cas-1--le-site-nest-pas-accessible)
8. [Cas 2 : Suppression et conditions de course](#8-cas-2--suppression-et-conditions-de-course)
9. [Cas 3 : Conjoints en double](#9-cas-3--conjoints-en-double)
10. [Cas 4 : Le clic sur le conjoint ne fonctionne pas](#10-cas-4--le-clic-sur-le-conjoint-ne-fonctionne-pas)
11. [Cas 5 : Validations côté serveur](#11-cas-5--validations-côté-serveur)
12. [Cas 6 : Page blanche au démarrage React](#12-cas-6--page-blanche-au-démarrage-react)
13. [Cas 7 : Boucle de restart dotnet watch](#13-cas-7--boucle-de-restart-dotnet-watch)
14. [Cas 8 : Schéma de base de données désynchronisé](#14-cas-8--schéma-de-base-de-données-désynchronisé)

### Partie IV — Référence rapide
15. [API et endpoints](#15-api-et-endpoints)
16. [Configuration](#16-configuration)
17. [Jeux de données de test](#17-jeux-de-données-de-test)

### Annexes
18. [Comment alimenter ce guide](#18-comment-alimenter-ce-guide)
19. [Quiz d'aide au raisonnement](#19-quiz-daide-au-raisonnement)

---

# Partie I — Découverte

## 1. Vue d'ensemble et philosophie

### Qu'est-ce que GegeDot ?

Une application web de **gestion d'arbres généalogiques** avec :
- Un **frontend** React 18 / TypeScript / Vite (interface utilisateur interactive)
- Un **backend** .NET 9 / C# (logique métier, API REST)
- Une **base de données** MySQL 8

### Qu'est-ce qu'on peut faire ?

- Créer et modifier des personnes (nom, dates, lieu, biographie, photo...)
- Définir des relations familiales (parent-enfant, conjoint, frère/sœur...)
- Visualiser l'arbre généalogique de manière interactive (zoom, déplacement)
- Explorer les données via une sidebar de navigation

### Question de réflexion

> **Avant de continuer** : Pourquoi séparer une application en "frontend" et "backend" ?

<details>
<summary>Piste de réponse</summary>

- **Évolutivité** : On peut changer le frontend (mobile, desktop, autre framework) sans toucher au backend
- **Sécurité** : La base de données n'est jamais exposée directement au navigateur
- **Répartition du travail** : Des équipes différentes peuvent travailler sur chaque partie
- **Technologies adaptées** : Chaque couche utilise les outils les plus adaptés

</details>

---

## 2. Démarrer l'application

### Prérequis

- Docker Desktop (MySQL + Backend)
- Node.js 20+ via nvm (Frontend)

### Commandes

```bash
# 1. Démarrer MySQL et le Backend
docker-compose up -d mysql backend
# Attendre ~30s que le backend compile (dotnet run)

# 2. Démarrer le Frontend (dans un autre terminal)
cd frontend
npm install      # première fois uniquement
npm run dev      # démarre Vite sur http://localhost:3000
```

### URLs

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:3000        |
| Backend    | http://localhost:5001        |
| Swagger UI | http://localhost:5001/swagger|
| MySQL      | localhost:3306               |
| phpMyAdmin | http://localhost:8080        |

### Pourquoi Vite et pas Python ?

L'ancien frontend utilisait `python3 -m http.server`. Avec la migration React, le frontend est compilé par **Vite** qui offre :
- **HMR** (Hot Module Replacement) : mise à jour instantanée sans reload
- **Proxy** : redirige `/api` → `http://localhost:5001` pour éviter les problèmes CORS en dev
- **TypeScript** : compilation et vérification des types à la volée

### Question de réflexion

> **Pourquoi** le frontend utilise-t-il un proxy Vite pour appeler l'API ?

<details>
<summary>Piste de réponse</summary>

En développement, le frontend tourne sur `localhost:3000` et l'API sur `localhost:5001`. Le navigateur bloquerait les requêtes cross-origin (CORS). Le proxy Vite fait croire au navigateur que l'API est sur le même port — les requêtes vers `/api/...` sont relayées vers `localhost:5001/api/...` côté serveur, sans passer par le navigateur.

</details>

---

## 3. Architecture : comprendre les couches

```
┌──────────────────────┐    HTTP/JSON     ┌─────────────────────┐    SQL/EF Core    ┌──────────┐
│  Frontend React      │ ◄─────────────► │  Backend .NET 9     │ ◄───────────────► │  MySQL   │
│  (Vite, port 3000)   │   /api proxy     │  (dotnet, port 5001)│                   │  (3306)  │
└──────────────────────┘                  └─────────────────────┘                   └──────────┘
```

### Structure des dossiers

```
gegeDot/
├── backend/src/
│   ├── GegeDot.API/            ← Contrôleurs HTTP, Program.cs
│   ├── GegeDot.Services/       ← Logique métier, DTOs, AutoMapper
│   ├── GegeDot.Infrastructure/ ← Repositories, DbContext (EF Core)
│   └── GegeDot.Core/           ← Entités, interfaces
├── frontend/
│   ├── src/
│   │   ├── App.tsx             ← Composant racine, état global
│   │   ├── components/         ← AppSidebar, FanCanvas, GenealogyCard...
│   │   ├── hooks/              ← useFamilyTree (logique de chargement)
│   │   ├── services/           ← api.ts (axios, appels HTTP)
│   │   ├── types/              ← Interfaces TypeScript
│   │   └── utils/              ← familyTreeLayout (algorithme de positionnement)
│   └── vite.config.ts          ← Config Vite + proxy API
├── scripts/
│   ├── got_seed.sql            ← Données Game of Thrones (26 personnages)
│   └── royal_family_seed.sql   ← Famille royale britannique (46 membres)
├── PLAN_AMELIORATION.md        ← Feuille de route phases 1-4
└── docker-compose.yml
```

### Question de réflexion

> **Pourquoi** le backend est-il découpé en 4 projets (API, Services, Infrastructure, Core) ?

<details>
<summary>Piste de réponse</summary>

**Clean Architecture** : chaque couche a une responsabilité unique et ne dépend que de la couche en dessous :
- `Core` ne dépend de rien (entités pures)
- `Services` dépend de `Core` (logique métier)
- `Infrastructure` dépend de `Core` (accès données)
- `API` dépend de `Services` et `Infrastructure` (point d'entrée HTTP)

Si on change de base de données (MySQL → PostgreSQL), on ne touche qu'à `Infrastructure`.

</details>

---

## 4. Le frontend React : composants et hooks

### Les composants principaux

| Composant | Rôle |
|-----------|------|
| `App.tsx` | Racine : état global, routing des données entre composants |
| `AppSidebar` | Navigation : liste des personnes, sélection, stats |
| `FanCanvas` | Canevas interactif : zoom, pan, affichage des cartes |
| `GenealogyCard` | Carte d'une personne (avatar, dates, genre) |
| `ConnectionLayer` | Lignes de connexion entre les cartes |
| `ErrorBoundary` | Capture les erreurs React et affiche un fallback |
| `PersonForm` | Formulaire création/modification d'une personne |

### Les hooks

| Hook | Rôle |
|------|------|
| `useFamilyTree` | Charge l'arbre via l'API, calcule le layout, gère le loading |

### L'algorithme de layout (`familyTreeLayout.ts`)

Quand une personne est sélectionnée, il faut positionner toutes les cartes sur le canevas :
- **Niveau 0** : la personne centrale
- **Niveau > 0** : les ancêtres (parents, grands-parents...)
- **Niveau -1** : les descendants (enfants)

L'algorithme calcule les coordonnées `(x, y)` de chaque carte en évitant les chevauchements (espacement minimum de 230px).

### Question de réflexion

> **Pourquoi** extraire `useFamilyTree` dans un hook plutôt que de mettre la logique dans `App.tsx` ?

<details>
<summary>Piste de réponse</summary>

**Séparation des responsabilités** : `App.tsx` gère l'orchestration (qui s'affiche, quel état). `useFamilyTree` encapsule le "comment" (appel API, calcul layout, gestion erreur/loading). On peut tester le hook indépendamment, et le réutiliser dans un autre composant sans dupliquer la logique.

</details>

---

# Partie II — Conception évolutive

## 5. Pourquoi cette structure ?

### Choix 1 : Relations réciproques (conjoints)

Quand A est conjoint de B, on crée **deux** relations en base :
- A → B (RelationshipType = Spouse)
- B → A (RelationshipType = Spouse)

**Pourquoi ?** Pour que les deux personnes "voient" l'autre comme conjoint sans requête complexe.

**Conséquence** : L'endpoint qui liste les conjoints doit **dédupliquer** (voir Cas 3).

### Choix 2 : DTOs typés pour chaque endpoint

L'API expose des DTOs (Data Transfer Objects), pas directement les entités :

```
Entité Person (base de données) → PersonDto (API)
Entité + famille → FamilyDataDto (endpoint /family)
```

**Pourquoi ?** Pour contrôler exactement quelles données sont exposées (sécurité, performance) et pouvoir faire évoluer le modèle sans casser l'API.

### Choix 3 : Port 5001 au lieu de 5000

Sur macOS, le port 5000 est utilisé par AirPlay Receiver. **Leçon** : Les conflits de ports sont courants — toujours vérifier avec `lsof -i :PORT`.

### Choix 4 : `dotnet run` au lieu de `dotnet watch run`

En développement conteneurisé, `dotnet watch` surveille les fichiers et redémarre automatiquement. Mais un bug de vulnérabilité dans AutoMapper (NU1903) faisait échouer le check hot-reload, déclenchant une boucle infinie de restarts. `dotnet run` est plus stable pour un environnement Dockerisé avec un volume monté.

---

## 6. Le flux des données

### Visualiser un arbre généalogique

1. **Utilisateur** sélectionne une personne dans la sidebar
2. **App.tsx** : `setSelectedPersonId(id)` → déclenche `useEffect`
3. **useFamilyTree** : appelle `apiService.getFamilyData(id)`
4. **Vite proxy** : redirige `/api/persons/{id}/family` → Backend :5001
5. **PersonsController** : récupère person + parents + enfants + frères/sœurs + conjoint
6. **Backend** : retourne un `FamilyDataDto` (JSON typé)
7. **familyTreeLayout** : calcule les positions `(x, y)` de chaque carte
8. **FanCanvas** : affiche les `GenealogyCard` et le `ConnectionLayer`

### Créer une personne

1. **Utilisateur** clique "Ajouter" → `PersonForm` s'ouvre
2. **Utilisateur** remplit le formulaire → validation côté client
3. **apiService.createPerson(data)** → `POST /api/persons`
4. **Backend** : valide → normalise → insère → retourne la nouvelle personne
5. **App.tsx** : `loadPersons()` pour actualiser la liste

### Question de réflexion

> **Où** doit-on valider les données : frontend, backend, ou les deux ?

<details>
<summary>Piste de réponse</summary>

**Les deux**, mais avec des rôles différents :
- **Frontend** : UX immédiate (message avant envoi), évite des requêtes inutiles
- **Backend** : **Sécurité absolue** — le frontend peut être contourné (Postman, DevTools). Jamais faire confiance au client.

</details>

---

# Partie III — Cas pratiques rencontrés

> Chaque cas suit le format : **Problème** → **Diagnostic** → **Solution** → **Leçon**

---

## 7. Cas 1 : "Le site n'est pas accessible"

### Problème

L'utilisateur lance les conteneurs Docker mais obtient une page d'erreur en ouvrant l'URL.

### Diagnostic

1. Les conteneurs Docker tournent (`docker ps`) ✅
2. Le backend répond sur 5001 ✅
3. **Mais** : Le frontend Vite n'est pas dans Docker — c'est un serveur de développement à lancer séparément

### Solution

```bash
cd frontend && npm run dev
```

### Leçon

**Ne pas confondre** "conteneurs démarrés" et "application complète accessible". Chaque service a son propre moyen de démarrage. En dev, le frontend tourne souvent en dehors de Docker pour bénéficier du HMR.

---

## 8. Cas 2 : Suppression et conditions de course

### Problème

Après suppression d'une personne :
- La modal reste ouverte avec des données fantômes
- La personne supprimée reste affichée un instant

### Diagnostic

**Conditions de course** (race conditions) :
1. L'utilisateur clique "Supprimer"
2. La requête DELETE part vers l'API
3. **En parallèle** : `loadPersons()` recharge la liste → déclenche des effets de bord
4. Des requêtes `fetch` en cours continuent après la suppression

### Solution

1. **AbortController** : Annuler les requêtes en cours lors de la suppression
2. **Ordre des opérations** : Fermer la modal → vider la vue → recharger

### Leçon

En **asynchrone**, l'ordre d'exécution n'est pas garanti. Il faut anticiper les opérations concurrentes et les annuler proprement.

### Quiz

> Pourquoi `AbortController` plutôt que simplement ignorer les erreurs dans le `catch` ?

<details>
<summary>Réponse</summary>

Ignorer les erreurs masque le symptôme mais les requêtes **continuent** (consommation réseau, callbacks qui s'exécutent). AbortController **annule activement** la requête — le navigateur la coupe, et `fetch` rejette avec `AbortError`.

</details>

---

## 9. Cas 3 : Conjoints en double

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

### Quiz

> Pourquoi utiliser un `HashSet` plutôt qu'un `List` pour `processedSpouseIds` ?

<details>
<summary>Réponse</summary>

`HashSet.Contains()` est **O(1)** en moyenne. `List.Contains()` est **O(n)**. Avec beaucoup de conjoints, le HashSet est plus performant.

</details>

---

## 10. Cas 4 : Le clic sur le conjoint ne fonctionne pas

### Problème

Dans la recherche de conjoints : on clique sur un résultat → il disparaît, aucun conjoint n'est ajouté.

### Diagnostic

**Propagation des événements** (event bubbling) :
1. Un gestionnaire global écoute les clics sur `document` pour fermer les résultats de recherche
2. Le clic sur un résultat **se propage** jusqu'à `document`
3. Le gestionnaire global ferme les résultats **avant** que le handler du résultat n'ait fini

### Solution

- `e.stopPropagation()` sur le clic du résultat
- Fermer explicitement les résultats avant d'ouvrir la modal

### Leçon

En JavaScript, les événements **remontent** (bubbling). Un clic sur un enfant déclenche aussi les handlers des parents. `stopPropagation()` interrompt cette remontée.

### Quiz

> Quelle est la différence entre `stopPropagation()` et `preventDefault()` ?

<details>
<summary>Réponse</summary>

- **stopPropagation()** : Empêche l'événement d'atteindre les parents (bubbling)
- **preventDefault()** : Empêche l'action par défaut du navigateur (ex: soumission de formulaire, suivi de lien)

</details>

---

## 11. Cas 5 : Validations côté serveur

### Problème

Audit révèle : création acceptée avec prénom ou nom vide.

### Diagnostic

Les attributs `[Required]` des DTOs ne rejettent pas toujours les chaînes vides ou composées uniquement d'espaces.

### Solution

**Validations manuelles** dans le contrôleur ou le service :

```csharp
if (string.IsNullOrWhiteSpace(createPersonDto.FirstName))
    ModelState.AddModelError("FirstName", "Le prénom est obligatoire");
```

Plus les validations de cohérence : date de décès > date de naissance, personne vivante sans date de décès.

### Leçon

**Ne jamais faire confiance au client.** Le frontend peut être contourné (Postman, curl, DevTools). Toute validation critique doit être côté serveur.

---

## 12. Cas 6 : Page blanche au démarrage React

### Problème

Après le lancement de `npm run dev`, l'application affiche une page entièrement blanche. Aucun message d'erreur visible.

### Diagnostic

Deux causes identifiées :

**Cause 1 — `process.env` n'existe pas dans le navigateur avec Vite**

Dans `api.ts`, la baseURL était configurée ainsi :
```ts
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
```

Vite n'expose pas `process.env` dans le navigateur (contrairement à Create React App). Au chargement du module, `process` est `undefined` → `ReferenceError` → le module `api.ts` échoue à s'initialiser → aucun composant ne peut se monter → page blanche.

**Cause 2 — Import default vs named export**

```ts
// Dans App.tsx : import named (incorrect)
import { AppSidebar } from './components/AppSidebar';

// Dans AppSidebar.tsx : export default
export default AppSidebar;
```

L'import named d'un export default donne `undefined`. React ne peut pas rendre `undefined` → erreur silencieuse → page blanche.

### Solution

**Pour `process.env`** : utiliser le proxy Vite directement
```ts
baseURL: '/api'  // Vite proxy redirige vers localhost:5001
```

**Pour les imports** : aligner import et export
```ts
import AppSidebar from './components/AppSidebar';  // default import
```

### Leçon

Avec Vite, les variables d'environnement utilisent `import.meta.env.VITE_*` et non `process.env.REACT_APP_*`. Une page blanche sans message d'erreur visible est souvent une erreur de **chargement de module** — vérifier la console navigateur et les imports/exports.

### Quiz

> Comment déboguer une page blanche React quand l'Error Boundary n'affiche rien non plus ?

<details>
<summary>Réponse</summary>

Si l'Error Boundary lui-même n'affiche rien, c'est que l'erreur est survenue **avant** le montage des composants (au niveau du module). Ouvrir la console navigateur (F12) → onglet Console → chercher une `ReferenceError` ou `SyntaxError`. L'onglet Network peut aussi révéler des modules qui n'ont pas chargé (status 404 ou 500).

</details>

---

## 13. Cas 7 : Boucle de restart dotnet watch

### Problème

Le backend Docker redémarre en boucle toutes les 10-20 secondes. Les logs montrent en cycle :
```
dotnet watch ⚠ msbuild: [Failure] Package 'AutoMapper' 12.0.1 has a known high severity vulnerability
dotnet watch Build succeeded
Now listening on: http://[::]:5000
dotnet watch ⚠ msbuild: [Failure] ...  ← même erreur, nouveau cycle
```

### Diagnostic

`dotnet watch run` utilise deux mécanismes :
1. **Build complet** : compile le projet → fonctionne
2. **Check hot-reload** : analyse msbuild avant d'appliquer des modifications à chaud → échoue car AutoMapper 12.0.1 a une vulnérabilité connue (NU1903) que msbuild traite comme une erreur

Quand le check hot-reload échoue, `dotnet watch` fait un redémarrage complet. Ce redémarrage modifie des fichiers dans `obj/`, ce qui déclenche un nouveau check hot-reload, qui échoue à nouveau → boucle infinie.

### Solution

**Étape 1** : Supprimer le warning dans les deux `.csproj`
```xml
<PropertyGroup>
  <NoWarn>NU1903</NoWarn>
  <NuGetAudit>false</NuGetAudit>
</PropertyGroup>
```

**Étape 2** : Remplacer `dotnet watch run` par `dotnet run` dans `docker-compose.yml`
```yaml
command: dotnet run --urls="http://+:5000"
```

### Leçon

`dotnet watch` est pratique en développement local, mais peut devenir instable dans un environnement Dockerisé avec des volumes montés. En environnement conteneurisé, `dotnet run` offre une exécution plus prévisible.

### Quiz

> Quelle est la différence entre `dotnet run` et `dotnet watch run` ?

<details>
<summary>Réponse</summary>

`dotnet run` compile et lance l'application une fois. `dotnet watch run` surveille les fichiers source et redémarre automatiquement à chaque modification. Utile en dev local, mais risqué en Docker si le volume monté contient des fichiers `obj/` qui changent lors du build.

</details>

---

## 14. Cas 8 : Schéma de base de données désynchronisé

### Problème

Après recréation des conteneurs Docker, l'API retourne `500 Internal Server Error` sur tous les endpoints. Les logs backend montrent :

```
MySqlConnector.MySqlException: Unknown column 'p.DeathStatus' in 'field list'
MySqlConnector.MySqlException: Unknown column 'p.MarriageDate' in 'field list'
```

### Diagnostic

Le schéma MySQL est initialisé par `scripts/init.sql` lors de la première création du conteneur. Des colonnes ont été ajoutées à l'entité `Person` (C#) après la création initiale du conteneur (`DeathStatus`, `Profession`, `MarriageDate`, `MarriagePlace`), mais le script `init.sql` n'a jamais été mis à jour. Quand le conteneur est recréé, la base repart de l'ancien schéma.

### Solution immédiate

Ajouter les colonnes manuellement :
```bash
docker exec -i gegeDot-mysql mysql -ugegedot -ppassword gegeDot -e "
ALTER TABLE Persons
  ADD COLUMN DeathStatus VARCHAR(50) NULL,
  ADD COLUMN Profession VARCHAR(100) NULL,
  ADD COLUMN MarriageDate DATE NULL,
  ADD COLUMN MarriagePlace VARCHAR(200) NULL;"
```

### Solution pérenne

Mettre à jour `scripts/init.sql` pour inclure toutes les colonnes dès la création. Idéalement, utiliser les **migrations EF Core** (`dotnet ef migrations add`) pour gérer l'évolution du schéma de façon traçable.

### Leçon

En développement, le schéma de base de données dérive souvent par rapport au code. Les migrations sont la façon professionnelle de gérer cette évolution : chaque changement de modèle produit un fichier de migration versionné, rejouable sur n'importe quel environnement.

### Quiz

> Quelle est la différence entre `dotnet ef database update` et modifier `init.sql` manuellement ?

<details>
<summary>Réponse</summary>

Les **migrations EF Core** sont versionnées, réversibles (`migrations remove`), et rejouables sur tous les environnements (dev, staging, prod). Modifier `init.sql` manuellement ne fonctionne que lors de la création initiale du conteneur — si la base existe déjà, le script n'est pas rejoué.

</details>

---

# Partie IV — Référence rapide

## 15. API et Endpoints

### Personnes

| Méthode | Endpoint | Description | Réponse |
|---------|----------|-------------|---------|
| GET | `/api/persons` | Liste de toutes les personnes | `PersonDto[]` |
| GET | `/api/persons/{id}` | Détail d'une personne | `PersonDto` |
| GET | `/api/persons/{id}/family` | Arbre familial complet | `FamilyDataDto` |
| GET | `/api/persons/{id}/parents` | Parents directs | `PersonDto[]` |
| GET | `/api/persons/{id}/children` | Enfants directs | `PersonDto[]` |
| GET | `/api/persons/{id}/siblings` | Frères et sœurs | `PersonDto[]` |
| GET | `/api/persons/{id}/spouses` | Conjoints | `PersonDto[]` |
| GET | `/api/persons?search=nom` | Recherche par nom | `PersonDto[]` |
| POST | `/api/persons` | Créer une personne | `PersonDto` |
| PUT | `/api/persons/{id}` | Modifier une personne | `204 No Content` |
| DELETE | `/api/persons/{id}` | Supprimer | `204 No Content` |

### Relations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/persons/{id}/spouses/{spouseId}` | Créer une relation de conjoint |

### Structure de FamilyDataDto

```json
{
  "person": { ... },
  "parents": [ ... ],
  "children": [ ... ],
  "siblings": [ ... ],
  "spouse": { ... },
  "grandparents": [ ... ],
  "grandchildren": [ ... ],
  "totalFamilyMembers": 8,
  "familyStats": {
    "totalMembers": 8,
    "parentsCount": 2,
    "childrenCount": 5,
    "siblingsCount": 3,
    "hasParents": true,
    "hasChildren": true,
    "hasSiblings": true,
    "hasSpouse": false
  }
}
```

**Base URL** : `http://localhost:5001/api`
**Documentation interactive** : http://localhost:5001/swagger

---

## 16. Configuration

### Variables importantes

| Paramètre | Valeur | Fichier |
|-----------|--------|---------|
| Port Frontend | 3000 | `vite.config.ts` |
| Port Backend | 5001 | `docker-compose.yml` |
| Port MySQL | 3306 | `docker-compose.yml` |
| URL API (frontend) | `/api` (proxy Vite) | `src/services/api.ts` |
| Cible proxy Vite | `http://localhost:5001` | `vite.config.ts` |

### Accès famille (lecture protégée)

Un **mot de passe partagé** peut être configuré côté API (`FamilyAccess`) pour exiger un cookie avant d’appeler les endpoints métier. Ce n’est pas le même mécanisme que le mot de passe « mode édition » du front (`VITE_EDIT_PASSWORD`). Détail : **[docs/architecture/FAMILY_ACCESS.md](docs/architecture/FAMILY_ACCESS.md)**.

### Commandes utiles

```bash
# Voir les logs du backend
docker logs gegeDot-backend -f

# Accéder à MySQL en ligne de commande
docker exec -it gegeDot-mysql mysql -ugegedot -ppassword gegeDot

# Recompiler le backend (après modification)
docker restart gegeDot-backend

# Vérifier les ports utilisés
lsof -i :3000
lsof -i :5001
```

---

## 17. Jeux de données de test

Deux jeux de données sont disponibles dans `scripts/` pour tester l'application.

### Game of Thrones (`scripts/got_seed.sql`)

**26 personnages**, **43 relations**, 3 maisons sur 3 générations :
- Maison Stark : Rickard → Eddard & Lyanna → Robb, Sansa, Arya, Bran, Rickon + Jon Snow
- Maison Lannister : Tywin → Cersei, Jaime, Tyrion → Joffrey, Myrcella, Tommen
- Maison Targaryen : Aerys → Rhaegar, Viserys, Daenerys + Khal Drogo

### Famille Royale Britannique (`scripts/royal_family_seed.sql`)

**46 membres**, **68 relations**, **8 générations** de George I (1660) à nos jours :
- George I → George II → Frederick → George III → Victoria → Edward VII → George V → Edward VIII/George VI → Elizabeth II → Charles III → William/Harry → George/Charlotte/Louis/Archie/Lilibet

### Comment charger les données

```bash
# Charger Game of Thrones
docker exec -i gegeDot-mysql mysql -ugegedot -ppassword gegeDot < scripts/got_seed.sql

# Charger la famille royale
docker exec -i gegeDot-mysql mysql -ugegedot -ppassword gegeDot < scripts/royal_family_seed.sql

# Vider toutes les données
docker exec -i gegeDot-mysql mysql -ugegedot -ppassword gegeDot -e "
  DELETE FROM Relationships; DELETE FROM Persons;"
```

---

# Annexes

## 18. Comment alimenter ce guide

Quand vous rencontrez un **nouveau cas** ou une **nouvelle décision**, ajoutez une section en suivant ce template :

```markdown
## Cas X : [Titre court du problème]

### Problème
[Description du symptôme observé]

### Diagnostic
[Comment vous avez identifié la cause — outils utilisés, raisonnement]

### Solution
[Ce qui a été fait pour corriger]

### Leçon
[Ce qu'un dev junior doit retenir — la règle générale derrière ce cas]

### Quiz
> [Question pour faire réfléchir]
<details><summary>Réponse</summary>...</details>
```

---

## 19. Quiz d'aide au raisonnement

### Q1. Architecture
> Pourquoi le frontend et le backend communiquent-ils en JSON et pas en HTML ?

<details>
<summary>Réponse</summary>

JSON est un format de **données** (agnostique de la présentation). Le frontend décide comment afficher. Si on envoyait du HTML, le backend imposerait la structure visuelle — moins flexible. Une même API peut alors servir un app web, mobile, et une CLI.

</details>

### Q2. Asynchrone
> Que se passe-t-il si deux `fetch()` partent en même temps pour la même ressource, et que la deuxième réponse arrive avant la première ?

<details>
<summary>Réponse</summary>

**Stale data** : L'UI afficherait les données de la deuxième requête, puis les écraserait avec celles de la première (plus ancienne). C'est pourquoi on utilise des AbortController pour annuler les requêtes précédentes.

</details>

### Q3. Base de données
> Pourquoi créer des relations réciproques (A→B et B→A) au lieu d'une seule relation avec un flag "sens" ?

<details>
<summary>Réponse</summary>

Les requêtes sont plus simples : "tous les conjoints de A" = `WHERE Person1Id=A OR Person2Id=A`. Mais cela implique une déduplication à l'affichage. C'est un compromis entre simplicité des requêtes et complexité du code applicatif.

</details>

### Q4. CORS
> Pourquoi le navigateur bloque-t-il les requêtes cross-origin par défaut ?

<details>
<summary>Réponse</summary>

**Sécurité** : Sans CORS, un site malveillant pourrait faire des requêtes vers votre banque (avec vos cookies) depuis une autre page. Le navigateur impose que le serveur autorise explicitement les origines. Le proxy Vite contourne cela en dev en faisant passer les requêtes côté serveur.

</details>

### Q5. TypeScript
> Quelle est la différence entre `export default` et `export const` en TypeScript/JavaScript ?

<details>
<summary>Réponse</summary>

- `export default Foo` : un seul export par fichier, importé sans accolades `import Foo from './file'`
- `export const Foo` : export nommé, importé avec accolades `import { Foo } from './file'`

Un fichier peut avoir les deux. Mélanger les styles (exporter en `default` mais importer avec `{ }`) donne `undefined` au runtime — source fréquente de pages blanches.

</details>

### Q6. Docker
> Pourquoi `docker restart` ne prend-il pas en compte un changement dans `docker-compose.yml` ?

<details>
<summary>Réponse</summary>

`docker restart` redémarre le conteneur **avec la configuration du moment où il a été créé**. Pour appliquer un changement de `docker-compose.yml`, il faut recréer le conteneur : `docker-compose up -d --force-recreate backend`. La configuration est figée à la création du conteneur.

</details>

---

*Guide évolutif — Dernière mise à jour : avril 2026 — Branche : `claude/react-migration`*
