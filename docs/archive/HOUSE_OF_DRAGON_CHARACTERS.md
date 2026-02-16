# 🐉 Personnages de House of the Dragon - Guide d'Import

## 📋 Résumé

Ce script SQL ajoute les personnages principaux de House of the Dragon (prequel de Game of Thrones, ~200 ans avant) pour compléter l'arbre généalogique des Targaryen.

## 👥 Personnages Ajoutés

### 🏰 **Génération Jaehaerys I (The Old King)**
- **Jaehaerys I Targaryen** "The Old King" (34-103 AC)
- **Alysanne Targaryen** (épouse de Jaehaerys I, 36-100 AC)
- **Baelon Targaryen** "The Spring Prince" (fils, 61-101 AC)
- **Alyssa Targaryen** (épouse de Baelon, 60-84 AC)

### 👑 **Génération Viserys I**
- **Viserys I Targaryen** (roi, 77-129 AC)
- **Daemon Targaryen** "The Rogue Prince" (frère de Viserys I, 81-130 AC)
- **Aemma Arryn** (première épouse de Viserys I, 82-105 AC)
- **Alicent Hightower** (seconde épouse de Viserys I, 88-135 AC)

### 👸 **Génération Rhaenyra (Faction Noire)**
- **Rhaenyra Targaryen** "The Realm's Delight" (fille de Viserys I et Aemma, 97-130 AC)
- **Aegon III Targaryen** "The Younger" (fils de Rhaenyra et Daemon, 120-157 AC)
- **Viserys II Targaryen** (fils de Rhaenyra et Daemon, 122-172 AC)

### 👑 **Génération Aegon II (Faction Verte)**
- **Aegon II Targaryen** (fils de Viserys I et Alicent, 107-131 AC)
- **Helaena Targaryen** (fille de Viserys I et Alicent, épouse d'Aegon II, 109-130 AC)
- **Aemond Targaryen** "One-Eye" (fils de Viserys I et Alicent, 110-130 AC)
- **Daeron Targaryen** (fils de Viserys I et Alicent, 114-130 AC)

### 👶 **Génération Enfants d'Aegon II**
- **Jaehaerys Targaryen** (fils de Aegon II et Helaena, 123-130 AC)
- **Jaehaera Targaryen** (fille de Aegon II et Helaena, 123-133 AC)
- **Maelor Targaryen** (fils de Aegon II et Helaena, 125-130 AC)

## 🔗 Relations Établies

### Relations Parent-Enfant
- Jaehaerys I + Alysanne → Baelon
- Baelon + Alyssa → Viserys I, Daemon
- Viserys I + Aemma → Rhaenyra
- Viserys I + Alicent → Aegon II, Helaena, Aemond, Daeron
- Rhaenyra + Daemon → Aegon III, Viserys II
- Aegon II + Helaena → Jaehaerys, Jaehaera, Maelor

### Relations Siblings
- Viserys I ↔ Daemon (frères)
- Rhaenyra ↔ Aegon II, Helaena, Aemond, Daeron (demi-frères/sœurs)
- Aegon II ↔ Helaena ↔ Aemond ↔ Daeron (frères et sœurs)
- Aegon III ↔ Viserys II (frères)
- Jaehaerys ↔ Jaehaera ↔ Maelor (frères et sœur)

### Mariages
- Jaehaerys I ↔ Alysanne Targaryen
- Baelon ↔ Alyssa Targaryen
- Viserys I ↔ Aemma Arryn (premier mariage)
- Viserys I ↔ Alicent Hightower (second mariage)
- Rhaenyra ↔ Daemon Targaryen (oncle et nièce)
- Aegon II ↔ Helaena Targaryen (frère et sœur)

## 📊 Statistiques

- **Personnages ajoutés :** ~20+ personnages
- **Relations ajoutées :** ~50+ relations familiales
- **Générations :** 4 générations de Targaryen
- **Période :** 34 AC à 172 AC (environ 200 ans avant Game of Thrones)

## 🚀 Pour Exécuter le Script

### Option 1 : Depuis le terminal
```bash
docker exec -i gegeDot-mysql mysql -u root -ppassword gegeDot < scripts/add_house_of_dragon_characters.sql
```

### Option 2 : Via phpMyAdmin
1. Ouvrez http://localhost:8080
2. Connectez-vous avec `gegedot` / `password`
3. Sélectionnez la base `gegeDot`
4. Allez dans l'onglet "SQL"
5. Copiez-collez le contenu de `scripts/add_house_of_dragon_characters.sql`
6. Cliquez sur "Exécuter"

### Option 3 : Depuis MySQL CLI
```sql
USE gegeDot;
source scripts/add_house_of_dragon_characters.sql;
```

## 🎯 Personnages Clés pour Tester

### Pour tester la vue éventail :
1. **Viserys I Targaryen** - Arbre complet avec deux épouses et enfants des deux mariages
2. **Rhaenyra Targaryen** - Faction Noire avec enfants
3. **Aegon II Targaryen** - Faction Verte avec frères et sœurs
4. **Daemon Targaryen** - Oncle de Rhaenyra, époux de Rhaenyra
5. **Alicent Hightower** - Seconde épouse de Viserys I, mère de Aegon II

### Relations intéressantes à explorer :
- **Rhaenyra** : Fille de Viserys I et Aemma, épouse de Daemon (son oncle)
- **Aegon II** : Fils de Viserys I et Alicent, marié à sa sœur Helaena
- **Viserys I** : Deux épouses, enfants des deux mariages (conflit de succession)
- **Daemon** : Frère de Viserys I, époux de Rhaenyra (sa nièce)

## 📝 Notes

- Les dates sont en années AC (After Conquest - après la Conquête d'Aegon)
- House of the Dragon se déroule environ 200 ans avant Game of Thrones
- Les relations incluent des mariages consanguins (typiques des Targaryen)
- Le script gère automatiquement les doublons
- Toutes les relations sont bidirectionnelles

## ✅ Vérification

Après l'exécution, vérifiez :
```sql
-- Compter les personnages Targaryen
SELECT COUNT(*) FROM Persons WHERE LastName = 'Targaryen';

-- Voir les personnages de House of the Dragon
SELECT FirstName, LastName, MiddleName, BirthDate 
FROM Persons 
WHERE LastName = 'Targaryen' 
  AND (FirstName IN ('Viserys', 'Daemon', 'Rhaenyra', 'Aegon', 'Helaena', 'Aemond', 'Daeron', 'Aemma', 'Alicent')
       OR MiddleName LIKE '%II%' OR MiddleName LIKE '%III%')
ORDER BY BirthDate;
```

## 🔗 Connexion avec Game of Thrones

Les personnages de House of the Dragon sont les ancêtres des Targaryen de Game of Thrones :
- **Aegon III** → ... → **Aerys II** (The Mad King)
- **Viserys II** → ... → **Aerys II** (The Mad King)

Le script peut être étendu pour créer les générations intermédiaires si nécessaire.
