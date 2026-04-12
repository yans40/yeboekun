-- ═══════════════════════════════════════════════════════════════════════════
-- JEU DE DONNÉES : FAMILLE ROYALE BRITANNIQUE
-- De George I (1660) à la génération actuelle
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── GÉNÉRATION 1 : Maison de Hanovre (racines) ─────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('George',  'I de Hanovre',     '1660-05-28', '1727-06-11', 'Osnabrück, Allemagne',   'Osnabrück, Allemagne',   'Male',   0, 'Roi de Grande-Bretagne',  'Premier roi de la maison de Hanovre. Monta sur le trône en 1714. Ne parlait pas anglais.'),
('Sophia',  'Dorothea de Celle','1666-09-15', '1726-11-13', 'Celle, Allemagne',        'Ahlden, Allemagne',      'Female', 0, 'Électrice de Hanovre',   'Épouse de George I, emprisonnée à vie au château d\'Ahlden après un scandale.');

-- ─── GÉNÉRATION 2 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('George',  'II de Grande-Bretagne','1683-10-30','1760-10-25','Hanovre, Allemagne', 'Londres, Angleterre',    'Male',   0, 'Roi de Grande-Bretagne', 'Dernier roi britannique à mener personnellement ses troupes au combat (Dettingen, 1743).'),
('Caroline','d\'Ansbach',            '1683-03-01','1737-11-20','Ansbach, Allemagne', 'Londres, Angleterre',    'Female', 0, 'Reine consort',          'Épouse influente de George II, assurant souvent la régence. Femme politique habile.');

-- ─── GÉNÉRATION 3 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Frederick','Prince de Galles',  '1707-02-01','1751-03-31','Hanovre, Allemagne', 'Londres, Angleterre',    'Male',   0, 'Prince de Galles',       'Fils de George II, mort avant son père. N\'a jamais régné. Père de George III.'),
('Augusta', 'de Saxe-Gotha',      '1719-11-30','1772-02-08','Gotha, Allemagne',    'Londres, Angleterre',    'Female', 0, 'Princesse de Galles',    'Mère de George III. Influença profondément l\'éducation de son fils.');

-- ─── GÉNÉRATION 4 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('George',    'III de Grande-Bretagne','1738-06-04','1820-01-29','Londres, Angleterre',       'Windsor, Angleterre',    'Male',   0, 'Roi de Grande-Bretagne', 'Régna 60 ans. Perdit les colonies américaines. Devint fou à la fin de sa vie.'),
('Charlotte', 'de Mecklembourg-Strelitz','1744-05-19','1818-11-17','Mirow, Allemagne',      'Kew, Angleterre',        'Female', 0, 'Reine consort',          'Épouse de George III. Eut 15 enfants. Passionnée de musique et de botanique.'),
('George',    'IV de Grande-Bretagne',  '1762-08-12','1830-06-26','Londres, Angleterre',    'Windsor, Angleterre',    'Male',   0, 'Roi de Grande-Bretagne', 'Connu pour son extravagance et ses dépenses royales. Régna 1820-1830.'),
('Caroline',  'de Brunswick',           '1768-05-17','1821-08-07','Brunswick, Allemagne',   'Londres, Angleterre',    'Female', 0, 'Reine consort',          'Épouse malheureuse de George IV. Union catastrophique dès la première rencontre.'),
('William',   'IV de Grande-Bretagne',  '1765-08-21','1837-06-20','Londres, Angleterre',    'Windsor, Angleterre',    'Male',   0, 'Roi de Grande-Bretagne', 'Le Roi Matelot. Monta sur le trône à 64 ans. Régna 1830-1837.');

-- ─── GÉNÉRATION 5 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Edward',   'duc de Kent',               '1767-11-02','1820-01-23','Buckingham Palace, Londres','Sidmouth, Angleterre', 'Male',   0, 'Duc de Kent',            'Père de la reine Victoria. Mort d\'une pneumonie quand Victoria avait 8 mois.'),
('Victoria', 'de Saxe-Cobourg-Saalfeld', '1786-08-17','1861-03-16','Cobourg, Allemagne',         'Frogmore, Angleterre', 'Female', 0, 'Duchesse de Kent',       'Mère de la reine Victoria. Exerça une influence considérable sur l\'éducation de sa fille.');

