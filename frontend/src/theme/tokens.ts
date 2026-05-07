export const colors = {
  paper:   '#f4efe6',
  paper2:  '#ece5d6',
  paper3:  '#e4dbc8',
  cream:   '#fdf9f2',
  ink:     '#1a1410',
  ink2:    '#3d2f1e',
  ink3:    '#7a6048',
  ink4:    '#a89070',
  line:    '#cabfa6',
  line2:   '#ddd2b8',
  sepia:   '#7d5a36',
  sepiaLt: '#b8936a',
  rust:    '#c45c3a',
  olive:   '#7c8b3e',
  forest:  '#3d6b4f',
  ocean:   '#3a6b8a',
  gold:    '#c9a227',
} as const;

export const fonts = {
  serif: '"Cormorant Garamond", Georgia, serif',
  sans:  '"Geist", system-ui, sans-serif',
  mono:  '"Geist Mono", "Courier New", monospace',
  hand:  '"Caveat", cursive',
} as const;

export const spacing = {
  1:  4,
  2:  8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  xs:     2,
  sm:     4,
  md:     8,
  lg:    12,
  pill:  999,
  circle: '50%',
} as const;

export const shadows = {
  xs: '0 1px 2px rgba(0,0,0,0.04)',
  sm: '0 2px 4px rgba(0,0,0,0.06)',
  md: '0 4px 8px rgba(0,0,0,0.08)',
  lg: '0 8px 16px rgba(0,0,0,0.10)',
  xl: '0 16px 32px rgba(0,0,0,0.12)',
} as const;
