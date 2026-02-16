# Plan : Habillage UI - Sidebar et Panneau Ancestral Info (adapté)

**Statut** : Implémenté — DNA et Geographic Origins retirés comme prévu.

## Contexte

- **Fichier cible** : `frontend/professional-fan-view.html`
- **Contrainte** : Ne pas modifier la logique de l'arbre
- **Stack** : CSS vanilla
- **Adaptation** : Pas d'origines géographiques ni de DNA pour le moment

---

## Architecture du layout

```
┌─────────────┬──────────────────────────────────────┬─────────────────┐
│  Sidebar    │  Main (toolbar + arbre)              │  Panneau droit  │
│  240px      │  flex: 1                             │  320px          │
│             │                                      │                 │
│  Logo       │  [Personne] [Ajouter] [Recharger]    │  Ancestral      │
│  Nav        │  [Zoom]                              │  Insights       │
│  - Dashboard│  ─────────────────────────────────   │                 │
│  - Tree     │  ┌─────────────────────────────┐     │  Based on X     │
│  - Photos   │  │                             │     │  ancestors      │
│  - Records  │  │     ARBRE (inchangé)        │     │                 │
│  - Hints    │  │                             │     │  Generations   │
│  ─────────  │  └─────────────────────────────┘     │  Mapped: 5      │
│  Profil     │                                      │                 │
└─────────────┴──────────────────────────────────────┴─────────────────┘
```

---

## 1. Structure HTML

```html
<div class="app-shell">
  <aside class="sidebar">...</aside>
  <main class="main-content">
    <div class="toolbar">[controls]</div>
    <div id="status" class="status"></div>
    <div class="tip-banner">[astuce]</div>
    <div class="visualization-container"><!-- ARBRE INCHANGÉ --></div>
  </main>
  <aside class="ancestral-panel">...</aside>
</div>
```

---

## 2. Design System (CSS)

Variables : `--color-bg: #F7F9FC`, `--color-primary: #3B82F6`, `--color-accent: #14B8A6`, `--color-border: #E5E7EB`, `--shadow-soft`, `--radius-card: 12px`, `--radius-btn: 8px`, police Inter.

---

## 3. Sidebar (gauche)

- 240px (72px collapsed)
- Nav : Dashboard, Tree (actif), Photos, Records, Hints (DNA retiré)
- Profil en bas
- Collapsible avec transition 200ms

---

## 4. Panneau Ancestral Info (droite) – simplifié

**Sections conservées :**

1. **Header**
   - Titre : "Ancestral Insights"
   - Sous-titre : "Based on X ancestors" (X = nombre d'ancêtres dans la vue, dérivé de `familyData`)
   - Dropdown pour changer de personne (lié au `personSelect` existant)

2. **Generations Mapped**
   - Grand chiffre (ex. 5)
   - Légende : "Generations discovered"
   - Badge optionnel : "+X new hints" (placeholder ou masqué)

**Sections retirées :**
- ~~Geographic Origins~~ (origines géographiques)
- ~~Activity Summary (Records, Photos, DNA)~~ (DNA et activité retirés)

Le panneau reste léger et focalisé sur les données réellement disponibles (ancêtres, générations).

---

## 5. Données dynamiques

```javascript
function updateAncestralPanel(familyData) {
  const count = countAncestors(familyData);  // parents + grands-parents + ...
  const depth = getGenerationDepth(familyData);
  document.getElementById('ancestorCount').textContent = count;
  document.getElementById('generationDepth').textContent = depth;
}
```

Appel à la fin de `renderFanView(familyData)`.

---

## 6. Responsive

- >= 1200px : sidebar 240px, panneau 320px
- 900–1200px : sidebar collapsed, panneau en drawer
- < 640px : sidebar hamburger, panneau en modal sheet

---

## 7. Ordre d'implémentation

1. Variables CSS + police Inter
2. Structure HTML app-shell
3. Sidebar (sans DNA dans la nav)
4. Panneau (Header + Generations Mapped uniquement)
5. Main + marges
6. `updateAncestralPanel` dans `renderFanView`
7. Responsive
