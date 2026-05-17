import '@testing-library/jest-dom';

// ── Mock HTMLCanvasElement.getContext ─────────────────────────────────────────
// jsdom ne supporte pas Canvas 2D sans le package npm `canvas`.
// FanCanvasV2 utilise un canvas hors-écran pour la mesure de texte (measureText).
// En test, getContext retourne null → measureText retourne 0 → adaptName retourne
// le nom complet (branche avail <= 0 dans adaptName). Comportement correct.
// Le mock supprime le console.error "not implemented" de jsdom.
HTMLCanvasElement.prototype.getContext = jest.fn(() => null) as typeof HTMLCanvasElement.prototype.getContext;

// ── Mock window.matchMedia ────────────────────────────────────────────────────
// jsdom ne l'implémente pas ; nécessaire pour useIsMobile (AtelierView) et
// useMediaQuery (TopBar).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
