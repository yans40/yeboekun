/**
 * Tests unitaires pour familyAccess.ts.
 * Couvre les 3 fonctions exportées via un mock axios.
 */

const mockGet  = jest.fn();
const mockPost = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get:  (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    defaults: { withCredentials: false },
  },
}));

import { fetchAccessStatus, verifyFamilyPassword, logoutFamilyAccess } from '../services/familyAccess';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchAccessStatus', () => {
  it('retourne le statut quand le garde-fou est actif et accès accordé', async () => {
    mockGet.mockResolvedValue({ data: { gateEnabled: true, accessGranted: true } });
    const result = await fetchAccessStatus();
    expect(result).toEqual({ gateEnabled: true, accessGranted: true });
    expect(mockGet).toHaveBeenCalledWith('/api/access/status', { withCredentials: true });
  });

  it('retourne gateEnabled:false quand le garde-fou est désactivé', async () => {
    mockGet.mockResolvedValue({ data: { gateEnabled: false, accessGranted: true } });
    const result = await fetchAccessStatus();
    expect(result.gateEnabled).toBe(false);
  });

  it('propage les erreurs réseau', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));
    await expect(fetchAccessStatus()).rejects.toThrow('Network Error');
  });
});

describe('verifyFamilyPassword', () => {
  it('POST /api/access/verify avec le mot de passe', async () => {
    mockPost.mockResolvedValue({});
    await verifyFamilyPassword('secret123');
    expect(mockPost).toHaveBeenCalledWith(
      '/api/access/verify',
      { password: 'secret123' },
      { withCredentials: true },
    );
  });

  it('rejette si le serveur répond 401', async () => {
    mockPost.mockRejectedValue({ response: { status: 401 } });
    await expect(verifyFamilyPassword('wrong')).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('logoutFamilyAccess', () => {
  it('POST /api/access/logout', async () => {
    mockPost.mockResolvedValue({});
    await logoutFamilyAccess();
    expect(mockPost).toHaveBeenCalledWith(
      '/api/access/logout',
      {},
      { withCredentials: true },
    );
  });
});
