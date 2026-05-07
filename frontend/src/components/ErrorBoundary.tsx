import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { colors, fonts, spacing } from '../theme/tokens';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          gap={2}
          p={4}
        >
          {/* Remplace MUI Typography variant="h6" color="error" */}
          <p style={{
            margin: 0,
            fontFamily: fonts.serif,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: colors.rust,
            textAlign: 'center',
          }}>
            Une erreur inattendue s'est produite.
          </p>
          {/* Remplace MUI Typography variant="body2" color="text.secondary" */}
          <p style={{
            margin: 0,
            fontFamily: fonts.sans,
            fontSize: 14,
            color: colors.ink3,
            textAlign: 'center',
            maxWidth: spacing[16] * 5,
          }}>
            {this.state.error?.message ?? 'Erreur inconnue'}
          </p>
          <Button variant="contained" onClick={this.handleReset}>
            Réessayer
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
