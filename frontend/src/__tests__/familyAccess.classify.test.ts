import axios from 'axios';
import { classifyVerifyPasswordError } from '../services/familyAccess';

describe('classifyVerifyPasswordError', () => {
  it('retourne unauthorized pour une réponse 401', () => {
    const err = new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 401,
      data: {},
      statusText: 'Unauthorized',
      headers: {},
      config: {} as never,
    });
    expect(classifyVerifyPasswordError(err)).toBe('unauthorized');
  });

  it('retourne network sans réponse HTTP', () => {
    const err = new axios.AxiosError('Network Error', 'ERR_NETWORK');
    expect(classifyVerifyPasswordError(err)).toBe('network');
  });

  it('retourne unknown pour une autre erreur HTTP', () => {
    const err = new axios.AxiosError('Server Error', 'ERR_BAD_RESPONSE', undefined, undefined, {
      status: 500,
      data: {},
      statusText: 'Error',
      headers: {},
      config: {} as never,
    });
    expect(classifyVerifyPasswordError(err)).toBe('unknown');
  });

  it('retourne unknown pour une erreur non axios', () => {
    expect(classifyVerifyPasswordError(new Error('x'))).toBe('unknown');
  });
});
