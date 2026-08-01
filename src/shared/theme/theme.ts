import { createTheme } from '@mui/material/styles'
import { paletteTokens, shapeTokens, spacingTokenBaseUnit } from './tokens'

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
          transition: 'background-color 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
        },
        contained: {
          '&:hover': {
            backgroundColor: paletteTokens.primary.dark,
            boxShadow:
              '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(84,83,51,0.08)',
            borderColor: paletteTokens.primary.main,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(84,83,51,0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(84,83,51,0.24)',
        },
      },
    },
  },
})
