# Baseline QA — GegeDot Frontend

> **Date** : 2026-05-01
> **Branche** : `dev` · commit `daff275`
> **Vue mesurée** : `/` (arbre vertical — vue principale, sans sélection de personne)
> **Méthode** : `npm run build` → `vite preview :4175` → Lighthouse CLI headless (Chrome)
>
> ⚠️ **FROZEN — Run officiel unique. Ne pas modifier.**
> Toute mesure ultérieure se compare à celle-ci. Les seuils contractuels par lot sont dans ce fichier.
> Référencé par [QA_LOT_1_FOUNDATION.md](./QA_LOT_1_FOUNDATION.md).

---

## Bundle size

| Fichier | Raw | Gzip | Note |
|---|---|---|---|
| `dist/assets/index-tkW5AjWU.js` | **462.55 kB** | **146 kB** | 1 seul chunk — pas de code-splitting |
| `dist/index.html` | 0.91 kB | 0.54 kB | |
| **Total `dist/`** | **456 kB** | — | `du -sh dist/` |
| Chunk count | **1** | — | Objectif Lot 1 : ≥ 2 (vendor split) |

### Requêtes réseau au chargement (6 total)

| Type | Taille transfert | URL |
|---|---|---|
| Document | 1 kB | `/` |
| Stylesheet | 1 kB | `fonts.googleapis.com` (Inter) ⚠️ bloquante |
| Script | **143 kB** | `/assets/index-tkW5AjWU.js` |
| Font | 47 kB | `fonts.gstatic.com` (Inter woff2) |
| XHR | 0 kB | `/api/persons` (404 en preview — normal) |

---

## Scores Lighthouse

| Catégorie | Score | Statut |
|---|---|---|
| Performance | **92** | 🟡 |
| Accessibility | **95** | 🟢 |
| Best Practices | **96** | 🟢 |
| SEO | **82** | 🟡 |

---

## Core Web Vitals

| Métrique | Valeur | Score LH | Statut |
|---|---|---|---|
| First Contentful Paint (FCP) | **2 611 ms** | 0.63 | 🟡 Needs improvement |
| Largest Contentful Paint (LCP) | **2 709 ms** | 0.85 | 🟡 Needs improvement |
| Total Blocking Time (TBT) | **0 ms** | 1.00 | 🟢 Good |
| Cumulative Layout Shift (CLS) | **0** | 1.00 | 🟢 Good |
| Speed Index | **2 701 ms** | 0.96 | 🟢 Good |
| Time to Interactive (TTI) | **2 709 ms** | 0.97 | 🟢 Good |

---

## Problèmes identifiés

### Performance

| Problème | Économie estimée | Cause racine |
|---|---|---|
| Font Inter (Google Fonts) bloquante | **−1 030 ms** FCP | `<link>` sans `preload`, pas de `font-display: swap` |
| 66 kB JS inutilisés | −180 ms | MUI icons non tree-shaken + code de vues non encore routées |

### Accessibility — score **95**

| Audit | Score | Détail |
|---|---|---|
| `color-contrast` | **0** | Textes `rgb(156,163,175)` (#9CA3AF, Tailwind gray-400) sur fond clair — ratio insuffisant. 3 nœuds. Fichiers : `AppSidebar.tsx` et `GenealogyCard.tsx` |

Exemples de nœuds en échec :
```html
<span style="color: rgb(156, 163, 175)">...</span>
<div style="font-size: 11px; font-weight: 600; color: rgb(156, 163, 175);">
```

### SEO — score **82**

| Audit | Score | Action |
|---|---|---|
| `meta-description` | **0** | Absent de `index.html` |
| `robots-txt` | **0** | 26 erreurs — fichier absent |

### Best Practices — score **96**

| Audit | Score | Détail |
|---|---|---|
| `errors-in-console` | **0** | 404 `/api/persons` + 500 backend en preview (attendus hors dev-server) |

---

## Seuils de non-régression par lot

Ces seuils sont contractuels : un merge qui fait régresser une valeur en-dessous est bloqué.

| Métrique | Baseline | Lot 0 | Lot 1 | Lot 2 | Lot 3 |
|---|---|---|---|---|---|
| Perf score | 92 | ≥ 92 | ≥ 90 | ≥ 90 | ≥ 92 |
| A11y score | 95 | ≥ 95 | ≥ 95 | ≥ 95 | ≥ 95 |
| Best Practices | 96 | ≥ 96 | ≥ 96 | ≥ 96 | ≥ 96 |
| SEO | 82 | ≥ 82 | **≥ 90** | ≥ 90 | ≥ 90 |
| FCP | 2 611 ms | ≤ 2 611 ms | **≤ 1 800 ms** | ≤ 1 800 ms | ≤ 1 500 ms |
| LCP | 2 709 ms | ≤ 2 709 ms | **≤ 2 000 ms** | ≤ 2 000 ms | ≤ 1 800 ms |
| TBT | 0 ms | ≤ 50 ms | ≤ 50 ms | ≤ 100 ms | ≤ 100 ms |
| CLS | 0 | ≤ 0.05 | ≤ 0.05 | ≤ 0.05 | ≤ 0.05 |
| Bundle JS gzip | 146 kB | ≤ 146 kB | ≤ 180 kB | ≤ 220 kB | ≤ 280 kB |
| Chunk count | 1 | 1 | **≥ 2** | ≥ 3 | ≥ 3 |

> Lot 1 : la tolérance bundle monte à 180 kB gzip pour absorber react-router-dom + react-i18next. Le code-splitting (vendor chunk) doit compenser.

---

## Comment re-mesurer

```bash
# 1. Build
cd frontend && npm run build

# 2. Preview
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npx vite preview --port 4174 &
sleep 4

# 3. Lighthouse
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" npx lighthouse http://localhost:4174 \
  --output json \
  --output-path /tmp/lighthouse-$(date +%Y%m%d).json \
  --chrome-flags="--headless --no-sandbox --disable-gpu" \
  --only-categories=performance,accessibility,best-practices,seo \
  --quiet

# 4. Extraire les scores
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" node -e "
  const r = JSON.parse(require('fs').readFileSync('/tmp/lighthouse-$(date +%Y%m%d).json'));
  Object.entries(r.categories).forEach(([k,v]) => console.log(k, Math.round(v.score*100)));
  ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].forEach(k => {
    const a = r.audits[k]; if(a) console.log(k, a.displayValue);
  });
"

# 5. Bundle size
du -sh dist/ && ls -la dist/assets/*.js
pkill -f 'vite preview'
```
