# ✅ Correction : Doublons dans l'Affichage des Conjoints

## 🐛 Problème Identifié

Lors de l'affichage des conjoints, chaque conjoint apparaissait **deux fois** au lieu d'une seule fois.

### Cause

1. **Relations réciproques** : Pour chaque relation de conjoint, nous créons deux relations :
   - Relation A → B (Person1Id = A, Person2Id = B)
   - Relation B → A (Person1Id = B, Person2Id = A)

2. **Récupération des relations** : L'endpoint `/persons/{id}/spouses` récupère toutes les relations où la personne est soit Person1Id, soit Person2Id.

3. **Résultat** : Pour une personne A avec un conjoint B, on récupère :
   - La relation A → B
   - La relation B → A
   - Les deux pointent vers le même conjoint B, créant un doublon

## 🔧 Correction Appliquée

### Backend - Déduplication

**Fichier** : `backend/src/Yeboekun.API/Controllers/PersonsController.cs`

**Modification** : Ajout d'un `HashSet<int>` pour tracker les conjoints déjà traités.

**Code** :
```csharp
var spousesList = new List<object>();
var processedSpouseIds = new HashSet<int>(); // Pour éviter les doublons

foreach (var marriage in marriages)
{
    var spouseId = marriage.Person1Id == id 
        ? marriage.Person2Id 
        : marriage.Person1Id;

    // Ignorer si ce conjoint a déjà été traité
    if (processedSpouseIds.Contains(spouseId))
        continue;

    processedSpouseIds.Add(spouseId);
    // ... ajouter le conjoint à la liste
}
```

## 📋 Nettoyage de la Base de Données

Si vous avez déjà des doublons dans la base de données, vous pouvez utiliser le script SQL fourni :

**Fichier** : `scripts/nettoyer_doublons_conjoints.sql`

### Étapes

1. **Vérifier les doublons** :
   ```sql
   -- Exécuter la première requête SELECT pour voir les doublons
   ```

2. **Supprimer les doublons** (optionnel) :
   ```sql
   -- Décommenter et exécuter la requête DELETE
   -- Cette requête garde la relation avec l'ID le plus petit
   ```

3. **Vérifier qu'il n'y a plus de doublons** :
   ```sql
   -- Exécuter la dernière requête SELECT
   -- Elle ne doit retourner aucun résultat
   ```

## ✨ Résultat

### Avant
- ❌ 4 conjoints affichés (alors qu'il n'y en a que 2)
- ❌ Chaque conjoint apparaît deux fois

### Après
- ✅ 2 conjoints affichés correctement
- ✅ Chaque conjoint apparaît une seule fois
- ✅ Les relations réciproques sont toujours créées (pour la cohérence)
- ✅ Mais l'affichage déduplique automatiquement

## 🔄 Pourquoi Garder les Relations Réciproques ?

Les relations réciproques sont nécessaires pour :
- ✅ Que A voit B comme conjoint
- ✅ Que B voit A comme conjoint
- ✅ La cohérence des données

Mais l'affichage doit dédupliquer pour éviter les doublons visuels.

## 📝 Notes Techniques

- **Performance** : Le `HashSet` permet une vérification O(1) pour éviter les doublons
- **Ordre** : Les conjoints sont toujours triés par date de début (plus récent en premier)
- **Compatibilité** : Fonctionne avec les anciennes relations (non réciproques) et les nouvelles (réciproques)

---

**Date de correction** : $(date)
**Statut** : ✅ **CORRIGÉ**
