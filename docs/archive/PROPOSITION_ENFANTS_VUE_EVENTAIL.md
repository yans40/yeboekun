# 🌳 Proposition : Affichage des Enfants dans la Vue Éventail

## 📊 État Actuel
- ✅ Les enfants sont déjà disponibles dans l'API (`familyData.children`)
- ✅ La structure actuelle affiche : **Ascendants** (en haut) → **Personne centrale + Frères/Sœurs** (en bas)
- ❌ Les **descendants** (enfants, petits-enfants) ne sont pas encore affichés

## 🎯 Options Proposées

### **Option A : Structure Symétrique (RECOMMANDÉE)** ⭐

**Principe :** Enfants positionnés **en dessous** de la personne centrale, de manière symétrique aux ascendants.

```
Niveau 3: Arrière-grands-parents (en haut)
    ↓
Niveau 2: Grands-parents
    ↓
Niveau 1: Parents
    ↓
Niveau 0: Personne centrale + Frères/Sœurs
    ↓
Niveau -1: Enfants
    ↓
Niveau -2: Petits-enfants
    ↓
Niveau -3: Arrière-petits-enfants
```

**Avantages :**
- ✅ Structure intuitive et symétrique
- ✅ Cohérent avec la logique actuelle (ascendants en haut)
- ✅ Facile à comprendre visuellement
- ✅ Les connexions parent-enfant fonctionnent déjà dans les deux sens

**Implémentation :**
- Modifier `buildGenerations()` pour aussi charger les enfants récursivement
- Utiliser des niveaux négatifs pour les descendants
- Adapter le calcul de `centralPersonY` pour qu'il soit au milieu
- Les connexions descendantes utiliseront la même logique que les ascendantes (inversée)

---

### **Option B : Vue Expandable**

**Principe :** Bouton "Afficher les enfants" qui déploie une section en dessous.

**Avantages :**
- ✅ Vue compacte par défaut
- ✅ L'utilisateur choisit quand afficher les descendants
- ✅ Utile pour les personnes avec beaucoup d'enfants

**Inconvénients :**
- ❌ Nécessite une interaction supplémentaire
- ❌ Moins intuitif que l'affichage direct

---

### **Option C : Vue Horizontale**

**Principe :** Enfants positionnés à droite ou à gauche de la personne centrale.

**Avantages :**
- ✅ Peut être utile pour des arbres très larges
- ✅ Évite de faire défiler verticalement

**Inconvénients :**
- ❌ Moins intuitif (on s'attend à voir les descendants en dessous)
- ❌ Peut créer une vue très large difficile à naviguer

---

## 🎨 Recommandation : Option A (Structure Symétrique)

### Détails d'Implémentation

#### 1. **Modifier `buildGenerations()`**
```javascript
async function buildGenerations(familyData, maxDepthUp = 4, maxDepthDown = 3) {
    const generations = [];
    const processed = new Map();
    const familyDataCache = new Map();

    // Fonction pour charger les parents (ascendants)
    async function loadParentsRecursive(person, generation, maxDepth) { ... }

    // NOUVELLE fonction pour charger les enfants (descendants)
    async function loadChildrenRecursive(person, generation, maxDepth) {
        if (Math.abs(generation) >= maxDepth || processed.has(person.id)) {
            return;
        }

        processed.set(person.id, generation);

        // Créer la génération si elle n'existe pas
        if (!generations[generation]) {
            generations[generation] = [];
        }

        // Ajouter la personne à sa génération
        generations[generation].push({
            person: person,
            generation: generation,
            isCentral: generation === 0
        });

        // Charger les enfants si on n'a pas atteint la profondeur max
        if (Math.abs(generation) < maxDepth - 1) {
            try {
                const response = await fetch(`${API_BASE_URL}/persons/${person.id}/family`);
                if (response.ok) {
                    const childFamilyData = await response.json();
                    familyDataCache.set(person.id, childFamilyData);
                    
                    if (childFamilyData.children && childFamilyData.children.length > 0) {
                        for (const child of childFamilyData.children) {
                            await loadChildrenRecursive(child, generation - 1, maxDepth);
                        }
                    }
                }
            } catch (error) {
                console.warn(`Impossible de charger les enfants de ${person.id}:`, error);
            }
        }
    }

    // Commencer avec la personne centrale
    familyDataCache.set(familyData.person.id, familyData);
    await loadParentsRecursive(familyData.person, 0, maxDepthUp);
    await loadChildrenRecursive(familyData.person, 0, maxDepthDown);
    
    return { generations, familyDataCache };
}
```

#### 2. **Adapter le Positionnement**
- Calculer `centralPersonY` au milieu de toutes les générations (positives et négatives)
- Les niveaux négatifs seront positionnés en dessous de la personne centrale
- Utiliser la même logique de centrage pour les enfants que pour les parents

#### 3. **Adapter les Connexions**
- Les connexions descendantes (personne centrale → enfants) utiliseront la même logique que les ascendantes (inversée)
- Ligne du bas de la carte parent vers le haut de la carte enfant

#### 4. **Tri Chronologique des Enfants**
- Comme pour les frères/sœurs, trier les enfants par date de naissance
- Positionner la personne centrale dans l'ordre si elle a des frères/sœurs

### Exemple Visuel

```
                    [Grand-père]    [Grand-mère]
                          ↓              ↓
                    [Père] ──────── [Mère]
                          ↓              ↓
              [Frère] [Personne Centrale] [Sœur]
                          ↓
              [Enfant 1] [Enfant 2] [Enfant 3]
                          ↓
                    [Petit-enfant]
```

## 🚀 Plan d'Implémentation

1. **Phase 1 : Modification de `buildGenerations()`**
   - Ajouter la fonction `loadChildrenRecursive()`
   - Gérer les niveaux négatifs dans la structure des générations

2. **Phase 2 : Adaptation du Positionnement**
   - Calculer les positions Y pour les niveaux négatifs
   - Adapter le centrage pour inclure les descendants

3. **Phase 3 : Connexions Descendantes**
   - Adapter `drawConnections()` pour gérer les connexions vers les enfants
   - Tester avec plusieurs niveaux de descendants

4. **Phase 4 : Tri et Organisation**
   - Trier les enfants par date de naissance
   - Gérer les groupes d'enfants (même logique que pour les parents)

5. **Phase 5 : Tests et Ajustements**
   - Tester avec Charles Windsor (a des enfants)
   - Tester avec Rhaenyra Targaryen (a des enfants et petits-enfants)
   - Ajuster l'espacement et le centrage

## 📝 Notes Techniques

- Les enfants seront cliquables (comme les parents) pour naviguer vers leur vue éventail
- Le cache `familyDataCache` sera utilisé pour éviter les appels API redondants
- La fonction `centerOnPosition()` devra peut-être être ajustée pour centrer sur la personne centrale qui est maintenant au milieu (pas en bas)

## ❓ Questions à Valider

1. **Profondeur des descendants :** Combien de niveaux d'enfants afficher ? (Recommandation : 3 niveaux comme pour les ascendants)
2. **Tri des enfants :** Par date de naissance (du plus âgé au plus jeune) comme pour les frères/sœurs ?
3. **Centrage initial :** Centrer sur la personne centrale (qui sera maintenant au milieu) ou garder le comportement actuel ?

---

**Recommandation finale :** Implémenter l'**Option A (Structure Symétrique)** car elle est la plus intuitive, cohérente avec l'architecture actuelle, et offre la meilleure expérience utilisateur.
