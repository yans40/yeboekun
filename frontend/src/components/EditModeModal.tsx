import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { colors, fonts, radius, spacing } from '../theme/tokens';

// ─── NativeButton ─────────────────────────────────────────────────────────────

type BtnVariant = 'contained' | 'outlined' | 'text';

interface NativeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  color?: 'primary' | 'error';
}

function NativeBtn({ variant = 'text', color = 'primary', style, children, ...rest }: NativeBtnProps) {
  const accent = color === 'error' ? colors.rust : colors.ocean;

  const base: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        `${spacing[2]}px ${spacing[4]}px`,
    fontFamily:     fonts.sans,
    fontSize:       14,
    fontWeight:     500,
    borderRadius:   radius.sm,
    cursor:         'pointer',
    transition:     'background 150ms ease, opacity 150ms ease',
    lineHeight:     1.5,
    whiteSpace:     'nowrap',
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    contained: { backgroundColor: accent, color: colors.cream, border: 'none' },
    outlined:  { backgroundColor: 'transparent', color: accent, border: `1px solid ${accent}` },
    text:      { backgroundColor: 'transparent', color: accent, border: 'none' },
  };

  const disabledStyle: React.CSSProperties = rest.disabled
    ? { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }
    : {};

  return (
    <button {...rest} style={{ ...base, ...variants[variant], ...disabledStyle, ...style }}>
      {children}
    </button>
  );
}

// ─── EditModeModal ────────────────────────────────────────────────────────────

interface EditModeModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const EditModeModal: React.FC<EditModeModalProps> = ({ open, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const ok = onLogin(password);
    if (ok) {
      setPassword('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Mode édition</DialogTitle>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <DialogContent>
          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                marginBottom: spacing[2],
                padding: `${spacing[2]}px ${spacing[3]}px`,
                backgroundColor: '#fef2f2',
                border: `1px solid ${colors.rust}`,
                borderRadius: radius.md,
                color: colors.rust,
                fontFamily: fonts.sans,
                fontSize: 14,
              }}
            >
              <span style={{ fontWeight: 700 }}>✕</span>
              Mot de passe incorrect
            </div>
          )}
          <TextField
            autoFocus
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <NativeBtn type="button" onClick={handleClose}>Annuler</NativeBtn>
          <NativeBtn type="submit" variant="contained">Connexion</NativeBtn>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditModeModal;
