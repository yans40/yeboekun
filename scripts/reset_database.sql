-- Script de remise à zéro de la base de données GegeDot
-- À exécuter avant un déploiement en production pour repartir d'une base vide
--
-- Usage :
--   docker exec -i gegeDot-mysql mysql -u gegedot -p<MOT_DE_PASSE> gegeDot < scripts/reset_database.sql

USE gegeDot;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Relationships;
TRUNCATE TABLE Trees;
TRUNCATE TABLE Persons;

SET FOREIGN_KEY_CHECKS = 1;

SELECT CONCAT(
  'Reset OK — ',
  (SELECT COUNT(*) FROM Persons), ' personnes, ',
  (SELECT COUNT(*) FROM Relationships), ' relations'
) AS Status;
