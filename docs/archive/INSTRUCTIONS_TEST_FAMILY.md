# Instructions pour créer la famille de test

Le shell semble avoir un problème. Voici comment exécuter le script manuellement :

## Option 1 : Via le terminal (recommandé)

Ouvrez un nouveau terminal et exécutez :

```bash
cd /Users/kassyimbadollou/Documents/gegeDot
docker exec -i gegeDot-mysql mysql -u root -ppassword gegeDot < scripts/add_test_family_large.sql
```

## Option 2 : Via phpMyAdmin

1. Ouvrez phpMyAdmin : http://localhost:8080
2. Sélectionnez la base de données `gegeDot`
3. Cliquez sur l'onglet "SQL"
4. Ouvrez le fichier `scripts/add_test_family_large.sql` et copiez tout son contenu
5. Collez-le dans la zone SQL de phpMyAdmin
6. Cliquez sur "Exécuter"

## Vérification

Après l'exécution, vérifiez que Jean TestFamille existe :

```bash
docker exec gegeDot-mysql mysql -u root -ppassword gegeDot -e "SELECT Id, FirstName, LastName FROM Persons WHERE FirstName = 'Jean' AND LastName = 'TestFamille';"
```

## Si le script échoue

Le script SQL peut avoir des erreurs. Vérifiez les erreurs dans phpMyAdmin ou dans le terminal.

Si vous voyez des erreurs, vous pouvez aussi créer juste Jean TestFamille manuellement :

```sql
USE gegeDot;

INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Jean', 'TestFamille', 'Le Patriarche', '1950-01-15', 'Paris, France', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();
```

Ensuite, rechargez la page de la vue éventail et cliquez sur "🔄 Recharger les personnes".
