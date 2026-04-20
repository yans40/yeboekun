import { renderHook, act } from '@testing-library/react';
import { useAdmin } from '../hooks/useAdmin';

jest.mock('../config', () => ({ ADMIN_PASSWORD: 'secret123' }));

describe('useAdmin', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('is not admin by default', () => {
    const { result } = renderHook(() => useAdmin());
    expect(result.current.isAdmin).toBe(false);
  });

  it('restores admin state from sessionStorage', () => {
    sessionStorage.setItem('gege_admin', '1');
    const { result } = renderHook(() => useAdmin());
    expect(result.current.isAdmin).toBe(true);
  });

  it('login with correct password sets isAdmin and persists in sessionStorage', () => {
    const { result } = renderHook(() => useAdmin());

    let ok: boolean;
    act(() => { ok = result.current.login('secret123'); });

    expect(ok!).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(sessionStorage.getItem('gege_admin')).toBe('1');
  });

  it('login with wrong password returns false and does not set admin', () => {
    const { result } = renderHook(() => useAdmin());

    let ok: boolean;
    act(() => { ok = result.current.login('wrong'); });

    expect(ok!).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(sessionStorage.getItem('gege_admin')).toBeNull();
  });

  it('logout clears isAdmin and sessionStorage', () => {
    sessionStorage.setItem('gege_admin', '1');
    const { result } = renderHook(() => useAdmin());

    act(() => { result.current.logout(); });

    expect(result.current.isAdmin).toBe(false);
    expect(sessionStorage.getItem('gege_admin')).toBeNull();
  });
});
