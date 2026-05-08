/**
 * useRecentPersons — gère l'historique des 5 dernières personnes consultées.
 *
 * Stockage : localStorage, clé 'yeboekun:recent'.
 * Format : tableau de RecentPerson trié par timestamp DESC (plus récent en tête).
 *
 * Règles :
 *   - Max 5 entrées (FIFO : la 6ème pousse la plus ancienne dehors).
 *   - Déduplication par id : si la personne est déjà présente, elle est déplacée
 *     en tête avec le nouveau timestamp.
 *   - Si localStorage est indisponible (SSR, erreur quota), le hook dégrade
 *     silencieusement vers un état vide sans lever d'exception.
 */

import { useState, useCallback } from 'react';
import type { RecentPerson } from '../types';

const STORAGE_KEY = 'yeboekun:recent';
const MAX_RECENT  = 5;

// ── Helpers localStorage ──────────────────────────────────────────────────────

function readFromStorage(): RecentPerson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as RecentPerson[];
  } catch {
    return [];
  }
}

function writeToStorage(persons: RecentPerson[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
  } catch {
    // Quota dépassé ou mode privé : on ignore silencieusement.
  }
}

// ── Types exports ─────────────────────────────────────────────────────────────

export interface UseRecentPersonsResult {
  /** Liste des personnes récentes (max 5, plus récente en tête). */
  recentPersons: RecentPerson[];
  /** Ajoute ou remonte une personne en tête de liste. */
  addRecentPerson: (person: Omit<RecentPerson, 'timestamp'>) => void;
  /** Vide complètement l'historique. */
  clearRecentPersons: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRecentPersons(): UseRecentPersonsResult {
  const [recentPersons, setRecentPersons] = useState<RecentPerson[]>(readFromStorage);

  const addRecentPerson = useCallback(
    (person: Omit<RecentPerson, 'timestamp'>) => {
      setRecentPersons(prev => {
        // Retirer l'entrée existante si elle est déjà présente (déduplication).
        const filtered = prev.filter(p => p.id !== person.id);
        // Insérer en tête avec le timestamp courant.
        const next: RecentPerson[] = [
          { ...person, timestamp: Date.now() },
          ...filtered,
        ].slice(0, MAX_RECENT);
        writeToStorage(next);
        return next;
      });
    },
    [],
  );

  const clearRecentPersons = useCallback(() => {
    setRecentPersons([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  return { recentPersons, addRecentPerson, clearRecentPersons };
}
