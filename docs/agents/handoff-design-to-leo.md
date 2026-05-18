# Handoff Claude Design → Léo (frontend)

Prompt prêt à coller dans Claude Code (ou dans une conversation Claude où l'agent `yeboekun-frontend-architect` est actif) une fois que le ZIP exporté depuis Claude Design est posé dans `design/hifi-v1/`.

---

## Prompt à coller

> Léo, j'ai posé un nouveau design hi-fi exporté depuis Claude Design dans `design/hifi-v1/`. C'est ma référence visuelle officielle pour la prochaine itération du frontend.
>
> **Étape 1 — Lecture.** Parcours `design/hifi-v1/` (HTML, CSS, assets). Identifie : la palette utilisée, la typographie, l'échelle d'espacement, les radius, les ombres, les composants distincts, les écrans présents. Si tu vois plusieurs variantes du même écran, signale-le.
>
> **Étape 2 — Comparaison à l'existant.** Lis en parallèle :
> - `frontend/src/App.tsx`
> - `frontend/src/components/AppSidebar.tsx`
> - `frontend/src/components/FanCanvas.tsx`
> - `frontend/src/components/GenealogyCard.tsx`, `PersonCard.tsx`, `PersonForm.tsx`
> - `frontend/src/hooks/useFamilyTree.ts`
> - `PLAN_UI_SHELL.md`
>
> Note les écarts entre le design et le code actuel : ce qui existe déjà et correspond, ce qui existe mais doit être refactoré, ce qui n'existe pas du tout.
>
> **Étape 3 — Livrables attendus** (dans ta réponse, dans cet ordre) :
>
> 1. **Diagnostic** (5 lignes max) : à quel point le design hi-fi est compatible avec l'existant, et quel est l'effort global estimé (S/M/L).
> 2. **Tokens de design à extraire** : tableau des couleurs, typographies, spacings, radius, ombres, breakpoints détectés dans le ZIP. Propose une organisation (par exemple `frontend/src/theme/tokens.ts` consommé par le `ThemeProvider` MUI).
> 3. **Inventaire des composants** : pour chaque composant React identifié dans le design, dis s'il faut **créer**, **refactorer un existant** (cite le fichier) ou **réutiliser tel quel**. Mentionne quand un composant MUI 7 couvre déjà le besoin.
> 4. **Plan d'implémentation incrémental en 3 lots** :
>     - **Lot 1 (S, ~1–3 jours)** : tokens + shell (sidebar, topbar, panneau latéral). Sans toucher à l'éventail.
>     - **Lot 2 (M, ~1 semaine)** : composants de fiche personne et formulaire selon le nouveau design. Toujours sans toucher à l'éventail.
>     - **Lot 3 (L, ~1–2 semaines)** : intégration dans `FanCanvas` et tout ce qui est tangent à la vue éventail, avec tests visuels et benchmarks.
> 5. **Risques** : ce qui pourrait casser, ce qui demande une décision produit avant de coder, ce qui pose un problème d'accessibilité ou de perf.
> 6. **Questions ouvertes** : un maximum de **3 questions** que tu veux me poser avant de démarrer le Lot 1.
>
> **Contraintes non négociables**
> - Ne pas toucher à la logique de rendu de la vue éventail tant qu'on n'est pas au Lot 3.
> - Ne pas créer de nouveau fichier HTML statique dans `frontend/` à la racine. Tout passe par des composants React + TypeScript.
> - Respecter le modèle de domaine : 13 types de relations, conjoints multiples, `DeathStatus` libre, personnes vivantes vs décédées. Pas de DNA, pas d'origines géographiques.
> - Tout texte d'interface doit passer par une fonction `t()` (i18n) même si on n'a qu'une seule langue pour l'instant.
>
> Quand tu as fini, ne code rien encore. Je veux d'abord valider ton plan.

---

## Après la réponse de Léo

- Tranche les questions ouvertes.
- Donne le feu vert pour le **Lot 1** uniquement.
- Demande à Léo de créer les fichiers du Lot 1 + tests + une PR description.
- Fais une **revue croisée avec Ada** si le design implique des données nouvelles ou des appels API supplémentaires : *"Ada, lis le plan de Léo dans la conversation précédente et dis-moi si quelque chose impacte le contrat d'API."*
