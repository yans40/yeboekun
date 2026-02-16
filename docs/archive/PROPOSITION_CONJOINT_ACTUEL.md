# 💑 Proposition : Affichage du Conjoint Actuel

## 📊 État Actuel
- ✅ La personne centrale est affichée au niveau 0 (en bas)
- ✅ Les frères/sœurs sont au même niveau (niveau 0) avec style grisé
- ✅ Les enfants sont en dessous (niveau -1) avec style grisé
- ❌ Le conjoint actuel n'est pas encore affiché

## 🎯 Options Proposées

### **Option A : Côté à Côté avec la Personne Centrale (RECOMMANDÉE)** ⭐

**Principe :** Le conjoint actuel est positionné à côté de la personne centrale, au même niveau (niveau 0).

**Avantages :**
- ✅ Position logique et intuitive (côte à côte = couple)
- ✅ Harmonie visuelle avec le reste du design
- ✅ Facile à comprendre
- ✅ Permet de voir les deux membres du couple ensemble

**Caractéristiques :**
- Position : À droite de la personne centrale (ou à gauche si préféré)
- Style : Bordure distincte mais harmonieuse (ex: bordure violette `#9C27B0` ou verte `#4CAF50`)
- Taille : Identique à la personne centrale (200px)
- Connexion : Ligne horizontale entre les deux (rose `#E24A90` pour mariage)
- Cliquable : Oui, pour voir la vue éventail du conjoint

**Structure visuelle :**
```
        [Grands-parents]
              ↓
        [Parents]
              ↓
[Frère] [Personne Centrale] ──── [Conjoint Actuel] [Sœur]
              ↓
    [Enfant 1] [Enfant 2] [Enfant 3]
```

---

### **Option B : Légèrement au-dessus**

**Principe :** Le conjoint est positionné légèrement au-dessus de la personne centrale (niveau -0.5).

**Avantages :**
- ✅ Distinction visuelle claire
- ✅ Montre la hiérarchie (personne centrale = focus principal)

**Inconvénients :**
- ❌ Moins intuitif (le conjoint devrait être au même niveau)
- ❌ Peut créer de la confusion avec les parents

---

### **Option C : Style "Carte Couple"**

**Principe :** Les deux cartes sont dans un conteneur visuel commun (bordure ou fond partagé).

**Avantages :**
- ✅ Montre clairement qu'ils forment un couple
- ✅ Design moderne et élégant

**Inconvénients :**
- ❌ Plus complexe à implémenter
- ❌ Peut encombrer visuellement

---

## 🎨 Recommandation : Option A (Côté à Côté)

### Détails d'Implémentation

#### 1. **Positionnement**
```javascript
// Positionner le conjoint à droite de la personne centrale
const centralPersonX = cardPositions.get(centralPersonId);
const spouseX = centralPersonX + cardWidth + 50; // 50px d'espacement
const spouseY = centralPersonY; // Même niveau Y
```

#### 2. **Style CSS**
```css
.genealogy-card.spouse {
    border-color: #9C27B0; /* Violet pour distinguer */
    border-width: 2px;
    border-style: solid;
    background: white;
    opacity: 1; /* Pas grisé, c'est important */
}

.genealogy-card.spouse:hover {
    border-color: #7B1FA2;
    box-shadow: 0 6px 20px rgba(156, 39, 176, 0.3);
}
```

#### 3. **Connexion de Mariage**
```javascript
// Ligne horizontale entre la personne centrale et le conjoint
const marriageLine = document.createElement('div');
marriageLine.className = 'family-connection connection-marriage';
marriageLine.style.left = (centralPersonX + cardWidth) + 'px';
marriageLine.style.top = (centralPersonY + 90) + 'px'; // Milieu vertical
marriageLine.style.width = '50px';
marriageLine.style.height = '2px';
marriageLine.style.background = '#E24A90'; // Rose pour mariage
```

#### 4. **Intégration dans le Tri Chronologique**
- Si le conjoint a des frères/sœurs, il doit être intégré dans le tri chronologique
- Mais avec une distinction visuelle claire (bordure violette)

#### 5. **Gestion des Cas Spéciaux**
- **Conjoint actuel uniquement** : Afficher seulement le conjoint actuel (mariage sans EndDate)
- **Pas de conjoint** : Ne rien afficher
- **Plusieurs mariages** : Afficher seulement le conjoint actuel (le plus récent sans EndDate)

---

## 📝 Plan d'Implémentation

1. **Modifier `buildGenerations()`**
   - Détecter le conjoint actuel depuis `familyData.spouse` ou les relations de mariage
   - Ajouter le conjoint au niveau 0 (même niveau que la personne centrale)

2. **Adapter le Positionnement**
   - Intégrer le conjoint dans le tri chronologique des siblings
   - Ou le positionner toujours à droite de la personne centrale

3. **Ajouter le Style**
   - Créer la classe `.spouse` avec bordure violette
   - S'assurer que le conjoint n'est pas grisé

4. **Dessiner la Connexion**
   - Ligne horizontale rose entre la personne centrale et le conjoint
   - Style cohérent avec les autres connexions

5. **Rendre Cliquable**
   - Le conjoint doit être cliquable pour voir sa vue éventail

---

## 🎨 Palette de Couleurs Proposée

- **Bordure conjoint :** `#9C27B0` (violet) ou `#4CAF50` (vert)
- **Connexion mariage :** `#E24A90` (rose, déjà utilisé)
- **Opacité :** `1.0` (pas grisé, c'est important)

---

## ❓ Questions à Valider

1. **Position :** Toujours à droite de la personne centrale, ou intégré dans le tri chronologique avec les siblings ?
2. **Couleur :** Violet (`#9C27B0`) ou vert (`#4CAF50`) pour la bordure ?
3. **Conjoints multiples :** Si plusieurs mariages, afficher tous les conjoints ou seulement l'actuel ?
4. **Connexion :** Ligne horizontale simple ou avec un symbole (cœur, anneau) ?

---

**Recommandation finale :** Implémenter l'**Option A (Côté à Côté)** avec :
- Position : À droite de la personne centrale
- Bordure : Violette (`#9C27B0`)
- Connexion : Ligne horizontale rose (`#E24A90`)
- Cliquable : Oui