-- ─── GÉNÉRATION 6 : Reine Victoria ──────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Victoria', 'de Grande-Bretagne',        '1819-05-24','1901-01-22','Kensington Palace, Londres','Osborne House, Île de Wight','Female',0,'Reine de Grande-Bretagne','Régna 63 ans. La grand-mère de l\'Europe. Son règne couvrit l\'apogée de l\'Empire britannique.'),
('Albert',   'de Saxe-Cobourg et Gotha', '1819-08-26','1861-12-14','Cobourg, Allemagne',         'Windsor, Angleterre',       'Male',  0,'Prince consort',         'Époux dévoué de Victoria. Mort à 42 ans de fièvre typhoïde. Victoria porta le deuil 40 ans.');

-- ─── GÉNÉRATION 7 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Edward',   'VII de Grande-Bretagne', '1841-11-09','1910-05-06','Buckingham Palace, Londres','Buckingham Palace, Londres','Male',  0,'Roi de Grande-Bretagne','Le Peacemaker. Régna 1901-1910. Connu pour son influence diplomatique en Europe.'),
('Alexandra','de Danemark',           '1844-12-01','1925-11-20','Copenhague, Danemark',       'Sandringham, Angleterre',   'Female',0,'Reine consort',         'Épouse d\'Edward VII. Fille du roi Christian IX de Danemark. Icône de style de son époque.');

-- ─── GÉNÉRATION 8 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('George',  'V de Grande-Bretagne', '1865-06-03','1936-01-20','Londres, Angleterre',     'Sandringham, Angleterre','Male',  0,'Roi de Grande-Bretagne','Régna pendant la Première Guerre mondiale. Renomma la maison royale Windsor en 1917.'),
('Mary',    'de Teck',              '1867-05-26','1953-03-24','Kensington Palace, Londres','Marlborough House, Londres','Female',0,'Reine consort',        'Épouse de George V. Grand-mère de la reine Elizabeth II. Connue pour sa collection de bijoux.');

-- ─── GÉNÉRATION 9 ────────────────────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Edward',   'VIII de Grande-Bretagne','1894-06-23','1972-05-28','Richmond, Angleterre',    'Paris, France',           'Male',  0,'Roi de Grande-Bretagne','Abdiqua en 1936 pour épouser Wallis Simpson, divorcée américaine. Devint duc de Windsor.'),
('Wallis',   'Simpson',                '1896-06-19','1986-04-24','Blue Ridge Summit, USA',  'Paris, France',           'Female',0,'Duchesse de Windsor',   'Américaine divorcée deux fois pour qui Edward VIII abdiqua. Figura controversée.'),
('George',   'VI de Grande-Bretagne', '1895-12-14','1952-02-06','Sandringham, Angleterre', 'Sandringham, Angleterre', 'Male',  0,'Roi de Grande-Bretagne','Régna pendant la Seconde Guerre mondiale. Reste à Londres pendant le Blitz. Père d\'Elizabeth II.'),
('Elizabeth','Bowes-Lyon',            '1900-08-04','2002-03-30','Londres, Angleterre',      'Windsor, Angleterre',     'Female',0,'Reine consort',         'La Reine Mère. Épouse de George VI. Refusa d\'abandonner Londres pendant le Blitz. Vécut 101 ans.'),
('Margaret', 'de Grande-Bretagne',   '1930-08-21','2002-02-09','Glamis Castle, Écosse',   'Londres, Angleterre',     'Female',0,'Princesse',             'Sœur cadette d\'Elizabeth II. Connue pour sa vie mondaine et son amour de la musique.'),
('Antony',   'Armstrong-Jones',       '1930-03-07','2017-01-13','Leeds, Angleterre',        'Londres, Angleterre',     'Male',  0,'Lord Snowdon',          'Photographe renommé. Premier mari de la princesse Margaret. Divorcèrent en 1978.');

