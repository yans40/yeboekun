import React, { useState } from 'react';
import { Person } from '../types';
import { colors, fonts, radius, shadows } from '../theme/tokens';
import { CARD_WIDTH, CARD_HEIGHT, CHILD_CARD_WIDTH } from '../utils/familyTreeLayout';

const GENDER_COLORS: Record<string, string> = {
  M: colors.ocean,
  F: colors.rust,
  O: colors.ink3,
};

function getInitials(person: Person): string {
  return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
}

function formatYear(dateStr?: string): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).getFullYear().toString();
}

interface GenealogyCardProps {
  person: Person;
  x: number;
  y: number;
  isCentral?: boolean;
  isChild?: boolean;
  isSibling?: boolean;
  isSpouse?: boolean;
  onPersonClick: (personId: number) => void;
  onPersonEdit?: (personId: number) => void;
}

export const GenealogyCard: React.FC<GenealogyCardProps> = ({
  person,
  x,
  y,
  isCentral = false,
  isChild = false,
  isSpouse = false,
  onPersonClick,
  onPersonEdit,
}) => {
  const [hovered, setHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);

  const width = isChild ? CHILD_CARD_WIDTH : CARD_WIDTH;
  const genderColor = (person.gender ? GENDER_COLORS[person.gender] : null) ?? GENDER_COLORS.O;

  const birthYear = formatYear(person.birthDate);
  const deathYear = formatYear(person.deathDate);
  const dateLabel = birthYear
    ? deathYear
      ? `${birthYear} — ${deathYear}`
      : `${birthYear} — ${person.isAlive ? 'vivant(e)' : '†'}`
    : null;

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width,
    height: CARD_HEIGHT,
    backgroundColor: isCentral ? colors.cream : colors.paper,
    borderRadius: radius.lg,
    boxShadow: hovered ? shadows.lg : isCentral ? shadows.md : shadows.sm,
    border: `1px solid ${isCentral ? colors.line : colors.line2}`,
    borderLeft: `2px solid ${genderColor}`,
    cursor: 'pointer',
    transition: 'box-shadow 150ms, transform 150ms',
    transform: hovered ? 'scale(1.02)' : 'scale(1)',
    opacity: isChild ? 0.85 : 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 8px 8px',
    userSelect: 'none',
    zIndex: isCentral ? 10 : 1,
    boxSizing: 'border-box',
  };

  const avatarStyle: React.CSSProperties = {
    width: isCentral ? 48 : 40,
    height: isCentral ? 48 : 40,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.sepiaLt}, ${colors.sepia})`,
    color: colors.cream,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontSize: isCentral ? 18 : 15,
    flexShrink: 0,
    marginBottom: 6,
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: isChild ? 11 : isCentral ? 14 : 13,
    fontWeight: isCentral ? 600 : 500,
    fontFamily: fonts.sans,
    color: isChild ? colors.ink3 : colors.ink,
    textAlign: 'center',
    lineHeight: 1.3,
    maxHeight: '2.6em',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    width: '100%',
    marginBottom: 2,
  };

  const metaStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: fonts.mono,
    color: colors.ink4,
    textAlign: 'center',
    lineHeight: 1.4,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
  };

  const editBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: editHovered ? colors.sepia : colors.paper3,
    color: editHovered ? colors.cream : colors.ink3,
    border: 'none',
    cursor: 'pointer',
    display: hovered ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    transition: 'background 150ms',
    zIndex: 20,
    padding: 0,
  };

  return (
    <div
      style={cardStyle}
      data-person-id={person.id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setEditHovered(false); }}
      onClick={() => onPersonClick(person.id)}
    >
      {onPersonEdit && (
        <button
          style={editBtnStyle}
          onMouseEnter={e => { e.stopPropagation(); setEditHovered(true); }}
          onMouseLeave={e => { e.stopPropagation(); setEditHovered(false); }}
          onClick={e => { e.stopPropagation(); onPersonEdit(person.id); }}
          title="Modifier"
        >
          ✏
        </button>
      )}

      <div style={avatarStyle}>
        {person.photoUrl ? (
          <img
            src={person.photoUrl}
            alt={person.fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          getInitials(person)
        )}
      </div>

      <div style={nameStyle}>{person.fullName}</div>
      {dateLabel && <div style={metaStyle}>{dateLabel}</div>}
    </div>
  );
};

export default GenealogyCard;
