import { useEffect, useState, type ReactNode } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { RouterProvider } from 'react-router-dom';
import FamilyAccessScreen from './components/FamilyAccessScreen';
import { router } from './router';
import { fetchAccessStatus } from './services/familyAccess';
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

type AccessPhase = 'loading' | 'gate' | 'app';

export default function App() {
  const [phase, setPhase] = useState<AccessPhase>('loading');

  useEffect(() => {
    let cancelled = false;
    fetchAccessStatus()
      .then(status => {
        if (cancelled) return;
        if (!status.gateEnabled || status.accessGranted) {
          setPhase('app');
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
        <CircularProgress sx={{ color: colors.sepia }} aria-label="Loading" />
      </Box>
    );
  } else if (phase === 'gate') {
    content = <FamilyAccessScreen onSuccess={() => setPhase('app')} />;
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
