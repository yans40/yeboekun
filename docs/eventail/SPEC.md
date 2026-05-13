# Vue Contemplation — Spec officielle (v4 hybride)

> Validée par le PO — 2026-05-13. Ne pas rouvrir.

---

## Décision retenue : Option C — Panneau + recentrage opt-in

| Geste | Comportement |
|---|---|
| Clic sur un secteur | Ouvre le panneau de détail (fiche personne) |
| Bouton "Faire d'elle le centre" | Recentre l'éventail sur cette personne (geste délibéré) |
| Fil d'ariane (focus-bar) | Permet de revenir à l'ego initial |

**Pourquoi C ?**
- Consultation rapide par défaut (panneau seul, éventail stable)
- Contemplation = geste délibéré, jamais piégeux
- Pattern testable sans animation lourde sur chaque clic

**Rejet A** (panneau seul) : l'éventail devient un tableau de bord, les ancêtres restent abstraits.  
**Rejet B** (recentrage direct) : un clic curieux devient un voyage non désiré.

---

## Palette couleurs — secteurs (à ajouter dans tokens.ts)

```ts
// Ascendants — gradient brun chaud (génération 1 = proche, 5 = lointain)
asc1: '#3D342A',   // génération 1
asc2: '#5A4528',   // génération 2
asc3: '#7D5A36',   // génération 3
asc4: '#9C7849',   // génération 4
asc5: '#BFA180',   // génération 5

// Descendants — vert olive
desc1: '#52582F',  // génération 1
desc2: '#6A7242',  // génération 2
```

---

## Composants clés

### Secteur (sector)
```css
stroke: ivory  stroke-width: 1  cursor: pointer
:hover  → filter: brightness(1.08)  stroke: ink  stroke-width: 1.6
:focus-visible → stroke: rust  stroke-width: 2  (pas d'outline natif)
.selected → stroke: rust  stroke-width: 2.4
.empty → fill: transparent  stroke: #CABFA6  stroke-width: 0.6  (pas de hover)
```

### Ego disc (centre)
```css
fill: cream  stroke: ink2  stroke-width: 1.4  cursor: pointer
```

### Panneau de détail
- Position : absolue, top 32 / right 32, width 360px
- Décalé à top 88 quand focus-bar active (`#board.has-focus`)
- Slide-in depuis la droite (translateX + opacity)
- Contenu : gen-tag (mono 9px), name (Cormorant italic), dates (mono 12px), meta grid, bouton recenter

### Bouton "Faire d'elle le centre" (recenter)
```css
background: sepia (#7D5A36)  color: ivory  width: 100%  padding: 14px 16px
:hover → background: #9C7849
Icône → après le texte
```

### Focus-bar (fil d'ariane)
```css
height: 0 → 56px (animé)  background: ink  color: ivory
Texte : "Tu vois le monde de <strong>Prénom Nom</strong>"
Bouton retour : border ink2, hover background ink2
```

---

## Question backend à cadrer (sous-lot 3.0)

Le recentrage opt-in exige que l'API serve ascendants + descendants depuis **n'importe quel personId**, pas seulement l'ego initial. L'endpoint `GET /api/persons/{id}/tree` doit accepter un `personId` quelconque comme racine — à confirmer avec Ada avant implémentation Léo.

---

## Fichiers de référence

| Fichier | Rôle |
|---|---|
| `design/eventail/eventail-v4.html` | Prototype interactif officiel |
| `design/eventail/eventail-v2.html` | Tracé de raisonnement (consultation pure) |
| `design/eventail/eventail-v3.html` | Tracé de raisonnement (recentrage direct) |
