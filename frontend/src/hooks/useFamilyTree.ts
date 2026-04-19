import { useState, useCallback } from 'react';
import { FamilyData, FamilyTreeLayout, SpouseInfo } from '../types';
import { buildLayout } from '../utils/familyTreeLayout';
import apiService from '../services/api';

export interface FamilyTreeState {
  familyData: FamilyData | null;
  layout: FamilyTreeLayout | null;
  loading: boolean;
  error: string | null;
}

export function useFamilyTree() {
  const [state, setState] = useState<FamilyTreeState>({
    familyData: null,
    layout: null,
    loading: false,
    error: null,
  });

  const loadFamilyTree = useCallback(async (personId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const raw = await apiService.getFamilyData(personId);
      // Le backend /family retourne `spouse` (singulier, PersonDto|null) plutôt que `spouses`.
      // On normalise ici pour notre interface FamilyData qui attend spouses: SpouseInfo[].
      const rawAny = raw as any;
      let spouses: SpouseInfo[] = Array.isArray(raw.spouses) ? raw.spouses : [];
      if (spouses.length === 0 && rawAny.spouse) {
        spouses = [{ spouse: rawAny.spouse }];
      }
      const familyData: FamilyData = { ...raw, spouses };
      const layout = buildLayout(familyData);
      setState({ familyData, layout, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'arbre';
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  const clearTree = useCallback(() => {
    setState({ familyData: null, layout: null, loading: false, error: null });
  }, []);

  return { ...state, loadFamilyTree, clearTree };
}
