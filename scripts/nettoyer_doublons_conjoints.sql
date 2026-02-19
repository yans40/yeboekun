-- Script pour nettoyer les doublons de relations de conjoint
-- Ce script identifie et supprime les relations en double causées par les relations réciproques

-- 1. Afficher les relations de conjoint en double
SELECT 
    r1.Id as Relation1_Id,
    r1.Person1Id as Person1,
    r1.Person2Id as Person2,
    r1.StartDate,
    r1.EndDate,
    r2.Id as Relation2_Id,
    r2.Person1Id as Person1_Inverse,
    r2.Person2Id as Person2_Inverse,
    r2.StartDate as StartDate_Inverse,
    r2.EndDate as EndDate_Inverse
FROM Relationships r1
INNER JOIN Relationships r2 
    ON r1.RelationshipType = r2.RelationshipType
    AND r1.RelationshipType = 3 -- Spouse
    AND r1.Person1Id = r2.Person2Id
    AND r1.Person2Id = r2.Person1Id
    AND r1.Id < r2.Id -- Pour éviter de traiter la même paire deux fois
ORDER BY r1.Person1Id, r1.Person2Id;

-- 2. Supprimer les doublons (garder la relation avec l'ID le plus petit)
-- ATTENTION : Exécutez d'abord la requête SELECT ci-dessus pour vérifier les doublons
-- Décommentez la ligne suivante pour supprimer les doublons :

/*
DELETE r2 FROM Relationships r1
INNER JOIN Relationships r2 
    ON r1.RelationshipType = r2.RelationshipType
    AND r1.RelationshipType = 3 -- Spouse
    AND r1.Person1Id = r2.Person2Id
    AND r1.Person2Id = r2.Person1Id
    AND r1.Id < r2.Id;
*/

-- 3. Vérifier qu'il n'y a plus de doublons
SELECT 
    Person1Id,
    Person2Id,
    COUNT(*) as Nombre
FROM Relationships
WHERE RelationshipType = 3 -- Spouse
GROUP BY Person1Id, Person2Id
HAVING COUNT(*) > 1;

-- Si cette requête retourne des résultats, il reste des doublons
