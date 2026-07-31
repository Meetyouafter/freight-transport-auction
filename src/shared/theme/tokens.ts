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

/**
 * Semantic status colors for badges (auction/trading status). `fill` is used for the solid
 * (primary) badge, `tint` is a lighter wash of the same hue for the outline (secondary) badges —
 * kept distinct per status so badges stay tellable apart even without the solid fill. `text` is
 * the matching dark tone, shared by both, for AA contrast.
 * Not part of the 4-color brand palette above — these carry meaning (state), not brand identity.
 */
export const statusTokens = {
  confirmed: { fill: '#C7E1F9', tint: '#EDF5FC', text: '#0C447C' },
  rising: { fill: '#CDE7AE', tint: '#EFF6E6', text: '#1F4006' },
  waiting: { fill: '#F5D999', tint: '#FBF1DE', text: '#593206' },
  rejected: { fill: '#F5BFBF', tint: '#FCECEC', text: '#791F1F' },
  neutral: { fill: '#DEDACB', tint: '#F1EFE8', text: '#46453F' },
} as const
export type StatusTokenKey = keyof typeof statusTokens

/** Auction card background when the current user has placed a bid — a couple of tones darker than the default cream. */
export const cardTokens = {
  participatingBg: '#F2EFC4',
} as const

export const spacingTokenBaseUnit = 8
