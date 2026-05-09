# Accès famille (mot de passe partagé)

> Garde-fou **côté API** : un mot de passe unique, communiqué hors ligne aux proches. Après saisie, le navigateur reçoit un **cookie HttpOnly** signé ; les requêtes `GET/POST/...` sous `/api/*` (sauf routes publiques ci-dessous) exigent ce cookie.

**Périmètre** : protection de la **lecture** des données (et de toute l’API métier). Ce n’est **pas** de l’authentification nominative (pas de compte par personne).

**Code** : `FamilyAccessMiddleware`, `AccessController`, `FamilyAccessOptions`, écran `FamilyAccessScreen`, service `familyAccess.ts`.

---

## Activation

Le garde-fou est **actif** lorsque :

- `FamilyAccess:Disabled` est `false` (ou absent), **et**
- `FamilyAccess:Password` est une chaîne **non vide**.

Variables d’environnement ASP.NET Core (double underscore) :

| Variable | Rôle |
|----------|------|
| `FamilyAccess__Password` | Mot de passe partagé (obligatoire si le garde-fou est actif). |
| `FamilyAccess__Disabled` | `true` = aucune vérification (CI, dev docker par défaut). |

Fichier **`appsettings.json`** : section `FamilyAccess` + `Cors:Origins` (origines du front autorisées pour les cookies).

Fichier **`appsettings.Development.json`** : **gitignore** dans ce dépôt — chaque dev peut y mettre `Disabled: false` et un mot de passe de test pour voir l’écran localement.

---

## Endpoints publics (sans cookie)

| Méthode | Chemin | Rôle |
|---------|--------|------|
| `GET` | `/api/access/status` | `{ gateEnabled, accessGranted }` — utilisé au boot du front. |
| `POST` | `/api/access/verify` | Corps `{ "password": "..." }` — pose le cookie si le mot de passe est correct. |
| `POST` | `/api/access/logout` | Supprime le cookie (menu avatar : « Quitter l’accès famille »). |

Tout le reste de `/api/*` renvoie **401** avec corps `{"error":"family_access_required"}` si le garde-fou est actif et que le cookie est absent ou invalide.

Les routes **hors** `/api` sur le host API (ex. Swagger en dev) ne passent pas par ce middleware.

---

## Frontend

- Au chargement : `GET /api/access/status` avec `credentials`.
- Si `gateEnabled && !accessGranted` : écran `FamilyAccessScreen` — **seuil minimal** (wordmark, tagline, headline, champ, bouton ; aide optionnelle en lien discret + dialog). Pas de « mur » de texte : le narratif post-seuil → Lot 6 / `docs/ideas/IDEA_ANCRAGE_UTILISATEUR.md`.
- Sinon : routeur habituel (`/`, vues, etc.).
- **Sans API joignable** (ex. `vite preview` seul) : le front affiche l’app ; la protection réelle reste **serveur**.

`axios.defaults.withCredentials = true` (voir `index.tsx`) ; CORS backend en **`AllowCredentials`** + origines explicites (plus de `AllowAnyOrigin`).

---

## Docker / CI

Dans `docker-compose.yml`, le service backend définit en général `FamilyAccess__Disabled=true` pour que les scripts `curl` sur `/api/persons` continuent de fonctionner sans cookie.

---

## Distinction : `VITE_EDIT_PASSWORD`

| Mécanisme | Rôle | Où ça s’applique |
|-----------|------|------------------|
| **Family access** | Ouvrir l’app et lire les données via l’API | Backend + cookie |
| **`VITE_EDIT_PASSWORD`** | Débloquer le « mode édition » dans l’UI | Front uniquement (secret dans le bundle — voir `README`) |

Les deux peuvent coexister : accès famille pour voir l’arbre, mot de passe d’édition séparé pour les modifications (tant que l’API n’impose pas d’autre contrôle sur les écritures).

---

## Production

1. Définir `FamilyAccess__Password` (valeur forte, partagée uniquement par un canal sûr).
2. `FamilyAccess__Disabled=false`.
3. Renseigner `Cors__Origins` avec l’**URL exacte** du front (HTTPS), ex. `https://arbre.example.com` (séparer plusieurs origines par des virgules dans la chaîne de config si besoin — voir `Program.cs`).

**Limite** : toute personne qui connaît le mot de passe a le même accès ; en cas de fuite, changer le secret et redistribuer.
