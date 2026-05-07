# Yeboekun — pack final · Direction B

**Tagline retenue :** La mémoire des liens
**Date :** 06 mai 2026 · v1 final

## Arborescence

```
svg/
  yeboekun-y-sankofa.svg          Y monogramme seul · currentColor + var(--accent)
  yeboekun-wordmark.svg           Wordmark complet · encre
  yeboekun-wordmark-inverse.svg   Wordmark · accent ambré pour fond sombre
  yeboekun-favicon.svg            Y monogramme optimisé pour petites tailles
  splash-1440x900.svg             Composition splash avec tagline

png/
  yeboekun-favicon-32.png         Favicon classique
  yeboekun-favicon-64.png
  yeboekun-favicon-192.png        Android home screen
  yeboekun-favicon-512.png        PWA / store icon
  apple-touch-icon-180.png        iOS (avec fond ivoire incrusté)
  splash-1440x900.png             Raster du splash

spec/
  brand-spec.html                 Spécification consolidée (Direction B)
  tagline-study.html              Étude de la tagline en 3 contextes
```

## Notes pour la production

- **Outline du wordmark** : les SVG `yeboekun-wordmark*.svg` utilisent un `<text>` Cormorant Garamond Italic via Google Fonts. Pour une vraie indépendance vis-à-vis de la font (favicon, splash imprimé, T-shirt, etc.), **convertir en paths dans Illustrator** (Type → Create Outlines) ou Figma (Outline stroke). Le rendu navigateur fonctionne tel quel grâce à @import dans le SVG.
- **CSS variables** : `color: #1F1A14` pour l'encre principale, `--accent: #7D5A36` pour l'œuf. Sur fond sombre, passer `color: #F4EFE6` et `--accent: #D9A56A`.
- **Échelle minimale** : 24 px pour le wordmark, 36 px pour le Y seul. En dessous : voir Direction A (pictogramme dissocié).
- **Apple touch icon** : fond ivoire incrusté à 14 % de marge — pas de transparence.

## Palette finale

| Nom              | Hex      | Usage                  |
|------------------|----------|------------------------|
| Encre profonde   | #1F1A14  | Wordmark principal     |
| Encre tiède      | #3D342A  | Wordmark alternatif    |
| Sépia            | #7D5A36  | Œuf · accent           |
| Sépia clair      | #D9A56A  | Accent inversé         |
| Crème            | #FAF6EC  | Fond clair             |
| Ivoire           | #F4EFE6  | Fond standard          |
