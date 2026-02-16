# ✅ Fonctionnalité : Ajout de Conjoints

## 🎯 Objectif

Permettre d'ajouter des conjoints à une personne directement depuis le formulaire d'édition, avec la possibilité de spécifier les dates de mariage (début et fin) et des notes.

## 🔧 Modifications Apportées

### 1. Backend - Nouvel Endpoint

**Fichier** : `backend/src/GegeDot.API/Controllers/PersonsController.cs`

**Nouvel endpoint** : `POST /api/persons/{personId}/spouses/{spouseId}`

**Fonctionnalité** :
- Crée une relation de type `Spouse` entre deux personnes
- Accepte un DTO optionnel avec :
  - `StartDate` : Date de début du mariage
  - `EndDate` : Date de fin du mariage (null si actuel)
  - `Notes` : Notes sur le mariage

**Validations** :
- ✅ Vérifie que les deux personnes existent
- ✅ Empêche une personne d'être son propre conjoint
- ✅ Vérifie qu'une relation n'existe pas déjà (dans les deux sens)
- ✅ Retourne une erreur 409 (Conflict) si la relation existe déjà

**Code** :
```csharp
[HttpPost("{personId}/spouses/{spouseId}")]
public async Task<IActionResult> CreateSpouseRelationship(
    int personId, 
    int spouseId, 
    [FromBody] CreateSpouseRelationshipDto? dto = null)
{
    // Création de la relation avec dates et notes
    var relationship = new Relationship
    {
        Person1Id = personId,
        Person2Id = spouseId,
        RelationshipType = RelationshipType.Spouse,
        StartDate = dto?.StartDate,
        EndDate = dto?.EndDate,
        Notes = dto?.Notes,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };
    // ...
}
```

### 2. DTO - Nouveau DTO

**Fichier** : `backend/src/GegeDot.Services/DTOs/RelationshipDto.cs`

**Nouveau DTO** : `CreateSpouseRelationshipDto`

```csharp
public class CreateSpouseRelationshipDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Notes { get; set; }
}
```

### 3. Frontend - Interface Utilisateur

**Fichier** : `frontend/professional-fan-view.html`

#### a) Section "Conjoints" dans le Formulaire

**Emplacement** : Après la section "Enfants", avant les boutons d'action

**Fonctionnalités** :
- Champ de recherche pour trouver un conjoint
- Liste des conjoints ajoutés avec leurs informations
- Affichage des dates de mariage et notes

#### b) Modal d'Ajout de Conjoint

**Fonctionnalités** :
- Sélection d'un conjoint depuis la recherche
- Saisie de la date de début du mariage (obligatoire)
- Saisie de la date de fin du mariage (optionnelle - laisser vide si actuel)
- Saisie de notes (optionnelle)

#### c) Affichage des Conjoints

**Fonctionnalités** :
- Liste des conjoints avec :
  - Nom complet
  - Badge "Actuel" si le mariage est toujours actif
  - Date de début du mariage
  - Date de fin du mariage (ou "Actuel")
  - Notes si disponibles
- Bouton de suppression pour chaque conjoint

#### d) Création des Relations

**Fonctionnalités** :
- Création automatique des relations lors de la soumission du formulaire
- Fonctionne en mode création ET édition
- Gestion des erreurs avec messages appropriés

## 📋 Utilisation

### Pour l'Utilisateur

1. **Ouvrir le formulaire d'édition** :
   - Cliquer sur le bouton ✏️ sur la carte d'une personne
   - Ou créer une nouvelle personne

2. **Ajouter un conjoint** :
   - Aller à la section "❤️ Conjoints"
   - Taper le nom du conjoint dans le champ de recherche
   - Sélectionner le conjoint dans les résultats
   - Remplir le formulaire :
     - Date de début du mariage (obligatoire)
     - Date de fin du mariage (optionnel - laisser vide si actuel)
     - Notes (optionnel)
   - Cliquer sur "Ajouter"

3. **Voir les conjoints ajoutés** :
   - La liste des conjoints s'affiche avec leurs informations
   - Le badge "Actuel" apparaît si le mariage est toujours actif

4. **Supprimer un conjoint** :
   - Cliquer sur le bouton ✕ à côté du conjoint

5. **Enregistrer** :
   - Cliquer sur "Enregistrer" ou "Mettre à jour"
   - Les relations de conjoint seront créées automatiquement

### Exemple : Jean-Baptiste Boangbrê

1. Ouvrir le formulaire d'édition de Jean-Baptiste
2. Ajouter le premier conjoint :
   - Rechercher "Marie Dupont"
   - Date de début : 1850-01-15
   - Date de fin : 1870-05-20
   - Notes : "Mariage à Paris"
3. Ajouter le deuxième conjoint :
   - Rechercher "Jeanne Martin"
   - Date de début : 1871-06-10
   - Date de fin : 1890-12-25
   - Notes : "Mariage à Lyon"
4. Ajouter le troisième conjoint :
   - Rechercher "Sophie Bernard"
   - Date de début : 1891-03-01
   - Date de fin : (laisser vide - actuel)
   - Notes : "Mariage actuel"
5. Enregistrer

## 🎨 Interface Utilisateur

### Section Conjoints dans le Formulaire

```
❤️ Conjoints
[Rechercher un conjoint...] ✕

┌─────────────────────────────────────────┐
│ Marie Dupont (Actuel)              ✕   │
│ 📅 Début: 15 janv. 1850                 │
│ 📅 Fin: Actuel                          │
│ 📝 Mariage à Paris                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Jeanne Martin                        ✕   │
│ 📅 Début: 10 juin 1871                  │
│ 📅 Fin: 25 déc. 1890                     │
└─────────────────────────────────────────┘
```

### Modal d'Ajout

```
💍 Ajouter un conjoint
─────────────────────────
Conjoint : Marie Dupont

Date de début du mariage
[2024-01-15]

Date de fin du mariage (optionnel)
[                ]
Laissez vide si le mariage est toujours actif

Notes (optionnel)
[                ]

[Annuler]  [Ajouter]
```

## ✨ Avantages

1. **Simplicité** : Ajout direct depuis le formulaire d'édition
2. **Flexibilité** : Gestion des mariages passés et actuels
3. **Informations complètes** : Dates et notes pour chaque mariage
4. **Visualisation** : Badge "Actuel" pour identifier le conjoint actuel
5. **Création et édition** : Fonctionne dans les deux modes

## 🔄 Intégration avec l'Affichage

Les conjoints ajoutés via le formulaire seront automatiquement visibles :
- Dans la vue éventail (clic sur le cœur ❤️)
- Avec le badge indiquant le nombre de conjoints
- En cercle autour de la personne centrale
- Avec les dates de mariage affichées

## 📝 Notes Techniques

- Les relations sont créées **après** la création/mise à jour de la personne
- Les erreurs sont gérées individuellement pour chaque conjoint
- Les relations existantes sont détectées et empêchées (erreur 409)
- Le système vérifie les relations dans les deux sens (Person1→Person2 et Person2→Person1)

---

**Date d'implémentation** : $(date)
**Statut** : ✅ **IMPLÉMENTÉ ET TESTÉ**
