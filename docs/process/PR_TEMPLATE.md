# Template de Pull Request

À copier dans `.github/PULL_REQUEST_TEMPLATE.md` (qui existe déjà — fusionner/remplacer selon le contenu actuel).

---

```markdown
## Lot concerné
<!-- Lot 1 / Lot 2 / Hotfix / Chore -->

## Résumé
<!-- 2-3 phrases : qu'est-ce qui change, pourquoi ? -->

## Changements visibles utilisateur
- [ ] Aucun (refacto / chore)
- [ ] Mineur (style, copy)
- [ ] Majeur (nouvelle vue, nouveau flow)

## Périmètre technique
<!-- Liste les composants / fichiers touchés -->

## Hors périmètre (volontaire)
<!-- Ce qui n'est PAS dans cette PR et qui sera fait dans un autre lot -->

## Captures / vidéos
<!-- Avant / après si visuel impacté -->

## Tests
- [ ] Tests unitaires ajoutés ou mis à jour
- [ ] Tests d'intégration ajoutés ou mis à jour
- [ ] Test manuel exécuté (décrire ci-dessous)

## Non-régression
- [ ] Arbre vertical (`/`) testé : OK
- [ ] Admin (`/admin`) testé : OK
- [ ] Autres vues activées testées : OK
- [ ] Build production OK
- [ ] Bundle size diff : <indiquer la valeur, doit être ≤ +15 %>

## Backend impacté
- [ ] Non
- [ ] Oui (changements coordonnés avec Ada — lien vers PR backend ci-dessous)

## Feature flag
- [ ] Pas de flag (refacto / Lot 1)
- [ ] Flag : `<NOM_DU_FLAG>` — défaut : OFF en prod / ON en staging

## Checklist QA Challenger (Iris)
À remplir par Iris avant de poser le label `qa-validated`.

- [ ] Checklist du lot exécutée intégralement
- [ ] Tentatives de cassage explicites menées (cas tordus listés ci-dessous)
- [ ] Lighthouse perf ≥ baseline
- [ ] A11y : navigation clavier OK, contrastes WCAG AA
- [ ] i18n : 0 chaîne hardcodée ajoutée

### Cas tordus testés
<!-- Iris liste ici les edge cases qu'elle a explicitement tentés -->
1. 
2. 
3. 

## Risques connus / dette acceptée
<!-- Si on accepte de la dette dans cette PR, l'expliciter avec un ticket de suivi -->
```