-- ─── GÉNÉRATION 10 : Elizabeth II ────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Elizabeth','II de Grande-Bretagne','1926-04-21','2022-09-08','Mayfair, Londres',         'Balmoral, Écosse',        'Female',0,'Reine de Grande-Bretagne','Régna 70 ans, le plus long règne de l\'histoire britannique. Symbole de stabilité et de devoir.'),
('Philip',   'duc d\'Édimbourg',     '1921-06-10','2021-04-09','Corfou, Grèce',            'Windsor, Angleterre',     'Male',  0,'Prince consort',         'Époux d\'Elizabeth II pendant 73 ans. Né prince de Grèce et de Danemark. Renonça à ses titres pour l\'épouser.');

-- ─── GÉNÉRATION 11 : Charles III et ses frères ───────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Charles',  'III de Grande-Bretagne','1948-11-14', NULL, 'Buckingham Palace, Londres','',              'Male',  1,'Roi de Grande-Bretagne','Régna à partir de 2022. Le plus vieux prince héritier de l\'histoire britannique avant son accession.'),
('Diana',    'Spencer',               '1961-07-01','1997-08-31','Sandringham, Angleterre','Paris, France', 'Female',0,'Princesse de Galles',   'La Princesse du Peuple. Premier mariage de Charles III. Morte dans un accident de voiture à Paris.'),
('Camilla',  'Parker Bowles',         '1947-07-17', NULL, 'Londres, Angleterre',      '',              'Female',1,'Reine consort',         'Deuxième épouse de Charles III depuis 2005. Devenue Reine consort en 2022.'),
('Anne',     'princesse royale',      '1950-08-15', NULL, 'Clarence House, Londres',  '',              'Female',1,'Princesse royale',      'Cavalière olympique. Princesse la plus travailleuse de la famille royale selon les sondages.'),
('Mark',     'Phillips',              '1948-09-22', NULL, 'Tetbury, Angleterre',       '',              'Male',  1,'Officier de l\'armée',  'Premier mari de la princesse Anne (1973-1992). Cavalier olympique lui aussi.'),
('Timothy',  'Laurence',              '1955-03-01', NULL, 'Lewisham, Angleterre',      '',              'Male',  1,'Vice-amiral',           'Deuxième mari de la princesse Anne depuis 1992.'),
('Andrew',   'duc d\'York',           '1960-02-19', NULL, 'Buckingham Palace, Londres','',             'Male',  1,'Duc d\'York',           'Deuxième fils d\'Elizabeth II. Pilote d\'hélicoptère pendant la guerre des Malouines.'),
('Sarah',    'Ferguson',              '1959-10-15', NULL, 'Londres, Angleterre',       '',              'Female',1,'Duchesse d\'York',      'Épouse d\'Andrew (div. 1996). Auteure et femme d\'affaires surnommée Fergie.'),
('Edward',   'duc d\'Édimbourg',      '1964-03-10', NULL, 'Buckingham Palace, Londres','',             'Male',  1,'Duc d\'Édimbourg',      'Plus jeune fils d\'Elizabeth II. Travaille dans la communication et soutient l\'oeuvre de son père.'),
('Sophie',   'Rhys-Jones',            '1965-01-20', NULL, 'Oxford, Angleterre',        '',              'Female',1,'Duchesse d\'Édimbourg', 'Épouse d\'Edward depuis 1999. Très appréciée au sein de la famille royale pour son discrétion.');

-- ─── GÉNÉRATION 12 : William et Harry ───────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('William',  'prince de Galles',       '1982-06-21', NULL, 'Paddington, Londres',       '', 'Male',  1, 'Prince de Galles',      'Héritier du trône britannique. Officier militaire, pilote de secours en mer. Fils aîné de Charles III.'),
('Catherine','Middleton',              '1982-01-09', NULL, 'Reading, Angleterre',        '', 'Female',1, 'Princesse de Galles',   'Épouse de William depuis 2011. Connue pour son élégance et son travail sur la santé mentale des enfants.'),
('Harry',    'duc de Sussex',          '1984-09-15', NULL, 'Paddington, Londres',        '', 'Male',  1, 'Duc de Sussex',         'Fils cadet de Charles et Diana. Quitta la famille royale en 2020 avec Meghan pour s\'installer en Californie.'),
('Meghan',   'Markle',                 '1981-08-04', NULL, 'Los Angeles, Californie, USA','','Female',1, 'Duchesse de Sussex',    'Actrice américaine devenue duchesse. Épouse de Harry depuis 2018. Première membre métisse de la famille royale.');

