-- Script d'initialisation de la base de données GegeDot
-- Exécuté automatiquement lors de la création du conteneur MySQL

USE gegeDot;

CREATE TABLE IF NOT EXISTS Persons (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    MiddleName VARCHAR(100),
    BirthDate DATE,
    DeathDate DATE,
    BirthPlace VARCHAR(200),
    DeathPlace VARCHAR(200),
    PhotoUrl VARCHAR(500),
    Biography TEXT,
    Gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    DeathStatus VARCHAR(200),
    IsAlive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Relationships (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Person1Id INT NOT NULL,
    Person2Id INT NOT NULL,
    RelationshipType INT NOT NULL,
    StartDate DATE,
    EndDate DATE,
    Notes TEXT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (Person1Id) REFERENCES Persons(Id) ON DELETE CASCADE,
    FOREIGN KEY (Person2Id) REFERENCES Persons(Id) ON DELETE CASCADE,

    CONSTRAINT CHK_DifferentPersons CHECK (Person1Id != Person2Id),
    CONSTRAINT CHK_ValidDateRange CHECK (EndDate IS NULL OR StartDate IS NULL OR EndDate >= StartDate)
);

CREATE TABLE IF NOT EXISTS Trees (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    RootPersonId INT,
    IsPublic BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (RootPersonId) REFERENCES Persons(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_Persons_LastName ON Persons(LastName);
CREATE INDEX IF NOT EXISTS IX_Persons_BirthDate ON Persons(BirthDate);
CREATE INDEX IF NOT EXISTS IX_Persons_FullName ON Persons(FirstName, LastName);

CREATE INDEX IF NOT EXISTS IX_Relationships_Person1 ON Relationships(Person1Id);
CREATE INDEX IF NOT EXISTS IX_Relationships_Person2 ON Relationships(Person2Id);
CREATE INDEX IF NOT EXISTS IX_Relationships_Type ON Relationships(RelationshipType);
CREATE INDEX IF NOT EXISTS IX_Relationships_Person1_Type ON Relationships(Person1Id, RelationshipType);
CREATE INDEX IF NOT EXISTS IX_Relationships_Person2_Type ON Relationships(Person2Id, RelationshipType);

CREATE INDEX IF NOT EXISTS IX_Trees_RootPerson ON Trees(RootPersonId);
