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
import { VUE_CONTEMPLATION_ENABLED } from '../config/featureFlags';
import type { PersonTreeDto } from '../types';

// ── Mock tree (DEV uniquement, visible sans backend) ──────────────────────────
const MOCK_TREE: PersonTreeDto = {
  rootId: 1,
  nodes: [
    { id: 1,  firstName: 'Kofi',      lastName: 'Mensah',    birthDate: '1975-03-12', deathDate: null,         gender: 'M', photoUrl: null, generation:  0, parentIds: [2, 3],     childIds: [20, 21] },
    { id: 2,  firstName: 'Emmanuel',  lastName: 'Mensah',    birthDate: '1948-07-04', deathDate: '2019-11-22', gender: 'M', photoUrl: null, generation: -1, parentIds: [4, 5],     childIds: [1] },
    { id: 3,  firstName: 'Afia',      lastName: 'Asante',    birthDate: '1952-01-30', deathDate: null,         gender: 'F', photoUrl: null, generation: -1, parentIds: [6, 7],     childIds: [1] },
    { id: 4,  firstName: 'Kwame',     lastName: 'Mensah',    birthDate: '1920-05-18', deathDate: '1988-03-01', gender: 'M', photoUrl: null, generation: -2, parentIds: [8, 9],     childIds: [2] },
    { id: 5,  firstName: 'Akua',      lastName: 'Boateng',   birthDate: '1922-09-07', deathDate: '1995-06-14', gender: 'F', photoUrl: null, generation: -2, parentIds: [],         childIds: [2] },
    { id: 6,  firstName: 'Kofi',      lastName: 'Asante',    birthDate: '1925-12-03', deathDate: '2001-08-19', gender: 'M', photoUrl: null, generation: -2, parentIds: [10, 11],   childIds: [3] },
    { id: 7,  firstName: 'Abena',     lastName: 'Osei',      birthDate: '1929-04-22', deathDate: '2010-02-07', gender: 'F', photoUrl: null, generation: -2, parentIds: [],         childIds: [3] },
    { id: 8,  firstName: 'Yaw',       lastName: 'Mensah',    birthDate: '1895-02-11', deathDate: '1960-07-30', gender: 'M', photoUrl: null, generation: -3, parentIds: [],         childIds: [4] },
    { id: 9,  firstName: 'Ama',       lastName: 'Darko',     birthDate: '1898-08-25', deathDate: '1975-12-01', gender: 'F', photoUrl: null, generation: -3, parentIds: [],         childIds: [4] },
    { id: 10, firstName: 'Kwesi',     lastName: 'Asante',    birthDate: '1900-06-14', deathDate: '1965-04-22', gender: 'M', photoUrl: null, generation: -3, parentIds: [],         childIds: [6] },
    { id: 11, firstName: 'Abena',     lastName: 'Kwarteng',  birthDate: '1903-10-09', deathDate: '1972-01-15', gender: 'F', photoUrl: null, generation: -3, parentIds: [],         childIds: [6] },
    { id: 20, firstName: 'Yaa',       lastName: 'Mensah',    birthDate: '2002-06-08', deathDate: null,         gender: 'F', photoUrl: null, generation:  1, parentIds: [1],        childIds: [] },
    { id: 21, firstName: 'Kojo',      lastName: 'Mensah',    birthDate: '2005-11-17', deathDate: null,         gender: 'M', photoUrl: null, generation:  1, parentIds: [1],        childIds: [] },
  ],
};

export default function ContemplationView() {
  const { t } = useTranslation();
  const { selectedPersonId } = useFamilyTreeContext();
  const { data: fetchedData, loading, error } = usePersonTree(selectedPersonId, { up: 5, down: 2 });

  // En DEV sans personne sélectionnée → prévisualisation avec le mock
  const data = fetchedData ?? (VUE_CONTEMPLATION_ENABLED && selectedPersonId === null ? MOCK_TREE : null);

  // ── Aucune personne sélectionnée (hors DEV) ───────────────────────────────
  if (selectedPersonId === null && !VUE_CONTEMPLATION_ENABLED) {
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
