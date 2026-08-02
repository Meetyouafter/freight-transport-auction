import { createTheme } from '@mui/material/styles'
import {
  accentTokens,
  paletteTokens,
  shapeTokens,
  spacingTokenBaseUnit,
  surfaceTokens,
} from './tokens'

export const theme = createTheme({
  palette: {
    mode: 'light',
    ...paletteTokens,
  },
  shape: {
    borderRadius: shapeTokens.borderRadius,
  },
  spacing: spacingTokenBaseUnit,
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          transition: 'background-color 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
        },
        contained: {
          backgroundColor: accentTokens.main,
          color: accentTokens.contrastText,
          boxShadow: surfaceTokens.cardShadow,
          '&:hover': {
            backgroundColor: accentTokens.dark,
            boxShadow: surfaceTokens.cardShadowHover,
          },
        },
        outlined: {
          borderColor: paletteTokens.primary.main,
          color: paletteTokens.primary.main,
          '&:hover': {
            backgroundColor: surfaceTokens.hoverOverlay,
            borderColor: paletteTokens.primary.dark,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: surfaceTokens.hoverOverlay,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: surfaceTokens.cardBorder,
        },
      },
    },
  },
})
