import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import { colors, fonts } from '../theme/tokens';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import { logoutFamilyAccess, fetchAccessStatus } from '../services/familyAccess';
import { VUE_RIVIERE_ENABLED } from '../config/featureFlags';
import type { Person } from '../types';

// ─── Hook : détection breakpoint via matchMedia ───────────────────────────────

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

const BASE_NAV_ITEMS: { to: string; labelKey: string; end?: boolean }[] = [
  { to: '/',           labelKey: 'nav.arbre',     end: true },
  { to: '/tableau',    labelKey: 'nav.tableau' },
  { to: '/contempler', labelKey: 'nav.contempler' },
  { to: '/atelier',    labelKey: 'nav.atelier' },
];

const NAV_ITEMS: { to: string; labelKey: string; end?: boolean }[] = VUE_RIVIERE_ENABLED
  ? [
      BASE_NAV_ITEMS[0],
      BASE_NAV_ITEMS[1],
      { to: '/riviere', labelKey: 'nav.riviere' },
      ...BASE_NAV_ITEMS.slice(2),
    ]
  : BASE_NAV_ITEMS;

// ─── DropdownMenu ─────────────────────────────────────────────────────────────

interface DropdownItem {
  key: string;
  label: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
}

interface DropdownMenuProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  items: DropdownItem[];
  maxHeight?: number;
  minWidth?: number;
}

