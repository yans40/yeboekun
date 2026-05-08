import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../config/featureFlags', () => ({
  VUE_TABLEAU_ENABLED: true,
}));

import { useStats, MOCK_STATS } from '../hooks/useStats';

describe('useStats — fallback DEV sur MOCK_STATS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.isCancel.mockReturnValue(false);
  });

  it('retourne MOCK_STATS si le fetch echoue en mode tableau DEV', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('backend down'));

    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(MOCK_STATS);
    expect(result.current.error).toBeNull();
  });
});
