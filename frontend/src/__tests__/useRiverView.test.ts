import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useRiverView } from '../hooks/useRiverView';
import type { RiverViewData } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const minimalData: RiverViewData = {
  rootId: 1,
  nodes: [
    {
      id: 1, firstName: 'Kofi', lastName: 'Mensah',
      birthDate: '1975-03-12', deathDate: null,
      isAlive: true, gender: 'M',
      generation: 0, column: 0,
    },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedAxios.isCancel.mockReturnValue(false);
});

describe('useRiverView — personId null', () => {
  it('ne déclenche aucun fetch et retourne { data:null, loading:false, error:null }', () => {
    const { result } = renderHook(() => useRiverView(null));
    expect(result.current).toEqual({ data: null, loading: false, error: null });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});

describe('useRiverView — fetch réussi', () => {
  it('retourne les données et loading=false après résolution', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: minimalData });

    const { result } = renderHook(() => useRiverView(1, 3));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(minimalData);
    expect(result.current.error).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/persons/1/river-view',
      expect.objectContaining({ params: { depth: 3 } }),
    );
  });
});

describe('useRiverView — erreur réseau', () => {
  it('expose le message et loading=false, data=null', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useRiverView(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network Error');
    expect(result.current.data).toBeNull();
  });

  it('utilise le message générique quand l\'erreur n\'est pas une instance Error', async () => {
    mockedAxios.get.mockRejectedValueOnce('timeout');

    const { result } = renderHook(() => useRiverView(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Erreur inconnue lors du chargement de la vue rivière.');
    expect(result.current.data).toBeNull();
  });
});

describe('useRiverView — annulation (axios.isCancel)', () => {
  it('ignore l\'erreur d\'annulation et ne met pas error', async () => {
    const cancelError = new Error('canceled');
    mockedAxios.get.mockRejectedValueOnce(cancelError);
    mockedAxios.isCancel.mockReturnValue(true);

    const { result } = renderHook(() => useRiverView(1));

    await new Promise(res => setTimeout(res, 0));

    expect(result.current.error).toBeNull();
  });
});

describe('useRiverView — cleanup AbortController', () => {
  it('appelle controller.abort() au démontage', () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');
    mockedAxios.get.mockResolvedValue({ data: minimalData });

    const { unmount } = renderHook(() => useRiverView(1));
    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
