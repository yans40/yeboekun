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
 * Pas de dépendance au backend pour l'instant : reçoit RiverViewData en prop.
 * Remplace le PlaceholderView sur /riviere quand VUE_RIVIERE_ENABLED=true.
 */

import { useEffect, useRef, type RefObject } from 'react';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import PersonChip from '../components/PersonChip';
import type { RiverViewData, RiverViewNode, RiverViewEdge } from '../types';

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

export interface RiviereViewProps {
  data: RiverViewData;
  onPersonClick?: (id: number) => void;
}

export default function RiviereView({ data, onPersonClick }: RiviereViewProps) {
  const { nodes, edges, rootId, generationRange } = data;

  // Référence vers la colonne génération=0 pour centrage à l'ouverture
  const rootColumnRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Centrer sur la colonne racine au montage
  useEffect(() => {
    const container = containerRef.current;
    const rootCol = rootColumnRef.current;
    if (!container || !rootCol) return;

    // Calcul pour centrer la colonne racine dans le viewport
    const containerWidth = container.clientWidth;
    const colLeft = rootCol.offsetLeft;
    const colWidth = rootCol.offsetWidth;
    const scrollTarget = colLeft - containerWidth / 2 + colWidth / 2;

    container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
  }, []);

  // Construire les groupes par génération
  const generationMap = buildGenerationGroups(nodes, edges);

  // Générations triées dans l'ordre chronologique : de la plus ancienne (min) à la plus jeune (max)
  const sortedGenerations: number[] = [];
  for (let g = generationRange.min; g <= generationRange.max; g++) {
    if (generationMap.has(g)) {
      sortedGenerations.push(g);
    }
  }

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
        <span style={{
          fontFamily: fonts.mono,
          fontSize: 9,
          color: colors.rust,
          letterSpacing: '0.04em',
          marginLeft: spacing[2],
        }}>
          données mockées
        </span>
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
              onPersonClick={onPersonClick}
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
          LÉGENDE
        </span>
        {(
          [
            { color: colors.ocean, label: 'Masculin' },
            { color: colors.rust,  label: 'Féminin' },
            { color: colors.ink3,  label: 'Autre' },
          ] as const
        ).map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: radius.xs, backgroundColor: color }} />
            <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4 }}>{label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4 }}>†</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.ink4 }}>Décédé(e)</span>
        </div>
      </div>
    </div>
  );
}
