/**
 * FanCanvasV2 — vue éventail SVG ascendants/descendants (Lot 3, ContemplationView).
 *
 * Rendu entièrement en SVG + une couche CSS absolue pour le halo et la vignette.
 * Ne touche PAS à FanCanvas.tsx (coexistence obligatoire).
 *
 * Spec visuelle : viewBox 0 0 1240 840, centre ego cx=620 cy=420.
 *   - Ascendants : demi-cercle supérieur (-180° à 0°), jusqu'à 5 générations.
 *   - Descendants : demi-cercle inférieur (0° à 180°), jusqu'à 2 générations.
 *   - Secteurs vides : fill transparent, strokeDasharray, + rouille.
 *
 * Algorithme de placement :
 *   - Ascendants : arbre binaire positionnel. Gen g → 2^g secteurs de 180/2^g degrés chacun.
 *     Le parent du secteur i de gen g se trouve au secteur floor(i/2) de gen g-1.
 *     On construit le mapping position→nœud par BFS depuis l'ego en remontant parentIds.
 *   - Descendants : les enfants de l'ego répartis équitablement sur 180°.
 *     Les enfants des enfants répartis proportionnellement dans le secteur de leur parent.
 *
 * Contrainte : pas de new Date() — extraction d'année via string.slice(0,4).
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PersonTreeDto, PersonTreeNodeDto } from '../types';
import { colors, fonts } from '../theme/tokens';

// ── Constantes géométriques ──────────────────────────────────────────────────

const VB_W  = 1240;
const VB_H  = 840;
const CX    = 620;
const CY    = 470;
const R0    = 58;   // rayon ego
const STEP_UP  = 64; // épaisseur d'un anneau ascendant
const STEP_DN  = 80; // épaisseur d'un anneau descendant
const MAX_GEN_UP   = 5;
const MAX_GEN_DOWN = 2;

// Palettes par génération
const COLORS_UP: readonly string[] = ['#7d5a36', '#8a6741', '#9d7a4f', '#b3926a', '#cbac88'];
const COLORS_DN: readonly string[] = ['#6a7242', '#8a8f5a'];
const RUST = '#b87333';

// ── Helpers géométriques ─────────────────────────────────────────────────────

/**
 * Convertit des coordonnées polaires (rayon, angle en degrés) en cartésien SVG.
 * 0° = haut (12h), sens horaire.
 */
