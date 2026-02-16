# ✅ Fonctionnalité : Affichage de Plusieurs Conjoints

## 🎯 Objectif

Permettre l'affichage de **tous les conjoints** d'une personne (actuels et passés) au lieu d'un seul conjoint actuel. Particulièrement utile pour des cas comme Jean-Baptiste Boangbrê qui a eu des enfants avec trois femmes différentes.

## 🔧 Modifications Apportées

### 1. Backend - Nouvel Endpoint

**Fichier** : `backend/src/GegeDot.API/Controllers/PersonsController.cs`

**Nouvel endpoint** : `GET /api/persons/{id}/spouses`

**Fonctionnalité** :
- Récupère **tous les conjoints** d'une personne (actuels et passés)
- Retourne pour chaque conjoint :
  - Les informations du conjoint (`spouse`)
  - La date de début du mariage (`marriageStartDate`)
  - La date de fin du mariage (`marriageEndDate`) si applicable
  - Un indicateur si c'est le conjoint actuel (`isCurrent`)
  - Les notes du mariage (`marriageNotes`)

**Code** :
```csharp
[HttpGet("{id}/spouses")]
public async Task<ActionResult<IEnumerable<object>>> GetAllSpouses(int id)
{
    // Récupère toutes les relations de type Spouse
    var marriages = relationships
        .Where(r => r.RelationshipType == RelationshipType.Spouse)
        .OrderByDescending(r => r.StartDate ?? DateTime.MinValue)
        .ToList();
    
    // Retourne tous les conjoints avec leurs informations de mariage
    // ...
}
```

### 2. Frontend - Affichage Multiple

**Fichier** : `frontend/professional-fan-view.html`

#### a) Badge avec Nombre de Conjoints

**Fonctionnalité** :
- Affiche un badge rose sur l'icône cœur avec le nombre de conjoints
- Le badge apparaît automatiquement au chargement de la carte
- Affiche "9+" si plus de 9 conjoints

**CSS** :
```css
.spouse-count-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #FF4081;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 10px;
    font-weight: bold;
    /* ... */
}
```

#### b) Affichage en Cercle

**Fonctionnalité** :
- Au clic sur le cœur, affiche **tous les conjoints** en cercle autour de la personne centrale
- Positionnement intelligent :
  - **1 conjoint** : à droite (0°)
  - **2 conjoints** : à droite et à gauche (0° et 180°)
  - **3+ conjoints** : répartis uniformément autour du cercle

**Algorithme de positionnement** :
```javascript
const radius = 250; // Rayon du cercle
const centerX = centralX + cardWidth / 2;
const centerY = centralY + cardHeight / 2;

// Calcul de l'angle pour chaque conjoint
if (totalSpouses === 1) {
    angle = 0; // À droite
} else if (totalSpouses === 2) {
    angle = index === 0 ? 0 : Math.PI; // Droite et gauche
} else {
    // Répartir uniformément autour du cercle
    angle = (index * 2 * Math.PI) / totalSpouses;
}

const spouseX = centerX + radius * Math.cos(angle) - cardWidth / 2;
const spouseY = centerY + radius * Math.sin(angle) - cardHeight / 2;
```

#### c) Indicateurs Visuels

**Fonctionnalité** :
- **Badge "Actuel"** : Le conjoint actuel (sans `EndDate`) affiche un badge vert "Actuel"
- **Dates de mariage** : Affichage des dates de début et fin de mariage sur chaque carte
- **Couleur de connexion** :
  - Rose vif (`#FF4081`) pour le conjoint actuel
  - Rose clair (`#E24A90`) pour les conjoints passés

#### d) Interaction

**Fonctionnalité** :
- Clic sur le cœur : Affiche/masque tous les conjoints
- Clic sur un conjoint : Charge la vue éventail de ce conjoint
- Tooltip : Affiche "Conjoint X/Y (Actuel)" au survol

## 📋 Utilisation

### Pour l'Utilisateur

1. **Voir le nombre de conjoints** :
   - Le badge sur le cœur indique le nombre de conjoints
   - Exemple : "3" signifie 3 conjoints

2. **Afficher tous les conjoints** :
   - Cliquer sur l'icône ❤️
   - Tous les conjoints apparaissent en cercle autour de la personne

3. **Voir un conjoint spécifique** :
   - Cliquer sur la carte du conjoint souhaité
   - La vue éventail de ce conjoint se charge

4. **Masquer les conjoints** :
   - Re-cliquer sur le cœur pour masquer tous les conjoints

### Pour le Développeur

**Endpoint à utiliser** :
```javascript
// Charger tous les conjoints
const response = await fetch(`${API_BASE_URL}/persons/${personId}/spouses`);
const spouses = await response.json();

// Structure de réponse :
[
  {
    spouse: { /* PersonDto */ },
    marriageStartDate: "2020-01-15",
    marriageEndDate: null, // null si actuel
    isCurrent: true,
    marriageNotes: "..."
  },
  // ...
]
```

## 🎨 Exemple Visuel

```
        [Conjoint 2]
            |
            |
    [Conjoint 1] --- [Personne Centrale] --- [Conjoint 3]
            |
            |
        [Conjoint 4]
```

## ✨ Avantages

1. **Visibilité complète** : Tous les conjoints sont visibles d'un coup d'œil
2. **Contexte historique** : Les dates de mariage permettent de comprendre la chronologie
3. **Navigation facile** : Clic direct sur un conjoint pour voir sa vue
4. **Indicateur visuel** : Le badge "Actuel" identifie rapidement le conjoint actuel
5. **Scalable** : Fonctionne avec 1, 2, 3 ou plus de conjoints

## 🔄 Compatibilité

- ✅ Compatible avec l'endpoint existant `/persons/{id}/spouse` (conjoint actuel uniquement)
- ✅ Les anciennes relations de type `Spouse` continuent de fonctionner
- ✅ Les dates `StartDate` et `EndDate` permettent de distinguer les mariages actuels et passés

## 📝 Notes Techniques

- Les conjoints sont triés par date de début de mariage (plus récent en premier)
- Le rayon du cercle est fixé à 250px (peut être ajusté si nécessaire)
- Les connexions sont des lignes droites vers la personne centrale
- Le système gère automatiquement le nettoyage des cartes lors du changement de vue

---

**Date d'implémentation** : $(date)
**Statut** : ✅ **IMPLÉMENTÉ ET TESTÉ**
