# État actuel du formulaire d'enregistrement et de mise à jour

## ✅ Ce qui fonctionne

### Vue éventail
- Affichage des générations (parents, grands-parents, enfants)
- Affichage des frères/sœurs (grisés, cliquables, ordonnés par date de naissance)
- Affichage des enfants (grisés, cliquables, centrés sous la personne centrale)
- Affichage du conjoint actuel (animation au survol/clic sur ❤️)
- Navigation par clic sur les cartes
- Centrage automatique au chargement
- Zoom et pan fonctionnels

### Formulaire d'enregistrement
- Modal avec tous les champs nécessaires
- Recherche et sélection de parents (2 parents possibles)
- Recherche et sélection d'enfants (multiples enfants possibles)
- Vérification automatique des doublons basée sur prénom + date de naissance
- Boîte de dialogue de confirmation pour les doublons
- Création des relations parent-enfant après création de la personne

### Formulaire de mise à jour
- Ouverture depuis la carte de la personne centrale uniquement (icône ✏️)
- Chargement automatique des données de la personne
- Chargement automatique des parents et enfants existants
- Modification possible des relations (parents et enfants)
- Vérification automatique des doublons lors de la mise à jour

## ⚠️ Problèmes identifiés

### 1. Réactivation du bouton
- **Problème** : Le bouton ne se réactive pas toujours correctement après une opération
- **Corrections apportées** : 
  - Réinitialisation dans `openPersonModal()` et `openEditPersonModal()`
  - Réinitialisation dans `closePersonModal()`
  - Réinitialisation après succès et erreur
  - Réinitialisation dans `handleSamePerson()`
- **À tester** : Vérifier que le bouton fonctionne correctement après chaque opération

### 2. Gestion des relations lors de la mise à jour
- **Problème** : Les relations (parents/enfants) peuvent être modifiées mais la logique backend n'est pas complète
- **État actuel** : Le frontend envoie `parent1Id` et `parent2Id` mais le backend ne les traite pas en mode mise à jour
- **À faire** : 
  - Modifier le backend pour gérer la mise à jour des relations parent-enfant
  - Créer/supprimer les relations selon les sélections dans le formulaire

### 3. Boîte de dialogue de confirmation
- **État actuel** : Fonctionnelle mais peut être améliorée
- **À améliorer** : 
  - Meilleure présentation visuelle
  - Possibilité de voir plus de détails sur les doublons
  - Option pour fusionner les personnes si c'est la même

## 📋 Prochaines étapes suggérées

### Priorité 1 : Finaliser le formulaire
1. **Backend - Mise à jour des relations**
   - Créer un endpoint pour mettre à jour les relations parent-enfant
   - Gérer la création/suppression des relations lors de la mise à jour
   - Vérifier que les relations existantes sont bien préservées si non modifiées

2. **Frontend - Amélioration de l'UX**
   - Indicateur visuel pour les relations existantes vs nouvelles
   - Confirmation avant suppression d'une relation
   - Meilleure gestion des erreurs lors de la création de relations

### Priorité 2 : Améliorer la détection de doublons
1. **Affichage amélioré**
   - Afficher plus de détails (lieu de naissance, profession, etc.)
   - Permettre la comparaison côte à côte
   - Option pour fusionner les personnes

2. **Algorithme de détection**
   - Ajuster les seuils selon les retours utilisateurs
   - Prendre en compte les variations de noms (mariage, etc.)

### Priorité 3 : Tests et validation
1. **Tests de cas limites**
   - Personnes avec beaucoup de relations
   - Doublons avec variations de noms
   - Mise à jour de personnes avec relations complexes

2. **Validation des données**
   - Vérification de cohérence (dates, relations, etc.)
   - Messages d'erreur plus explicites

## 🔧 Fichiers modifiés récemment

### Frontend
- `frontend/professional-fan-view.html` : Formulaire d'enregistrement/mise à jour, détection de doublons, boîte de dialogue de confirmation

### Backend
- `backend/src/GegeDot.API/Controllers/PersonsController.cs` : Endpoint de vérification de doublons, endpoint de mise à jour avec vérification
- `backend/src/GegeDot.Services/Services/DuplicateDetectionService.cs` : Amélioration de l'algorithme de détection
- `backend/src/GegeDot.Services/Services/PersonService.cs` : Gestion des relations parent-enfant lors de la création

## 📝 Notes techniques

### Variables globales importantes
- `editingPersonId` : ID de la personne en cours d'édition (null si création)
- `selectedParent1`, `selectedParent2` : Parents sélectionnés
- `selectedChildren` : Tableau des enfants sélectionnés
- `window.pendingPersonData` : Données en attente lors de la détection de doublons

### Endpoints API utilisés
- `POST /api/persons` : Création d'une personne
- `PUT /api/persons/{id}` : Mise à jour d'une personne
- `GET /api/persons/{id}` : Récupération d'une personne
- `GET /api/persons/{id}/parents` : Récupération des parents
- `GET /api/persons/{id}/children` : Récupération des enfants
- `POST /api/persons/check-duplicates` : Vérification de doublons
- `POST /api/persons/{parentId}/children/{childId}` : Création d'une relation parent-enfant
