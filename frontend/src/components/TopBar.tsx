import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { colors, fonts, shadows } from '../theme/tokens';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import type { Person } from '../types';

const BREADCRUMB_MAP: Record<string, string> = {
  '/':          'Arbre',
  '/arbre':     'Arbre',
  '/tableau':   'Tableau',
  '/contempler':'Contempler',
  '/riviere':   'Rivière',
  '/atelier':   'Atelier',
  '/admin':     'Administration',
};

const topbarStyle: React.CSSProperties = {
  height: 48,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '0 16px',
  backgroundColor: colors.paper,
  borderBottom: `1px solid ${colors.line2}`,
  boxShadow: shadows.xs,
  flexShrink: 0,
  boxSizing: 'border-box',
};

export default function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { persons, selectedPersonId, onPersonSelect, onOpenEditModal } = useFamilyTreeContext();

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorAnchor, setSelectorAnchor] = useState<HTMLElement | null>(null);
  const [avatarAnchor, setAvatarAnchor] = useState<HTMLElement | null>(null);

  const selectedPerson = persons.find(p => p.id === selectedPersonId) ?? null;
  const breadcrumb = BREADCRUMB_MAP[pathname] ?? '';

  const handleSelectorOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectorAnchor(e.currentTarget);
    setSelectorOpen(true);
  };

  const handlePersonPick = (person: Person) => {
    onPersonSelect(person.id);
    setSelectorOpen(false);
    setSelectorAnchor(null);
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarAnchor(e.currentTarget);
  };

  const handleEditMode = () => {
    setAvatarAnchor(null);
    onOpenEditModal();
    navigate('/admin');
  };

  const initials = selectedPerson
    ? (selectedPerson.firstName?.[0] ?? '') + (selectedPerson.lastName?.[0] ?? '')
    : 'G';

  return (
    <header style={topbarStyle}>
      {/* Breadcrumb */}
      <span style={{
        fontFamily: fonts.mono,
        fontSize: 11,
        color: colors.ink3,
        letterSpacing: '0.08em',
        flexShrink: 0,
      }}>
        {breadcrumb}
      </span>

      <span style={{ color: colors.line, fontFamily: fonts.mono, fontSize: 11 }}>›</span>

      {/* Person selector (shell-14 — décision B) */}
      <button
        onClick={handleSelectorOpen}
        style={{
          fontFamily: fonts.sans,
          fontSize: 12,
          color: colors.ink2,
          backgroundColor: colors.paper2,
          border: `1px solid ${colors.line}`,
          borderRadius: 4,
          padding: '3px 8px',
          cursor: 'pointer',
          maxWidth: 180,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {selectedPerson
          ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
          : t('topbar.select_person')}
      </button>

      <Menu
        open={selectorOpen}
        anchorEl={selectorAnchor}
        onClose={() => { setSelectorOpen(false); setSelectorAnchor(null); }}
        PaperProps={{ style: { maxHeight: 320, minWidth: 200 } }}
      >
        {persons.map(p => (
          <MenuItem
            key={p.id}
            selected={p.id === selectedPersonId}
            onClick={() => handlePersonPick(p)}
            style={{ fontFamily: fonts.sans, fontSize: 13 }}
          >
            {p.firstName} {p.lastName}
          </MenuItem>
        ))}
      </Menu>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search placeholder (shell-15) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.paper2,
        border: `1px solid ${colors.line}`,
        borderRadius: 999,
        padding: '4px 12px',
        cursor: 'text',
        minWidth: 160,
      }}>
        <span style={{ fontSize: 12, color: colors.ink4 }}>⌘</span>
        <span style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.ink4,
        }}>
          {t('topbar.search_placeholder')}
        </span>
      </div>

      {/* Avatar + menu (shell-16) */}
      <button
        onClick={handleAvatarClick}
        aria-label="Menu utilisateur"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: 'none',
          background: `linear-gradient(135deg, ${colors.sepia}, ${colors.rust})`,
          color: colors.cream,
          fontFamily: fonts.sans,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {initials}
      </button>

      <Menu
        open={Boolean(avatarAnchor)}
        anchorEl={avatarAnchor}
        onClose={() => setAvatarAnchor(null)}
      >
        <MenuItem onClick={handleEditMode} style={{ fontFamily: fonts.sans, fontSize: 13 }}>
          {t('topbar.edit_mode')}
        </MenuItem>
      </Menu>
    </header>
  );
}
