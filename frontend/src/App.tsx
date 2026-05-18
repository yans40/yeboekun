import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { RouterProvider } from 'react-router-dom';
import FamilyAccessScreen from './components/FamilyAccessScreen';
import WelcomeView from './views/WelcomeView';
import { router } from './router';
import { fetchAccessStatus } from './services/familyAccess';
import { WELCOME_ENABLED } from './config/featureFlags';
import { colors, fonts, radius } from './theme/tokens';

const theme = createTheme({
  palette: {
    primary:    { main: colors.sepia },
    secondary:  { main: colors.ink },
    background: { default: colors.paper, paper: colors.paper2 },
  },
  typography: {
    fontFamily: fonts.sans,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.paper,
          fontFamily: fonts.sans,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontFamily: fonts.sans },
        containedPrimary: { backgroundColor: colors.sepia, color: colors.cream },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg,
          backgroundColor: colors.paper,
        },
      },
    },
    MuiChip: {
      variants: [
        { props: { variant: 'filled' },  style: { backgroundColor: colors.paper2, color: colors.ink2 } },
        { props: { variant: 'outlined' }, style: { borderColor: colors.line, color: colors.ink3 } },
      ],
    },
  },
});

type AccessPhase = 'loading' | 'gate' | 'welcome' | 'app';

export default function App() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<AccessPhase>('loading');

  useEffect(() => {
    let cancelled = false;
    fetchAccessStatus()
      .then(status => {
        if (cancelled) return;
        if (!status.gateEnabled || status.accessGranted) {
          setPhase(WELCOME_ENABLED ? 'welcome' : 'app');
        } else {
          setPhase('gate');
        }
      })
      .catch(() => {
        // Pas d'API (preview CI, réseau) : on affiche l'app ; le backend refusera les données si le garde-fou est actif.
        if (!cancelled) setPhase('app');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  let content: ReactNode;
  if (phase === 'loading') {
    content = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: colors.paper,
        }}
      >
        <CircularProgress
          sx={{ color: colors.sepia }}
          aria-label={t('family_access.loading_status')}
          role="status"
        />
      </Box>
    );
  } else if (phase === 'gate') {
    content = <FamilyAccessScreen onSuccess={() => setPhase(WELCOME_ENABLED ? 'welcome' : 'app')} />;
  } else if (phase === 'welcome') {
    content = (
      <WelcomeView
        onEnter={(personId) => {
          if (personId !== null) {
            try { sessionStorage.setItem('yeboekun_welcome_selection', String(personId)); } catch { /* storage blocked */ }
          }
          setPhase('app');
        }}
      />
    );
  } else {
    content = <RouterProvider router={router} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {content}
    </ThemeProvider>
  );
}
