import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
