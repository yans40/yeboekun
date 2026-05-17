/**
 * FanCanvasV2 — vue éventail SVG ascendants/descendants (Lot 3, ContemplationView).
 *
 * Rendu entièrement en SVG + une couche CSS absolue pour le halo et la vignette.
 * Ne touche PAS à FanCanvas.tsx (coexistence obligatoire).
 *
 * Spec visuelle : viewBox 0 0 1240 840, centre ego cx=620 cy=420.
 *   - Ascendants : demi-cercle supérieur (-180° à 0°), jusqu'à 5 générations.
 *   - Descendants : demi-cercle inférieur (0° à 180°), jusqu'à 2 générations.
 *   - Secteurs vides : fill transparent, strokeDasharray, + croix rouille.
 *
 * Algorithme de placement :
 *   - Ascendants : arbre binaire positionnel. Gen g → 2^g secteurs de 180/2^g degrés chacun.
 *     Le parent du secteur i de gen g se trouve au secteur floor(i/2) de gen g-1.
 *     On construit le mapping position→nœud par BFS depuis l'ego en remontant parentIds.
 *   - Descendants : les enfants de l'ego répartis équitablement sur 180°.
 *     Les enfants des enfants répartis proportionnellement dans le secteur de leur parent.
 *
 * v5 — Texte horizontal partout :
 *   - Aucune rotation sur les labels (suppression de textRotation + <g transform rotate>).
 *   - adaptName() : cascade d'abréviation avec gestion des particules et noms composés.
 *   - Mesure de corde réelle via canvas hors-écran (measureText après fonts.ready).
 *   - Secteur muet si adaptName retourne null : petit cercle cream + <title> tooltip.
 *   - clipPath par secteur comme filet de sécurité anti-débordement.
 *
 * Contrainte : pas de new Date() — extraction d'année via string.slice(0,4).
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
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

// Palettes par génération — issues des tokens v4 (tokens.ts colors.ascN / colors.descN)
const COLORS_UP: readonly string[] = [
  colors.asc1,  // génération 1
  colors.asc2,  // génération 2
  colors.asc3,  // génération 3
  colors.asc4,  // génération 4
  colors.asc5,  // génération 5
];
const COLORS_DN: readonly string[] = [
  colors.desc1, // génération 1
  colors.desc2, // génération 2
];
const RUST = colors.rust;

// ── Canvas hors-écran pour mesure de texte ───────────────────────────────────

/**
 * Accès lazy au contexte 2D du canvas de mesure.
 * Le canvas est créé uniquement au premier appel pour éviter le warning jsdom
 * lors de l'import du module en environnement de test (jest-environment-jsdom
 * lève un "not implemented" sur getContext au moment de l'initialisation
 * module-level si on n'est pas sous canvas npm).
 *
 * En pratique : retourne null en test (avail=0 → adaptName retourne le nom complet),
 * et un contexte 2D valide en navigateur.
 */
let _mctx: CanvasRenderingContext2D | null | false = false; // false = "pas encore tenté"

function getMeasureCtx(): CanvasRenderingContext2D | null {
  if (_mctx !== false) return _mctx;
  try {
    if (typeof document === 'undefined') { _mctx = null; return null; }
    const mc = document.createElement('canvas');
    _mctx = mc.getContext('2d'); // peut retourner null en jsdom sans canvas npm
  } catch {
    _mctx = null;
  }
  return _mctx;
}

/**
 * Mesure la largeur d'un texte dans Cormorant Garamond Italic 500.
 * Retourne 0 si le canvas n'est pas disponible (SSR ou test).
 */
function measureText(text: string, fs: number): number {
  const ctx = getMeasureCtx();
  if (!ctx) return 0;
  ctx.font = `italic 500 ${fs}px "Cormorant Garamond", Georgia, serif`;
  return ctx.measureText(text).width;
}

// ── Particules de nom ────────────────────────────────────────────────────────

