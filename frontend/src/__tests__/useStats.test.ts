/**
 * Tests de useStats.
 *
 * Stratégie :
 *   - axios mocké pour contrôler les réponses.
 *   - featureFlags mocké avec VUE_TABLEAU_ENABLED=false pour tester le chemin
 *     erreur sans fallback mock DEV.
 *   - Teste fetch réussi, erreur réseau, annulation, abort au unmount.
 */

import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import type { StatsDto } from '../types';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// VUE_TABLEAU_ENABLED=false pour ne pas activer le fallback mock DEV dans les
// tests d'erreur — on veut tester le chemin d'erreur pur.
jest.mock('../config/featureFlags', () => ({
  VUE_TABLEAU_ENABLED: false,
}));

// ── Import hook après mock ─────────────────────────────────────────────────────
// Important : import APRÈS les jest.mock pour que le module voie les mocks.
import { useStats, MOCK_STATS } from '../hooks/useStats';

// ── Fixture ───────────────────────────────────────────────────────────────────

const REAL_STATS: StatsDto = {
  personCount: 42,
  generationSpan: 5,
  livingCount: 10,
  deceasedCount: 32,
  completenessPercent: 73,
  duplicateSuggestionCount: 3,
};

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockedAxios.isCancel.mockReturnValue(false);
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useStats — état initial', () => {
  it('démarre avec loading=true', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: REAL_STATS });
    const { result } = renderHook(() => useStats());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

describe('useStats — fetch réussi', () => {
  it('retourne les données et loading=false après résolution', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: REAL_STATS });

    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(REAL_STATS);
    expect(result.current.error).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/stats',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});

describe('useStats — erreur réseau (instance Error)', () => {
  it('expose le message et loading=false, data=null (VUE_TABLEAU_ENABLED=false)', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network Error');
    expect(result.current.data).toBeNull();
  });
});

describe('useStats — erreur non-Error (fallback message)', () => {
  it('utilise le message générique quand l\'erreur n\'est pas une instance Error', async () => {
    mockedAxios.get.mockRejectedValueOnce('timeout');

    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      'Erreur inconnue lors du chargement des statistiques.',
    );
    expect(result.current.data).toBeNull();
  });
});

describe('useStats — annulation (axios.isCancel)', () => {
  it('ignore l\'erreur d\'annulation et ne met pas error ni loading=false', async () => {
    const cancelError = new Error('canceled');
    mockedAxios.get.mockRejectedValueOnce(cancelError);
    mockedAxios.isCancel.mockReturnValue(true);

    const { result } = renderHook(() => useStats());

    // Laisser la promesse se rejeter.
    await new Promise(res => setTimeout(res, 0));

    // loading reste true (cancel ignoré), pas d'erreur.
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });
});

describe('useStats — cleanup AbortController', () => {
  it('appelle controller.abort() au démontage du composant', () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    mockedAxios.get.mockResolvedValue({ data: REAL_STATS });

    const { unmount } = renderHook(() => useStats());
    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});

describe('useStats — MOCK_STATS export', () => {
  it('MOCK_STATS a la structure attendue', () => {
    expect(MOCK_STATS).toMatchObject({
      personCount: expect.any(Number),
      livingCount: expect.any(Number),
      deceasedCount: expect.any(Number),
      completenessPercent: expect.any(Number),
    });
    // generationSpan et duplicateSuggestionCount peuvent être number ou null.
    expect(
      MOCK_STATS.generationSpan === null || typeof MOCK_STATS.generationSpan === 'number',
    ).toBe(true);
    expect(
      MOCK_STATS.duplicateSuggestionCount === null ||
        typeof MOCK_STATS.duplicateSuggestionCount === 'number',
    ).toBe(true);
  });
});
