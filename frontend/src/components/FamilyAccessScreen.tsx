import { useEffect, useId, useRef, useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { classifyVerifyPasswordError, verifyFamilyPassword } from '../services/familyAccess';
import { colors, fonts, radius } from '../theme/tokens';

interface FamilyAccessScreenProps {
  onSuccess: () => void;
}

/** Gate d'entrée : seuil minimal (5 blocs visibles). L'explication longue vit dans le lien d'aide, pas ici. */
export default function FamilyAccessScreen({ onSuccess }: FamilyAccessScreenProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const passwordInputId = useId();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (error) {
      passwordRef.current?.focus();
    }
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(t('family_access.password_required'));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await verifyFamilyPassword(password);
      onSuccess();
    } catch (err) {
      const kind = classifyVerifyPasswordError(err);
      if (kind === 'unauthorized') {
        setError(t('family_access.wrong_password'));
      } else if (kind === 'network') {
        setError(t('family_access.network_error'));
      } else {
        setError(t('family_access.generic_error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="main"
      aria-labelledby={titleId}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 3,
        backgroundColor: colors.paper,
      }}
    >
      <img
        src="/brand/yeboekun-wordmark.svg"
        alt=""
        aria-hidden
        style={{ height: 28, width: 'auto', marginBottom: 12 }}
      />
      <Typography
        component="p"
        sx={{
          fontFamily: fonts.serif,
          fontSize: 13,
          fontStyle: 'italic',
          color: colors.ink3,
          textAlign: 'center',
          letterSpacing: '0.02em',
          mb: 2,
        }}
      >
        {t('family_access.tagline')}
      </Typography>
      <Typography
        id={titleId}
        component="h1"
        sx={{
          fontFamily: fonts.serif,
          fontSize: { xs: '1.35rem', sm: '1.55rem' },
          fontWeight: 500,
          color: colors.ink,
          textAlign: 'center',
          maxWidth: 420,
          mb: 3,
        }}
      >
        {t('family_access.title')}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: '100%',
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          id={passwordInputId}
          inputRef={passwordRef}
          type="password"
          name="family-access-password"
          label={t('family_access.password_label')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          fullWidth
          error={Boolean(error)}
          helperText={error}
          disabled={submitting}
          inputProps={{
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? `${passwordInputId}-helper-text` : titleId,
          }}
          FormHelperTextProps={
            error
              ? {
                  id: `${passwordInputId}-helper-text`,
                  role: 'alert',
                }
              : { id: `${passwordInputId}-helper-text` }
          }
        />
        <Button type="submit" variant="contained" color="primary" disabled={submitting} size="large">
          {submitting ? t('family_access.submitting') : t('family_access.submit')}
        </Button>
      </Box>

      <Link
        component="button"
        type="button"
        underline="hover"
        onClick={() => setHelpOpen(true)}
        sx={{
          mt: 3,
          fontFamily: fonts.sans,
          fontSize: 12,
          color: colors.ink4,
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          padding: 0,
        }}
      >
        {t('family_access.help_link')}
      </Link>

      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        aria-labelledby="family-access-help-title"
        PaperProps={{
          sx: {
            borderRadius: radius.lg,
            backgroundColor: colors.paper,
          },
        }}
      >
        <DialogTitle id="family-access-help-title" sx={{ fontFamily: fonts.serif }}>
          {t('family_access.help_title')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink2, lineHeight: 1.55 }}>
            {t('family_access.help_body')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setHelpOpen(false)} color="primary">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
