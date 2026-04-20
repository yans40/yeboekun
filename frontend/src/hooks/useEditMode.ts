import { useState, useCallback } from 'react';
import { EDIT_PASSWORD } from '../config';

const SESSION_KEY = 'gege_edit_mode';

export function useEditMode() {
  const [canEdit, setCanEdit] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  const enterEditMode = useCallback((password: string): boolean => {
    if (password === EDIT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setCanEdit(true);
      return true;
    }
    return false;
  }, []);

  const exitEditMode = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setCanEdit(false);
  }, []);

  return { canEdit, enterEditMode, exitEditMode };
}
