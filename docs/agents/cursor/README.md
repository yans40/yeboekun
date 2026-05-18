# Agents Cursor pour Yeboekun / Yeboekun

Quatre agents spécialisés pour prendre le relais quand la limite Claude Code est atteinte. Trois miroirs des agents Claude Code (avec prénoms distincts pour différencier les sources) plus un PO orchestrateur dédié à Cursor (Victor) qui a son homologue côté Claude Code (Émile).

## Casting

| Claude Code | Cursor | Rôle |
|---|---|---|
| Léo | **Théo** | Frontend lead (React 19 + TS + MUI 7) |
| Ada | **Léna** | Backend lead (.NET 9 + EF Core + MySQL) |
| Iris | **Alma** | QA challenger / release manager |
| **Émile** | **Victor** | PO / orchestrateur (point d'entrée par défaut) |

Les prénoms permettent de savoir d'où vient une décision dans l'historique : si tu lis "Léo a tranché X" dans une discussion, c'est Claude Code. Si "Théo a tranché X", c'est Cursor.

**Architecture à deux POs.** Émile (Claude Code) et Victor (Cursor) partagent le fichier `docs/PROJECT_STATE.md` qui est leur mémoire commune : lot en cours, décisions actées, bloqueurs, cache de résumés. Quand tu bascules d'un IDE à l'autre, le nouveau PO lit STATE et reprend sans rien te demander. Pas besoin que les deux POs "se parlent" — STATE.md est le pont.

## Installation

Cursor lit les rules dans `.cursor/rules/*.mdc`. Pour activer ces agents (depuis la racine du repo) :

```bash
mkdir -p .cursor/rules
cp docs/agents/cursor/theo-frontend.md   .cursor/rules/theo-frontend.mdc
cp docs/agents/cursor/lena-backend.md    .cursor/rules/lena-backend.mdc
cp docs/agents/cursor/alma-qa.md         .cursor/rules/alma-qa.mdc
cp docs/agents/cursor/victor-po.md       .cursor/rules/victor-po.mdc
```

Ajoute `.cursor/` à ton `.gitignore` si tu ne veux pas versionner les rules locales (recommandé — la source de vérité reste `docs/agents/cursor/`).

## Comment ça marche

### Victor est le point d'entrée

Sa rule `victor-po.mdc` a `alwaysApply: true`. Quand tu ouvres Cursor et que tu engages la conversation, c'est Victor qui répond par défaut. Il lit `docs/agents/cursor/STATE.md` (qu'il crée à la première session si absent), te demande la priorité du jour en une question, et délègue à Théo / Léna / Alma selon le besoin.

### Les spécialistes sont scopés

Théo, Léna, Alma ont des `globs` dans leur frontmatter qui les activent automatiquement quand tu ouvres un fichier de leur domaine :

- Théo se réveille sur `frontend/**`
- Léna se réveille sur `backend/**`
- Alma se réveille sur `docs/qa/**`, `docs/process/**`, `.github/**`

Tu peux aussi les invoquer explicitement dans le chat avec `@theo-frontend`, `@lena-backend`, `@alma-qa`.

### Héritage des Claude Code

Les trois miroirs **lisent leur spec parente** au démarrage (`docs/agents/yeboekun-frontend-architect.md` etc.). C'est pour ça que les Cursor rules sont courtes : tout le contenu lourd est déjà documenté côté Claude Code, on ne duplique pas. Si tu modifies la spec d'un agent, tu modifies son fichier parent dans `docs/agents/`, et le miroir Cursor suit automatiquement.

## Optimisation des tokens (la mission de Victor)

Cursor facture au token comme Claude Code, et la conversation peut vite gonfler quand on enchaîne les agents. Victor applique 8 règles non négociables (cf. `victor-po.md`) :

1. Lis une fois, résume pour tous (cache dans `STATE.md`).
2. Réponses 5-15 lignes max sauf demande explicite.
3. Pas de re-explication des décisions actées.
4. Brief sans préambule.
5. Diff plutôt que dump.
6. Questions groupées (1 message = N questions numérotées).
7. Coupe les boucles à 3 échanges max sur un même point.
8. Refuse les missions floues.

## STATE.md — le cache de coordination

Victor maintient `docs/agents/cursor/STATE.md` à jour. Ce fichier est la source de vérité de l'état projet entre sessions Cursor, le cache de résumés (pour éviter aux spécialistes de re-lire les mêmes fichiers), le journal des décisions actées, et le backlog priorisé.

Tu peux le lire manuellement quand tu veux faire le point. Victor le maintient automatiquement.

## Workflow type

1. Tu ouvres Cursor, tu tapes : *"Hello"* ou *"Où on en est ?"*.
2. Victor répond en 1 ligne, lit `STATE.md`, te demande la priorité du jour.
3. Tu lui dis : *"Lot 1, démarre Théo sur la section i18n"*.
4. Victor formule un brief court à Théo, Théo prend la main.
5. Quand Théo a fini une sous-section, il rend à Victor.
6. Victor décide : continuer Théo, basculer à Léna pour un check API, ou solliciter Alma pour un check perf.
7. À la fin de la session, Victor te livre un standup de 5 lignes.

## Quand préférer Cursor à Claude Code

- Tu as atteint ta limite Claude Code et tu veux continuer.
- Tu fais du travail très in-IDE (refacto multi-fichiers, navigation par symboles).
- Tu veux garder l'historique de la session locale dans le repo (Cursor stocke dans `.cursor/`).

## Quand préférer Claude Code à Cursor

- Tu fais du brainstorming produit ou de la stratégie (Claude Code est meilleur en réponses longues structurées).
- Tu travailles avec des MCP servers (Cursor en a moins).
- Tu veux les agents Léo / Ada / Iris (les "originaux") pour leur registre éprouvé.

## Synchronisation entre les deux mondes

Si tu fais une partie du travail dans Claude Code et l'autre dans Cursor, le `STATE.md` est la mémoire partagée. Victor (côté Cursor) le maintient à jour. Les agents Claude Code ne le lisent pas par défaut, mais tu peux leur demander d'en tenir compte au début de chaque session.

## À éviter

- N'invoque pas Théo + Léo simultanément sur la même tâche frontend — ils vont diverger sur les choix de code.
- Ne demande pas à Victor d'écrire du code de production. Si tu veux qu'il code, tu le délègues à Théo ou Léna.
- Ne supprime pas `STATE.md` à la légère — c'est la mémoire de Victor.
