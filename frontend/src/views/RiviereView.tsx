/**
 * RiviereView — layout horizontal par génération (Vue Rivière, Lot 2).
 *
 * Principe :
 *   - Colonnes flexbox : une colonne par valeur de `generation` (triées asc).
 *   - Scroll horizontal fluide avec snap sur chaque colonne.
 *   - Colonne generation=0 (racine) centrée à l'ouverture via scrollIntoView.
 *   - Les conjoints (Spouse) sont groupés avec leur partenaire dans la même colonne.
 *   - Pas de D3 : layout CSS pur (flexbox horizontal).
 *
 * Données : branchée sur GET /api/persons/{id}/river-view via useRiverView.
 * En DEV sans personne sélectionnée → fallback mock local pour prévisualisation.
 * Remplace le PlaceholderView sur /riviere quand VUE_RIVIERE_ENABLED=true.
 */

import React, { useEffect, useRef, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PersonChip from '../components/PersonChip';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import { useRiverView } from '../hooks/useRiverView';
import { VUE_RIVIERE_ENABLED } from '../config/featureFlags';
import type { RiverViewData, RiverViewNode, RiverViewEdge } from '../types';

// ── Mock DEV (fallback local sans backend ni personne sélectionnée) ────────────
//
// Arbre centré sur Marie FONTAINE (id 10, generation 0).
// Branches intentionnellement asymétriques pour tester le rendu.
const RIVER_MOCK: RiverViewData = {
  rootId: 10,
  depth: 3,
  generationRange: { min: -2, max: 1 },
  nodes: [
    { id: 1,  firstName: 'Édouard', lastName: 'Fontaine', birthDate: '1890-03-14', deathDate: '1968-11-02', isAlive: false, gender: 'M', photoUrl: null, generation: -2 },
    { id: 2,  firstName: 'Hortense', lastName: 'Marchand', birthDate: '1895-07-22', deathDate: '1972-04-18', isAlive: false, gender: 'F', photoUrl: null, generation: -2 },
    { id: 3,  firstName: 'Robert',   lastName: 'Fontaine', birthDate: '1920-05-10', deathDate: '1995-08-30', isAlive: false, gender: 'M', photoUrl: null, generation: -1 },
    { id: 4,  firstName: 'Suzanne',  lastName: 'Leroy',    birthDate: '1923-01-15', deathDate: '2001-12-05', isAlive: false, gender: 'F', photoUrl: null, generation: -1 },
    { id: 5,  firstName: 'Henri',    lastName: 'Morel',    birthDate: '1918-09-03', deathDate: '1980-02-14', isAlive: false, gender: 'M', photoUrl: null, generation: -1 },
    { id: 6,  firstName: 'Jeanne',   lastName: 'Petit',    birthDate: '1921-11-28', deathDate: null,         isAlive: true,  gender: 'F', photoUrl: null, generation: -1 },
    { id: 10, firstName: 'Marie',    lastName: 'Fontaine', birthDate: '1972-06-15', deathDate: null,         isAlive: true,  gender: 'F', photoUrl: null, generation: 0  },
    { id: 11, firstName: 'Thomas',   lastName: 'Dumont',   birthDate: '1970-03-22', deathDate: null,         isAlive: true,  gender: 'M', photoUrl: null, generation: 0  },
    { id: 12, firstName: 'Claire',   lastName: 'Fontaine', birthDate: '1975-09-08', deathDate: null,         isAlive: true,  gender: 'F', photoUrl: null, generation: 0  },
    { id: 20, firstName: 'Lucas',    lastName: 'Dumont',   birthDate: '2000-04-12', deathDate: null,         isAlive: true,  gender: 'M', photoUrl: null, generation: 1  },
    { id: 21, firstName: 'Camille',  lastName: 'Dumont',   birthDate: '2003-07-19', deathDate: null,         isAlive: true,  gender: 'F', photoUrl: null, generation: 1  },
  ],
  edges: [
    { sourceId: 1,  targetId: 2,  type: 'Spouse',  startDate: '1917-06-10', endDate: null, isActive: true },
    { sourceId: 1,  targetId: 3,  type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 2,  targetId: 3,  type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 3,  targetId: 4,  type: 'Spouse',  startDate: '1948-05-20', endDate: null, isActive: true },
    { sourceId: 5,  targetId: 6,  type: 'Spouse',  startDate: '1945-09-15', endDate: null, isActive: true },
    { sourceId: 3,  targetId: 10, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 4,  targetId: 10, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 5,  targetId: 12, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 6,  targetId: 12, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 10, targetId: 12, type: 'Sibling', startDate: null,         endDate: null, isActive: true },
    { sourceId: 10, targetId: 11, type: 'Spouse',  startDate: '1998-09-05', endDate: null, isActive: true },
    { sourceId: 10, targetId: 20, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 11, targetId: 20, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 10, targetId: 21, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
    { sourceId: 11, targetId: 21, type: 'Parent',  startDate: null,         endDate: null, isActive: true },
  ],
};

// ── Types internes ─────────────────────────────────────────────────────────────

/** Groupe de nœuds dans une colonne : une personne + ses conjoints éventuels. */
interface SpouseGroup {
  /** Nœud principal (non conjoint — ou premier nœud du groupe si ambigu). */
  primary: RiverViewNode;
  /** Conjoints du nœud principal dans cette génération. */
  spouses: RiverViewNode[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Construit un Map<generation, SpouseGroup[]> à partir des nœuds et des arêtes. */
function buildGenerationGroups(
  nodes: RiverViewNode[],
  edges: RiverViewEdge[],
): Map<number, SpouseGroup[]> {
  const nodeMap = new Map<number, RiverViewNode>(nodes.map(n => [n.id, n]));

  // Ensemble des ids déjà placés comme "conjoint" pour éviter les doublons
  const placedAsSpouse = new Set<number>();

  // Pour chaque nœud, trouver ses conjoints dans la même génération
  const spouseEdges = edges.filter(e => e.type === 'Spouse');

  const generationMap = new Map<number, SpouseGroup[]>();

  // Initialiser toutes les générations présentes
  nodes.forEach(n => {
    if (!generationMap.has(n.generation)) {
      generationMap.set(n.generation, []);
    }
  });

  // Parcours : pour chaque nœud (dans l'ordre d'insertion),
  // si non déjà placé comme conjoint, créer un groupe primary+spouses.
  nodes.forEach(node => {
    if (placedAsSpouse.has(node.id)) return;

    const spouseIds = spouseEdges
      .filter(e => e.sourceId === node.id || e.targetId === node.id)
      .map(e => (e.sourceId === node.id ? e.targetId : e.sourceId))
      .filter(id => {
        const spouse = nodeMap.get(id);
        return spouse !== undefined && spouse.generation === node.generation;
      });

    const spouseNodes = spouseIds
      .map(id => nodeMap.get(id))
      .filter((n): n is RiverViewNode => n !== undefined && !placedAsSpouse.has(n.id));

    spouseNodes.forEach(s => placedAsSpouse.add(s.id));

    const group: SpouseGroup = { primary: node, spouses: spouseNodes };
    generationMap.get(node.generation)?.push(group);
  });

  return generationMap;
}

/** Label lisible pour une génération (utilisé en titre de colonne). */
function generationLabel(gen: number): string {
  if (gen === 0) return 'Vous';
  if (gen === -1) return 'Parents';
  if (gen === -2) return 'Grands-parents';
  if (gen === -3) return 'Arrière-grands-parents';
  if (gen < 0) return `Génération ${Math.abs(gen)}`;
  if (gen === 1) return 'Enfants';
  if (gen === 2) return 'Petits-enfants';
  return `Génération +${gen}`;
}

// ── Sous-composant : groupe conjoint ──────────────────────────────────────────

interface SpouseGroupProps {
  group: SpouseGroup;
  rootId: number;
  onPersonClick?: (id: number) => void;
}

function SpouseGroupBlock({ group, rootId, onPersonClick }: SpouseGroupProps) {
  const allNodes = [group.primary, ...group.spouses];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      position: 'relative',
    }}>
      {allNodes.map((node, idx) => (
        <div key={node.id} style={{ position: 'relative' }}>
          <PersonChip
            node={node}
            isRoot={node.id === rootId}
            onClick={onPersonClick}
          />
          {/* Trait de liaison horizontal entre conjoints */}
          {idx < allNodes.length - 1 && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 8,
                right: 8,
                bottom: -4,
                height: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                width: 20,
                height: 1,
                backgroundColor: colors.line,
                borderRadius: 1,
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Sous-composant : colonne génération ───────────────────────────────────────

interface GenerationColumnProps {
  generation: number;
  groups: SpouseGroup[];
  rootId: number;
  isRoot: boolean;
  onPersonClick?: (id: number) => void;
  columnRef?: RefObject<HTMLDivElement>;
}

function GenerationColumn({
  generation,
  groups,
  rootId,
  isRoot,
  onPersonClick,
  columnRef,
}: GenerationColumnProps) {
  const label = generationLabel(generation);

  return (
    <div
      ref={columnRef}
      aria-label={`Génération : ${label}`}
      style={{
        // Snap point sur chaque colonne
        scrollSnapAlign: 'center',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[3],
        padding: `${spacing[6]}px ${spacing[4]}px`,
        minWidth: 172,
        borderLeft: `1px solid ${colors.line2}`,
        // Mise en valeur de la colonne racine
        backgroundColor: isRoot ? colors.paper2 : 'transparent',
        position: 'relative',
      }}
    >
      {/* Titre de colonne */}
      <div style={{
        fontFamily: fonts.mono,
        fontSize: 9,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: isRoot ? colors.sepia : colors.ink4,
        fontWeight: isRoot ? 600 : 400,
        marginBottom: spacing[2],
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>

      {/* Groupes de personnes */}
      {groups.map(group => (
        <SpouseGroupBlock
          key={group.primary.id}
          group={group}
          rootId={rootId}
          onPersonClick={onPersonClick}
        />
      ))}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────────

export default function RiviereView() {
  const { t } = useTranslation();
  const { selectedPersonId } = useFamilyTreeContext();
  const { data: fetchedData, loading, error } = useRiverView(selectedPersonId);

  // Tous les hooks doivent être appelés avant tout return conditionnel (règle des hooks React).
  const rootColumnRef = useRef<HTMLDivElement | null>(null);
  const containerRef  = useRef<HTMLDivElement | null>(null);

  // En DEV sans personne sélectionnée → prévisualisation avec le mock local
  const isMockFallback = VUE_RIVIERE_ENABLED && selectedPersonId === null && fetchedData === null;
  const data: RiverViewData | null = fetchedData ?? (isMockFallback ? RIVER_MOCK : null);

  // Générations et groupes calculés seulement quand data est disponible (sinon vides)
  const generationMap   = data ? buildGenerationGroups(data.nodes, data.edges) : new Map<number, SpouseGroup[]>();
  const sortedGenerations: number[] = [];
  if (data) {
    for (let g = data.generationRange.min; g <= data.generationRange.max; g++) {
      if (generationMap.has(g)) sortedGenerations.push(g);
    }
  }

  // Centrer sur la colonne racine quand data change
  useEffect(() => {
    if (!data) return;
    const container = containerRef.current;
    const rootCol   = rootColumnRef.current;
    if (!container || !rootCol) return;

    const containerWidth = container.clientWidth;
    const colLeft        = rootCol.offsetLeft;
    const colWidth       = rootCol.offsetWidth;
    const scrollTarget   = colLeft - containerWidth / 2 + colWidth / 2;

    // jsdom n'implémente pas scrollTo sur Element ; navigateurs réels oui.
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    } else {
      container.scrollLeft = scrollTarget;
    }
  }, [data]);

  // ── Aucune personne sélectionnée (hors DEV) ─────────────────────────────────
  if (selectedPersonId === null && !VUE_RIVIERE_ENABLED) {
    return (
      <div
        data-testid="riviere-no-selection"
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
          {t('riviere.no_selection', 'Sélectionnez une personne pour explorer sa rivière')}
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.ink4 }}>
          {t('riviere.no_selection_hint', 'Utilisez la barre de recherche en haut de page')}
        </span>
      </div>
    );
  }

  // ── Chargement ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        data-testid="riviere-loading"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.ink4 }}>
          {t('common.loading', 'Chargement…')}
        </span>
      </div>
    );
  }

  // ── Erreur ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        data-testid="riviere-error"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.rust }}>
          {t('common.error', 'Erreur')} — {error}
        </span>
      </div>
    );
  }

  // ── Données absentes ────────────────────────────────────────────────────────
  if (!data) return null;

  const { nodes, edges, rootId, generationRange } = data;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: colors.paper,
    }}>
      {/* En-tête */}
      <div style={{
        padding: `${spacing[4]}px ${spacing[6]}px ${spacing[3]}px`,
        borderBottom: `1px solid ${colors.line2}`,
        display: 'flex',
        alignItems: 'baseline',
        gap: spacing[3],
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontSize: 20,
          color: colors.ink,
          lineHeight: 1,
        }}>
          Vue Rivière
        </span>
        <span style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          color: colors.ink4,
          letterSpacing: '0.06em',
          backgroundColor: colors.paper3,
          padding: '2px 6px',
          borderRadius: radius.xs,
        }}>
          {nodes.length} personnes · {generationRange.max - generationRange.min + 1} générations
        </span>
        {/* Badge visible uniquement quand les données viennent du mock local */}
        {isMockFallback && (
          <span style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: colors.rust,
            letterSpacing: '0.04em',
            marginLeft: spacing[2],
          }}>
            {t('riviere.mock_badge', 'données mockées')}
          </span>
        )}
      </div>

      {/* Zone de scroll horizontal */}
      <div
        ref={containerRef}
        data-testid="riviere-scroll-container"
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          // Scrollbar discrète
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.line} transparent`,
        }}
      >
        {sortedGenerations.map(gen => {
          const groups = generationMap.get(gen) ?? [];
          return (
            <GenerationColumn
              key={gen}
              generation={gen}
              groups={groups}
              rootId={rootId}
              isRoot={gen === 0}
              onPersonClick={undefined}
              columnRef={gen === 0 ? rootColumnRef : undefined}
            />
          );
        })}

        {/* Padding de fin pour permettre de centrer la dernière colonne */}
        <div style={{ flexShrink: 0, width: 80 }} aria-hidden="true" />
      </div>

      {/* Légende genre */}
      <div style={{
        padding: `${spacing[2]}px ${spacing[6]}px`,
        borderTop: `1px solid ${colors.line2}`,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[4],
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4, letterSpacing: '0.06em' }}>
          {t('riviere.legend', 'LÉGENDE')}
        </span>
        {(
          [
            { color: colors.ocean, label: t('riviere.legend_male',   'Masculin') },
            { color: colors.rust,  label: t('riviere.legend_female', 'Féminin')  },
            { color: colors.ink3,  label: t('riviere.legend_other',  'Autre')    },
          ] as const
        ).map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: radius.xs, backgroundColor: color }} />
            <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4 }}>{label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4 }}>†</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4 }}>
            {t('riviere.legend_deceased', 'Décédé(e)')}
          </span>
        </div>
      </div>
    </div>
  );
}