function polar(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

/**
 * Construit un path SVG d'arc en anneau entre r_inner et r_outer,
 * de l'angle a0 à l'angle a1 (degrés, sens horaire, 0°=haut).
 */
function arcPath(r_inner: number, r_outer: number, a0: number, a1: number): string {
  const [x1o, y1o] = polar(r_outer, a0);
  const [x2o, y2o] = polar(r_outer, a1);
  const [x2i, y2i] = polar(r_inner, a1);
  const [x1i, y1i] = polar(r_inner, a0);
  const largeArc   = Math.abs(a1 - a0) > 180 ? 1 : 0;

  return [
    `M ${x1o} ${y1o}`,
    `A ${r_outer} ${r_outer} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${r_inner} ${r_inner} 0 ${largeArc} 0 ${x1i} ${y1i}`,
    'Z',
  ].join(' ');
}

// ── Helpers dates ────────────────────────────────────────────────────────────

/** Extrait l'année d'une date "yyyy-MM-dd" ou null. */
function year(date: string | null): string | null {
  return date ? date.slice(0, 4) : null;
}

/** Formate "1948–2019", "1952" (vivant si deathDate null), ou "" si aucune date. */
function lifeSpan(birthDate: string | null, deathDate: string | null): string {
  const b = year(birthDate);
  const d = year(deathDate);
  if (!b) return '';
  return d ? `${b}–${d}` : `${b}`;
}

// ── Helpers label ────────────────────────────────────────────────────────────

function displayName(node: PersonTreeNodeDto): string {
  const parts: string[] = [];
  if (node.firstName) parts.push(node.firstName);
  if (node.lastName)  parts.push(node.lastName);
  return parts.join(' ') || '?';
}

// ── Mapping ascendants : position binaire → nœud ────────────────────────────

/**
 * Construit un Map<genLevel, Map<positionIndex, PersonTreeNodeDto>>.
 * genLevel 1 = parents directs de l'ego, genLevel 2 = grands-parents, etc.
 *
 * Algorithme BFS depuis l'ego :
 *   - Gen 1 : parentIds de l'ego → positions 0, 1 (gauche→droite).
 *   - Gen g : pour chaque position i de gen g-1, ses parentIds vont aux positions
 *             2i et 2i+1 de gen g.
 * Si un nœud a plus de 2 parents, seuls les deux premiers sont pris (cas binaire).
 */
function buildAncestorMap(
  ego: PersonTreeNodeDto,
  nodeMap: Map<number, PersonTreeNodeDto>,
): Map<number, Map<number, PersonTreeNodeDto>> {
  const result = new Map<number, Map<number, PersonTreeNodeDto>>();

  // File BFS : (genLevel, positionIndex, nœud)
  type QueueItem = { gen: number; pos: number; node: PersonTreeNodeDto };
  const queue: QueueItem[] = [{ gen: 0, pos: 0, node: ego }];

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (item.gen >= MAX_GEN_UP) continue;

    const nextGen = item.gen + 1;
    if (!result.has(nextGen)) result.set(nextGen, new Map());

    const parents = item.node.parentIds
      .map(pid => nodeMap.get(pid))
      .filter((n): n is PersonTreeNodeDto => n !== undefined)
      .slice(0, 2); // arbre binaire strict

    parents.forEach((parent, localIdx) => {
      const pos = item.pos * 2 + localIdx;
      result.get(nextGen)!.set(pos, parent);
      queue.push({ gen: nextGen, pos, node: parent });
    });
  }

  return result;
}

// ── Mapping descendants ──────────────────────────────────────────────────────

interface DescendantSector {
  node: PersonTreeNodeDto;
  /** Angle de début du secteur (degrés, 0°=haut, sens horaire). */
  a0: number;
  /** Angle de fin du secteur. */
  a1: number;
  gen: number; // 1 ou 2
}

/**
 * Construit la liste des secteurs descendants (gen 1 et gen 2).
 * Gen 1 : enfants de l'ego répartis équitablement sur [0°, 180°].
 * Gen 2 : enfants de chaque enfant répartis dans le sous-arc du parent.
 */
function buildDescendantSectors(
  ego: PersonTreeNodeDto,
  nodeMap: Map<number, PersonTreeNodeDto>,
): DescendantSector[] {
  const sectors: DescendantSector[] = [];

  const gen1Nodes = ego.childIds
    .map(cid => nodeMap.get(cid))
    .filter((n): n is PersonTreeNodeDto => n !== undefined);

  if (gen1Nodes.length === 0) return [];

  const spanPerChild = 180 / gen1Nodes.length;

  gen1Nodes.forEach((child, idx) => {
    const a0 = 90 + idx * spanPerChild;
    const a1 = a0 + spanPerChild;
    sectors.push({ node: child, a0, a1, gen: 1 });

    // Gen 2
    const gen2Nodes = child.childIds
      .map(cid => nodeMap.get(cid))
      .filter((n): n is PersonTreeNodeDto => n !== undefined);

    if (gen2Nodes.length > 0) {
      const span2 = (a1 - a0) / gen2Nodes.length;
      gen2Nodes.forEach((grandchild, gIdx) => {
        sectors.push({
          node: grandchild,
          a0: a0 + gIdx * span2,
          a1: a0 + (gIdx + 1) * span2,
          gen: 2,
        });
      });
    }
  });

  return sectors;
}

// ── Sous-composants SVG ──────────────────────────────────────────────────────

interface AncestorSectorProps {
  /** genLevel 1..5 */
  gen: number;
  /** position 0..2^gen-1 */
  pos: number;
  node: PersonTreeNodeDto | undefined;
}

