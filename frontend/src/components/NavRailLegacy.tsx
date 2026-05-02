import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { colors, fonts } from '../theme/tokens';

const NAV_ITEMS = [
  { to: '/',          label: 'nav.label_ar', icon: '🌳' },
  { to: '/tableau',   label: 'nav.label_tb', icon: '📊' },
  { to: '/contempler',label: 'nav.label_ct', icon: '🔮' },
  { to: '/riviere',   label: 'nav.label_rv', icon: '🌊' },
  { to: '/atelier',   label: 'nav.label_at', icon: '✏️'  },
] as const;

const RAIL_W = 72;

const railStyle: React.CSSProperties = {
  width: RAIL_W,
  minWidth: RAIL_W,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: colors.paper2,
  borderRight: `1px solid ${colors.line}`,
  flexShrink: 0,
};

const logoStyle: React.CSSProperties = {
  fontFamily: fonts.serif,
  fontStyle: 'italic',
  fontSize: 24,
  color: colors.sepia,
  marginTop: 16,
  marginBottom: 8,
  userSelect: 'none',
};

export default function NavRail() {
  const { t } = useTranslation();

  return (
    <nav style={railStyle} aria-label="Navigation principale">
      <span style={logoStyle}>{t('nav.logo')}</span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', paddingTop: 8 }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              height: 56,
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(125,90,54,0.10)' : 'transparent',
              borderLeft: isActive ? `2px solid ${colors.sepia}` : '2px solid transparent',
              color: isActive ? colors.ink2 : colors.ink4,
              cursor: 'pointer',
              transition: 'background-color 0.15s, color 0.15s',
            })}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{
              fontFamily: fonts.mono,
              fontSize: 9,
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}>
              {t(label)}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