function DropdownMenu({ anchorRef, open, onClose, items, maxHeight = 320, minWidth = 200 }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Positionner le dropdown sous le bouton ancre via getBoundingClientRect + position:fixed.
  // M3 : si le dropdown déborde à droite, on le décale pour rester dans le viewport.
  useEffect(() => {
    if (!open || !anchorRef.current) { setPos(null); return; }
    const rect = anchorRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    // Calcul du left en tenant compte du minWidth pour éviter le dépassement à droite
    const rawLeft = rect.left;
    const clampedLeft = Math.min(rawLeft, vw - minWidth - 8);
    setPos({ top: rect.bottom + 4, left: Math.max(0, clampedLeft) });
  }, [open, anchorRef, minWidth]);

  // Fermer sur clic en dehors
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchorRef]);

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !pos) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 1300,
        minWidth,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight,
        overflowY: 'auto',
        backgroundColor: colors.cream,
        border: `1px solid ${colors.line2}`,
        borderRadius: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        padding: '4px 0',
      }}
    >
      {items.map(item => (
        <div
          key={item.key}
          role="menuitem"
          tabIndex={0}
          onClick={() => { item.onClick(); onClose(); }}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { item.onClick(); onClose(); } }}
          style={{
            padding: '7px 16px',
            fontFamily: fonts.sans,
            fontSize: 13,
            color: item.selected ? colors.ink : colors.ink2,
            backgroundColor: item.selected ? colors.paper2 : 'transparent',
            cursor: 'pointer',
            userSelect: 'none',
            outline: 'none',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = colors.paper2; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = item.selected ? colors.paper2 : 'transparent'; }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

export default function TopBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { persons, selectedPersonId, onPersonSelect, onOpenEditModal } = useFamilyTreeContext();

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gateEnabled, setGateEnabled] = useState(false);

  useEffect(() => {
    fetchAccessStatus().then(s => setGateEnabled(s.gateEnabled)).catch(() => {});
  }, []);

  const isMobile     = useMediaQuery('(max-width: 767px)');  // M1 : hamburger
  const isNarrow     = useMediaQuery('(max-width: 599px)');  // M2 : masquer search

  const selectorBtnRef = useRef<HTMLButtonElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  const selectedPerson = persons.find(p => p.id === selectedPersonId) ?? null;

  const handlePersonPick = useCallback((person: Person) => {
    onPersonSelect(person.id);
    setSelectorOpen(false);
  }, [onPersonSelect]);

  const handleEditMode = useCallback(() => {
    setAvatarOpen(false);
    onOpenEditModal();
    navigate('/admin');
  }, [onOpenEditModal, navigate]);

  const initials = selectedPerson
    ? (selectedPerson.firstName?.[0] ?? '') + (selectedPerson.lastName?.[0] ?? '')
    : 'Y';

  const selectorItems: DropdownItem[] = persons.map(p => ({
    key: String(p.id),
    label: `${p.firstName} ${p.lastName}`,
    selected: p.id === selectedPersonId,
    onClick: () => handlePersonPick(p),
  }));

  const handleFamilyLogout = useCallback(() => {
    setAvatarOpen(false);
    void logoutFamilyAccess().finally(() => {
      window.location.reload();
    });
  }, []);

  const avatarItems: DropdownItem[] = [
    {
      key: 'edit-mode',
      label: t('topbar.edit_mode'),
      onClick: handleEditMode,
    },
    ...(gateEnabled ? [{
      key: 'family-logout',
      label: t('topbar.family_logout'),
      onClick: handleFamilyLogout,
    }] : []),
  ];

  return (
    <>
      <header style={{
        height: 60,
        padding: isNarrow ? '0 12px' : '0 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: `linear-gradient(${colors.cream}, ${colors.paper})`,
        borderBottom: `1px solid ${colors.line2}`,
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Logo — shell-10bis */}
        <img
          src="/brand/yeboekun-wordmark.svg"
          alt="Yeboekun"
          style={{ height: 22, width: 101, display: 'block', marginLeft: 16, flexShrink: 0 }}
        />

        {/* Person selector */}
        <button
          ref={selectorBtnRef}
          onClick={() => setSelectorOpen(o => !o)}
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.ink2,
            backgroundColor: colors.paper3,
            border: `1px solid ${colors.line}`,
            borderRadius: 3,
            padding: '2px 8px',
            cursor: 'pointer',
            maxWidth: isNarrow ? 120 : 160,
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

        <DropdownMenu
          anchorRef={selectorBtnRef}
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          items={selectorItems}
          maxHeight={320}
          minWidth={200}
        />

        {/* Nav links — masquées sous 768px (M1) */}
        <nav style={{
          flex: 1,
          display: isMobile ? 'none' : 'flex',
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

        {/* Spacer pour pousser search + avatar à droite (desktop) */}
        {!isMobile && <span style={{ flex: isMobile ? 1 : 0 }} />}
        {isMobile && <span style={{ flex: 1 }} />}

        {/* Search — masquée sous 600px (M2) */}
        {!isNarrow && (
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
        )}

        {/* Avatar + menu */}
        <button
          ref={avatarBtnRef}
          onClick={() => setAvatarOpen(o => !o)}
          aria-label={t('topbar.user_menu')}
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

        <DropdownMenu
          anchorRef={avatarBtnRef}
          open={avatarOpen}
          onClose={() => setAvatarOpen(false)}
          items={avatarItems}
          minWidth={160}
        />

        {/* Hamburger — visible uniquement sous 768px (M1) */}
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label={t('topbar.open_menu')}
            aria-expanded={drawerOpen}
            style={{
              width: 36,
              height: 36,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: 0,
              flexShrink: 0,
            }}
          >
            {/* Trois barres du hamburger */}
            {[0, 1, 2].map(i => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  display: 'block',
                  width: 20,
                  height: 2,
                  background: colors.ink,
                  borderRadius: 1,
                }}
              />
            ))}
          </button>
        )}
      </header>

      {/* Drawer mobile — M1 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          style: {
            width: 260,
            backgroundColor: colors.cream,
            padding: '24px 0',
          },
        }}
      >
        <nav aria-label={t('topbar.mobile_nav')}>
          {NAV_ITEMS.map(({ to, labelKey, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end ?? false}
              onClick={() => setDrawerOpen(false)}
              style={({ isActive }) => ({
                display: 'block',
                padding: '12px 24px',
                fontFamily: fonts.sans,
                fontSize: 15,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? colors.ink : colors.ink3,
                textDecoration: 'none',
                borderLeft: isActive ? `3px solid ${colors.ink}` : '3px solid transparent',
                backgroundColor: isActive ? colors.paper2 : 'transparent',
              })}
            >
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </>
  );
}