function AncestorSector({ gen, pos, node }: AncestorSectorProps) {
  const totalSectors = Math.pow(2, gen);
  const spanDeg      = 180 / totalSectors;
  const a0           = -90 + pos * spanDeg;
  const a1           = a0 + spanDeg;
  const midAngle     = (a0 + a1) / 2;

  const r_inner = R0 + (gen - 1) * STEP_UP;
  const r_outer = R0 + gen * STEP_UP;
  const r_label = r_inner + (r_outer - r_inner) * 0.5;

  const fill   = node ? COLORS_UP[gen - 1] : 'transparent';
  const stroke = node ? COLORS_UP[gen - 1] : RUST;
  const opacity = node ? 1 : 0.45;

  const d = arcPath(r_inner, r_outer, a0, a1);

  // Label si gen <= 2 et nœud présent
  const showLabel = node && gen <= 2;
  const showDate  = node && gen <= 3;
  const fontSize  = gen === 1 ? 17 : gen === 2 ? 13.5 : 11;
  const dateFontSize = gen === 1 ? 9 : 8;

  // Calcul du point de label : milieu radial, rotation radiale
  const [lx, ly] = polar(r_label, midAngle);
  // Pour la rotation du texte, on tourne de midAngle - 90 degrés
  // (le texte suit la tangente de l'arc)
  const textRotation = midAngle <= 0 ? midAngle + 90 : midAngle - 90;

  const name = node ? displayName(node) : '';
  const span = node ? lifeSpan(node.birthDate, node.deathDate) : '';

  return (
    <g>
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.8}
        opacity={opacity}
        strokeDasharray={node ? undefined : '3 4'}
        aria-label={node ? `${name} — génération ${gen}` : `Ancêtre inconnu — génération ${gen}, position ${pos}`}
      />

      {/* Croix "+" pour secteur vide */}
      {!node && (() => {
        const [px, py] = polar(r_label, midAngle);
        return (
          <text
            x={px}
            y={py}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fill={RUST}
            opacity={0.7}
            aria-hidden="true"
          >
            +
          </text>
        );
      })()}

      {/* Labels dans un repère commun pour éviter le chevauchement */}
      {(showLabel || (showDate && span)) && (
        <g transform={`translate(${lx} ${ly}) rotate(${textRotation})`} aria-hidden="true">
          {showLabel && (
            <text
              x={0}
              y={showDate && span ? -dateFontSize * 0.8 : 0}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontSize}
              fontFamily={fonts.serif}
              fontStyle="italic"
              fontWeight={500}
              fill={colors.cream}
            >
              {name}
            </text>
          )}
          {showDate && span && (
            <text
              x={0}
              y={showLabel ? fontSize * 0.7 : 0}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={dateFontSize}
              fontFamily={fonts.mono}
              fill={colors.cream}
              opacity={0.75}
            >
              {span}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

interface DescendantSectorSVGProps {
  sector: DescendantSector;
}

function DescendantSectorSVG({ sector }: DescendantSectorSVGProps) {
  const { node, a0, a1, gen } = sector;
  const r_inner = R0 + (gen - 1) * STEP_DN;
  const r_outer = R0 + gen * STEP_DN;
  const r_label = r_inner + (r_outer - r_inner) * 0.5;
  const midAngle = (a0 + a1) / 2;

  const fill  = COLORS_DN[gen - 1];
  const fontSize = gen === 1 ? 15 : 12;
  const dateFontSize = gen === 1 ? 9 : 8;

  const d = arcPath(r_inner, r_outer, a0, a1);
  const [lx, ly] = polar(r_label, midAngle);
  const textRotation = midAngle <= 180 ? midAngle - 90 : midAngle + 90;

  const name = displayName(node);
  const span = lifeSpan(node.birthDate, node.deathDate);

  return (
    <g>
      <path
        d={d}
        fill={fill}
        stroke={fill}
        strokeWidth={0.8}
        aria-label={`${name} — descendant génération ${gen}`}
      />
      <g transform={`translate(${lx} ${ly}) rotate(${textRotation})`} aria-hidden="true">
        <text
          x={0}
          y={span ? -dateFontSize * 0.8 : 0}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontFamily={fonts.serif}
          fontStyle="italic"
          fontWeight={500}
          fill={colors.cream}
        >
          {name}
        </text>
        {span && (
          <text
            x={0}
            y={fontSize * 0.7}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={dateFontSize}
            fontFamily={fonts.mono}
            fill={colors.cream}
            opacity={0.75}
          >
            {span}
          </text>
        )}
      </g>
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────

export interface FanCanvasV2Props {
  data: PersonTreeDto;
}

export default function FanCanvasV2({ data }: FanCanvasV2Props) {
  const { t } = useTranslation();

  // Construction du nodeMap
  const nodeMap = new Map<number, PersonTreeNodeDto>(
    data.nodes.map(n => [n.id, n]),
  );

  const ego = nodeMap.get(data.rootId);
  if (!ego) return null;

  // Mapping ascendants
  const ancestorMap = buildAncestorMap(ego, nodeMap);

  // Mapping descendants
  const descendantSectors = buildDescendantSectors(ego, nodeMap);

  // Stats pour le header et meta
  const totalNodes    = data.nodes.length;
  const knownAncestors = [...ancestorMap.values()].reduce((acc, genMap) => acc + genMap.size, 0);
  const totalAncestorSlots = [1, 2, 3, 4, 5]
    .reduce((acc, g) => acc + Math.pow(2, g), 0); // 2+4+8+16+32=62
  const knownPct = totalAncestorSlots > 0
    ? Math.round((knownAncestors / totalAncestorSlots) * 100)
    : 0;

  const egoName = displayName(ego);
  const egoSpan = lifeSpan(ego.birthDate, ego.deathDate);

  // Nombre de générations ascendantes et descendantes présentes
  const genUpCount  = Math.max(0, ...data.nodes.map(n => -n.generation).filter(g => g > 0));
  const genDnCount  = Math.max(0, ...data.nodes.map(n => n.generation).filter(g => g > 0));

  return (
    <div
      data-testid="fan-canvas-v2"
      style={{
        position: 'relative',
        width: '100%',
        // M5 : dvh avec fallback vh pour navigateurs sans support dvh
        height: '100dvh',
        // Fallback via @supports manquant en inline — on surcharge via minHeight
        minHeight: '100vh',
        touchAction: 'none',
      }}
      role="img"
      aria-label={t('contemplation.aria_label', { name: egoName })}
    >
      {/* Halo doré derrière l'ego (couche CSS absolue) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: CX - 340,
          top: CY - 340,
          width: 680,
          height: 680,
          background: 'radial-gradient(circle, rgba(181,138,59,0.18) 0%, rgba(181,138,59,0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette (couche CSS absolue, par-dessus le SVG) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(40,28,12,0.18) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* SVG principal */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true" // navigation accessible via le wrapper role=img
      >
        {/* Ligne horizon */}
        <line
          x1={120} x2={1120}
          y1={CY}  y2={CY}
          stroke={colors.line2}
          strokeDasharray="3 5"
          strokeWidth={1}
        />

        {/* ── Secteurs ascendants ── */}
        {Array.from({ length: MAX_GEN_UP }, (_, gi) => {
          const gen = gi + 1;
          const totalSectors = Math.pow(2, gen);
          const genMap = ancestorMap.get(gen);
          return Array.from({ length: totalSectors }, (_, pos) => (
            <AncestorSector
              key={`up-${gen}-${pos}`}
              gen={gen}
              pos={pos}
              node={genMap?.get(pos)}
            />
          ));
        })}

        {/* ── Secteurs descendants ── */}
        {descendantSectors.map((sector, idx) => (
          <DescendantSectorSVG
            key={`dn-${sector.node.id}-${idx}`}
            sector={sector}
          />
        ))}

        {/* ── Ego ── */}
        {/* Cercle outer (gold) */}
        <circle cx={CX} cy={CY} r={R0 + 2} fill="none" stroke="#B8924A" strokeWidth={0.8} opacity={0.5} />
        {/* Cercle inner */}
        <circle cx={CX} cy={CY} r={R0 - 4} fill={colors.cream} stroke={colors.ink} strokeWidth={1.2} />
        {/* Nom ego */}
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize={22}
          fontFamily={fonts.serif}
          fontStyle="italic"
          fontWeight={500}
          fill={colors.ink}
        >
          {egoName}
        </text>
        {/* Date ego */}
        {egoSpan && (
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            dominantBaseline="auto"
            fontSize={9}
            fontFamily={fonts.mono}
            fill={colors.ink3}
          >
            {egoSpan}
          </text>
        )}

        {/* ── Header top-left ── */}
        <g aria-hidden="true">
          <text x={40} y={44} fontSize={9} fontFamily={fonts.mono} fill={colors.ink4} letterSpacing={2} style={{ textTransform: 'uppercase' }}>
            {t('contemplation.eyebrow')}
          </text>
          <text x={40} y={72} fontSize={34} fontFamily={fonts.serif} fontStyle="italic" fill={colors.ink}>
            {t('contemplation.header_line1')}
          </text>
          <text x={40} y={110} fontSize={34} fontFamily={fonts.serif} fontStyle="italic" fill={colors.ink}>
            {t('contemplation.header_line2')}
          </text>
          {/* Chips ascendants / descendants — empilés verticalement */}
          <rect x={40} y={122} width={200} height={18} rx={4} fill={colors.sepia} opacity={0.15} />
          <text x={140} y={134} textAnchor="middle" fontSize={9} fontFamily={fonts.mono} fill={colors.sepia}>
            {t('contemplation.chip_up', { count: genUpCount })}
          </text>
          <rect x={40} y={146} width={200} height={18} rx={4} fill={colors.olive} opacity={0.15} />
          <text x={140} y={158} textAnchor="middle" fontSize={9} fontFamily={fonts.mono} fill={colors.olive}>
            {t('contemplation.chip_down', { count: genDnCount })}
          </text>
        </g>

        {/* ── Labels axes ── */}
        <text
          x={CX} y={30}
          textAnchor="middle"
          fontSize={10}
          fontFamily={fonts.mono}
          fill={colors.sepia}
          aria-hidden="true"
        >
          {t('contemplation.axis_up', { count: genUpCount })}
        </text>
        <text
          x={CX} y={VB_H - 20}
          textAnchor="middle"
          fontSize={10}
          fontFamily={fonts.mono}
          fill={COLORS_DN[0]}
          aria-hidden="true"
        >
          {t('contemplation.axis_down', { count: genDnCount })}
        </text>

        {/* ── Légende top-right ── */}
        <g aria-hidden="true">
          {/* ASCENDANTS */}
          <rect x={VB_W - 180} y={30} width={12} height={12} fill={colors.sepia} />
          <text x={VB_W - 162} y={41} fontSize={9} fontFamily={fonts.mono} fill={colors.ink4}>{t('contemplation.legend_up')}</text>
          {/* DESCENDANTS */}
          <rect x={VB_W - 180} y={50} width={12} height={12} fill={COLORS_DN[0]} />
          <text x={VB_W - 162} y={61} fontSize={9} fontFamily={fonts.mono} fill={colors.ink4}>{t('contemplation.legend_down')}</text>
          {/* À RECHERCHER */}
          <rect x={VB_W - 180} y={70} width={12} height={12} fill="none" stroke={RUST} strokeDasharray="3 2" />
          <text x={VB_W - 162} y={81} fontSize={9} fontFamily={fonts.mono} fill={colors.ink4}>{t('contemplation.legend_unknown')}</text>
        </g>

        {/* ── Meta bottom-left ── */}
        <text
          x={40} y={VB_H - 20}
          fontSize={10}
          fontFamily={fonts.mono}
          fill={colors.ink4}
          aria-hidden="true"
        >
          {t('contemplation.meta', { total: totalNodes, pct: knownPct })}
        </text>
      </svg>
    </div>
  );
}