-- ─── GÉNÉRATION 13 : les enfants ─────────────────────────────────────────
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('George',    'de Galles',              '2013-07-22', NULL, 'Paddington, Londres', '', 'Male',  1, 'Prince',            'Troisième en ligne de succession au trône. Fils aîné de William et Catherine.'),
('Charlotte', 'de Galles',             '2015-05-02', NULL, 'Paddington, Londres', '', 'Female',1, 'Princesse',         'Quatrième en ligne de succession. Fille de William et Catherine.'),
('Louis',     'de Galles',             '2018-04-23', NULL, 'Paddington, Londres', '', 'Male',  1, 'Prince',            'Cinquième en ligne de succession. Fils cadet de William et Catherine.'),
('Archie',    'Mountbatten-Windsor',   '2019-05-06', NULL, 'Portland Hospital, Londres','','Male',1,'',                  'Premier enfant de Harry et Meghan. Sixième en ligne de succession.'),
('Lilibet',   'Mountbatten-Windsor',   '2021-06-04', NULL, 'Santa Barbara, USA',   '', 'Female',1, '',                  'Deuxième enfant de Harry et Meghan. Prénommée en hommage à la reine Elizabeth II.');

-- ═══════════════════════════════════════════════════════════════════════════
-- RELATIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Utilisation de sous-requêtes pour récupérer les IDs dynamiquement

-- Mariages
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='George'  AND p1.LastName='I de Hanovre'
  AND p2.FirstName='Sophia'  AND p2.LastName='Dorothea de Celle';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='George'  AND p1.LastName='II de Grande-Bretagne'
  AND p2.FirstName='Caroline' AND p2.LastName='d\'Ansbach';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Frederick' AND p1.LastName='Prince de Galles'
  AND p2.FirstName='Augusta'   AND p2.LastName='de Saxe-Gotha';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='George'    AND p1.LastName='III de Grande-Bretagne'
  AND p2.FirstName='Charlotte' AND p2.LastName='de Mecklembourg-Strelitz';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Edward'   AND p1.LastName='duc de Kent'
  AND p2.FirstName='Victoria' AND p2.LastName='de Saxe-Cobourg-Saalfeld';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Victoria' AND p1.LastName='de Grande-Bretagne'
  AND p2.FirstName='Albert'   AND p2.LastName='de Saxe-Cobourg et Gotha';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Edward'    AND p1.LastName='VII de Grande-Bretagne'
  AND p2.FirstName='Alexandra' AND p2.LastName='de Danemark';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='George' AND p1.LastName='V de Grande-Bretagne'
  AND p2.FirstName='Mary'   AND p2.LastName='de Teck';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 0 FROM Persons p1, Persons p2
WHERE p1.FirstName='Edward' AND p1.LastName='VIII de Grande-Bretagne'
  AND p2.FirstName='Wallis' AND p2.LastName='Simpson';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='George'    AND p1.LastName='VI de Grande-Bretagne'
  AND p2.FirstName='Elizabeth' AND p2.LastName='Bowes-Lyon';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Margaret' AND p1.LastName='de Grande-Bretagne'
  AND p2.FirstName='Antony'   AND p2.LastName='Armstrong-Jones';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Elizabeth' AND p1.LastName='II de Grande-Bretagne'
  AND p2.FirstName='Philip'    AND p2.LastName='duc d\'Édimbourg';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 0 FROM Persons p1, Persons p2
WHERE p1.FirstName='Charles' AND p1.LastName='III de Grande-Bretagne'
  AND p2.FirstName='Diana'   AND p2.LastName='Spencer';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Charles' AND p1.LastName='III de Grande-Bretagne'
  AND p2.FirstName='Camilla' AND p2.LastName='Parker Bowles';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 0 FROM Persons p1, Persons p2
