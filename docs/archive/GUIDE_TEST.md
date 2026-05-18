# 🧪 Guide de Test - Yeboekun Phase 1

## 🚀 Préparation

### 1. Démarrer Docker Desktop
Assurez-vous que **Docker Desktop est démarré** sur votre Mac.

### 2. Démarrer les Services

#### Option A : Automatique (si Docker fonctionne)
```bash
# Démarrer MySQL et phpMyAdmin
docker-compose up -d

# Attendre 5 secondes
sleep 5

# Démarrer le backend
cd backend/src/Yeboekun.API
dotnet run --urls=http://localhost:5001

# Dans un autre terminal, démarrer le frontend
cd frontend
python3 -m http.server 3004 --bind 127.0.0.1
```

#### Option B : Manuel
1. **Docker Desktop** : Démarrer manuellement
2. **Backend** : `cd backend/src/Yeboekun.API && dotnet run --urls=http://localhost:5001`
3. **Frontend** : `cd frontend && python3 -m http.server 3004 --bind 127.0.0.1`

### 3. Exécuter la Migration SQL

**IMPORTANT** : Avant de tester, exécuter la migration pour ajouter les nouveaux champs.

#### Via MySQL en ligne de commande :
```bash
mysql -h 127.0.0.1 -P 3306 -u root -ppassword yeboekun < scripts/migration_add_person_fields.sql
```

#### Via phpMyAdmin :
1. Ouvrir http://localhost:8080
2. Se connecter (utilisateur: `root`, mot de passe: `password`)
3. Sélectionner la base `yeboekun`
4. Aller dans l'onglet "SQL"
5. Copier-coller le contenu de `scripts/migration_add_person_fields.sql`
6. Cliquer sur "Exécuter"

---

## 🧪 Tests à Effectuer

### Test 1 : Vérification des Services

#### 1.1 Backend API
- **URL** : http://localhost:5001
- **Swagger** : http://localhost:5001/swagger
- **Test** : Vérifier que l'API répond et que Swagger s'affiche

#### 1.2 Frontend
- **URL** : http://localhost:3004/hierarchical-tree-beta-fixed.html
- **Test** : Vérifier que la page se charge et affiche la liste des personnes

---

### Test 2 : Formulaire d'Ajout - Nouveaux Champs

#### 2.1 Ouvrir le Formulaire
1. Aller sur http://localhost:3004/hierarchical-tree-beta-fixed.html
2. Cliquer sur le bouton **"➕ Ajouter une personne"**

#### 2.2 Vérifier les Nouveaux Champs
Vérifier que les champs suivants sont présents :
- ✅ **Profession** (champ texte)
- ✅ **Date de mariage** (sélecteur de date)
- ✅ **Lieu de mariage** (champ texte)
- ✅ **Statut de décès** (menu déroulant avec options : Décédé, Mort en Mer, En Mer, Disparu)

#### 2.3 Test de Remplissage
Remplir le formulaire avec :
- **Prénom** : `Jean`
- **Nom** : `Dupont`
- **Date de naissance** : `1980-05-15`
- **Lieu de naissance** : `Paris, France`
- **Profession** : `Ingénieur`
- **Date de mariage** : `2010-06-20`
- **Lieu de mariage** : `Lyon (69)`
- **Statut** : Vivant(e) coché

#### 2.4 Test de Normalisation
Tester la normalisation automatique :
- **Prénom** : `  jean  ` → doit devenir `Jean`
- **Nom** : `DUPONT` → doit devenir `Dupont`
- **Lieu** : `st-etienne` → doit devenir `Saint-Étienne`
- **Profession** : `ingénieur` → doit devenir `Ingénieur`

---

### Test 3 : Détection de Doublons

#### 3.1 Créer une Première Personne
1. Remplir le formulaire avec :
   - **Prénom** : `Marie`
   - **Nom** : `Martin`
   - **Date de naissance** : `1990-01-15`
   - **Lieu de naissance** : `Paris, France`
2. Cliquer sur **"Enregistrer"**
3. Vérifier le message de succès

#### 3.2 Tester la Détection de Doublons
1. Ouvrir à nouveau le formulaire
2. Remplir avec des données similaires :
   - **Prénom** : `Marie` (identique)
   - **Nom** : `Martin` (identique)
   - **Date de naissance** : `1990-01-20` (proche : 5 jours de différence)
   - **Lieu de naissance** : `Paris, France` (identique)
