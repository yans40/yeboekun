-- ============================================
-- Nettoyer et ajouter Catherine pour test de détection de doublons
-- ============================================
-- Ce script :
-- 1. Supprime toutes les Catherine existantes (Middleton et Windsor)
-- 2. Crée une "Catherine Windsor" avec date de naissance 1982-01-09
-- 3. Crée une "Catherine Middleton" avec la même date de naissance pour tester
-- ============================================

USE gegeDot;

-- ============================================
-- ÉTAPE 1 : Supprimer toutes les Catherine existantes
-- ============================================

-- Supprimer les relations impliquant Catherine
DELETE r FROM Relationships r
INNER JOIN Persons p ON (r.Person1Id = p.Id OR r.Person2Id = p.Id)
WHERE p.FirstName = 'Catherine' AND (p.LastName = 'Middleton' OR p.LastName = 'Windsor');

-- Supprimer les Catherine
DELETE FROM Persons 
WHERE FirstName = 'Catherine' AND (LastName = 'Middleton' OR LastName = 'Windsor');

SELECT 'Catherine existantes supprimées' AS result;

-- ============================================
-- ÉTAPE 2 : Trouver William
-- ============================================

SELECT @william_id := Id FROM Persons 
WHERE FirstName = 'William' AND LastName = 'Windsor' AND MiddleName = 'Prince of Wales' 
LIMIT 1;

-- Si William n'existe pas, le créer
INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
SELECT 'William', 'Windsor', 'Prince of Wales', '1982-06-21', 'St Mary\'s Hospital, London', 'Male', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Persons 
    WHERE FirstName = 'William' AND LastName = 'Windsor' AND MiddleName = 'Prince of Wales'
);

SELECT @william_id := Id FROM Persons 
WHERE FirstName = 'William' AND LastName = 'Windsor' AND MiddleName = 'Prince of Wales' 
LIMIT 1;

-- ============================================
-- ÉTAPE 3 : Créer Catherine Windsor (version actuelle)
-- ============================================

INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Catherine', 'Windsor', 'Princess of Wales', '1982-01-09', 'Reading, Berkshire, England', 'Female', true, NOW(), NOW());

SELECT @catherine_windsor_id := Id FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Windsor' AND MiddleName = 'Princess of Wales' 
LIMIT 1;

-- Relation mariage avec William
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, StartDate, CreatedAt)
SELECT @william_id, @catherine_windsor_id, 3, '2011-04-29', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE ((Person1Id = @william_id AND Person2Id = @catherine_windsor_id) OR 
           (Person1Id = @catherine_windsor_id AND Person2Id = @william_id)) 
    AND RelationshipType = 3
    AND EndDate IS NULL
) AND @william_id IS NOT NULL AND @catherine_windsor_id IS NOT NULL;

SELECT 'Catherine Windsor créée' AS result;

-- ============================================
-- ÉTAPE 4 : Créer Catherine Middleton (pour test de doublon)
-- ============================================

INSERT INTO Persons (FirstName, LastName, MiddleName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Catherine', 'Middleton', 'Princess of Wales', '1982-01-09', 'Reading, Berkshire, England', 'Female', true, NOW(), NOW());

SELECT @catherine_middleton_id := Id FROM Persons 
WHERE FirstName = 'Catherine' AND LastName = 'Middleton' AND MiddleName = 'Princess of Wales' 
LIMIT 1;

SELECT 'Catherine Middleton créée (même date de naissance pour test)' AS result;

-- ============================================
-- ÉTAPE 5 : Vérification
-- ============================================

SELECT 
    Id,
    FirstName,
    LastName,
    MiddleName,
    BirthDate,
    BirthPlace
FROM Persons 
WHERE FirstName = 'Catherine' AND (LastName = 'Middleton' OR LastName = 'Windsor')
ORDER BY LastName, Id;

SELECT 'Test de doublons prêt !' AS result;
SELECT 'Vous pouvez maintenant modifier Catherine Middleton en Windsor pour tester la détection' AS instruction;
