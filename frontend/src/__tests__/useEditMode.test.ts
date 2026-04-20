import { renderHook, act } from '@testing-library/react';
import { useEditMode } from '../hooks/useEditMode';

jest.mock('../config', () => ({ EDIT_PASSWORD: 'secret123' }));

describe('useEditMode', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('is not in edit mode by default', () => {
    const { result } = renderHook(() => useEditMode());
    expect(result.current.canEdit).toBe(false);
  });

  it('restores edit mode state from sessionStorage', () => {
    sessionStorage.setItem('gege_edit_mode', '1');
    const { result } = renderHook(() => useEditMode());
    expect(result.current.canEdit).toBe(true);
  });

  it('enterEditMode with correct password sets canEdit and persists in sessionStorage', () => {
    const { result } = renderHook(() => useEditMode());

    let ok: boolean;
    act(() => { ok = result.current.enterEditMode('secret123'); });

    expect(ok!).toBe(true);
    expect(result.current.canEdit).toBe(true);
    expect(sessionStorage.getItem('gege_edit_mode')).toBe('1');
  });

  it('enterEditMode with wrong password returns false and does not enable edit mode', () => {
    const { result } = renderHook(() => useEditMode());

    let ok: boolean;
    act(() => { ok = result.current.enterEditMode('wrong'); });

    expect(ok!).toBe(false);
    expect(result.current.canEdit).toBe(false);
    expect(sessionStorage.getItem('gege_edit_mode')).toBeNull();
  });

  it('exitEditMode clears canEdit and sessionStorage', () => {
    sessionStorage.setItem('gege_edit_mode', '1');
    const { result } = renderHook(() => useEditMode());

    act(() => { result.current.exitEditMode(); });

    expect(result.current.canEdit).toBe(false);
    expect(sessionStorage.getItem('gege_edit_mode')).toBeNull();
  });
});
