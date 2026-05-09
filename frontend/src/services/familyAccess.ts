import axios from 'axios';

export type FamilyVerifyErrorKind = 'network' | 'unauthorized' | 'unknown';

export interface AccessStatus {
  gateEnabled: boolean;
  accessGranted: boolean;
}

/** Classe l'erreur après un POST /api/access/verify (réseau vs refus serveur). */
export function classifyVerifyPasswordError(err: unknown): FamilyVerifyErrorKind {
  if (!axios.isAxiosError(err)) {
    return 'unknown';
  }
  const status = err.response?.status;
  if (status === 401) {
    return 'unauthorized';
  }
  // Pas de réponse HTTP : coupure réseau, timeout, CORS, serveur injoignable…
  if (err.response === undefined) {
    return 'network';
  }
  return 'unknown';
}

export async function fetchAccessStatus(): Promise<AccessStatus> {
  const { data } = await axios.get<AccessStatus>('/api/access/status', {
    withCredentials: true,
  });
  return data;
}

export async function verifyFamilyPassword(password: string): Promise<void> {
  await axios.post('/api/access/verify', { password }, { withCredentials: true });
}

export async function logoutFamilyAccess(): Promise<void> {
  await axios.post('/api/access/logout', {}, { withCredentials: true });
}
