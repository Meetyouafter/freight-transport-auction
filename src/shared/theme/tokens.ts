export const colorTokens = {
  cream: '#FDFBD4',
  beige: '#D9D7B6',
  moss: '#878672',
  olive: '#545333',
  clay: '#A24B14',
  clayDark: '#7E3A0F',
  clayTint: '#F7E7DC',
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
  divider: colorTokens.moss,
} as const

export const shapeTokens = {
  borderRadius: 8,
} as const

export const statusTokens = {
  confirmed: { fill: '#C7E1F9', tint: '#EDF5FC', text: '#0C447C' },
  rising: { fill: '#CDE7AE', tint: '#EFF6E6', text: '#1F4006' },
  waiting: { fill: '#F5D999', tint: '#FBF1DE', text: '#593206' },
  rejected: { fill: '#F5BFBF', tint: '#FCECEC', text: '#791F1F' },
  neutral: { fill: '#DEDACB', tint: '#F1EFE8', text: '#46453F' },
} as const
export type StatusTokenKey = keyof typeof statusTokens

export const cardTokens = {
  participatingBg: '#F2EFC4',
  finishedBg: statusTokens.neutral.tint,
} as const

export const accentTokens = {
  main: colorTokens.clay,
  dark: colorTokens.clayDark,
  tint: colorTokens.clayTint,
  contrastText: '#FFFFFF',
} as const

export const surfaceTokens = {
  cardBorder: 'rgba(84,83,51,0.38)',
  cardBorderHover: 'rgba(84,83,51,0.6)',
  hoverOverlay: 'rgba(84,83,51,0.08)',
  cardShadow: '0 1px 2px rgba(42,42,28,0.08), 0 6px 16px -8px rgba(42,42,28,0.28)',
  cardShadowHover: '0 2px 4px rgba(42,42,28,0.1), 0 12px 24px -10px rgba(42,42,28,0.36)',
} as const

export const spacingTokenBaseUnit = 8
