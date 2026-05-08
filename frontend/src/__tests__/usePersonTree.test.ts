import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { usePersonTree } from '../hooks/usePersonTree';
import type { PersonTreeDto } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const minimalTree: PersonTreeDto = {
  rootId: 1,
  nodes: [
    {
      id: 1, firstName: 'Kofi', lastName: 'Mensah',
      birthDate: '1975-03-12', deathDate: null,
      gender: 'M', photoUrl: null,
      generation: 0, parentIds: [], childIds: [],
    },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedAxios.isCancel.mockReturnValue(false);
});

describe('usePersonTree — personId null', () => {
  it('ne déclenche aucun fetch et retourne { data:null, loading:false, error:null }', () => {
    const { result } = renderHook(() => usePersonTree(null));
    expect(result.current).toEqual({ data: null, loading: false, error: null });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});

describe('usePersonTree — fetch réussi', () => {
  it('retourne les données et loading=false après résolution', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: minimalTree });

    const { result } = renderHook(() => usePersonTree(1, { up: 3, down: 1 }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(minimalTree);
    expect(result.current.error).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/persons/1/tree',
      expect.objectContaining({ params: { up: 3, down: 1 } }),
    );
  });
});

describe('usePersonTree — erreur réseau (instance Error)', () => {
  it('expose le message et loading=false, data=null', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => usePersonTree(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network Error');
    expect(result.current.data).toBeNull();
  });
});

describe('usePersonTree — erreur non-Error (fallback message)', () => {
  it('utilise le message générique quand l\'erreur n\'est pas une instance Error', async () => {
    mockedAxios.get.mockRejectedValueOnce('timeout');

    const { result } = renderHook(() => usePersonTree(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Erreur inconnue lors du chargement de l'arbre.");
  });
});

describe('usePersonTree — annulation (axios.isCancel)', () => {
  it('ignore l\'erreur d\'annulation et ne met pas error ni loading=false', async () => {
    const cancelError = new Error('canceled');
    mockedAxios.get.mockRejectedValueOnce(cancelError);
    mockedAxios.isCancel.mockReturnValue(true);

    const { result } = renderHook(() => usePersonTree(1));

    // Laisser la promesse se rejeter
    await new Promise(res => setTimeout(res, 0));

    // loading reste true (cancel ignoré), pas d'erreur
    expect(result.current.error).toBeNull();
  });
});

describe('usePersonTree — cleanup AbortController', () => {
  it('appelle controller.abort() au démontage du composant', () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    mockedAxios.get.mockResolvedValue({ data: minimalTree });

    const { unmount } = renderHook(() => usePersonTree(1));
    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
