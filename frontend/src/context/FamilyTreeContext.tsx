import { createContext, useContext } from 'react';
import type { Person } from '../types';

interface FamilyTreeContextValue {
  persons: Person[];
  selectedPersonId: number | null;
  onPersonSelect: (id: number | null) => void;
  canEdit: boolean;
  onOpenEditModal: () => void;
  onExitEditMode: () => void;
}

export const FamilyTreeContext = createContext<FamilyTreeContextValue | null>(null);

export function useFamilyTreeContext(): FamilyTreeContextValue {
  const ctx = useContext(FamilyTreeContext);
  if (!ctx) throw new Error('useFamilyTreeContext must be used inside AppShell');
  return ctx;
}
