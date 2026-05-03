/**
 * PersonChip — carte ultra-compacte pour la Vue Rivière (et potentiellement l'arbre vertical).
 *
 * Taille fixe 140×56 px pour un layout prévisible.
 * La bande genre sur le bord gauche utilise les tokens couleurs :
 *   M  → colors.ocean  (#3a6b8a)
 *   F  → colors.rust   (#c45c3a)
 *   Other → colors.ink3 (#7a6048)
 */

import type { KeyboardEvent } from 'react';
import { colors, fonts, radius, shadows } from '../theme/tokens';
import type { RiverViewNode } from '../types';

export interface PersonChipProps {
  node: RiverViewNode;
  /** Met en valeur le nœud central (racine). */
  isRoot?: boolean;
  onClick?: (id: number) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extrait l'année depuis une date ISO ou retourne null. */
function extractYear(date: string | null): string | null {
  if (!date) return null;
  const y = date.slice(0, 4);
  return y.length === 4 ? y : null;
}

/** Abrège le nom de famille au-delà de 8 caractères (ex: "Fontaine" → "Fontaine", "Beauchamp-Delacroix" → "Beauchamp-D."). */
function abbreviateLastName(name: string): string {
  if (name.length <= 10) return name;
  return name.slice(0, 9) + '.';
}

function genderAccentColor(gender: RiverViewNode['gender']): string {
  switch (gender) {
    case 'M':     return colors.ocean;
    case 'F':     return colors.rust;
    case 'Other': return colors.ink3;
  }
}

// ── Composant ─────────────────────────────────────────────────────────────────

export default function PersonChip({ node, isRoot = false, onClick }: PersonChipProps) {
  const { id, firstName, lastName, birthDate, deathDate, isAlive, gender } = node;

  const birthYear = extractYear(birthDate);
  const deathYear = extractYear(deathDate);
  const shortLastName = abbreviateLastName(lastName);
  const accentColor = genderAccentColor(gender);

  const ariaLabel =
    `${firstName} ${lastName}` +
    (birthYear ? `, né${gender === 'F' ? 'e' : ''} en ${birthYear}` : '') +
    (!isAlive && deathYear ? `, décédé${gender === 'F' ? 'e' : ''} en ${deathYear}` : '') +
    (isRoot ? ', personne centrale' : '');

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(id);
    }
  };

  return (
    <div
      role="article"
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? () => onClick(id) : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      style={{
        // Taille fixe pour prévisibilité du layout
        width: 140,
        height: 56,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: radius.sm,
        overflow: 'hidden',
        backgroundColor: isRoot ? colors.paper3 : colors.cream,
        border: `1px solid ${isRoot ? colors.sepia : colors.line2}`,
        boxShadow: isRoot ? shadows.md : shadows.xs,
        cursor: onClick ? 'pointer' : 'default',
        // Anneau visuel supplémentaire pour la racine
        outline: isRoot ? `2px solid ${colors.sepia}` : 'none',
        outlineOffset: isRoot ? 2 : undefined,
        flexShrink: 0,
        position: 'relative',
        transition: 'box-shadow 120ms ease, transform 120ms ease',
      }}
    >
      {/* Bande genre (gauche, 4px) */}
      <div style={{
        width: 4,
        flexShrink: 0,
        backgroundColor: accentColor,
      }} />

      {/* Contenu */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 8px',
        minWidth: 0,
      }}>
        {/* Prénom */}
        <span style={{
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: isRoot ? 600 : 500,
          color: colors.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3,
        }}>
          {firstName}
        </span>

        {/* Nom abrégé */}
        <span style={{
          fontFamily: fonts.sans,
          fontSize: 10,
          fontWeight: 400,
          color: isRoot ? colors.ink2 : colors.ink3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.2,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {shortLastName}
        </span>

        {/* Dates */}
        <span style={{
          fontFamily: fonts.mono,
          fontSize: 9,
          color: colors.ink4,
          lineHeight: 1.2,
          marginTop: 1,
        }}>
          {birthYear ?? '?'}
          {!isAlive && deathYear ? ` – ${deathYear}` : ''}
          {isAlive ? '' : !deathYear ? ' †' : ''}
        </span>
      </div>

      {/* Indicateur décès discret (croix en haut à droite) */}
      {!isAlive && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 4,
            right: 5,
            fontSize: 8,
            color: colors.ink4,
            lineHeight: 1,
          }}
        >
          †
        </span>
      )}
    </div>
  );
}
