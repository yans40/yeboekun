# Instructions pour le commit

Le shell semble avoir un problème. Veuillez exécuter les commandes suivantes directement dans votre terminal :

```bash
cd /Users/kassyimbadollou/Documents/gegeDot

# Ajouter les fichiers modifiés
git add frontend/professional-fan-view.html
git add backend/src/GegeDot.API/Controllers/PersonsController.cs
git add scripts/add_spouses_and_ancestors.sql

# Créer le commit
git commit -m "Ajout des conjoints Camilla et Kate avec leurs ascendants + Correction du doublon de carte du conjoint

- Ajout de l'endpoint /api/persons/{id}/spouse pour récupérer le conjoint actuel
- Ajout de Camilla Parker Bowles (conjoint de Charles) avec ses parents et grands-parents
- Ajout de Catherine Middleton (conjoint de William) avec ses parents et grands-parents
- Correction du problème de doublon de carte du conjoint lors du clic
- Création directe de la carte du conjoint (sans createGenealogyCard) pour éviter les conflits
- Vérification des coordonnées avant création de la carte du conjoint
- Délai de 2 secondes après chargement pour éviter le survol automatique prématuré
- Nettoyage explicite des cartes de conjoint avant chargement de nouvelle vue
- Gestion silencieuse des 404 pour les personnes sans conjoint"
```

Ou exécutez simplement le script :
```bash
./scripts/commit_spouses_fix.sh
```
