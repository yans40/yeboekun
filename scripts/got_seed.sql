-- ═══════════════════════════════════════════════════════════
-- JEU DE DONNÉES : GAME OF THRONES
-- ═══════════════════════════════════════════════════════════

-- Maison Stark
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Rickard',   'Stark',     '0230-01-01', '0281-01-01', 'Winterfell',      'Port-Réal',       'Male',   0, 'Seigneur de Winterfell', 'Seigneur de Winterfell, père de Eddard, Lyanna et Benjen.'),
('Lyarra',    'Stark',     '0235-01-01', '0260-01-01', 'Winterfell',      'Winterfell',      'Female', 0, 'Dame de Winterfell',     'Épouse de Rickard Stark, mère de leurs enfants.'),
('Eddard',    'Stark',     '0263-01-01', '0298-01-01', 'Winterfell',      'Port-Réal',       'Male',   0, 'Seigneur de Winterfell', 'La tête du Nord. Exécuté par Joffrey Baratheon.'),
('Catelyn',   'Tully',     '0264-01-01', '0299-01-01', 'Vivesaigues',     'Les Jumeaux',     'Female', 0, 'Dame de Winterfell',     'Épouse de Eddard Stark. Assassinée lors des Noces Pourpres.'),
('Lyanna',    'Stark',     '0266-01-01', '0283-01-01', 'Winterfell',      'Tour de la Joie', 'Female', 0, 'Dame',                   'Sœur de Eddard, aimée de Rhaegar Targaryen. Mère de Jon Snow.'),
('Benjen',    'Stark',     '0268-01-01', NULL,          'Winterfell',      NULL,              'Male',   0, 'Premier Ranger',         'Frère de Eddard, premier ranger de la Garde de Nuit.'),
('Robb',      'Stark',     '0283-01-01', '0299-01-01', 'Vivesaigues',     'Les Jumeaux',     'Male',   0, 'Roi du Nord',            'Roi du Nord, assassiné lors des Noces Pourpres.'),
('Sansa',     'Stark',     '0286-01-01', NULL,          'Winterfell',      NULL,              'Female', 1, 'Reine du Nord',          'Reine du Nord. A survécu à Port-Réal, Joffrey et Ramsay Bolton.'),
('Arya',      'Stark',     '0289-01-01', NULL,          'Winterfell',      NULL,              'Female', 1, 'Exploratrice',           'Tueuse des morts. Première exploratrice à l\'ouest de Westeros.'),
('Bran',      'Stark',     '0290-01-01', NULL,          'Winterfell',      NULL,              'Male',   1, 'Roi des Six Royaumes',   'Le Roi des Six Royaumes. Le Corbeau à Trois Yeux.'),
('Rickon',    'Stark',     '0295-01-01', '0304-01-01', 'Winterfell',      'Winterfell',      'Male',   0, NULL,                     'Plus jeune fils des Stark, tué par Ramsay Bolton.'),
('Jon',       'Snow',      '0283-01-01', NULL,          'Tour de la Joie', NULL,              'Male',   1, 'Lord Commandant',        'Aegon Targaryen. Roi au-delà du Mur. Héros de la Bataille des Bâtards.');

-- Maison Lannister
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Tywin',    'Lannister', '0242-01-01', '0300-01-01', 'Castral Roc', 'Port-Réal',  'Male',   0, 'Main du Roi',                   'Le lion de Lannister. Stratège implacable. Tué par Tyrion.'),
('Joanna',   'Lannister', '0245-01-01', '0273-01-01', 'Castral Roc', 'Castral Roc','Female', 0, 'Dame de Castral Roc',           'Épouse de Tywin, morte en accouchant Tyrion.'),
('Cersei',   'Lannister', '0266-01-01', '0305-01-01', 'Castral Roc', 'Port-Réal',  'Female', 0, 'Reine de Westeros',             'Reine de Westeros. Tuée lors de la chute de Port-Réal.'),
('Jaime',    'Lannister', '0266-01-01', '0305-01-01', 'Castral Roc', 'Port-Réal',  'Male',   0, 'Chevalier de la Garde Royale',  'Le Régicide. Mort auprès de Cersei lors de la chute de Port-Réal.'),
('Tyrion',   'Lannister', '0273-01-01', NULL,          'Castral Roc', NULL,         'Male',   1, 'Main du Roi',                   'Le Lutin. Main du Roi puis de la Reine. Le plus grand esprit de Westeros.'),
('Joffrey',  'Baratheon', '0286-01-01', '0300-01-01', 'Port-Réal',   'Port-Réal',  'Male',   0, 'Roi de Westeros',               'Roi cruel, fils de Cersei et Jaime. Empoisonné lors de ses noces pourpres.'),
('Myrcella', 'Baratheon', '0288-01-01', '0303-01-01', 'Port-Réal',   'Dorne',      'Female', 0, 'Princesse',                     'Fille de Cersei et Jaime. Empoisonnée à Dorne.'),
('Tommen',   'Baratheon', '0291-01-01', '0305-01-01', 'Port-Réal',   'Port-Réal',  'Male',   0, 'Roi de Westeros',               'Fils de Cersei et Jaime. Roi doux. Suicidé après la destruction du Grand Septuaire.');

