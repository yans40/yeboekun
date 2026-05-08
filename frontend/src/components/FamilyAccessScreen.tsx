import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { verifyFamilyPassword } from '../services/familyAccess';
import { colors, fonts } from '../theme/tokens';

interface FamilyAccessScreenProps {
  onSuccess: () => void;
}

export default function FamilyAccessScreen({ onSuccess }: FamilyAccessScreenProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyFamilyPassword(password);
      onSuccess();
    } catch {
      setError(t('family_access.wrong_password'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        backgroundColor: colors.paper,
      }}
    >
      <img
        src="/brand/yeboekun-wordmark.svg"
        alt="Yeboekun"
        style={{ height: 28, width: 'auto', marginBottom: 32 }}
      />
      <Typography
        component="h1"
        sx={{
          fontFamily: fonts.serif,
          fontSize: { xs: '1.35rem', sm: '1.5rem' },
          fontWeight: 500,
          color: colors.ink,
          textAlign: 'center',
          maxWidth: 360,
          mb: 1,
        }}
      >
        {t('family_access.title')}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: 14,
          color: colors.ink3,
          textAlign: 'center',
          maxWidth: 400,
          mb: 3,
          lineHeight: 1.5,
        }}
      >
        {t('family_access.subtitle')}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          type="password"
          label={t('family_access.password_label')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          fullWidth
          error={Boolean(error)}
          helperText={error}
          disabled={submitting}
        />
        <Button type="submit" variant="contained" color="primary" disabled={submitting} size="large">
          {submitting ? t('family_access.submitting') : t('family_access.submit')}
        </Button>
      </Box>
    </Box>
  );
}