WHERE p1.FirstName='Anne' AND p1.LastName='princesse royale'
  AND p2.FirstName='Mark' AND p2.LastName='Phillips';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Anne'    AND p1.LastName='princesse royale'
  AND p2.FirstName='Timothy' AND p2.LastName='Laurence';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 0 FROM Persons p1, Persons p2
WHERE p1.FirstName='Andrew' AND p1.LastName='duc d\'York'
  AND p2.FirstName='Sarah'  AND p2.LastName='Ferguson';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Edward' AND p1.LastName='duc d\'Édimbourg'
  AND p2.FirstName='Sophie'  AND p2.LastName='Rhys-Jones';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='William'   AND p1.LastName='prince de Galles'
  AND p2.FirstName='Catherine' AND p2.LastName='Middleton';

INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p1.Id, p2.Id, 3, 1 FROM Persons p1, Persons p2
WHERE p1.FirstName='Harry'  AND p1.LastName='duc de Sussex'
  AND p2.FirstName='Meghan' AND p2.LastName='Markle';

-- Filiations : George I → George II
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='I de Hanovre'
  AND c.FirstName='George' AND c.LastName='II de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Sophia' AND p.LastName='Dorothea de Celle'
  AND c.FirstName='George' AND c.LastName='II de Grande-Bretagne';

-- George II → Frederick Prince de Galles
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='II de Grande-Bretagne'
  AND c.FirstName='Frederick' AND c.LastName='Prince de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Caroline' AND p.LastName='d\'Ansbach'
  AND c.FirstName='Frederick' AND c.LastName='Prince de Galles';

-- Frederick → George III, George IV, William IV, Edward duc de Kent
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Frederick' AND p.LastName='Prince de Galles'
  AND c.FirstName='George' AND c.LastName='III de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Augusta' AND p.LastName='de Saxe-Gotha'
  AND c.FirstName='George' AND c.LastName='III de Grande-Bretagne';

-- George III → George IV, William IV, Edward duc de Kent
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='III de Grande-Bretagne'
  AND c.FirstName='George' AND c.LastName='IV de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Charlotte' AND p.LastName='de Mecklembourg-Strelitz'
  AND c.FirstName='George' AND c.LastName='IV de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='III de Grande-Bretagne'
  AND c.FirstName='William' AND c.LastName='IV de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Charlotte' AND p.LastName='de Mecklembourg-Strelitz'
  AND c.FirstName='William' AND c.LastName='IV de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='III de Grande-Bretagne'
  AND c.FirstName='Edward' AND c.LastName='duc de Kent';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Charlotte' AND p.LastName='de Mecklembourg-Strelitz'
  AND c.FirstName='Edward' AND c.LastName='duc de Kent';

-- Edward duc de Kent → Victoria reine
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Edward' AND p.LastName='duc de Kent'
  AND c.FirstName='Victoria' AND c.LastName='de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Victoria' AND p.LastName='de Saxe-Cobourg-Saalfeld'
  AND c.FirstName='Victoria' AND c.LastName='de Grande-Bretagne';

-- Victoria & Albert → Edward VII
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Victoria' AND p.LastName='de Grande-Bretagne'
  AND c.FirstName='Edward' AND c.LastName='VII de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Albert' AND p.LastName='de Saxe-Cobourg et Gotha'
  AND c.FirstName='Edward' AND c.LastName='VII de Grande-Bretagne';

-- Edward VII & Alexandra → George V
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Edward' AND p.LastName='VII de Grande-Bretagne'
  AND c.FirstName='George' AND c.LastName='V de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Alexandra' AND p.LastName='de Danemark'
  AND c.FirstName='George' AND c.LastName='V de Grande-Bretagne';

-- George V & Mary → Edward VIII, George VI
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='V de Grande-Bretagne'
  AND c.FirstName='Edward' AND c.LastName='VIII de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Mary' AND p.LastName='de Teck'
  AND c.FirstName='Edward' AND c.LastName='VIII de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='V de Grande-Bretagne'
  AND c.FirstName='George' AND c.LastName='VI de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Mary' AND p.LastName='de Teck'
  AND c.FirstName='George' AND c.LastName='VI de Grande-Bretagne';

