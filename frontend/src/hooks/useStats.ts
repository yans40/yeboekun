/**
 * useStats — charge GET /api/stats.
 *
 * Retourne les statistiques globales de l'arbre familial.
 *
 * Contraintes :
 *   - Annule la requête en vol si le composant est démonté (AbortController).
 *   - Mock actif uniquement en DEV via VUE_TABLEAU_ENABLED (pattern Jest-safe :
 *     le flag est importé depuis featureFlags, jamais import.meta.env directement).
 *   - Aucun new Date() : les dates restent en string si elles arrivent.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { StatsDto } from '../types';
import { VUE_TABLEAU_ENABLED } from '../config/featureFlags';

// ── Mock DEV ──────────────────────────────────────────────────────────────────
/**
 * Données de démo utilisées en DEV quand le backend n'est pas disponible.
 * Ce mock est retourné uniquement si le fetch échoue ET que VUE_TABLEAU_ENABLED=true.
 */
export const MOCK_STATS: StatsDto = {
  personCount: 13,
  generationSpan: 4,
  livingCount: 4,
  deceasedCount: 9,
  completenessPercent: 85,
  duplicateSuggestionCount: 2,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UseStatsResult {
  data: StatsDto | null;
  loading: boolean;
  error: string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useStats(): UseStatsResult {
  const [data, setData]       = useState<StatsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get<StatsDto>('/api/stats', { signal: controller.signal })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return; // requête annulée intentionnellement

        // En DEV, fallback sur le mock si le backend n'est pas disponible.
        if (VUE_TABLEAU_ENABLED) {
          setData(MOCK_STATS);
          setLoading(false);
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : 'Erreur inconnue lors du chargement des statistiques.';
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}
