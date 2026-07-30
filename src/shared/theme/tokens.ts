/**
 * Design tokens derived from the "Old photograph" palette.
 * These are the single source of truth for color values in the app —
 * never hardcode hex values in components, reference tokens or the MUI theme instead.
 */
export const colorTokens = {
  cream: '#FDFBD4',
  beige: '#D9D7B6',
  moss: '#878672',
  olive: '#545333',
} as const

export const paletteTokens = {
  primary: {
    main: colorTokens.olive,
    light: colorTokens.moss,
    dark: '#3a3924',
    contrastText: colorTokens.cream,
  },
  secondary: {
    main: colorTokens.moss,
    light: colorTokens.beige,
    dark: colorTokens.olive,
    contrastText: '#1f1f14',
  },
  background: {
    default: colorTokens.cream,
    paper: '#ffffff',
  },
  text: {
    primary: '#2a2a1c',
    secondary: colorTokens.olive,
  },
} as const

export const shapeTokens = {
  borderRadius: 8,
} as const

export const spacingTokenBaseUnit = 8
