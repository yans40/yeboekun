import '@testing-library/jest-dom';

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
