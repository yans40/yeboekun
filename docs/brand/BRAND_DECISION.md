# Yeboekun — Décision d'identité de marque

**Date** : 2026-05-03
**Statut** : actée — passe en production

## Direction retenue

**Direction B — Y monogramme intégré**

Le Y de "Yeboekun" est un Sankofa stylisé. La branche droite quitte la diagonale standard à mi-hauteur, décrit un quart de cercle de rayon 14 unités et retourne vers le centre (la tête qui se retourne). L'œuf est inscrit dans le creux du V — cercle de rayon 3.2, en couleur d'accent sépia. Tracé monoline 2.4 unités, hauteur de cap 64 unités.

Aucun pictogramme séparé. La marque tient en un seul signe.

## Wordmark

- Famille : **Cormorant Garamond Italic** (poids 500)
- Letter-spacing : `-0.025em`
- Le Y custom (SVG) précède la chaîne `eboekun` en italique
- Couleur principale : **encre `#1F1A14`**
- Accent (œuf uniquement) : **sépia `#7D5A36`**

## Tagline

**"La mémoire des liens"**

- Famille : **Geist Mono** (ou monospace équivalent)
- `font-size: 13px`, `letter-spacing: 0.22em`
- `text-transform: uppercase`
- Couleur : `ink2 #3D342A` sur fond ivoire
- Séparateur visuel : trait fin 64×1 px en `color.line` entre wordmark et tagline

## Palette officielle

| Token | Valeur | Usage |
|---|---|---|
| `ink` | `#1F1A14` | Wordmark principal |
| `ink2` | `#3D342A` | Tagline |
| `sepia` | `#7D5A36` | Accent (œuf Sankofa uniquement) |
| `ivory` | `#F4EFE6` | Fond principal |
| `cream` | `#FAF6EC` | Fond secondaire |
| `line` | `#CABFA6` | Séparateurs |
| `line2` | `#DDD2B8` | Séparateurs légers |

## Inversé (mode sombre)

- Fond : `ink #1F1A14`
- Wordmark : `ivory #F4EFE6`
- Accent œuf : `#D9A56A` (sépia légèrement éclairci pour contraste WCAG AA)

## Espace de protection

Égal à la hauteur de la lettre `o` du wordmark, sur les quatre côtés.

## Tailles minimales

- Wordmark complet : 22 px de hauteur de cap minimum
- Y monogramme seul : 24 px minimum (en dessous, basculer sur la version Direction A si jamais ré-introduite)

## Usages prévus

| Contexte | Composition | Taille |
|---|---|---|
| Favicon / app icon | Y monogramme seul, dans cadre ivoire arrondi | 32, 192, 512 px |
| TopBar app | Wordmark compact, sans tagline | hauteur 22 px |
| Splash screen | Wordmark + trait + tagline, centré | 1440×900 |
| Document / page interne | Wordmark + tagline en footer | variable |

## Symbole retenu

**Sankofa** — proverbe twi : *"Se wo were fi na wosankofa a yenkyi"* — *"il n'y a pas de mal à retourner chercher ce qu'on a oublié"*. À inscrire en note discrète sur la page de spécification de marque, en italique sépia, comme dédicace de l'identité.

## Source design

- ZIP original : `design/brand/yeboekun-design-source.zip`
- Direction B isolée : `design/brand/yk-dir-b.jsx`
- Composants SVG : `design/brand/yk-brand.jsx` (fonctions `YSankofa`, `WordmarkB`)
- Index complet : `design/brand/yeboekun.html`