3. Cliquer sur **"Enregistrer"**
4. **Résultat attendu** :
   - ⚠️ Section "Doublons potentiels détectés" doit apparaître
   - Liste des doublons avec score de similarité
   - Case à cocher "Je confirme que ce n'est pas un doublon"
   - Impossible d'enregistrer sans cocher la case

#### 3.3 Tester avec Données Différentes
1. Remplir avec des données différentes :
   - **Prénom** : `Pierre`
   - **Nom** : `Durand`
   - **Date de naissance** : `1985-03-10`
2. Cliquer sur **"Enregistrer"**
3. **Résultat attendu** : Pas de doublons détectés, enregistrement direct

---

### Test 4 : API - Endpoint de Détection de Doublons

#### 4.1 Test via Swagger
1. Aller sur http://localhost:5001/swagger
2. Trouver l'endpoint `POST /api/persons/check-duplicates`
3. Cliquer sur "Try it out"
4. Remplir avec :
```json
{
  "firstName": "Marie",
  "lastName": "Martin",
  "birthDate": "1990-01-15T00:00:00",
  "birthPlace": "Paris, France"
}
```
5. Cliquer sur "Execute"
6. **Résultat attendu** :
```json
{
  "hasDuplicates": true,
  "duplicates": [
    {
      "personId": 1,
      "fullName": "Marie Martin",
      "birthDate": "1990-01-15T00:00:00",
      "birthPlace": "Paris, France",
      "similarityScore": 0.95,
      "matchReason": "Nom identique, Date de naissance similaire"
    }
  ],
  "count": 1
}
```

#### 4.2 Test via curl
```bash
curl -X POST http://localhost:5001/api/persons/check-duplicates \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Martin",
    "birthDate": "1990-01-15T00:00:00",
    "birthPlace": "Paris, France"
  }'
```

---

### Test 5 : Normalisation Automatique

#### 5.1 Test via API
1. Créer une personne avec des données non normalisées :
```json
{
  "firstName": "  jean-pierre  ",
  "lastName": "DUPONT",
  "birthPlace": "st-etienne",
  "profession": "ingénieur en informatique"
}
```

2. Vérifier dans la base de données (via phpMyAdmin) que :
   - `FirstName` = `Jean-Pierre` (normalisé)
   - `LastName` = `Dupont` (normalisé)
   - `BirthPlace` = `Saint-Étienne` (normalisé)
   - `Profession` = `Ingénieur En Informatique` (normalisé)

---

## ✅ Checklist de Validation

### Fonctionnalités Backend
- [ ] API répond sur http://localhost:5001
- [ ] Swagger accessible
- [ ] Endpoint `/api/persons/check-duplicates` fonctionne
- [ ] Normalisation automatique des données
- [ ] Détection de doublons fonctionnelle

### Fonctionnalités Frontend
- [ ] Page se charge correctement
- [ ] Formulaire d'ajout accessible
- [ ] Tous les nouveaux champs présents
- [ ] Détection de doublons affichée
- [ ] Validation des champs obligatoires
- [ ] Messages d'erreur/succès affichés

### Base de Données
- [ ] Migration SQL exécutée avec succès
- [ ] Colonnes `Profession`, `MarriageDate`, `MarriagePlace`, `DeathStatus` présentes
- [ ] Données normalisées enregistrées correctement

---

## 🐛 Problèmes Courants

### MySQL non accessible
**Solution** : Vérifier que Docker Desktop est démarré et que les conteneurs sont en cours d'exécution :
```bash
docker ps
```

### Backend ne démarre pas
**Solution** : Vérifier les logs :
```bash
cd backend/src/Yeboekun.API
dotnet run --urls=http://localhost:5001
```

### Erreur de migration
**Solution** : Vérifier que la base de données existe et que les colonnes n'existent pas déjà :
```sql
SHOW COLUMNS FROM Persons;
```

### Doublons non détectés
**Solution** : Vérifier que :
1. Il y a déjà des personnes dans la base
2. Les données sont similaires (nom + date + lieu)
3. Le score de similarité dépasse 85%

---

## 📊 Résultats Attendus

### Succès ✅
- Formulaire complet avec tous les champs
- Normalisation automatique fonctionnelle
- Détection de doublons opérationnelle
- Messages clairs pour l'utilisateur
- Données correctement enregistrées en base

### Échecs ❌
- Si les nouveaux champs ne sont pas dans le formulaire → Vérifier le HTML
- Si la normalisation ne fonctionne pas → Vérifier les logs du backend
- Si les doublons ne sont pas détectés → Vérifier l'endpoint API
- Si la migration échoue → Vérifier la connexion MySQL

---

**Bon test ! 🚀**
