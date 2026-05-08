/**
 * Tests de useRecentPersons.
 *
 * Stratégie :
 *   - localStorage mocké via jest.spyOn pour contrôler les lectures/écritures.
 *   - Teste read/write, déduplication, max 5, clearRecentPersons.
 *   - Teste la dégradation silencieuse si localStorage est indisponible.
 */

import { renderHook, act } from '@testing-library/react';
import { useRecentPersons } from '../hooks/useRecentPersons';
import type { RecentPerson } from '../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'yeboekun:recent';

/** Crée une RecentPerson minimale avec un timestamp fixe (pour les comparaisons). */
function makeRecent(id: number, timestamp = id * 1000): RecentPerson {
  return { id, firstName: `Prénom${id}`, lastName: `Nom${id}`, timestamp };
}

/** Simule un localStorage initialisé avec des données. */
function seedStorage(persons: RecentPerson[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  // Date.now mocké pour des timestamps prévisibles dans les tests d'insertion.
  jest.spyOn(Date, 'now').mockReturnValue(99999);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useRecentPersons — lecture initiale', () => {
  it('retourne une liste vide si localStorage est vide', () => {
    const { result } = renderHook(() => useRecentPersons());
    expect(result.current.recentPersons).toEqual([]);
  });

  it('retourne les données existantes si localStorage est pré-rempli', () => {
    const existing = [makeRecent(1), makeRecent(2)];
    seedStorage(existing);

    const { result } = renderHook(() => useRecentPersons());
    expect(result.current.recentPersons).toEqual(existing);
  });

  it('retourne une liste vide si localStorage contient du JSON invalide', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    const { result } = renderHook(() => useRecentPersons());
    expect(result.current.recentPersons).toEqual([]);
  });

  it('retourne une liste vide si localStorage contient un non-tableau', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
    const { result } = renderHook(() => useRecentPersons());
    expect(result.current.recentPersons).toEqual([]);
  });
});

describe('useRecentPersons — addRecentPerson', () => {
  it('ajoute une personne en tête de liste', () => {
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.addRecentPerson({ id: 1, firstName: 'Alice', lastName: 'Martin' });
    });

    expect(result.current.recentPersons).toHaveLength(1);
    expect(result.current.recentPersons[0]).toMatchObject({
      id: 1,
      firstName: 'Alice',
      lastName: 'Martin',
      timestamp: 99999,
    });
  });

  it('insère en tête si plusieurs personnes ajoutées successivement', () => {
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.addRecentPerson({ id: 1, firstName: 'Alice', lastName: 'A' });
    });
    act(() => {
      result.current.addRecentPerson({ id: 2, firstName: 'Bob', lastName: 'B' });
    });

    expect(result.current.recentPersons[0].id).toBe(2);
    expect(result.current.recentPersons[1].id).toBe(1);
  });

  it('persiste dans localStorage après ajout', () => {
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.addRecentPerson({ id: 5, firstName: 'Kofi', lastName: 'Mensah' });
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as RecentPerson[];
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(5);
  });
});

describe('useRecentPersons — déduplication', () => {
  it('déplace une personne déjà présente en tête sans créer de doublon', () => {
    seedStorage([makeRecent(1), makeRecent(2), makeRecent(3)]);
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.addRecentPerson({ id: 3, firstName: 'Prénom3', lastName: 'Nom3' });
    });

    expect(result.current.recentPersons).toHaveLength(3);
    expect(result.current.recentPersons[0].id).toBe(3);
    // 1 et 2 restent présents.
    expect(result.current.recentPersons.map(p => p.id)).toEqual([3, 1, 2]);
  });

  it('met à jour le timestamp quand on remonte une personne existante', () => {
    seedStorage([makeRecent(1, 1000)]);
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.addRecentPerson({ id: 1, firstName: 'Prénom1', lastName: 'Nom1' });
    });

    expect(result.current.recentPersons[0].timestamp).toBe(99999);
  });
});

describe('useRecentPersons — limite max 5', () => {
  it('conserve au maximum 5 entrées en éliminant la plus ancienne', () => {
    seedStorage([makeRecent(1), makeRecent(2), makeRecent(3), makeRecent(4), makeRecent(5)]);
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.addRecentPerson({ id: 6, firstName: 'Nouveau', lastName: 'Venu' });
    });

    expect(result.current.recentPersons).toHaveLength(5);
    expect(result.current.recentPersons[0].id).toBe(6);
    // La personne 5 (la plus ancienne après insertion de 6) est éliminée.
    const ids = result.current.recentPersons.map(p => p.id);
    expect(ids).not.toContain(5);
  });

  it('garde bien max 5 même avec beaucoup d\'ajouts successifs', () => {
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      for (let i = 1; i <= 10; i++) {
        result.current.addRecentPerson({ id: i, firstName: `P${i}`, lastName: `N${i}` });
      }
    });

    expect(result.current.recentPersons).toHaveLength(5);
  });
});

describe('useRecentPersons — clearRecentPersons', () => {
  it('vide la liste en mémoire', () => {
    seedStorage([makeRecent(1), makeRecent(2)]);
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.clearRecentPersons();
    });

    expect(result.current.recentPersons).toEqual([]);
  });

  it('supprime la clé dans localStorage', () => {
    seedStorage([makeRecent(1)]);
    const { result } = renderHook(() => useRecentPersons());

    act(() => {
      result.current.clearRecentPersons();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('useRecentPersons — dégradation si localStorage indisponible', () => {
  it('retourne une liste vide si localStorage.getItem lance', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('localStorage unavailable');
    });

    const { result } = renderHook(() => useRecentPersons());
    expect(result.current.recentPersons).toEqual([]);
  });

  it('ne plante pas si localStorage.setItem lance lors d\'un ajout', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useRecentPersons());

    expect(() => {
      act(() => {
        result.current.addRecentPerson({ id: 1, firstName: 'Alice', lastName: 'A' });
      });
    }).not.toThrow();

    // La liste en mémoire est quand même mise à jour malgré l'échec localStorage.
    expect(result.current.recentPersons).toHaveLength(1);
  });
});