/**
 * Ensemble des particules nobiliaires / prépositions à ne jamais initialiser
 * (elles restent collées à leur composant jusqu'au tier 5 de la cascade).
 *
 * Règle : comparaison insensible à la casse, sans l'apostrophe trailing
 * (d' est normalisé en d avant comparaison).
 */
const PARTICLES = new Set([
  'de','du','des','d','da','dal','del','della','di',
  'la','le','van','von','ten','ter','af','el','al',
  'ben','bin','mac','mc','o',
]);

function isParticle(word: string): boolean {
  return PARTICLES.has(word.toLowerCase().replace(/[''']$/, ''));
}

// ── Parsing du nom de famille ─────────────────────────────────────────────────

/**
 * Segment du nom de famille.
 *   - isParticle : true si c'est une particule (de, van, von, etc.)
 *   - parts : pour un composé "Roux-Beaumarchais" → ["Roux", "Beaumarchais"]
 *             pour un simple "Moreau" → ["Moreau"]
 */
interface SurnameSegment {
  isParticle: boolean;
  /** Les morceaux séparés par des traits d'union (toujours au moins 1). */
  parts: string[];
  /** La chaîne d'origine, incluant traits d'union. */
  raw: string;
}

/**
 * Décompose un nom de famille en segments : particules et composants (simples ou composés).
 *
 * Exemple : "de Saint-Maurice" → [
 *   { isParticle:true, parts:["de"], raw:"de" },
 *   { isParticle:false, parts:["Saint","Maurice"], raw:"Saint-Maurice" }
 * ]
 *
 * Les apostrophes en fin de particule sont conservées dans raw mais normalisées
 * pour le test isParticle (d' → "d").
 */
function parseSurname(lastName: string): SurnameSegment[] {
  if (!lastName) return [];
  // On split sur les espaces, mais on recolle ce qui est lié par trait d'union
  // à l'intérieur d'un token.
  const tokens = lastName.split(/\s+/).filter(Boolean);
  return tokens.map(token => {
    const parts = token.split('-').filter(Boolean);
    return {
      isParticle: parts.length === 1 && isParticle(parts[0]),
      parts,
      raw: token,
    };
  });
}

/**
 * Reconstruit une chaîne depuis les segments.
 * Chaque segment est joint avec des espaces, les parts d'un segment sont rejoints
 * avec des traits d'union.
 */
function joinSegments(segs: SurnameSegment[]): string {
  return segs.map(s => s.parts.join('-')).join(' ');
}

// ── Abréviations ────────────────────────────────────────────────────────────

/** Abrège un mot simple : "Maurice" → "M." */
function abbrWord(word: string): string {
  if (!word) return '';
  return `${word[0].toUpperCase()}.`;
}

/**
 * Abrège un segment composé depuis la queue.
 * Tiers d'abréviation :
 *   - tier 1 : "Roux-Beaumarchais" → "Roux-B."   (dernier composant abrégé)
 *   - tier 2 : "Roux-Beaumarchais" → "R.-B."      (tous composants abrégés)
 *
 * Retourne les deux tiers sous forme de string[].
 */
function abbrSegment(seg: SurnameSegment): [string, string] {
  if (seg.isParticle) {
    return [seg.raw, seg.raw]; // les particules ne sont jamais abrégées
  }
  if (seg.parts.length === 1) {
    const abbr = abbrWord(seg.parts[0]);
    return [abbr, abbr]; // simple → une seule forme
  }
  // Composé : tier 1 = dernier mot abrégé
  const tier1Parts = [...seg.parts.slice(0, -1), abbrWord(seg.parts[seg.parts.length - 1])];
  const tier1 = tier1Parts.join('-');
  // Composé : tier 2 = tout abrégé
  const tier2Parts = seg.parts.map(abbrWord);
  const tier2 = tier2Parts.join('-');
  return [tier1, tier2];
}

// ── adaptName : cœur de la spec v5 ──────────────────────────────────────────

/**
 * Retourne le texte le plus long qui tient dans `avail` pixels, ou `null`
 * si même la forme la plus courte ne tient pas (→ secteur muet).
 *
 * Cascade (du plus long au plus court) :
 *   1. "Prénom Nom-Composé"                       (tout)
 *   2. "P. Nom-Composé"                           (initiale prénom)
 *   3. "P. Nom-C." ou "P. Saint-M."               (dernier composant des segments abrégé)
 *   4. "P. R.-B." ou "P. S.-M."                   (tous composants abrégés, particules conservées)
 *   5. "P. R.-B." sans particule (particule abandonnée en dernier recours)
 *   null → secteur muet
 *
 * @param firstName - prénom complet
 * @param lastName  - nom de famille (peut contenir particules + composants)
 * @param avail     - largeur disponible en px (issue de la corde réelle)
 * @param fs        - font-size en px
 */
function adaptName(
  firstName: string,
  lastName: string,
  avail: number,
  fs: number,
): string | null {
  // Si avail est 0 (canvas non dispo, ex: tests Jest), on retourne toujours le nom complet
  // pour ne pas rendre les tests dépendants de la disponibilité du canvas.
  if (avail <= 0) {
    const full = [firstName, lastName].filter(Boolean).join(' ');
    return full || null;
  }

  const fn = (firstName || '').trim();
  const ln = (lastName || '').trim();

  // Si aucun des deux → null
  if (!fn && !ln) return null;

  // Cas où l'un est absent
  if (!ln) {
    return measureText(fn, fs) <= avail ? fn : null;
  }
  if (!fn) {
    return measureText(ln, fs) <= avail ? ln : null;
  }

  const fnInit = `${fn[0].toUpperCase()}.`;
  const segs = parseSurname(ln);

  function fits(text: string): boolean {
    return measureText(text, fs) <= avail;
  }

  // — Tier 1 : "Prénom Nom"
  const t1 = `${fn} ${joinSegments(segs)}`;
  if (fits(t1)) return t1;

  // — Tier 2 : "P. Nom" (initiale prénom)
  const t2 = `${fnInit} ${joinSegments(segs)}`;
  if (fits(t2)) return t2;

  // — Tier 3 : "P. Nom-C." — chaque segment non-particule : dernier composant abrégé
  {
    const segs3 = segs.map(s => {
      if (s.isParticle) return { ...s };
      const [tier1Abbr] = abbrSegment(s);
      return { ...s, parts: tier1Abbr.split('-') };
    });
    const t3 = `${fnInit} ${joinSegments(segs3)}`;
    if (fits(t3)) return t3;
  }

  // — Tier 4 : "P. R.-B." — tous composants abrégés, particules conservées
  {
    const segs4 = segs.map(s => {
      if (s.isParticle) return { ...s };
      const [, tier2Abbr] = abbrSegment(s);
      return { ...s, parts: tier2Abbr.split('-') };
    });
    const t4 = `${fnInit} ${joinSegments(segs4)}`;
    if (fits(t4)) return t4;
  }

  // — Tier 5 : abandon des particules
  {
    const segs5 = segs.filter(s => !s.isParticle).map(s => {
      const [, tier2Abbr] = abbrSegment(s);
      return { ...s, parts: tier2Abbr.split('-') };
    });
    if (segs5.length > 0) {
      const t5 = `${fnInit} ${joinSegments(segs5)}`;
      if (fits(t5)) return t5;
    }
  }

  // — Null : secteur muet
  return null;
}

// ── Mesure de corde réelle ────────────────────────────────────────────────────

/**
 * Vérifie si le point (x,y) est à l'intérieur du secteur annulaire défini par
 * (cx,cy,rIn,rOut,a1Deg,a2Deg). Convention : angles en degrés standard (0°=droite, CCW),
 * cohérente avec Math.atan2.
 *
 * On tolère ±0.5px sur les rayons et ±0.5° sur les angles pour éviter les exclusions
 * dues aux arrondis flottants.
 */
function insideSector(
  x: number, y: number,
  cx: number, cy: number,
  rIn: number, rOut: number,
  a1Deg: number, a2Deg: number,
): boolean {
  const dx = x - cx;
  const dy = y - cy;
  const r = Math.sqrt(dx * dx + dy * dy);
  if (r < rIn - 0.5 || r > rOut + 0.5) return false;
  let a = Math.atan2(dy, dx) * (180 / Math.PI);
  // Normaliser a dans [a1Deg - 0.5, +∞) pour gérer les secteurs qui croisent 0°
  while (a < a1Deg - 0.5) a += 360;
  return a <= a2Deg + 0.5;
}

/**
 * Calcule la largeur de corde disponible pour un texte horizontal placé en (tx, ty)
 * au centre d'un secteur annulaire (cx, cy, rIn, rOut, a1Deg, a2Deg).
 *
 * Algorithme spec v5 §4.5 :
 *   1. On échantillonne 3 hauteurs de y autour du texte (ty - fs, ty, ty + fs).
 *   2. Pour chaque y, on calcule la corde horizontale maximale qui tient DANS le secteur
 *      en testant des candidats x par dichotomie depuis le centre vers les bords.
 *   3. On prend l'enveloppe minimale des 3 cordes (cas le plus contraint).
 *   4. avail = enveloppe.width × 0.86 (marge de sécurité).
 *
 * Les angles a1Deg/a2Deg sont exprimés dans la convention "0°=droite, CCW" (standard Math).
 *
 * Retourne 0 si le centre n'est pas dans le secteur (erreur de calcul).
 */
function realChordWidth(
  cx: number, cy: number,
  rIn: number, rOut: number,
  a1Deg: number, a2Deg: number,
  tx: number, ty: number,
  fs: number,
): number {
  const STEPS = 128; // résolution de la dichotomie
  const safetyFactor = 0.86;

  // Pour chaque y, balaye x de tx vers les bords gauche et droit
  function chordAt(y: number): { xLeft: number; xRight: number } | null {
    // Limite physique : bounding box du cercle extérieur
    const xMin = cx - rOut - 1;
    const xMax = cx + rOut + 1;
    const xRange = xMax - xMin;

    // Cherche la frontière gauche : le x le plus à gauche de tx qui est encore dans le secteur
    let xLeft = tx;
    {
      const step = (tx - xMin) / STEPS;
      for (let i = 1; i <= STEPS; i++) {
        const xCand = tx - i * step;
        if (!insideSector(xCand, y, cx, cy, rIn, rOut, a1Deg, a2Deg)) {
          xLeft = tx - (i - 1) * step;
          break;
        }
        if (i === STEPS) xLeft = xMin; // toute la gauche est dans le secteur (rare)
      }
    }

    // Cherche la frontière droite
    let xRight = tx;
    {
      const step = (xMax - tx) / STEPS;
      for (let i = 1; i <= STEPS; i++) {
        const xCand = tx + i * step;
        if (!insideSector(xCand, y, cx, cy, rIn, rOut, a1Deg, a2Deg)) {
          xRight = tx + (i - 1) * step;
          break;
        }
        if (i === STEPS) xRight = xMax;
      }
    }

    if (xRight <= xLeft) return null;
    return { xLeft, xRight };
  }

  const ySamples = [ty - fs, ty, ty + fs];
  let minWidth = Infinity;

  for (const y of ySamples) {
    const chord = chordAt(y);
    if (!chord) return 0; // texte sort du secteur sur cette ligne
    const w = chord.xRight - chord.xLeft;
    if (w < minWidth) minWidth = w;
  }

  if (!isFinite(minWidth) || minWidth <= 0) return 0;
  return minWidth * safetyFactor;
}

// ── Helpers géométriques ─────────────────────────────────────────────────────

/**
 * Convertit des coordonnées polaires (rayon, angle en degrés) en cartésien SVG.
 * Convention interne FanCanvasV2 : 0°=haut (12h), sens horaire.
 * → on soustrait 90° pour mapper sur la convention trigonométrique standard.
 */
function polar(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

/**
 * Convertit un angle FanCanvasV2 (0°=haut, CW) en degrés standard Math (0°=droite, CCW).
 * Utilisé pour passer les angles à insideSector / realChordWidth.
 */
function toMathDeg(fanDeg: number): number {
  return fanDeg - 90;
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

// ── font-sizes par génération ────────────────────────────────────────────────

const ASC_FONT_SIZES: readonly number[] = [17, 13.5, 11, 10, 9.5];
const DESC_FONT_SIZES: readonly number[] = [15, 12];

// ── Sous-composant : label horizontal v5 ────────────────────────────────────

interface SectorLabelProps {
  /** Prénom. */
  firstName: string;
  /** Nom de famille. */
  lastName: string;
  /** Date span (ex "1920–1998"). Vide si aucune date. */
  span: string;
  /** Position x du centre du secteur (milieu radial + milieu angulaire). */
  tx: number;
  /** Position y du centre du secteur. */
  ty: number;
  /** Font-size en px. */
  fs: number;
  /** Largeur disponible (corde réelle × 0.86) en px. */
  avail: number;
  /** Id du clipPath SVG à appliquer (filet de sécurité anti-débordement). */
  clipPathId: string;
}

/**
 * Rendu d'un label horizontal v5.
 *
 * - Appelle adaptName() pour obtenir le texte abrégé (ou null → secteur muet).
 * - Si null : cercle cream r=1.6 au centre + <title> pour le tooltip natif.
 * - Si texte : <text> horizontal (pas de rotation), avec tspan pour les dates.
 *
 * La police dates passe en Geist Mono, taille fs-2 (min 7.5px), opacity 0.70.
 */
function SectorLabel({
  firstName, lastName, span,
  tx, ty, fs, avail, clipPathId,
}: SectorLabelProps) {
  const name = adaptName(firstName, lastName, avail, fs);
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '?';

  if (name === null) {
    // Secteur muet : point cream + tooltip
    return (
      <g aria-hidden="true" clipPath={`url(#${clipPathId})`}>
        <title>{fullName}</title>
        <circle
          cx={tx}
          cy={ty}
          r={1.6}
          fill={colors.cream}
          opacity={0.7}
        />
      </g>
    );
  }

  const dateFs = Math.max(7.5, fs - 2);

  // Quand on a un nom + des dates, on décale légèrement le nom vers le haut
  // pour centrer visuellement l'ensemble.
  const nameY = span ? ty - dateFs * 0.5 : ty;
  const dateY = ty + fs * 0.45;

  return (
    <g aria-hidden="true" clipPath={`url(#${clipPathId})`}>
      <title>{fullName}{span ? ` · ${span}` : ''}</title>
      <text
        x={tx}
        y={nameY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fs}
        fontFamily={fonts.serif}
        fontStyle="italic"
        fontWeight={500}
        fill={colors.cream}
      >
        {name}
      </text>
      {span && (
        <text
          x={tx}
          y={dateY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={dateFs}
          fontFamily={fonts.mono}
          fontStyle="normal"
          fill={colors.cream}
          opacity={0.70}
        >
          {span}
        </text>
      )}
    </g>
  );
}

// ── Sous-composants SVG ──────────────────────────────────────────────────────

interface AncestorSectorProps {
  /** genLevel 1..5 */
  gen: number;
  /** position 0..2^gen-1 */
  pos: number;
  node: PersonTreeNodeDto | undefined;
  onSectorClick?: (node: PersonTreeNodeDto) => void;
  selectedNodeId?: number;
  /** Id unique de clipPath à créer dans <defs>. */
  clipId: string;
}

function AncestorSector({ gen, pos, node, onSectorClick, selectedNodeId, clipId }: AncestorSectorProps) {
  const totalSectors = Math.pow(2, gen);
  const spanDeg      = 180 / totalSectors;
  // Convention : ascendants dans le demi-cercle supérieur, -90° à +90°
  const a0           = -90 + pos * spanDeg;
  const a1           = a0 + spanDeg;
  const midAngle     = (a0 + a1) / 2;

  const r_inner = R0 + (gen - 1) * STEP_UP;
  const r_outer = R0 + gen * STEP_UP;
  // Gen 1 : label décalé vers l'extérieur (0.68), autres générations : centré (0.50)
  const rOffset = gen === 1 ? 0.68 : 0.50;
  const r_label = r_inner + (r_outer - r_inner) * rOffset;

  const fill    = node ? COLORS_UP[gen - 1] : 'transparent';
  const opacity = node ? 1 : 0.45;

  const isSelected = node !== undefined && selectedNodeId === node.id;
  const stroke      = isSelected ? colors.rust : (node ? colors.line2 : RUST);
  const strokeWidth = isSelected ? 2.4 : 0.8;

  const d = arcPath(r_inner, r_outer, a0, a1);

  // Position du label (texte horizontal, pas de rotation)
  const [tx, ty] = polar(r_label, midAngle);

  // Mesure de corde réelle — angles convertis en convention Math standard
  const a1Math = toMathDeg(a0);
  const a2Math = toMathDeg(a1);
  const fs = ASC_FONT_SIZES[gen - 1];
  const avail = node ? realChordWidth(CX, CY, r_inner, r_outer, a1Math, a2Math, tx, ty, fs) : 0;

  const name = node ? displayName(node) : '';
  const span = node ? lifeSpan(node.birthDate, node.deathDate) : '';
  // Dates : affiché jusqu'à gen 3
  const showDate = node && gen <= 3;

  return (
    <g>
      {/* clipPath pour le filet de sécurité anti-débordement */}
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>

      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeDasharray={node ? undefined : '3 4'}
        style={node ? { cursor: 'pointer' } : undefined}
        onClick={node && onSectorClick ? () => onSectorClick(node) : undefined}
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

      {/* Label horizontal v5 — toutes générations */}
      {node && (
        <SectorLabel
          firstName={node.firstName ?? ''}
          lastName={node.lastName ?? ''}
          span={showDate ? span : ''}
          tx={tx}
          ty={ty}
          fs={fs}
          avail={avail}
          clipPathId={clipId}
        />
      )}
    </g>
  );
}

interface DescendantSectorSVGProps {
  sector: DescendantSector;
  onSectorClick?: (node: PersonTreeNodeDto) => void;
  selectedNodeId?: number;
  clipId: string;
}

function DescendantSectorSVG({ sector, onSectorClick, selectedNodeId, clipId }: DescendantSectorSVGProps) {
  const { node, a0, a1, gen } = sector;
  const r_inner = R0 + (gen - 1) * STEP_DN;
  const r_outer = R0 + gen * STEP_DN;
  const r_label = r_inner + (r_outer - r_inner) * 0.5;
  const midAngle = (a0 + a1) / 2;

  const fill  = COLORS_DN[gen - 1];
  const fs = DESC_FONT_SIZES[gen - 1];

  const isSelected = selectedNodeId === node.id;
  const stroke      = isSelected ? colors.rust : fill;
  const strokeWidth = isSelected ? 2.4 : 0.8;

  const d = arcPath(r_inner, r_outer, a0, a1);
  const [tx, ty] = polar(r_label, midAngle);

  // Mesure de corde réelle — angles en convention Math standard
  const a1Math = toMathDeg(a0);
  const a2Math = toMathDeg(a1);
  const avail = realChordWidth(CX, CY, r_inner, r_outer, a1Math, a2Math, tx, ty, fs);

  const name = displayName(node);
  const span = lifeSpan(node.birthDate, node.deathDate);

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>

      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ cursor: 'pointer' }}
        onClick={onSectorClick ? () => onSectorClick(node) : undefined}
        aria-label={`${name} — descendant génération ${gen}`}
      />

      <SectorLabel
        firstName={node.firstName ?? ''}
        lastName={node.lastName ?? ''}
        span={span}
        tx={tx}
        ty={ty}
        fs={fs}
        avail={avail}
        clipPathId={clipId}
      />
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────

export interface FanCanvasV2Props {
  data: PersonTreeDto;
  /** Appelé quand l'utilisateur clique sur un secteur non-vide. */
  onSectorClick?: (node: PersonTreeNodeDto) => void;
  /** Id du nœud actuellement sélectionné — affiche le stroke rust sur ce secteur. */
  selectedNodeId?: number;
}

export default function FanCanvasV2({ data, onSectorClick, selectedNodeId }: FanCanvasV2Props) {
  const { t } = useTranslation();

  /**
   * fontsReady : passe à true après document.fonts.ready + chargement explicite
   * de Cormorant Garamond dans les tailles utilisées. Déclenche un re-render
   * pour que measureText() soit fiable dès le premier rendu visible.
   *
   * En environnement de test (document.fonts absent), on part directement sur true
   * pour éviter un état vide.
   */
  const [fontsReady, setFontsReady] = useState<boolean>(
    typeof document === 'undefined' || !document.fonts,
  );

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      // Pré-charge les tailles critiques pour que measureText soit fiable immédiatement
      return Promise.all([
        document.fonts.load(`italic 500 17px "Cormorant Garamond", serif`),
        document.fonts.load(`italic 500 13.5px "Cormorant Garamond", serif`),
        document.fonts.load(`italic 500 11px "Cormorant Garamond", serif`),
        document.fonts.load(`italic 500 10px "Cormorant Garamond", serif`),
        document.fonts.load(`italic 500 9.5px "Cormorant Garamond", serif`),
      ]);
    }).then(() => {
      if (!cancelled) setFontsReady(true);
    }).catch(() => {
      if (!cancelled) setFontsReady(true); // on passe quand même
    });
    return () => { cancelled = true; };
  }, []);

  // Construction du nodeMap
  const nodeMap = useMemo(
    () => new Map<number, PersonTreeNodeDto>(data.nodes.map(n => [n.id, n])),
    [data.nodes],
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

  const genUpCount  = Math.max(0, ...data.nodes.map(n => -n.generation).filter(g => g > 0));
  const genDnCount  = Math.max(0, ...data.nodes.map(n => n.generation).filter(g => g > 0));

  return (
    <div
      data-testid="fan-canvas-v2"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: '100vh',
        touchAction: 'none',
        // On masque pendant le chargement des fonts pour éviter le flash de labels incorrects
        opacity: fontsReady ? 1 : 0,
        transition: 'opacity 0.25s ease',
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
        aria-hidden="true"
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
              onSectorClick={onSectorClick}
              selectedNodeId={selectedNodeId}
              clipId={`clip-up-${gen}-${pos}`}
            />
          ));
        })}

        {/* ── Secteurs descendants ── */}
        {descendantSectors.map((sector, idx) => (
          <DescendantSectorSVG
            key={`dn-${sector.node.id}-${idx}`}
            sector={sector}
            onSectorClick={onSectorClick}
            selectedNodeId={selectedNodeId}
            clipId={`clip-dn-${sector.node.id}-${idx}`}
          />
        ))}

        {/* ── Ego ── */}
        <circle cx={CX} cy={CY} r={R0 + 2} fill="none" stroke="#B8924A" strokeWidth={0.8} opacity={0.5} />
        <circle cx={CX} cy={CY} r={R0 - 4} fill={colors.cream} stroke={colors.ink} strokeWidth={1.2} />
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
          <rect x={VB_W - 180} y={30} width={12} height={12} fill={colors.sepia} />
          <text x={VB_W - 162} y={41} fontSize={9} fontFamily={fonts.mono} fill={colors.ink4}>{t('contemplation.legend_up')}</text>
          <rect x={VB_W - 180} y={50} width={12} height={12} fill={COLORS_DN[0]} />
          <text x={VB_W - 162} y={61} fontSize={9} fontFamily={fonts.mono} fill={colors.ink4}>{t('contemplation.legend_down')}</text>
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
