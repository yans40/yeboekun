-- ============================================
-- Script d'injection de données pour l'audit des formulaires
-- ============================================

USE gegeDot;

-- ============================================
-- 1. CRÉER DES PERSONNES DE TEST
-- ============================================

-- Personne 1 : Jean Dupont (pour tester la création)
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Jean', 'Dupont', '1980-01-15', 'Paris, France', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @jean_id := Id FROM Persons WHERE FirstName = 'Jean' AND LastName = 'Dupont' LIMIT 1;

-- Personne 2 : Marie Martin (pour tester les relations)
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Marie', 'Martin', '1985-03-20', 'Lyon, France', 'Female', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @marie_id := Id FROM Persons WHERE FirstName = 'Marie' AND LastName = 'Martin' LIMIT 1;

-- Personne 3 : Pierre Dupont (enfant de Jean)
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Pierre', 'Dupont', '2010-05-10', 'Paris, France', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @pierre_id := Id FROM Persons WHERE FirstName = 'Pierre' AND LastName = 'Dupont' LIMIT 1;

-- Personne 4 : Sophie Dupont (enfant de Jean)
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Sophie', 'Dupont', '2012-08-15', 'Paris, France', 'Female', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @sophie_id := Id FROM Persons WHERE FirstName = 'Sophie' AND LastName = 'Dupont' LIMIT 1;

-- Parents de Jean
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Paul', 'Dupont', '1950-01-01', 'Paris, France', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @paul_id := Id FROM Persons WHERE FirstName = 'Paul' AND LastName = 'Dupont' LIMIT 1;

INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Claire', 'Dupont', '1952-06-15', 'Paris, France', 'Female', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @claire_id := Id FROM Persons WHERE FirstName = 'Claire' AND LastName = 'Dupont' LIMIT 1;

-- ============================================
-- 2. CRÉER DES RELATIONS PARENT-ENFANT
-- ============================================

-- Paul et Claire sont parents de Jean
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @paul_id, @jean_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @paul_id AND Person2Id = @jean_id AND RelationshipType = 1
) AND @paul_id IS NOT NULL AND @jean_id IS NOT NULL;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @claire_id, @jean_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @claire_id AND Person2Id = @jean_id AND RelationshipType = 1
) AND @claire_id IS NOT NULL AND @jean_id IS NOT NULL;

-- Jean est parent de Pierre et Sophie
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @jean_id, @pierre_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @jean_id AND Person2Id = @pierre_id AND RelationshipType = 1
) AND @jean_id IS NOT NULL AND @pierre_id IS NOT NULL;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @jean_id, @sophie_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @jean_id AND Person2Id = @sophie_id AND RelationshipType = 1
) AND @jean_id IS NOT NULL AND @sophie_id IS NOT NULL;

-- ============================================
-- 3. CRÉER UNE RELATION CONJOINT (MARIAGE)
-- ============================================

-- Jean et Marie sont mariés (sans EndDate = mariage actuel)
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, StartDate, CreatedAt)
SELECT @jean_id, @marie_id, 3, '2010-06-15', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE ((Person1Id = @jean_id AND Person2Id = @marie_id) OR 
           (Person1Id = @marie_id AND Person2Id = @jean_id))
    AND RelationshipType = 3
    AND EndDate IS NULL
) AND @jean_id IS NOT NULL AND @marie_id IS NOT NULL;

-- ============================================
-- 4. CRÉER UNE PERSONNE AVEC DOUBLON POTENTIEL
-- ============================================

-- Personne similaire à Jean pour tester la détection de doublons
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Jean', 'Dupond', '1980-01-16', 'Paris, France', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

-- ============================================
-- 5. CRÉER DES CAS DE TEST SUPPLÉMENTAIRES
-- ============================================

-- Personne avec beaucoup d'enfants (pour tester les performances)
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Test', 'BeaucoupEnfants', '1970-01-01', 'Test City', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @test_parent_id := Id FROM Persons WHERE FirstName = 'Test' AND LastName = 'BeaucoupEnfants' LIMIT 1;

-- Créer 5 enfants pour ce parent
INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Enfant1', 'BeaucoupEnfants', '2000-01-01', 'Test City', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @child1_id := Id FROM Persons WHERE FirstName = 'Enfant1' AND LastName = 'BeaucoupEnfants' LIMIT 1;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @test_parent_id, @child1_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @test_parent_id AND Person2Id = @child1_id AND RelationshipType = 1
) AND @test_parent_id IS NOT NULL AND @child1_id IS NOT NULL;

INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Enfant2', 'BeaucoupEnfants', '2000-02-01', 'Test City', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @child2_id := Id FROM Persons WHERE FirstName = 'Enfant2' AND LastName = 'BeaucoupEnfants' LIMIT 1;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @test_parent_id, @child2_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @test_parent_id AND Person2Id = @child2_id AND RelationshipType = 1
) AND @test_parent_id IS NOT NULL AND @child2_id IS NOT NULL;

INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Enfant3', 'BeaucoupEnfants', '2000-03-01', 'Test City', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @child3_id := Id FROM Persons WHERE FirstName = 'Enfant3' AND LastName = 'BeaucoupEnfants' LIMIT 1;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @test_parent_id, @child3_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @test_parent_id AND Person2Id = @child3_id AND RelationshipType = 1
) AND @test_parent_id IS NOT NULL AND @child3_id IS NOT NULL;

INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Enfant4', 'BeaucoupEnfants', '2000-04-01', 'Test City', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @child4_id := Id FROM Persons WHERE FirstName = 'Enfant4' AND LastName = 'BeaucoupEnfants' LIMIT 1;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @test_parent_id, @child4_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @test_parent_id AND Person2Id = @child4_id AND RelationshipType = 1
) AND @test_parent_id IS NOT NULL AND @child4_id IS NOT NULL;

INSERT INTO Persons (FirstName, LastName, BirthDate, BirthPlace, Gender, IsAlive, CreatedAt, UpdatedAt)
VALUES ('Enfant5', 'BeaucoupEnfants', '2000-05-01', 'Test City', 'Male', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE UpdatedAt = NOW();

SELECT @child5_id := Id FROM Persons WHERE FirstName = 'Enfant5' AND LastName = 'BeaucoupEnfants' LIMIT 1;

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, CreatedAt)
SELECT @test_parent_id, @child5_id, 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Relationships 
    WHERE Person1Id = @test_parent_id AND Person2Id = @child5_id AND RelationshipType = 1
) AND @test_parent_id IS NOT NULL AND @child5_id IS NOT NULL;

-- ============================================
-- VÉRIFICATIONS
-- ============================================

SELECT '=== RÉSUMÉ DES DONNÉES INJECTÉES ===' AS Info;

SELECT 'Personnes créées:' AS Info, COUNT(*) AS Count FROM Persons 
WHERE FirstName IN ('Jean', 'Marie', 'Pierre', 'Sophie', 'Paul', 'Claire', 'Test', 'Enfant1', 'Enfant2', 'Enfant3', 'Enfant4', 'Enfant5');

SELECT 'Relations parent-enfant:' AS Info, COUNT(*) AS Count FROM Relationships 
WHERE RelationshipType = 1;

SELECT 'Relations conjoint:' AS Info, COUNT(*) AS Count FROM Relationships 
WHERE RelationshipType = 3;

SELECT '=== IDS POUR LES TESTS ===' AS Info;
SELECT Id, CONCAT(FirstName, ' ', LastName) AS Name, BirthDate FROM Persons 
WHERE FirstName IN ('Jean', 'Marie', 'Pierre', 'Sophie', 'Paul', 'Claire', 'Test')
ORDER BY Id;
