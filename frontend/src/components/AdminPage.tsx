import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';

// ─── NativeButton ─────────────────────────────────────────────────────────────

type BtnVariant = 'contained' | 'outlined' | 'text';

interface NativeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  color?: 'primary' | 'error';
}

function NativeBtn({ variant = 'text', color = 'primary', style, children, ...rest }: NativeBtnProps) {
  const accent    = color === 'error' ? colors.rust : colors.ocean;
  const accentDark = color === 'error' ? '#a34527' : '#2d5470';

  const base: React.CSSProperties = {
    display:      'inline-flex',
    alignItems:   'center',
    justifyContent: 'center',
    gap:          spacing[1],
    padding:      `${spacing[2]}px ${spacing[4]}px`,
    fontFamily:   fonts.sans,
    fontSize:     14,
    fontWeight:   500,
    borderRadius: radius.sm,
    cursor:       'pointer',
    transition:   'background 150ms ease, opacity 150ms ease',
    lineHeight:   1.5,
    whiteSpace:   'nowrap',
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    contained: {
      backgroundColor: accent,
      color:           colors.cream,
      border:          'none',
    },
    outlined: {
      backgroundColor: 'transparent',
      color:           accent,
      border:          `1px solid ${accent}`,
    },
    text: {
      backgroundColor: 'transparent',
      color:           accent,
      border:          'none',
    },
  };

  const disabledStyle: React.CSSProperties = rest.disabled
    ? { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }
    : {};

  return (
    <button
      {...rest}
      style={{ ...base, ...variants[variant], ...disabledStyle, ...style }}
    >
      {children}
    </button>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canEdit, onExitEditMode } = useFamilyTreeContext();

  const handleExit = () => {
    onExitEditMode();
    navigate('/');
  };

  if (!canEdit) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backgroundColor: colors.paper,
      }}>
        <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 24, color: colors.ink3 }}>
          {t('admin.title')}
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.ink4 }}>
          {t('admin.access_restricted')}
        </span>
        <NativeBtn variant="outlined" onClick={() => navigate('/')}>
          {t('common.back')}
        </NativeBtn>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      backgroundColor: colors.paper,
    }}>
      <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 32, color: colors.ink2 }}>
        {t('admin.title')}
      </span>
      <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.forest }}>
        {t('admin.edit_mode_active')}
      </span>
      <NativeBtn variant="contained" onClick={handleExit}>
        {t('admin.exit_edit_mode')}
      </NativeBtn>
    </div>
  );
}
