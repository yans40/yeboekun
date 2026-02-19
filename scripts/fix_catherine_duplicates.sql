-- ============================================
-- Corriger les doublons de Catherine
-- ============================================
-- Ce script :
-- 1. Supprime toutes les Catherine Windsor sauf la plus ancienne (ID le plus petit)
-- 2. Supprime toutes les Catherine Middleton sauf la plus ancienne (ID le plus petit)
-- 3. Vérifie qu'il n'y a qu'une seule de chaque
-- ============================================

USE gegeDot;

-- ============================================
-- ÉTAPE 1 : Identifier les doublons
-- ============================================

SELECT 'Catherine Windsor existantes:' AS info;
SELECT Id, FirstName, LastName, MiddleName, BirthDate, BirthPlace
FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Windsor'
ORDER BY Id;

SELECT 'Catherine Middleton existantes:' AS info;
SELECT Id, FirstName, LastName, MiddleName, BirthDate, BirthPlace
FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Middleton'
ORDER BY Id;

-- ============================================
-- ÉTAPE 2 : Trouver les IDs à garder (les plus anciens)
-- ============================================

SELECT @catherine_windsor_id := MIN(Id) FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Windsor';

SELECT @catherine_middleton_id := MIN(Id) FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Middleton';

-- ============================================
-- ÉTAPE 3 : Supprimer les relations des doublons à supprimer
-- ============================================

-- Supprimer les relations des Catherine Windsor en double
DELETE r FROM Relationships r
INNER JOIN Persons p ON (r.Person1Id = p.Id OR r.Person2Id = p.Id)
WHERE p.FirstName = 'Catherine' 
  AND p.LastName = 'Windsor' 
  AND p.Id != @catherine_windsor_id;

-- Supprimer les relations des Catherine Middleton en double
DELETE r FROM Relationships r
INNER JOIN Persons p ON (r.Person1Id = p.Id OR r.Person2Id = p.Id)
WHERE p.FirstName = 'Catherine' 
  AND p.LastName = 'Middleton' 
  AND p.Id != @catherine_middleton_id;

-- ============================================
-- ÉTAPE 4 : Supprimer les doublons
-- ============================================

-- Supprimer les Catherine Windsor en double (garder seulement la plus ancienne)
DELETE FROM Persons 
WHERE FirstName = 'Catherine' 
  AND LastName = 'Windsor' 
  AND Id != @catherine_windsor_id;

-- Supprimer les Catherine Middleton en double (garder seulement la plus ancienne)
DELETE FROM Persons 
WHERE FirstName = 'Catherine' 
  AND LastName = 'Middleton' 
  AND Id != @catherine_middleton_id;

SELECT 'Doublons supprimés' AS result;

-- ============================================
-- ÉTAPE 5 : Vérifier qu'il n'y a qu'une seule de chaque
-- ============================================

SELECT 'Vérification - Catherine Windsor:' AS info;
SELECT Id, FirstName, LastName, MiddleName, BirthDate, BirthPlace
FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Windsor';

SELECT 'Vérification - Catherine Middleton:' AS info;
SELECT Id, FirstName, LastName, MiddleName, BirthDate, BirthPlace
FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Middleton';

-- ============================================
-- ÉTAPE 6 : S'assurer qu'il y a bien une de chaque pour le test
-- ============================================

-- Si Catherine Windsor n'existe pas, la créer
INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
SELECT 'Catherine', 'Windsor', 'Princess of Wales', '1982-01-09', 'Reading, Berkshire, England', 'Female', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Persons 
    WHERE FirstName = 'Catherine' AND LastName = 'Windsor'
);

-- Si Catherine Middleton n'existe pas, la créer
INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
SELECT 'Catherine', 'Middleton', 'Princess of Wales', '1982-01-09', 'Reading, Berkshire, England', 'Female', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Persons 
    WHERE FirstName = 'Catherine' AND LastName = 'Middleton'
);

-- ============================================
-- ÉTAPE 7 : Rétablir la relation mariage avec William si nécessaire
-- ============================================

SELECT @william_id := Id FROM Persons 
WHERE FirstName = 'William' AND LastName = 'Windsor' AND MiddleName = 'Prince of Wales' 
LIMIT 1;

SELECT @catherine_windsor_id := Id FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Windsor' 
LIMIT 1;

-- Créer la relation mariage si elle n'existe pas
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, StartDate, CreatedAt)
SELECT @william_id, @catherine_windsor_id, 3, '2011-04-29', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE ((Person1Id = @william_id AND Person2Id = @catherine_windsor_id) OR 
           (Person1Id = @catherine_windsor_id AND Person2Id = @william_id)) 
    AND RelationshipType = 3
    AND EndDate IS NULL
) AND @william_id IS NOT NULL AND @catherine_windsor_id IS NOT NULL;

-- ============================================
-- ÉTAPE 8 : Résultat final
-- ============================================

SELECT 'Résultat final:' AS info;
SELECT 
    Id,
    FirstName,
    LastName,
    MiddleName,
    BirthDate,
    BirthPlace,
    CASE 
        WHEN LastName = 'Windsor' THEN 'Conjoint de William'
        WHEN LastName = 'Middleton' THEN 'Pour test de doublon'
    END AS Statut
FROM Persons 
WHERE FirstName = 'Catherine' AND (LastName = 'Middleton' OR LastName = 'Windsor')
ORDER BY LastName, Id;

SELECT 'Nettoyage terminé ! Il devrait y avoir exactement 1 Catherine Windsor et 1 Catherine Middleton' AS result;
