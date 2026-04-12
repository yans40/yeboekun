import React, { useState } from 'react';
import { Person } from '../types';
import { CARD_WIDTH, CARD_HEIGHT, CHILD_CARD_WIDTH } from '../utils/familyTreeLayout';

const GENDER_COLORS: Record<string, string> = {
  M: '#3B82F6',
  F: '#EC4899',
  O: '#6B7280',
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
  onPersonClick: (personId: number) => void;
  onPersonEdit: (personId: number) => void;
}

export const GenealogyCard: React.FC<GenealogyCardProps> = ({
  person,
  x,
  y,
  isCentral = false,
  isChild = false,
  onPersonClick,
  onPersonEdit,
}) => {
  const [hovered, setHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);

  const width = isChild ? CHILD_CARD_WIDTH : CARD_WIDTH;
  const genderColor = GENDER_COLORS[person.gender] ?? GENDER_COLORS.O;

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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: hovered
      ? '0 8px 30px rgba(0,0,0,0.15)'
      : '0 4px 20px rgba(0,0,0,0.07)',
    border: isCentral
      ? `2px solid ${genderColor}`
      : '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'box-shadow 150ms, transform 150ms',
    transform: hovered ? 'scale(1.02)' : 'scale(1)',
    opacity: isChild ? 0.82 : 1,
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
    backgroundColor: isChild ? '#9CA3AF' : genderColor,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: isCentral ? 16 : 14,
    flexShrink: 0,
    marginBottom: 6,
    overflow: 'hidden',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: isChild ? 11 : isCentral ? 14 : 13,
    fontWeight: isCentral ? 700 : 600,
    color: isChild ? '#6B7280' : '#1F2937',
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
    color: '#9CA3AF',
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
    backgroundColor: editHovered ? '#3B82F6' : '#E5E7EB',
    color: editHovered ? '#fff' : '#6B7280',
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
      {/* Edit button */}
      <button
        style={editBtnStyle}
        onMouseEnter={e => { e.stopPropagation(); setEditHovered(true); }}
        onMouseLeave={e => { e.stopPropagation(); setEditHovered(false); }}
        onClick={e => { e.stopPropagation(); onPersonEdit(person.id); }}
        title="Modifier"
      >
        ✏
      </button>

      {/* Avatar */}
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

      {/* Name */}
      <div style={nameStyle}>{person.fullName}</div>

      {/* Dates */}
      {dateLabel && <div style={metaStyle}>{dateLabel}</div>}
    </div>
  );
};

export default GenealogyCard;