-- George VI & Elizabeth Bowes-Lyon → Elizabeth II, Margaret
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='VI de Grande-Bretagne'
  AND c.FirstName='Elizabeth' AND c.LastName='II de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Elizabeth' AND p.LastName='Bowes-Lyon'
  AND c.FirstName='Elizabeth' AND c.LastName='II de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='George' AND p.LastName='VI de Grande-Bretagne'
  AND c.FirstName='Margaret' AND c.LastName='de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Elizabeth' AND p.LastName='Bowes-Lyon'
  AND c.FirstName='Margaret' AND c.LastName='de Grande-Bretagne';

-- Elizabeth II & Philip → Charles, Anne, Andrew, Edward
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Elizabeth' AND p.LastName='II de Grande-Bretagne'
  AND c.FirstName='Charles' AND c.LastName='III de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Philip' AND p.LastName='duc d\'Édimbourg'
  AND c.FirstName='Charles' AND c.LastName='III de Grande-Bretagne';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Elizabeth' AND p.LastName='II de Grande-Bretagne'
  AND c.FirstName='Anne' AND c.LastName='princesse royale';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Philip' AND p.LastName='duc d\'Édimbourg'
  AND c.FirstName='Anne' AND c.LastName='princesse royale';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Elizabeth' AND p.LastName='II de Grande-Bretagne'
  AND c.FirstName='Andrew' AND c.LastName='duc d\'York';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Philip' AND p.LastName='duc d\'Édimbourg'
  AND c.FirstName='Andrew' AND c.LastName='duc d\'York';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Elizabeth' AND p.LastName='II de Grande-Bretagne'
  AND c.FirstName='Edward' AND c.LastName='duc d\'Édimbourg';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Philip' AND p.LastName='duc d\'Édimbourg'
  AND c.FirstName='Edward' AND c.LastName='duc d\'Édimbourg';

-- Charles & Diana → William, Harry
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Charles' AND p.LastName='III de Grande-Bretagne'
  AND c.FirstName='William' AND c.LastName='prince de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Diana' AND p.LastName='Spencer'
  AND c.FirstName='William' AND c.LastName='prince de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Charles' AND p.LastName='III de Grande-Bretagne'
  AND c.FirstName='Harry' AND c.LastName='duc de Sussex';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Diana' AND p.LastName='Spencer'
  AND c.FirstName='Harry' AND c.LastName='duc de Sussex';

-- William & Catherine → George, Charlotte, Louis
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='William' AND p.LastName='prince de Galles'
  AND c.FirstName='George' AND c.LastName='de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Catherine' AND p.LastName='Middleton'
  AND c.FirstName='George' AND c.LastName='de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='William' AND p.LastName='prince de Galles'
  AND c.FirstName='Charlotte' AND c.LastName='de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Catherine' AND p.LastName='Middleton'
  AND c.FirstName='Charlotte' AND c.LastName='de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='William' AND p.LastName='prince de Galles'
  AND c.FirstName='Louis' AND c.LastName='de Galles';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Catherine' AND p.LastName='Middleton'
  AND c.FirstName='Louis' AND c.LastName='de Galles';

-- Harry & Meghan → Archie, Lilibet
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Harry' AND p.LastName='duc de Sussex'
  AND c.FirstName='Archie' AND c.LastName='Mountbatten-Windsor';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Meghan' AND p.LastName='Markle'
  AND c.FirstName='Archie' AND c.LastName='Mountbatten-Windsor';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Harry' AND p.LastName='duc de Sussex'
  AND c.FirstName='Lilibet' AND c.LastName='Mountbatten-Windsor';
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive)
SELECT p.Id, c.Id, 1, 1 FROM Persons p, Persons c
WHERE p.FirstName='Meghan' AND p.LastName='Markle'
  AND c.FirstName='Lilibet' AND c.LastName='Mountbatten-Windsor';
