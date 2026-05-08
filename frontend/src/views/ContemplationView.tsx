/**
 * ContemplationView — wrapper pour la vue éventail SVG (Lot 3).
 *
 * Responsabilités :
 *   1. Lire selectedPersonId depuis FamilyTreeContext.
 *   2. Déclencher usePersonTree(selectedPersonId, { up:5, down:2 }).
 *   3. Gérer les états loading / error / no-selection.
 *   4. Passer PersonTreeDto à FanCanvasV2.
 *
 * Remplace le PlaceholderView sur /contempler quand VUE_CONTEMPLATION_ENABLED=true.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import { usePersonTree } from '../hooks/usePersonTree';
import FanCanvasV2 from '../components/FanCanvasV2';
import { colors, fonts } from '../theme/tokens';

export default function ContemplationView() {
  const { t } = useTranslation();
  const { selectedPersonId } = useFamilyTreeContext();
  const { data, loading, error } = usePersonTree(selectedPersonId, { up: 5, down: 2 });

  // ── Aucune personne sélectionnée ──────────────────────────────────────────
  if (selectedPersonId === null) {
    return (
      <div
        data-testid="contemplation-no-selection"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
          gap: 12,
        }}
      >
        <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 22, color: colors.ink3 }}>
          {t('contemplation.no_selection')}
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.ink4 }}>
          {t('contemplation.no_selection_hint')}
        </span>
      </div>
    );
  }

  // ── Chargement ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        data-testid="contemplation-loading"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.ink4 }}>
          {t('common.loading')}
        </span>
      </div>
    );
  }

  // ── Erreur ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        data-testid="contemplation-error"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.rust }}>
          {t('common.error')} — {error}
        </span>
      </div>
    );
  }

  // ── Données absentes (ne devrait pas arriver si loading=false et error=null) ──
  if (!data) return null;

  // ── Rendu principal ───────────────────────────────────────────────────────
  return (
    <div
      data-testid="contemplation-view"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: colors.paper,
      }}
    >
      <FanCanvasV2 data={data} />
    </div>
  );
}
