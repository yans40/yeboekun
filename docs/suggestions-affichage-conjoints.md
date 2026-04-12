# Suggestions — Affichage des conjoints dans l'arbre généalogique

> **Statut :** en attente de décision. Les conjoints sont actuellement détectés (API `/family` → champ `spouse`) et normalisés dans `useFamilyTree.ts`, mais non affichés dans le canvas.

---

## Contexte technique

- Le backend `/persons/{id}/family` retourne `spouse: PersonDto | null` (singulier).
- `useFamilyTree.ts` normalise ce champ en `spouses: SpouseInfo[]` pour compatibilité future.
- `types/index.ts` contient déjà `SpousePair`, `isSpouse` sur `CardPosition`, et `spousePairs` sur `FamilyTreeLayout`.
- L'infrastructure est prête — seul le rendu manque.

---

## Plan A — Panel latéral coulissant (overlay)

**Interaction :** picto 💍 sur la carte → panel qui glisse depuis la droite du canvas.

```
┌─────────────────┐              ┌──────────────────────┐
│   EDDARD STARK  │   clic 💍   │  ╔══════════════════╗ │
│  1263 — 1298    │  ─────────► │  ║ CATELYN TULLY    ║ │
│              💍 │              │  ║ 1264 — 1299      ║ │
└─────────────────┘              │  ║ Mariage : actif  ║ │
                                 │  ╚══════════════════╝ │
                                 └──────────────────────┘
```

**Pour :** non intrusif, peut afficher date de mariage + statut (actif/terminé), plusieurs conjoints historiques bien listés.
**Contre :** cache une partie du canvas, navigation moins fluide.

---

## Plan B — Carte conjoint dans le canvas (expansion in-place)

**Interaction :** clic sur 💍 → carte du conjoint apparaît à droite de la personne (fondu + ligne de mariage violette). Re-clic → carte disparaît.

```
Avant :                         Après :
┌─────────────────┐             ┌─────────────────┐══╗══┌─────────────────┐
│   EDDARD STARK  │             │   EDDARD STARK  │  ║  │  CATELYN TULLY  │
│  1263 — 1298    │   clic 💍   │  1263 — 1298    │  ║  │  1264 — 1299    │
│              💍 │  ─────────► │              💍 │  ║  │                 │
└─────────────────┘             └─────────────────┘══╝══└─────────────────┘
```

**Pour :** visuellement très clair, conjoint dans le flux de l'arbre, enfants se réorganisent automatiquement.
**Contre :** re-calcul du layout à chaque toggle, peut perturber l'espace visuel.

---

## Plan C — Tooltip / popover au hover (navigation directe)

**Interaction :** hover sur la carte → tooltip léger avec nom(s) du/des conjoint(s). Clic sur le nom → charge l'arbre du conjoint (il devient la personne centrale).

```
                        ┌────────────────────┐
┌─────────────────┐     │ 💍 Catelyn Tully   │
│   EDDARD STARK  │ ◄── │    1264 — 1299     │
│  1263 — 1298    │     │    [→ voir l'arbre]│
│              💍 │     └────────────────────┘
└─────────────────┘
```

**Pour :** zéro perturbation du layout, très léger, navigation naturelle (cliquer → centrer sur le conjoint).
**Contre :** le conjoint n'est jamais "dans" l'arbre, vue couple + enfants impossible directement.

---

## Plan D — Mode "vue couple" (double carte persistante) ⭐ Recommandé long-terme

**Interaction :** picto 💍 → bascule en "mode couple" : carte centrale côte à côte avec le conjoint, enfants sous les deux. Bouton ✕ revient à la vue solo.

```
         ┌──────────────┐  ══  ┌──────────────┐
         │ EDDARD STARK │  💍  │ CATELYN TULLY│
         │ 1263 — 1298  │      │ 1264 — 1299  │
         └──────────────┘      └──────────────┘
                   │                  │
              ─────┴──────────────────┴─────
              │      │      │      │       │
            ROBB   SANSA  ARYA   BRAN  RICKON
```

**Pour :** vue la plus complète généalogiquement, enfants rattachés au couple, convention standard des arbres.
**Contre :** plus complexe (layout à deux centraux), à planifier soigneusement.

---

## Recommandation

| Court terme | Long terme |
|-------------|-----------|
| **Plan C** (tooltip + navigation) | **Plan D** (mode couple) |
| Rapide à implémenter, zéro régression | Vision généalogique complète |

---

## Fichiers à modifier pour l'implémentation

| Fichier | Rôle |
|---------|------|
| `frontend/src/components/GenealogyCard.tsx` | Ajouter le picto 💍 et son handler |
| `frontend/src/utils/familyTreeLayout.ts` | Réactiver le placement des conjoints (sections commentées) |
| `frontend/src/components/ConnectionLayer.tsx` | Réactiver les lignes de mariage |
| `frontend/src/hooks/useFamilyTree.ts` | Déjà prêt (normalisation `spouse` → `spouses`) |
| `frontend/src/components/FanCanvas.tsx` | Gérer l'état "conjoint visible" si Plan B ou D |
