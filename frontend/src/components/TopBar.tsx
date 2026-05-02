import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { colors, fonts } from '../theme/tokens';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import type { Person } from '../types';

const NAV_ITEMS: { to: string; labelKey: string; end?: boolean }[] = [
  { to: '/',           labelKey: 'nav.arbre',     end: true },
  { to: '/tableau',    labelKey: 'nav.tableau' },
  { to: '/riviere',    labelKey: 'nav.riviere' },
  { to: '/contempler', labelKey: 'nav.contempler' },
  { to: '/atelier',    labelKey: 'nav.atelier' },
];

export default function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { persons, selectedPersonId, onPersonSelect, onOpenEditModal } = useFamilyTreeContext();

  const [selectorAnchor, setSelectorAnchor] = useState<HTMLElement | null>(null);
  const [avatarAnchor, setAvatarAnchor] = useState<HTMLElement | null>(null);

  const selectedPerson = persons.find(p => p.id === selectedPersonId) ?? null;

  const handlePersonPick = (person: Person) => {
    onPersonSelect(person.id);
    setSelectorAnchor(null);
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
    <header style={{
      height: 60,
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: `linear-gradient(${colors.cream}, ${colors.paper})`,
      borderBottom: `1px solid ${colors.line2}`,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
        <span style={{
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontSize: 22,
          color: colors.ink,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          gegedot
        </span>
        <span style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: colors.rust,
          display: 'inline-block',
          marginBottom: 2,
        }} />
      </div>

      {/* Person selector */}
      <button
        onClick={e => setSelectorAnchor(e.currentTarget)}
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.ink2,
          backgroundColor: colors.paper3,
          border: `1px solid ${colors.line}`,
          borderRadius: 3,
          padding: '2px 8px',
          cursor: 'pointer',
          maxWidth: 160,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          flexShrink: 0,
        }}
      >
        {selectedPerson
          ? `${selectedPerson.firstName} ${selectedPerson.lastName}`.toUpperCase()
          : t('topbar.select_person')}
      </button>

      <Menu
        open={Boolean(selectorAnchor)}
        anchorEl={selectorAnchor}
        onClose={() => setSelectorAnchor(null)}
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

      {/* Nav links */}
      <nav style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
      }}>
        {NAV_ITEMS.map(({ to, labelKey, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end ?? false}
            style={({ isActive }) => ({
              fontSize: 13,
              fontFamily: fonts.sans,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? colors.ink : colors.ink3,
              textDecoration: 'none',
              position: 'relative',
              letterSpacing: '0.01em',
              cursor: 'pointer',
            })}
          >
            {({ isActive }) => (
              <>
                {t(labelKey)}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: -2,
                    right: -2,
                    bottom: -21,
                    height: 2,
                    background: colors.ink,
                    borderRadius: 1,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        border: `1px solid ${colors.line2}`,
        borderRadius: 20,
        padding: '5px 12px',
        background: colors.cream,
        fontFamily: fonts.mono,
        fontSize: 11,
        color: colors.ink3,
        minWidth: 180,
        flexShrink: 0,
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={colors.ink3} strokeWidth="1.4">
          <circle cx="5" cy="5" r="3.4" /><path d="M7.5 7.5l2.5 2.5" />
        </svg>
        <span>{t('topbar.search')}</span>
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: 9,
          padding: '1px 5px',
          border: `1px solid ${colors.line2}`,
          borderRadius: 3,
          color: colors.ink4,
        }}>⌘K</span>
      </div>

      {/* Avatar + menu */}
      <button
        onClick={e => setAvatarAnchor(e.currentTarget)}
        aria-label="Menu utilisateur"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: 'none',
          background: `linear-gradient(135deg, ${colors.sepiaLt}, ${colors.sepia})`,
          color: colors.cream,
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontSize: 14,
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
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
