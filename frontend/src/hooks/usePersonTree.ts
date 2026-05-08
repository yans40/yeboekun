/**
 * usePersonTree — charge GET /api/persons/{id}/tree?up=N&down=N
 *
 * Retourne les nœuds de l'arbre centré sur une personne donnée,
 * avec un nombre de générations ascendantes (up) et descendantes (down) paramétrable.
 *
 * Contraintes :
 *   - Aucun new Date() : les dates restent en string "yyyy-MM-dd".
 *   - Annule la requête précédente si personId change (AbortController).
 *   - personId null → pas de fetch, data null, loading false.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PersonTreeDto } from '../types';

export interface UsePersonTreeOptions {
  /** Nombre de générations ascendantes à charger (défaut : 5). */
  up?: number;
  /** Nombre de générations descendantes à charger (défaut : 2). */
  down?: number;
}

export interface UsePersonTreeResult {
  data: PersonTreeDto | null;
  loading: boolean;
  error: string | null;
}

export function usePersonTree(
  personId: number | null,
  options: UsePersonTreeOptions = {},
): UsePersonTreeResult {
  const { up = 5, down = 2 } = options;

  const [data, setData]       = useState<PersonTreeDto | null>(null);
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
      .get<PersonTreeDto>(`/api/persons/${personId}/tree`, {
        params: { up, down },
        signal: controller.signal,
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return; // requête annulée intentionnellement
        const message =
          err instanceof Error ? err.message : "Erreur inconnue lors du chargement de l'arbre.";
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [personId, up, down]);

  return { data, loading, error };
}