-- Maison Targaryen
INSERT INTO Persons (FirstName, LastName, BirthDate, DeathDate, BirthPlace, DeathPlace, Gender, IsAlive, Profession, Biography) VALUES
('Aerys',    'Targaryen', '0244-01-01', '0283-01-01', 'Peyredragon', 'Port-Réal',   'Male',   0, 'Roi de Westeros',      'Le Roi Fou. Tué par Jaime Lannister lors du sac de Port-Réal.'),
('Rhaella',  'Targaryen', '0245-01-01', '0284-01-01', 'Peyredragon', 'Peyredragon', 'Female', 0, 'Reine de Westeros',    'Épouse de Aerys. Morte en accouchant Daenerys.'),
('Rhaegar',  'Targaryen', '0259-01-01', '0283-01-01', 'Peyredragon', 'Trident',     'Male',   0, 'Prince de Westeros',   'Prince du Dragon. Père de Jon Snow. Tué par Robert Baratheon au Trident.'),
('Viserys',  'Targaryen', '0276-01-01', '0298-01-01', 'Peyredragon', 'Vaes Dothrak','Male',   0, 'Prétendant au Trône',  'Le Roi Mendiant. Tué par Khal Drogo avec une couronne de fer fondu.'),
('Daenerys', 'Targaryen', '0284-01-01', '0305-01-01', 'Peyredragon', 'Port-Réal',   'Female', 0, 'Reine de Westeros',    'Mère des Dragons. Libératrice et conquérante. Tuée par Jon Snow.'),
('Drogo',    'Khal',      '0270-01-01', '0298-01-01', 'Mer Dothrak', 'Vaes Dothrak','Male',   0, 'Khal Dothraki',        'Khal des Dothrakis, époux de Daenerys. Mort d\'une blessure infectée.');

-- ─── RELATIONS ───────────────────────────────────────────────
-- IDs Stark: Rickard=1,Lyarra=2,Eddard=3,Catelyn=4,Lyanna=5,Benjen=6,Robb=7,Sansa=8,Arya=9,Bran=10,Rickon=11,Jon=12
-- IDs Lannister: Tywin=13,Joanna=14,Cersei=15,Jaime=16,Tyrion=17,Joffrey=18,Myrcella=19,Tommen=20
-- IDs Targaryen: Aerys=21,Rhaella=22,Rhaegar=23,Viserys=24,Daenerys=25,Drogo=26

-- Mariages
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(1,  2,  3, 1),  -- Rickard & Lyarra
(3,  4,  3, 1),  -- Eddard & Catelyn
(5,  23, 3, 1),  -- Lyanna & Rhaegar
(21, 22, 3, 1),  -- Aerys & Rhaella
(15, 16, 3, 1),  -- Cersei & Jaime
(13, 14, 3, 1),  -- Tywin & Joanna
(25, 26, 3, 0);  -- Daenerys & Drogo (terminé)

-- Rickard & Lyarra -> enfants Stark
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(1, 3, 1, 1), (2, 3, 1, 1),   -- -> Eddard
(1, 5, 1, 1), (2, 5, 1, 1),   -- -> Lyanna
(1, 6, 1, 1), (2, 6, 1, 1);   -- -> Benjen

-- Eddard & Catelyn -> enfants
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(3, 7,  1, 1), (4, 7,  1, 1),  -- -> Robb
(3, 8,  1, 1), (4, 8,  1, 1),  -- -> Sansa
(3, 9,  1, 1), (4, 9,  1, 1),  -- -> Arya
(3, 10, 1, 1), (4, 10, 1, 1),  -- -> Bran
(3, 11, 1, 1), (4, 11, 1, 1);  -- -> Rickon

-- Rhaegar & Lyanna -> Jon Snow
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(23, 12, 1, 1), (5, 12, 1, 1);

-- Tywin & Joanna -> Cersei, Jaime, Tyrion
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(13, 15, 1, 1), (14, 15, 1, 1),  -- -> Cersei
(13, 16, 1, 1), (14, 16, 1, 1),  -- -> Jaime
(13, 17, 1, 1), (14, 17, 1, 1);  -- -> Tyrion

-- Cersei & Jaime -> Joffrey, Myrcella, Tommen
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(15, 18, 1, 1), (16, 18, 1, 1),  -- -> Joffrey
(15, 19, 1, 1), (16, 19, 1, 1),  -- -> Myrcella
(15, 20, 1, 1), (16, 20, 1, 1);  -- -> Tommen

-- Aerys & Rhaella -> Rhaegar, Viserys, Daenerys
INSERT INTO Relationships (Person1Id, Person2Id, RelationshipType, IsActive) VALUES
(21, 23, 1, 1), (22, 23, 1, 1),  -- -> Rhaegar
(21, 24, 1, 1), (22, 24, 1, 1),  -- -> Viserys
(21, 25, 1, 1), (22, 25, 1, 1);  -- -> Daenerys
