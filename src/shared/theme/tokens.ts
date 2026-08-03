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

/** Colours of a status badge: `bg` fills the solid tone, `tint` the outline one. */
export interface BadgePalette {
  text: string
  bg: string
  /** Muted fill for the outline tone — falls back to `bg` when a palette has no tint. */
  tint?: string
}

/** Semantic badge palette — how something is going, regardless of which entity it describes. */
export const statusTokens = {
  confirmed: { bg: '#C7E1F9', tint: '#EDF5FC', text: '#0C447C' },
  rising: { bg: '#CDE7AE', tint: '#EFF6E6', text: '#1F4006' },
  waiting: { bg: '#F5D999', tint: '#FBF1DE', text: '#593206' },
  rejected: { bg: '#F5BFBF', tint: '#FCECEC', text: '#791F1F' },
  neutral: { bg: '#DEDACB', tint: '#F1EFE8', text: '#46453F' },
} as const
export type StatusTokenKey = keyof typeof statusTokens

/**
 * One distinct pair per auction lifecycle status. The semantic palette above only has five tones,
 * so it had to double up statuses; here every status is told apart by colour alone.
 * Keys mirror `AuctionStatus` — `shared` cannot import the entity, so they are spelled out.
 */
export const auctionStatusTokens = {
  Planning: { text: '#5B6472', bg: '#E4E7EB' },
  Auction: { text: '#1D5FCC', bg: '#DCE8FF' },
  DeterminateWinner: { text: '#7A34C9', bg: '#EBE0FA' },
  WaitDeal: { text: '#9C5800', bg: '#FCEACB' },
  InProgress: { text: '#0B6459', bg: '#D7F1EA' },
  Finished: { text: '#187A42', bg: '#DCF3E4' },
  Stopped: { text: '#9A4A15', bg: '#F7E2CE' },
  Canceled: { text: '#C22A2A', bg: '#FBDFDF' },
  /** Parse fallback, not a real state — borrows the neutral grey of `Planning`. */
  Unknown: { text: '#5B6472', bg: '#E4E7EB' },
} as const

export const cardTokens = {
  participatingBg: '#F2EFC4',
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
