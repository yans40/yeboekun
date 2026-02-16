# Instructions pour nettoyer et créer les Catherine de test

## Problème
Le shell semble corrompu, donc vous devez exécuter le script SQL manuellement.

## Solution

### Option 1 : Via Docker (recommandé)
Exécutez cette commande dans votre terminal :

```bash
docker exec -i gegeDot-mysql-1 mysql -u root -proot gegeDot < scripts/cleanup_and_add_catherine_test.sql
```

### Option 2 : Via phpMyAdmin
1. Ouvrez phpMyAdmin : http://localhost:8080
2. Sélectionnez la base de données `gegeDot`
3. Allez dans l'onglet "SQL"
4. Copiez-collez le contenu du fichier `scripts/cleanup_and_add_catherine_test.sql`
5. Cliquez sur "Exécuter"

### Option 3 : Via MySQL en ligne de commande
```bash
mysql -u root -proot gegeDot < scripts/cleanup_and_add_catherine_test.sql
```

## Ce que fait le script

1. **Supprime** toutes les Catherine existantes (Middleton et Windsor) et leurs relations
2. **Crée** une "Catherine Windsor" avec :
   - Date de naissance : 1982-01-09
   - Relation mariage avec William
3. **Crée** une "Catherine Middleton" avec :
   - **Même date de naissance** : 1982-01-09 (pour tester la détection de doublons)
   - Même lieu de naissance : Reading, Berkshire, England

## Test de détection de doublons

Après avoir exécuté le script :

1. Ouvrez l'application : http://localhost:3000/professional-fan-view.html
2. Trouvez "Catherine Middleton" dans la liste déroulante
3. Cliquez sur l'icône ✏️ pour modifier
4. Changez le nom de "Middleton" en "Windsor"
5. Cliquez sur "Mettre à jour"
6. **Le système devrait détecter** que "Catherine Windsor" existe déjà avec la même date de naissance et afficher un avertissement

## Vérification

Pour vérifier que les deux Catherine ont été créées :

```sql
SELECT Id, FirstName, LastName, BirthDate, BirthPlace
FROM Persons 
WHERE FirstName = 'Catherine' AND (LastName = 'Middleton' OR LastName = 'Windsor')
ORDER BY LastName;
```

Vous devriez voir :
- Une "Catherine Middleton" (ID X)
- Une "Catherine Windsor" (ID Y)
- Les deux avec la même date de naissance : 1982-01-09
