import axios from 'axios';

export interface AccessStatus {
  gateEnabled: boolean;
  accessGranted: boolean;
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
