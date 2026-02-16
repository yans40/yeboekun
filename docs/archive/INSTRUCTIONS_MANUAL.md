# Instructions manuelles pour créer Jean TestFamille

Le shell semble avoir un problème. Voici comment procéder manuellement :

## Méthode 1 : Via phpMyAdmin (RECOMMANDÉ)

1. Ouvrez votre navigateur et allez sur : **http://localhost:8080**
2. Connectez-vous à phpMyAdmin (utilisateur: `root`, mot de passe: `password`)
3. Sélectionnez la base de données **`gegeDot`** dans le menu de gauche
4. Cliquez sur l'onglet **"SQL"** en haut
5. Copiez et collez ce code SQL :

```sql
USE gegeDot;

INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Jean', 'TestFamille', 'Le Patriarche', '1950-01-15', 'Paris, France', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();
```

6. Cliquez sur **"Exécuter"**
7. Vous devriez voir "1 ligne affectée"

## Méthode 2 : Via le terminal (nouveau terminal)

Ouvrez un **NOUVEAU** terminal (pas celui de Cursor) et exécutez :

```bash
cd /Users/kassyimbadollou/Documents/gegeDot
docker exec -i gegeDot-mysql mysql -u root -ppassword gegeDot < scripts/check_and_create_jean.sql
```

## Après l'insertion

1. Retournez sur la page de la vue éventail
2. Cliquez sur le bouton **"🔄 Recharger les personnes"**
3. Cherchez **"Jean TestFamille"** dans le menu déroulant

## Si ça ne fonctionne toujours pas

Vérifiez que le backend est bien en cours d'exécution et que l'API fonctionne. Vous pouvez tester avec :

```bash
curl http://localhost:5001/api/persons | grep -i "testfamille"
```
