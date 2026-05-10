/**
 * useRiverView — charge GET /api/persons/{id}/river-view?depth=N
 *
 * Retourne le graphe de la Vue Rivière centré sur une personne donnée,
 * avec un nombre de générations (depth) paramétrable.
 *
 * Contraintes :
 *   - Aucun new Date() : les dates restent en string "yyyy-MM-dd".
 *   - Annule la requête précédente si personId change (AbortController).
 *   - personId null → pas de fetch, data null, loading false.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { RiverViewData } from '../types';

export interface UseRiverViewResult {
  data: RiverViewData | null;
  loading: boolean;
  error: string | null;
}

export function useRiverView(
  personId: number | null,
  depth = 3,
): UseRiverViewResult {
  const [data, setData]       = useState<RiverViewData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (personId === null) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get<RiverViewData>(`/api/persons/${personId}/river-view`, {
        params: { depth },
        signal: controller.signal,
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return; // requête annulée intentionnellement
        const message =
          err instanceof Error
            ? err.message
            : 'Erreur inconnue lors du chargement de la vue rivière.';
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [personId, depth]);

  return { data, loading, error };
}
