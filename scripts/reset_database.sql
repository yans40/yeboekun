-- Script de remise à zéro de la base de données Yeboekun
-- À exécuter avant un déploiement en production pour repartir d'une base vide
--
-- Usage :
--   docker exec -i yeboekun-mysql mysql -u yeboekun -ppassword yeboekun < scripts/reset_database.sql

USE yeboekun;

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
