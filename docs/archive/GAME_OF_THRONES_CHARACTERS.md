# 🎭 Personnages de Game of Thrones - Guide d'Import

## 📋 Résumé

Ce script SQL ajoute les principales familles de Game of Thrones avec leurs relations familiales complètes pour tester l'application généalogique.

## 👥 Familles Incluses

### 🐺 **Famille Stark (Winterfell)**
- **Génération 1 :** Rickard Stark, Lyarra Stark
- **Génération 2 :** Eddard "Ned" Stark, Brandon Stark, Benjen Stark, Lyanna Stark
- **Génération 3 :** Robb Stark, Sansa Stark, Arya Stark, Bran Stark, Rickon Stark
- **Alliances :** Catelyn Tully (épouse de Ned)

### 🦁 **Famille Lannister (Casterly Rock)**
- **Génération 1 :** Tytos Lannister, Jeyne Marbrand
- **Génération 2 :** Tywin Lannister, Joanna Lannister
- **Génération 3 :** Cersei Lannister, Jaime Lannister, Tyrion Lannister
- **Alliances :** Robert Baratheon (époux de Cersei)

### 🦌 **Famille Baratheon (Storm's End)**
- **Génération 1 :** Steffon Baratheon, Cassana Estermont
- **Génération 2 :** Robert Baratheon, Stannis Baratheon, Renly Baratheon
- **Génération 3 :** Joffrey Baratheon, Myrcella Baratheon, Tommen Baratheon
- **Alliances :** Cersei Lannister (épouse de Robert)

### 🐉 **Famille Targaryen (Dragonstone)**
- **Génération 1 :** Aerys II Targaryen "The Mad King", Rhaella Targaryen
- **Génération 2 :** Rhaegar Targaryen, Viserys Targaryen, Daenerys Targaryen
- **Génération 3 :** Jon Snow (Aegon Targaryen, fils de Rhaegar et Lyanna)
- **Alliances :** Lyanna Stark (épouse de Rhaegar)

### 🐟 **Famille Tully (Riverrun)**
- **Génération 1 :** Hoster Tully, Minisa Whent
- **Génération 2 :** Catelyn Stark (née Tully), Lysa Arryn (née Tully), Edmure Tully

## 🔗 Relations Établies

### Relations Parent-Enfant
- Toutes les relations parent-enfant sont établies
- Relations bidirectionnelles (parent → enfant)

### Relations Siblings
- Tous les frères et sœurs sont liés
- Relations bidirectionnelles

### Mariages
- Rickard Stark ↔ Lyarra Stark
- Ned Stark ↔ Catelyn Tully
- Hoster Tully ↔ Minisa Whent
- Tywin Lannister ↔ Joanna Lannister
- Tytos Lannister ↔ Jeyne Marbrand
- Steffon Baratheon ↔ Cassana Estermont
- Robert Baratheon ↔ Cersei Lannister
- Aerys Targaryen ↔ Rhaella Targaryen
- Rhaegar Targaryen ↔ Lyanna Stark

## 📊 Statistiques

- **Personnages :** ~40+ personnages
- **Relations :** ~100+ relations familiales
- **Familles :** 5 familles principales
- **Générations :** 3-4 générations par famille

## 🚀 Pour Exécuter le Script

### Option 1 : Depuis MySQL
```bash
mysql -u root -p yeboekun < scripts/add_game_of_thrones_characters.sql
```

### Option 2 : Depuis le conteneur Docker
```bash
docker exec -i yeboekun-mysql mysql -u root -p yeboekun < scripts/add_game_of_thrones_characters.sql
```

### Option 3 : Depuis MySQL CLI
```sql
USE yeboekun;
source scripts/add_game_of_thrones_characters.sql;
```

## 🎯 Personnages Clés pour Tester

### Pour tester la vue éventail :
1. **Ned Stark** - Arbre complet avec enfants et parents
2. **Cersei Lannister** - Famille Lannister avec enfants Baratheon
3. **Daenerys Targaryen** - Famille Targaryen avec frères
4. **Jon Snow** - Relations complexes (Stark + Targaryen)
5. **Robert Baratheon** - Famille Baratheon avec enfants

### Relations intéressantes à explorer :
- **Jon Snow** : Fils de Rhaegar Targaryen et Lyanna Stark (relation secrète)
- **Cersei Lannister** : Mariée à Robert Baratheon, enfants avec Jaime
- **Ned Stark** : 5 enfants, frères et sœurs multiples
- **Daenerys Targaryen** : Sœur de Viserys et Rhaegar

## 📝 Notes

- Les dates sont approximatives (basées sur la chronologie de la série)
- Certaines relations sont simplifiées pour la démonstration
- Le script gère automatiquement les doublons
- Toutes les relations sont bidirectionnelles

## ✅ Vérification

Après l'exécution, vérifiez :
```sql
-- Compter les personnages
SELECT COUNT(*) FROM Persons WHERE LastName IN ('Stark', 'Lannister', 'Targaryen', 'Baratheon', 'Tully');

-- Voir les relations
SELECT COUNT(*) FROM Relationships;

-- Voir un personnage spécifique
SELECT * FROM Persons WHERE FirstName = 'Ned' AND LastName = 'Stark';
```
